#!/usr/bin/env python3
"""
Maijd Customer Service - Customer Support Platform
Advanced customer service with AI-powered support and ticket management
"""

import os
import sys
import json
import time
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, asdict
from pathlib import Path
import hashlib
import threading
import queue
import base64
import io

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class Customer:
    """Customer data structure"""
    id: str
    first_name: str
    last_name: str
    email: str
    phone: str
    company: str
    customer_type: str  # individual, business, enterprise
    status: str  # active, inactive, suspended
    created_at: datetime
    updated_at: datetime
    preferences: Dict[str, Any]
    support_history: List[str]

@dataclass
class SupportTicket:
    """Support ticket data structure"""
    id: str
    customer_id: str
    subject: str
    description: str
    category: str  # technical, billing, feature_request, bug_report
    priority: str  # low, medium, high, urgent, critical
    status: str  # open, in_progress, waiting_customer, resolved, closed
    assigned_to: str
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime]
    resolution_time: Optional[int]  # in minutes
    tags: List[str]
    attachments: List[str]
    interactions: List[Dict[str, Any]]

@dataclass
class SupportInteraction:
    """Support interaction data structure"""
    id: str
    ticket_id: str
    type: str  # customer_message, agent_response, system_note, internal_note
    author: str
    content: str
    is_internal: bool
    created_at: datetime
    attachments: List[str]

@dataclass
class KnowledgeBase:
    """Knowledge base article"""
    id: str
    title: str
    content: str
    category: str
    tags: List[str]
    author: str
    status: str  # draft, published, archived
    views: int
    helpful_votes: int
    created_at: datetime
    updated_at: datetime

@dataclass
class SupportAgent:
    """Support agent data structure"""
    id: str
    name: str
    email: str
    skills: List[str]
    availability: str  # available, busy, offline
    current_tickets: List[str]
    performance_metrics: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

class MaijdCustomerService:
    """
    Advanced customer service system with AI capabilities
    """
    
    def __init__(self):
        self.customers: Dict[str, Customer] = {}
        self.tickets: Dict[str, SupportTicket] = {}
        self.interactions: Dict[str, SupportInteraction] = {}
        self.knowledge_base: Dict[str, KnowledgeBase] = {}
        self.agents: Dict[str, SupportAgent] = {}
        self.ai_features = {
            'ticket_classification': True,
            'priority_prediction': True,
            'auto_response': True,
            'sentiment_analysis': True,
            'knowledge_recommendations': True,
            'escalation_prediction': True
        }
        self.automation_features = {
            'ticket_routing': True,
            'auto_assignments': True,
            'follow_up_reminders': True,
            'sla_monitoring': True,
            'customer_satisfaction_surveys': True
        }
        self.integrations = ['email', 'chat', 'phone', 'social_media', 'crm']
        
    def create_customer(self, first_name: str, last_name: str, email: str, 
                       phone: str, company: str = "", customer_type: str = "individual") -> Customer:
        """Create a new customer"""
        customer_id = hashlib.md5(f"{email}{time.time()}".encode()).hexdigest()
        
        customer = Customer(
            id=customer_id,
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            company=company,
            customer_type=customer_type,
            status='active',
            created_at=datetime.now(),
            updated_at=datetime.now(),
            preferences={
                'communication_preference': 'email',
                'language': 'en',
                'timezone': 'UTC'
            },
            support_history=[]
        )
        
        self.customers[customer_id] = customer
        logger.info(f"Created customer: {first_name} {last_name} ({email})")
        return customer
    
    def create_support_ticket(self, customer_id: str, subject: str, description: str,
                             category: str, priority: str = "medium") -> SupportTicket:
        """Create a new support ticket"""
        ticket_id = hashlib.md5(f"{subject}{time.time()}".encode()).hexdigest()
        
        ticket = SupportTicket(
            id=ticket_id,
            customer_id=customer_id,
            subject=subject,
            description=description,
            category=category,
            priority=priority,
            status='open',
            assigned_to='',
            created_at=datetime.now(),
            updated_at=datetime.now(),
            resolved_at=None,
            resolution_time=None,
            tags=[],
            attachments=[],
            interactions=[]
        )
        
        self.tickets[ticket_id] = ticket
        
        # Add ticket to customer history
        if customer_id in self.customers:
            self.customers[customer_id].support_history.append(ticket_id)
            self.customers[customer_id].updated_at = datetime.now()
        
        # Create initial interaction
        initial_interaction = self.create_interaction(
            ticket_id=ticket_id,
            type='customer_message',
            author=customer_id,
            content=description,
            is_internal=False
        )
        
        ticket.interactions.append(initial_interaction.id)
        
        logger.info(f"Created support ticket: {subject} for customer {customer_id}")
        return ticket
    
    def create_interaction(self, ticket_id: str, type: str, author: str, 
                          content: str, is_internal: bool = False) -> SupportInteraction:
        """Create a new support interaction"""
        interaction_id = hashlib.md5(f"{content}{time.time()}".encode()).hexdigest()
        
        interaction = SupportInteraction(
            id=interaction_id,
            ticket_id=ticket_id,
            type=type,
            author=author,
            content=content,
            is_internal=is_internal,
            created_at=datetime.now(),
            attachments=[]
        )
        
        self.interactions[interaction_id] = interaction
        
        # Update ticket
        if ticket_id in self.tickets:
            self.tickets[ticket_id].interactions.append(interaction_id)
            self.tickets[ticket_id].updated_at = datetime.now()
        
        logger.info(f"Created interaction for ticket {ticket_id} by {author}")
        return interaction
    
    def assign_ticket(self, ticket_id: str, agent_id: str) -> bool:
        """Assign ticket to a support agent"""
        if ticket_id not in self.tickets or agent_id not in self.agents:
            return False
            
        ticket = self.tickets[ticket_id]
        old_agent = ticket.assigned_to
        ticket.assigned_to = agent_id
        ticket.status = 'in_progress'
        ticket.updated_at = datetime.now()
        
        # Update agent's current tickets
        if old_agent and old_agent in self.agents:
            if ticket_id in self.agents[old_agent].current_tickets:
                self.agents[old_agent].current_tickets.remove(ticket_id)
        
        if agent_id in self.agents:
            self.agents[agent_id].current_tickets.append(ticket_id)
            self.agents[agent_id].updated_at = datetime.now()
        
        # Add assignment note
        assignment_note = self.create_interaction(
            ticket_id=ticket_id,
            type='system_note',
            author='system',
            content=f'Ticket assigned to {agent_id}',
            is_internal=True
        )
        
        logger.info(f"Ticket {ticket_id} assigned to {agent_id}")
        return True
    
    def update_ticket_status(self, ticket_id: str, new_status: str, agent: str) -> bool:
        """Update ticket status"""
        if ticket_id not in self.tickets:
            return False
            
        ticket = self.tickets[ticket_id]
        old_status = ticket.status
        ticket.status = new_status
        ticket.updated_at = datetime.now()
        
        # Handle resolution
        if new_status == 'resolved':
            ticket.resolved_at = datetime.now()
            if ticket.created_at:
                resolution_time = (ticket.resolved_at - ticket.created_at).total_seconds() / 60
                ticket.resolution_time = int(resolution_time)
        
        # Add status change note
        status_note = self.create_interaction(
            ticket_id=ticket_id,
            type='system_note',
            author=agent,
            content=f'Status changed from {old_status} to {new_status}',
            is_internal=True
        )
        
        logger.info(f"Ticket {ticket_id} status updated from {old_status} to {new_status}")
        return True
    
    def add_ticket_response(self, ticket_id: str, agent_id: str, content: str, 
                           is_internal: bool = False) -> bool:
        """Add a response to a ticket"""
        if ticket_id not in self.tickets:
            return False
            
        interaction_type = 'internal_note' if is_internal else 'agent_response'
        
        interaction = self.create_interaction(
            ticket_id=ticket_id,
            type=interaction_type,
            author=agent_id,
            content=content,
            is_internal=is_internal
        )
        
        # Update ticket status if it was waiting
        if self.tickets[ticket_id].status == 'waiting_customer':
            self.update_ticket_status(ticket_id, 'in_progress', agent_id)
        
        logger.info(f"Added response to ticket {ticket_id} by {agent_id}")
        return True
    
    def ai_ticket_classification(self, ticket_id: str) -> Dict[str, Any]:
        """AI-powered ticket classification"""
        if ticket_id not in self.tickets:
            return {}
            
        ticket = self.tickets[ticket_id]
        
        # Simulate AI classification
        content = f"{ticket.subject} {ticket.description}".lower()
        
        # Category classification
        category_keywords = {
            'technical': ['error', 'bug', 'crash', 'not working', 'broken', 'issue'],
            'billing': ['payment', 'invoice', 'charge', 'billing', 'subscription', 'cost'],
            'feature_request': ['feature', 'request', 'suggestion', 'improvement', 'new'],
            'bug_report': ['bug', 'defect', 'problem', 'fault', 'glitch']
        }
        
        predicted_category = 'technical'  # default
        max_score = 0
        
        for category, keywords in category_keywords.items():
            score = sum(1 for keyword in keywords if keyword in content)
            if score > max_score:
                max_score = score
                predicted_category = category
        
        # Priority prediction
        priority_keywords = {
            'critical': ['urgent', 'critical', 'emergency', 'down', 'broken'],
            'high': ['important', 'blocking', 'cannot work', 'stopped'],
            'medium': ['issue', 'problem', 'help needed'],
            'low': ['question', 'information', 'general']
        }
        
        predicted_priority = 'medium'  # default
        max_priority_score = 0
        
        for priority, keywords in priority_keywords.items():
            score = sum(1 for keyword in keywords if keyword in content)
            if score > max_priority_score:
                max_priority_score = score
                predicted_priority = priority
        
        # Sentiment analysis
        positive_words = ['great', 'good', 'excellent', 'working', 'solved']
        negative_words = ['bad', 'terrible', 'awful', 'broken', 'problem', 'issue']
        
        positive_count = sum(1 for word in positive_words if word in content)
        negative_count = sum(1 for word in negative_words if word in content)
        
        if positive_count > negative_count:
            sentiment = 'positive'
        elif negative_count > positive_count:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
        
        return {
            'ticket_id': ticket_id,
            'predicted_category': predicted_category,
            'predicted_priority': predicted_priority,
            'sentiment': sentiment,
            'confidence_score': min(max_score / 3 * 100, 100),  # Normalize to 0-100
            'classification_factors': {
                'category_keywords_found': max_score,
                'priority_keywords_found': max_priority_score,
                'sentiment_score': positive_count - negative_count
            },
            'recommendations': [
                f"Consider updating category to: {predicted_category}",
                f"Consider updating priority to: {predicted_priority}",
                f"Customer sentiment: {sentiment}"
            ]
        }
    
    def ai_knowledge_recommendations(self, ticket_id: str) -> List[Dict[str, Any]]:
        """AI-powered knowledge base recommendations"""
        if ticket_id not in self.tickets:
            return []
            
        ticket = self.tickets[ticket_id]
        
        # Simulate AI knowledge base search
        content = f"{ticket.subject} {ticket.description}".lower()
        
        recommendations = []
        
        for article_id, article in self.knowledge_base.items():
            if article.status != 'published':
                continue
                
            # Simple keyword matching
            article_content = f"{article.title} {article.content}".lower()
            article_tags = [tag.lower() for tag in article.tags]
            
            # Calculate relevance score
            relevance_score = 0
            
            # Title match
            if any(word in article.title.lower() for word in content.split()):
                relevance_score += 30
            
            # Content match
            content_words = content.split()
            article_words = article_content.split()
            common_words = set(content_words) & set(article_words)
            relevance_score += len(common_words) * 2
            
            # Tag match
            for tag in article_tags:
                if tag in content:
                    relevance_score += 15
            
            # Category match
            if article.category.lower() == ticket.category.lower():
                relevance_score += 20
            
            if relevance_score > 10:  # Only recommend if relevant enough
                recommendations.append({
                    'article_id': article_id,
                    'title': article.title,
                    'relevance_score': relevance_score,
                    'category': article.category,
                    'tags': article.tags,
                    'views': article.views,
                    'helpful_votes': article.helpful_votes
                })
        
        # Sort by relevance score
        recommendations.sort(key=lambda x: x['relevance_score'], reverse=True)
        
        return recommendations[:5]  # Return top 5 recommendations
    
    def ai_escalation_prediction(self, ticket_id: str) -> Dict[str, Any]:
        """AI-powered escalation prediction"""
        if ticket_id not in self.tickets:
            return {}
            
        ticket = self.tickets[ticket_id]
        
        # Simulate AI escalation analysis
        escalation_risk = 0
        factors = []
        
        # Time-based factors
        if ticket.created_at:
            time_open = (datetime.now() - ticket.created_at).total_seconds() / 3600  # hours
            if time_open > 48:
                escalation_risk += 40
                factors.append(f"Ticket open for {time_open:.1f} hours (+40)")
            elif time_open > 24:
                escalation_risk += 25
                factors.append(f"Ticket open for {time_open:.1f} hours (+25)")
            elif time_open > 8:
                escalation_risk += 15
                factors.append(f"Ticket open for {time_open:.1f} hours (+15)")
        
        # Priority factors
        priority_risk = {
            'critical': 30,
            'urgent': 25,
            'high': 20,
            'medium': 10,
            'low': 5
        }
        escalation_risk += priority_risk.get(ticket.priority, 10)
        factors.append(f"Priority {ticket.priority} (+{priority_risk.get(ticket.priority, 10)})")
        
        # Customer type factors
        if ticket.customer_id in self.customers:
            customer = self.customers[ticket.customer_id]
            if customer.customer_type == 'enterprise':
                escalation_risk += 20
                factors.append("Enterprise customer (+20)")
            elif customer.customer_type == 'business':
                escalation_risk += 10
                factors.append("Business customer (+10)")
        
        # Interaction factors
        if len(ticket.interactions) > 5:
            escalation_risk += 15
            factors.append(f"High interaction count: {len(ticket.interactions)} (+15)")
        
        # Determine escalation level
        if escalation_risk >= 80:
            escalation_level = 'High'
            recommendation = 'Escalate immediately to senior agent or manager'
        elif escalation_risk >= 60:
            escalation_level = 'Medium'
            recommendation = 'Monitor closely and consider escalation if no progress'
        elif escalation_risk >= 40:
            escalation_level = 'Low'
            recommendation = 'Continue normal handling with regular updates'
        else:
            escalation_level = 'Very Low'
            recommendation = 'Standard handling is appropriate'
        
        return {
            'ticket_id': ticket_id,
            'escalation_risk_score': escalation_risk,
            'escalation_level': escalation_level,
            'recommendation': recommendation,
            'risk_factors': factors,
            'prediction_date': datetime.now().isoformat()
        }
    
    def get_support_dashboard(self) -> Dict[str, Any]:
        """Get comprehensive support dashboard data"""
        current_date = datetime.now()
        
        # Ticket statistics
        total_tickets = len(self.tickets)
        open_tickets = len([t for t in self.tickets.values() if t.status == 'open'])
        in_progress_tickets = len([t for t in self.tickets.values() if t.status == 'in_progress'])
        resolved_tickets = len([t for t in self.tickets.values() if t.status == 'resolved'])
        closed_tickets = len([t for t in self.tickets.values() if t.status == 'closed'])
        
        # Priority distribution
        priority_distribution = {
            'critical': len([t for t in self.tickets.values() if t.priority == 'critical']),
            'urgent': len([t for t in self.tickets.values() if t.priority == 'urgent']),
            'high': len([t for t in self.tickets.values() if t.priority == 'high']),
            'medium': len([t for t in self.tickets.values() if t.priority == 'medium']),
            'low': len([t for t in self.tickets.values() if t.priority == 'low'])
        }
        
        # Category distribution
        category_distribution = {}
        for ticket in self.tickets.values():
            category = ticket.category
            category_distribution[category] = category_distribution.get(category, 0) + 1
        
        # Agent performance
        agent_performance = {}
        for agent_id, agent in self.agents.items():
            assigned_tickets = len(agent.current_tickets)
            resolved_tickets = len([t for t in self.tickets.values() 
                                 if t.assigned_to == agent_id and t.status in ['resolved', 'closed']])
            
            agent_performance[agent_id] = {
                'name': agent.name,
                'assigned_tickets': assigned_tickets,
                'resolved_tickets': resolved_tickets,
                'availability': agent.availability
            }
        
        # Calculate average resolution time
        resolved_tickets_with_time = [t for t in self.tickets.values() 
                                    if t.resolution_time is not None]
        avg_resolution_time = 0
        if resolved_tickets_with_time:
            avg_resolution_time = sum(t.resolution_time for t in resolved_tickets_with_time) / len(resolved_tickets_with_time)
        
        dashboard = {
            'summary': {
                'total_tickets': total_tickets,
                'open_tickets': open_tickets,
                'in_progress_tickets': in_progress_tickets,
                'resolved_tickets': resolved_tickets,
                'closed_tickets': closed_tickets
            },
            'priority_distribution': priority_distribution,
            'category_distribution': category_distribution,
            'agent_performance': agent_performance,
            'performance_metrics': {
                'average_resolution_time_minutes': round(avg_resolution_time, 1),
                'resolution_rate': round((resolved_tickets + closed_tickets) / total_tickets * 100, 1) if total_tickets > 0 else 0
            },
            'last_updated': current_date.isoformat()
        }
        
        return dashboard
    
    def list_tickets(self, status: str = None, priority: str = None, 
                    assigned_to: str = None) -> List[Dict[str, Any]]:
        """List tickets with optional filtering"""
        tickets_list = []
        
        for ticket in self.tickets.values():
            if (status is None or ticket.status == status) and \
               (priority is None or ticket.priority == priority) and \
               (assigned_to is None or ticket.assigned_to == assigned_to):
                
                # Get customer info
                customer_name = "Unknown"
                if ticket.customer_id in self.customers:
                    customer = self.customers[ticket.customer_id]
                    customer_name = f"{customer.first_name} {customer.last_name}"
                
                tickets_list.append({
                    'id': ticket.id,
                    'subject': ticket.subject,
                    'customer_name': customer_name,
                    'customer_id': ticket.customer_id,
                    'category': ticket.category,
                    'priority': ticket.priority,
                    'status': ticket.status,
                    'assigned_to': ticket.assigned_to,
                    'created_at': ticket.created_at.isoformat(),
                    'updated_at': ticket.updated_at.isoformat(),
                    'interaction_count': len(ticket.interactions),
                    'resolution_time': ticket.resolution_time
                })
        
        return tickets_list

def main():
    """Main function for testing"""
    customer_service = MaijdCustomerService()
    
    # Create customers
    customer1 = customer_service.create_customer(
        first_name="Alice",
        last_name="Johnson",
        email="alice.j@company.com",
        phone="+1-555-0123",
        company="TechCorp",
        customer_type="business"
    )
    
    customer2 = customer_service.create_customer(
        first_name="Bob",
        last_name="Smith",
        email="bob.smith@enterprise.com",
        phone="+1-555-0456",
        company="Enterprise Inc",
        customer_type="enterprise"
    )
    
    # Create support agents
    agent1 = SupportAgent(
        id="agent_1",
        name="John Support",
        email="john.support@company.com",
        skills=["technical", "billing"],
        availability="available",
        current_tickets=[],
        performance_metrics={},
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    
    customer_service.agents[agent1.id] = agent1
    
    # Create support tickets
    ticket1 = customer_service.create_support_ticket(
        customer_id=customer1.id,
        subject="Login Error",
        description="I cannot log into my account. Getting error message 'Invalid credentials'",
        category="technical",
        priority="high"
    )
    
    ticket2 = customer_service.create_support_ticket(
        customer_id=customer2.id,
        subject="Billing Question",
        description="I have a question about my monthly subscription charges",
        category="billing",
        priority="medium"
    )
    
    # Assign tickets
    customer_service.assign_ticket(ticket1.id, agent1.id)
    
    # Add responses
    customer_service.add_ticket_response(
        ticket_id=ticket1.id,
        agent_id=agent1.id,
        content="I can help you with this login issue. Let me check your account status."
    )
    
    customer_service.add_ticket_response(
        ticket_id=ticket2.id,
        agent_id=agent1.id,
        content="I'll review your billing information and get back to you shortly."
    )
    
    # Update ticket status
    customer_service.update_ticket_status(ticket1.id, "in_progress", agent1.id)
    customer_service.update_ticket_status(ticket2.id, "in_progress", agent1.id)
    
    # AI features
    classification1 = customer_service.ai_ticket_classification(ticket1.id)
    print(f"AI Ticket Classification 1: {json.dumps(classification1, indent=2)}")
    
    classification2 = customer_service.ai_ticket_classification(ticket2.id)
    print(f"AI Ticket Classification 2: {json.dumps(classification2, indent=2)}")
    
    escalation_prediction1 = customer_service.ai_escalation_prediction(ticket1.id)
    print(f"AI Escalation Prediction 1: {json.dumps(escalation_prediction1, indent=2)}")
    
    escalation_prediction2 = customer_service.ai_escalation_prediction(ticket2.id)
    print(f"AI Escalation Prediction 2: {json.dumps(escalation_prediction2, indent=2)}")
    
    # Get dashboard
    dashboard = customer_service.get_support_dashboard()
    print(f"Support Dashboard: {json.dumps(dashboard, indent=2)}")
    
    # List tickets
    tickets = customer_service.list_tickets()
    print(f"Tickets: {json.dumps(tickets, indent=2)}")

if __name__ == "__main__":
    main()
