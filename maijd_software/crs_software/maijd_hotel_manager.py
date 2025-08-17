#!/usr/bin/env python3
"""
Maijd Hotel Manager
Comprehensive hotel management and booking system
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
class Hotel:
    """Hotel data structure"""
    hotel_id: str
    name: str
    chain: str
    star_rating: int
    address: str
    city: str
    country: str
    phone: str
    email: str
    website: str
    amenities: List[str]
    room_types: List[str]
    total_rooms: int
    available_rooms: int
    base_price: float
    currency: str
    check_in_time: str
    check_out_time: str
    status: str  # active, inactive, maintenance

@dataclass
class Room:
    """Room data structure"""
    room_id: str
    hotel_id: str
    room_number: str
    room_type: str
    floor: int
    capacity: int
    amenities: List[str]
    price_per_night: float
    status: str  # available, occupied, maintenance, reserved
    last_cleaned: str
    notes: Optional[str]

@dataclass
class HotelBooking:
    """Hotel booking data structure"""
    booking_id: str
    hotel_id: str
    room_id: str
    customer_id: str
    check_in_date: str
    check_out_date: str
    guests: int
    total_cost: float
    status: str  # confirmed, pending, cancelled, completed
    booking_date: str
    payment_status: str
    special_requests: Optional[str]
    agent_id: Optional[str]
    confirmation_number: str

class MaijdHotelManager:
    """Comprehensive hotel management and booking system"""
    
    def __init__(self):
        self.system_name = "Maijd Hotel Manager"
        self.version = "2.0.0"
        self.database_path = None
        self.conn = None
        self.cursor = None
        
        # Initialize system components
        self.init_database()
        self.load_configuration()
        self.initialize_hotel_services()
        
        # Start background services
        self.start_background_services()
        
        logger.info(f"{self.system_name} v{self.version} initialized successfully")
    
    def init_database(self):
        """Initialize SQLite database with hotel management tables"""
        try:
            self.database_path = Path("hotel_manager.db")
            self.conn = sqlite3.connect(str(self.database_path))
            self.cursor = self.conn.cursor()
            
            # Create tables
            self.cursor.executescript("""
                CREATE TABLE IF NOT EXISTS hotels (
                    hotel_id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    chain TEXT,
                    star_rating INTEGER,
                    address TEXT,
                    city TEXT,
                    country TEXT,
                    phone TEXT,
                    email TEXT,
                    website TEXT,
                    amenities TEXT,
                    room_types TEXT,
                    total_rooms INTEGER,
                    available_rooms INTEGER,
                    base_price REAL,
                    currency TEXT,
                    check_in_time TEXT,
                    check_out_time TEXT,
                    status TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE TABLE IF NOT EXISTS rooms (
                    room_id TEXT PRIMARY KEY,
                    hotel_id TEXT,
                    room_number TEXT,
                    room_type TEXT,
                    floor INTEGER,
                    capacity INTEGER,
                    amenities TEXT,
                    price_per_night REAL,
                    status TEXT,
                    last_cleaned TEXT,
                    notes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (hotel_id) REFERENCES hotels (hotel_id)
                );
                
                CREATE TABLE IF NOT EXISTS hotel_bookings (
                    booking_id TEXT PRIMARY KEY,
                    hotel_id TEXT,
                    room_id TEXT,
                    customer_id TEXT,
                    check_in_date TEXT,
                    check_out_date TEXT,
                    guests INTEGER,
                    total_cost REAL,
                    status TEXT,
                    booking_date TEXT,
                    payment_status TEXT,
                    special_requests TEXT,
                    agent_id TEXT,
                    confirmation_number TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (hotel_id) REFERENCES hotels (hotel_id),
                    FOREIGN KEY (room_id) REFERENCES rooms (room_id)
                );
                
                CREATE TABLE IF NOT EXISTS customers (
                    customer_id TEXT PRIMARY KEY,
                    first_name TEXT,
                    last_name TEXT,
                    email TEXT UNIQUE,
                    phone TEXT,
                    address TEXT,
                    loyalty_points INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE TABLE IF NOT EXISTS hotel_agents (
                    agent_id TEXT PRIMARY KEY,
                    first_name TEXT,
                    last_name TEXT,
                    email TEXT UNIQUE,
                    phone TEXT,
                    commission_rate REAL DEFAULT 0.10,
                    status TEXT DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            
            self.conn.commit()
            logger.info("Hotel Manager database initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize database: {e}")
            raise
    
    def load_configuration(self):
        """Load system configuration"""
        self.config = {
            'booking_limits': {
                'max_advance_booking_days': 365,
                'min_advance_booking_hours': 2,
                'max_guests_per_room': 4
            },
            'commission_rates': {
                'standard': 0.10,
                'premium': 0.15,
                'luxury': 0.20
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
                'reminder_hours': [24, 2]
            }
        }
        logger.info("Configuration loaded successfully")
    
    def initialize_hotel_services(self):
        """Initialize hotel service providers and integrations"""
        self.hotel_services = {
            'payment_gateways': ['stripe', 'paypal', 'square'],
            'channel_managers': ['booking.com', 'expedia', 'hotels.com'],
            'review_platforms': ['tripadvisor', 'google_reviews', 'yelp'],
            'cleaning_services': ['maid_pro', 'clean_express', 'sparkle_clean']
        }
        logger.info("Hotel services initialized")
    
    def start_background_services(self):
        """Start background monitoring and processing services"""
        # Price monitoring service
        self.price_monitor_thread = threading.Thread(
            target=self._price_monitoring_service,
            daemon=True
        )
        self.price_monitor_thread.start()
        
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
    
    def add_hotel(self, hotel_data: Dict[str, Any]) -> str:
        """Add a new hotel to the system"""
        try:
            hotel_id = str(uuid.uuid4())
            hotel_data['hotel_id'] = hotel_id
            hotel_data['amenities'] = json.dumps(hotel_data.get('amenities', []))
            hotel_data['room_types'] = json.dumps(hotel_data.get('room_types', []))
            
            self.cursor.execute("""
                INSERT INTO hotels (
                    hotel_id, name, chain, star_rating, address, city, country,
                    phone, email, website, amenities, room_types, total_rooms,
                    available_rooms, base_price, currency, check_in_time,
                    check_out_time, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                hotel_data['hotel_id'], hotel_data['name'], hotel_data['chain'],
                hotel_data['star_rating'], hotel_data['address'], hotel_data['city'],
                hotel_data['country'], hotel_data['phone'], hotel_data['email'],
                hotel_data['website'], hotel_data['amenities'], hotel_data['room_types'],
                hotel_data['total_rooms'], hotel_data['available_rooms'],
                hotel_data['base_price'], hotel_data['currency'],
                hotel_data['check_in_time'], hotel_data['check_out_time'],
                hotel_data['status']
            ))
            
            self.conn.commit()
            logger.info(f"Hotel {hotel_data['name']} added successfully")
            return hotel_id
            
        except Exception as e:
            logger.error(f"Failed to add hotel: {e}")
            raise
    
    def add_room(self, room_data: Dict[str, Any]) -> str:
        """Add a new room to a hotel"""
        try:
            room_id = str(uuid.uuid4())
            room_data['room_id'] = room_id
            room_data['amenities'] = json.dumps(room_data.get('amenities', []))
            
            self.cursor.execute("""
                INSERT INTO rooms (
                    room_id, hotel_id, room_number, room_type, floor, capacity,
                    amenities, price_per_night, status, last_cleaned, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                room_data['room_id'], room_data['hotel_id'], room_data['room_number'],
                room_data['room_type'], room_data['floor'], room_data['capacity'],
                room_data['amenities'], room_data['price_per_night'],
                room_data['status'], room_data['last_cleaned'], room_data['notes']
            ))
            
            self.conn.commit()
            logger.info(f"Room {room_data['room_number']} added to hotel {room_data['hotel_id']}")
            return room_id
            
        except Exception as e:
            logger.error(f"Failed to add room: {e}")
            raise
    
    def create_hotel_booking(self, booking_data: Dict[str, Any]) -> str:
        """Create a new hotel booking"""
        try:
            # Validate booking data
            if not self._validate_booking(booking_data):
                raise ValueError("Invalid booking data")
            
            booking_id = str(uuid.uuid4())
            confirmation_number = self._generate_confirmation_number()
            
            booking_data['booking_id'] = booking_id
            booking_data['confirmation_number'] = confirmation_number
            booking_data['status'] = 'confirmed'
            booking_data['payment_status'] = 'pending'
            
            self.cursor.execute("""
                INSERT INTO hotel_bookings (
                    booking_id, hotel_id, room_id, customer_id, check_in_date,
                    check_out_date, guests, total_cost, status, booking_date,
                    payment_status, special_requests, agent_id, confirmation_number
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                booking_data['booking_id'], booking_data['hotel_id'],
                booking_data['room_id'], booking_data['customer_id'],
                booking_data['check_in_date'], booking_data['check_out_date'],
                booking_data['guests'], booking_data['total_cost'],
                booking_data['status'], booking_data['booking_date'],
                booking_data['payment_status'], booking_data['special_requests'],
                booking_data['agent_id'], booking_data['confirmation_number']
            ))
            
            # Update room availability
            self._update_room_availability(booking_data['room_id'], 'reserved')
            
            self.conn.commit()
            logger.info(f"Hotel booking {confirmation_number} created successfully")
            return booking_id
            
        except Exception as e:
            logger.error(f"Failed to create hotel booking: {e}")
            raise
    
    def search_hotels(self, criteria: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search for hotels based on criteria"""
        try:
            query = "SELECT * FROM hotels WHERE 1=1"
            params = []
            
            if criteria.get('city'):
                query += " AND city LIKE ?"
                params.append(f"%{criteria['city']}%")
            
            if criteria.get('star_rating'):
                query += " AND star_rating >= ?"
                params.append(criteria['star_rating'])
            
            if criteria.get('max_price'):
                query += " AND base_price <= ?"
                params.append(criteria['max_price'])
            
            if criteria.get('amenities'):
                amenities = criteria['amenities']
                for amenity in amenities:
                    query += " AND amenities LIKE ?"
                    params.append(f"%{amenity}%")
            
            query += " AND status = 'active'"
            
            self.cursor.execute(query, params)
            hotels = self.cursor.fetchall()
            
            # Convert to list of dictionaries
            hotel_list = []
            for hotel in hotels:
                hotel_dict = {
                    'hotel_id': hotel[0], 'name': hotel[1], 'chain': hotel[2],
                    'star_rating': hotel[3], 'address': hotel[4], 'city': hotel[5],
                    'country': hotel[6], 'phone': hotel[7], 'email': hotel[8],
                    'website': hotel[9], 'amenities': json.loads(hotel[10]),
                    'room_types': json.loads(hotel[11]), 'total_rooms': hotel[12],
                    'available_rooms': hotel[13], 'base_price': hotel[14],
                    'currency': hotel[15], 'check_in_time': hotel[16],
                    'check_out_time': hotel[17], 'status': hotel[18]
                }
                hotel_list.append(hotel_dict)
            
            return hotel_list
            
        except Exception as e:
            logger.error(f"Failed to search hotels: {e}")
            return []
    
    def check_room_availability(self, hotel_id: str, check_in: str, check_out: str, guests: int) -> List[Dict[str, Any]]:
        """Check room availability for given dates and guest count"""
        try:
            self.cursor.execute("""
                SELECT r.* FROM rooms r
                WHERE r.hotel_id = ? AND r.capacity >= ? AND r.status = 'available'
                AND r.room_id NOT IN (
                    SELECT DISTINCT room_id FROM hotel_bookings
                    WHERE hotel_id = ? AND status IN ('confirmed', 'pending')
                    AND (
                        (check_in_date <= ? AND check_out_date >= ?) OR
                        (check_in_date <= ? AND check_out_date >= ?) OR
                        (check_in_date >= ? AND check_out_date <= ?)
                    )
                )
            """, (hotel_id, guests, hotel_id, check_in, check_in, check_out, check_out, check_in, check_out))
            
            available_rooms = self.cursor.fetchall()
            
            room_list = []
            for room in available_rooms:
                room_dict = {
                    'room_id': room[0], 'hotel_id': room[1], 'room_number': room[2],
                    'room_type': room[3], 'floor': room[4], 'capacity': room[5],
                    'amenities': json.loads(room[6]), 'price_per_night': room[7],
                    'status': room[8], 'last_cleaned': room[9], 'notes': room[10]
                }
                room_list.append(room_dict)
            
            return room_list
            
        except Exception as e:
            logger.error(f"Failed to check room availability: {e}")
            return []
    
    def cancel_booking(self, booking_id: str) -> bool:
        """Cancel a hotel booking"""
        try:
            # Get booking details
            self.cursor.execute("SELECT room_id, status FROM hotel_bookings WHERE booking_id = ?", (booking_id,))
            booking = self.cursor.fetchone()
            
            if not booking:
                raise ValueError("Booking not found")
            
            if booking[1] in ['cancelled', 'completed']:
                raise ValueError("Cannot cancel this booking")
            
            # Update booking status
            self.cursor.execute("""
                UPDATE hotel_bookings SET status = 'cancelled' WHERE booking_id = ?
            """, (booking_id,))
            
            # Update room availability
            self._update_room_availability(booking[0], 'available')
            
            self.conn.commit()
            logger.info(f"Booking {booking_id} cancelled successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to cancel booking: {e}")
            return False
    
    def get_booking_details(self, booking_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed information about a booking"""
        try:
            self.cursor.execute("""
                SELECT hb.*, h.name as hotel_name, r.room_number, r.room_type
                FROM hotel_bookings hb
                JOIN hotels h ON hb.hotel_id = h.hotel_id
                JOIN rooms r ON hb.room_id = r.room_id
                WHERE hb.booking_id = ?
            """, (booking_id,))
            
            booking = self.cursor.fetchone()
            if not booking:
                return None
            
            return {
                'booking_id': booking[0], 'hotel_id': booking[1], 'room_id': booking[2],
                'customer_id': booking[3], 'check_in_date': booking[4],
                'check_out_date': booking[5], 'guests': booking[6],
                'total_cost': booking[7], 'status': booking[8],
                'booking_date': booking[9], 'payment_status': booking[10],
                'special_requests': booking[11], 'agent_id': booking[12],
                'confirmation_number': booking[13], 'hotel_name': booking[14],
                'room_number': booking[15], 'room_type': booking[16]
            }
            
        except Exception as e:
            logger.error(f"Failed to get booking details: {e}")
            return None
    
    def _validate_booking(self, booking_data: Dict[str, Any]) -> bool:
        """Validate booking data"""
        required_fields = ['hotel_id', 'room_id', 'customer_id', 'check_in_date', 'check_out_date', 'guests']
        
        for field in required_fields:
            if field not in booking_data:
                logger.error(f"Missing required field: {field}")
                return False
        
        # Check if dates are valid
        try:
            check_in = datetime.strptime(booking_data['check_in_date'], '%Y-%m-%d')
            check_out = datetime.strptime(booking_data['check_out_date'], '%Y-%m-%d')
            
            if check_in >= check_out:
                logger.error("Check-in date must be before check-out date")
                return False
            
            if check_in < datetime.now():
                logger.error("Check-in date cannot be in the past")
                return False
                
        except ValueError:
            logger.error("Invalid date format")
            return False
        
        # Check guest count
        if booking_data['guests'] <= 0 or booking_data['guests'] > 4:
            logger.error("Invalid guest count")
            return False
        
        return True
    
    def _update_room_availability(self, room_id: str, status: str):
        """Update room availability status"""
        self.cursor.execute("UPDATE rooms SET status = ? WHERE room_id = ?", (status, room_id))
    
    def _generate_confirmation_number(self) -> str:
        """Generate unique confirmation number"""
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        random_suffix = str(uuid.uuid4())[:8].upper()
        return f"HM{timestamp}{random_suffix}"
    
    def _price_monitoring_service(self):
        """Background service for monitoring price changes"""
        while True:
            try:
                # Monitor competitor prices
                # Update dynamic pricing
                # Log price changes
                time.sleep(3600)  # Check every hour
            except Exception as e:
                logger.error(f"Price monitoring service error: {e}")
                time.sleep(60)
    
    def _availability_monitoring_service(self):
        """Background service for monitoring room availability"""
        while True:
            try:
                # Update room availability
                # Process check-ins/check-outs
                # Update cleaning schedules
                time.sleep(300)  # Check every 5 minutes
            except Exception as e:
                logger.error(f"Availability monitoring service error: {e}")
                time.sleep(60)
    
    def _notification_processing_service(self):
        """Background service for processing notifications"""
        while True:
            try:
                # Send booking confirmations
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
            self.cursor.execute("SELECT COUNT(*) FROM hotels WHERE status = 'active'")
            active_hotels = self.cursor.fetchone()[0]
            
            self.cursor.execute("SELECT COUNT(*) FROM rooms WHERE status = 'available'")
            available_rooms = self.cursor.fetchone()[0]
            
            self.cursor.execute("SELECT COUNT(*) FROM hotel_bookings WHERE status = 'confirmed'")
            active_bookings = self.cursor.fetchone()[0]
            
            return {
                'system_name': self.system_name,
                'version': self.version,
                'status': 'operational',
                'active_hotels': active_hotels,
                'available_rooms': available_rooms,
                'active_bookings': active_bookings,
                'database_path': str(self.database_path),
                'background_services': 'running'
            }
            
        except Exception as e:
            logger.error(f"Failed to get system status: {e}")
            return {'status': 'error', 'error': str(e)}

if __name__ == "__main__":
    # Initialize and test the hotel manager
    try:
        hotel_manager = MaijdHotelManager()
        
        # Test system status
        status = hotel_manager.get_system_status()
        print(f"Hotel Manager Status: {status}")
        
        print("Maijd Hotel Manager initialized successfully!")
        print("Use the class methods to manage hotels, rooms, and bookings.")
        
    except Exception as e:
        print(f"Failed to initialize Hotel Manager: {e}")
        sys.exit(1)
