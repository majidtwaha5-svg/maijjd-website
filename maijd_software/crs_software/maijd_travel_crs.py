#!/usr/bin/env python3
"""
Maijd Travel CRS
Comprehensive travel management and reservation system
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
class TravelBooking:
    """Travel booking data structure"""
    booking_id: str
    customer_id: str
    travel_type: str  # flight, hotel, car, package
    departure_date: str
    return_date: Optional[str]
    origin: str
    destination: str
    passengers: int
    total_cost: float
    status: str  # confirmed, pending, cancelled
    booking_date: str
    payment_status: str
    special_requests: Optional[str]
    agent_id: Optional[str]
    confirmation_number: str

@dataclass
class FlightDetails:
    """Flight details data structure"""
    flight_id: str
    airline: str
    flight_number: str
    departure_airport: str
    arrival_airport: str
    departure_time: str
    arrival_time: str
    aircraft_type: str
    seats_available: int
    fare_class: str
    price: float
    meal_service: bool
    wifi_available: bool

@dataclass
class HotelDetails:
    """Hotel details data structure"""
    hotel_id: str
    hotel_name: str
    chain: str
    location: str
    address: str
    rating: float
    amenities: List[str]
    room_types: List[str]
    check_in_time: str
    check_out_time: str
    cancellation_policy: str
    pet_friendly: bool
    parking_available: bool

@dataclass
class CarRentalDetails:
    """Car rental details data structure"""
    car_id: str
    car_type: str
    make: str
    model: str
    year: int
    transmission: str
    fuel_type: str
    seats: int
    daily_rate: float
    weekly_rate: float
    mileage_limit: int
    insurance_included: bool
    pickup_location: str
    dropoff_location: str

class MaijdTravelCRS:
    """
    Comprehensive travel management and reservation system
    """
    
    def __init__(self):
        self.system_name = "Maijd Travel CRS"
        self.version = "2.0.0"
        self.database_path = None
        self.conn = None
        self.cursor = None
        
        # Initialize system components
        self.init_database()
        self.load_configuration()
        self.initialize_travel_services()
        
        # Start background services
        self.start_background_services()
        
        logger.info(f"{self.system_name} v{self.version} initialized successfully")
    
    def init_database(self):
        """Initialize travel CRS database"""
        try:
            db_path = Path.home() / "maijd_software" / "travel_crs.db"
            db_path.parent.mkdir(parents=True, exist_ok=True)
            
            self.database_path = str(db_path)
            self.conn = sqlite3.connect(self.database_path)
            self.cursor = self.conn.cursor()
            
            # Create travel booking tables
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS travel_bookings (
                    booking_id TEXT PRIMARY KEY,
                    customer_id TEXT,
                    travel_type TEXT,
                    departure_date TEXT,
                    return_date TEXT,
                    origin TEXT,
                    destination TEXT,
                    passengers INTEGER,
                    total_cost REAL,
                    status TEXT,
                    booking_date TEXT,
                    payment_status TEXT,
                    special_requests TEXT,
                    agent_id TEXT,
                    confirmation_number TEXT
                )
            ''')
            
            # Create flight details table
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS flight_details (
                    flight_id TEXT PRIMARY KEY,
                    airline TEXT,
                    flight_number TEXT,
                    departure_airport TEXT,
                    arrival_airport TEXT,
                    departure_time TEXT,
                    arrival_time TEXT,
                    aircraft_type TEXT,
                    seats_available INTEGER,
                    fare_class TEXT,
                    price REAL,
                    meal_service BOOLEAN,
                    wifi_available BOOLEAN
                )
            ''')
            
            # Create hotel details table
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS hotel_details (
                    hotel_id TEXT PRIMARY KEY,
                    hotel_name TEXT,
                    chain TEXT,
                    location TEXT,
                    address TEXT,
                    rating REAL,
                    amenities TEXT,
                    room_types TEXT,
                    check_in_time TEXT,
                    check_out_time TEXT,
                    cancellation_policy TEXT,
                    pet_friendly BOOLEAN,
                    parking_available BOOLEAN
                )
            ''')
            
            # Create car rental details table
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS car_rental_details (
                    car_id TEXT PRIMARY KEY,
                    car_type TEXT,
                    make TEXT,
                    model TEXT,
                    year INTEGER,
                    transmission TEXT,
                    fuel_type TEXT,
                    seats INTEGER,
                    daily_rate REAL,
                    weekly_rate REAL,
                    mileage_limit INTEGER,
                    insurance_included BOOLEAN,
                    pickup_location TEXT,
                    dropoff_location TEXT
                )
            ''')
            
            # Create customers table
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS customers (
                    customer_id TEXT PRIMARY KEY,
                    first_name TEXT,
                    last_name TEXT,
                    email TEXT,
                    phone TEXT,
                    address TEXT,
                    passport_number TEXT,
                    date_of_birth TEXT,
                    loyalty_points INTEGER,
                    membership_level TEXT,
                    registration_date TEXT
                )
            ''')
            
            # Create travel agents table
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS travel_agents (
                    agent_id TEXT PRIMARY KEY,
                    first_name TEXT,
                    last_name TEXT,
                    email TEXT,
                    phone TEXT,
                    agency TEXT,
                    commission_rate REAL,
                    specialization TEXT,
                    status TEXT,
                    hire_date TEXT
                )
            ''')
            
            # Create destinations table
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS destinations (
                    destination_id TEXT PRIMARY KEY,
                    name TEXT,
                    country TEXT,
                    city TEXT,
                    description TEXT,
                    attractions TEXT,
                    best_time_to_visit TEXT,
                    visa_requirements TEXT,
                    currency TEXT,
                    language TEXT,
                    timezone TEXT
                )
            ''')
            
            # Create travel packages table
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS travel_packages (
                    package_id TEXT PRIMARY KEY,
                    name TEXT,
                    description TEXT,
                    destinations TEXT,
                    duration INTEGER,
                    price REAL,
                    inclusions TEXT,
                    exclusions TEXT,
                    valid_from TEXT,
                    valid_until TEXT,
                    max_travelers INTEGER,
                    difficulty_level TEXT
                )
            ''')
            
            self.conn.commit()
            logger.info("Travel CRS database initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing travel CRS database: {e}")
    
    def load_configuration(self):
        """Load system configuration"""
        try:
            self.config = {
                'system_settings': {
                    'max_booking_days': 365,
                    'min_advance_booking_hours': 2,
                    'cancellation_deadline_hours': 24,
                    'max_passengers_per_booking': 10,
                    'auto_confirmation_enabled': True,
                    'payment_timeout_minutes': 30
                },
                'commission_rates': {
                    'flight': 0.05,  # 5%
                    'hotel': 0.10,   # 10%
                    'car_rental': 0.08,  # 8%
                    'package': 0.12   # 12%
                },
                'loyalty_program': {
                    'points_per_dollar': 1,
                    'tier_thresholds': {
                        'bronze': 0,
                        'silver': 1000,
                        'gold': 5000,
                        'platinum': 10000
                    },
                    'tier_benefits': {
                        'bronze': ['basic_support'],
                        'silver': ['basic_support', 'priority_booking'],
                        'gold': ['basic_support', 'priority_booking', 'free_cancellation'],
                        'platinum': ['basic_support', 'priority_booking', 'free_cancellation', 'concierge_service']
                    }
                },
                'supported_currencies': ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'],
                'supported_languages': ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese']
            }
            
            logger.info("Travel CRS configuration loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading configuration: {e}")
    
    def initialize_travel_services(self):
        """Initialize travel service providers"""
        try:
            self.travel_services = {
                'flight_providers': {
                    'major_airlines': ['American Airlines', 'Delta', 'United', 'Southwest', 'JetBlue'],
                    'international_airlines': ['British Airways', 'Lufthansa', 'Air France', 'Emirates', 'Qatar Airways'],
                    'budget_airlines': ['Spirit', 'Frontier', 'Allegiant', 'Ryanair', 'EasyJet']
                },
                'hotel_providers': {
                    'luxury_chains': ['Marriott', 'Hilton', 'Hyatt', 'InterContinental', 'Four Seasons'],
                    'mid_range_chains': ['Holiday Inn', 'Best Western', 'Comfort Inn', 'Quality Inn'],
                    'budget_chains': ['Motel 6', 'Super 8', 'Days Inn', 'Travelodge']
                },
                'car_rental_providers': {
                    'major_companies': ['Hertz', 'Avis', 'Enterprise', 'Budget', 'National'],
                    'specialty_companies': ['Sixt', 'Alamo', 'Thrifty', 'Dollar', 'Fox']
                },
                'travel_insurance_providers': ['Allianz', 'Travel Guard', 'World Nomads', 'Travelex', 'Seven Corners']
            }
            
            logger.info("Travel services initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing travel services: {e}")
    
    def start_background_services(self):
        """Start background services for travel CRS"""
        try:
            self.services_active = True
            
            # Price monitoring service
            self.price_monitor_thread = threading.Thread(target=self.monitor_prices, daemon=True)
            self.price_monitor_thread.start()
            
            # Availability monitoring service
            self.availability_monitor_thread = threading.Thread(target=self.monitor_availability, daemon=True)
            self.availability_monitor_thread.start()
            
            # Customer notification service
            self.notification_thread = threading.Thread(target=self.process_notifications, daemon=True)
            self.notification_thread.start()
            
            logger.info("Background services started successfully")
            
        except Exception as e:
            logger.error(f"Error starting background services: {e}")
    
    def create_travel_booking(self, booking_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new travel booking"""
        try:
            # Validate booking data
            validation_result = self.validate_booking_data(booking_data)
            if not validation_result['valid']:
                return {'success': False, 'error': validation_result['errors']}
            
            # Generate unique booking ID and confirmation number
            booking_id = str(uuid.uuid4())
            confirmation_number = self.generate_confirmation_number()
            
            # Create booking object
            booking = TravelBooking(
                booking_id=booking_id,
                customer_id=booking_data['customer_id'],
                travel_type=booking_data['travel_type'],
                departure_date=booking_data['departure_date'],
                return_date=booking_data.get('return_date'),
                origin=booking_data['origin'],
                destination=booking_data['destination'],
                passengers=booking_data['passengers'],
                total_cost=booking_data['total_cost'],
                status='pending',
                booking_date=datetime.now().isoformat(),
                payment_status='pending',
                special_requests=booking_data.get('special_requests'),
                agent_id=booking_data.get('agent_id'),
                confirmation_number=confirmation_number
            )
            
            # Store in database
            self.cursor.execute('''
                INSERT INTO travel_bookings 
                (booking_id, customer_id, travel_type, departure_date, return_date, origin, destination,
                 passengers, total_cost, status, booking_date, payment_status, special_requests, agent_id, confirmation_number)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                booking.booking_id, booking.customer_id, booking.travel_type, booking.departure_date,
                booking.return_date, booking.origin, booking.destination, booking.passengers,
                booking.total_cost, booking.status, booking.booking_date, booking.payment_status,
                booking.special_requests, booking.agent_id, booking.confirmation_number
            ))
            
            self.conn.commit()
            
            # Update customer loyalty points
            self.update_customer_loyalty_points(booking.customer_id, int(booking.total_cost))
            
            # Send confirmation notification
            self.send_booking_confirmation(booking)
            
            logger.info(f"Travel booking created successfully: {booking_id}")
            
            return {
                'success': True,
                'booking_id': booking_id,
                'confirmation_number': confirmation_number,
                'booking': asdict(booking)
            }
            
        except Exception as e:
            logger.error(f"Error creating travel booking: {e}")
            return {'success': False, 'error': str(e)}
    
    def validate_booking_data(self, booking_data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate travel booking data"""
        try:
            errors = []
            
            # Check required fields
            required_fields = ['customer_id', 'travel_type', 'departure_date', 'origin', 'destination', 'passengers', 'total_cost']
            for field in required_fields:
                if field not in booking_data or not booking_data[field]:
                    errors.append(f"Missing required field: {field}")
            
            # Validate travel type
            valid_travel_types = ['flight', 'hotel', 'car', 'package']
            if 'travel_type' in booking_data and booking_data['travel_type'] not in valid_travel_types:
                errors.append(f"Invalid travel type: {booking_data['travel_type']}")
            
            # Validate dates
            if 'departure_date' in booking_data:
                try:
                    departure_date = datetime.fromisoformat(booking_data['departure_date'])
                    if departure_date < datetime.now():
                        errors.append("Departure date cannot be in the past")
                except ValueError:
                    errors.append("Invalid departure date format")
            
            if 'return_date' in booking_data and booking_data['return_date']:
                try:
                    return_date = datetime.fromisoformat(booking_data['return_date'])
                    departure_date = datetime.fromisoformat(booking_data['departure_date'])
                    if return_date <= departure_date:
                        errors.append("Return date must be after departure date")
                except ValueError:
                    errors.append("Invalid return date format")
            
            # Validate passengers
            if 'passengers' in booking_data:
                passengers = booking_data['passengers']
                if not isinstance(passengers, int) or passengers < 1 or passengers > self.config['system_settings']['max_passengers_per_booking']:
                    errors.append(f"Invalid number of passengers: {passengers}")
            
            # Validate cost
            if 'total_cost' in booking_data:
                cost = booking_data['total_cost']
                if not isinstance(cost, (int, float)) or cost <= 0:
                    errors.append(f"Invalid total cost: {cost}")
            
            return {
                'valid': len(errors) == 0,
                'errors': errors
            }
            
        except Exception as e:
            logger.error(f"Error validating booking data: {e}")
            return {'valid': False, 'errors': [str(e)]}
    
    def generate_confirmation_number(self) -> str:
        """Generate unique confirmation number"""
        try:
            timestamp = int(time.time())
            random_part = str(uuid.uuid4())[:8]
            confirmation_number = f"MJ{timestamp}{random_part}".upper()
            return confirmation_number
        except Exception as e:
            logger.error(f"Error generating confirmation number: {e}")
            return f"MJ{int(time.time())}"
    
    def search_flights(self, search_criteria: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search for available flights"""
        try:
            # This is a simplified search - real implementation would query actual flight APIs
            flights = []
            
            # Generate sample flights based on search criteria
            origin = search_criteria.get('origin', '')
            destination = search_criteria.get('destination', '')
            departure_date = search_criteria.get('departure_date', '')
            passengers = search_criteria.get('passengers', 1)
            
            # Sample flight data
            sample_airlines = ['American Airlines', 'Delta', 'United', 'Southwest']
            sample_aircraft = ['Boeing 737', 'Airbus A320', 'Boeing 787', 'Airbus A350']
            
            for i in range(5):  # Generate 5 sample flights
                flight = FlightDetails(
                    flight_id=str(uuid.uuid4()),
                    airline=sample_airlines[i % len(sample_airlines)],
                    flight_number=f"MJ{i+100:03d}",
                    departure_airport=origin,
                    arrival_airport=destination,
                    departure_time=f"{8+i}:00",
                    arrival_time=f"{10+i}:30",
                    aircraft_type=sample_aircraft[i % len(sample_aircraft)],
                    seats_available=max(0, 150 - (i * 20)),
                    fare_class=['Economy', 'Premium Economy', 'Business', 'First'][i % 4],
                    price=200.0 + (i * 50),
                    meal_service=i % 2 == 0,
                    wifi_available=i % 2 == 1
                )
                
                flights.append(asdict(flight))
            
            # Filter by criteria
            filtered_flights = []
            for flight in flights:
                if flight['seats_available'] >= passengers:
                    filtered_flights.append(flight)
            
            logger.info(f"Flight search completed: {len(filtered_flights)} flights found")
            return filtered_flights
            
        except Exception as e:
            logger.error(f"Error searching flights: {e}")
            return []
    
    def search_hotels(self, search_criteria: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search for available hotels"""
        try:
            # This is a simplified search - real implementation would query actual hotel APIs
            hotels = []
            
            # Generate sample hotels based on search criteria
            location = search_criteria.get('location', '')
            check_in = search_criteria.get('check_in', '')
            check_out = search_criteria.get('check_out', '')
            guests = search_criteria.get('guests', 1)
            
            # Sample hotel data
            sample_chains = ['Marriott', 'Hilton', 'Hyatt', 'InterContinental']
            sample_amenities = [['WiFi', 'Pool', 'Gym'], ['WiFi', 'Restaurant'], ['WiFi', 'Spa'], ['WiFi', 'Business Center']]
            sample_room_types = [['Standard', 'Deluxe', 'Suite'], ['Standard', 'Premium'], ['Standard', 'Executive'], ['Standard', 'Presidential']]
            
            for i in range(4):  # Generate 4 sample hotels
                hotel = HotelDetails(
                    hotel_id=str(uuid.uuid4()),
                    hotel_name=f"{sample_chains[i]} {location}",
                    chain=sample_chains[i],
                    location=location,
                    address=f"{100+i} Main Street, {location}",
                    rating=4.0 + (i * 0.2),
                    amenities=sample_amenities[i],
                    room_types=sample_room_types[i],
                    check_in_time="3:00 PM",
                    check_out_time="11:00 AM",
                    cancellation_policy="Free cancellation up to 24 hours before check-in",
                    pet_friendly=i % 2 == 0,
                    parking_available=True
                )
                
                hotels.append(asdict(hotel))
            
            logger.info(f"Hotel search completed: {len(hotels)} hotels found")
            return hotels
            
        except Exception as e:
            logger.error(f"Error searching hotels: {e}")
            return []
    
    def search_car_rentals(self, search_criteria: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search for available car rentals"""
        try:
            # This is a simplified search - real implementation would query actual car rental APIs
            cars = []
            
            # Generate sample cars based on search criteria
            location = search_criteria.get('location', '')
            pickup_date = search_criteria.get('pickup_date', '')
            return_date = search_criteria.get('return_date', '')
            
            # Sample car data
            sample_car_types = ['Economy', 'Compact', 'Midsize', 'Full-size', 'SUV', 'Luxury']
            sample_makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes']
            sample_models = ['Corolla', 'Civic', 'Focus', 'Malibu', '3 Series', 'C-Class']
            
            for i in range(6):  # Generate 6 sample cars
                car = CarRentalDetails(
                    car_id=str(uuid.uuid4()),
                    car_type=sample_car_types[i],
                    make=sample_makes[i],
                    model=sample_models[i],
                    year=2023,
                    transmission=['Automatic', 'Manual'][i % 2],
                    fuel_type=['Gasoline', 'Hybrid', 'Electric'][i % 3],
                    seats=4 + (i // 2),
                    daily_rate=30.0 + (i * 10),
                    weekly_rate=180.0 + (i * 60),
                    mileage_limit=100,
                    insurance_included=i % 2 == 0,
                    pickup_location=location,
                    dropoff_location=location
                )
                
                cars.append(asdict(car))
            
            logger.info(f"Car rental search completed: {len(cars)} cars found")
            return cars
            
        except Exception as e:
            logger.error(f"Error searching car rentals: {e}")
            return []
    
    def create_travel_package(self, package_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a travel package combining multiple services"""
        try:
            package_id = str(uuid.uuid4())
            
            # Validate package data
            if not all(key in package_data for key in ['name', 'description', 'destinations', 'duration', 'price']):
                return {'success': False, 'error': 'Missing required package information'}
            
            # Store package in database
            self.cursor.execute('''
                INSERT INTO travel_packages 
                (package_id, name, description, destinations, duration, price, inclusions, exclusions, 
                 valid_from, valid_until, max_travelers, difficulty_level)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                package_id, package_data['name'], package_data['description'],
                json.dumps(package_data['destinations']), package_data['duration'],
                package_data['price'], json.dumps(package_data.get('inclusions', [])),
                json.dumps(package_data.get('exclusions', [])), package_data.get('valid_from'),
                package_data.get('valid_until'), package_data.get('max_travelers', 10),
                package_data.get('difficulty_level', 'Easy')
            ))
            
            self.conn.commit()
            
            logger.info(f"Travel package created successfully: {package_id}")
            
            return {
                'success': True,
                'package_id': package_id,
                'package': package_data
            }
            
        except Exception as e:
            logger.error(f"Error creating travel package: {e}")
            return {'success': False, 'error': str(e)}
    
    def update_booking_status(self, booking_id: str, new_status: str) -> Dict[str, Any]:
        """Update travel booking status"""
        try:
            valid_statuses = ['pending', 'confirmed', 'cancelled', 'completed', 'refunded']
            if new_status not in valid_statuses:
                return {'success': False, 'error': f'Invalid status: {new_status}'}
            
            self.cursor.execute('''
                UPDATE travel_bookings 
                SET status = ? 
                WHERE booking_id = ?
            ''', (new_status, booking_id))
            
            if self.cursor.rowcount == 0:
                return {'success': False, 'error': f'Booking not found: {booking_id}'}
            
            self.conn.commit()
            
            # Send status update notification
            self.send_status_update_notification(booking_id, new_status)
            
            logger.info(f"Booking status updated: {booking_id} -> {new_status}")
            
            return {'success': True, 'message': f'Status updated to {new_status}'}
            
        except Exception as e:
            logger.error(f"Error updating booking status: {e}")
            return {'success': False, 'error': str(e)}
    
    def cancel_booking(self, booking_id: str, reason: str = None) -> Dict[str, Any]:
        """Cancel a travel booking"""
        try:
            # Get booking details
            self.cursor.execute('SELECT * FROM travel_bookings WHERE booking_id = ?', (booking_id,))
            booking = self.cursor.fetchone()
            
            if not booking:
                return {'success': False, 'error': f'Booking not found: {booking_id}'}
            
            # Check cancellation policy
            cancellation_allowed = self.check_cancellation_policy(booking_id)
            if not cancellation_allowed['allowed']:
                return {'success': False, 'error': cancellation_allowed['reason']}
            
            # Update status to cancelled
            result = self.update_booking_status(booking_id, 'cancelled')
            if not result['success']:
                return result
            
            # Process refund if applicable
            refund_result = self.process_refund(booking_id)
            
            # Send cancellation notification
            self.send_cancellation_notification(booking_id, reason)
            
            logger.info(f"Booking cancelled successfully: {booking_id}")
            
            return {
                'success': True,
                'message': 'Booking cancelled successfully',
                'refund_processed': refund_result['success']
            }
            
        except Exception as e:
            logger.error(f"Error cancelling booking: {e}")
            return {'success': False, 'error': str(e)}
    
    def check_cancellation_policy(self, booking_id: str) -> Dict[str, Any]:
        """Check if booking can be cancelled"""
        try:
            # Get booking details
            self.cursor.execute('SELECT departure_date, travel_type FROM travel_bookings WHERE booking_id = ?', (booking_id,))
            booking = self.cursor.fetchone()
            
            if not booking:
                return {'allowed': False, 'reason': 'Booking not found'}
            
            departure_date = datetime.fromisoformat(booking[0])
            travel_type = booking[1]
            
            # Check time-based cancellation policy
            hours_until_departure = (departure_date - datetime.now()).total_seconds() / 3600
            
            if hours_until_departure < self.config['system_settings']['cancellation_deadline_hours']:
                return {'allowed': False, 'reason': 'Too close to departure time'}
            
            # Check travel type specific policies
            if travel_type == 'package':
                return {'allowed': True, 'reason': 'Package bookings can be cancelled'}
            elif travel_type == 'flight':
                return {'allowed': True, 'reason': 'Flight bookings can be cancelled'}
            elif travel_type == 'hotel':
                return {'allowed': True, 'reason': 'Hotel bookings can be cancelled'}
            elif travel_type == 'car':
                return {'allowed': True, 'reason': 'Car rental bookings can be cancelled'}
            
            return {'allowed': True, 'reason': 'Cancellation allowed'}
            
        except Exception as e:
            logger.error(f"Error checking cancellation policy: {e}")
            return {'allowed': False, 'reason': 'Error checking policy'}
    
    def process_refund(self, booking_id: str) -> Dict[str, Any]:
        """Process refund for cancelled booking"""
        try:
            # Get booking details
            self.cursor.execute('SELECT total_cost, payment_status FROM travel_bookings WHERE booking_id = ?', (booking_id,))
            booking = self.cursor.fetchone()
            
            if not booking:
                return {'success': False, 'error': 'Booking not found'}
            
            total_cost = booking[0]
            payment_status = booking[1]
            
            if payment_status != 'paid':
                return {'success': False, 'error': 'No payment to refund'}
            
            # Calculate refund amount (simplified - real implementation would handle partial refunds, fees, etc.)
            refund_amount = total_cost * 0.9  # 90% refund
            
            # Update payment status
            self.cursor.execute('''
                UPDATE travel_bookings 
                SET payment_status = 'refunded' 
                WHERE booking_id = ?
            ''', (booking_id,))
            
            self.conn.commit()
            
            logger.info(f"Refund processed: {booking_id} - ${refund_amount:.2f}")
            
            return {
                'success': True,
                'refund_amount': refund_amount,
                'message': f'Refund of ${refund_amount:.2f} processed'
            }
            
        except Exception as e:
            logger.error(f"Error processing refund: {e}")
            return {'success': False, 'error': str(e)}
    
    def update_customer_loyalty_points(self, customer_id: str, points_earned: int):
        """Update customer loyalty points"""
        try:
            self.cursor.execute('''
                UPDATE customers 
                SET loyalty_points = loyalty_points + ? 
                WHERE customer_id = ?
            ''', (points_earned, customer_id))
            
            self.conn.commit()
            
            # Check for tier upgrades
            self.check_tier_upgrade(customer_id)
            
            logger.info(f"Loyalty points updated for customer {customer_id}: +{points_earned}")
            
        except Exception as e:
            logger.error(f"Error updating loyalty points: {e}")
    
    def check_tier_upgrade(self, customer_id: str):
        """Check if customer qualifies for tier upgrade"""
        try:
            self.cursor.execute('SELECT loyalty_points FROM customers WHERE customer_id = ?', (customer_id,))
            result = self.cursor.fetchone()
            
            if not result:
                return
            
            current_points = result[0]
            current_tier = self.get_customer_tier(current_points)
            
            # Update tier if changed
            self.cursor.execute('''
                UPDATE customers 
                SET membership_level = ? 
                WHERE customer_id = ?
            ''', (current_tier, customer_id))
            
            self.conn.commit()
            
            logger.info(f"Customer {customer_id} tier updated to {current_tier}")
            
        except Exception as e:
            logger.error(f"Error checking tier upgrade: {e}")
    
    def get_customer_tier(self, points: int) -> str:
        """Get customer tier based on loyalty points"""
        try:
            thresholds = self.config['loyalty_program']['tier_thresholds']
            
            if points >= thresholds['platinum']:
                return 'platinum'
            elif points >= thresholds['gold']:
                return 'gold'
            elif points >= thresholds['silver']:
                return 'silver'
            else:
                return 'bronze'
                
        except Exception as e:
            logger.error(f"Error getting customer tier: {e}")
            return 'bronze'
    
    def monitor_prices(self):
        """Monitor travel prices for changes"""
        try:
            while self.services_active:
                # Check for price changes in flights, hotels, and car rentals
                # This is a simplified implementation
                time.sleep(3600)  # Check every hour
                
        except Exception as e:
            logger.error(f"Error in price monitoring: {e}")
    
    def monitor_availability(self):
        """Monitor availability of travel services"""
        try:
            while self.services_active:
                # Check for availability changes
                # This is a simplified implementation
                time.sleep(1800)  # Check every 30 minutes
                
        except Exception as e:
            logger.error(f"Error in availability monitoring: {e}")
    
    def process_notifications(self):
        """Process customer notifications"""
        try:
            while self.services_active:
                # Process pending notifications
                # This is a simplified implementation
                time.sleep(300)  # Check every 5 minutes
                
        except Exception as e:
            logger.error(f"Error in notification processing: {e}")
    
    def send_booking_confirmation(self, booking: TravelBooking):
        """Send booking confirmation notification"""
        try:
            # This would integrate with your notification system
            logger.info(f"Booking confirmation sent: {booking.confirmation_number}")
            
        except Exception as e:
            logger.error(f"Error sending booking confirmation: {e}")
    
    def send_status_update_notification(self, booking_id: str, new_status: str):
        """Send status update notification"""
        try:
            # This would integrate with your notification system
            logger.info(f"Status update notification sent: {booking_id} -> {new_status}")
            
        except Exception as e:
            logger.error(f"Error sending status update notification: {e}")
    
    def send_cancellation_notification(self, booking_id: str, reason: str):
        """Send cancellation notification"""
        try:
            # This would integrate with your notification system
            logger.info(f"Cancellation notification sent: {booking_id} - Reason: {reason}")
            
        except Exception as e:
            logger.error(f"Error sending cancellation notification: {e}")
    
    def get_booking_summary(self) -> Dict[str, Any]:
        """Get booking summary statistics"""
        try:
            # Get total bookings
            self.cursor.execute('SELECT COUNT(*) FROM travel_bookings')
            total_bookings = self.cursor.fetchone()[0]
            
            # Get bookings by status
            self.cursor.execute('SELECT status, COUNT(*) FROM travel_bookings GROUP BY status')
            status_counts = dict(self.cursor.fetchall())
            
            # Get bookings by travel type
            self.cursor.execute('SELECT travel_type, COUNT(*) FROM travel_bookings GROUP BY travel_type')
            type_counts = dict(self.cursor.fetchall())
            
            # Get total revenue
            self.cursor.execute('SELECT SUM(total_cost) FROM travel_bookings WHERE payment_status = "paid"')
            total_revenue = self.cursor.fetchone()[0] or 0
            
            return {
                'total_bookings': total_bookings,
                'status_distribution': status_counts,
                'type_distribution': type_counts,
                'total_revenue': total_revenue,
                'average_booking_value': total_revenue / total_bookings if total_bookings > 0 else 0
            }
            
        except Exception as e:
            logger.error(f"Error getting booking summary: {e}")
            return {}
    
    def cleanup(self):
        """Cleanup resources"""
        try:
            self.services_active = False
            if hasattr(self, 'conn'):
                self.conn.close()
            logger.info("Travel CRS cleanup completed")
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")

def main():
    """Main function to demonstrate Travel CRS"""
    try:
        print("✈️  Maijd Travel CRS")
        print("=" * 50)
        
        # Initialize travel CRS
        travel_crs = MaijdTravelCRS()
        
        print(f"✅ Travel CRS initialized successfully")
        print(f"🛫 Supported services: {len(travel_crs.travel_services)}")
        print(f"💰 Commission rates: {travel_crs.config['commission_rates']}")
        
        # Create sample booking
        print("\n📝 Creating sample travel booking...")
        sample_booking = {
            'customer_id': 'CUST001',
            'travel_type': 'flight',
            'departure_date': '2024-02-15T10:00:00',
            'origin': 'JFK',
            'destination': 'LAX',
            'passengers': 2,
            'total_cost': 450.00,
            'special_requests': 'Window seats preferred'
        }
        
        booking_result = travel_crs.create_travel_booking(sample_booking)
        if booking_result['success']:
            print(f"✅ Booking created: {booking_result['confirmation_number']}")
        else:
            print(f"❌ Booking failed: {booking_result['error']}")
        
        # Search for flights
        print("\n🔍 Searching for flights...")
        flight_search = {
            'origin': 'JFK',
            'destination': 'LAX',
            'departure_date': '2024-02-15',
            'passengers': 2
        }
        
        flights = travel_crs.search_flights(flight_search)
        print(f"✈️  Found {len(flights)} flights")
        
        # Search for hotels
        print("\n🏨 Searching for hotels...")
        hotel_search = {
            'location': 'Los Angeles',
            'check_in': '2024-02-15',
            'check_out': '2024-02-18',
            'guests': 2
        }
        
        hotels = travel_crs.search_hotels(hotel_search)
        print(f"🏨 Found {len(hotels)} hotels")
        
        # Get booking summary
        print("\n📊 Booking Summary:")
        summary = travel_crs.get_booking_summary()
        print(f"📈 Total bookings: {summary.get('total_bookings', 0)}")
        print(f"💰 Total revenue: ${summary.get('total_revenue', 0):.2f}")
        
        print("\n✅ Travel CRS demonstration completed successfully!")
        
        # Cleanup
        travel_crs.cleanup()
        
    except KeyboardInterrupt:
        print("\n⚠️  Operation cancelled by user")
    except Exception as e:
        print(f"❌ Error: {e}")
        logger.error(f"Error in main: {e}")

if __name__ == "__main__":
    main()
