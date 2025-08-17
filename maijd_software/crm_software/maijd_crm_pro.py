#!/usr/bin/env python3
"""
Maijd CRM Pro - Advanced Customer Relationship Management System
Complete CRM solution with AI-powered insights, automation, and analytics
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

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class Customer:
    """Customer data structure"""
    id: str
    name: str
    email: str
    phone: str
    company: str
    industry: str
    status: str  # lead, prospect, customer, inactive
    source: str
    assigned_to: str
    created_at: datetime
    updated_at: datetime
    tags: List[str]
    custom_fields: Dict[str, Any]
    ai_insights: Dict[str, Any]

@dataclass
class Deal:
    """Sales deal data structure"""
    id: str
    customer_id: str
    title: str
    amount: float
    stage: str  # qualification, proposal, negotiation, closed_won, closed_lost
    probability: float
    expected_close_date: datetime
    assigned_to: str
    created_at: datetime
    updated_at: datetime
    activities: List[Dict[str, Any]]
    ai_predictions: Dict[str, Any]

@dataclass
class Activity:
    """Customer interaction activity"""
    id: str
    customer_id: str
    deal_id: Optional[str]
    type: str  # call, email, meeting, task
    subject: str
    description: str
    due_date: Optional[datetime]
    completed: bool
    assigned_to: str
    created_at: datetime
    ai_sentiment: Optional[float]

class MaijdCRMPro:
    """
    Advanced CRM system with AI capabilities and automation
    """

    def __init__(self):
        self.customers: Dict[str, Customer] = {}
        self.deals: Dict[str, Deal] = {}
        self.activities: Dict[str, Activity] = {}
        self.ai_features = {
            'lead_scoring': True,
            'deal_prediction': True,
            'customer_segmentation': True,
            'sentiment_analysis': True,
            'churn_prediction': True,
            'next_best_action': True
        }
        self.automation_workflows = {}
        self.reporting_analytics = True

    def create_customer(self, name: str, email: str, phone: str, company: str, 
                       industry: str, source: str, assigned_to: str) -> Customer:
        """Create a new customer"""
        customer_id = str(uuid.uuid4())
        
        customer = Customer(
            id=customer_id,
            name=name,
            email=email,
            phone=phone,
            company=company,
            industry=industry,
            status='lead',
            source=source,
            assigned_to=assigned_to,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            tags=[],
            custom_fields={},
            ai_insights={}
        )
        
        self.customers[customer_id] = customer
        
        # AI-powered lead scoring
        lead_score = self._calculate_lead_score(customer)
        customer.ai_insights['lead_score'] = lead_score
        
        logger.info(f"Created customer: {name} with lead score: {lead_score}")
        return customer

    def update_customer(self, customer_id: str, updates: Dict[str, Any]) -> bool:
        """Update customer information"""
        if customer_id not in self.customers:
            return False
        
        customer = self.customers[customer_id]
        
        for key, value in updates.items():
            if hasattr(customer, key):
                setattr(customer, key, value)
        
        customer.updated_at = datetime.now()
        
        # Recalculate AI insights
        if 'industry' in updates or 'company' in updates:
            lead_score = self._calculate_lead_score(customer)
            customer.ai_insights['lead_score'] = lead_score
        
        logger.info(f"Updated customer: {customer.name}")
        return True

    def create_deal(self, customer_id: str, title: str, amount: float, 
                   stage: str, assigned_to: str) -> Deal:
        """Create a new sales deal"""
        if customer_id not in self.customers:
            return None
        
        deal_id = str(uuid.uuid4())
        
        deal = Deal(
            id=deal_id,
            customer_id=customer_id,
            title=title,
            amount=amount,
            stage=stage,
            probability=self._calculate_deal_probability(stage, amount),
            expected_close_date=datetime.now() + timedelta(days=30),
            assigned_to=assigned_to,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            activities=[],
            ai_predictions={}
        )
        
        self.deals[deal_id] = deal
        
        # AI-powered deal prediction
        win_probability = self._predict_deal_win_probability(deal)
        deal.ai_predictions['win_probability'] = win_probability
        
        logger.info(f"Created deal: {title} with win probability: {win_probability:.2%}")
        return deal

    def update_deal_stage(self, deal_id: str, new_stage: str) -> bool:
        """Update deal stage and recalculate probabilities"""
        if deal_id not in self.deals:
            return False
        
        deal = self.deals[deal_id]
        deal.stage = new_stage
        deal.updated_at = datetime.now()
        deal.probability = self._calculate_deal_probability(new_stage, deal.amount)
        
        # Update AI predictions
        win_probability = self._predict_deal_win_probability(deal)
        deal.ai_predictions['win_probability'] = win_probability
        
        logger.info(f"Updated deal {deal.title} to stage: {new_stage}")
        return True

    def create_activity(self, customer_id: str, activity_type: str, subject: str,
                       description: str, assigned_to: str, due_date: Optional[datetime] = None) -> Activity:
        """Create a new customer activity"""
        if customer_id not in self.customers:
            return None
        
        activity_id = str(uuid.uuid4())
        
        activity = Activity(
            id=activity_id,
            customer_id=customer_id,
            deal_id=None,
            type=activity_type,
            subject=subject,
            description=description,
            due_date=due_date,
            completed=False,
            assigned_to=assigned_to,
            created_at=datetime.now(),
            ai_sentiment=None
        )
        
        self.activities[activity_id] = activity
        
        # AI sentiment analysis for text-based activities
        if activity_type in ['email', 'call']:
            sentiment = self._analyze_sentiment(description)
            activity.ai_sentiment = sentiment
        
        logger.info(f"Created activity: {subject} for customer: {customer_id}")
        return activity

    def complete_activity(self, activity_id: str) -> bool:
        """Mark activity as completed"""
        if activity_id not in self.activities:
            return False
        
        activity = self.activities[activity_id]
        activity.completed = True
        
        # Update customer last activity
        if activity.customer_id in self.customers:
            customer = self.customers[activity.customer_id]
            customer.updated_at = datetime.now()
        
        logger.info(f"Completed activity: {activity.subject}")
        return True

    def _calculate_lead_score(self, customer: Customer) -> int:
        """AI-powered lead scoring algorithm"""
        score = 0
        
        # Company size scoring
        if customer.company:
            if len(customer.company) > 20:
                score += 20  # Large company
            elif len(customer.company) > 10:
                score += 15  # Medium company
            else:
                score += 10  # Small company
        
        # Industry scoring
        high_value_industries = ['technology', 'finance', 'healthcare', 'manufacturing']
        if customer.industry.lower() in high_value_industries:
            score += 25
        
        # Source scoring
        high_quality_sources = ['website', 'referral', 'partner']
        if customer.source.lower() in high_quality_sources:
            score += 20
        
        # Contact completeness
        if customer.email and customer.phone:
            score += 15
        
        return min(score, 100)  # Cap at 100

    def _calculate_deal_probability(self, stage: str, amount: float) -> float:
        """Calculate deal probability based on stage and amount"""
        stage_probabilities = {
            'qualification': 0.1,
            'proposal': 0.3,
            'negotiation': 0.6,
            'closed_won': 1.0,
            'closed_lost': 0.0
        }
        
        base_probability = stage_probabilities.get(stage, 0.1)
        
        # Adjust based on deal amount (larger deals have lower probability)
        if amount > 100000:
            base_probability *= 0.8
        elif amount > 50000:
            base_probability *= 0.9
        
        return min(base_probability, 1.0)

    def _predict_deal_win_probability(self, deal: Deal) -> float:
        """AI-powered deal win prediction"""
        base_probability = deal.probability
        
        # Adjust based on deal age
        days_open = (datetime.now() - deal.created_at).days
        if days_open > 90:
            base_probability *= 0.8  # Older deals have lower probability
        
        # Adjust based on activity level
        activity_count = len(deal.activities)
        if activity_count > 5:
            base_probability *= 1.1  # Active deals have higher probability
        elif activity_count < 2:
            base_probability *= 0.9  # Inactive deals have lower probability
        
        return min(base_probability, 1.0)

    def _analyze_sentiment(self, text: str) -> float:
        """AI-powered sentiment analysis"""
        # Simplified sentiment analysis (in real implementation, use NLP libraries)
        positive_words = ['great', 'excellent', 'good', 'happy', 'satisfied', 'love']
        negative_words = ['bad', 'terrible', 'awful', 'unhappy', 'disappointed', 'hate']
        
        text_lower = text.lower()
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count == 0 and negative_count == 0:
            return 0.0  # Neutral
        
        total_words = positive_count + negative_count
        sentiment = (positive_count - negative_count) / total_words
        
        return max(-1.0, min(1.0, sentiment))  # Clamp between -1 and 1

    def get_customer_segments(self) -> Dict[str, List[Customer]]:
        """AI-powered customer segmentation"""
        segments = {
            'high_value': [],
            'growth_potential': [],
            'at_risk': [],
            'stable': []
        }
        
        for customer in self.customers.values():
            lead_score = customer.ai_insights.get('lead_score', 0)
            
            if lead_score >= 80:
                segments['high_value'].append(customer)
            elif lead_score >= 60:
                segments['growth_potential'].append(customer)
            elif lead_score <= 30:
                segments['at_risk'].append(customer)
            else:
                segments['stable'].append(customer)
        
        return segments

    def get_sales_pipeline(self) -> Dict[str, List[Deal]]:
        """Get deals organized by sales stage"""
        pipeline = {
            'qualification': [],
            'proposal': [],
            'negotiation': [],
            'closed_won': [],
            'closed_lost': []
        }
        
        for deal in self.deals.values():
            if deal.stage in pipeline:
                pipeline[deal.stage].append(deal)
        
        return pipeline

    def get_ai_insights(self) -> Dict[str, Any]:
        """Get comprehensive AI insights and predictions"""
        total_customers = len(self.customers)
        total_deals = len(self.deals)
        total_activities = len(self.activities)
        
        # Calculate conversion rates
        won_deals = len([d for d in self.deals.values() if d.stage == 'closed_won'])
        conversion_rate = (won_deals / total_deals * 100) if total_deals > 0 else 0
        
        # Average deal size
        deal_amounts = [d.amount for d in self.deals.values()]
        avg_deal_size = sum(deal_amounts) / len(deal_amounts) if deal_amounts else 0
        
        # Customer lifetime value prediction
        clv_prediction = avg_deal_size * 2.5  # Simplified CLV calculation
        
        # Churn risk analysis
        at_risk_customers = len([c for c in self.customers.values() 
                               if c.ai_insights.get('lead_score', 0) <= 30])
        churn_risk = (at_risk_customers / total_customers * 100) if total_customers > 0 else 0
        
        return {
            'total_customers': total_customers,
            'total_deals': total_deals,
            'total_activities': total_activities,
            'conversion_rate': round(conversion_rate, 2),
            'average_deal_size': round(avg_deal_size, 2),
            'predicted_clv': round(clv_prediction, 2),
            'churn_risk_percentage': round(churn_risk, 2),
            'ai_features_enabled': self.ai_features,
            'automation_workflows': len(self.automation_workflows),
            'reporting_analytics': self.reporting_analytics
        }

    def search_customers(self, query: str, filters: Dict[str, Any] = None) -> List[Customer]:
        """Search customers with AI-powered relevance"""
        results = []
        
        for customer in self.customers.values():
            if (query.lower() in customer.name.lower() or 
                query.lower() in customer.email.lower() or
                query.lower() in customer.company.lower()):
                
                # Calculate relevance score
                relevance_score = 0
                if query.lower() in customer.name.lower():
                    relevance_score += 10
                if query.lower() in customer.email.lower():
                    relevance_score += 5
                if query.lower() in customer.company.lower():
                    relevance_score += 8
                
                customer.ai_insights['search_relevance'] = relevance_score
                results.append(customer)
        
        # Sort by relevance score
        results.sort(key=lambda x: x.ai_insights.get('search_relevance', 0), reverse=True)
        return results

    def get_statistics(self) -> Dict[str, Any]:
        """Get CRM system statistics"""
        return {
            'customers': len(self.customers),
            'deals': len(self.deals),
            'activities': len(self.activities),
            'ai_features': self.ai_features,
            'automation_workflows': len(self.automation_workflows),
            'reporting_analytics': self.reporting_analytics
        }

def main():
    """Main function for testing"""
    crm = MaijdCRMPro()
    
    # Create test customers
    customer1 = crm.create_customer("Acme Corp", "contact@acme.com", "+1-555-0101", 
                                   "Acme Corporation", "technology", "website", "sales1@company.com")
    customer2 = crm.create_customer("TechStart Inc", "hello@techstart.com", "+1-555-0102",
                                   "TechStart Inc", "technology", "referral", "sales2@company.com")
    
    # Create test deals
    deal1 = crm.create_deal(customer1.id, "Enterprise Software License", 50000, "negotiation", "sales1@company.com")
    deal2 = crm.create_deal(customer2.id, "Consulting Services", 25000, "proposal", "sales2@company.com")
    
    # Create test activities
    activity1 = crm.create_activity(customer1.id, "call", "Follow-up Call", 
                                   "Called to discuss proposal feedback", "sales1@company.com")
    activity2 = crm.create_activity(customer2.id, "email", "Proposal Sent", 
                                   "Sent detailed proposal for consulting services", "sales2@company.com")
    
    # Update deal stage
    crm.update_deal_stage(deal1.id, "closed_won")
    
    # Complete activity
    crm.complete_activity(activity1.id)
    
    # Get insights
    insights = crm.get_ai_insights()
    segments = crm.get_customer_segments()
    pipeline = crm.get_sales_pipeline()
    
    print("CRM Pro Test Results:")
    print(f"Total customers: {insights['total_customers']}")
    print(f"Total deals: {insights['total_deals']}")
    print(f"Conversion rate: {insights['conversion_rate']}%")
    print(f"Average deal size: ${insights['average_deal_size']:,.2f}")
    print(f"Churn risk: {insights['churn_risk_percentage']}%")
    print(f"High-value customers: {len(segments['high_value'])}")
    print(f"Deals in negotiation: {len(pipeline['negotiation'])}")

if __name__ == "__main__":
    main()
