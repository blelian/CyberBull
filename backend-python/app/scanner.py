from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import random

app = FastAPI()

class ScanRequest(BaseModel):
    host: str
    start_port: int
    end_port: int

@app.post("/scan")
def scan_ports(data: ScanRequest):
    host = data.host.strip()
    start_p = max(1, data.start_port)
    end_p = min(65535, data.end_port)

    # Fully simulated results
    possible_ports = list(range(start_p, end_p + 1))
    num_open = min(5, len(possible_ports))  # max 5 open ports
    open_ports = sorted(random.sample(possible_ports, num_open))

    return {
        "host": host,
        "start_port": start_p,
        "end_port": end_p,
        "open_ports": open_ports
    }
