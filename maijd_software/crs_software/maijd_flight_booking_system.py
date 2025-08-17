#!/usr/bin/env python3
"""
Maijd Flight Booking System
Comprehensive flight booking and management system
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
class Flight:
    """Flight data structure"""
    flight_id: str
    flight_number: str
    airline: str
    aircraft_type: str
    origin_airport: str
    destination_airport: str
    departure_time: str
    arrival_time: str
    duration_minutes: int
    distance_miles: int
    total_seats: int
    available_seats: int
    economy_price: float
    business_price: float
    first_class_price: float
    status: str  # scheduled, delayed, cancelled, departed, arrived
    gate_departure: str
    gate_arrival: str
    terminal_departure: str
    terminal_arrival: str
    baggage_allowance: Dict[str, Any]

@dataclass
class FlightBooking:
    """Flight booking data structure"""
    booking_id: str
    flight_id: str
    customer_id: str
    seat_class: str  # economy, business, first_class
    seat_number: str
    passenger_count: int
    total_cost: float
    booking_date: str
    status: str  # confirmed, pending, cancelled, completed
    payment_status: str
    special_requests: Optional[str]
    agent_id: Optional[str]
    confirmation_number: str
    baggage_count: int
    meal_preference: Optional[str]
    seat_preference: Optional[str]

@dataclass
class Passenger:
    """Passenger data structure"""
    passenger_id: str
    booking_id: str
    first_name: str
    last_name: str
    date_of_birth: str
    passport_number: str
    nationality: str
    seat_assignment: str
    meal_preference: Optional[str]
    special_assistance: Optional[str]

class MaijdFlightBookingSystem:
    """Comprehensive flight booking and management system"""
    
    def __init__(self):
        self.system_name = "Maijd Flight Booking System"
        self.version = "2.0.0"
        self.database_path = None
        self.conn = None
        self.cursor = None
        
        # Initialize system components
        self.init_database()
        self.load_configuration()
        self.initialize_flight_services()
        
        # Start background services
        self.start_background_services()
        
        logger.info(f"{self.system_name} v{self.version} initialized successfully")
    
    def init_database(self):
        """Initialize SQLite database with flight booking tables"""
        try:
            self.database_path = Path("flight_booking.db")
            self.conn = sqlite3.connect(str(self.database_path))
            self.cursor = self.conn.cursor()
            
            # Create tables
            self.cursor.executescript("""
                CREATE TABLE IF NOT EXISTS flights (
                    flight_id TEXT PRIMARY KEY,
                    flight_number TEXT NOT NULL,
                    airline TEXT NOT NULL,
                    aircraft_type TEXT,
                    origin_airport TEXT NOT NULL,
                    destination_airport TEXT NOT NULL,
                    departure_time TEXT NOT NULL,
                    arrival_time TEXT NOT NULL,
                    duration_minutes INTEGER,
                    distance_miles INTEGER,
                    total_seats INTEGER,
                    available_seats INTEGER,
                    economy_price REAL,
                    business_price REAL,
                    first_class_price REAL,
                    status TEXT,
                    gate_departure TEXT,
                    gate_arrival TEXT,
                    terminal_departure TEXT,
                    terminal_arrival TEXT,
                    baggage_allowance TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE TABLE IF NOT EXISTS flight_bookings (
                    booking_id TEXT PRIMARY KEY,
                    flight_id TEXT,
                    customer_id TEXT,
                    seat_class TEXT,
                    seat_number TEXT,
                    passenger_count INTEGER,
                    total_cost REAL,
                    booking_date TEXT,
                    status TEXT,
                    payment_status TEXT,
                    special_requests TEXT,
                    agent_id TEXT,
                    confirmation_number TEXT,
                    baggage_count INTEGER,
                    meal_preference TEXT,
                    seat_preference TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (flight_id) REFERENCES flights (flight_id)
                );
                
                CREATE TABLE IF NOT EXISTS passengers (
                    passenger_id TEXT PRIMARY KEY,
                    booking_id TEXT,
                    first_name TEXT,
                    last_name TEXT,
                    date_of_birth TEXT,
                    passport_number TEXT,
                    nationality TEXT,
                    seat_assignment TEXT,
                    meal_preference TEXT,
                    special_assistance TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (booking_id) REFERENCES flight_bookings (booking_id)
                );
                
                CREATE TABLE IF NOT EXISTS customers (
                    customer_id TEXT PRIMARY KEY,
                    first_name TEXT,
                    last_name TEXT,
                    email TEXT UNIQUE,
                    phone TEXT,
                    address TEXT,
                    date_of_birth TEXT,
                    passport_number TEXT UNIQUE,
                    nationality TEXT,
                    loyalty_points INTEGER DEFAULT 0,
                    booking_history TEXT,
                    status TEXT DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE TABLE IF NOT EXISTS flight_agents (
                    agent_id TEXT PRIMARY KEY,
                    first_name TEXT,
                    last_name TEXT,
                    email TEXT UNIQUE,
                    phone TEXT,
                    commission_rate REAL DEFAULT 0.10,
                    status TEXT DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE TABLE IF NOT EXISTS airports (
                    airport_code TEXT PRIMARY KEY,
                    airport_name TEXT,
                    city TEXT,
                    country TEXT,
                    timezone TEXT,
                    latitude REAL,
                    longitude REAL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            
            self.conn.commit()
            logger.info("Flight Booking System database initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize database: {e}")
            raise
    
    def load_configuration(self):
        """Load system configuration"""
        self.config = {
            'booking_limits': {
                'max_advance_booking_days': 365,
                'min_advance_booking_hours': 2,
                'max_passengers_per_booking': 9
            },
            'pricing': {
                'cancellation_fee': 50.0,
                'change_fee': 75.0,
                'baggage_fee': 30.0,
                'seat_selection_fee': 25.0
            },
            'loyalty_program': {
                'bronze_threshold': 0,
                'silver_threshold': 1000,
                'gold_threshold': 5000,
                'platinum_threshold': 10000
            },
            'notification_settings': {
                'email_notifications': True,
                'sms_notifications': True,
                'reminder_hours': [24, 2, 1]
            }
        }
        logger.info("Configuration loaded successfully")
    
    def initialize_flight_services(self):
        """Initialize flight service providers and integrations"""
        self.flight_services = {
            'payment_gateways': ['stripe', 'paypal', 'square'],
            'airline_systems': ['sabre', 'amadeus', 'travelport'],
            'airport_services': ['tsa', 'customs', 'immigration'],
            'ground_services': ['catering', 'cleaning', 'fuel']
        }
        logger.info("Flight services initialized")
    
    def start_background_services(self):
        """Start background monitoring and processing services"""
        # Flight status monitoring service
        self.flight_monitor_thread = threading.Thread(
            target=self._flight_status_monitoring_service,
            daemon=True
        )
        self.flight_monitor_thread.start()
        
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
    
    def add_flight(self, flight_data: Dict[str, Any]) -> str:
        """Add a new flight to the system"""
        try:
            flight_id = str(uuid.uuid4())
            flight_data['flight_id'] = flight_id
            flight_data['baggage_allowance'] = json.dumps(flight_data.get('baggage_allowance', {}))
            
            self.cursor.execute("""
                INSERT INTO flights (
                    flight_id, flight_number, airline, aircraft_type, origin_airport,
                    destination_airport, departure_time, arrival_time, duration_minutes,
                    distance_miles, total_seats, available_seats, economy_price,
                    business_price, first_class_price, status, gate_departure,
                    gate_arrival, terminal_departure, terminal_arrival, baggage_allowance
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                flight_data['flight_id'], flight_data['flight_number'], flight_data['airline'],
                flight_data['aircraft_type'], flight_data['origin_airport'],
                flight_data['destination_airport'], flight_data['departure_time'],
                flight_data['arrival_time'], flight_data['duration_minutes'],
                flight_data['distance_miles'], flight_data['total_seats'],
                flight_data['available_seats'], flight_data['economy_price'],
                flight_data['business_price'], flight_data['first_class_price'],
                flight_data['status'], flight_data['gate_departure'],
                flight_data['gate_arrival'], flight_data['terminal_departure'],
                flight_data['terminal_arrival'], flight_data['baggage_allowance']
            ))
            
            self.conn.commit()
            logger.info(f"Flight {flight_data['flight_number']} added successfully")
            return flight_id
            
        except Exception as e:
            logger.error(f"Failed to add flight: {e}")
            raise
    
    def add_customer(self, customer_data: Dict[str, Any]) -> str:
        """Add a new customer to the system"""
        try:
            customer_id = str(uuid.uuid4())
            customer_data['customer_id'] = customer_id
            customer_data['booking_history'] = json.dumps([])
            
            self.cursor.execute("""
                INSERT INTO customers (
                    customer_id, first_name, last_name, email, phone, address,
                    date_of_birth, passport_number, nationality, loyalty_points,
                    booking_history, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                customer_data['customer_id'], customer_data['first_name'],
                customer_data['last_name'], customer_data['email'], customer_data['phone'],
                customer_data['address'], customer_data['date_of_birth'],
                customer_data['passport_number'], customer_data['nationality'],
                customer_data['loyalty_points'], customer_data['booking_history'],
                customer_data['status']
            ))
            
            self.conn.commit()
            logger.info(f"Customer {customer_data['first_name']} {customer_data['last_name']} added successfully")
            return customer_id
            
        except Exception as e:
            logger.error(f"Failed to add customer: {e}")
            raise
    
    def create_flight_booking(self, booking_data: Dict[str, Any]) -> str:
        """Create a new flight booking"""
        try:
            # Validate booking data
            if not self._validate_booking(booking_data):
                raise ValueError("Invalid booking data")
            
            booking_id = str(uuid.uuid4())
            confirmation_number = self._generate_confirmation_number()
            
            # Calculate total cost based on seat class
            flight_price = self._get_flight_price(booking_data['flight_id'], booking_data['seat_class'])
            total_cost = flight_price * booking_data['passenger_count']
            
            # Add additional fees
            if booking_data.get('seat_preference'):
                total_cost += self.config['pricing']['seat_selection_fee']
            
            if booking_data.get('baggage_count', 0) > 1:
                extra_bags = booking_data['baggage_count'] - 1
                total_cost += extra_bags * self.config['pricing']['baggage_fee']
            
            booking_data['booking_id'] = booking_id
            booking_data['confirmation_number'] = confirmation_number
            booking_data['status'] = 'confirmed'
            booking_data['payment_status'] = 'pending'
            booking_data['total_cost'] = total_cost
            
            self.cursor.execute("""
                INSERT INTO flight_bookings (
                    booking_id, flight_id, customer_id, seat_class, seat_number,
                    passenger_count, total_cost, booking_date, status,
                    payment_status, special_requests, agent_id, confirmation_number,
                    baggage_count, meal_preference, seat_preference
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                booking_data['booking_id'], booking_data['flight_id'],
                booking_data['customer_id'], booking_data['seat_class'],
                booking_data['seat_number'], booking_data['passenger_count'],
                booking_data['total_cost'], booking_data['booking_date'],
                booking_data['status'], booking_data['payment_status'],
                booking_data['special_requests'], booking_data['agent_id'],
                booking_data['confirmation_number'], booking_data['baggage_count'],
                booking_data['meal_preference'], booking_data['seat_preference']
            ))
            
            # Update flight availability
            self._update_flight_availability(booking_data['flight_id'], booking_data['passenger_count'])
            
            # Update customer booking history
            self._update_customer_booking_history(booking_data['customer_id'], booking_id)
            
            self.conn.commit()
            logger.info(f"Flight booking {confirmation_number} created successfully")
            return booking_id
            
        except Exception as e:
            logger.error(f"Failed to create flight booking: {e}")
            raise
    
    def add_passenger(self, passenger_data: Dict[str, Any]) -> str:
        """Add a passenger to a booking"""
        try:
            passenger_id = str(uuid.uuid4())
            passenger_data['passenger_id'] = passenger_id
            
            self.cursor.execute("""
                INSERT INTO passengers (
                    passenger_id, booking_id, first_name, last_name, date_of_birth,
                    passport_number, nationality, seat_assignment, meal_preference,
                    special_assistance
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                passenger_data['passenger_id'], passenger_data['booking_id'],
                passenger_data['first_name'], passenger_data['last_name'],
                passenger_data['date_of_birth'], passenger_data['passport_number'],
                passenger_data['nationality'], passenger_data['seat_assignment'],
                passenger_data['meal_preference'], passenger_data['special_assistance']
            ))
            
            self.conn.commit()
            logger.info(f"Passenger {passenger_data['first_name']} {passenger_data['last_name']} added to booking {passenger_data['booking_id']}")
            return passenger_id
            
        except Exception as e:
            logger.error(f"Failed to add passenger: {e}")
            raise
    
    def search_flights(self, criteria: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search for flights based on criteria"""
        try:
            query = "SELECT * FROM flights WHERE 1=1"
            params = []
            
            if criteria.get('origin_airport'):
                query += " AND origin_airport = ?"
                params.append(criteria['origin_airport'])
            
            if criteria.get('destination_airport'):
                query += " AND destination_airport = ?"
                params.append(criteria['destination_airport'])
            
            if criteria.get('departure_date'):
                query += " AND DATE(departure_time) = ?"
                params.append(criteria['departure_date'])
            
            if criteria.get('airline'):
                query += " AND airline = ?"
                params.append(criteria['airline'])
            
            if criteria.get('max_price'):
                query += " AND economy_price <= ?"
                params.append(criteria['max_price'])
            
            query += " AND status = 'scheduled' AND available_seats > 0"
            query += " ORDER BY departure_time"
            
            self.cursor.execute(query, params)
            flights = self.cursor.fetchall()
            
            # Convert to list of dictionaries
            flight_list = []
            for flight in flights:
                flight_dict = {
                    'flight_id': flight[0], 'flight_number': flight[1], 'airline': flight[2],
                    'aircraft_type': flight[3], 'origin_airport': flight[4],
                    'destination_airport': flight[5], 'departure_time': flight[6],
                    'arrival_time': flight[7], 'duration_minutes': flight[8],
                    'distance_miles': flight[9], 'total_seats': flight[10],
                    'available_seats': flight[11], 'economy_price': flight[12],
                    'business_price': flight[13], 'first_class_price': flight[14],
                    'status': flight[15], 'gate_departure': flight[16],
                    'gate_arrival': flight[17], 'terminal_departure': flight[18],
                    'terminal_arrival': flight[19], 'baggage_allowance': json.loads(flight[20])
                }
                flight_list.append(flight_dict)
            
            return flight_list
            
        except Exception as e:
            logger.error(f"Failed to search flights: {e}")
            return []
    
    def check_flight_availability(self, flight_id: str, passenger_count: int) -> bool:
        """Check if a flight has enough available seats"""
        try:
            self.cursor.execute("""
                SELECT available_seats FROM flights WHERE flight_id = ?
            """, (flight_id,))
            
            result = self.cursor.fetchone()
            if not result:
                return False
            
            available_seats = result[0]
            return available_seats >= passenger_count
            
        except Exception as e:
            logger.error(f"Failed to check flight availability: {e}")
            return False
    
    def cancel_booking(self, booking_id: str) -> bool:
        """Cancel a flight booking"""
        try:
            # Get booking details
            self.cursor.execute("""
                SELECT flight_id, passenger_count, status FROM flight_bookings 
                WHERE booking_id = ?
            """, (booking_id,))
            booking = self.cursor.fetchone()
            
            if not booking:
                raise ValueError("Booking not found")
            
            if booking[2] in ['cancelled', 'completed']:
                raise ValueError("Cannot cancel this booking")
            
            # Update booking status
            self.cursor.execute("""
                UPDATE flight_bookings SET status = 'cancelled' WHERE booking_id = ?
            """, (booking_id,))
            
            # Update flight availability
            self._update_flight_availability(booking[0], -booking[1])
            
            self.conn.commit()
            logger.info(f"Flight booking {booking_id} cancelled successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to cancel booking: {e}")
            return False
    
    def change_booking(self, booking_id: str, changes: Dict[str, Any]) -> bool:
        """Change flight booking details"""
        try:
            # Get current booking
            current_booking = self.get_booking_details(booking_id)
            if not current_booking:
                raise ValueError("Booking not found")
            
            # Apply changes
            update_fields = []
            params = []
            
            for field, value in changes.items():
                if field in ['seat_class', 'seat_number', 'meal_preference', 'seat_preference']:
                    update_fields.append(f"{field} = ?")
                    params.append(value)
            
            if not update_fields:
                raise ValueError("No valid fields to update")
            
            # Add change fee
            params.append(self.config['pricing']['change_fee'])
            params.append(booking_id)
            
            query = f"""
                UPDATE flight_bookings SET 
                    {', '.join(update_fields)},
                    total_cost = total_cost + ?
                WHERE booking_id = ?
            """
            
            self.cursor.execute(query, params)
            self.conn.commit()
            
            logger.info(f"Flight booking {booking_id} updated successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to change booking: {e}")
            return False
    
    def get_booking_details(self, booking_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed information about a booking"""
        try:
            self.cursor.execute("""
                SELECT fb.*, f.flight_number, f.airline, f.origin_airport, f.destination_airport,
                       f.departure_time, f.arrival_time, c.first_name, c.last_name
                FROM flight_bookings fb
                JOIN flights f ON fb.flight_id = f.flight_id
                JOIN customers c ON fb.customer_id = c.customer_id
                WHERE fb.booking_id = ?
            """, (booking_id,))
            
            booking = self.cursor.fetchone()
            if not booking:
                return None
            
            return {
                'booking_id': booking[0], 'flight_id': booking[1], 'customer_id': booking[2],
                'seat_class': booking[3], 'seat_number': booking[4], 'passenger_count': booking[5],
                'total_cost': booking[6], 'booking_date': booking[7], 'status': booking[8],
                'payment_status': booking[9], 'special_requests': booking[10],
                'agent_id': booking[11], 'confirmation_number': booking[12],
                'baggage_count': booking[13], 'meal_preference': booking[14],
                'seat_preference': booking[15], 'flight_number': booking[16],
                'airline': booking[17], 'origin_airport': booking[18],
                'destination_airport': booking[19], 'departure_time': booking[20],
                'arrival_time': booking[21], 'customer_name': f"{booking[22]} {booking[23]}"
            }
            
        except Exception as e:
            logger.error(f"Failed to get booking details: {e}")
            return None
    
    def get_passengers(self, booking_id: str) -> List[Dict[str, Any]]:
        """Get all passengers for a booking"""
        try:
            self.cursor.execute("""
                SELECT * FROM passengers WHERE booking_id = ?
            """, (booking_id,))
            
            passengers = self.cursor.fetchall()
            
            passenger_list = []
            for passenger in passengers:
                passenger_dict = {
                    'passenger_id': passenger[0], 'booking_id': passenger[1],
                    'first_name': passenger[2], 'last_name': passenger[3],
                    'date_of_birth': passenger[4], 'passport_number': passenger[5],
                    'nationality': passenger[6], 'seat_assignment': passenger[7],
                    'meal_preference': passenger[8], 'special_assistance': passenger[9]
                }
                passenger_list.append(passenger_dict)
            
            return passenger_list
            
        except Exception as e:
            logger.error(f"Failed to get passengers: {e}")
            return []
    
    def _validate_booking(self, booking_data: Dict[str, Any]) -> bool:
        """Validate booking data"""
        required_fields = ['flight_id', 'customer_id', 'seat_class', 'passenger_count', 'booking_date']
        
        for field in required_fields:
            if field not in booking_data:
                logger.error(f"Missing required field: {field}")
                return False
        
        # Check passenger count
        if booking_data['passenger_count'] <= 0 or booking_data['passenger_count'] > self.config['booking_limits']['max_passengers_per_booking']:
            logger.error("Invalid passenger count")
            return False
        
        # Check if flight is available
        if not self.check_flight_availability(booking_data['flight_id'], booking_data['passenger_count']):
            logger.error("Flight does not have enough available seats")
            return False
        
        return True
    
    def _get_flight_price(self, flight_id: str, seat_class: str) -> float:
        """Get flight price for specified seat class"""
        try:
            self.cursor.execute("""
                SELECT economy_price, business_price, first_class_price 
                FROM flights WHERE flight_id = ?
            """, (flight_id,))
            
            prices = self.cursor.fetchone()
            if not prices:
                raise ValueError("Flight not found")
            
            price_map = {
                'economy': prices[0],
                'business': prices[1],
                'first_class': prices[2]
            }
            
            return price_map.get(seat_class, prices[0])
            
        except Exception as e:
            logger.error(f"Failed to get flight price: {e}")
            return 0.0
    
    def _update_flight_availability(self, flight_id: str, passenger_change: int):
        """Update flight available seats"""
        self.cursor.execute("""
            UPDATE flights SET available_seats = available_seats - ? WHERE flight_id = ?
        """, (passenger_change, flight_id))
    
    def _update_customer_booking_history(self, customer_id: str, booking_id: str):
        """Update customer booking history"""
        self.cursor.execute("SELECT booking_history FROM customers WHERE customer_id = ?", (customer_id,))
        history = self.cursor.fetchone()
        
        if history:
            booking_list = json.loads(history[0])
            booking_list.append(booking_id)
            
            self.cursor.execute("""
                UPDATE customers SET booking_history = ? WHERE customer_id = ?
            """, (json.dumps(booking_list), customer_id))
    
    def _generate_confirmation_number(self) -> str:
        """Generate unique confirmation number"""
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        random_suffix = str(uuid.uuid4())[:8].upper()
        return f"FB{timestamp}{random_suffix}"
    
    def _flight_status_monitoring_service(self):
        """Background service for monitoring flight status"""
        while True:
            try:
                # Update flight statuses
                # Process delays and cancellations
                # Update gate and terminal information
                time.sleep(300)  # Check every 5 minutes
            except Exception as e:
                logger.error(f"Flight status monitoring service error: {e}")
                time.sleep(60)
    
    def _availability_monitoring_service(self):
        """Background service for monitoring seat availability"""
        while True:
            try:
                # Update seat availability
                # Process cancellations
                # Update pricing
                time.sleep(600)  # Check every 10 minutes
            except Exception as e:
                logger.error(f"Availability monitoring service error: {e}")
                time.sleep(60)
    
    def _notification_processing_service(self):
        """Background service for processing notifications"""
        while True:
            try:
                # Send booking confirmations
                # Send flight reminders
                # Send status updates
                time.sleep(60)  # Check every minute
            except Exception as e:
                logger.error(f"Notification service error: {e}")
                time.sleep(30)
    
    def get_system_status(self) -> Dict[str, Any]:
        """Get overall system status"""
        try:
            # Get counts
            self.cursor.execute("SELECT COUNT(*) FROM flights WHERE status = 'scheduled'")
            scheduled_flights = self.cursor.fetchone()[0]
            
            self.cursor.execute("SELECT COUNT(*) FROM flight_bookings WHERE status = 'confirmed'")
            active_bookings = self.cursor.fetchone()[0]
            
            self.cursor.execute("SELECT COUNT(*) FROM customers WHERE status = 'active'")
            active_customers = self.cursor.fetchone()[0]
            
            self.cursor.execute("SELECT COUNT(*) FROM passengers")
            total_passengers = self.cursor.fetchone()[0]
            
            return {
                'system_name': self.system_name,
                'version': self.version,
                'status': 'operational',
                'scheduled_flights': scheduled_flights,
                'active_bookings': active_bookings,
                'active_customers': active_customers,
                'total_passengers': total_passengers,
                'database_path': str(self.database_path),
                'background_services': 'running'
            }
            
        except Exception as e:
            logger.error(f"Failed to get system status: {e}")
            return {'status': 'error', 'error': str(e)}

if __name__ == "__main__":
    # Initialize and test the flight booking system
    try:
        flight_booking_system = MaijdFlightBookingSystem()
        
        # Test system status
        status = flight_booking_system.get_system_status()
        print(f"Flight Booking System Status: {status}")
        
        print("Maijd Flight Booking System initialized successfully!")
        print("Use the class methods to manage flights, bookings, and passengers.")
        
    except Exception as e:
        print(f"Failed to initialize Flight Booking System: {e}")
        sys.exit(1)
