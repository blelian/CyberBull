import socket
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class ScanRequest(BaseModel):
    host: str
    start_port: int
    end_port: int

def is_port_open(host: str, port: int) -> bool:
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
