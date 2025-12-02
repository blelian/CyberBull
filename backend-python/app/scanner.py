# app/scanner.py

import random

def scan_ports(host: str, ports: list[int] | None):
    if not host:
        raise ValueError("Host is required")

    # If no ports provided → use common ports
    if not ports:
        ports = [80, 443, 22, 8080, 3306]

    # Clean port list
    ports = [p for p in ports if 1 <= p <= 65535]

    # Simulate open ports (max 5 randomly)
    num_open = min(5, len(ports))
    open_ports = sorted(random.sample(ports, num_open)) if ports else []

    return {
        "host": host,
        "scanned_ports": ports,
        "open_ports": open_ports
    }
