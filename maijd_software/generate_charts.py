#!/usr/bin/env python3
"""
Maijd Software Suite - Chart Generator
Generate sample performance charts for the README documentation
"""

import matplotlib.pyplot as plt
import numpy as np
import os
from datetime import datetime, timedelta

# Set style for professional appearance
plt.style.use('default')
plt.rcParams['figure.figsize'] = (12, 8)
plt.rcParams['font.size'] = 12
plt.rcParams['axes.grid'] = True
plt.rcParams['grid.alpha'] = 0.3

# Maijd Software color scheme
COLORS = {
    'primary': '#2563eb',      # Blue
    'secondary': '#7c3aed',    # Purple
    'accent': '#059669',       # Green
    'warning': '#dc2626',      # Red
    'neutral': '#6b7280'       # Gray
}

def create_assets_directory():
    """Create assets directory structure if it doesn't exist"""
    directories = [
        'assets/charts',
        'assets/diagrams', 
        'assets/screenshots'
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✓ Created directory: {directory}")

def generate_response_time_chart():
    """Generate response time performance chart"""
    print("Generating response time performance chart...")
    
    # Sample data
    users = [1, 10, 50, 100, 500, 1000]
    api_response = [15, 18, 25, 35, 65, 120]
    db_response = [25, 30, 45, 70, 150, 300]
    cache_response = [5, 6, 8, 12, 20, 35]
    
    plt.figure(figsize=(12, 8))
    plt.plot(users, api_response, 'o-', color=COLORS['primary'], linewidth=3, 
             markersize=8, label='API Endpoints')
    plt.plot(users, db_response, 's-', color=COLORS['secondary'], linewidth=3, 
             markersize=8, label='Database Queries')
    plt.plot(users, cache_response, '^-', color=COLORS['accent'], linewidth=3, 
             markersize=8, label='Cache Hits')
    
    plt.xlabel('Concurrent Users', fontsize=14, fontweight='bold')
    plt.ylabel('Response Time (ms)', fontsize=14, fontweight='bold')
    plt.title('API Response Time Performance', fontsize=16, fontweight='bold')
    plt.legend(fontsize=12)
    plt.grid(True, alpha=0.3)
    plt.xscale('log')
    plt.yscale('log')
    
    # Add performance annotations
    plt.annotate('Optimal Performance\n< 50ms', xy=(100, 50), xytext=(200, 80),
                arrowprops=dict(arrowstyle='->', color=COLORS['warning'], lw=2))
    
    plt.tight_layout()
    plt.savefig('assets/charts/response-time.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Generated: assets/charts/response-time.png")

def generate_throughput_chart():
    """Generate throughput analysis chart"""
    print("Generating throughput analysis chart...")
    
    # Sample data
    users = [1, 10, 50, 100, 500, 1000]
    requests_per_sec = [100, 950, 4200, 7800, 12000, 15000]
    
    plt.figure(figsize=(12, 8))
    bars = plt.bar(users, requests_per_sec, color=COLORS['primary'], alpha=0.8, 
                   edgecolor=COLORS['primary'], linewidth=2)
    
    # Add value labels on bars
    for bar, value in zip(bars, requests_per_sec):
        plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 500,
                f'{value:,}', ha='center', va='bottom', fontweight='bold')
    
    plt.xlabel('Concurrent Users', fontsize=14, fontweight='bold')
    plt.ylabel('Requests per Second', fontsize=14, fontweight='bold')
    plt.title('System Throughput Analysis', fontsize=16, fontweight='bold')
    plt.grid(True, alpha=0.3, axis='y')
    
    # Add performance line
    plt.axhline(y=10000, color=COLORS['warning'], linestyle='--', linewidth=2,
                label='Performance Target (10k req/s)')
    plt.legend(fontsize=12)
    
    plt.tight_layout()
    plt.savefig('assets/charts/throughput.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Generated: assets/charts/throughput.png")

def generate_resource_usage_chart():
    """Generate resource usage monitoring chart"""
    print("Generating resource usage monitoring chart...")
    
    # Generate 24-hour time series data
    hours = np.arange(0, 24, 0.5)
    cpu_usage = 30 + 20 * np.sin(hours * np.pi / 12) + np.random.normal(0, 5, len(hours))
    memory_usage = 45 + 15 * np.sin(hours * np.pi / 12) + np.random.normal(0, 3, len(hours))
    disk_usage = 25 + 10 * np.sin(hours * np.pi / 24) + np.random.normal(0, 2, len(hours))
    
    plt.figure(figsize=(12, 8))
    plt.plot(hours, cpu_usage, color=COLORS['primary'], linewidth=3, label='CPU Usage')
    plt.plot(hours, memory_usage, color=COLORS['secondary'], linewidth=3, label='Memory Usage')
    plt.plot(hours, disk_usage, color=COLORS['accent'], linewidth=3, label='Disk Usage')
    
    plt.xlabel('Time (Hours)', fontsize=14, fontweight='bold')
    plt.ylabel('Resource Usage (%)', fontsize=14, fontweight='bold')
    plt.title('24-Hour Resource Usage Monitoring', fontsize=16, fontweight='bold')
    plt.legend(fontsize=12)
    plt.grid(True, alpha=0.3)
    
    # Add peak usage indicators
    peak_cpu = np.max(cpu_usage)
    peak_memory = np.max(memory_usage)
    peak_disk = np.max(disk_usage)
    
    plt.annotate(f'Peak CPU: {peak_cpu:.1f}%', 
                xy=(hours[np.argmax(cpu_usage)], peak_cpu),
                xytext=(10, 80), arrowprops=dict(arrowstyle='->', color=COLORS['warning']))
    
    plt.tight_layout()
    plt.savefig('assets/charts/resource-usage.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Generated: assets/charts/resource-usage.png")

def generate_scalability_chart():
    """Generate scalability testing results chart"""
    print("Generating scalability testing results chart...")
    
    # Sample data
    users = [1, 10, 50, 100, 500, 1000, 2000, 5000]
    actual_performance = [100, 950, 4200, 7800, 12000, 15000, 18000, 20000]
    linear_scaling = [100, 1000, 5000, 10000, 50000, 100000, 200000, 500000]
    
    plt.figure(figsize=(12, 8))
    plt.plot(users, actual_performance, 'o-', color=COLORS['primary'], linewidth=3, 
             markersize=8, label='Actual Performance')
    plt.plot(users, linear_scaling, '--', color=COLORS['neutral'], linewidth=2, 
             label='Linear Scaling (Theoretical)')
    
    # Add performance degradation point
    degradation_point = 1000
    degradation_index = users.index(degradation_point)
    plt.annotate('Performance\nDegradation\nPoint', 
                xy=(degradation_point, actual_performance[degradation_index]),
                xytext=(1500, 25000), arrowprops=dict(arrowstyle='->', color=COLORS['warning']))
    
    plt.xlabel('Concurrent Users', fontsize=14, fontweight='bold')
    plt.ylabel('Performance (Requests/Second)', fontsize=14, fontweight='bold')
    plt.title('System Scalability Testing Results', fontsize=16, fontweight='bold')
    plt.legend(fontsize=12)
    plt.grid(True, alpha=0.3)
    plt.xscale('log')
    plt.yscale('log')
    
    plt.tight_layout()
    plt.savefig('assets/charts/scalability.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Generated: assets/charts/scalability.png")

def generate_cache_performance_chart():
    """Generate cache hit rate performance chart"""
    print("Generating cache hit rate performance chart...")
    
    # Sample data
    cache_size_mb = [64, 128, 256, 512, 1024, 2048]
    hit_rate = [45, 62, 78, 88, 94, 97]
    miss_rate = [55, 38, 22, 12, 6, 3]
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 8))
    
    # Hit rate chart
    ax1.plot(cache_size_mb, hit_rate, 'o-', color=COLORS['accent'], linewidth=3, 
             markersize=8, label='Cache Hit Rate')
    ax1.set_xlabel('Cache Size (MB)', fontsize=12, fontweight='bold')
    ax1.set_ylabel('Hit Rate (%)', fontsize=12, fontweight='bold')
    ax1.set_title('Cache Hit Rate vs Size', fontsize=14, fontweight='bold')
    ax1.grid(True, alpha=0.3)
    ax1.legend()
    
    # Miss rate chart
    ax2.plot(cache_size_mb, miss_rate, 's-', color=COLORS['warning'], linewidth=3, 
             markersize=8, label='Cache Miss Rate')
    ax2.set_xlabel('Cache Size (MB)', fontsize=12, fontweight='bold')
    ax2.set_ylabel('Miss Rate (%)', fontsize=12, fontweight='bold')
    ax2.set_title('Cache Miss Rate vs Size', fontsize=14, fontweight='bold')
    ax2.grid(True, alpha=0.3)
    ax2.legend()
    
    plt.suptitle('Cache Performance Analysis', fontsize=16, fontweight='bold')
    plt.tight_layout()
    plt.savefig('assets/charts/cache-performance.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Generated: assets/charts/cache-performance.png")

def generate_database_performance_chart():
    """Generate database performance metrics chart"""
    print("Generating database performance metrics chart...")
    
    # Sample data
    query_types = ['Simple Select', 'Complex Join', 'Aggregation', 'Full Text Search', 'Bulk Insert']
    before_optimization = [25, 150, 300, 800, 1200]
    after_optimization = [15, 75, 120, 300, 450]
    
    x = np.arange(len(query_types))
    width = 0.35
    
    plt.figure(figsize=(14, 8))
    bars1 = plt.bar(x - width/2, before_optimization, width, label='Before Optimization', 
                    color=COLORS['warning'], alpha=0.8)
    bars2 = plt.bar(x + width/2, after_optimization, width, label='After Optimization', 
                    color=COLORS['accent'], alpha=0.8)
    
    plt.xlabel('Query Types', fontsize=14, fontweight='bold')
    plt.ylabel('Execution Time (ms)', fontsize=14, fontweight='bold')
    plt.title('Database Performance Optimization Results', fontsize=16, fontweight='bold')
    plt.xticks(x, query_types, rotation=45, ha='right')
    plt.legend(fontsize=12)
    plt.grid(True, alpha=0.3, axis='y')
    
    # Add improvement percentages
    for i, (before, after) in enumerate(zip(before_optimization, after_optimization)):
        improvement = ((before - after) / before) * 100
        plt.text(i, max(before, after) + 50, f'{improvement:.0f}%', 
                ha='center', va='bottom', fontweight='bold', color=COLORS['primary'])
    
    plt.tight_layout()
    plt.savefig('assets/charts/database-performance.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Generated: assets/charts/database-performance.png")

def main():
    """Main function to generate all charts"""
    print("🚀 Maijd Software Suite - Chart Generator")
    print("=" * 50)
    
    # Create assets directory
    create_assets_directory()
    print()
    
    # Generate all charts
    generate_response_time_chart()
    generate_throughput_chart()
    generate_resource_usage_chart()
    generate_scalability_chart()
    generate_cache_performance_chart()
    generate_database_performance_chart()
    
    print()
    print("🎉 All charts generated successfully!")
    print("📁 Charts saved in: assets/charts/")
    print()
    print("Next steps:")
    print("1. Review the generated charts")
    print("2. Customize with your actual performance data")
    print("3. Take screenshots of your software interfaces")
    print("4. Create architecture diagrams")
    print("5. Update the README with your actual assets")

if __name__ == "__main__":
    main()
