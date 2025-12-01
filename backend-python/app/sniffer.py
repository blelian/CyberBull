import random
import time

def sniff_packets(interface: str, packet_count: int = 10) -> list[dict]:
    """
    SAFE simulated packet sniffer for Render deployment.
    Generates realistic-looking packet metadata without using raw sockets.
    """

    fake_ips = [
        "192.168.0.1", "192.168.0.22", "10.0.0.5",
        "8.8.8.8", "142.250.74.174", "1.1.1.1"
    ]

    fake_ports = [21, 22, 53, 80, 443, 8080, 3306]

    packets = []

    for _ in range(packet_count):
        pkt = {
            "src": random.choice(fake_ips),
            "dst": random.choice(fake_ips),
            "sport": random.choice(fake_ports),
            "dport": random.choice(fake_ports),
            "timestamp": time.time(),
            "interface": interface  #include interface for realism
        }
        packets.append(pkt)

    return packets
