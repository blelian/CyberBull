from fastapi import FastAPI

app = FastAPI(title="CyberBull Python Backend")

@app.get("/")
async def root():
    return {"message": "CyberBull Python Backend is live!"}

@app.get("/scanner")
async def scanner():
    return {"message": "Port scanner endpoint placeholder"}

@app.get("/sniffer")
async def sniffer():
    return {"message": "Packet sniffer endpoint placeholder"}
