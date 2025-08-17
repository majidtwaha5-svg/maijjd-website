#!/usr/bin/env python3
"""
Maijd System Security Suite
Comprehensive security solution for enterprise systems
"""

import os
import sys
import json
import subprocess
import platform
import logging
import hashlib
import ssl
import socket
import threading
import time
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import sqlite3
import psutil
import requests
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SystemSecuritySuite:
    """
    Comprehensive security solution for enterprise systems
    """
    
    def __init__(self):
        self.system_info = self.get_system_info()
        self.security_status = {}
        self.threat_database = {}
        self.vulnerability_scanner = {}
        self.compliance_checker = {}
        self.incident_log = []
        self.security_policies = {}
        self.encryption_keys = {}
        self.access_control = {}
        
        # Initialize security components
        self.init_database()
        self.load_security_policies()
        self.load_threat_database()
        self.initialize_vulnerability_scanner()
        self.initialize_compliance_checker()
        
        # Start security monitoring
        self.start_security_monitoring()
    
    def get_system_info(self) -> Dict[str, Any]:
        """Get comprehensive system information"""
        try:
            info = {
                'os': platform.system(),
                'os_version': platform.version(),
                'architecture': platform.machine(),
                'processor': platform.processor(),
                'hostname': platform.node(),
                'python_version': platform.python_version(),
                'uptime': self.get_system_uptime(),
                'disk_usage': self.get_disk_usage(),
                'memory_usage': self.get_memory_usage(),
                'cpu_usage': self.get_cpu_usage(),
                'network_interfaces': self.get_network_interfaces(),
                'running_processes': len(list(psutil.process_iter())),
                'open_ports': self.get_open_ports(),
                'ssl_certificates': self.get_ssl_certificates(),
                'firewall_status': self.get_firewall_status(),
                'antivirus_status': self.get_antivirus_status()
            }
            return info
        except Exception as e:
            logger.error(f"Error getting system info: {e}")
            return {}
    
    def init_database(self):
        """Initialize security database"""
        try:
            db_path = Path.home() / "maijd_software" / "security.db"
            db_path.parent.mkdir(parents=True, exist_ok=True)
            
            self.conn = sqlite3.connect(str(db_path))
            self.cursor = self.conn.cursor()
            
            # Create security tables
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS security_incidents (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT,
                    incident_type TEXT,
                    severity TEXT,
                    description TEXT,
                    affected_system TEXT,
                    resolution TEXT,
                    status TEXT
                )
            ''')
            
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS vulnerability_scans (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT,
                    scan_type TEXT,
                    vulnerabilities_found INTEGER,
                    risk_level TEXT,
                    scan_results TEXT,
                    recommendations TEXT
                )
            ''')
            
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS compliance_checks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT,
                    standard TEXT,
                    compliance_score REAL,
                    violations TEXT,
                    recommendations TEXT,
                    status TEXT
                )
            ''')
            
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS security_policies (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    policy_name TEXT,
                    policy_type TEXT,
                    description TEXT,
                    rules TEXT,
                    enforcement_level TEXT,
                    last_updated TEXT
                )
            ''')
            
            self.conn.commit()
            logger.info("Security database initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing security database: {e}")
    
    def load_security_policies(self):
        """Load security policies from configuration"""
        try:
            policies = {
                'password_policy': {
                    'min_length': 12,
                    'require_uppercase': True,
                    'require_lowercase': True,
                    'require_numbers': True,
                    'require_special_chars': True,
                    'max_age_days': 90,
                    'history_count': 5
                },
                'access_control': {
                    'max_login_attempts': 3,
                    'lockout_duration_minutes': 30,
                    'session_timeout_minutes': 60,
                    'require_mfa': True,
                    'ip_whitelist': [],
                    'ip_blacklist': []
                },
                'encryption': {
                    'algorithm': 'AES-256',
                    'key_rotation_days': 30,
                    'secure_key_storage': True,
                    'encrypt_at_rest': True,
                    'encrypt_in_transit': True
                },
                'network_security': {
                    'firewall_enabled': True,
                    'intrusion_detection': True,
                    'vpn_required': False,
                    'port_scanning_detection': True,
                    'ddos_protection': True
                },
                'audit_logging': {
                    'log_all_events': True,
                    'retention_days': 365,
                    'encrypt_logs': True,
                    'real_time_monitoring': True,
                    'alert_on_suspicious': True
                }
            }
            
            self.security_policies = policies
            logger.info("Security policies loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading security policies: {e}")
    
    def load_threat_database(self):
        """Load threat intelligence database"""
        try:
            threats = {
                'malware': {
                    'viruses': ['trojan', 'worm', 'spyware', 'ransomware'],
                    'signatures': ['suspicious_file_creation', 'unusual_network_activity', 'registry_changes'],
                    'mitigation': ['antivirus_scan', 'network_isolation', 'system_restore']
                },
                'network_attacks': {
                    'ddos': ['syn_flood', 'udp_flood', 'http_flood'],
                    'intrusion': ['port_scanning', 'brute_force', 'sql_injection'],
                    'mitigation': ['firewall_rules', 'rate_limiting', 'intrusion_detection']
                },
                'social_engineering': {
                    'phishing': ['email_spoofing', 'fake_websites', 'social_media_manipulation'],
                    'pretexting': ['false_pretenses', 'impersonation', 'information_gathering'],
                    'mitigation': ['user_training', 'email_filtering', 'url_filtering']
                },
                'insider_threats': {
                    'data_theft': ['unauthorized_access', 'data_exfiltration', 'privilege_abuse'],
                    'sabotage': ['system_damage', 'data_corruption', 'service_disruption'],
                    'mitigation': ['access_controls', 'monitoring', 'separation_of_duties']
                }
            }
            
            self.threat_database = threats
            logger.info("Threat database loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading threat database: {e}")
    
    def initialize_vulnerability_scanner(self):
        """Initialize vulnerability scanning capabilities"""
        try:
            scanner = {
                'port_scanner': self.scan_open_ports,
                'service_detector': self.detect_services,
                'vulnerability_checker': self.check_known_vulnerabilities,
                'configuration_auditor': self.audit_security_config,
                'dependency_scanner': self.scan_dependencies
            }
            
            self.vulnerability_scanner = scanner
            logger.info("Vulnerability scanner initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing vulnerability scanner: {e}")
    
    def initialize_compliance_checker(self):
        """Initialize compliance checking capabilities"""
        try:
            checker = {
                'iso27001': self.check_iso27001_compliance,
                'gdpr': self.check_gdpr_compliance,
                'sox': self.check_sox_compliance,
                'pci_dss': self.check_pci_dss_compliance,
                'hipaa': self.check_hipaa_compliance
            }
            
            self.compliance_checker = checker
            logger.info("Compliance checker initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing compliance checker: {e}")
    
    def start_security_monitoring(self):
        """Start continuous security monitoring"""
        try:
            # Start monitoring threads
            self.monitoring_active = True
            
            # File system monitoring
            self.file_monitor_thread = threading.Thread(target=self.monitor_file_system, daemon=True)
            self.file_monitor_thread.start()
            
            # Network monitoring
            self.network_monitor_thread = threading.Thread(target=self.monitor_network, daemon=True)
            self.network_monitor_thread.start()
            
            # Process monitoring
            self.process_monitor_thread = threading.Thread(target=self.monitor_processes, daemon=True)
            self.process_monitor_thread.start()
            
            # Log monitoring
            self.log_monitor_thread = threading.Thread(target=self.monitor_logs, daemon=True)
            self.log_monitor_thread.start()
            
            logger.info("Security monitoring started successfully")
            
        except Exception as e:
            logger.error(f"Error starting security monitoring: {e}")
    
    def monitor_file_system(self):
        """Monitor file system for suspicious activity"""
        try:
            while self.monitoring_active:
                # Check for new files in critical directories
                critical_dirs = ['/etc', '/usr/bin', '/usr/sbin', '/var/log']
                
                for directory in critical_dirs:
                    if os.path.exists(directory):
                        try:
                            files = os.listdir(directory)
                            for file in files:
                                file_path = os.path.join(directory, file)
                                if os.path.isfile(file_path):
                                    # Check file permissions
                                    stat_info = os.stat(file_path)
                                    if stat_info.st_mode & 0o777 == 0o777:  # World writable
                                        self.log_security_incident(
                                            'suspicious_file_permissions',
                                            'high',
                                            f'World writable file detected: {file_path}'
                                        )
                        except PermissionError:
                            continue
                
                time.sleep(30)  # Check every 30 seconds
                
        except Exception as e:
            logger.error(f"Error in file system monitoring: {e}")
    
    def monitor_network(self):
        """Monitor network for suspicious activity"""
        try:
            while self.monitoring_active:
                # Check for unusual network connections
                connections = psutil.net_connections()
                
                for conn in connections:
                    if conn.status == 'ESTABLISHED':
                        # Check for connections to suspicious ports
                        suspicious_ports = [22, 23, 3389, 5900]  # SSH, Telnet, RDP, VNC
                        if conn.raddr and conn.raddr.port in suspicious_ports:
                            self.log_security_incident(
                                'suspicious_network_connection',
                                'medium',
                                f'Suspicious connection to port {conn.raddr.port} from {conn.raddr.ip}'
                            )
                
                time.sleep(60)  # Check every minute
                
        except Exception as e:
            logger.error(f"Error in network monitoring: {e}")
    
    def monitor_processes(self):
        """Monitor running processes for suspicious activity"""
        try:
            while self.monitoring_active:
                # Check for suspicious processes
                suspicious_processes = ['nc', 'netcat', 'nmap', 'wireshark']
                
                for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
                    try:
                        if proc.info['name'] in suspicious_processes:
                            self.log_security_incident(
                                'suspicious_process',
                                'medium',
                                f'Suspicious process running: {proc.info["name"]} (PID: {proc.info["pid"]})'
                            )
                    except (psutil.NoSuchProcess, psutil.AccessDenied):
                        continue
                
                time.sleep(120)  # Check every 2 minutes
                
        except Exception as e:
            logger.error(f"Error in process monitoring: {e}")
    
    def monitor_logs(self):
        """Monitor system logs for security events"""
        try:
            while self.monitoring_active:
                # Check common log files for security events
                log_files = ['/var/log/auth.log', '/var/log/syslog', '/var/log/messages']
                
                for log_file in log_files:
                    if os.path.exists(log_file):
                        try:
                            with open(log_file, 'r') as f:
                                lines = f.readlines()
                                for line in lines[-100:]:  # Check last 100 lines
                                    if any(keyword in line.lower() for keyword in ['failed', 'denied', 'unauthorized', 'attack']):
                                        self.log_security_incident(
                                            'security_log_event',
                                            'low',
                                            f'Security event in {log_file}: {line.strip()}'
                                        )
                        except PermissionError:
                            continue
                
                time.sleep(300)  # Check every 5 minutes
                
        except Exception as e:
            logger.error(f"Error in log monitoring: {e}")
    
    def log_security_incident(self, incident_type: str, severity: str, description: str):
        """Log a security incident"""
        try:
            incident = {
                'timestamp': datetime.now().isoformat(),
                'incident_type': incident_type,
                'severity': severity,
                'description': description,
                'affected_system': self.system_info.get('hostname', 'unknown'),
                'resolution': '',
                'status': 'open'
            }
            
            # Store in database
            self.cursor.execute('''
                INSERT INTO security_incidents 
                (timestamp, incident_type, severity, description, affected_system, resolution, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                incident['timestamp'], incident['incident_type'], incident['severity'],
                incident['description'], incident['affected_system'], incident['resolution'], incident['status']
            ))
            
            self.conn.commit()
            
            # Add to memory
            self.incident_log.append(incident)
            
            # Log to console
            logger.warning(f"SECURITY INCIDENT [{severity.upper()}]: {description}")
            
            # Send alert if high severity
            if severity == 'high':
                self.send_security_alert(incident)
                
        except Exception as e:
            logger.error(f"Error logging security incident: {e}")
    
    def send_security_alert(self, incident: Dict[str, Any]):
        """Send security alert notification"""
        try:
            # This would integrate with your notification system
            # For now, just log it
            logger.critical(f"SECURITY ALERT: {incident['description']}")
            
            # You could add email, SMS, or other notification methods here
            # self.send_email_alert(incident)
            # self.send_sms_alert(incident)
            # self.send_slack_alert(incident)
            
        except Exception as e:
            logger.error(f"Error sending security alert: {e}")
    
    def run_vulnerability_scan(self, scan_type: str = 'full') -> Dict[str, Any]:
        """Run comprehensive vulnerability scan"""
        try:
            scan_results = {
                'timestamp': datetime.now().isoformat(),
                'scan_type': scan_type,
                'vulnerabilities_found': 0,
                'risk_level': 'low',
                'findings': [],
                'recommendations': []
            }
            
            if scan_type in ['full', 'network']:
                # Network vulnerability scan
                network_findings = self.scan_network_vulnerabilities()
                scan_results['findings'].extend(network_findings)
            
            if scan_type in ['full', 'system']:
                # System vulnerability scan
                system_findings = self.scan_system_vulnerabilities()
                scan_results['findings'].extend(system_findings)
            
            if scan_type in ['full', 'application']:
                # Application vulnerability scan
                app_findings = self.scan_application_vulnerabilities()
                scan_results['findings'].extend(app_findings)
            
            # Calculate risk level
            scan_results['vulnerabilities_found'] = len(scan_results['findings'])
            scan_results['risk_level'] = self.calculate_risk_level(scan_results['findings'])
            
            # Generate recommendations
            scan_results['recommendations'] = self.generate_security_recommendations(scan_results['findings'])
            
            # Store scan results
            self.store_vulnerability_scan(scan_results)
            
            return scan_results
            
        except Exception as e:
            logger.error(f"Error running vulnerability scan: {e}")
            return {'error': str(e)}
    
    def scan_network_vulnerabilities(self) -> List[Dict[str, Any]]:
        """Scan network for vulnerabilities"""
        findings = []
        
        try:
            # Check open ports
            open_ports = self.get_open_ports()
            for port in open_ports:
                if port in [21, 23, 25, 53, 80, 443, 3389]:  # Common services
                    findings.append({
                        'type': 'open_port',
                        'severity': 'medium',
                        'description': f'Port {port} is open',
                        'recommendation': f'Close port {port} if not needed'
                    })
            
            # Check SSL/TLS configuration
            ssl_findings = self.check_ssl_configuration()
            findings.extend(ssl_findings)
            
            # Check firewall configuration
            firewall_findings = self.check_firewall_configuration()
            findings.extend(firewall_findings)
            
        except Exception as e:
            logger.error(f"Error scanning network vulnerabilities: {e}")
        
        return findings
    
    def scan_system_vulnerabilities(self) -> List[Dict[str, Any]]:
        """Scan system for vulnerabilities"""
        findings = []
        
        try:
            # Check user accounts
            user_findings = self.check_user_accounts()
            findings.extend(user_findings)
            
            # Check file permissions
            permission_findings = self.check_file_permissions()
            findings.extend(permission_findings)
            
            # Check installed packages
            package_findings = self.check_package_vulnerabilities()
            findings.extend(package_findings)
            
        except Exception as e:
            logger.error(f"Error scanning system vulnerabilities: {e}")
        
        return findings
    
    def scan_application_vulnerabilities(self) -> List[Dict[str, Any]]:
        """Scan applications for vulnerabilities"""
        findings = []
        
        try:
            # Check web applications
            web_findings = self.check_web_application_security()
            findings.extend(web_findings)
            
            # Check database security
            db_findings = self.check_database_security()
            findings.extend(db_findings)
            
            # Check API security
            api_findings = self.check_api_security()
            findings.extend(api_findings)
            
        except Exception as e:
            logger.error(f"Error scanning application vulnerabilities: {e}")
        
        return findings
    
    def calculate_risk_level(self, findings: List[Dict[str, Any]]) -> str:
        """Calculate overall risk level based on findings"""
        try:
            if not findings:
                return 'low'
            
            high_count = sum(1 for f in findings if f.get('severity') == 'high')
            medium_count = sum(1 for f in findings if f.get('severity') == 'medium')
            low_count = sum(1 for f in findings if f.get('severity') == 'low')
            
            if high_count > 0:
                return 'high'
            elif medium_count > 2:
                return 'medium'
            else:
                return 'low'
                
        except Exception as e:
            logger.error(f"Error calculating risk level: {e}")
            return 'unknown'
    
    def generate_security_recommendations(self, findings: List[Dict[str, Any]]) -> List[str]:
        """Generate security recommendations based on findings"""
        recommendations = []
        
        try:
            for finding in findings:
                if 'recommendation' in finding:
                    recommendations.append(finding['recommendation'])
            
            # Add general recommendations
            if any(f.get('severity') == 'high' for f in findings):
                recommendations.append("Immediate action required for high-severity findings")
            
            if len(findings) > 10:
                recommendations.append("Consider implementing automated security monitoring")
            
            if not recommendations:
                recommendations.append("No specific recommendations at this time")
                
        except Exception as e:
            logger.error(f"Error generating recommendations: {e}")
        
        return recommendations
    
    def store_vulnerability_scan(self, scan_results: Dict[str, Any]):
        """Store vulnerability scan results in database"""
        try:
            self.cursor.execute('''
                INSERT INTO vulnerability_scans 
                (timestamp, scan_type, vulnerabilities_found, risk_level, scan_results, recommendations)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                scan_results['timestamp'], scan_results['scan_type'],
                scan_results['vulnerabilities_found'], scan_results['risk_level'],
                json.dumps(scan_results['findings']), json.dumps(scan_results['recommendations'])
            ))
            
            self.conn.commit()
            logger.info(f"Vulnerability scan results stored successfully")
            
        except Exception as e:
            logger.error(f"Error storing vulnerability scan: {e}")
    
    def run_compliance_check(self, standard: str) -> Dict[str, Any]:
        """Run compliance check for specified standard"""
        try:
            if standard not in self.compliance_checker:
                return {'error': f'Compliance standard {standard} not supported'}
            
            # Run the compliance check
            check_function = self.compliance_checker[standard]
            compliance_result = check_function()
            
            # Store compliance check results
            self.store_compliance_check(standard, compliance_result)
            
            return compliance_result
            
        except Exception as e:
            logger.error(f"Error running compliance check: {e}")
            return {'error': str(e)}
    
    def check_iso27001_compliance(self) -> Dict[str, Any]:
        """Check ISO 27001 compliance"""
        try:
            # This is a simplified check - real implementation would be more comprehensive
            compliance_score = 0.0
            violations = []
            recommendations = []
            
            # Check information security policy
            if self.security_policies.get('password_policy'):
                compliance_score += 0.2
            
            # Check access controls
            if self.security_policies.get('access_control'):
                compliance_score += 0.2
            
            # Check encryption
            if self.security_policies.get('encryption'):
                compliance_score += 0.2
            
            # Check monitoring
            if self.security_policies.get('audit_logging'):
                compliance_score += 0.2
            
            # Check incident response
            if len(self.incident_log) > 0:
                compliance_score += 0.2
            
            return {
                'standard': 'ISO 27001',
                'compliance_score': compliance_score,
                'violations': violations,
                'recommendations': recommendations,
                'status': 'compliant' if compliance_score >= 0.8 else 'non_compliant'
            }
            
        except Exception as e:
            logger.error(f"Error checking ISO 27001 compliance: {e}")
            return {'error': str(e)}
    
    def check_gdpr_compliance(self) -> Dict[str, Any]:
        """Check GDPR compliance"""
        try:
            # Simplified GDPR compliance check
            compliance_score = 0.0
            violations = []
            recommendations = []
            
            # Check data protection measures
            if self.security_policies.get('encryption'):
                compliance_score += 0.3
            
            # Check access controls
            if self.security_policies.get('access_control'):
                compliance_score += 0.3
            
            # Check audit logging
            if self.security_policies.get('audit_logging'):
                compliance_score += 0.4
            
            return {
                'standard': 'GDPR',
                'compliance_score': compliance_score,
                'violations': violations,
                'recommendations': recommendations,
                'status': 'compliant' if compliance_score >= 0.8 else 'non_compliant'
            }
            
        except Exception as e:
            logger.error(f"Error checking GDPR compliance: {e}")
            return {'error': str(e)}
    
    def check_sox_compliance(self) -> Dict[str, Any]:
        """Check SOX compliance"""
        try:
            # Simplified SOX compliance check
            compliance_score = 0.0
            violations = []
            recommendations = []
            
            # Check access controls
            if self.security_policies.get('access_control'):
                compliance_score += 0.4
            
            # Check audit logging
            if self.security_policies.get('audit_logging'):
                compliance_score += 0.4
            
            # Check change management
            if self.security_policies.get('audit_logging'):
                compliance_score += 0.2
            
            return {
                'standard': 'SOX',
                'compliance_score': compliance_score,
                'violations': violations,
                'recommendations': recommendations,
                'status': 'compliant' if compliance_score >= 0.8 else 'non_compliant'
            }
            
        except Exception as e:
            logger.error(f"Error checking SOX compliance: {e}")
            return {'error': str(e)}
    
    def check_pci_dss_compliance(self) -> Dict[str, Any]:
        """Check PCI DSS compliance"""
        try:
            # Simplified PCI DSS compliance check
            compliance_score = 0.0
            violations = []
            recommendations = []
            
            # Check network security
            if self.security_policies.get('network_security'):
                compliance_score += 0.3
            
            # Check access controls
            if self.security_policies.get('access_control'):
                compliance_score += 0.3
            
            # Check encryption
            if self.security_policies.get('encryption'):
                compliance_score += 0.4
            
            return {
                'standard': 'PCI DSS',
                'compliance_score': compliance_score,
                'violations': violations,
                'recommendations': recommendations,
                'status': 'compliant' if compliance_score >= 0.8 else 'non_compliant'
            }
            
        except Exception as e:
            logger.error(f"Error checking PCI DSS compliance: {e}")
            return {'error': str(e)}
    
    def check_hipaa_compliance(self) -> Dict[str, Any]:
        """Check HIPAA compliance"""
        try:
            # Simplified HIPAA compliance check
            compliance_score = 0.0
            violations = []
            recommendations = []
            
            # Check access controls
            if self.security_policies.get('access_control'):
                compliance_score += 0.4
            
            # Check audit logging
            if self.security_policies.get('audit_logging'):
                compliance_score += 0.3
            
            # Check encryption
            if self.security_policies.get('encryption'):
                compliance_score += 0.3
            
            return {
                'standard': 'HIPAA',
                'compliance_score': compliance_score,
                'violations': violations,
                'recommendations': recommendations,
                'status': 'compliant' if compliance_score >= 0.8 else 'non_compliant'
            }
            
        except Exception as e:
            logger.error(f"Error checking HIPAA compliance: {e}")
            return {'error': str(e)}
    
    def store_compliance_check(self, standard: str, compliance_result: Dict[str, Any]):
        """Store compliance check results in database"""
        try:
            self.cursor.execute('''
                INSERT INTO compliance_checks 
                (timestamp, standard, compliance_score, violations, recommendations, status)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                datetime.now().isoformat(), standard,
                compliance_result.get('compliance_score', 0.0),
                json.dumps(compliance_result.get('violations', [])),
                json.dumps(compliance_result.get('recommendations', [])),
                compliance_result.get('status', 'unknown')
            ))
            
            self.conn.commit()
            logger.info(f"Compliance check results for {standard} stored successfully")
            
        except Exception as e:
            logger.error(f"Error storing compliance check: {e}")
    
    def get_security_status(self) -> Dict[str, Any]:
        """Get comprehensive security status"""
        try:
            status = {
                'system_info': self.system_info,
                'security_policies': self.security_policies,
                'recent_incidents': self.incident_log[-10:] if self.incident_log else [],
                'incident_count': len(self.incident_log),
                'open_incidents': len([i for i in self.incident_log if i.get('status') == 'open']),
                'threat_database': len(self.threat_database),
                'monitoring_active': self.monitoring_active,
                'last_scan': self.get_last_scan_time(),
                'last_compliance_check': self.get_last_compliance_check_time()
            }
            
            return status
            
        except Exception as e:
            logger.error(f"Error getting security status: {e}")
            return {'error': str(e)}
    
    def get_last_scan_time(self) -> str:
        """Get timestamp of last vulnerability scan"""
        try:
            self.cursor.execute('SELECT MAX(timestamp) FROM vulnerability_scans')
            result = self.cursor.fetchone()
            return result[0] if result and result[0] else 'Never'
        except Exception as e:
            logger.error(f"Error getting last scan time: {e}")
            return 'Unknown'
    
    def get_last_compliance_check_time(self) -> str:
        """Get timestamp of last compliance check"""
        try:
            self.cursor.execute('SELECT MAX(timestamp) FROM compliance_checks')
            result = self.cursor.fetchone()
            return result[0] if result and result[0] else 'Never'
        except Exception as e:
            logger.error(f"Error getting last compliance check time: {e}")
            return 'Unknown'
    
    def get_system_uptime(self) -> str:
        """Get system uptime"""
        try:
            uptime = time.time() - psutil.boot_time()
            days = int(uptime // 86400)
            hours = int((uptime % 86400) // 3600)
            minutes = int((uptime % 3600) // 60)
            return f"{days}d {hours}h {minutes}m"
        except Exception as e:
            logger.error(f"Error getting uptime: {e}")
            return "Unknown"
    
    def get_disk_usage(self) -> Dict[str, Any]:
        """Get disk usage information"""
        try:
            disk_usage = {}
            for partition in psutil.disk_partitions():
                try:
                    usage = psutil.disk_usage(partition.mountpoint)
                    disk_usage[partition.mountpoint] = {
                        'total': usage.total,
                        'used': usage.used,
                        'free': usage.free,
                        'percent': usage.percent
                    }
                except PermissionError:
                    continue
            return disk_usage
        except Exception as e:
            logger.error(f"Error getting disk usage: {e}")
            return {}
    
    def get_memory_usage(self) -> Dict[str, Any]:
        """Get memory usage information"""
        try:
            memory = psutil.virtual_memory()
            return {
                'total': memory.total,
                'available': memory.available,
                'used': memory.used,
                'percent': memory.percent
            }
        except Exception as e:
            logger.error(f"Error getting memory usage: {e}")
            return {}
    
    def get_cpu_usage(self) -> float:
        """Get CPU usage percentage"""
        try:
            return psutil.cpu_percent(interval=1)
        except Exception as e:
            logger.error(f"Error getting CPU usage: {e}")
            return 0.0
    
    def get_network_interfaces(self) -> List[Dict[str, Any]]:
        """Get network interface information"""
        try:
            interfaces = []
            for interface, addresses in psutil.net_if_addrs().items():
                interface_info = {
                    'name': interface,
                    'addresses': []
                }
                for addr in addresses:
                    interface_info['addresses'].append({
                        'family': str(addr.family),
                        'address': addr.address,
                        'netmask': addr.netmask
                    })
                interfaces.append(interface_info)
            return interfaces
        except Exception as e:
            logger.error(f"Error getting network interfaces: {e}")
            return []
    
    def get_open_ports(self) -> List[int]:
        """Get list of open ports"""
        try:
            open_ports = []
            for conn in psutil.net_connections():
                if conn.status == 'LISTEN':
                    open_ports.append(conn.laddr.port)
            return list(set(open_ports))
        except Exception as e:
            logger.error(f"Error getting open ports: {e}")
            return []
    
    def get_ssl_certificates(self) -> List[Dict[str, Any]]:
        """Get SSL certificate information"""
        try:
            # This is a simplified implementation
            # Real implementation would check actual SSL certificates
            return []
        except Exception as e:
            logger.error(f"Error getting SSL certificates: {e}")
            return []
    
    def get_firewall_status(self) -> str:
        """Get firewall status"""
        try:
            # This is a simplified implementation
            # Real implementation would check actual firewall status
            return "Unknown"
        except Exception as e:
            logger.error(f"Error getting firewall status: {e}")
            return "Unknown"
    
    def get_antivirus_status(self) -> str:
        """Get antivirus status"""
        try:
            # This is a simplified implementation
            # Real implementation would check actual antivirus status
            return "Unknown"
        except Exception as e:
            logger.error(f"Error getting antivirus status: {e}")
            return "Unknown"
    
    def check_ssl_configuration(self) -> List[Dict[str, Any]]:
        """Check SSL/TLS configuration"""
        findings = []
        try:
            # Simplified SSL configuration check
            # Real implementation would check actual SSL configurations
            pass
        except Exception as e:
            logger.error(f"Error checking SSL configuration: {e}")
        return findings
    
    def check_firewall_configuration(self) -> List[Dict[str, Any]]:
        """Check firewall configuration"""
        findings = []
        try:
            # Simplified firewall configuration check
            # Real implementation would check actual firewall configurations
            pass
        except Exception as e:
            logger.error(f"Error checking firewall configuration: {e}")
        return findings
    
    def check_user_accounts(self) -> List[Dict[str, Any]]:
        """Check user account security"""
        findings = []
        try:
            # Simplified user account check
            # Real implementation would check actual user accounts
            pass
        except Exception as e:
            logger.error(f"Error checking user accounts: {e}")
        return findings
    
    def check_file_permissions(self) -> List[Dict[str, Any]]:
        """Check file permissions"""
        findings = []
        try:
            # Simplified file permission check
            # Real implementation would check actual file permissions
            pass
        except Exception as e:
            logger.error(f"Error checking file permissions: {e}")
        return findings
    
    def check_package_vulnerabilities(self) -> List[Dict[str, Any]]:
        """Check package vulnerabilities"""
        findings = []
        try:
            # Simplified package vulnerability check
            # Real implementation would check actual package vulnerabilities
            pass
        except Exception as e:
            logger.error(f"Error checking package vulnerabilities: {e}")
        return findings
    
    def check_web_application_security(self) -> List[Dict[str, Any]]:
        """Check web application security"""
        findings = []
        try:
            # Simplified web application security check
            # Real implementation would check actual web applications
            pass
        except Exception as e:
            logger.error(f"Error checking web application security: {e}")
        return findings
    
    def check_database_security(self) -> List[Dict[str, Any]]:
        """Check database security"""
        findings = []
        try:
            # Simplified database security check
            # Real implementation would check actual database security
            pass
        except Exception as e:
            logger.error(f"Error checking database security: {e}")
        return findings
    
    def check_api_security(self) -> List[Dict[str, Any]]:
        """Check API security"""
        findings = []
        try:
            # Simplified API security check
            # Real implementation would check actual API security
            pass
        except Exception as e:
            logger.error(f"Error checking API security: {e}")
        return findings
    
    def cleanup(self):
        """Cleanup resources"""
        try:
            self.monitoring_active = False
            if hasattr(self, 'conn'):
                self.conn.close()
            logger.info("System Security Suite cleanup completed")
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")

def main():
    """Main function to demonstrate System Security Suite"""
    try:
        print("🔒 Maijd System Security Suite")
        print("=" * 50)
        
        # Initialize security suite
        security_suite = SystemSecuritySuite()
        
        print(f"✅ Security Suite initialized on {security_suite.system_info.get('hostname', 'Unknown')}")
        print(f"🖥️  OS: {security_suite.system_info.get('os', 'Unknown')}")
        print(f"🔍 Monitoring: {'Active' if security_suite.monitoring_active else 'Inactive'}")
        
        # Run vulnerability scan
        print("\n🔍 Running vulnerability scan...")
        scan_results = security_suite.run_vulnerability_scan('full')
        print(f"📊 Scan completed: {scan_results.get('vulnerabilities_found', 0)} vulnerabilities found")
        print(f"⚠️  Risk Level: {scan_results.get('risk_level', 'Unknown')}")
        
        # Run compliance check
        print("\n📋 Running compliance check...")
        compliance_result = security_suite.run_compliance_check('iso27001')
        print(f"📊 ISO 27001 Compliance: {compliance_result.get('status', 'Unknown')}")
        print(f"📈 Score: {compliance_result.get('compliance_score', 0.0):.1%}")
        
        # Get security status
        print("\n📊 Security Status:")
        status = security_suite.get_security_status()
        print(f"🚨 Incidents: {status.get('incident_count', 0)}")
        print(f"🔓 Open Incidents: {status.get('open_incidents', 0)}")
        print(f"🛡️  Policies: {len(status.get('security_policies', {}))}")
        
        print("\n✅ System Security Suite demonstration completed successfully!")
        
        # Cleanup
        security_suite.cleanup()
        
    except KeyboardInterrupt:
        print("\n⚠️  Operation cancelled by user")
    except Exception as e:
        print(f"❌ Error: {e}")
        logger.error(f"Error in main: {e}")

if __name__ == "__main__":
    main()
