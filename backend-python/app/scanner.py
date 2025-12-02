from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import random
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS — allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # or put your frontend URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScanRequest(BaseModel):
    host: str
    start_port: int
    end_port: int

@app.post("/scan")
def scan_ports(data: ScanRequest):
    host = data.host.strip()
    start_p = max(1, data.start_port)
    end_p = min(65535, data.end_port)

    # Simulate a few open ports
    possible_ports = list(range(start_p, end_p + 1))
    num_open = min(5, len(possible_ports))
    open_ports = sorted(random.sample(possible_ports, num_open))

    return {
        "host": host,
        "start_port": start_p,
        "end_port": end_p,
        "open_ports": open_ports
    }
