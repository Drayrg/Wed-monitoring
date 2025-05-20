#!/usr/bin/env python3
"""
System Metrics Client for SystemPulse Dashboard

This script collects real-time system metrics from your computer
and sends them to the SystemPulse dashboard web application.
"""

import sys
import time
import json
import platform
import argparse
import socket
import requests
from datetime import datetime
from urllib.parse import urljoin

# Try to import platform-specific libraries
try:
    import psutil
except ImportError:
    print("Error: psutil library is required. Install it with 'pip install psutil'")
    sys.exit(1)

# Configuration
DEFAULT_INTERVAL = 3  # seconds
DEFAULT_SERVER_URL = "http://localhost:5000"
API_ENDPOINT = "/api/metrics"


def get_cpu_metrics():
    """Get CPU metrics from the system"""
    cpu_percent = psutil.cpu_percent(interval=0.5)
    cpu_count_physical = psutil.cpu_count(logical=False) or 1
    cpu_count_logical = psutil.cpu_count(logical=True) or 1
    
    # Try to get CPU frequency, fallback to "Unknown" if not available
    try:
        if hasattr(psutil, 'cpu_freq') and psutil.cpu_freq():
            cpu_freq = psutil.cpu_freq()
            cpu_speed = f"{cpu_freq.current:.2f} MHz"
        else:
            cpu_speed = "Unknown"
    except:
        cpu_speed = "Unknown"
    
    # Try to get CPU model name from platform-specific methods
    cpu_model = "CPU"
    try:
        if platform.system() == "Linux":
            with open("/proc/cpuinfo") as f:
                for line in f:
                    if line.startswith("model name"):
                        cpu_model = line.split(":")[1].strip()
                        break
        elif platform.system() == "Darwin":  # macOS
            import subprocess
            output = subprocess.check_output(["sysctl", "-n", "machdep.cpu.brand_string"]).decode().strip()
            if output:
                cpu_model = output
        elif platform.system() == "Windows":
            import winreg
            key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"HARDWARE\\DESCRIPTION\\System\\CentralProcessor\\0")
            cpu_model = winreg.QueryValueEx(key, "ProcessorNameString")[0]
    except:
        pass
    
    return {
        "usage": cpu_percent,
        "cores": cpu_count_physical,
        "threads": cpu_count_logical,
        "speed": cpu_speed,
        "model": cpu_model
    }


def get_memory_metrics():
    """Get memory metrics from the system"""
    memory = psutil.virtual_memory()
    
    # Convert to human-readable format
    used_gb = memory.used / (1024 ** 3)
    total_gb = memory.total / (1024 ** 3)
    
    return {
        "usedPercentage": memory.percent,
        "used": f"{used_gb:.2f} GB",
        "total": f"{total_gb:.2f} GB"
    }


def get_battery_metrics():
    """Get battery metrics if available"""
    try:
        if not hasattr(psutil, 'sensors_battery') or psutil.sensors_battery() is None:
            return None
        
        battery = psutil.sensors_battery()
        if battery is None:
            return None
        
        status = "Charging" if battery.power_plugged else "Discharging"
        
        # Calculate time remaining
        if battery.secsleft == -1:
            time_remaining = "Unknown"
        else:
            minutes = battery.secsleft // 60
            time_remaining = f"{minutes} minutes"
        
        return {
            "level": battery.percent,
            "status": status,
            "timeRemaining": time_remaining
        }
    except:
        return None


def get_network_metrics():
    """Get network metrics from the system"""
    try:
        # Get network IO counters
        net_io = psutil.net_io_counters()
        
        # Store current values for calculation
        current_time = time.time()
        current_bytes_sent = net_io.bytes_sent
        current_bytes_recv = net_io.bytes_recv
        
        # Sleep briefly to measure network speed
        time.sleep(0.5)
        
        # Get updated counters
        net_io = psutil.net_io_counters()
        elapsed_time = time.time() - current_time
        
        # Calculate network speeds
        bytes_sent_per_sec = (net_io.bytes_sent - current_bytes_sent) / elapsed_time
        bytes_recv_per_sec = (net_io.bytes_recv - current_bytes_recv) / elapsed_time
        
        # Convert to human-readable format
        if bytes_sent_per_sec < 1024:
            upload_speed = f"{bytes_sent_per_sec:.2f} B/s"
        elif bytes_sent_per_sec < 1024 ** 2:
            upload_speed = f"{bytes_sent_per_sec / 1024:.2f} KB/s"
        else:
            upload_speed = f"{bytes_sent_per_sec / (1024 ** 2):.2f} MB/s"
        
        if bytes_recv_per_sec < 1024:
            download_speed = f"{bytes_recv_per_sec:.2f} B/s"
        elif bytes_recv_per_sec < 1024 ** 2:
            download_speed = f"{bytes_recv_per_sec / 1024:.2f} KB/s"
        else:
            download_speed = f"{bytes_recv_per_sec / (1024 ** 2):.2f} MB/s"
        
        # Get IP address
        try:
            # Get the primary IP address by creating a socket
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            ip_address = s.getsockname()[0]
            s.close()
        except:
            ip_address = "127.0.0.1"
        
        # Get network interfaces
        interfaces = []
        for interface_name, interface_addresses in psutil.net_if_addrs().items():
            for address in interface_addresses:
                if address.family == socket.AF_INET:
                    interface_data = {
                        "name": interface_name,
                        "ipAddress": address.address,
                        "netmask": address.netmask,
                        "status": "connected"
                    }
                    interfaces.append(interface_data)
                    break
        
        return {
            "status": "Online",
            "download": download_speed,
            "upload": upload_speed,
            "ip": ip_address,
            "interfaces": interfaces
        }
    except:
        return {
            "status": "Offline",
            "download": "0 KB/s",
            "upload": "0 KB/s",
            "ip": "127.0.0.1",
            "interfaces": []
        }


def get_storage_metrics():
    """Get storage device information"""
    storage_devices = []
    
    for partition in psutil.disk_partitions():
        if partition.fstype:
            try:
                usage = psutil.disk_usage(partition.mountpoint)
                
                # Convert to human-readable format
                total_gb = usage.total / (1024 ** 3)
                used_gb = usage.used / (1024 ** 3)
                
                device_info = {
                    "name": partition.device,
                    "mountpoint": partition.mountpoint,
                    "type": partition.fstype,
                    "totalSpace": f"{total_gb:.2f} GB Total",
                    "usedSpace": f"{used_gb:.2f} GB Used",
                    "usedPercentage": usage.percent
                }
                storage_devices.append(device_info)
            except:
                pass
    
    return storage_devices


def get_process_metrics():
    """Get information about running processes"""
    processes = []
    
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_info']):
        try:
            # Get process info
            process_info = proc.info
            
            # Calculate memory usage in MB
            memory_mb = process_info['memory_info'].rss / (1024 * 1024) if process_info['memory_info'] else 0
            
            processes.append({
                "pid": process_info['pid'],
                "name": process_info['name'],
                "cpuUsage": process_info['cpu_percent'],
                "memoryUsage": f"{memory_mb:.2f} MB"
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    
    # Sort by CPU usage (descending)
    processes.sort(key=lambda x: x['cpuUsage'], reverse=True)
    
    # Return top 10 processes
    return processes[:10]


def collect_and_send_metrics(server_url, profileId=1):
    """Collect all system metrics and send them to the server"""
    # Construct the full API URL
    api_url = urljoin(server_url, API_ENDPOINT)
    
    # Collect metrics
    cpu_metrics = get_cpu_metrics()
    memory_metrics = get_memory_metrics()
    battery_metrics = get_battery_metrics()
    network_metrics = get_network_metrics()
    storage_devices = get_storage_metrics()
    processes = get_process_metrics()
    
    # Prepare data payload
    payload = {
        "profileId": profileId,
        "cpu": cpu_metrics,
        "memory": memory_metrics,
        "network": network_metrics
    }
    
    # Add battery metrics if available
    if battery_metrics:
        payload["battery"] = battery_metrics
    
    # Add storage and process metrics
    payload["storage"] = {
        "devices": storage_devices
    }
    payload["processes"] = processes
    
    # Send data to server
    try:
        response = requests.post(api_url, json=payload)
        
        if response.status_code == 200:
            current_time = datetime.now().strftime("%H:%M:%S")
            print(f"[{current_time}] Metrics sent successfully")
            return True
        else:
            print(f"Error sending metrics: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"Connection error: {e}")
        return False


def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="System Metrics Client for SystemPulse Dashboard")
    parser.add_argument("--server", default=DEFAULT_SERVER_URL, help=f"Server URL (default: {DEFAULT_SERVER_URL})")
    parser.add_argument("--interval", type=int, default=DEFAULT_INTERVAL, help=f"Update interval in seconds (default: {DEFAULT_INTERVAL})")
    parser.add_argument("--profile", type=int, default=1, help="System profile ID (default: 1)")
    args = parser.parse_args()
    
    print(f"SystemPulse Metrics Client")
    print(f"==========================")
    print(f"Server: {args.server}")
    print(f"Interval: {args.interval} seconds")
    print(f"Profile ID: {args.profile}")
    print(f"Press Ctrl+C to stop")
    print(f"==========================")
    
    try:
        while True:
            collect_and_send_metrics(args.server, args.profile)
            time.sleep(args.interval)
    except KeyboardInterrupt:
        print("\nClient stopped by user")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    main()