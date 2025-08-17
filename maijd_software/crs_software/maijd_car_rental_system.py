#!/usr/bin/env python3
"""
Maijd Car Rental System
Comprehensive car rental management and booking system
"""

import os
import sys
import json
import sqlite3
import logging
import threading
import time
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from pathlib import Path
import hashlib
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class Car:
    """Car data structure"""
    car_id: str
    license_plate: str
    make: str
    model: str
    year: int
    color: str
    category: str  # economy, compact, midsize, fullsize, luxury, suv, van
    transmission: str  # automatic, manual
    fuel_type: str  # gasoline, diesel, electric, hybrid
    mileage: int
    daily_rate: float
    weekly_rate: float
    monthly_rate: float
    location: str
    status: str  # available, rented, maintenance, out_of_service
    features: List[str]
    insurance_info: Dict[str, Any]
    last_maintenance: str
    next_maintenance: str

@dataclass
class CarRental:
    """Car rental data structure"""
    rental_id: str
    car_id: str
    customer_id: str
    pickup_date: str
    return_date: str
    pickup_location: str
    return_location: str
    daily_rate: float
    total_days: int
    total_cost: float
    deposit_amount: float
    status: str  # confirmed, active, completed, cancelled
    rental_date: str
    payment_status: str
    insurance_coverage: str
    additional_drivers: int
    mileage_limit: int
    actual_mileage: Optional[int]
    fuel_level_pickup: str
    fuel_level_return: Optional[str]
    agent_id: Optional[str]
    confirmation_number: str

@dataclass
class Customer:
    """Customer data structure"""
    customer_id: str
    first_name: str
    last_name: str
    email: str
    phone: str
    address: str
    date_of_birth: str
    driver_license: str
    license_expiry: str
    credit_card_info: Dict[str, Any]
    loyalty_points: int
    rental_history: List[str]
    status: str  # active, suspended, blacklisted

class MaijdCarRentalSystem:
    """Comprehensive car rental management and booking system"""
    
    def __init__(self):
        self.system_name = "Maijd Car Rental System"
        self.version = "2.0.0"
        self.database_path = None
        self.conn = None
        self.cursor = None
        
        # Initialize system components
        self.init_database()
        self.load_configuration()
        self.initialize_rental_services()
        
        # Start background services
        self.start_background_services()
        
        logger.info(f"{self.system_name} v{self.version} initialized successfully")
    
    def init_database(self):
        """Initialize SQLite database with car rental tables"""
        try:
            self.database_path = Path("car_rental.db")
            self.conn = sqlite3.connect(str(self.database_path))
            self.cursor = self.conn.cursor()
            
            # Create tables
            self.cursor.executescript("""
                CREATE TABLE IF NOT EXISTS cars (
                    car_id TEXT PRIMARY KEY,
                    license_plate TEXT UNIQUE NOT NULL,
                    make TEXT NOT NULL,
                    model TEXT NOT NULL,
                    year INTEGER,
                    color TEXT,
                    category TEXT,
                    transmission TEXT,
                    fuel_type TEXT,
                    mileage INTEGER,
                    daily_rate REAL,
                    weekly_rate REAL,
                    monthly_rate REAL,
                    location TEXT,
                    status TEXT,
                    features TEXT,
                    insurance_info TEXT,
                    last_maintenance TEXT,
                    next_maintenance TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE TABLE IF NOT EXISTS car_rentals (
                    rental_id TEXT PRIMARY KEY,
                    car_id TEXT,
                    customer_id TEXT,
                    pickup_date TEXT,
                    return_date TEXT,
                    pickup_location TEXT,
                    return_location TEXT,
                    daily_rate REAL,
                    total_days INTEGER,
                    total_cost REAL,
                    deposit_amount REAL,
                    status TEXT,
                    rental_date TEXT,
                    payment_status TEXT,
                    insurance_coverage TEXT,
                    additional_drivers INTEGER,
                    mileage_limit INTEGER,
                    actual_mileage INTEGER,
                    fuel_level_pickup TEXT,
                    fuel_level_return TEXT,
                    agent_id TEXT,
                    confirmation_number TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (car_id) REFERENCES cars (car_id)
                );
                
                CREATE TABLE IF NOT EXISTS customers (
                    customer_id TEXT PRIMARY KEY,
                    first_name TEXT,
                    last_name TEXT,
                    email TEXT UNIQUE,
                    phone TEXT,
                    address TEXT,
                    date_of_birth TEXT,
                    driver_license TEXT UNIQUE,
                    license_expiry TEXT,
                    credit_card_info TEXT,
                    loyalty_points INTEGER DEFAULT 0,
                    rental_history TEXT,
                    status TEXT DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE TABLE IF NOT EXISTS rental_agents (
                    agent_id TEXT PRIMARY KEY,
                    first_name TEXT,
                    last_name TEXT,
                    email TEXT UNIQUE,
                    phone TEXT,
                    commission_rate REAL DEFAULT 0.10,
                    status TEXT DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE TABLE IF NOT EXISTS maintenance_records (
                    record_id TEXT PRIMARY KEY,
                    car_id TEXT,
                    maintenance_type TEXT,
                    description TEXT,
                    cost REAL,
                    date_performed TEXT,
                    next_maintenance_date TEXT,
                    technician TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (car_id) REFERENCES cars (car_id)
                );
            """)
            
            self.conn.commit()
            logger.info("Car Rental System database initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize database: {e}")
            raise
    
    def load_configuration(self):
        """Load system configuration"""
        self.config = {
            'rental_limits': {
                'min_rental_days': 1,
                'max_rental_days': 90,
                'min_age': 21,
                'max_age': 75
            },
            'pricing': {
                'deposit_multiplier': 2.0,
                'late_return_fee': 25.0,
                'additional_driver_fee': 15.0,
                'fuel_service_fee': 50.0
            },
            'insurance': {
                'basic_coverage': 15.0,
                'premium_coverage': 25.0,
                'full_coverage': 35.0
            },
            'loyalty_program': {
                'bronze_threshold': 0,
                'silver_threshold': 1000,
                'gold_threshold': 5000,
                'platinum_threshold': 10000
            }
        }
        logger.info("Configuration loaded successfully")
    
    def initialize_rental_services(self):
        """Initialize rental service providers and integrations"""
        self.rental_services = {
            'payment_gateways': ['stripe', 'paypal', 'square'],
            'insurance_providers': ['allstate', 'geico', 'progressive'],
            'maintenance_services': ['jiffy_lube', 'firestone', 'goodyear'],
            'fuel_services': ['shell', 'exxon', 'bp']
        }
        logger.info("Rental services initialized")
    
    def start_background_services(self):
        """Start background monitoring and processing services"""
        # Maintenance monitoring service
        self.maintenance_monitor_thread = threading.Thread(
            target=self._maintenance_monitoring_service,
            daemon=True
        )
        self.maintenance_monitor_thread.start()
        
        # Availability monitoring service
        self.availability_monitor_thread = threading.Thread(
            target=self._availability_monitoring_service,
            daemon=True
        )
        self.availability_monitor_thread.start()
        
        # Notification processing service
        self.notification_thread = threading.Thread(
            target=self._notification_processing_service,
            daemon=True
        )
        self.notification_thread.start()
        
        logger.info("Background services started")
    
    def add_car(self, car_data: Dict[str, Any]) -> str:
        """Add a new car to the fleet"""
        try:
            car_id = str(uuid.uuid4())
            car_data['car_id'] = car_id
            car_data['features'] = json.dumps(car_data.get('features', []))
            car_data['insurance_info'] = json.dumps(car_data.get('insurance_info', {}))
            
            self.cursor.execute("""
                INSERT INTO cars (
                    car_id, license_plate, make, model, year, color, category,
                    transmission, fuel_type, mileage, daily_rate, weekly_rate,
                    monthly_rate, location, status, features, insurance_info,
                    last_maintenance, next_maintenance
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                car_data['car_id'], car_data['license_plate'], car_data['make'],
                car_data['model'], car_data['year'], car_data['color'],
                car_data['category'], car_data['transmission'], car_data['fuel_type'],
                car_data['mileage'], car_data['daily_rate'], car_data['weekly_rate'],
                car_data['monthly_rate'], car_data['location'], car_data['status'],
                car_data['features'], car_data['insurance_info'],
                car_data['last_maintenance'], car_data['next_maintenance']
            ))
            
            self.conn.commit()
            logger.info(f"Car {car_data['make']} {car_data['model']} added successfully")
            return car_id
            
        except Exception as e:
            logger.error(f"Failed to add car: {e}")
            raise
    
    def add_customer(self, customer_data: Dict[str, Any]) -> str:
        """Add a new customer to the system"""
        try:
            customer_id = str(uuid.uuid4())
            customer_data['customer_id'] = customer_id
            customer_data['credit_card_info'] = json.dumps(customer_data.get('credit_card_info', {}))
            customer_data['rental_history'] = json.dumps([])
            
            self.cursor.execute("""
                INSERT INTO customers (
                    customer_id, first_name, last_name, email, phone, address,
                    date_of_birth, driver_license, license_expiry, credit_card_info,
                    loyalty_points, rental_history, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                customer_data['customer_id'], customer_data['first_name'],
                customer_data['last_name'], customer_data['email'], customer_data['phone'],
                customer_data['address'], customer_data['date_of_birth'],
                customer_data['driver_license'], customer_data['license_expiry'],
                customer_data['credit_card_info'], customer_data['loyalty_points'],
                customer_data['rental_history'], customer_data['status']
            ))
            
            self.conn.commit()
            logger.info(f"Customer {customer_data['first_name']} {customer_data['last_name']} added successfully")
            return customer_id
            
        except Exception as e:
            logger.error(f"Failed to add customer: {e}")
            raise
    
    def create_car_rental(self, rental_data: Dict[str, Any]) -> str:
        """Create a new car rental"""
        try:
            # Validate rental data
            if not self._validate_rental(rental_data):
                raise ValueError("Invalid rental data")
            
            rental_id = str(uuid.uuid4())
            confirmation_number = self._generate_confirmation_number()
            
            # Calculate total days and cost
            pickup_date = datetime.strptime(rental_data['pickup_date'], '%Y-%m-%d')
            return_date = datetime.strptime(rental_data['return_date'], '%Y-%m-%d')
            total_days = (return_date - pickup_date).days
            
            # Get car daily rate
            self.cursor.execute("SELECT daily_rate FROM cars WHERE car_id = ?", (rental_data['car_id'],))
            car_rate = self.cursor.fetchone()
            if not car_rate:
                raise ValueError("Car not found")
            
            daily_rate = car_rate[0]
            total_cost = daily_rate * total_days
            deposit_amount = total_cost * self.config['pricing']['deposit_multiplier']
            
            rental_data['rental_id'] = rental_id
            rental_data['confirmation_number'] = confirmation_number
            rental_data['status'] = 'confirmed'
            rental_data['payment_status'] = 'pending'
            rental_data['daily_rate'] = daily_rate
            rental_data['total_days'] = total_days
            rental_data['total_cost'] = total_cost
            rental_data['deposit_amount'] = deposit_amount
            
            self.cursor.execute("""
                INSERT INTO car_rentals (
                    rental_id, car_id, customer_id, pickup_date, return_date,
                    pickup_location, return_location, daily_rate, total_days,
                    total_cost, deposit_amount, status, rental_date,
                    payment_status, insurance_coverage, additional_drivers,
                    mileage_limit, fuel_level_pickup, agent_id, confirmation_number
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                rental_data['rental_id'], rental_data['car_id'], rental_data['customer_id'],
                rental_data['pickup_date'], rental_data['return_date'],
                rental_data['pickup_location'], rental_data['return_location'],
                rental_data['daily_rate'], rental_data['total_days'],
                rental_data['total_cost'], rental_data['deposit_amount'],
                rental_data['status'], rental_data['rental_date'],
                rental_data['payment_status'], rental_data['insurance_coverage'],
                rental_data['additional_drivers'], rental_data['mileage_limit'],
                rental_data['fuel_level_pickup'], rental_data['agent_id'],
                rental_data['confirmation_number']
            ))
            
            # Update car status
            self._update_car_status(rental_data['car_id'], 'rented')
            
            # Update customer rental history
            self._update_customer_rental_history(rental_data['customer_id'], rental_id)
            
            self.conn.commit()
            logger.info(f"Car rental {confirmation_number} created successfully")
            return rental_id
            
        except Exception as e:
            logger.error(f"Failed to create car rental: {e}")
            raise
    
    def search_available_cars(self, criteria: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search for available cars based on criteria"""
        try:
            query = "SELECT * FROM cars WHERE status = 'available'"
            params = []
            
            if criteria.get('category'):
                query += " AND category = ?"
                params.append(criteria['category'])
            
            if criteria.get('location'):
                query += " AND location = ?"
                params.append(criteria['location'])
            
            if criteria.get('max_daily_rate'):
                query += " AND daily_rate <= ?"
                params.append(criteria['max_daily_rate'])
            
            if criteria.get('transmission'):
                query += " AND transmission = ?"
                params.append(criteria['transmission'])
            
            if criteria.get('fuel_type'):
                query += " AND fuel_type = ?"
                params.append(criteria['fuel_type'])
            
            self.cursor.execute(query, params)
            cars = self.cursor.fetchall()
            
            # Convert to list of dictionaries
            car_list = []
            for car in cars:
                car_dict = {
                    'car_id': car[0], 'license_plate': car[1], 'make': car[2],
                    'model': car[3], 'year': car[4], 'color': car[5],
                    'category': car[6], 'transmission': car[7], 'fuel_type': car[8],
                    'mileage': car[9], 'daily_rate': car[10], 'weekly_rate': car[11],
                    'monthly_rate': car[12], 'location': car[13], 'status': car[14],
                    'features': json.loads(car[15]), 'insurance_info': json.loads(car[16]),
                    'last_maintenance': car[17], 'next_maintenance': car[18]
                }
                car_list.append(car_dict)
            
            return car_list
            
        except Exception as e:
            logger.error(f"Failed to search available cars: {e}")
            return []
    
    def check_car_availability(self, car_id: str, pickup_date: str, return_date: str) -> bool:
        """Check if a car is available for the specified dates"""
        try:
            self.cursor.execute("""
                SELECT COUNT(*) FROM car_rentals
                WHERE car_id = ? AND status IN ('confirmed', 'active')
                AND (
                    (pickup_date <= ? AND return_date >= ?) OR
                    (pickup_date <= ? AND return_date >= ?) OR
                    (pickup_date >= ? AND return_date <= ?)
                )
            """, (car_id, pickup_date, pickup_date, return_date, return_date, pickup_date, return_date))
            
            conflicting_rentals = self.cursor.fetchone()[0]
            return conflicting_rentals == 0
            
        except Exception as e:
            logger.error(f"Failed to check car availability: {e}")
            return False
    
    def return_car(self, rental_id: str, return_data: Dict[str, Any]) -> bool:
        """Process car return"""
        try:
            # Get rental details
            self.cursor.execute("""
                SELECT car_id, total_cost, mileage_limit, fuel_level_pickup
                FROM car_rentals WHERE rental_id = ?
            """, (rental_id,))
            rental = self.cursor.fetchone()
            
            if not rental:
                raise ValueError("Rental not found")
            
            car_id, total_cost, mileage_limit, fuel_level_pickup = rental
            
            # Calculate additional charges
            additional_charges = 0
            
            # Late return fee
            if return_data.get('is_late_return'):
                additional_charges += self.config['pricing']['late_return_fee']
            
            # Mileage overage fee
            actual_mileage = return_data.get('actual_mileage', 0)
            if actual_mileage > mileage_limit:
                overage_miles = actual_mileage - mileage_limit
                additional_charges += overage_miles * 0.25  # $0.25 per mile
            
            # Fuel service fee
            fuel_level_return = return_data.get('fuel_level_return', fuel_level_pickup)
            if fuel_level_return != fuel_level_pickup:
                additional_charges += self.config['pricing']['fuel_service_fee']
            
            # Update rental record
            self.cursor.execute("""
                UPDATE car_rentals SET 
                    status = 'completed',
                    actual_mileage = ?,
                    fuel_level_return = ?,
                    total_cost = total_cost + ?
                WHERE rental_id = ?
            """, (actual_mileage, fuel_level_return, additional_charges, rental_id))
            
            # Update car status
            self._update_car_status(car_id, 'available')
            
            # Update car mileage
            self.cursor.execute("""
                UPDATE cars SET mileage = mileage + ? WHERE car_id = ?
            """, (actual_mileage, car_id))
            
            self.conn.commit()
            logger.info(f"Car return processed for rental {rental_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to process car return: {e}")
            return False
    
    def cancel_rental(self, rental_id: str) -> bool:
        """Cancel a car rental"""
        try:
            # Get rental details
            self.cursor.execute("SELECT car_id, status FROM car_rentals WHERE rental_id = ?", (rental_id,))
            rental = self.cursor.fetchone()
            
            if not rental:
                raise ValueError("Rental not found")
            
            if rental[1] in ['cancelled', 'completed']:
                raise ValueError("Cannot cancel this rental")
            
            # Update rental status
            self.cursor.execute("""
                UPDATE car_rentals SET status = 'cancelled' WHERE rental_id = ?
            """, (rental_id,))
            
            # Update car status
            self._update_car_status(rental[0], 'available')
            
            self.conn.commit()
            logger.info(f"Rental {rental_id} cancelled successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to cancel rental: {e}")
            return False
    
    def get_rental_details(self, rental_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed information about a rental"""
        try:
            self.cursor.execute("""
                SELECT cr.*, c.make, c.model, c.license_plate, cu.first_name, cu.last_name
                FROM car_rentals cr
                JOIN cars c ON cr.car_id = c.car_id
                JOIN customers cu ON cr.customer_id = cu.customer_id
                WHERE cr.rental_id = ?
            """, (rental_id,))
            
            rental = self.cursor.fetchone()
            if not rental:
                return None
            
            return {
                'rental_id': rental[0], 'car_id': rental[1], 'customer_id': rental[2],
                'pickup_date': rental[3], 'return_date': rental[4],
                'pickup_location': rental[5], 'return_location': rental[6],
                'daily_rate': rental[7], 'total_days': rental[8],
                'total_cost': rental[9], 'deposit_amount': rental[10],
                'status': rental[11], 'rental_date': rental[12],
                'payment_status': rental[13], 'insurance_coverage': rental[14],
                'additional_drivers': rental[15], 'mileage_limit': rental[16],
                'actual_mileage': rental[17], 'fuel_level_pickup': rental[18],
                'fuel_level_return': rental[19], 'agent_id': rental[20],
                'confirmation_number': rental[21], 'car_make': rental[22],
                'car_model': rental[23], 'license_plate': rental[24],
                'customer_name': f"{rental[25]} {rental[26]}"
            }
            
        except Exception as e:
            logger.error(f"Failed to get rental details: {e}")
            return None
    
    def _validate_rental(self, rental_data: Dict[str, Any]) -> bool:
        """Validate rental data"""
        required_fields = ['car_id', 'customer_id', 'pickup_date', 'return_date', 'pickup_location', 'return_location']
        
        for field in required_fields:
            if field not in rental_data:
                logger.error(f"Missing required field: {field}")
                return False
        
        # Check if dates are valid
        try:
            pickup_date = datetime.strptime(rental_data['pickup_date'], '%Y-%m-%d')
            return_date = datetime.strptime(rental_data['return_date'], '%Y-%m-%d')
            
            if pickup_date >= return_date:
                logger.error("Pickup date must be before return date")
                return False
            
            if pickup_date < datetime.now():
                logger.error("Pickup date cannot be in the past")
                return False
                
        except ValueError:
            logger.error("Invalid date format")
            return False
        
        # Check if car is available
        if not self.check_car_availability(rental_data['car_id'], rental_data['pickup_date'], rental_data['return_date']):
            logger.error("Car is not available for the specified dates")
            return False
        
        return True
    
    def _update_car_status(self, car_id: str, status: str):
        """Update car status"""
        self.cursor.execute("UPDATE cars SET status = ? WHERE car_id = ?", (status, car_id))
    
    def _update_customer_rental_history(self, customer_id: str, rental_id: str):
        """Update customer rental history"""
        self.cursor.execute("SELECT rental_history FROM customers WHERE customer_id = ?", (customer_id,))
        history = self.cursor.fetchone()
        
        if history:
            rental_list = json.loads(history[0])
            rental_list.append(rental_id)
            
            self.cursor.execute("""
                UPDATE customers SET rental_history = ? WHERE customer_id = ?
            """, (json.dumps(rental_list), customer_id))
    
    def _generate_confirmation_number(self) -> str:
        """Generate unique confirmation number"""
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        random_suffix = str(uuid.uuid4())[:8].upper()
        return f"CR{timestamp}{random_suffix}"
    
    def _maintenance_monitoring_service(self):
        """Background service for monitoring maintenance schedules"""
        while True:
            try:
                # Check maintenance schedules
                # Send maintenance reminders
                # Update maintenance records
                time.sleep(3600)  # Check every hour
            except Exception as e:
                logger.error(f"Maintenance monitoring service error: {e}")
                time.sleep(60)
    
    def _availability_monitoring_service(self):
        """Background service for monitoring car availability"""
        while True:
            try:
                # Update car availability
                # Process returns
                # Update cleaning schedules
                time.sleep(300)  # Check every 5 minutes
            except Exception as e:
                logger.error(f"Availability monitoring service error: {e}")
                time.sleep(60)
    
    def _notification_processing_service(self):
        """Background service for processing notifications"""
        while True:
            try:
                # Send rental confirmations
                # Send reminder notifications
                # Process email/SMS notifications
                time.sleep(60)  # Check every minute
            except Exception as e:
                logger.error(f"Notification service error: {e}")
                time.sleep(30)
    
    def get_system_status(self) -> Dict[str, Any]:
        """Get overall system status"""
        try:
            # Get counts
            self.cursor.execute("SELECT COUNT(*) FROM cars WHERE status = 'available'")
            available_cars = self.cursor.fetchone()[0]
            
            self.cursor.execute("SELECT COUNT(*) FROM cars WHERE status = 'rented'")
            rented_cars = self.cursor.fetchone()[0]
            
            self.cursor.execute("SELECT COUNT(*) FROM car_rentals WHERE status = 'active'")
            active_rentals = self.cursor.fetchone()[0]
            
            self.cursor.execute("SELECT COUNT(*) FROM customers WHERE status = 'active'")
            active_customers = self.cursor.fetchone()[0]
            
            return {
                'system_name': self.system_name,
                'version': self.version,
                'status': 'operational',
                'available_cars': available_cars,
                'rented_cars': rented_cars,
                'active_rentals': active_rentals,
                'active_customers': active_customers,
                'database_path': str(self.database_path),
                'background_services': 'running'
            }
            
        except Exception as e:
            logger.error(f"Failed to get system status: {e}")
            return {'status': 'error', 'error': str(e)}

if __name__ == "__main__":
    # Initialize and test the car rental system
    try:
        car_rental_system = MaijdCarRentalSystem()
        
        # Test system status
        status = car_rental_system.get_system_status()
        print(f"Car Rental System Status: {status}")
        
        print("Maijd Car Rental System initialized successfully!")
        print("Use the class methods to manage cars, customers, and rentals.")
        
    except Exception as e:
        print(f"Failed to initialize Car Rental System: {e}")
        sys.exit(1)
