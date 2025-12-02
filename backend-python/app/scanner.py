from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import random
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScanRequest(BaseModel):
    host: str
    ports: List[int]

@app.post("/scan")
def scan_ports(data: ScanRequest):
    host = data.host.strip()
    ports = [p for p in data.ports if 1 <= p <= 65535]

    # Simulate open ports
    num_open = min(5, len(ports))
    open_ports = sorted(random.sample(ports, num_open)) if ports else []

    return {
        "host": host,
        "open_ports": open_ports
    }
