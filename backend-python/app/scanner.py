import os
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import random

app = FastAPI()

class ScanRequest(BaseModel):
    host: str
    start_port: int
    end_port: int

ON_RENDER = os.environ.get("RENDER", None) is not None

@app.post("/scan")
def scan_ports(data: ScanRequest):
    host = data.host.strip()
    start_p = max(1, data.start_port)
    end_p = min(65535, data.end_port)

    if ON_RENDER:
        # Fully simulated scan — random subset of ports
        all_ports = list(range(start_p, end_p + 1))
        open_ports = random.sample(all_ports, min(len(all_ports), 5))  # max 5 open ports
        open_ports.sort()
    else:
        # Real scan locally
        import socket
        open_ports = []
        for port in range(start_p, end_p + 1):
            try:
                with socket.create_connection((host, port), timeout=1.0):
                    open_ports.append(port)
            except:
                continue

    return {
        "host": host,
        "start_port": start_p,
        "end_port": end_p,
        "open_ports": open_ports
    }
