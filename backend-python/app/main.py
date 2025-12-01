from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.scanner import scan_ports
from app.sniffer import sniff_packets
import os

app = FastAPI(title="CyberBull Python Scanner & Sniffer")

# FRONTEND + CPP BACKEND URLS
FRONTEND_URL = os.getenv("FRONTEND_URL")
CPP_BACKEND_URL = os.getenv("CPP_BACKEND_URL")

# Build dynamic allowed origins list
allowed_origins = []

if FRONTEND_URL:
    allowed_origins.append(FRONTEND_URL)

if CPP_BACKEND_URL:
    allowed_origins.append(CPP_BACKEND_URL)

# If no env variables set → allow all (development mode)
if not allowed_origins:
    allowed_origins = ["*"]

# CORS SETTINGS
app.add_middleware(
    CORSMiddleware(
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
)

class ScanRequest(BaseModel):
    host: str
    ports: list[int] | None = None  # optional → if not provided, scan common ports

class SniffRequest(BaseModel):
    interface: str
    packet_count: int = 10


@app.get("/")
def root():
    return {"message": "CyberBull Python backend is running"}


@app.post("/scan")
def scan(request: ScanRequest):
    try:
        result = scan_ports(request.host, request.ports)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan failed: {e}")


@app.post("/sniff")
def sniff(request: SniffRequest):
    try:
        packets = sniff_packets(request.interface, request.packet_count)
        return {"packets": packets}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sniff failed: {e}")
