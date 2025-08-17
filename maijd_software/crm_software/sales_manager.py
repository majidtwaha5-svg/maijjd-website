#!/usr/bin/env python3
"""
Maijd Sales Manager - Sales Pipeline Management Software
Advanced sales management with AI-powered insights and automation
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
class Lead:
    """Lead data structure"""
    id: str
    first_name: str
    last_name: str
    company: str
    email: str
    phone: str
    source: str  # website, referral, cold_call, social_media
    status: str  # new, contacted, qualified, proposal, closed_won, closed_lost
    value: float
    assigned_to: str
    created_at: datetime
    updated_at: datetime
    notes: List[Dict[str, Any]]
    activities: List[Dict[str, Any]]

@dataclass
class Opportunity:
    """Sales opportunity data structure"""
    id: str
    lead_id: str
    name: str
    description: str
    value: float
    stage: str  # discovery, proposal, negotiation, closed_won, closed_lost
    probability: float  # 0-100
    expected_close_date: datetime
    assigned_to: str
    created_at: datetime
    updated_at: datetime
    activities: List[Dict[str, Any]]
    products: List[Dict[str, Any]]

@dataclass
class SalesActivity:
    """Sales activity data structure"""
    id: str
    type: str  # call, email, meeting, demo, proposal
    subject: str
    description: str
    lead_id: Optional[str]
    opportunity_id: Optional[str]
    assigned_to: str
    scheduled_date: Optional[datetime]
    completed_date: Optional[datetime]
    status: str  # scheduled, completed, cancelled
    outcome: str
    notes: str
    created_at: datetime
    updated_at: datetime

@dataclass
class SalesPipeline:
    """Sales pipeline configuration"""
    id: str
    name: str
    stages: List[Dict[str, Any]]
    conversion_rates: Dict[str, float]
    average_deal_size: float
    sales_cycle_length: int  # in days
    created_at: datetime
    updated_at: datetime

class MaijdSalesManager:
    """
    Advanced sales management system with AI capabilities
    """
    
    def __init__(self):
        self.leads: Dict[str, Lead] = {}
        self.opportunities: Dict[str, Opportunity] = {}
        self.activities: Dict[str, SalesActivity] = {}
        self.pipelines: Dict[str, SalesPipeline] = {}
        self.users: Dict[str, Dict[str, Any]] = {}
        self.ai_features = {
            'lead_scoring': True,
            'opportunity_prediction': True,
            'sales_forecasting': True,
            'activity_recommendations': True,
            'pipeline_optimization': True,
            'churn_prediction': True
        }
        self.automation_features = {
            'lead_assignment': True,
            'follow_up_reminders': True,
            'email_campaigns': True,
            'task_creation': True,
            'reporting': True
        }
        self.integrations = ['email', 'calendar', 'crm', 'accounting', 'marketing']
        
    def create_lead(self, first_name: str, last_name: str, company: str, 
                    email: str, phone: str, source: str, value: float = 0.0) -> Lead:
        """Create a new sales lead"""
        lead_id = hashlib.md5(f"{email}{time.time()}".encode()).hexdigest()
        
        lead = Lead(
            id=lead_id,
            first_name=first_name,
            last_name=last_name,
            company=company,
            email=email,
            phone=phone,
            source=source,
            status='new',
            value=value,
            assigned_to='',
            created_at=datetime.now(),
            updated_at=datetime.now(),
            notes=[],
            activities=[]
        )
        
        self.leads[lead_id] = lead
        logger.info(f"Created lead: {first_name} {last_name} from {company}")
        return lead
    
    def update_lead_status(self, lead_id: str, new_status: str, user: str) -> bool:
        """Update lead status"""
        if lead_id not in self.leads:
            return False
            
        lead = self.leads[lead_id]
        old_status = lead.status
        lead.status = new_status
        lead.updated_at = datetime.now()
        
        # Add status change note
        note = {
            'id': hashlib.md5(f"note{time.time()}".encode()).hexdigest(),
            'author': user,
            'content': f'Status changed from {old_status} to {new_status}',
            'timestamp': datetime.now().isoformat(),
            'type': 'status_change'
        }
        lead.notes.append(note)
        
        logger.info(f"Lead {lead_id} status updated from {old_status} to {new_status}")
        return True
    
    def assign_lead(self, lead_id: str, user_id: str) -> bool:
        """Assign lead to a sales representative"""
        if lead_id not in self.leads:
            return False
            
        lead = self.leads[lead_id]
        lead.assigned_to = user_id
        lead.updated_at = datetime.now()
        
        # Add assignment note
        note = {
            'id': hashlib.md5(f"note{time.time()}".encode()).hexdigest(),
            'author': 'system',
            'content': f'Lead assigned to {user_id}',
            'timestamp': datetime.now().isoformat(),
            'type': 'assignment'
        }
        lead.notes.append(note)
        
        logger.info(f"Lead {lead_id} assigned to {user_id}")
        return True
    
    def add_lead_note(self, lead_id: str, author: str, content: str) -> bool:
        """Add a note to a lead"""
        if lead_id not in self.leads:
            return False
            
        lead = self.leads[lead_id]
        note = {
            'id': hashlib.md5(f"note{time.time()}".encode()).hexdigest(),
            'author': author,
            'content': content,
            'timestamp': datetime.now().isoformat(),
            'type': 'note'
        }
        lead.notes.append(note)
        lead.updated_at = datetime.now()
        
        logger.info(f"Added note to lead {lead_id} by {author}")
        return True
    
    def create_opportunity(self, lead_id: str, name: str, description: str, 
                          value: float, assigned_to: str) -> Opportunity:
        """Create a new sales opportunity"""
        opportunity_id = hashlib.md5(f"{name}{time.time()}".encode()).hexdigest()
        
        opportunity = Opportunity(
            id=opportunity_id,
            lead_id=lead_id,
            name=name,
            description=description,
            value=value,
            stage='discovery',
            probability=25.0,
            expected_close_date=datetime.now() + timedelta(days=30),
            assigned_to=assigned_to,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            activities=[],
            products=[]
        )
        
        self.opportunities[opportunity_id] = opportunity
        
        # Update lead status
        if lead_id in self.leads:
            self.update_lead_status(lead_id, 'qualified', assigned_to)
        
        logger.info(f"Created opportunity: {name} with value ${value:,.2f}")
        return opportunity
    
    def update_opportunity_stage(self, opportunity_id: str, new_stage: str, 
                                user: str, probability: float = None) -> bool:
        """Update opportunity stage and probability"""
        if opportunity_id not in self.opportunities:
            return False
            
        opportunity = self.opportunities[opportunity_id]
        old_stage = opportunity.stage
        opportunity.stage = new_stage
        
        if probability is not None:
            opportunity.probability = probability
            
        opportunity.updated_at = datetime.now()
        
        # Add stage change activity
        activity = {
            'id': hashlib.md5(f"activity{time.time()}".encode()).hexdigest(),
            'type': 'stage_change',
            'description': f'Stage changed from {old_stage} to {new_stage}',
            'user': user,
            'timestamp': datetime.now().isoformat()
        }
        opportunity.activities.append(activity)
        
        logger.info(f"Opportunity {opportunity_id} stage updated from {old_stage} to {new_stage}")
        return True
    
    def create_sales_activity(self, type: str, subject: str, description: str,
                             lead_id: str = None, opportunity_id: str = None,
                             assigned_to: str = None, scheduled_date: datetime = None) -> SalesActivity:
        """Create a new sales activity"""
        activity_id = hashlib.md5(f"{subject}{time.time()}".encode()).hexdigest()
        
        activity = SalesActivity(
            id=activity_id,
            type=type,
            subject=subject,
            description=description,
            lead_id=lead_id,
            opportunity_id=opportunity_id,
            assigned_to=assigned_to or 'unassigned',
            scheduled_date=scheduled_date,
            completed_date=None,
            status='scheduled' if scheduled_date else 'pending',
            outcome='',
            notes='',
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        self.activities[activity_id] = activity
        
        # Add activity to lead or opportunity
        if lead_id and lead_id in self.leads:
            self.leads[lead_id].activities.append(activity_id)
            self.leads[lead_id].updated_at = datetime.now()
        
        if opportunity_id and opportunity_id in self.opportunities:
            self.opportunities[opportunity_id].activities.append(activity_id)
            self.opportunities[opportunity_id].updated_at = datetime.now()
        
        logger.info(f"Created sales activity: {type} - {subject}")
        return activity
    
    def complete_activity(self, activity_id: str, outcome: str, notes: str = '') -> bool:
        """Mark activity as completed"""
        if activity_id not in self.activities:
            return False
            
        activity = self.activities[activity_id]
        activity.status = 'completed'
        activity.completed_date = datetime.now()
        activity.outcome = outcome
        activity.notes = notes
        activity.updated_at = datetime.now()
        
        logger.info(f"Completed activity {activity_id} with outcome: {outcome}")
        return True
    
    def ai_lead_scoring(self, lead_id: str) -> Dict[str, Any]:
        """AI-powered lead scoring"""
        if lead_id not in self.leads:
            return {}
            
        lead = self.leads[lead_id]
        
        # Simulate AI lead scoring algorithm
        score = 0
        factors = {}
        
        # Company size factor
        if lead.company:
            company_size = len(lead.company)
            if company_size > 20:
                score += 30
                factors['company_size'] = 'Large company (+30)'
            elif company_size > 10:
                score += 20
                factors['company_size'] = 'Medium company (+20)'
            else:
                score += 10
                factors['company_size'] = 'Small company (+10)'
        
        # Lead value factor
        if lead.value > 10000:
            score += 25
            factors['value'] = 'High value (+25)'
        elif lead.value > 5000:
            score += 15
            factors['value'] = 'Medium value (+15)'
        else:
            score += 5
            factors['value'] = 'Low value (+5)'
        
        # Source quality factor
        source_scores = {
            'referral': 20,
            'website': 15,
            'social_media': 10,
            'cold_call': 5
        }
        score += source_scores.get(lead.source, 0)
        factors['source'] = f'{lead.source.title()} (+{source_scores.get(lead.source, 0)})'
        
        # Engagement factor
        engagement_score = min(len(lead.notes) * 5, 20)
        score += engagement_score
        factors['engagement'] = f'Engagement level (+{engagement_score})'
        
        # Determine lead quality
        if score >= 80:
            quality = 'Hot'
            recommendation = 'Prioritize immediately'
        elif score >= 60:
            quality = 'Warm'
            recommendation = 'Follow up within 24 hours'
        elif score >= 40:
            quality = 'Lukewarm'
            recommendation = 'Follow up within 48 hours'
        else:
            quality = 'Cold'
            recommendation = 'Add to nurture campaign'
        
        return {
            'lead_id': lead_id,
            'total_score': score,
            'quality': quality,
            'recommendation': recommendation,
            'scoring_factors': factors,
            'scored_at': datetime.now().isoformat()
        }
    
    def ai_sales_forecasting(self, timeframe_days: int = 30) -> Dict[str, Any]:
        """AI-powered sales forecasting"""
        current_date = datetime.now()
        end_date = current_date + timedelta(days=timeframe_days)
        
        # Filter opportunities within timeframe
        relevant_opportunities = [
            opp for opp in self.opportunities.values()
            if opp.expected_close_date <= end_date and opp.stage not in ['closed_won', 'closed_lost']
        ]
        
        # Calculate weighted forecast
        total_forecast = 0
        high_probability = 0
        medium_probability = 0
        low_probability = 0
        
        for opp in relevant_opportunities:
            weighted_value = opp.value * (opp.probability / 100)
            total_forecast += weighted_value
            
            if opp.probability >= 70:
                high_probability += weighted_value
            elif opp.probability >= 40:
                medium_probability += weighted_value
            else:
                low_probability += weighted_value
        
        # Calculate conversion rates
        total_opportunities = len(relevant_opportunities)
        if total_opportunities > 0:
            avg_probability = sum(opp.probability for opp in relevant_opportunities) / total_opportunities
        else:
            avg_probability = 0
        
        forecast = {
            'timeframe_days': timeframe_days,
            'total_forecast': round(total_forecast, 2),
            'opportunity_count': total_opportunities,
            'average_probability': round(avg_probability, 1),
            'high_probability_forecast': round(high_probability, 2),
            'medium_probability_forecast': round(medium_probability, 2),
            'low_probability_forecast': round(low_probability, 2),
            'forecast_date': current_date.isoformat(),
            'end_date': end_date.isoformat()
        }
        
        return forecast
    
    def get_sales_dashboard(self) -> Dict[str, Any]:
        """Get comprehensive sales dashboard data"""
        current_date = datetime.now()
        
        # Lead statistics
        total_leads = len(self.leads)
        new_leads = len([l for l in self.leads.values() if l.status == 'new'])
        qualified_leads = len([l for l in self.leads.values() if l.status == 'qualified'])
        
        # Opportunity statistics
        total_opportunities = len(self.opportunities)
        active_opportunities = len([o for o in self.opportunities.values() if o.stage not in ['closed_won', 'closed_lost']])
        won_opportunities = len([o for o in self.opportunities.values() if o.stage == 'closed_won'])
        lost_opportunities = len([o for o in self.opportunities.values() if o.stage == 'closed_lost'])
        
        # Pipeline value
        pipeline_value = sum(o.value for o in self.opportunities.values() if o.stage not in ['closed_won', 'closed_lost'])
        won_value = sum(o.value for o in self.opportunities.values() if o.stage == 'closed_won')
        
        # Activity statistics
        total_activities = len(self.activities)
        completed_activities = len([a for a in self.activities.values() if a.status == 'completed'])
        pending_activities = len([a for a in self.activities.values() if a.status in ['scheduled', 'pending']])
        
        dashboard = {
            'summary': {
                'total_leads': total_leads,
                'new_leads': new_leads,
                'qualified_leads': qualified_leads,
                'total_opportunities': total_opportunities,
                'active_opportunities': active_opportunities,
                'won_opportunities': won_opportunities,
                'lost_opportunities': lost_opportunities
            },
            'pipeline': {
                'pipeline_value': round(pipeline_value, 2),
                'won_value': round(won_value, 2),
                'conversion_rate': round((won_opportunities / total_opportunities * 100), 1) if total_opportunities > 0 else 0
            },
            'activities': {
                'total_activities': total_activities,
                'completed_activities': completed_activities,
                'pending_activities': pending_activities,
                'completion_rate': round((completed_activities / total_activities * 100), 1) if total_activities > 0 else 0
            },
            'last_updated': current_date.isoformat()
        }
        
        return dashboard
    
    def list_leads(self, status: str = None, assigned_to: str = None) -> List[Dict[str, Any]]:
        """List leads with optional filtering"""
        leads_list = []
        
        for lead in self.leads.values():
            if (status is None or lead.status == status) and \
               (assigned_to is None or lead.assigned_to == assigned_to):
                leads_list.append({
                    'id': lead.id,
                    'name': f"{lead.first_name} {lead.last_name}",
                    'company': lead.company,
                    'email': lead.email,
                    'phone': lead.phone,
                    'source': lead.source,
                    'status': lead.status,
                    'value': lead.value,
                    'assigned_to': lead.assigned_to,
                    'created_at': lead.created_at.isoformat(),
                    'note_count': len(lead.notes),
                    'activity_count': len(lead.activities)
                })
        
        return leads_list
    
    def list_opportunities(self, stage: str = None, assigned_to: str = None) -> List[Dict[str, Any]]:
        """List opportunities with optional filtering"""
        opportunities_list = []
        
        for opportunity in self.opportunities.values():
            if (stage is None or opportunity.stage == stage) and \
               (assigned_to is None or opportunity.assigned_to == assigned_to):
                opportunities_list.append({
                    'id': opportunity.id,
                    'name': opportunity.name,
                    'lead_id': opportunity.lead_id,
                    'value': opportunity.value,
                    'stage': opportunity.stage,
                    'probability': opportunity.probability,
                    'expected_close_date': opportunity.expected_close_date.isoformat(),
                    'assigned_to': opportunity.assigned_to,
                    'created_at': opportunity.created_at.isoformat(),
                    'activity_count': len(opportunity.activities)
                })
        
        return opportunities_list

def main():
    """Main function for testing"""
    sales_manager = MaijdSalesManager()
    
    # Create leads
    lead1 = sales_manager.create_lead(
        first_name="John",
        last_name="Smith",
        company="TechCorp Inc",
        email="john.smith@techcorp.com",
        phone="+1-555-0123",
        source="website",
        value=15000.0
    )
    
    lead2 = sales_manager.create_lead(
        first_name="Sarah",
        last_name="Johnson",
        company="Innovation Labs",
        email="sarah.j@innovationlabs.com",
        phone="+1-555-0456",
        source="referral",
        value=25000.0
    )
    
    # Assign leads
    sales_manager.assign_lead(lead1.id, "sales_rep_1")
    sales_manager.assign_lead(lead2.id, "sales_rep_2")
    
    # Update lead status
    sales_manager.update_lead_status(lead1.id, "contacted", "sales_rep_1")
    sales_manager.update_lead_status(lead2.id, "qualified", "sales_rep_2")
    
    # Add notes
    sales_manager.add_lead_note(lead1.id, "sales_rep_1", "Initial contact made, interested in demo")
    sales_manager.add_lead_note(lead2.id, "sales_rep_2", "Company has budget approved for Q2")
    
    # Create opportunities
    opportunity1 = sales_manager.create_opportunity(
        lead_id=lead1.id,
        name="TechCorp Software License",
        description="Enterprise software license for 100 users",
        value=15000.0,
        assigned_to="sales_rep_1"
    )
    
    opportunity2 = sales_manager.create_opportunity(
        lead_id=lead2.id,
        name="Innovation Labs Custom Solution",
        description="Custom software development project",
        value=25000.0,
        assigned_to="sales_rep_2"
    )
    
    # Update opportunity stages
    sales_manager.update_opportunity_stage(opportunity1.id, "proposal", "sales_rep_1", 60.0)
    sales_manager.update_opportunity_stage(opportunity2.id, "negotiation", "sales_rep_2", 80.0)
    
    # Create activities
    activity1 = sales_manager.create_sales_activity(
        type="demo",
        subject="Product Demo for TechCorp",
        description="Showcase software features to TechCorp team",
        lead_id=lead1.id,
        opportunity_id=opportunity1.id,
        assigned_to="sales_rep_1",
        scheduled_date=datetime.now() + timedelta(days=2)
    )
    
    activity2 = sales_manager.create_sales_activity(
        type="proposal",
        subject="Send Proposal to Innovation Labs",
        description="Email detailed proposal and pricing",
        lead_id=lead2.id,
        opportunity_id=opportunity2.id,
        assigned_to="sales_rep_2"
    )
    
    # Complete activity
    sales_manager.complete_activity(activity2.id, "completed", "Proposal sent successfully")
    
    # AI features
    lead_score = sales_manager.ai_lead_scoring(lead1.id)
    print(f"AI Lead Scoring: {json.dumps(lead_score, indent=2)}")
    
    sales_forecast = sales_manager.ai_sales_forecasting(60)
    print(f"AI Sales Forecast: {json.dumps(sales_forecast, indent=2)}")
    
    # Get dashboard
    dashboard = sales_manager.get_sales_dashboard()
    print(f"Sales Dashboard: {json.dumps(dashboard, indent=2)}")
    
    # List leads and opportunities
    leads = sales_manager.list_leads()
    print(f"Leads: {json.dumps(leads, indent=2)}")
    
    opportunities = sales_manager.list_opportunities()
    print(f"Opportunities: {json.dumps(opportunities, indent=2)}")

if __name__ == "__main__":
    main()
