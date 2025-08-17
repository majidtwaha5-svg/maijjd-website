#!/usr/bin/env python3
"""
Debug script for Maijd Dashboard
"""

import os
import sys
import json
import traceback

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print("1. Importing MaijdDashboard class...")
    from web_dashboard import MaijdDashboard
    print("   ✓ Import successful")
    
    print("\n2. Creating dashboard instance...")
    dashboard = MaijdDashboard()
    print("   ✓ Dashboard instance created")
    
    print("\n3. Checking software categories...")
    print(f"   Categories count: {len(dashboard.software_categories)}")
    print(f"   Total features: {dashboard.get_total_features_count()}")
    
    print("\n4. Testing get_dashboard_data...")
    data = dashboard.get_dashboard_data()
    print(f"   Software categories in data: {len(data.get('software_categories', {}))}")
    print(f"   Total features in data: {data.get('total_features', 0)}")
    
    print("\n5. Testing individual methods...")
    print(f"   System info: {dashboard.get_system_info()}")
    print(f"   Installed software: {len(dashboard.get_installed_software())}")
    print(f"   Performance metrics: {len(dashboard.get_performance_metrics())}")
    print(f"   AI insights: {len(dashboard.get_ai_insights())}")
    print(f"   Cloud deployments: {len(dashboard.get_cloud_deployments())}")
    print(f"   Security status: {dashboard.get_security_status()}")
    print(f"   Usage statistics: {len(dashboard.get_usage_statistics())}")
    
    print("\n6. Testing feature breakdown...")
    breakdown = dashboard.get_feature_breakdown()
    print(f"   Breakdown categories: {len(breakdown)}")
    for cat_id, cat_data in breakdown.items():
        print(f"     {cat_id}: {cat_data['name']} - {cat_data['feature_count']} features")
    
    print("\n✓ All tests passed! Dashboard is working correctly.")
    
except Exception as e:
    print(f"\n❌ Error occurred: {str(e)}")
    print("\nFull traceback:")
    traceback.print_exc()
