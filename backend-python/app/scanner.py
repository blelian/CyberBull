import os
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class ScanRequest(BaseModel):
    host: str
    start_port: int
    end_port: int

# Detect if running on Render
ON_RENDER = os.environ.get("RENDER", None) is not None

def is_port_open(host: str, port: int) -> bool:
    if ON_RENDER:
        # Simulate results on Render
        # Pretend some common ports are open
        return port in [22, 80, 443]
    else:
        # Real scan locally or on a VM
        import socket
        try:
            with socket.create_connection((host, port), timeout=1.0):
                return True
        except:
            return False

@app.post("/scan")
def scan_ports(data: ScanRequest):
    host = data.host.strip()
    start_p = max(1, data.start_port)
    end_p = min(65535, data.end_port)

    open_ports: List[int] = []

    for port in range(start_p, end_p + 1):
        if is_port_open(host, port):
            open_ports.append(port)

    return {
        "host": host,
        "start_port": start_p,
        "end_port": end_p,
        "open_ports": open_ports
    }
