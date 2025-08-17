#!/usr/bin/env python3
"""
Maijd ERP Suite - Enterprise Resource Planning System
Comprehensive ERP solution for modern businesses with AI-powered insights
"""

import os
import sys
import json
import time
import logging
import threading
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, asdict
from pathlib import Path
import sqlite3
import hashlib
import uuid

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class Customer:
    """Customer information data structure"""
    id: str
    name: str
    email: str
    phone: str
    address: str
    company: str
    credit_limit: float
    created_at: datetime
    updated_at: datetime
    status: str

@dataclass
class Product:
    """Product information data structure"""
    id: str
    name: str
    description: str
    category: str
    sku: str
    price: float
    cost: float
    quantity: int
    min_quantity: int
    supplier_id: str
    created_at: datetime
    updated_at: datetime

@dataclass
class Order:
    """Order information data structure"""
    id: str
    customer_id: str
    order_date: datetime
    status: str
    total_amount: float
    items: List[Dict[str, Any]]
    shipping_address: str
    payment_method: str
    created_at: datetime
    updated_at: datetime

@dataclass
class Supplier:
    """Supplier information data structure"""
    id: str
    name: str
    contact_person: str
    email: str
    phone: str
    address: str
    payment_terms: str
    rating: float
    created_at: datetime
    updated_at: datetime

@dataclass
class Employee:
    """Employee information data structure"""
    id: str
    name: str
    email: str
    phone: str
    department: str
    position: str
    salary: float
    hire_date: datetime
    status: str
    created_at: datetime
    updated_at: datetime

@dataclass
class FinancialTransaction:
    """Financial transaction data structure"""
    id: str
    transaction_type: str
    amount: float
    description: str
    account: str
    date: datetime
    reference: str
    created_at: datetime

class MaijdERPSuite:
    """
    Comprehensive ERP system with integrated business modules
    """
    
    def __init__(self, config_path: str = "erp_config.json"):
        self.config_path = config_path
        self.config = self.load_config()
        self.db_path = self.config.get("database", {}).get("path", "erp_database.db")
        
        # Initialize modules
        self.customer_manager = CustomerManager(self.db_path)
        self.product_manager = ProductManager(self.db_path)
        self.order_manager = OrderManager(self.db_path)
        self.supplier_manager = SupplierManager(self.db_path)
        self.employee_manager = EmployeeManager(self.db_path)
        self.financial_manager = FinancialManager(self.db_path)
        self.inventory_manager = InventoryManager(self.db_path)
        self.reporting_engine = ReportingEngine(self.db_path)
        
        # Initialize database
        self.initialize_database()
        
        logger.info("Maijd ERP Suite initialized successfully")
    
    def load_config(self) -> Dict[str, Any]:
        """Load ERP configuration"""
        default_config = {
            "database": {
                "path": "erp_database.db",
                "backup_enabled": True,
                "auto_backup_interval": 24  # hours
            },
            "modules": {
                "customers": True,
                "products": True,
                "orders": True,
                "suppliers": True,
                "employees": True,
                "financials": True,
                "inventory": True,
                "reporting": True
            },
            "security": {
                "encryption_enabled": True,
                "user_authentication": True,
                "audit_logging": True
            }
        }
        
        try:
            if os.path.exists(self.config_path):
                with open(self.config_path, 'r') as f:
                    config = json.load(f)
                    return {**default_config, **config}
            else:
                self.save_config(default_config)
                return default_config
        except Exception as e:
            logger.error(f"Error loading config: {e}")
            return default_config
    
    def save_config(self, config: Dict[str, Any]) -> None:
        """Save ERP configuration"""
        try:
            with open(self.config_path, 'w') as f:
                json.dump(config, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving config: {e}")
    
    def initialize_database(self) -> None:
        """Initialize ERP database with all required tables"""
        try:
            self.customer_manager.create_tables()
            self.product_manager.create_tables()
            self.order_manager.create_tables()
            self.supplier_manager.create_tables()
            self.employee_manager.create_tables()
            self.financial_manager.create_tables()
            self.inventory_manager.create_tables()
            
            logger.info("ERP database initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing database: {e}")
    
    def get_system_status(self) -> Dict[str, Any]:
        """Get overall ERP system status"""
        try:
            status = {
                'status': 'operational',
                'timestamp': datetime.now().isoformat(),
                'modules': {
                    'customers': self.customer_manager.get_count(),
                    'products': self.product_manager.get_count(),
                    'orders': self.order_manager.get_count(),
                    'suppliers': self.supplier_manager.get_count(),
                    'employees': self.employee_manager.get_count(),
                    'financials': self.financial_manager.get_count(),
                    'inventory': self.inventory_manager.get_count()
                },
                'database': {
                    'path': self.db_path,
                    'size': os.path.getsize(self.db_path) if os.path.exists(self.db_path) else 0
                }
            }
            return status
        except Exception as e:
            logger.error(f"Error getting system status: {e}")
            return {'status': 'error', 'error': str(e)}
    
    def backup_system(self) -> Dict[str, Any]:
        """Create system backup"""
        try:
            backup_dir = f"backups/erp_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            os.makedirs(backup_dir, exist_ok=True)
            
            # Backup database
            import shutil
            shutil.copy2(self.db_path, backup_dir)
            
            # Backup configuration
            shutil.copy2(self.config_path, backup_dir)
            
            return {
                'status': 'success',
                'backup_path': backup_dir,
                'timestamp': datetime.now().isoformat(),
                'message': 'ERP system backup created successfully'
            }
        except Exception as e:
            logger.error(f"Error creating backup: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }

class CustomerManager:
    """Customer relationship management"""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
    
    def create_tables(self) -> None:
        """Create customer tables"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS customers (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE,
                    phone TEXT,
                    address TEXT,
                    company TEXT,
                    credit_limit REAL DEFAULT 0.0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status TEXT DEFAULT 'active'
                )
            ''')
            
            conn.commit()
            conn.close()
            logger.info("Customer tables created successfully")
        except Exception as e:
            logger.error(f"Error creating customer tables: {e}")
    
    def add_customer(self, customer_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add new customer"""
        try:
            customer_id = str(uuid.uuid4())
            customer = Customer(
                id=customer_id,
                name=customer_data['name'],
                email=customer_data.get('email', ''),
                phone=customer_data.get('phone', ''),
                address=customer_data.get('address', ''),
                company=customer_data.get('company', ''),
                credit_limit=customer_data.get('credit_limit', 0.0),
                created_at=datetime.now(),
                updated_at=datetime.now(),
                status='active'
            )
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO customers (id, name, email, phone, address, company, credit_limit, created_at, updated_at, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                customer.id, customer.name, customer.email, customer.phone,
                customer.address, customer.company, customer.credit_limit,
                customer.created_at.isoformat(), customer.updated_at.isoformat(),
                customer.status
            ))
            
            conn.commit()
            conn.close()
            
            return {
                'status': 'success',
                'customer_id': customer_id,
                'message': 'Customer added successfully'
            }
        except Exception as e:
            logger.error(f"Error adding customer: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }
    
    def get_customer(self, customer_id: str) -> Optional[Customer]:
        """Get customer by ID"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('SELECT * FROM customers WHERE id = ?', (customer_id,))
            row = cursor.fetchone()
            
            conn.close()
            
            if row:
                return Customer(
                    id=row[0], name=row[1], email=row[2], phone=row[3],
                    address=row[4], company=row[5], credit_limit=row[6],
                    created_at=datetime.fromisoformat(row[7]),
                    updated_at=datetime.fromisoformat(row[8]), status=row[9]
                )
            return None
        except Exception as e:
            logger.error(f"Error getting customer: {e}")
            return None
    
    def get_count(self) -> int:
        """Get total customer count"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('SELECT COUNT(*) FROM customers')
            count = cursor.fetchone()[0]
            
            conn.close()
            return count
        except Exception as e:
            logger.error(f"Error getting customer count: {e}")
            return 0

class ProductManager:
    """Product catalog management"""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
    
    def create_tables(self) -> None:
        """Create product tables"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS products (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    description TEXT,
                    category TEXT,
                    sku TEXT UNIQUE,
                    price REAL NOT NULL,
                    cost REAL NOT NULL,
                    quantity INTEGER DEFAULT 0,
                    min_quantity INTEGER DEFAULT 0,
                    supplier_id TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
            conn.close()
            logger.info("Product tables created successfully")
        except Exception as e:
            logger.error(f"Error creating product tables: {e}")
    
    def add_product(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add new product"""
        try:
            product_id = str(uuid.uuid4())
            product = Product(
                id=product_id,
                name=product_data['name'],
                description=product_data.get('description', ''),
                category=product_data.get('category', ''),
                sku=product_data.get('sku', ''),
                price=product_data['price'],
                cost=product_data['cost'],
                quantity=product_data.get('quantity', 0),
                min_quantity=product_data.get('min_quantity', 0),
                supplier_id=product_data.get('supplier_id', ''),
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO products (id, name, description, category, sku, price, cost, quantity, min_quantity, supplier_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                product.id, product.name, product.description, product.category,
                product.sku, product.price, product.cost, product.quantity,
                product.min_quantity, product.supplier_id,
                product.created_at.isoformat(), product.updated_at.isoformat()
            ))
            
            conn.commit()
            conn.close()
            
            return {
                'status': 'success',
                'product_id': product_id,
                'message': 'Product added successfully'
            }
        except Exception as e:
            logger.error(f"Error adding product: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }
    
    def get_count(self) -> int:
        """Get total product count"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('SELECT COUNT(*) FROM products')
            count = cursor.fetchone()[0]
            
            conn.close()
            return count
        except Exception as e:
            logger.error(f"Error getting product count: {e}")
            return 0

class OrderManager:
    """Order management system"""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
    
    def create_tables(self) -> None:
        """Create order tables"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS orders (
                    id TEXT PRIMARY KEY,
                    customer_id TEXT NOT NULL,
                    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status TEXT DEFAULT 'pending',
                    total_amount REAL NOT NULL,
                    items TEXT,
                    shipping_address TEXT,
                    payment_method TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
            conn.close()
            logger.info("Order tables created successfully")
        except Exception as e:
            logger.error(f"Error creating order tables: {e}")
    
    def create_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new order"""
        try:
            order_id = str(uuid.uuid4())
            order = Order(
                id=order_id,
                customer_id=order_data['customer_id'],
                order_date=datetime.now(),
                status='pending',
                total_amount=order_data['total_amount'],
                items=order_data.get('items', []),
                shipping_address=order_data.get('shipping_address', ''),
                payment_method=order_data.get('payment_method', ''),
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO orders (id, customer_id, order_date, status, total_amount, items, shipping_address, payment_method, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                order.id, order.customer_id, order.order_date.isoformat(),
                order.status, order.total_amount, json.dumps(order.items),
                order.shipping_address, order.payment_method,
                order.created_at.isoformat(), order.updated_at.isoformat()
            ))
            
            conn.commit()
            conn.close()
            
            return {
                'status': 'success',
                'order_id': order_id,
                'message': 'Order created successfully'
            }
        except Exception as e:
            logger.error(f"Error creating order: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }
    
    def get_count(self) -> int:
        """Get total order count"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('SELECT COUNT(*) FROM orders')
            count = cursor.fetchone()[0]
            
            conn.close()
            return count
        except Exception as e:
            logger.error(f"Error getting order count: {e}")
            return 0

class SupplierManager:
    """Supplier management system"""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
    
    def create_tables(self) -> None:
        """Create supplier tables"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS suppliers (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    contact_person TEXT,
                    email TEXT,
                    phone TEXT,
                    address TEXT,
                    payment_terms TEXT,
                    rating REAL DEFAULT 0.0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
            conn.close()
            logger.info("Supplier tables created successfully")
        except Exception as e:
            logger.error(f"Error creating supplier tables: {e}")
    
    def get_count(self) -> int:
        """Get total supplier count"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('SELECT COUNT(*) FROM suppliers')
            count = cursor.fetchone()[0]
            
            conn.close()
            return count
        except Exception as e:
            logger.error(f"Error getting supplier count: {e}")
            return 0

class EmployeeManager:
    """Employee management system"""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
    
    def create_tables(self) -> None:
        """Create employee tables"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS employees (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE,
                    phone TEXT,
                    department TEXT,
                    position TEXT,
                    salary REAL,
                    hire_date TIMESTAMP,
                    status TEXT DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
            conn.close()
            logger.info("Employee tables created successfully")
        except Exception as e:
            logger.error(f"Error creating employee tables: {e}")
    
    def get_count(self) -> int:
        """Get total employee count"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('SELECT COUNT(*) FROM employees')
            count = cursor.fetchone()[0]
            
            conn.close()
            return count
        except Exception as e:
            logger.error(f"Error getting employee count: {e}")
            return 0

class FinancialManager:
    """Financial management system"""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
    
    def create_tables(self) -> None:
        """Create financial tables"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS financial_transactions (
                    id TEXT PRIMARY KEY,
                    transaction_type TEXT NOT NULL,
                    amount REAL NOT NULL,
                    description TEXT,
                    account TEXT,
                    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    reference TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
            conn.close()
            logger.info("Financial tables created successfully")
        except Exception as e:
            logger.error(f"Error creating financial tables: {e}")
    
    def get_count(self) -> int:
        """Get total transaction count"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('SELECT COUNT(*) FROM financial_transactions')
            count = cursor.fetchone()[0]
            
            conn.close()
            return count
        except Exception as e:
            logger.error(f"Error getting transaction count: {e}")
            return 0

class InventoryManager:
    """Inventory management system"""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
    
    def create_tables(self) -> None:
        """Create inventory tables"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS inventory (
                    id TEXT PRIMARY KEY,
                    product_id TEXT NOT NULL,
                    quantity INTEGER DEFAULT 0,
                    location TEXT,
                    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
            conn.close()
            logger.info("Inventory tables created successfully")
        except Exception as e:
            logger.error(f"Error creating inventory tables: {e}")
    
    def get_count(self) -> int:
        """Get total inventory count"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('SELECT COUNT(*) FROM inventory')
            count = cursor.fetchone()[0]
            
            conn.close()
            return count
        except Exception as e:
            logger.error(f"Error getting inventory count: {e}")
            return 0

class ReportingEngine:
    """Reporting and analytics engine"""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
    
    def generate_sales_report(self, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        """Generate sales report for date range"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT COUNT(*), SUM(total_amount) FROM orders 
                WHERE order_date BETWEEN ? AND ?
            ''', (start_date.isoformat(), end_date.isoformat()))
            
            result = cursor.fetchone()
            conn.close()
            
            return {
                'period': f"{start_date.date()} to {end_date.date()}",
                'total_orders': result[0] or 0,
                'total_revenue': result[1] or 0.0,
                'generated_at': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error generating sales report: {e}")
            return {'error': str(e)}

def main():
    """Main function for testing"""
    try:
        # Initialize ERP Suite
        erp = MaijdERPSuite()
        
        # Get system status
        status = erp.get_system_status()
        print(f"ERP System Status: {status['status']}")
        print(f"Total Customers: {status['modules']['customers']}")
        print(f"Total Products: {status['modules']['products']}")
        print(f"Total Orders: {status['modules']['orders']}")
        
        # Add sample data
        customer_result = erp.customer_manager.add_customer({
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone': '+1234567890',
            'company': 'ABC Corp'
        })
        print(f"Customer Added: {customer_result['status']}")
        
        product_result = erp.product_manager.add_product({
            'name': 'Sample Product',
            'price': 99.99,
            'cost': 50.00,
            'category': 'Electronics'
        })
        print(f"Product Added: {product_result['status']}")
        
        # Create sample order
        order_result = erp.order_manager.create_order({
            'customer_id': customer_result['customer_id'],
            'total_amount': 99.99,
            'items': [{'product_id': product_result['product_id'], 'quantity': 1, 'price': 99.99}]
        })
        print(f"Order Created: {order_result['status']}")
        
        # Generate report
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        report = erp.reporting_engine.generate_sales_report(start_date, end_date)
        print(f"Sales Report: {report}")
        
        print("\nERP Suite is running. Press Ctrl+C to exit.")
        try:
            while True:
                time.sleep(10)
                status = erp.get_system_status()
                print(f"System Status: {status['status']}")
        except KeyboardInterrupt:
            print("\nShutting down ERP Suite...")
            
    except Exception as e:
        logger.error(f"Error in main: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
