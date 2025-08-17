#!/usr/bin/env python3
"""
Maijd Software Suite - Enhanced Web Dashboard
Web-based dashboard for real-time monitoring, analytics, and management
Enhanced to display all available software features and capabilities
"""

import os
import sys
import json
import time
import threading
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import logging
from flask import Flask, render_template, jsonify, request, redirect, url_for
from flask_socketio import SocketIO, emit
import sqlite3

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'maijd-software-suite-2024'
socketio = SocketIO(app)

class MaijdDashboard:
    """Enhanced web dashboard for Maijd Software Suite"""
    
    def __init__(self):
        # Use current directory for development, fallback to home directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        self.install_dir = current_dir
        self.db_path = os.path.join(self.install_dir, "maijd.db")
        self.config_path = os.path.join(self.install_dir, "advanced_config.json")
        self.load_config()
        
        # Software categories and features
        self.software_categories = {
            'ai_software': {
                'name': 'AI Software',
                'description': 'Artificial Intelligence and Machine Learning Tools',
                'icon': '🤖',
                'features': [
                    'Natural Language Processing', 'Computer Vision', 'Machine Learning',
                    'Speech Recognition', 'Sentiment Analysis', 'Text Generation',
                    'AI Model Training', 'Predictive Analytics', 'Neural Networks',
                    'Deep Learning', 'AI Optimization', 'Intelligent Automation',
                    'AI Assistant', 'Data Analytics', 'Business Intelligence AI'
                ]
            },
            'application_software': {
                'name': 'Application Software',
                'description': 'Business and Productivity Applications',
                'icon': '💼',
                'features': [
                    'Office Suite', 'ERP System', 'Design Studio', 'Video Editor',
                    'Collaboration Hub', 'Project Management', 'Document Management',
                    'Workflow Automation', 'Business Intelligence', 'Reporting Tools',
                    'Content Management', 'Task Management', 'Calendar Integration',
                    'Email Management', 'File Sharing'
                ]
            },
            'cloud_software': {
                'name': 'Cloud Software',
                'description': 'Cloud Computing and Deployment Solutions',
                'icon': '☁️',
                'features': [
                    'Cloud Deployment', 'Microservices', 'Serverless Computing',
                    'Edge Computing', 'Hybrid Cloud', 'Container Orchestration',
                    'Auto Scaling', 'Load Balancing', 'Cloud Monitoring',
                    'Cloud Security', 'Data Backup', 'Disaster Recovery',
                    'Multi-Region Deployment', 'Cloud Cost Optimization'
                ]
            },
            'crm_software': {
                'name': 'CRM Software',
                'description': 'Customer Relationship Management Solutions',
                'icon': '👥',
                'features': [
                    'Customer Service', 'Sales Management', 'Marketing Hub',
                    'Lead Management', 'Contact Management', 'Pipeline Tracking',
                    'Analytics Dashboard', 'Automation Tools', 'Integration APIs',
                    'Customer Portal', 'Support Ticket System', 'Sales Forecasting',
                    'Customer Analytics', 'Marketing Automation', 'Customer Feedback'
                ]
            },
            'crs_software': {
                'name': 'CRS Software',
                'description': 'Car Rental and Travel Management Systems',
                'icon': '🚗',
                'features': [
                    'Car Rental System', 'Flight Booking', 'Hotel Management',
                    'Travel Planning', 'Reservation Management', 'Customer Portal',
                    'Payment Processing', 'Inventory Management', 'Reporting System',
                    'Travel Insurance', 'Loyalty Program', 'Multi-language Support',
                    'Mobile App Integration', 'Real-time Availability', 'Dynamic Pricing'
                ]
            },
            'development_software': {
                'name': 'Development Software',
                'description': 'Software Development and Programming Tools',
                'icon': '💻',
                'features': [
                    'Development Studio', 'Code Editor', 'Debugging Tools',
                    'Version Control', 'Testing Framework', 'Build Automation',
                    'Code Analysis', 'Performance Profiling', 'Deployment Tools',
                    'API Development', 'Database Tools', 'Code Review',
                    'Continuous Integration', 'DevOps Tools', 'Code Quality Metrics'
                ]
            },
            'embedded_software': {
                'name': 'Embedded Software',
                'description': 'Embedded Systems and IoT Solutions',
                'icon': '🔌',
                'features': [
                    'Embedded OS', 'IoT Framework', 'Automotive OS',
                    'Medical Device Software', 'Industrial Controller',
                    'Real-time Systems', 'Device Management', 'Edge Computing',
                    'Sensor Integration', 'Firmware Development', 'Hardware Abstraction',
                    'Power Management', 'Security Protocols', 'Remote Monitoring',
                    'Over-the-Air Updates'
                ]
            },
            'programming_software': {
                'name': 'Programming Software',
                'description': 'Programming Language Tools and Frameworks',
                'icon': '🐍',
                'features': [
                    'Python Development', 'JavaScript Development', 'Java Development',
                    'C++ Development', 'Go Development', 'Code Analysis',
                    'Profiling Tools', 'Testing Frameworks', 'Documentation Tools',
                    'Package Management', 'IDE Integration', 'Code Generation',
                    'Refactoring Tools', 'Debugging Support', 'Performance Optimization'
                ]
            },
            'real_time_software': {
                'name': 'Real-time Software',
                'description': 'Real-time Processing and Control Systems',
                'icon': '⚡',
                'features': [
                    'Real-time System', 'Streaming Platform', 'IoT Platform',
                    'Gaming Engine', 'Control System', 'Data Processing',
                    'Event Handling', 'Performance Monitoring', 'Latency Optimization',
                    'Real-time Analytics', 'Live Data Processing', 'Synchronization',
                    'Time Management', 'Resource Allocation', 'Fault Tolerance'
                ]
            },
            'scientific_software': {
                'name': 'Scientific Software',
                'description': 'Scientific Computing and Research Tools',
                'icon': '🔬',
                'features': [
                    'Scientific Suite', 'Data Analysis', 'Statistical Modeling',
                    'Simulation Tools', 'Research Management', 'Publication Tools',
                    'Collaboration Platform', 'Data Visualization', 'Algorithm Library',
                    'Numerical Computing', 'Machine Learning', 'Bioinformatics',
                    'Chemistry Tools', 'Physics Simulation', 'Research Analytics'
                ]
            },
            'system_software': {
                'name': 'System Software',
                'description': 'Operating Systems and System Utilities',
                'icon': '🖥️',
                'features': [
                    'OS Pro', 'Server OS', 'System Optimizer', 'Security Suite',
                    'Driver Suite', 'System Monitoring', 'Performance Tuning',
                    'Backup Tools', 'Recovery Tools', 'System Maintenance',
                    'Network Management', 'Storage Management', 'Process Management',
                    'Memory Management', 'System Security'
                ]
            },
            'mobile_software': {
                'name': 'Mobile Software',
                'description': 'Mobile Applications and Development Tools',
                'icon': '📱',
                'features': [
                    'Mobile App Development', 'Cross-platform Apps', 'Native iOS Apps',
                    'Native Android Apps', 'Mobile UI/UX', 'Push Notifications',
                    'Offline Support', 'Mobile Analytics', 'App Store Management',
                    'Mobile Testing', 'Performance Optimization', 'Battery Optimization',
                    'Mobile Security', 'Location Services', 'Mobile Payments'
                ]
            },
            'security_software': {
                'name': 'Security Software',
                'description': 'Cybersecurity and Protection Solutions',
                'icon': '🔒',
                'features': [
                    'Threat Detection', 'Vulnerability Scanning', 'Firewall Management',
                    'Intrusion Prevention', 'Data Encryption', 'Access Control',
                    'Identity Management', 'Security Monitoring', 'Incident Response',
                    'Compliance Management', 'Penetration Testing', 'Security Auditing',
                    'Malware Protection', 'Network Security', 'Endpoint Protection'
                ]
            }
        }
    
    def load_config(self):
        """Load dashboard configuration"""
        if os.path.exists(self.config_path):
            with open(self.config_path, 'r') as f:
                self.config = json.load(f)
        else:
            self.config = {
                "dashboard_enabled": True,
                "port": 8080,
                "host": "0.0.0.0",
                "debug": False,
                "auto_refresh": True,
                "refresh_interval": 30
            }
            self.save_config()
    
    def save_config(self):
        """Save dashboard configuration"""
        with open(self.config_path, 'w') as f:
            json.dump(self.config, f, indent=2)
    
    def get_dashboard_data(self) -> Dict[str, Any]:
        """Get comprehensive dashboard data"""
        try:
            # Get installed software
            installed_software = self.get_installed_software()
            
            # Get performance metrics
            performance_metrics = self.get_performance_metrics()
            
            # Get AI insights
            ai_insights = self.get_ai_insights()
            
            # Get cloud deployments
            cloud_deployments = self.get_cloud_deployments()
            
            # Get security status
            security_status = self.get_security_status()
            
            # Get usage statistics
            usage_stats = self.get_usage_statistics()
            
            dashboard_data = {
                "timestamp": datetime.now().isoformat(),
                "installed_software": installed_software,
                "performance_metrics": performance_metrics,
                "ai_insights": ai_insights,
                "cloud_deployments": cloud_deployments,
                "security_status": security_status,
                "usage_statistics": usage_stats,
                "system_info": self.get_system_info(),
                "software_categories": self.software_categories,
                "total_features": self.get_total_features_count(),
                "feature_breakdown": self.get_feature_breakdown()
            }
            
            return dashboard_data
            
        except Exception as e:
            logger.error(f"Error getting dashboard data: {str(e)}")
            return {"error": str(e)}
    
    def get_total_features_count(self) -> int:
        """Get total count of available features"""
        total = 0
        for category in self.software_categories.values():
            total += len(category['features'])
        return total
    
    def get_feature_breakdown(self) -> Dict[str, Any]:
        """Get detailed breakdown of features by category"""
        breakdown = {}
        for category_id, category in self.software_categories.items():
            breakdown[category_id] = {
                'name': category['name'],
                'icon': category['icon'],
                'feature_count': len(category['features']),
                'features': category['features']
            }
        return breakdown
    
    def get_installed_software(self) -> List[Dict[str, Any]]:
        """Get list of installed software"""
        config_file = os.path.join(self.install_dir, "config", "installed_software.json")
        if os.path.exists(config_file):
            with open(config_file, 'r') as f:
                config = json.load(f)
                return [
                    {
                        "id": software_id,
                        "version": info["version"],
                        "category": software_id,  # Use software_id as category
                        "installed_at": info["installed_at"],
                        "path": info["path"]
                    }
                    for software_id, info in config.get("installed_software", {}).items()
                ]
        return []
    
    def get_performance_metrics(self) -> List[Dict[str, Any]]:
        """Get performance metrics from database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT software_id, AVG(cpu_usage) as avg_cpu, AVG(memory_usage) as avg_memory, 
                       AVG(response_time) as avg_response, COUNT(*) as data_points
                FROM performance_metrics
                WHERE timestamp >= datetime('now', '-24 hours')
                GROUP BY software_id
            ''')
            
            results = []
            for row in cursor.fetchall():
                results.append({
                    "software_id": row[0],
                    "avg_cpu": round(row[1], 2) if row[1] else 0,
                    "avg_memory": round(row[2], 2) if row[2] else 0,
                    "avg_response": round(row[3], 2) if row[3] else 0,
                    "data_points": row[4]
                })
            
            conn.close()
            return results
            
        except Exception as e:
            logger.error(f"Error getting performance metrics: {str(e)}")
            return []
    
    def get_ai_insights(self) -> List[Dict[str, Any]]:
        """Get AI insights from database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT software_id, insight_type, insight_data, confidence, timestamp
                FROM ai_insights
                ORDER BY timestamp DESC
                LIMIT 10
            ''')
            
            results = []
            for row in cursor.fetchall():
                results.append({
                    "software_id": row[0],
                    "insight_type": row[1],
                    "insight_data": json.loads(row[2]) if row[2] else {},
                    "confidence": row[3],
                    "timestamp": row[4]
                })
            
            conn.close()
            return results
            
        except Exception as e:
            logger.error(f"Error getting AI insights: {str(e)}")
            return []
    
    def get_cloud_deployments(self) -> List[Dict[str, Any]]:
        """Get cloud deployments from database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT software_id, cloud_provider, deployment_id, status, url, created_at
                FROM cloud_deployments
                ORDER BY created_at DESC
            ''')
            
            results = []
            for row in cursor.fetchall():
                results.append({
                    "software_id": row[0],
                    "cloud_provider": row[1],
                    "deployment_id": row[2],
                    "status": row[3],
                    "url": row[4],
                    "created_at": row[5]
                })
            
            conn.close()
            return results
            
        except Exception as e:
            logger.error(f"Error getting cloud deployments: {str(e)}")
            return []
    
    def get_security_status(self) -> Dict[str, Any]:
        """Get security status"""
        return {
            "overall_score": 85,
            "vulnerabilities": 2,
            "last_scan": datetime.now().isoformat(),
            "recommendations": [
                "Enable encryption for all data",
                "Implement multi-factor authentication",
                "Regular security audits"
            ]
        }
    
    def get_usage_statistics(self) -> List[Dict[str, Any]]:
        """Get usage statistics from database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT software_id, version, usage_count, last_used
                FROM software_usage
                ORDER BY usage_count DESC
            ''')
            
            results = []
            for row in cursor.fetchall():
                results.append({
                    "software_id": row[0],
                    "version": row[1],
                    "usage_count": row[2],
                    "last_used": row[3]
                })
            
            conn.close()
            return results
            
        except Exception as e:
            logger.error(f"Error getting usage statistics: {str(e)}")
            return []
    
    def get_system_info(self) -> Dict[str, Any]:
        """Get system information"""
        import platform
        import psutil
        
        return {
            "platform": platform.system(),
            "platform_version": platform.version(),
            "architecture": platform.machine(),
            "cpu_count": psutil.cpu_count(),
            "memory_total": round(psutil.virtual_memory().total / (1024**3), 2),
            "memory_available": round(psutil.virtual_memory().available / (1024**3), 2),
            "disk_usage": round(psutil.disk_usage('/').used / (1024**3), 2),
            "disk_total": round(psutil.disk_usage('/').total / (1024**3), 2)
        }

# Initialize dashboard
dashboard_instance = MaijdDashboard()

@app.route('/')
def index():
    """Main dashboard page"""
    return render_template('dashboard.html')

@app.route('/api/dashboard')
def api_dashboard():
    """API endpoint for dashboard data"""
    return jsonify(dashboard_instance.get_dashboard_data())

@app.route('/api/software')
def api_software():
    """API endpoint for software list"""
    return jsonify(dashboard_instance.get_installed_software())

@app.route('/api/performance')
def api_performance():
    """API endpoint for performance metrics"""
    return jsonify(dashboard_instance.get_performance_metrics())

@app.route('/api/ai-insights')
def api_ai_insights():
    """API endpoint for AI insights"""
    return jsonify(dashboard_instance.get_ai_insights())

@app.route('/api/cloud-deployments')
def api_cloud_deployments():
    """API endpoint for cloud deployments"""
    return jsonify(dashboard_instance.get_cloud_deployments())

@app.route('/api/security')
def api_security():
    """API endpoint for security status"""
    return jsonify(dashboard_instance.get_security_status())

@app.route('/api/usage')
def api_usage():
    """API endpoint for usage statistics"""
    return jsonify(dashboard_instance.get_usage_statistics())

@app.route('/api/system')
def api_system():
    """API endpoint for system information"""
    return jsonify(dashboard_instance.get_system_info())

@app.route('/health')
def health():
    """Health check endpoint for monitoring"""
    try:
        # Basic health check
        health_status = {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "version": "2024.1.0",
            "services": {
                "web": "running",
                "database": "unknown",
                "redis": "unknown"
            }
        }
        
        # Check database connection
        try:
            # Simple database check
            if os.path.exists(dashboard_instance.db_path):
                health_status["services"]["database"] = "connected"
            else:
                health_status["services"]["database"] = "not_found"
        except Exception as e:
            health_status["services"]["database"] = f"error: {str(e)}"
        
        return jsonify(health_status), 200
        
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/metrics')
def metrics():
    """Prometheus metrics endpoint"""
    try:
        # Basic system metrics
        import psutil
        
        metrics_data = {
            "maijd_software_instances_total": len(dashboard_instance.get_installed_software()),
            "maijd_software_performance_score": dashboard_instance.get_performance_metrics()[0].get('score', 0) if dashboard_instance.get_performance_metrics() else 0,
            "maijd_software_security_score": dashboard_instance.get_security_status().get('overall_score', 0),
            "maijd_software_uptime_seconds": time.time() - getattr(dashboard_instance, 'start_time', time.time())
        }
        
        # Format as Prometheus metrics
        prometheus_metrics = []
        for key, value in metrics_data.items():
            prometheus_metrics.append(f"{key} {value}")
        
        return "\n".join(prometheus_metrics), 200, {'Content-Type': 'text/plain'}
        
    except Exception as e:
        return f"# Error collecting metrics: {str(e)}", 500, {'Content-Type': 'text/plain'}

@socketio.on('connect')
def handle_connect():
    """Handle WebSocket connection"""
    logger.info("Client connected to dashboard")
    emit('status', {'data': 'Connected to Maijd Dashboard'})

@socketio.on('disconnect')
def handle_disconnect():
    """Handle WebSocket disconnection"""
    logger.info("Client disconnected from dashboard")

@socketio.on('request_dashboard_data')
def handle_dashboard_data_request():
    """Handle dashboard data request via WebSocket"""
    data = dashboard_instance.get_dashboard_data()
    emit('dashboard_data', data)

def create_templates():
    """Create HTML templates for the dashboard"""
    templates_dir = os.path.join(os.path.dirname(__file__), 'templates')
    os.makedirs(templates_dir, exist_ok=True)
    
    # Create dashboard template
    dashboard_html = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maijd Software Suite Dashboard</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .header h1 {
            color: #667eea;
            text-align: center;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            text-align: center;
            color: #666;
            font-size: 1.1em;
        }
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card h2 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 1.5em;
        }
        
        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        
        .metric:last-child {
            border-bottom: none;
        }
        
        .metric-label {
            font-weight: 500;
            color: #555;
        }
        
        .metric-value {
            font-weight: bold;
            color: #667eea;
        }
        
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        
        .status-online {
            background-color: #4CAF50;
        }
        
        .status-offline {
            background-color: #f44336;
        }
        
        .status-warning {
            background-color: #ff9800;
        }
        
        .chart-container {
            position: relative;
            height: 300px;
            margin-top: 20px;
        }
        
        .refresh-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1em;
            transition: transform 0.3s ease;
        }
        
        .refresh-btn:hover {
            transform: scale(1.05);
        }
        
        .loading {
            text-align: center;
            padding: 20px;
            color: #666;
        }
        
        .category-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .category-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        
        .category-card ul li {
            background: rgba(102, 126, 234, 0.1);
            padding: 8px 12px;
            border-radius: 20px;
            margin: 2px;
            font-size: 0.9em;
            color: #667eea;
            border: 1px solid rgba(102, 126, 234, 0.2);
        }
        
        .category-card ul li:hover {
            background: rgba(102, 126, 234, 0.2);
            transform: scale(1.02);
        }
        
        @media (max-width: 768px) {
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 2em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Maijd Software Suite Dashboard</h1>
            <p>Real-time monitoring, analytics, and management</p>
            <button class="refresh-btn" onclick="refreshDashboard()">🔄 Refresh Dashboard</button>
        </div>
        
        <div class="dashboard-grid">
            <div class="card">
                <h2>📊 System Overview</h2>
                <div id="system-overview">
                    <div class="loading">Loading system information...</div>
                </div>
            </div>
            
            <div class="card">
                <h2>🚀 Software Features Overview</h2>
                <div id="features-overview">
                    <div class="loading">Loading features information...</div>
                </div>
            </div>
            
            <div class="card">
                <h2>🖥️ Installed Software</h2>
                <div id="installed-software">
                    <div class="loading">Loading software information...</div>
                </div>
            </div>
            
            <div class="card">
                <h2>⚡ Performance Metrics</h2>
                <div id="performance-metrics">
                    <div class="loading">Loading performance data...</div>
                </div>
            </div>
            
            <div class="card">
                <h2>🤖 AI Insights</h2>
                <div id="ai-insights">
                    <div class="loading">Loading AI insights...</div>
                </div>
            </div>
            
            <div class="card">
                <h2>☁️ Cloud Deployments</h2>
                <div id="cloud-deployments">
                    <div class="loading">Loading cloud deployments...</div>
                </div>
            </div>
            
            <div class="card">
                <h2>🔒 Security Status</h2>
                <div id="security-status">
                    <div class="loading">Loading security information...</div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <h2>📚 Complete Software Categories & Features</h2>
            <div id="software-categories">
                <div class="loading">Loading software categories...</div>
            </div>
        </div>
        
        <div class="card">
            <h2>📈 Performance Trends</h2>
            <div class="chart-container">
                <canvas id="performanceChart"></canvas>
            </div>
        </div>
    </div>
    
    <script>
        // Initialize Socket.IO
        const socket = io();
        
        // Chart instance
        let performanceChart = null;
        
        // Connect to WebSocket
        socket.on('connect', function() {
            console.log('Connected to dashboard');
            loadDashboardData();
        });
        
        socket.on('dashboard_data', function(data) {
            updateDashboard(data);
        });
        
        // Load dashboard data
        function loadDashboardData() {
            fetch('/api/dashboard')
                .then(response => response.json())
                .then(data => {
                    updateDashboard(data);
                })
                .catch(error => {
                    console.error('Error loading dashboard data:', error);
                });
        }
        
        // Update dashboard with data
        function updateDashboard(data) {
            updateSystemOverview(data.system_info);
            updateFeaturesOverview(data.total_features, data.feature_breakdown);
            updateInstalledSoftware(data.installed_software);
            updatePerformanceMetrics(data.performance_metrics);
            updateAIInsights(data.ai_insights);
            updateCloudDeployments(data.cloud_deployments);
            updateSecurityStatus(data.security_status);
            updateSoftwareCategories(data.software_categories);
            updatePerformanceChart(data.performance_metrics);
        }
        
        // Update system overview
        function updateSystemOverview(systemInfo) {
            const container = document.getElementById('system-overview');
            container.innerHTML = `
                <div class="metric">
                    <span class="metric-label">Platform</span>
                    <span class="metric-value">${systemInfo.platform}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">CPU Cores</span>
                    <span class="metric-value">${systemInfo.cpu_count}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Memory (GB)</span>
                    <span class="metric-value">${systemInfo.memory_available}/${systemInfo.memory_total}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Disk Usage (GB)</span>
                    <span class="metric-value">${systemInfo.disk_usage}/${systemInfo.disk_total}</span>
                </div>
            `;
        }
        
        // Update features overview
        function updateFeaturesOverview(totalFeatures, featureBreakdown) {
            const container = document.getElementById('features-overview');
            container.innerHTML = `
                <div class="metric">
                    <span class="metric-label">Total Features Available</span>
                    <span class="metric-value">${totalFeatures}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Software Categories</span>
                    <span class="metric-value">${Object.keys(featureBreakdown).length}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">AI-Powered Features</span>
                    <span class="metric-value">${featureBreakdown.ai_software ? featureBreakdown.ai_software.feature_count : 0}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Cloud Features</span>
                    <span class="metric-value">${featureBreakdown.cloud_software ? featureBreakdown.cloud_software.feature_count : 0}</span>
                </div>
            `;
        }
        
        // Update installed software
        function updateInstalledSoftware(software) {
            const container = document.getElementById('installed-software');
            if (software.length === 0) {
                container.innerHTML = '<div class="loading">No software installed</div>';
                return;
            }
            
            const softwareList = software.map(item => `
                <div class="metric">
                    <span class="metric-label">${item.id}</span>
                    <span class="metric-value">v${item.version}</span>
                </div>
            `).join('');
            
            container.innerHTML = softwareList;
        }
        
        // Update performance metrics
        function updatePerformanceMetrics(metrics) {
            const container = document.getElementById('performance-metrics');
            if (metrics.length === 0) {
                container.innerHTML = '<div class="loading">No performance data available</div>';
                return;
            }
            
            const metricsList = metrics.map(item => `
                <div class="metric">
                    <span class="metric-label">${item.software_id}</span>
                    <span class="metric-value">CPU: ${item.avg_cpu}% | RAM: ${item.avg_memory}%</span>
                </div>
            `).join('');
            
            container.innerHTML = metricsList;
        }
        
        // Update AI insights
        function updateAIInsights(insights) {
            const container = document.getElementById('ai-insights');
            if (insights.length === 0) {
                container.innerHTML = '<div class="loading">No AI insights available</div>';
                return;
            }
            
            const insightsList = insights.slice(0, 5).map(item => `
                <div class="metric">
                    <span class="metric-label">${item.software_id}</span>
                    <span class="metric-value">${item.insight_type}</span>
                </div>
            `).join('');
            
            container.innerHTML = insightsList;
        }
        
        // Update cloud deployments
        function updateCloudDeployments(deployments) {
            const container = document.getElementById('cloud-deployments');
            if (deployments.length === 0) {
                container.innerHTML = '<div class="loading">No cloud deployments</div>';
                return;
            }
            
            const deploymentsList = deployments.map(item => `
                <div class="metric">
                    <span class="metric-label">${item.software_id}</span>
                    <span class="metric-value">${item.cloud_provider} - ${item.status}</span>
                </div>
            `).join('');
            
            container.innerHTML = deploymentsList;
        }
        
        // Update security status
        function updateSecurityStatus(security) {
            const container = document.getElementById('security-status');
            container.innerHTML = `
                <div class="metric">
                    <span class="metric-label">Security Score</span>
                    <span class="metric-value">${security.overall_score}/100</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Vulnerabilities</span>
                    <span class="metric-value">${security.vulnerabilities}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Last Scan</span>
                    <span class="metric-value">${new Date(security.last_scan).toLocaleDateString()}</span>
                </div>
            `;
        }
        
        // Update software categories
        function updateSoftwareCategories(categories) {
            const container = document.getElementById('software-categories');
            let categoriesHtml = '';
            
            for (const [categoryId, category] of Object.entries(categories)) {
                const featuresList = category.features.map(feature => `<li>${feature}</li>`).join('');
                categoriesHtml += `
                    <div class="category-card" style="margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 10px; background: rgba(255, 255, 255, 0.8);">
                        <h3 style="color: #667eea; margin-bottom: 10px; display: flex; align-items: center;">
                            <span style="font-size: 1.5em; margin-right: 10px;">${category.icon}</span>
                            ${category.name}
                        </h3>
                        <p style="color: #666; margin-bottom: 15px; font-style: italic;">${category.description}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span style="font-weight: bold; color: #667eea;">Features Available: ${category.features.length}</span>
                        </div>
                        <div style="max-height: 200px; overflow-y: auto;">
                            <ul style="list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 5px;">
                                ${featuresList}
                            </ul>
                        </div>
                    </div>
                `;
            }
            
            container.innerHTML = categoriesHtml;
        }
        
        // Update performance chart
        function updatePerformanceChart(metrics) {
            const ctx = document.getElementById('performanceChart').getContext('2d');
            
            if (performanceChart) {
                performanceChart.destroy();
            }
            
            const labels = metrics.map(item => item.software_id);
            const cpuData = metrics.map(item => item.avg_cpu);
            const memoryData = metrics.map(item => item.avg_memory);
            
            performanceChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'CPU Usage (%)',
                        data: cpuData,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4
                    }, {
                        label: 'Memory Usage (%)',
                        data: memoryData,
                        borderColor: '#764ba2',
                        backgroundColor: 'rgba(118, 75, 162, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }
        
        // Refresh dashboard
        function refreshDashboard() {
            loadDashboardData();
        }
        
        // Auto-refresh every 30 seconds
        setInterval(loadDashboardData, 30000);
    </script>
</body>
</html>'''
    
    with open(os.path.join(templates_dir, 'dashboard.html'), 'w') as f:
        f.write(dashboard_html)

def main():
    """Main function to run the web dashboard"""
    # Create templates
    create_templates()
    
    # Get configuration
    port = dashboard_instance.config.get('port', 8080)
    host = dashboard_instance.config.get('host', '0.0.0.0')
    debug = dashboard_instance.config.get('debug', False)
    
    print(f"🚀 Starting Maijd Software Suite Dashboard...")
    print(f"📊 Dashboard URL: http://{host}:{port}")
    print(f"🔧 Debug mode: {debug}")
    
    # Run the Flask app
    socketio.run(app, host=host, port=port, debug=debug)

if __name__ == '__main__':
    main()
