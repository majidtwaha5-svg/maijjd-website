#!/usr/bin/env python3
"""
Custom Software Development Service
AI-powered custom software development with full lifecycle management
"""

import os
import json
import uuid
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
import logging
from dataclasses import dataclass, asdict
import subprocess
import requests
import openai
import anthropic

logger = logging.getLogger(__name__)

@dataclass
class SoftwareRequirement:
    """Software requirement specification"""
    id: str
    title: str
    description: str
    priority: str  # high, medium, low
    category: str  # functional, non-functional, technical
    acceptance_criteria: List[str]
    estimated_effort: float  # hours
    assigned_to: Optional[str]
    status: str  # pending, in_progress, completed, tested

@dataclass
class SoftwareArchitecture:
    """Software architecture design"""
    id: str
    name: str
    description: str
    components: List[Dict[str, Any]]
    data_flow: List[Dict[str, Any]]
    security_measures: List[str]
    scalability_features: List[str]
    technology_stack: List[str]
    diagrams: List[str]  # file paths to architecture diagrams

@dataclass
class DevelopmentTask:
    """Development task for custom software"""
    id: str
    title: str
    description: str
    requirement_id: str
    assigned_developer: str
    estimated_hours: float
    actual_hours: float
    status: str  # todo, in_progress, review, testing, completed
    priority: str  # critical, high, medium, low
    dependencies: List[str]
    created_date: str
    due_date: str
    completed_date: Optional[str]

class CustomSoftwareDevelopment:
    """AI-powered custom software development service"""
    
    def __init__(self, hub):
        self.hub = hub
        self.db_path = hub.db_path
        self.openai_api_key = hub.openai_api_key
        self.anthropic_api_key = hub.anthropic_api_key
        
        # Initialize AI clients
        if self.openai_api_key:
            openai.api_key = self.openai_api_key
        
        self._init_database()
    
    def _init_database(self):
        """Initialize database tables for custom software development"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Software requirements table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS software_requirements (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                priority TEXT,
                category TEXT,
                acceptance_criteria TEXT,
                estimated_effort REAL,
                assigned_to TEXT,
                status TEXT,
                project_id TEXT,
                created_date TEXT,
                FOREIGN KEY (project_id) REFERENCES projects (id)
            )
        ''')
        
        # Software architecture table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS software_architecture (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                components TEXT,
                data_flow TEXT,
                security_measures TEXT,
                scalability_features TEXT,
                technology_stack TEXT,
                diagrams TEXT,
                project_id TEXT,
                created_date TEXT,
                FOREIGN KEY (project_id) REFERENCES projects (id)
            )
        ''')
        
        # Development tasks table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS development_tasks (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                requirement_id TEXT,
                assigned_developer TEXT,
                estimated_hours REAL,
                actual_hours REAL,
                status TEXT,
                priority TEXT,
                dependencies TEXT,
                created_date TEXT,
                due_date TEXT,
                completed_date TEXT,
                project_id TEXT,
                FOREIGN KEY (project_id) REFERENCES projects (id),
                FOREIGN KEY (requirement_id) REFERENCES software_requirements (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def create_software_project(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new custom software development project"""
        project_id = str(uuid.uuid4())
        now = datetime.now().isoformat()
        
        # Create project in main hub
        project = self.hub.create_project({
            'name': project_data.get('name', 'Custom Software Project'),
            'description': project_data.get('description', ''),
            'category': 'custom_software',
            'tech_stack': project_data.get('tech_stack', []),
            'requirements': project_data.get('requirements', []),
            'budget': project_data.get('budget', 0.0),
            'timeline_days': project_data.get('timeline_days', 90)
        })
        
        # Generate AI-powered requirements analysis
        requirements = self._generate_ai_requirements(project_data)
        
        # Generate AI-powered architecture design
        architecture = self._generate_ai_architecture(project_data, requirements)
        
        # Create development tasks
        tasks = self._create_development_tasks(project_id, requirements)
        
        return {
            'project': project,
            'requirements': requirements,
            'architecture': architecture,
            'tasks': tasks,
            'ai_recommendations': self._get_ai_recommendations(project_data)
        }
    
    def _generate_ai_requirements(self, project_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate software requirements using AI"""
        requirements = []
        
        if self.openai_api_key:
            try:
                prompt = f"""
                Analyze this software project and generate detailed requirements:
                
                Project: {project_data.get('name', 'Unknown')}
                Description: {project_data.get('description', 'No description')}
                Category: {project_data.get('category', 'General')}
                Target Users: {project_data.get('target_users', 'General users')}
                
                Generate 10-15 detailed requirements including:
                - Functional requirements
                - Non-functional requirements (performance, security, scalability)
                - Technical requirements
                - User experience requirements
                
                Format each requirement with:
                - Title
                - Description
                - Priority (high/medium/low)
                - Category (functional/non-functional/technical)
                - Acceptance criteria (3-5 bullet points)
                - Estimated effort in hours
                
                Return as JSON array.
                """
                
                response = openai.ChatCompletion.create(
                    model="gpt-4",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=2000
                )
                
                ai_requirements = json.loads(response.choices[0].message.content)
                
                for req in ai_requirements:
                    requirement = SoftwareRequirement(
                        id=str(uuid.uuid4()),
                        title=req.get('title', ''),
                        description=req.get('description', ''),
                        priority=req.get('priority', 'medium'),
                        category=req.get('category', 'functional'),
                        acceptance_criteria=req.get('acceptance_criteria', []),
                        estimated_effort=req.get('estimated_effort', 8.0),
                        assigned_to=None,
                        status='pending'
                    )
                    requirements.append(asdict(requirement))
                    
            except Exception as e:
                logger.error(f"Error generating AI requirements: {str(e)}")
                # Fallback to template requirements
                requirements = self._get_template_requirements(project_data)
        else:
            requirements = self._get_template_requirements(project_data)
        
        return requirements
    
    def _generate_ai_architecture(self, project_data: Dict[str, Any], requirements: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate software architecture using AI"""
        if self.openai_api_key:
            try:
                prompt = f"""
                Design software architecture for this project:
                
                Project: {project_data.get('name', 'Unknown')}
                Requirements: {json.dumps(requirements[:5])}  # First 5 requirements
                Tech Stack: {project_data.get('tech_stack', [])}
                
                Generate architecture including:
                - System components
                - Data flow
                - Security measures
                - Scalability features
                - Technology recommendations
                
                Return as JSON with these fields:
                - components: array of system components
                - data_flow: array of data flow descriptions
                - security_measures: array of security features
                - scalability_features: array of scalability features
                - technology_stack: array of recommended technologies
                """
                
                response = openai.ChatCompletion.create(
                    model="gpt-4",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=1500
                )
                
                ai_architecture = json.loads(response.choices[0].message.content)
                
                architecture = SoftwareArchitecture(
                    id=str(uuid.uuid4()),
                    name=f"{project_data.get('name', 'Project')} Architecture",
                    description="AI-generated software architecture",
                    components=ai_architecture.get('components', []),
                    data_flow=ai_architecture.get('data_flow', []),
                    security_measures=ai_architecture.get('security_measures', []),
                    scalability_features=ai_architecture.get('scalability_features', []),
                    technology_stack=ai_architecture.get('technology_stack', []),
                    diagrams=[]
                )
                
                return asdict(architecture)
                
            except Exception as e:
                logger.error(f"Error generating AI architecture: {str(e)}")
        
        # Fallback to template architecture
        return self._get_template_architecture(project_data)
    
    def _create_development_tasks(self, project_id: str, requirements: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Create development tasks from requirements"""
        tasks = []
        
        for req in requirements:
            # Break down requirement into multiple tasks
            estimated_hours = req.get('estimated_effort', 8.0)
            num_tasks = max(1, int(estimated_hours / 4))  # 4 hours per task
            
            for i in range(num_tasks):
                task = DevelopmentTask(
                    id=str(uuid.uuid4()),
                    title=f"{req.get('title', 'Requirement')} - Task {i+1}",
                    description=f"Implementation task for {req.get('title', 'requirement')}",
                    requirement_id=req.get('id'),
                    assigned_developer="",  # To be assigned
                    estimated_hours=estimated_hours / num_tasks,
                    actual_hours=0.0,
                    status='todo',
                    priority=req.get('priority', 'medium'),
                    dependencies=[],
                    created_date=datetime.now().isoformat(),
                    due_date=(datetime.now() + timedelta(days=7)).isoformat(),
                    completed_date=None
                )
                tasks.append(asdict(task))
        
        return tasks
    
    def _get_ai_recommendations(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """Get AI-powered development recommendations"""
        recommendations = {
            'development_methodology': 'Agile/Scrum',
            'team_structure': 'Cross-functional team',
            'testing_strategy': 'Test-driven development',
            'deployment_strategy': 'Continuous deployment',
            'monitoring_tools': ['Prometheus', 'Grafana', 'ELK Stack'],
            'security_best_practices': ['OWASP Top 10', 'Regular security audits'],
            'performance_optimization': ['Caching strategies', 'Database optimization'],
            'scalability_approach': 'Microservices architecture'
        }
        
        if self.openai_api_key:
            try:
                prompt = f"""
                Provide software development recommendations for:
                
                Project: {project_data.get('name', 'Unknown')}
                Category: {project_data.get('category', 'General')}
                Tech Stack: {project_data.get('tech_stack', [])}
                
                Recommend:
                - Development methodology
                - Team structure
                - Testing strategy
                - Deployment strategy
                - Monitoring tools
                - Security best practices
                - Performance optimization techniques
                - Scalability approach
                
                Return as JSON.
                """
                
                response = openai.ChatCompletion.create(
                    model="gpt-4",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=1000
                )
                
                ai_recommendations = json.loads(response.choices[0].message.content)
                recommendations.update(ai_recommendations)
                
            except Exception as e:
                logger.error(f"Error getting AI recommendations: {str(e)}")
        
        return recommendations
    
    def _get_template_requirements(self, project_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get template requirements when AI is not available"""
        return [
            {
                'id': str(uuid.uuid4()),
                'title': 'User Authentication System',
                'description': 'Secure user login and registration system',
                'priority': 'high',
                'category': 'functional',
                'acceptance_criteria': ['Users can register', 'Users can login', 'Password reset functionality'],
                'estimated_effort': 16.0,
                'assigned_to': None,
                'status': 'pending'
            },
            {
                'id': str(uuid.uuid4()),
                'title': 'Database Design',
                'description': 'Design and implement database schema',
                'priority': 'high',
                'category': 'technical',
                'acceptance_criteria': ['Normalized database schema', 'Indexes for performance', 'Backup strategy'],
                'estimated_effort': 24.0,
                'assigned_to': None,
                'status': 'pending'
            }
        ]
    
    def _get_template_architecture(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """Get template architecture when AI is not available"""
        return {
            'id': str(uuid.uuid4()),
            'name': f"{project_data.get('name', 'Project')} Architecture",
            'description': 'Standard software architecture template',
            'components': [
                {'name': 'Frontend Layer', 'description': 'User interface components'},
                {'name': 'API Gateway', 'description': 'Request routing and authentication'},
                {'name': 'Business Logic Layer', 'description': 'Core application logic'},
                {'name': 'Data Access Layer', 'description': 'Database interactions'},
                {'name': 'Database Layer', 'description': 'Data storage and management'}
            ],
            'data_flow': [
                {'from': 'Frontend', 'to': 'API Gateway', 'description': 'User requests'},
                {'from': 'API Gateway', 'to': 'Business Logic', 'description': 'Processed requests'},
                {'from': 'Business Logic', 'to': 'Data Access', 'description': 'Data operations'},
                {'from': 'Data Access', 'to': 'Database', 'description': 'Data persistence'}
            ],
            'security_measures': ['JWT Authentication', 'HTTPS encryption', 'Input validation'],
            'scalability_features': ['Load balancing', 'Horizontal scaling', 'Caching'],
            'technology_stack': ['React/Node.js', 'PostgreSQL', 'Redis', 'Docker'],
            'diagrams': []
        }
    
    def get_project_status(self, project_id: str) -> Dict[str, Any]:
        """Get comprehensive project status"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get project info
        cursor.execute('SELECT * FROM projects WHERE id = ?', (project_id,))
        project_row = cursor.fetchone()
        
        if not project_row:
            return {"error": "Project not found"}
        
        # Get requirements
        cursor.execute('SELECT * FROM software_requirements WHERE project_id = ?', (project_id,))
        requirements = cursor.fetchall()
        
        # Get tasks
        cursor.execute('SELECT * FROM development_tasks WHERE project_id = ?', (project_id,))
        tasks = cursor.fetchall()
        
        # Get architecture
        cursor.execute('SELECT * FROM software_architecture WHERE project_id = ?', (project_id,))
        architecture_row = cursor.fetchone()
        
        conn.close()
        
        # Calculate progress
        total_tasks = len(tasks)
        completed_tasks = len([t for t in tasks if t[7] == 'completed'])  # status field
        progress = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        return {
            'project': {
                'id': project_row[0],
                'name': project_row[1],
                'description': project_row[2],
                'status': project_row[4],
                'progress_percentage': progress
            },
            'requirements_count': len(requirements),
            'tasks_count': total_tasks,
            'completed_tasks': completed_tasks,
            'architecture': architecture_row[1] if architecture_row else 'Not designed yet',
            'next_milestone': self._get_next_milestone(project_id)
        }
    
    def _get_next_milestone(self, project_id: str) -> str:
        """Get next project milestone"""
        return "Complete requirements analysis and architecture design"
    
    def update_task_status(self, task_id: str, status: str, actual_hours: float = None) -> Dict[str, Any]:
        """Update development task status"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        if actual_hours is not None:
            cursor.execute('''
                UPDATE development_tasks 
                SET status = ?, actual_hours = ?, completed_date = ?
                WHERE id = ?
            ''', (status, actual_hours, 
                  datetime.now().isoformat() if status == 'completed' else None, 
                  task_id))
        else:
            cursor.execute('''
                UPDATE development_tasks 
                SET status = ?
                WHERE id = ?
            ''', (status, task_id))
        
        conn.commit()
        conn.close()
        
        return {"success": True, "task_id": task_id, "status": status}
    
    def get_development_metrics(self, project_id: str) -> Dict[str, Any]:
        """Get development performance metrics"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM development_tasks WHERE project_id = ?', (project_id,))
        tasks = cursor.fetchall()
        
        conn.close()
        
        total_estimated = sum(task[5] for task in tasks)  # estimated_hours
        total_actual = sum(task[6] for task in tasks)     # actual_hours
        
        return {
            'total_tasks': len(tasks),
            'completed_tasks': len([t for t in tasks if t[7] == 'completed']),
            'in_progress_tasks': len([t for t in tasks if t[7] == 'in_progress']),
            'estimated_hours': total_estimated,
            'actual_hours': total_actual,
            'efficiency': (total_estimated / total_actual * 100) if total_actual > 0 else 0,
            'average_task_duration': total_actual / len(tasks) if tasks else 0
        }
