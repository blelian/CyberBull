from scapy.all import sniff, IP, TCP

def sniff_packets(interface: str, packet_count: int = 10) -> list[dict]:
    packets = []

    def packet_callback(pkt):
        info = {}
        if IP in pkt:
            info["src"] = pkt[IP].src
            info["dst"] = pkt[IP].dst
        if TCP in pkt:
            info["sport"] = pkt[TCP].sport
            info["dport"] = pkt[TCP].dport
        packets.append(info)

    sniff(iface=interface, prn=packet_callback, count=packet_count)
    return packets
