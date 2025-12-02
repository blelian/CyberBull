from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import random

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
async def scan_ports(request: ScanRequest):
    host = request.host.strip()
    ports = [p for p in request.ports if 1 <= p <= 65535]

    # Simulated open ports
    open_ports = []
    if ports:
        count = min(5, len(ports))
        open_ports = sorted(random.sample(ports, count))

    return {
        "result": {
            "host": host,
            "open_ports": open_ports
        }
    }
