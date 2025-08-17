#!/usr/bin/env python3
"""
Maijd Marketing Hub - Marketing Automation Platform
Advanced marketing automation with AI-powered campaigns and analytics
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
class MarketingCampaign:
    """Marketing campaign data structure"""
    id: str
    name: str
    description: str
    type: str  # email, social_media, content_marketing, paid_advertising
    status: str  # draft, active, paused, completed, cancelled
    target_audience: List[str]
    budget: float
    start_date: datetime
    end_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    metrics: Dict[str, Any]
    content: List[Dict[str, Any]]

@dataclass
class EmailCampaign:
    """Email campaign specific data"""
    id: str
    campaign_id: str
    subject_line: str
    sender_name: str
    sender_email: str
    html_content: str
    text_content: str
    template_id: str
    scheduled_date: Optional[datetime]
    sent_date: Optional[datetime]
    recipient_count: int
    open_rate: float
    click_rate: float
    bounce_rate: float
    unsubscribe_rate: float

@dataclass
class SocialMediaCampaign:
    """Social media campaign specific data"""
    id: str
    campaign_id: str
    platform: str  # facebook, twitter, instagram, linkedin
    content: str
    media_files: List[str]
    scheduled_date: Optional[datetime]
    posted_date: Optional[datetime]
    reach: int
    impressions: int
    engagement_rate: float
    clicks: int
    shares: int
    comments: int

@dataclass
class Lead:
    """Marketing lead data structure"""
    id: str
    email: str
    first_name: str
    last_name: str
    company: str
    phone: str
    source: str  # website, social_media, email, referral, paid_advertising
    status: str  # new, qualified, nurtured, converted, unsubscribed
    tags: List[str]
    interests: List[str]
    created_at: datetime
    updated_at: datetime
    last_activity: Optional[datetime]
    engagement_score: float
    campaign_history: List[str]

@dataclass
class MarketingAutomation:
    """Marketing automation workflow"""
    id: str
    name: str
    description: str
    trigger_type: str  # email_open, email_click, website_visit, form_submit
    trigger_conditions: Dict[str, Any]
    actions: List[Dict[str, Any]]
    status: str  # active, inactive, draft
    created_at: datetime
    updated_at: datetime
    execution_count: int
    success_rate: float

@dataclass
class MarketingTemplate:
    """Marketing template data structure"""
    id: str
    name: str
    type: str  # email, social_media, landing_page
    content: str
    variables: List[str]
    category: str
    author: str
    status: str  # draft, active, archived
    created_at: datetime
    updated_at: datetime
    usage_count: int

class MaijdMarketingHub:
    """
    Advanced marketing automation system with AI capabilities
    """
    
    def __init__(self):
        self.campaigns: Dict[str, MarketingCampaign] = {}
        self.email_campaigns: Dict[str, EmailCampaign] = {}
        self.social_campaigns: Dict[str, SocialMediaCampaign] = {}
        self.leads: Dict[str, Lead] = {}
        self.automations: Dict[str, MarketingAutomation] = {}
        self.templates: Dict[str, MarketingTemplate] = {}
        self.ai_features = {
            'audience_segmentation': True,
            'content_optimization': True,
            'send_time_optimization': True,
            'lead_scoring': True,
            'campaign_performance_prediction': True,
            'personalization': True
        }
        self.automation_features = {
            'email_automation': True,
            'lead_nurturing': True,
            'behavioral_triggers': True,
            'a_b_testing': True,
            'multi_channel_campaigns': True
        }
        self.integrations = ['email_provider', 'social_media', 'crm', 'analytics', 'cms']
        
    def create_marketing_campaign(self, name: str, description: str, campaign_type: str,
                                target_audience: List[str], budget: float,
                                start_date: datetime, end_date: Optional[datetime] = None) -> MarketingCampaign:
        """Create a new marketing campaign"""
        campaign_id = hashlib.md5(f"{name}{time.time()}".encode()).hexdigest()
        
        campaign = MarketingCampaign(
            id=campaign_id,
            name=name,
            description=description,
            type=campaign_type,
            status='draft',
            target_audience=target_audience,
            budget=budget,
            start_date=start_date,
            end_date=end_date,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            metrics={
                'reach': 0,
                'impressions': 0,
                'clicks': 0,
                'conversions': 0,
                'roi': 0.0,
                'cost_per_click': 0.0,
                'cost_per_conversion': 0.0
            },
            content=[]
        )
        
        self.campaigns[campaign_id] = campaign
        logger.info(f"Created marketing campaign: {name} of type {campaign_type}")
        return campaign
    
    def create_email_campaign(self, campaign_id: str, subject_line: str, sender_name: str,
                            sender_email: str, html_content: str, text_content: str,
                            template_id: str = "", scheduled_date: Optional[datetime] = None) -> EmailCampaign:
        """Create a new email campaign"""
        email_campaign_id = hashlib.md5(f"{subject_line}{time.time()}".encode()).hexdigest()
        
        email_campaign = EmailCampaign(
            id=email_campaign_id,
            campaign_id=campaign_id,
            subject_line=subject_line,
            sender_name=sender_name,
            sender_email=sender_email,
            html_content=html_content,
            text_content=text_content,
            template_id=template_id,
            scheduled_date=scheduled_date,
            sent_date=None,
            recipient_count=0,
            open_rate=0.0,
            click_rate=0.0,
            bounce_rate=0.0,
            unsubscribe_rate=0.0
        )
        
        self.email_campaigns[email_campaign_id] = email_campaign
        
        # Add to campaign content
        if campaign_id in self.campaigns:
            self.campaigns[campaign_id].content.append({
                'type': 'email',
                'id': email_campaign_id,
                'name': subject_line
            })
            self.campaigns[campaign_id].updated_at = datetime.now()
        
        logger.info(f"Created email campaign: {subject_line}")
        return email_campaign
    
    def create_social_media_campaign(self, campaign_id: str, platform: str, content: str,
                                   media_files: List[str] = None, 
                                   scheduled_date: Optional[datetime] = None) -> SocialMediaCampaign:
        """Create a new social media campaign"""
        social_campaign_id = hashlib.md5(f"{content}{time.time()}".encode()).hexdigest()
        
        social_campaign = SocialMediaCampaign(
            id=social_campaign_id,
            campaign_id=campaign_id,
            platform=platform,
            content=content,
            media_files=media_files or [],
            scheduled_date=scheduled_date,
            posted_date=None,
            reach=0,
            impressions=0,
            engagement_rate=0.0,
            clicks=0,
            shares=0,
            comments=0
        )
        
        self.social_campaigns[social_campaign_id] = social_campaign
        
        # Add to campaign content
        if campaign_id in self.campaigns:
            self.campaigns[campaign_id].content.append({
                'type': 'social_media',
                'id': social_campaign_id,
                'platform': platform,
                'name': content[:50] + "..." if len(content) > 50 else content
            })
            self.campaigns[campaign_id].updated_at = datetime.now()
        
        logger.info(f"Created social media campaign for {platform}: {content[:50]}...")
        return social_campaign
    
    def create_lead(self, email: str, first_name: str, last_name: str, 
                   company: str = "", phone: str = "", source: str = "website") -> Lead:
        """Create a new marketing lead"""
        lead_id = hashlib.md5(f"{email}{time.time()}".encode()).hexdigest()
        
        lead = Lead(
            id=lead_id,
            email=email,
            first_name=first_name,
            last_name=last_name,
            company=company,
            phone=phone,
            source=source,
            status='new',
            tags=[],
            interests=[],
            created_at=datetime.now(),
            updated_at=datetime.now(),
            last_activity=datetime.now(),
            engagement_score=0.0,
            campaign_history=[]
        )
        
        self.leads[lead_id] = lead
        logger.info(f"Created lead: {first_name} {last_name} ({email}) from {source}")
        return lead
    
    def update_lead_status(self, lead_id: str, new_status: str) -> bool:
        """Update lead status"""
        if lead_id not in self.leads:
            return False
            
        lead = self.leads[lead_id]
        lead.status = new_status
        lead.updated_at = datetime.now()
        
        logger.info(f"Lead {lead_id} status updated to {new_status}")
        return True
    
    def add_lead_tag(self, lead_id: str, tag: str) -> bool:
        """Add a tag to a lead"""
        if lead_id not in self.leads:
            return False
            
        lead = self.leads[lead_id]
        if tag not in lead.tags:
            lead.tags.append(tag)
            lead.updated_at = datetime.now()
        
        logger.info(f"Added tag '{tag}' to lead {lead_id}")
        return True
    
    def track_lead_activity(self, lead_id: str, activity_type: str, campaign_id: str = None) -> bool:
        """Track lead activity and update engagement score"""
        if lead_id not in self.leads:
            return False
            
        lead = self.leads[lead_id]
        lead.last_activity = datetime.now()
        lead.updated_at = datetime.now()
        
        # Update engagement score based on activity
        activity_scores = {
            'email_open': 1,
            'email_click': 3,
            'website_visit': 2,
            'form_submit': 5,
            'social_media_engagement': 2,
            'purchase': 10
        }
        
        score_increase = activity_scores.get(activity_type, 1)
        lead.engagement_score += score_increase
        
        # Add to campaign history if campaign specified
        if campaign_id and campaign_id not in lead.campaign_history:
            lead.campaign_history.append(campaign_id)
        
        logger.info(f"Tracked activity '{activity_type}' for lead {lead_id}, score: {lead.engagement_score}")
        return True
    
    def create_marketing_automation(self, name: str, description: str, trigger_type: str,
                                  trigger_conditions: Dict[str, Any], actions: List[Dict[str, Any]]) -> MarketingAutomation:
        """Create a new marketing automation workflow"""
        automation_id = hashlib.md5(f"{name}{time.time()}".encode()).hexdigest()
        
        automation = MarketingAutomation(
            id=automation_id,
            name=name,
            description=description,
            trigger_type=trigger_type,
            trigger_conditions=trigger_conditions,
            actions=actions,
            status='draft',
            created_at=datetime.now(),
            updated_at=datetime.now(),
            execution_count=0,
            success_rate=0.0
        )
        
        self.automations[automation_id] = automation
        logger.info(f"Created marketing automation: {name}")
        return automation
    
    def activate_automation(self, automation_id: str) -> bool:
        """Activate a marketing automation"""
        if automation_id not in self.automations:
            return False
            
        automation = self.automations[automation_id]
        automation.status = 'active'
        automation.updated_at = datetime.now()
        
        logger.info(f"Activated automation: {automation.name}")
        return True
    
    def create_marketing_template(self, name: str, template_type: str, content: str,
                                variables: List[str], category: str, author: str) -> MarketingTemplate:
        """Create a new marketing template"""
        template_id = hashlib.md5(f"{name}{time.time()}".encode()).hexdigest()
        
        template = MarketingTemplate(
            id=template_id,
            name=name,
            type=template_type,
            content=content,
            variables=variables,
            category=category,
            author=author,
            status='draft',
            created_at=datetime.now(),
            updated_at=datetime.now(),
            usage_count=0
        )
        
        self.templates[template_id] = template
        logger.info(f"Created marketing template: {name} of type {template_type}")
        return template
    
    def publish_template(self, template_id: str) -> bool:
        """Publish a marketing template"""
        if template_id not in self.templates:
            return False
            
        template = self.templates[template_id]
        template.status = 'active'
        template.updated_at = datetime.now()
        
        logger.info(f"Published template: {template.name}")
        return True
    
    def ai_audience_segmentation(self, campaign_id: str) -> Dict[str, Any]:
        """AI-powered audience segmentation"""
        if campaign_id not in self.campaigns:
            return {}
            
        campaign = self.campaigns[campaign_id]
        
        # Simulate AI audience analysis
        all_leads = list(self.leads.values())
        
        # Segment by engagement score
        high_engagement = [lead for lead in all_leads if lead.engagement_score >= 7]
        medium_engagement = [lead for lead in all_leads if 3 <= lead.engagement_score < 7]
        low_engagement = [lead for lead in all_leads if lead.engagement_score < 3]
        
        # Segment by source
        source_segments = {}
        for lead in all_leads:
            source = lead.source
            if source not in source_segments:
                source_segments[source] = []
            source_segments[source].append(lead.id)
        
        # Segment by company size (based on company name length as proxy)
        enterprise_leads = [lead for lead in all_leads if len(lead.company) > 20]
        business_leads = [lead for lead in all_leads if 10 <= len(lead.company) <= 20]
        individual_leads = [lead for lead in all_leads if len(lead.company) < 10]
        
        segmentation = {
            'campaign_id': campaign_id,
            'total_leads': len(all_leads),
            'engagement_segments': {
                'high_engagement': {
                    'count': len(high_engagement),
                    'percentage': round(len(high_engagement) / len(all_leads) * 100, 1) if all_leads else 0,
                    'recommendation': 'Target with premium content and offers'
                },
                'medium_engagement': {
                    'count': len(medium_engagement),
                    'percentage': round(len(medium_engagement) / len(all_leads) * 100, 1) if all_leads else 0,
                    'recommendation': 'Nurture with educational content'
                },
                'low_engagement': {
                    'count': len(low_engagement),
                    'percentage': round(len(low_engagement) / len(all_leads) * 100, 1) if all_leads else 0,
                    'recommendation': 'Re-engage with compelling offers'
                }
            },
            'source_segments': source_segments,
            'company_size_segments': {
                'enterprise': len(enterprise_leads),
                'business': len(business_leads),
                'individual': len(individual_leads)
            },
            'targeting_recommendations': [
                'Focus on high-engagement leads for conversion campaigns',
                'Use source-specific messaging for different lead sources',
                'Tailor content based on company size segments'
            ]
        }
        
        return segmentation
    
    def ai_content_optimization(self, content: str, content_type: str = "email") -> Dict[str, Any]:
        """AI-powered content optimization suggestions"""
        # Simulate AI content analysis
        word_count = len(content.split())
        sentence_count = len(content.split('.'))
        avg_sentence_length = word_count / sentence_count if sentence_count > 0 else 0
        
        # Subject line optimization (for emails)
        subject_optimization = {}
        if content_type == "email" and len(content) <= 100:  # Assume it's a subject line
            if len(content) > 50:
                subject_optimization['warning'] = 'Subject line is too long (recommended: 30-50 characters)'
            elif len(content) < 20:
                subject_optimization['warning'] = 'Subject line is too short (recommended: 20-50 characters)'
            else:
                subject_optimization['status'] = 'Optimal length'
            
            # Check for spam trigger words
            spam_words = ['free', 'urgent', 'act now', 'limited time', 'exclusive']
            found_spam_words = [word for word in spam_words if word.lower() in content.lower()]
            if found_spam_words:
                subject_optimization['spam_risk'] = f'Contains potential spam words: {", ".join(found_spam_words)}'
        
        # Content optimization
        content_optimization = {}
        if word_count < 50:
            content_optimization['warning'] = 'Content is very short, consider adding more detail'
        elif word_count > 500:
            content_optimization['warning'] = 'Content is very long, consider breaking into sections'
        else:
            content_optimization['status'] = 'Good content length'
        
        if avg_sentence_length > 25:
            content_optimization['sentence_length'] = 'Sentences are long, consider shorter sentences for better readability'
        
        # Engagement optimization
        engagement_keywords = ['you', 'your', 'benefit', 'solution', 'help', 'improve']
        keyword_count = sum(1 for keyword in engagement_keywords if keyword.lower() in content.lower())
        
        if keyword_count < 2:
            content_optimization['engagement'] = 'Consider adding more personal and benefit-focused language'
        else:
            content_optimization['engagement'] = 'Good use of engaging language'
        
        return {
            'content_type': content_type,
            'word_count': word_count,
            'sentence_count': sentence_count,
            'average_sentence_length': round(avg_sentence_length, 1),
            'subject_optimization': subject_optimization,
            'content_optimization': content_optimization,
            'engagement_keywords_found': keyword_count,
            'overall_score': min(100, max(0, 100 - (word_count - 200) // 10 + keyword_count * 10)),
            'recommendations': [
                'Use clear, concise language',
                'Include personal pronouns (you, your)',
                'Focus on benefits and solutions',
                'Keep sentences under 25 words for readability'
            ]
        }
    
    def ai_send_time_optimization(self, lead_id: str) -> Dict[str, Any]:
        """AI-powered send time optimization"""
        if lead_id not in self.leads:
            return {}
            
        lead = self.leads[lead_id]
        
        # Simulate AI send time analysis based on lead behavior
        # In a real system, this would analyze historical open/click rates by time
        
        # Generate optimal send times based on lead characteristics
        if lead.company:  # Business lead
            optimal_times = {
                'monday': ['9:00 AM', '2:00 PM'],
                'tuesday': ['9:00 AM', '2:00 PM'],
                'wednesday': ['9:00 AM', '2:00 PM'],
                'thursday': ['9:00 AM', '2:00 PM'],
                'friday': ['9:00 AM', '1:00 PM'],
                'weekend': ['10:00 AM']
            }
            reasoning = 'Business leads typically engage during business hours'
        else:  # Individual lead
            optimal_times = {
                'monday': ['7:00 AM', '6:00 PM'],
                'tuesday': ['7:00 AM', '6:00 PM'],
                'wednesday': ['7:00 AM', '6:00 PM'],
                'thursday': ['7:00 AM', '6:00 PM'],
                'friday': ['7:00 AM', '5:00 PM'],
                'weekend': ['10:00 AM', '2:00 PM']
            }
            reasoning = 'Individual leads engage more during early morning and evening hours'
        
        # Adjust based on engagement score
        if lead.engagement_score > 7:
            frequency = 'High engagement - send 2-3 times per week'
        elif lead.engagement_score > 3:
            frequency = 'Medium engagement - send 1-2 times per week'
        else:
            frequency = 'Low engagement - send 1 time per week'
        
        return {
            'lead_id': lead_id,
            'lead_type': 'Business' if lead.company else 'Individual',
            'engagement_level': lead.engagement_score,
            'optimal_send_times': optimal_times,
            'send_frequency': frequency,
            'reasoning': reasoning,
            'timezone_consideration': 'Adjust for lead\'s local timezone',
            'recommendations': [
                'Test different send times to optimize for this specific lead',
                'Monitor open rates by time of day',
                'Consider lead\'s timezone when scheduling'
            ]
        }
    
    def ai_lead_scoring(self, lead_id: str) -> Dict[str, Any]:
        """AI-powered lead scoring for marketing"""
        if lead_id not in self.leads:
            return {}
            
        lead = self.leads[lead_id]
        
        # Simulate AI lead scoring
        score = 0
        factors = {}
        
        # Engagement score factor
        engagement_score = min(lead.engagement_score * 10, 40)
        score += engagement_score
        factors['engagement'] = f'Engagement score: {lead.engagement_score} (+{engagement_score})'
        
        # Source quality factor
        source_scores = {
            'referral': 25,
            'website': 20,
            'social_media': 15,
            'email': 10,
            'paid_advertising': 5
        }
        source_score = source_scores.get(lead.source, 5)
        score += source_score
        factors['source'] = f'{lead.source.title()} (+{source_score})'
        
        # Company size factor
        if lead.company:
            company_size = len(lead.company)
            if company_size > 20:
                score += 20
                factors['company_size'] = 'Large company (+20)'
            elif company_size > 10:
                score += 15
                factors['company_size'] = 'Medium company (+15)'
            else:
                score += 10
                factors['company_size'] = 'Small company (+10)'
        
        # Activity recency factor
        if lead.last_activity:
            hours_since_activity = (datetime.now() - lead.last_activity).total_seconds() / 3600
            if hours_since_activity < 24:
                score += 15
                factors['recency'] = 'Very recent activity (+15)'
            elif hours_since_activity < 72:
                score += 10
                factors['recency'] = 'Recent activity (+10)'
            elif hours_since_activity < 168:  # 1 week
                score += 5
                factors['recency'] = 'Somewhat recent activity (+5)'
        
        # Campaign history factor
        campaign_factor = min(len(lead.campaign_history) * 3, 15)
        score += campaign_factor
        factors['campaign_history'] = f'Campaign interactions: {len(lead.campaign_history)} (+{campaign_factor})'
        
        # Determine lead quality
        if score >= 80:
            quality = 'Hot'
            recommendation = 'Ready for sales team handoff'
        elif score >= 60:
            quality = 'Warm'
            recommendation = 'Continue nurturing with targeted content'
        elif score >= 40:
            quality = 'Lukewarm'
            recommendation = 'Re-engage with compelling offers'
        else:
            quality = 'Cold'
            recommendation = 'Add to re-engagement campaign'
        
        return {
            'lead_id': lead_id,
            'total_score': score,
            'quality': quality,
            'recommendation': recommendation,
            'scoring_factors': factors,
            'scored_at': datetime.now().isoformat()
        }
    
    def get_marketing_dashboard(self) -> Dict[str, Any]:
        """Get comprehensive marketing dashboard data"""
        current_date = datetime.now()
        
        # Campaign statistics
        total_campaigns = len(self.campaigns)
        active_campaigns = len([c for c in self.campaigns.values() if c.status == 'active'])
        draft_campaigns = len([c for c in self.campaigns.values() if c.status == 'draft'])
        completed_campaigns = len([c for c in self.campaigns.values() if c.status == 'completed'])
        
        # Lead statistics
        total_leads = len(self.leads)
        new_leads = len([l for l in self.leads.values() if l.status == 'new'])
        qualified_leads = len([l for l in self.leads.values() if l.status == 'qualified'])
        converted_leads = len([l for l in self.leads.values() if l.status == 'converted'])
        
        # Email campaign statistics
        total_email_campaigns = len(self.email_campaigns)
        sent_email_campaigns = len([e for e in self.email_campaigns.values() if e.sent_date])
        
        # Social media campaign statistics
        total_social_campaigns = len(self.social_campaigns)
        posted_social_campaigns = len([s for s in self.social_campaigns.values() if s.posted_date])
        
        # Automation statistics
        total_automations = len(self.automations)
        active_automations = len([a for a in self.automations.values() if a.status == 'active'])
        
        # Template statistics
        total_templates = len(self.templates)
        active_templates = len([t for t in self.templates.values() if t.status == 'active'])
        
        dashboard = {
            'summary': {
                'total_campaigns': total_campaigns,
                'active_campaigns': active_campaigns,
                'draft_campaigns': draft_campaigns,
                'completed_campaigns': completed_campaigns,
                'total_leads': total_leads,
                'new_leads': new_leads,
                'qualified_leads': qualified_leads,
                'converted_leads': converted_leads
            },
            'campaigns': {
                'email_campaigns': {
                    'total': total_email_campaigns,
                    'sent': sent_email_campaigns,
                    'scheduled': total_email_campaigns - sent_email_campaigns
                },
                'social_campaigns': {
                    'total': total_social_campaigns,
                    'posted': posted_social_campaigns,
                    'scheduled': total_social_campaigns - posted_social_campaigns
                }
            },
            'automation': {
                'total_automations': total_automations,
                'active_automations': active_automations,
                'automation_rate': round(active_automations / total_automations * 100, 1) if total_automations > 0 else 0
            },
            'templates': {
                'total_templates': total_templates,
                'active_templates': active_templates,
                'template_utilization': round(active_templates / total_templates * 100, 1) if total_templates > 0 else 0
            },
            'last_updated': current_date.isoformat()
        }
        
        return dashboard
    
    def list_campaigns(self, status: str = None, campaign_type: str = None) -> List[Dict[str, Any]]:
        """List campaigns with optional filtering"""
        campaigns_list = []
        
        for campaign in self.campaigns.values():
            if (status is None or campaign.status == status) and \
               (campaign_type is None or campaign.type == campaign_type):
                
                # Get content summary
                content_summary = []
                for content_item in campaign.content:
                    if content_item['type'] == 'email':
                        content_summary.append(f"Email: {content_item['name']}")
                    elif content_item['type'] == 'social_media':
                        content_summary.append(f"Social: {content_item['name']}")
                
                campaigns_list.append({
                    'id': campaign.id,
                    'name': campaign.name,
                    'description': campaign.description,
                    'type': campaign.type,
                    'status': campaign.status,
                    'target_audience_size': len(campaign.target_audience),
                    'budget': campaign.budget,
                    'start_date': campaign.start_date.isoformat(),
                    'end_date': campaign.end_date.isoformat() if campaign.end_date else None,
                    'content_count': len(campaign.content),
                    'content_summary': content_summary,
                    'created_at': campaign.created_at.isoformat()
                })
        
        return campaigns_list
    
    def list_leads(self, status: str = None, source: str = None) -> List[Dict[str, Any]]:
        """List leads with optional filtering"""
        leads_list = []
        
        for lead in self.leads.values():
            if (status is None or lead.status == status) and \
               (source is None or lead.source == source):
                
                leads_list.append({
                    'id': lead.id,
                    'name': f"{lead.first_name} {lead.last_name}",
                    'email': lead.email,
                    'company': lead.company,
                    'phone': lead.phone,
                    'source': lead.source,
                    'status': lead.status,
                    'tags': lead.tags,
                    'engagement_score': lead.engagement_score,
                    'campaign_count': len(lead.campaign_history),
                    'created_at': lead.created_at.isoformat(),
                    'last_activity': lead.last_activity.isoformat() if lead.last_activity else None
                })
        
        return leads_list

def main():
    """Main function for testing"""
    marketing_hub = MaijdMarketingHub()
    
    # Create marketing campaign
    campaign = marketing_hub.create_marketing_campaign(
        name="Q4 Product Launch",
        description="Launch campaign for new product features",
        campaign_type="multi_channel",
        target_audience=["enterprise", "business"],
        budget=10000.0,
        start_date=datetime.now(),
        end_date=datetime.now() + timedelta(days=30)
    )
    
    # Create email campaign
    email_campaign = marketing_hub.create_email_campaign(
        campaign_id=campaign.id,
        subject_line="New Features Available - Boost Your Productivity",
        sender_name="Maijd Team",
        sender_email="team@maijd.com",
        html_content="<h1>New Features Available</h1><p>Discover how our new features can help...</p>",
        text_content="New Features Available\n\nDiscover how our new features can help...",
        template_id="product_launch_template"
    )
    
    # Create social media campaign
    social_campaign = marketing_hub.create_social_media_campaign(
        campaign_id=campaign.id,
        platform="linkedin",
        content="Excited to announce our latest product features! 🚀 #ProductLaunch #Innovation",
        media_files=["feature_announcement.png"]
    )
    
    # Create leads
    lead1 = marketing_hub.create_lead(
        email="john.doe@techcorp.com",
        first_name="John",
        last_name="Doe",
        company="TechCorp Inc",
        phone="+1-555-0123",
        source="website"
    )
    
    lead2 = marketing_hub.create_lead(
        email="sarah.smith@startup.com",
        first_name="Sarah",
        last_name="Smith",
        company="StartupXYZ",
        phone="+1-555-0456",
        source="social_media"
    )
    
    # Add tags and track activity
    marketing_hub.add_lead_tag(lead1.id, "enterprise")
    marketing_hub.add_lead_tag(lead1.id, "product_interest")
    marketing_hub.track_lead_activity(lead1.id, "email_open", campaign.id)
    marketing_hub.track_lead_activity(lead1.id, "website_visit", campaign.id)
    
    marketing_hub.add_lead_tag(lead2.id, "startup")
    marketing_hub.add_lead_tag(lead2.id, "early_adopter")
    marketing_hub.track_lead_activity(lead2.id, "social_media_engagement", campaign.id)
    
    # Update lead statuses
    marketing_hub.update_lead_status(lead1.id, "qualified")
    marketing_hub.update_lead_status(lead2.id, "nurtured")
    
    # Create marketing automation
    automation = marketing_hub.create_marketing_automation(
        name="Lead Nurturing Workflow",
        description="Automated lead nurturing based on engagement",
        trigger_type="email_open",
        trigger_conditions={"min_opens": 2, "timeframe_hours": 24},
        actions=[
            {"type": "send_email", "template": "nurture_sequence_1", "delay_minutes": 60},
            {"type": "add_tag", "tag": "nurtured", "delay_minutes": 0}
        ]
    )
    
    # Activate automation
    marketing_hub.activate_automation(automation.id)
    
    # Create marketing template
    template = marketing_hub.create_marketing_template(
        name="Product Launch Email",
        template_type="email",
        content="<h1>{{product_name}}</h1><p>Hi {{first_name}}, {{message}}</p>",
        variables=["product_name", "first_name", "message"],
        category="product",
        author="marketing_team"
    )
    
    # Publish template
    marketing_hub.publish_template(template.id)
    
    # AI features
    audience_segmentation = marketing_hub.ai_audience_segmentation(campaign.id)
    print(f"AI Audience Segmentation: {json.dumps(audience_segmentation, indent=2)}")
    
    content_optimization = marketing_hub.ai_content_optimization(
        "New Features Available - Boost Your Productivity", "email"
    )
    print(f"AI Content Optimization: {json.dumps(content_optimization, indent=2)}")
    
    send_time_optimization = marketing_hub.ai_send_time_optimization(lead1.id)
    print(f"AI Send Time Optimization: {json.dumps(send_time_optimization, indent=2)}")
    
    lead_scoring = marketing_hub.ai_lead_scoring(lead1.id)
    print(f"AI Lead Scoring: {json.dumps(lead_scoring, indent=2)}")
    
    # Get dashboard
    dashboard = marketing_hub.get_marketing_dashboard()
    print(f"Marketing Dashboard: {json.dumps(dashboard, indent=2)}")
    
    # List campaigns and leads
    campaigns = marketing_hub.list_campaigns()
    print(f"Campaigns: {json.dumps(campaigns, indent=2)}")
    
    leads = marketing_hub.list_leads()
    print(f"Leads: {json.dumps(leads, indent=2)}")

if __name__ == "__main__":
    main()
