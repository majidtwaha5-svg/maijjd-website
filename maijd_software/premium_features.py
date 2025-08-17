#!/usr/bin/env python3
"""
Maijd Software Suite - Premium Features System
Handles subscription management, payment processing, and usage limits
"""

import os
import json
import time
import hashlib
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import logging
from dataclasses import dataclass, asdict
import stripe
import paypalrestsdk

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class PricingTier:
    """Pricing tier configuration"""
    name: str
    price_monthly: float
    price_yearly: float
    word_limit: int
    api_requests_per_day: int
    features: List[str]
    max_users: int
    support_level: str
    refund_policy: str

@dataclass
class Subscription:
    """User subscription information"""
    user_id: str
    tier: str
    status: str  # active, cancelled, expired, trial
    start_date: str
    end_date: str
    billing_cycle: str  # monthly, yearly
    payment_method: str
    auto_renew: bool
    usage_stats: Dict[str, Any]

@dataclass
class UsageMetrics:
    """User usage tracking"""
    words_processed: int
    api_requests_today: int
    api_requests_total: int
    last_reset_date: str
    feature_usage: Dict[str, int]

class MaijdPremiumManager:
    """Manages premium features, subscriptions, and payments"""
    
    def __init__(self):
        self.config_file = "premium_config.json"
        self.db_path = "premium_users.db"
        self.stripe_secret_key = os.getenv("STRIPE_SECRET_KEY", "")
        self.paypal_client_id = os.getenv("PAYPAL_CLIENT_ID", "client_id_...")
        self.paypal_client_secret = os.getenv("PAYPAL_CLIENT_SECRET", "client_secret_...")
        
        # Initialize payment providers
        self.stripe.api_key = self.stripe_secret_key
        paypalrestsdk.configure({
            "mode": "sandbox",  # Change to "live" for production
            "client_id": self.paypal_client_id,
            "client_secret": self.paypal_client_secret
        })
        
        # Load configuration
        self.config = self._load_config()
        self.pricing_tiers = self._load_pricing_tiers()
        
        # Initialize database
        self._init_database()
    
    def _load_config(self) -> Dict[str, Any]:
        """Load premium configuration"""
        if os.path.exists(self.config_file):
            with open(self.config_file, 'r') as f:
                return json.load(f)
        else:
            # Default configuration
            config = {
                "trial_period_days": 14,
                "free_tier_word_limit": 4000,
                "free_tier_api_limit": 100,
                "auto_upgrade": True,
                "grace_period_days": 7,
                "webhook_endpoints": {
                    "stripe": "/webhooks/stripe",
                    "paypal": "/webhooks/paypal"
                }
            }
            self._save_config(config)
            return config
    
    def _save_config(self, config: Dict[str, Any]):
        """Save premium configuration"""
        with open(self.config_file, 'w') as f:
            json.dump(config, f, indent=2)
    
    def _load_pricing_tiers(self) -> Dict[str, PricingTier]:
        """Load pricing tiers configuration"""
        tiers = {
            "free": PricingTier(
                name="Free Tier",
                price_monthly=0.0,
                price_yearly=0.0,
                word_limit=4000,
                api_requests_per_day=100,
                features=["Basic Software Management", "Limited API Access", "Community Support"],
                max_users=1,
                support_level="Community",
                refund_policy="N/A - Free tier"
            ),
            "starter": PricingTier(
                name="Starter",
                price_monthly=29.99,
                price_yearly=299.99,
                word_limit=50000,
                api_requests_per_day=1000,
                features=["Advanced Software Management", "Full API Access", "Email Support", "Performance Analytics"],
                max_users=5,
                support_level="Email",
                refund_policy="30-day money-back guarantee"
            ),
            "professional": PricingTier(
                name="Professional",
                price_monthly=79.99,
                price_yearly=799.99,
                word_limit=200000,
                api_requests_per_day=5000,
                features=["Enterprise Features", "Priority Support", "Advanced Analytics", "Custom Integrations", "White-label Options"],
                max_users=25,
                support_level="Priority",
                refund_policy="30-day money-back guarantee"
            ),
            "enterprise": PricingTier(
                name="Enterprise",
                price_monthly=199.99,
                price_yearly=1999.99,
                word_limit=1000000,
                api_requests_per_day=25000,
                features=["Custom Solutions", "Dedicated Support", "SLA Guarantees", "On-premise Deployment", "Custom Branding"],
                max_users=100,
                support_level="Dedicated",
                refund_policy="Custom terms"
            )
        }
        return tiers
    
    def _init_database(self):
        """Initialize premium users database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS premium_users (
                user_id TEXT PRIMARY KEY,
                email TEXT UNIQUE,
                tier TEXT,
                status TEXT,
                start_date TEXT,
                end_date TEXT,
                billing_cycle TEXT,
                payment_method TEXT,
                auto_renew BOOLEAN,
                created_at TEXT,
                updated_at TEXT
            )
        ''')
        
        # Create usage table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS usage_metrics (
                user_id TEXT PRIMARY KEY,
                words_processed INTEGER DEFAULT 0,
                api_requests_today INTEGER DEFAULT 0,
                api_requests_total INTEGER DEFAULT 0,
                last_reset_date TEXT,
                feature_usage TEXT,
                created_at TEXT,
                updated_at TEXT
            )
        ''')
        
        # Create payments table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS payments (
                payment_id TEXT PRIMARY KEY,
                user_id TEXT,
                amount REAL,
                currency TEXT,
                payment_method TEXT,
                status TEXT,
                transaction_id TEXT,
                created_at TEXT
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def create_subscription(self, user_id: str, email: str, tier: str, 
                           billing_cycle: str, payment_method: str) -> Dict[str, Any]:
        """Create a new subscription"""
        try:
            if tier not in self.pricing_tiers:
                raise ValueError(f"Invalid tier: {tier}")
            
            tier_config = self.pricing_tiers[tier]
            start_date = datetime.now()
            
            if billing_cycle == "yearly":
                end_date = start_date + timedelta(days=365)
                price = tier_config.price_yearly
            else:
                end_date = start_date + timedelta(days=30)
                price = tier_config.price_monthly
            
            subscription = Subscription(
                user_id=user_id,
                tier=tier,
                status="active",
                start_date=start_date.isoformat(),
                end_date=end_date.isoformat(),
                billing_cycle=billing_cycle,
                payment_method=payment_method,
                auto_renew=True,
                usage_stats={}
            )
            
            # Save to database
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT OR REPLACE INTO premium_users 
                (user_id, email, tier, status, start_date, end_date, billing_cycle, 
                 payment_method, auto_renew, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                user_id, email, tier, subscription.status, subscription.start_date,
                subscription.end_date, subscription.billing_cycle, payment_method,
                subscription.auto_renew, start_date.isoformat(), start_date.isoformat()
            ))
            
            # Initialize usage metrics
            cursor.execute('''
                INSERT OR REPLACE INTO usage_metrics 
                (user_id, words_processed, api_requests_today, api_requests_total, 
                 last_reset_date, feature_usage, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                user_id, 0, 0, 0, start_date.isoformat(), 
                json.dumps({}), start_date.isoformat(), start_date.isoformat()
            ))
            
            conn.commit()
            conn.close()
            
            logger.info(f"Created subscription for user {user_id}: {tier} tier")
            return {"success": True, "subscription": asdict(subscription), "price": price}
            
        except Exception as e:
            logger.error(f"Error creating subscription: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def process_payment(self, user_id: str, amount: float, currency: str, 
                       payment_method: str, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process payment for subscription"""
        try:
            payment_id = hashlib.md5(f"{user_id}_{time.time()}".encode()).hexdigest()
            
            if payment_method == "stripe":
                # Process Stripe payment
                payment_intent = stripe.PaymentIntent.create(
                    amount=int(amount * 100),  # Convert to cents
                    currency=currency.lower(),
                    metadata={"user_id": user_id, "payment_id": payment_id}
                )
                
                if payment_intent.status == "succeeded":
                    transaction_id = payment_intent.id
                    status = "completed"
                else:
                    status = "failed"
                    transaction_id = None
                    
            elif payment_method == "paypal":
                # Process PayPal payment
                payment = paypalrestsdk.Payment({
                    "intent": "sale",
                    "payer": {"payment_method": "paypal"},
                    "transactions": [{
                        "amount": {
                            "total": str(amount),
                            "currency": currency.upper()
                        },
                        "description": f"Maijd Software Suite - {user_id}"
                    }]
                })
                
                if payment.create():
                    transaction_id = payment.id
                    status = "completed"
                else:
                    status = "failed"
                    transaction_id = None
            else:
                raise ValueError(f"Unsupported payment method: {payment_method}")
            
            # Save payment record
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO payments 
                (payment_id, user_id, amount, currency, payment_method, status, 
                 transaction_id, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                payment_id, user_id, amount, currency, payment_method, status,
                transaction_id, datetime.now().isoformat()
            ))
            
            conn.commit()
            conn.close()
            
            return {
                "success": status == "completed",
                "payment_id": payment_id,
                "transaction_id": transaction_id,
                "status": status
            }
            
        except Exception as e:
            logger.error(f"Error processing payment: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def check_usage_limits(self, user_id: str, feature: str, 
                          words: int = 0, api_request: bool = False) -> Dict[str, Any]:
        """Check if user has exceeded usage limits"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Get user subscription
            cursor.execute('''
                SELECT tier, status, end_date FROM premium_users 
                WHERE user_id = ?
            ''', (user_id,))
            
            user_data = cursor.fetchone()
            if not user_data:
                return {"allowed": False, "reason": "User not found"}
            
            tier, status, end_date = user_data
            
            # Check if subscription is active
            if status != "active":
                return {"allowed": False, "reason": "Subscription not active"}
            
            # Check if subscription has expired
            if datetime.fromisoformat(end_date) < datetime.now():
                return {"allowed": False, "reason": "Subscription expired"}
            
            # Get usage metrics
            cursor.execute('''
                SELECT words_processed, api_requests_today, last_reset_date 
                FROM usage_metrics WHERE user_id = ?
            ''', (user_id,))
            
            usage_data = cursor.fetchone()
            if not usage_data:
                return {"allowed": False, "reason": "Usage data not found"}
            
            words_processed, api_requests_today, last_reset_date = usage_data
            
            # Reset daily API limits if it's a new day
            today = datetime.now().date()
            if last_reset_date and datetime.fromisoformat(last_reset_date).date() < today:
                cursor.execute('''
                    UPDATE usage_metrics 
                    SET api_requests_today = 0, last_reset_date = ?
                    WHERE user_id = ?
                ''', (today.isoformat(), user_id))
                api_requests_today = 0
            
            # Get tier limits
            tier_config = self.pricing_tiers[tier]
            
            # Check word limit
            if words > 0:
                if words_processed + words > tier_config.word_limit:
                    return {
                        "allowed": False,
                        "reason": f"Word limit exceeded. Limit: {tier_config.word_limit}, Used: {words_processed}"
                    }
            
            # Check API request limit
            if api_request:
                if api_requests_today >= tier_config.api_requests_per_day:
                    return {
                        "allowed": False,
                        "reason": f"Daily API limit exceeded. Limit: {tier_config.api_requests_per_day}"
                    }
            
            conn.close()
            
            return {"allowed": True, "limits": {
                "word_limit": tier_config.word_limit,
                "words_used": words_processed,
                "words_remaining": tier_config.word_limit - words_processed,
                "api_daily_limit": tier_config.api_requests_per_day,
                "api_used_today": api_requests_today,
                "api_remaining_today": tier_config.api_requests_per_day - api_requests_today
            }}
            
        except Exception as e:
            logger.error(f"Error checking usage limits: {str(e)}")
            return {"allowed": False, "reason": f"Error: {str(e)}"}
    
    def update_usage(self, user_id: str, words: int = 0, api_request: bool = False):
        """Update user usage metrics"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            if words > 0:
                cursor.execute('''
                    UPDATE usage_metrics 
                    SET words_processed = words_processed + ?, updated_at = ?
                    WHERE user_id = ?
                ''', (words, datetime.now().isoformat(), user_id))
            
            if api_request:
                cursor.execute('''
                    UPDATE usage_metrics 
                    SET api_requests_today = api_requests_today + 1, 
                        api_requests_total = api_requests_total + 1, updated_at = ?
                    WHERE user_id = ?
                ''', (datetime.now().isoformat(), user_id))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logger.error(f"Error updating usage: {str(e)}")
    
    def get_subscription_info(self, user_id: str) -> Dict[str, Any]:
        """Get user subscription information"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT u.tier, u.status, u.start_date, u.end_date, u.billing_cycle,
                       u.payment_method, u.auto_renew, m.words_processed, 
                       m.api_requests_today, m.api_requests_total
                FROM premium_users u
                LEFT JOIN usage_metrics m ON u.user_id = m.user_id
                WHERE u.user_id = ?
            ''', (user_id,))
            
            user_data = cursor.fetchone()
            conn.close()
            
            if not user_data:
                return {"error": "User not found"}
            
            tier, status, start_date, end_date, billing_cycle, payment_method, \
            auto_renew, words_processed, api_requests_today, api_requests_total = user_data
            
            tier_config = self.pricing_tiers[tier]
            
            return {
                "tier": tier,
                "tier_name": tier_config.name,
                "status": status,
                "start_date": start_date,
                "end_date": end_date,
                "billing_cycle": billing_cycle,
                "payment_method": payment_method,
                "auto_renew": auto_renew,
                "pricing": {
                    "monthly": tier_config.price_monthly,
                    "yearly": tier_config.price_yearly
                },
                "limits": {
                    "word_limit": tier_config.word_limit,
                    "words_used": words_processed or 0,
                    "words_remaining": tier_config.word_limit - (words_processed or 0),
                    "api_daily_limit": tier_config.api_requests_per_day,
                    "api_used_today": api_requests_today or 0,
                    "api_remaining_today": tier_config.api_requests_per_day - (api_requests_today or 0)
                },
                "features": tier_config.features,
                "support_level": tier_config.support_level,
                "refund_policy": tier_config.refund_policy
            }
            
        except Exception as e:
            logger.error(f"Error getting subscription info: {str(e)}")
            return {"error": str(e)}
    
    def cancel_subscription(self, user_id: str) -> Dict[str, Any]:
        """Cancel user subscription"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                UPDATE premium_users 
                SET status = 'cancelled', updated_at = ?
                WHERE user_id = ?
            ''', (datetime.now().isoformat(), user_id))
            
            conn.commit()
            conn.close()
            
            logger.info(f"Cancelled subscription for user {user_id}")
            return {"success": True, "message": "Subscription cancelled successfully"}
            
        except Exception as e:
            logger.error(f"Error cancelling subscription: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def get_pricing_tiers(self) -> Dict[str, Any]:
        """Get all available pricing tiers"""
        return {
            tier: {
                "name": tier_config.name,
                "monthly_price": tier_config.price_monthly,
                "yearly_price": tier_config.price_yearly,
                "features": tier_config.features,
                "limits": {
                    "word_limit": tier_config.word_limit,
                    "api_requests_per_day": tier_config.api_requests_per_day,
                    "max_users": tier_config.max_users
                },
                "support_level": tier_config.support_level,
                "refund_policy": tier_config.refund_policy
            }
            for tier, tier_config in self.pricing_tiers.items()
        }

def main():
    """Test the premium features system"""
    print("🚀 Maijd Software Suite - Premium Features System")
    print("=" * 60)
    
    # Initialize premium manager
    premium_manager = MaijdPremiumManager()
    
    # Test user
    test_user_id = "test_user_123"
    test_email = "test@example.com"
    
    print("\n📊 Available Pricing Tiers:")
    pricing_tiers = premium_manager.get_pricing_tiers()
    for tier, details in pricing_tiers.items():
        print(f"\n{tier.upper()} TIER:")
        print(f"  Name: {details['name']}")
        print(f"  Monthly: ${details['monthly_price']}")
        print(f"  Yearly: ${details['yearly_price']}")
        print(f"  Word Limit: {details['limits']['word_limit']:,}")
        print(f"  API Requests/Day: {details['limits']['api_requests_per_day']:,}")
        print(f"  Support: {details['support_level']}")
    
    print(f"\n💳 Creating subscription for {test_email}...")
    result = premium_manager.create_subscription(
        user_id=test_user_id,
        email=test_email,
        tier="starter",
        billing_cycle="monthly",
        payment_method="stripe"
    )
    
    if result["success"]:
        print("✅ Subscription created successfully!")
        
        # Check usage limits
        print("\n🔍 Checking usage limits...")
        limits = premium_manager.check_usage_limits(test_user_id, "text_processing", words=1000)
        print(f"Allowed: {limits['allowed']}")
        if limits['allowed']:
            print(f"Words remaining: {limits['limits']['words_remaining']:,}")
        
        # Get subscription info
        print("\n📋 Subscription Information:")
        sub_info = premium_manager.get_subscription_info(test_user_id)
        print(f"Tier: {sub_info['tier_name']}")
        print(f"Status: {sub_info['status']}")
        print(f"Billing: {sub_info['billing_cycle']}")
        print(f"Price: ${sub_info['pricing']['monthly']}/month")
        
    else:
        print(f"❌ Error: {result['error']}")

if __name__ == "__main__":
    main()
