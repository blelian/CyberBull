import socket

# Safe list of common TCP ports
COMMON_PORTS = [21, 22, 23, 25, 53, 80, 110, 443, 3389]

def scan_ports(host: str, ports: list[int] | None = None) -> dict:
    """
    SAFE TCP connect scan.
    No SYN, no raw sockets → legal everywhere.
    """
    if ports is None:
        ports = COMMON_PORTS

    open_ports = []

    for port in ports:
        try:
            # Attempt normal TCP connection
            with socket.create_connection((host, port), timeout=0.5):
                open_ports.append(port)
        except Exception:
            continue

    return {"host": host, "open_ports": open_ports}
