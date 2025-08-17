#!/usr/bin/env python3
"""
Production startup script for Maijd Software Suite Mobile API
Optimized for Railway deployment
"""

import os
import sys
from mobile_api import app

if __name__ == '__main__':
    # Get port from Railway environment
    port = int(os.environ.get('PORT', 5000))
    
    # Get host from environment or default to 0.0.0.0 for Railway
    host = os.environ.get('HOST', '0.0.0.0')
    
    # Get debug mode from environment
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    
    print(f"🚀 Starting Maijd Mobile API in production mode...")
    print(f"📍 Host: {host}")
    print(f"🔌 Port: {port}")
    print(f"🐛 Debug: {debug}")
    print(f"📱 API Version: 2.0.0")
    print(f"⚡ Real-time Updates: Enabled")
    print(f"📴 Offline Support: Enabled")
    print(f"🔄 Background Sync: Enabled")
    print(f"🔔 Push Notifications: Enabled")
    print(f"📱 PWA Features: Enabled")
    
    try:
        app.run(
            host=host,
            port=port,
            debug=debug,
            threaded=True
        )
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)
