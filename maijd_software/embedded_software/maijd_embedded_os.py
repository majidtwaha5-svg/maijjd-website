#!/usr/bin/env python3
"""
Maijd Embedded OS - Lightweight Embedded Operating System
Advanced embedded system with IoT, edge computing, and real-time capabilities
"""

import os
import sys
import json
import time
import logging
import threading
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, asdict
from pathlib import Path
import hashlib
import secrets
import ssl
import socket
import base64
import io

# Enhanced embedded system imports
try:
    import numpy as np
    import psutil
    import redis
    EMBEDDED_AVAILABLE = True
except ImportError:
    EMBEDDED_AVAILABLE = False
    print("Embedded system libraries not available. Install with: pip install numpy psutil redis")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class EmbeddedDevice:
    """Embedded device information"""
    id: str
    name: str
    device_type: str
    hardware_specs: Dict[str, Any]
    firmware_version: str
    capabilities: List[str]
    status: str
    last_seen: datetime
    ip_address: str
    mac_address: str
    location: Dict[str, float]
    sensors: List[str]
    actuators: List[str]

@dataclass
class IoTDevice:
    """IoT device with edge computing capabilities"""
    device_id: str
    device_name: str
    device_type: str
    protocol: str  # MQTT, CoAP, HTTP, WebSocket
    data_format: str  # JSON, CBOR, Protocol Buffers
    encryption: bool
    authentication: bool
    edge_computing: bool
    cloud_sync: bool
    last_data: Dict[str, Any]
    battery_level: Optional[float]
    signal_strength: Optional[float]

@dataclass
class RealTimeTask:
    """Real-time task definition"""
    task_id: str
    task_name: str
    priority: int
    deadline: float  # milliseconds
    period: float  # milliseconds
    execution_time: float  # milliseconds
    status: str  # ready, running, blocked, completed
    created_at: datetime
    last_execution: Optional[datetime]

class MaijdEmbeddedOS:
    """
    Advanced embedded operating system with IoT and edge computing capabilities
    """
    
    def __init__(self):
        self.version = "2024.1.0"
        self.os_type = "embedded"
        self.architecture = "ARM64"
        self.kernel_version = "5.15.0"
        self.features = [
            "Real-time scheduling",
            "IoT device management",
            "Edge computing",
            "Low power management",
            "Secure boot",
            "Over-the-air updates",
            "Device provisioning",
            "Sensor fusion",
            "Actuator control",
            "Network stack",
            "File system",
            "Memory management",
            "Process management",
            "Interrupt handling",
            "Power management"
        ]
        
        self.embedded_devices: Dict[str, EmbeddedDevice] = {}
        self.iot_devices: Dict[str, IoTDevice] = {}
        self.real_time_tasks: Dict[str, RealTimeTask] = {}
        self.system_resources = {
            'cpu_usage': 0.0,
            'memory_usage': 0.0,
            'disk_usage': 0.0,
            'network_io': {'rx': 0, 'tx': 0},
            'power_consumption': 0.0
        }
        
        self.edge_computing_enabled = True
        self.iot_protocols = ['MQTT', 'CoAP', 'HTTP', 'WebSocket']
        self.security_features = ['secure_boot', 'encryption', 'authentication', 'access_control']
        
        # Initialize embedded system
        self.initialize_system()
    
    def initialize_system(self):
        """Initialize the embedded operating system"""
        logger.info("Initializing Maijd Embedded OS...")
        
        # Initialize real-time scheduler
        self.rt_scheduler = RealTimeScheduler()
        
        # Initialize IoT manager
        self.iot_manager = IoTDeviceManager()
        
        # Initialize edge computing engine
        self.edge_engine = EdgeComputingEngine()
        
        # Initialize security manager
        self.security_manager = SecurityManager()
        
        # Initialize power management
        self.power_manager = PowerManager()
        
        logger.info("Maijd Embedded OS initialized successfully")
    
    def register_device(self, device_info: Dict[str, Any]) -> str:
        """Register a new embedded device"""
        device_id = str(secrets.token_hex(8))
        
        device = EmbeddedDevice(
            id=device_id,
            name=device_info.get('name', f'Device_{device_id}'),
            device_type=device_info.get('type', 'unknown'),
            hardware_specs=device_info.get('hardware', {}),
            firmware_version=device_info.get('firmware', '1.0.0'),
            capabilities=device_info.get('capabilities', []),
            status='active',
            last_seen=datetime.now(),
            ip_address=device_info.get('ip_address', ''),
            mac_address=device_info.get('mac_address', ''),
            location=device_info.get('location', {'lat': 0.0, 'lon': 0.0}),
            sensors=device_info.get('sensors', []),
            actuators=device_info.get('actuators', [])
        )
        
        self.embedded_devices[device_id] = device
        logger.info(f"Registered device: {device.name} ({device_id})")
        
        return device_id
    
    def register_iot_device(self, device_info: Dict[str, Any]) -> str:
        """Register a new IoT device"""
        device_id = str(secrets.token_hex(8))
        
        device = IoTDevice(
            device_id=device_id,
            device_name=device_info.get('name', f'IoT_Device_{device_id}'),
            device_type=device_info.get('type', 'sensor'),
            protocol=device_info.get('protocol', 'MQTT'),
            data_format=device_info.get('data_format', 'JSON'),
            encryption=device_info.get('encryption', True),
            authentication=device_info.get('authentication', True),
            edge_computing=device_info.get('edge_computing', False),
            cloud_sync=device_info.get('cloud_sync', True),
            last_data=device_info.get('last_data', {}),
            battery_level=device_info.get('battery_level'),
            signal_strength=device_info.get('signal_strength')
        )
        
        self.iot_devices[device_id] = device
        logger.info(f"Registered IoT device: {device.device_name} ({device_id})")
        
        return device_id
    
    def create_real_time_task(self, task_info: Dict[str, Any]) -> str:
        """Create a new real-time task"""
        task_id = str(secrets.token_hex(8))
        
        task = RealTimeTask(
            task_id=task_id,
            task_name=task_info.get('name', f'Task_{task_id}'),
            priority=task_info.get('priority', 1),
            deadline=task_info.get('deadline', 100.0),
            period=task_info.get('period', 100.0),
            execution_time=task_info.get('execution_time', 10.0),
            status='ready',
            created_at=datetime.now(),
            last_execution=None
        )
        
        self.real_time_tasks[task_id] = task
        self.rt_scheduler.add_task(task)
        logger.info(f"Created real-time task: {task.task_name} ({task_id})")
        
        return task_id
    
    def start_real_time_scheduler(self):
        """Start the real-time task scheduler"""
        logger.info("Starting real-time task scheduler...")
        self.rt_scheduler.start()
        logger.info("Real-time task scheduler started")
    
    def stop_real_time_scheduler(self):
        """Stop the real-time task scheduler"""
        logger.info("Stopping real-time task scheduler...")
        self.rt_scheduler.stop()
        logger.info("Real-time task scheduler stopped")
    
    def get_system_status(self) -> Dict[str, Any]:
        """Get comprehensive system status"""
        return {
            'os_info': {
                'name': 'Maijd Embedded OS',
                'version': self.version,
                'architecture': self.architecture,
                'kernel_version': self.kernel_version
            },
            'system_resources': self.system_resources,
            'device_count': len(self.embedded_devices),
            'iot_device_count': len(self.iot_devices),
            'active_tasks': len([t for t in self.real_time_tasks.values() if t.status == 'running']),
            'features': self.features,
            'edge_computing': self.edge_computing_enabled,
            'security_features': self.security_features
        }
    
    def update_system_resources(self):
        """Update system resource usage"""
        if EMBEDDED_AVAILABLE:
            try:
                self.system_resources['cpu_usage'] = psutil.cpu_percent(interval=1)
                self.system_resources['memory_usage'] = psutil.virtual_memory().percent
                self.system_resources['disk_usage'] = psutil.disk_usage('/').percent
                
                # Network I/O
                net_io = psutil.net_io_counters()
                self.system_resources['network_io']['rx'] = net_io.bytes_recv
                self.system_resources['network_io']['tx'] = net_io.bytes_sent
                
                # Estimate power consumption (simplified)
                self.system_resources['power_consumption'] = (
                    self.system_resources['cpu_usage'] * 0.3 +
                    self.system_resources['memory_usage'] * 0.2 +
                    (self.system_resources['network_io']['rx'] + self.system_resources['network_io']['tx']) / 1000000 * 0.1
                )
            except Exception as e:
                logger.error(f"Failed to update system resources: {e}")
    
    def perform_edge_computing(self, device_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Perform edge computing on device data"""
        if device_id not in self.iot_devices:
            return {'error': 'Device not found'}
        
        device = self.iot_devices[device_id]
        if not device.edge_computing:
            return {'error': 'Edge computing not enabled for this device'}
        
        # Process data at the edge
        result = self.edge_engine.process_data(data, device.device_type)
        
        # Update device data
        device.last_data = data
        device.last_data['edge_processed'] = True
        device.last_data['edge_result'] = result
        
        return {
            'device_id': device_id,
            'edge_processed': True,
            'result': result,
            'timestamp': datetime.now().isoformat()
        }
    
    def get_device_list(self) -> List[Dict[str, Any]]:
        """Get list of all registered devices"""
        devices = []
        
        # Add embedded devices
        for device in self.embedded_devices.values():
            devices.append({
                'id': device.id,
                'name': device.name,
                'type': 'embedded',
                'device_type': device.device_type,
                'status': device.status,
                'capabilities': device.capabilities
            })
        
        # Add IoT devices
        for device in self.iot_devices.values():
            devices.append({
                'id': device.device_id,
                'name': device.device_name,
                'type': 'iot',
                'device_type': device.device_type,
                'protocol': device.protocol,
                'edge_computing': device.edge_computing
            })
        
        return devices
    
    def get_task_list(self) -> List[Dict[str, Any]]:
        """Get list of all real-time tasks"""
        tasks = []
        for task in self.real_time_tasks.values():
            tasks.append({
                'id': task.task_id,
                'name': task.task_name,
                'priority': task.priority,
                'deadline': task.deadline,
                'status': task.status,
                'created_at': task.created_at.isoformat()
            })
        return tasks

class RealTimeScheduler:
    """Real-time task scheduler"""
    
    def __init__(self):
        self.tasks: List[RealTimeTask] = []
        self.running = False
        self.scheduler_thread = None
    
    def add_task(self, task: RealTimeTask):
        """Add a task to the scheduler"""
        self.tasks.append(task)
        # Sort by priority (higher priority first)
        self.tasks.sort(key=lambda x: x.priority, reverse=True)
    
    def start(self):
        """Start the scheduler"""
        if not self.running:
            self.running = True
            self.scheduler_thread = threading.Thread(target=self._scheduler_loop)
            self.scheduler_thread.daemon = True
            self.scheduler_thread.start()
    
    def stop(self):
        """Stop the scheduler"""
        self.running = False
        if self.scheduler_thread:
            self.scheduler_thread.join()
    
    def _scheduler_loop(self):
        """Main scheduler loop"""
        while self.running:
            current_time = datetime.now()
            
            for task in self.tasks:
                if task.status == 'ready':
                    # Check if task can be executed
                    if self._can_execute_task(task, current_time):
                        self._execute_task(task)
            
            time.sleep(0.001)  # 1ms tick
    
    def _can_execute_task(self, task: RealTimeTask, current_time: datetime) -> bool:
        """Check if a task can be executed"""
        if task.last_execution is None:
            return True
        
        time_since_last = (current_time - task.last_execution).total_seconds() * 1000
        return time_since_last >= task.period
    
    def _execute_task(self, task: RealTimeTask):
        """Execute a task"""
        task.status = 'running'
        task.last_execution = datetime.now()
        
        # Simulate task execution
        time.sleep(task.execution_time / 1000)  # Convert to seconds
        
        task.status = 'completed'
        logger.info(f"Executed task: {task.task_name}")

class IoTDeviceManager:
    """IoT device management"""
    
    def __init__(self):
        self.devices: Dict[str, IoTDevice] = {}
        self.protocols = {
            'MQTT': self._handle_mqtt,
            'CoAP': self._handle_coap,
            'HTTP': self._handle_http,
            'WebSocket': self._handle_websocket
        }
    
    def handle_device_data(self, device_id: str, protocol: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle incoming device data"""
        if protocol in self.protocols:
            return self.protocols[protocol](device_id, data)
        else:
            return {'error': f'Unsupported protocol: {protocol}'}
    
    def _handle_mqtt(self, device_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle MQTT protocol data"""
        return {
            'protocol': 'MQTT',
            'device_id': device_id,
            'status': 'processed',
            'timestamp': datetime.now().isoformat()
        }
    
    def _handle_coap(self, device_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle CoAP protocol data"""
        return {
            'protocol': 'CoAP',
            'device_id': device_id,
            'status': 'processed',
            'timestamp': datetime.now().isoformat()
        }
    
    def _handle_http(self, device_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle HTTP protocol data"""
        return {
            'protocol': 'HTTP',
            'device_id': device_id,
            'status': 'processed',
            'timestamp': datetime.now().isoformat()
        }
    
    def _handle_websocket(self, device_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle WebSocket protocol data"""
        return {
            'protocol': 'WebSocket',
            'device_id': device_id,
            'status': 'processed',
            'timestamp': datetime.now().isoformat()
        }

class EdgeComputingEngine:
    """Edge computing engine for IoT devices"""
    
    def __init__(self):
        self.processing_models = {}
        self.cache = {}
    
    def process_data(self, data: Dict[str, Any], device_type: str) -> Dict[str, Any]:
        """Process data at the edge"""
        # Simple edge processing based on device type
        if device_type == 'sensor':
            return self._process_sensor_data(data)
        elif device_type == 'actuator':
            return self._process_actuator_data(data)
        elif device_type == 'camera':
            return self._process_camera_data(data)
        else:
            return self._process_generic_data(data)
    
    def _process_sensor_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process sensor data at the edge"""
        processed = {
            'type': 'sensor_data',
            'processed_at': datetime.now().isoformat(),
            'data_quality': 'high',
            'anomaly_detected': False
        }
        
        # Simple anomaly detection
        if 'value' in data:
            value = float(data['value'])
            if value > 100 or value < -100:
                processed['anomaly_detected'] = True
                processed['alert'] = 'Value out of normal range'
        
        return processed
    
    def _process_actuator_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process actuator data at the edge"""
        return {
            'type': 'actuator_data',
            'processed_at': datetime.now().isoformat(),
            'action_required': True,
            'status': 'ready'
        }
    
    def _process_camera_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process camera data at the edge"""
        return {
            'type': 'camera_data',
            'processed_at': datetime.now().isoformat(),
            'objects_detected': 0,
            'motion_detected': False
        }
    
    def _process_generic_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process generic data at the edge"""
        return {
            'type': 'generic_data',
            'processed_at': datetime.now().isoformat(),
            'data_size': len(str(data)),
            'processed': True
        }

class SecurityManager:
    """Security management for embedded system"""
    
    def __init__(self):
        self.encryption_enabled = True
        self.authentication_enabled = True
        self.access_control_enabled = True
    
    def encrypt_data(self, data: str) -> str:
        """Encrypt data"""
        if self.encryption_enabled:
            # Simple encryption (in production, use proper encryption)
            return base64.b64encode(data.encode()).decode()
        return data
    
    def decrypt_data(self, encrypted_data: str) -> str:
        """Decrypt data"""
        if self.encryption_enabled:
            try:
                return base64.b64decode(encrypted_data.encode()).decode()
            except:
                return encrypted_data
        return encrypted_data
    
    def authenticate_device(self, device_id: str, credentials: Dict[str, Any]) -> bool:
        """Authenticate a device"""
        if not self.authentication_enabled:
            return True
        
        # Simple authentication (in production, use proper auth)
        return credentials.get('api_key') == f'key_{device_id}'
    
    def check_access(self, device_id: str, resource: str) -> bool:
        """Check device access to resource"""
        if not self.access_control_enabled:
            return True
        
        # Simple access control (in production, use proper RBAC)
        return True

class PowerManager:
    """Power management for embedded system"""
    
    def __init__(self):
        self.power_mode = 'normal'  # normal, low_power, sleep
        self.battery_level = 100.0
        self.power_consumption = 0.0
    
    def set_power_mode(self, mode: str):
        """Set power mode"""
        if mode in ['normal', 'low_power', 'sleep']:
            self.power_mode = mode
            logger.info(f"Power mode set to: {mode}")
    
    def get_power_status(self) -> Dict[str, Any]:
        """Get power status"""
        return {
            'mode': self.power_mode,
            'battery_level': self.battery_level,
            'power_consumption': self.power_consumption,
            'efficiency': 'high' if self.power_mode == 'low_power' else 'normal'
        }

def main():
    """Main function for testing"""
    print("🚀 Starting Maijd Embedded OS...")
    
    # Create embedded OS instance
    embedded_os = MaijdEmbeddedOS()
    
    # Register some devices
    device1_id = embedded_os.register_device({
        'name': 'Temperature Sensor',
        'type': 'sensor',
        'capabilities': ['temperature_reading', 'humidity_reading'],
        'sensors': ['temperature', 'humidity'],
        'ip_address': '192.168.1.100'
    })
    
    device2_id = embedded_os.register_device({
        'name': 'Smart Actuator',
        'type': 'actuator',
        'capabilities': ['motor_control', 'led_control'],
        'actuators': ['motor', 'led'],
        'ip_address': '192.168.1.101'
    })
    
    # Register IoT device
    iot_device_id = embedded_os.register_iot_device({
        'name': 'Smart Camera',
        'type': 'camera',
        'protocol': 'MQTT',
        'edge_computing': True,
        'cloud_sync': True
    })
    
    # Create real-time task
    task_id = embedded_os.create_real_time_task({
        'name': 'Sensor Reading Task',
        'priority': 5,
        'deadline': 50.0,
        'period': 100.0,
        'execution_time': 5.0
    })
    
    # Start real-time scheduler
    embedded_os.start_real_time_scheduler()
    
    # Get system status
    status = embedded_os.get_system_status()
    print(f"System Status: {json.dumps(status, indent=2, default=str)}")
    
    # Get device list
    devices = embedded_os.get_device_list()
    print(f"Registered Devices: {json.dumps(devices, indent=2, default=str)}")
    
    # Get task list
    tasks = embedded_os.get_task_list()
    print(f"Real-time Tasks: {json.dumps(tasks, indent=2, default=str)}")
    
    # Simulate some operations
    time.sleep(2)
    
    # Stop scheduler
    embedded_os.stop_real_time_scheduler()
    
    print("✅ Maijd Embedded OS test completed")

if __name__ == "__main__":
    main()
