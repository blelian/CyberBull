from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.scanner import scan_ports
from app.sniffer import sniff_packets

app = FastAPI(title="CyberBull Python Scanner & Sniffer")

class ScanRequest(BaseModel):
    host: str
    ports: list[int] | None = None  # optional, scan common ports if not provided

class SniffRequest(BaseModel):
    interface: str
    packet_count: int = 10  # default number of packets to capture

@app.get("/")
def root():
    return {"message": "CyberBull Python backend is running"}

@app.post("/scan")
def scan(request: ScanRequest):
    try:
        result = scan_ports(request.host, request.ports)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sniff")
def sniff(request: SniffRequest):
    try:
        packets = sniff_packets(request.interface, request.packet_count)
        return {"packets": packets}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
