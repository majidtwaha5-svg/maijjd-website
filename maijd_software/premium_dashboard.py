#!/usr/bin/env python3
"""
Maijd Software Suite - Premium Features Web Dashboard
Web interface for account creation, subscription management, and payment processing
"""

import os
import json
import secrets
from datetime import datetime, timedelta
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from premium_features import MaijdPremiumManager, PricingTier
import sqlite3

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', secrets.token_hex(32))

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Initialize premium manager
premium_manager = MaijdPremiumManager()

class User(UserMixin):
    """User model for authentication"""
    def __init__(self, user_id, email, password_hash, created_at):
        self.id = user_id
        self.email = email
        self.password_hash = password_hash
        self.created_at = created_at

@login_manager.user_loader
def load_user(user_id):
    """Load user for Flask-Login"""
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('SELECT user_id, email, password_hash, created_at FROM users WHERE user_id = ?', (user_id,))
    user_data = cursor.fetchone()
    conn.close()
    
    if user_data:
        return User(*user_data)
    return None

def init_user_database():
    """Initialize user authentication database"""
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()

def create_user(email, password):
    """Create a new user account"""
    try:
        user_id = f"user_{secrets.token_hex(8)}"
        password_hash = generate_password_hash(password)
        created_at = datetime.now().isoformat()
        
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO users (user_id, email, password_hash, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, email, password_hash, created_at, created_at))
        
        conn.commit()
        conn.close()
        
        return {"success": True, "user_id": user_id}
    except Exception as e:
        return {"success": False, "error": str(e)}

def authenticate_user(email, password):
    """Authenticate user login"""
    try:
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        
        cursor.execute('SELECT user_id, email, password_hash, created_at FROM users WHERE email = ?', (email,))
        user_data = cursor.fetchone()
        conn.close()
        
        if user_data and check_password_hash(user_data[2], password):
            return User(*user_data)
        return None
    except Exception as e:
        return None

@app.route('/')
def index():
    """Home page with pricing information"""
    pricing_tiers = premium_manager.get_pricing_tiers()
    return render_template('index.html', pricing_tiers=pricing_tiers)

@app.route('/register', methods=['GET', 'POST'])
def register():
    """User registration page"""
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        if not email or not password:
            flash('Please fill in all fields', 'error')
            return redirect(url_for('register'))
        
        if password != confirm_password:
            flash('Passwords do not match', 'error')
            return redirect(url_for('register'))
        
        if len(password) < 8:
            flash('Password must be at least 8 characters long', 'error')
            return redirect(url_for('register'))
        
        # Check if user already exists
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        cursor.execute('SELECT email FROM users WHERE email = ?', (email,))
        if cursor.fetchone():
            conn.close()
            flash('Email already registered', 'error')
            return redirect(url_for('register'))
        conn.close()
        
        # Create user account
        result = create_user(email, password)
        if result['success']:
            flash('Account created successfully! Please log in.', 'success')
            return redirect(url_for('login'))
        else:
            flash(f'Error creating account: {result["error"]}', 'error')
            return redirect(url_for('register'))
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    """User login page"""
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        if not email or not password:
            flash('Please fill in all fields', 'error')
            return redirect(url_for('login'))
        
        user = authenticate_user(email, password)
        if user:
            login_user(user)
            flash('Logged in successfully!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password', 'error')
            return redirect(url_for('login'))
    
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    """User logout"""
    logout_user()
    flash('Logged out successfully', 'success')
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    """User dashboard"""
    subscription_info = premium_manager.get_subscription_info(current_user.id)
    return render_template('dashboard.html', subscription_info=subscription_info)

@app.route('/subscribe/<tier>')
@login_required
def subscribe(tier):
    """Subscription page for a specific tier"""
    if tier not in premium_manager.pricing_tiers:
        flash('Invalid pricing tier', 'error')
        return redirect(url_for('dashboard'))
    
    tier_info = premium_manager.pricing_tiers[tier]
    return render_template('subscribe.html', tier=tier, tier_info=tier_info)

@app.route('/process_subscription', methods=['POST'])
@login_required
def process_subscription():
    """Process subscription payment and creation"""
    try:
        tier = request.form.get('tier')
        billing_cycle = request.form.get('billing_cycle')
        payment_method = request.form.get('payment_method')
        
        if not all([tier, billing_cycle, payment_method]):
            flash('Missing required fields', 'error')
            return redirect(url_for('subscribe', tier=tier))
        
        # Create subscription
        result = premium_manager.create_subscription(
            user_id=current_user.id,
            email=current_user.email,
            tier=tier,
            billing_cycle=billing_cycle,
            payment_method=payment_method
        )
        
        if result['success']:
            # Process payment (simulated for demo)
            payment_result = premium_manager.process_payment(
                user_id=current_user.id,
                amount=result['price'],
                currency='USD',
                payment_method=payment_method,
                payment_data={}
            )
            
            if payment_result['success']:
                flash('Subscription created successfully!', 'success')
                return redirect(url_for('dashboard'))
            else:
                flash(f'Payment failed: {payment_result["error"]}', 'error')
                return redirect(url_for('subscribe', tier=tier))
        else:
            flash(f'Error creating subscription: {result["error"]}', 'error')
            return redirect(url_for('subscribe', tier=tier))
            
    except Exception as e:
        flash(f'Error processing subscription: {str(e)}', 'error')
        return redirect(url_for('dashboard'))

@app.route('/cancel_subscription')
@login_required
def cancel_subscription():
    """Cancel user subscription"""
    result = premium_manager.cancel_subscription(current_user.id)
    if result['success']:
        flash('Subscription cancelled successfully', 'success')
    else:
        flash(f'Error cancelling subscription: {result["error"]}', 'error')
    
    return redirect(url_for('dashboard'))

@app.route('/api/usage')
@login_required
def get_usage():
    """Get current user usage information"""
    subscription_info = premium_manager.get_subscription_info(current_user.id)
    if 'error' in subscription_info:
        return jsonify({'error': subscription_info['error']}), 400
    
    return jsonify(subscription_info)

@app.route('/api/check_limits', methods=['POST'])
@login_required
def check_limits():
    """Check if user can perform an action"""
    data = request.get_json()
    feature = data.get('feature', '')
    words = data.get('words', 0)
    api_request = data.get('api_request', False)
    
    result = premium_manager.check_usage_limits(
        user_id=current_user.id,
        feature=feature,
        words=words,
        api_request=api_request
    )
    
    return jsonify(result)

@app.route('/api/update_usage', methods=['POST'])
@login_required
def update_usage():
    """Update user usage metrics"""
    data = request.get_json()
    words = data.get('words', 0)
    api_request = data.get('api_request', False)
    
    premium_manager.update_usage(
        user_id=current_user.id,
        words=words,
        api_request=api_request
    )
    
    return jsonify({'success': True})

if __name__ == '__main__':
    # Initialize databases
    init_user_database()
    
    print("🚀 Maijd Software Suite - Premium Dashboard")
    print("=" * 50)
    print("Starting web server...")
    print("Access the dashboard at: http://localhost:5000")
    print("Press Ctrl+C to stop")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
