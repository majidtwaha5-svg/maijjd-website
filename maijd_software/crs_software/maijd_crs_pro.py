#!/usr/bin/env python3
"""
Maijd CRS Pro - Customer Relationship & Support System
Advanced support management with AI-powered ticket routing and resolution
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
import uuid
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class SupportTicket:
    """Support ticket data structure"""
    id: str
    customer_id: str
    title: str
    description: str
    priority: str  # low, medium, high, critical
    status: str  # open, in_progress, waiting, resolved, closed
    category: str
    assigned_to: Optional[str]
    created_at: datetime
    updated_at: datetime
    due_date: Optional[datetime]
    tags: List[str]
    attachments: List[str]
    ai_priority_score: float
    ai_category_prediction: str
    resolution_time: Optional[timedelta]

@dataclass
class Customer:
    """Customer data structure"""
    id: str
    name: str
    email: str
    phone: str
    company: str
    subscription_tier: str  # basic, premium, enterprise
    support_level: str  # standard, priority, vip
    created_at: datetime
    last_contact: datetime
    satisfaction_score: Optional[float]
    ai_sentiment_score: float

@dataclass
class KnowledgeBase:
    """Knowledge base article"""
    id: str
    title: str
    content: str
    category: str
    tags: List[str]
    author: str
    created_at: datetime
    updated_at: datetime
    views: int
    helpful_votes: int
    ai_relevance_score: float

@dataclass
class SupportAgent:
    """Support agent data structure"""
    id: str
    name: str
    email: str
    skills: List[str]
    availability: bool
    current_tickets: int
    max_tickets: int
    performance_score: float
    ai_workload_optimization: Dict[str, Any]

class MaijdCRSPro:
    """
    Advanced Customer Relationship & Support system with AI capabilities
    """

    def __init__(self):
        self.tickets: Dict[str, SupportTicket] = {}
        self.customers: Dict[str, Customer] = {}
        self.knowledge_base: Dict[str, KnowledgeBase] = {}
        self.agents: Dict[str, SupportAgent] = {}
        self.ai_features = {
            'ticket_routing': True,
            'priority_scoring': True,
            'category_prediction': True,
            'sentiment_analysis': True,
            'knowledge_recommendation': True,
            'workload_optimization': True,
            'satisfaction_prediction': True
        }
        self.automation_rules = {}
        self.analytics_enabled = True

    def create_customer(self, name: str, email: str, phone: str, company: str,
                       subscription_tier: str = 'basic') -> Customer:
        """Create a new customer"""
        customer_id = str(uuid.uuid4())
        
        # Determine support level based on subscription
        support_level_map = {
            'basic': 'standard',
            'premium': 'priority',
            'enterprise': 'vip'
        }
        support_level = support_level_map.get(subscription_tier, 'standard')
        
        customer = Customer(
            id=customer_id,
            name=name,
            email=email,
            phone=phone,
            company=company,
            subscription_tier=subscription_tier,
            support_level=support_level,
            created_at=datetime.now(),
            last_contact=datetime.now(),
            satisfaction_score=None,
            ai_sentiment_score=0.0
        )
        
        self.customers[customer_id] = customer
        logger.info(f"Created customer: {name} with {support_level} support")
        return customer

    def create_support_ticket(self, customer_id: str, title: str, description: str,
                            category: str = 'general') -> SupportTicket:
        """Create a new support ticket with AI-powered analysis"""
        if customer_id not in self.customers:
            return None
        
        ticket_id = str(uuid.uuid4())
        
        # AI-powered priority scoring
        priority_score = self._calculate_priority_score(description, category)
        priority = self._score_to_priority(priority_score)
        
        # AI-powered category prediction
        predicted_category = self._predict_category(description)
        if not category or category == 'general':
            category = predicted_category
        
        # AI-powered due date calculation
        due_date = self._calculate_due_date(priority, self.customers[customer_id].support_level)
        
        ticket = SupportTicket(
            id=ticket_id,
            customer_id=customer_id,
            title=title,
            description=description,
            priority=priority,
            status='open',
            category=category,
            assigned_to=None,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            due_date=due_date,
            tags=[],
            attachments=[],
            ai_priority_score=priority_score,
            ai_category_prediction=predicted_category,
            resolution_time=None
        )
        
        self.tickets[ticket_id] = ticket
        
        # Auto-assign ticket based on AI routing
        self._auto_assign_ticket(ticket)
        
        # Update customer last contact
        self.customers[customer_id].last_contact = datetime.now()
        
        logger.info(f"Created ticket: {title} with priority: {priority}")
        return ticket

    def update_ticket_status(self, ticket_id: str, new_status: str, agent_id: str) -> bool:
        """Update ticket status and track resolution time"""
        if ticket_id not in self.tickets:
            return False
        
        ticket = self.tickets[ticket_id]
        old_status = ticket.status
        ticket.status = new_status
        ticket.updated_at = datetime.now()
        ticket.assigned_to = agent_id
        
        # Calculate resolution time if resolved
        if new_status == 'resolved' and old_status != 'resolved':
            ticket.resolution_time = datetime.now() - ticket.created_at
            
            # Update agent performance
            if agent_id in self.agents:
                self._update_agent_performance(agent_id, ticket)
        
        logger.info(f"Updated ticket {ticket.title} to status: {new_status}")
        return True

    def add_ticket_response(self, ticket_id: str, response: str, agent_id: str) -> bool:
        """Add a response to a ticket"""
        if ticket_id not in self.tickets:
            return False
        
        ticket = self.tickets[ticket_id]
        ticket.updated_at = datetime.now()
        
        # AI sentiment analysis of response
        sentiment = self._analyze_sentiment(response)
        
        # Update ticket tags based on content
        new_tags = self._extract_tags(response)
        ticket.tags.extend(new_tags)
        
        logger.info(f"Added response to ticket: {ticket.title}")
        return True

    def create_knowledge_article(self, title: str, content: str, category: str,
                               author: str, tags: List[str] = None) -> KnowledgeBase:
        """Create a knowledge base article"""
        article_id = str(uuid.uuid4())
        
        # AI relevance scoring
        relevance_score = self._calculate_relevance_score(content, tags or [])
        
        article = KnowledgeBase(
            id=article_id,
            title=title,
            content=content,
            category=category,
            tags=tags or [],
            author=author,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            views=0,
            helpful_votes=0,
            ai_relevance_score=relevance_score
        )
        
        self.knowledge_base[article_id] = article
        logger.info(f"Created knowledge article: {title}")
        return article

    def search_knowledge_base(self, query: str, category: str = None) -> List[KnowledgeBase]:
        """Search knowledge base with AI-powered relevance"""
        results = []
        
        for article in self.knowledge_base.values():
            if category and article.category != category:
                continue
            
            # Calculate relevance score
            relevance = self._calculate_search_relevance(query, article)
            if relevance > 0.3:  # Minimum relevance threshold
                article.ai_relevance_score = relevance
                results.append(article)
        
        # Sort by relevance score
        results.sort(key=lambda x: x.ai_relevance_score, reverse=True)
        return results

    def recommend_solutions(self, ticket_id: str) -> List[KnowledgeBase]:
        """AI-powered solution recommendation for tickets"""
        if ticket_id not in self.tickets:
            return []
        
        ticket = self.tickets[ticket_id]
        
        # Extract key terms from ticket
        key_terms = self._extract_key_terms(ticket.description)
        
        # Find relevant knowledge articles
        recommendations = []
        for article in self.knowledge_base.values():
            relevance = self._calculate_article_relevance(article, key_terms, ticket.category)
            if relevance > 0.5:
                article.ai_relevance_score = relevance
                recommendations.append(article)
        
        # Sort by relevance and return top 5
        recommendations.sort(key=lambda x: x.ai_relevance_score, reverse=True)
        return recommendations[:5]

    def _calculate_priority_score(self, description: str, category: str) -> float:
        """AI-powered priority scoring algorithm"""
        score = 0.0
        
        # Urgency keywords
        urgency_words = ['urgent', 'critical', 'broken', 'down', 'error', 'fail', 'crash', 'emergency']
        for word in urgency_words:
            if word.lower() in description.lower():
                score += 0.2
        
        # Category-based scoring
        category_priorities = {
            'billing': 0.3,
            'technical': 0.4,
            'security': 0.8,
            'access': 0.6,
            'general': 0.1
        }
        score += category_priorities.get(category.lower(), 0.1)
        
        # Length-based scoring (longer descriptions might indicate complex issues)
        if len(description.split()) > 50:
            score += 0.1
        
        return min(score, 1.0)

    def _score_to_priority(self, score: float) -> str:
        """Convert AI score to priority level"""
        if score >= 0.8:
            return 'critical'
        elif score >= 0.6:
            return 'high'
        elif score >= 0.4:
            return 'medium'
        else:
            return 'low'

    def _predict_category(self, description: str) -> str:
        """AI-powered category prediction"""
        # Simple keyword-based category prediction
        category_keywords = {
            'billing': ['billing', 'payment', 'invoice', 'charge', 'cost', 'price'],
            'technical': ['error', 'bug', 'crash', 'slow', 'performance', 'technical'],
            'security': ['security', 'password', 'access', 'login', 'authentication'],
            'access': ['access', 'login', 'account', 'permission', 'user'],
            'general': ['question', 'help', 'support', 'information']
        }
        
        description_lower = description.lower()
        best_category = 'general'
        best_score = 0
        
        for category, keywords in category_keywords.items():
            score = sum(1 for keyword in keywords if keyword in description_lower)
            if score > best_score:
                best_score = score
                best_category = category
        
        return best_category

    def _calculate_due_date(self, priority: str, support_level: str) -> datetime:
        """Calculate due date based on priority and support level"""
        base_hours = {
            'critical': 2,
            'high': 8,
            'medium': 24,
            'low': 72
        }
        
        # Adjust based on support level
        level_multiplier = {
            'vip': 0.5,      # VIP customers get faster response
            'priority': 0.8,  # Priority customers get faster response
            'standard': 1.0   # Standard response time
        }
        
        hours = base_hours.get(priority, 24) * level_multiplier.get(support_level, 1.0)
        return datetime.now() + timedelta(hours=hours)

    def _auto_assign_ticket(self, ticket: SupportTicket) -> bool:
        """AI-powered automatic ticket assignment"""
        available_agents = [
            agent for agent in self.agents.values()
            if agent.availability and agent.current_tickets < agent.max_tickets
        ]
        
        if not available_agents:
            return False
        
        # Find best agent based on skills and workload
        best_agent = None
        best_score = -1
        
        for agent in available_agents:
            score = self._calculate_agent_match_score(agent, ticket)
            if score > best_score:
                best_score = score
                best_agent = agent
        
        if best_agent:
            ticket.assigned_to = best_agent.id
            best_agent.current_tickets += 1
            logger.info(f"Auto-assigned ticket to agent: {best_agent.name}")
            return True
        
        return False

    def _calculate_agent_match_score(self, agent: SupportAgent, ticket: SupportTicket) -> float:
        """Calculate how well an agent matches a ticket"""
        score = 0.0
        
        # Skill match
        if ticket.category.lower() in [skill.lower() for skill in agent.skills]:
            score += 0.4
        
        # Workload optimization (prefer agents with fewer tickets)
        workload_score = 1.0 - (agent.current_tickets / agent.max_tickets)
        score += workload_score * 0.3
        
        # Performance score
        score += agent.performance_score * 0.3
        
        return score

    def _update_agent_performance(self, agent_id: str, ticket: SupportTicket) -> None:
        """Update agent performance metrics"""
        if agent_id not in self.agents:
            return
        
        agent = self.agents[agent_id]
        
        # Calculate performance based on resolution time
        if ticket.resolution_time:
            target_time = self._get_target_resolution_time(ticket.priority)
            if ticket.resolution_time <= target_time:
                agent.performance_score = min(agent.performance_score + 0.1, 1.0)
            else:
                agent.performance_score = max(agent.performance_score - 0.05, 0.0)
        
        # Update workload
        agent.current_tickets = max(0, agent.current_tickets - 1)

    def _get_target_resolution_time(self, priority: str) -> timedelta:
        """Get target resolution time for priority level"""
        target_hours = {
            'critical': 4,
            'high': 24,
            'medium': 72,
            'low': 168  # 1 week
        }
        return timedelta(hours=target_hours.get(priority, 72))

    def _analyze_sentiment(self, text: str) -> float:
        """AI-powered sentiment analysis"""
        # Simplified sentiment analysis
        positive_words = ['good', 'great', 'excellent', 'helpful', 'solved', 'fixed', 'working']
        negative_words = ['bad', 'terrible', 'awful', 'broken', 'failed', 'useless', 'waste']
        
        text_lower = text.lower()
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count == 0 and negative_count == 0:
            return 0.0
        
        total_words = positive_count + negative_count
        sentiment = (positive_count - negative_count) / total_words
        
        return max(-1.0, min(1.0, sentiment))

    def _extract_tags(self, text: str) -> List[str]:
        """Extract relevant tags from text"""
        # Simple tag extraction (in real implementation, use NLP)
        common_tags = ['bug', 'feature', 'billing', 'access', 'performance', 'security']
        found_tags = []
        
        text_lower = text.lower()
        for tag in common_tags:
            if tag in text_lower:
                found_tags.append(tag)
        
        return found_tags

    def _extract_key_terms(self, text: str) -> List[str]:
        """Extract key terms for search and recommendation"""
        # Simple key term extraction
        words = text.lower().split()
        # Filter out common words and short words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'}
        key_terms = [word for word in words if len(word) > 3 and word not in stop_words]
        return key_terms[:10]  # Return top 10 terms

    def _calculate_relevance_score(self, content: str, tags: List[str]) -> float:
        """Calculate relevance score for knowledge articles"""
        score = 0.0
        
        # Tag relevance
        if tags:
            score += len(tags) * 0.1
        
        # Content length (longer articles might be more comprehensive)
        if len(content) > 500:
            score += 0.2
        
        # Content structure (headers, lists, etc.)
        if '#' in content or '-' in content or '1.' in content:
            score += 0.1
        
        return min(score, 1.0)

    def _calculate_search_relevance(self, query: str, article: KnowledgeBase) -> float:
        """Calculate search relevance for knowledge articles"""
        query_lower = query.lower()
        content_lower = article.content.lower()
        title_lower = article.title.lower()
        
        score = 0.0
        
        # Title match (highest weight)
        if query_lower in title_lower:
            score += 0.6
        
        # Content match
        if query_lower in content_lower:
            score += 0.3
        
        # Tag match
        for tag in article.tags:
            if query_lower in tag.lower():
                score += 0.1
        
        return min(score, 1.0)

    def _calculate_article_relevance(self, article: KnowledgeBase, key_terms: List[str], 
                                   ticket_category: str) -> float:
        """Calculate article relevance for ticket recommendations"""
        score = 0.0
        
        # Category match
        if article.category.lower() == ticket_category.lower():
            score += 0.4
        
        # Key terms match
        content_lower = article.content.lower()
        term_matches = sum(1 for term in key_terms if term in content_lower)
        score += (term_matches / len(key_terms)) * 0.4 if key_terms else 0
        
        # Tag relevance
        tag_matches = sum(1 for tag in article.tags if tag.lower() in ticket_category.lower())
        score += tag_matches * 0.1
        
        # Popularity (views and helpful votes)
        popularity_score = min(article.views / 100, 1.0) * 0.1
        score += popularity_score
        
        return min(score, 1.0)

    def get_support_analytics(self) -> Dict[str, Any]:
        """Get comprehensive support analytics"""
        total_tickets = len(self.tickets)
        open_tickets = len([t for t in self.tickets.values() if t.status == 'open'])
        resolved_tickets = len([t for t in self.tickets.values() if t.status == 'resolved'])
        
        # Calculate average resolution time
        resolved_tickets_with_time = [t for t in self.tickets.values() if t.resolution_time]
        avg_resolution_time = None
        if resolved_tickets_with_time:
            total_time = sum(t.resolution_time for t in resolved_tickets_with_time)
            avg_resolution_time = total_time / len(resolved_tickets_with_time)
        
        # Priority distribution
        priority_distribution = {}
        for ticket in self.tickets.values():
            priority_distribution[ticket.priority] = priority_distribution.get(ticket.priority, 0) + 1
        
        # Category distribution
        category_distribution = {}
        for ticket in self.tickets.values():
            category_distribution[ticket.category] = category_distribution.get(ticket.category, 0) + 1
        
        return {
            'total_tickets': total_tickets,
            'open_tickets': open_tickets,
            'resolved_tickets': resolved_tickets,
            'resolution_rate': (resolved_tickets / total_tickets * 100) if total_tickets > 0 else 0,
            'average_resolution_time': str(avg_resolution_time) if avg_resolution_time else 'N/A',
            'priority_distribution': priority_distribution,
            'category_distribution': category_distribution,
            'total_customers': len(self.customers),
            'total_knowledge_articles': len(self.knowledge_base),
            'total_agents': len(self.agents),
            'ai_features_enabled': self.ai_features,
            'automation_rules': len(self.automation_rules),
            'analytics_enabled': self.analytics_enabled
        }

    def get_statistics(self) -> Dict[str, Any]:
        """Get CRS system statistics"""
        return {
            'tickets': len(self.tickets),
            'customers': len(self.customers),
            'knowledge_base': len(self.knowledge_base),
            'agents': len(self.agents),
            'ai_features': self.ai_features,
            'automation_rules': len(self.automation_rules),
            'analytics_enabled': self.analytics_enabled
        }

def main():
    """Main function for testing"""
    crs = MaijdCRSPro()
    
    # Create test customers
    customer1 = crs.create_customer("Acme Corp", "support@acme.com", "+1-555-0101", 
                                   "Acme Corporation", "premium")
    customer2 = crs.create_customer("TechStart Inc", "help@techstart.com", "+1-555-0102",
                                   "TechStart Inc", "enterprise")
    
    # Create test tickets
    ticket1 = crs.create_support_ticket(customer1.id, "Login Error", 
                                       "Cannot login to the system, getting authentication error", "technical")
    ticket2 = crs.create_support_ticket(customer2.id, "Billing Question", 
                                       "Need clarification on monthly charges", "billing")
    
    # Create knowledge articles
    article1 = crs.create_knowledge_article("How to Reset Password", 
                                           "Step-by-step guide to reset your password", 
                                           "access", "support_team", ["password", "reset", "access"])
    article2 = crs.create_knowledge_article("Understanding Your Bill", 
                                           "Detailed explanation of billing components", 
                                           "billing", "billing_team", ["billing", "charges", "invoice"])
    
    # Search knowledge base
    search_results = crs.search_knowledge_base("password reset")
    recommendations = crs.recommend_solutions(ticket1.id)
    
    # Get analytics
    analytics = crs.get_support_analytics()
    
    print("CRS Pro Test Results:")
    print(f"Total tickets: {analytics['total_tickets']}")
    print(f"Open tickets: {analytics['open_tickets']}")
    print(f"Resolution rate: {analytics['resolution_rate']:.1f}%")
    print(f"Knowledge articles: {analytics['total_knowledge_articles']}")
    print(f"Search results for 'password reset': {len(search_results)}")
    print(f"Solution recommendations for ticket: {len(recommendations)}")

if __name__ == "__main__":
    main()
