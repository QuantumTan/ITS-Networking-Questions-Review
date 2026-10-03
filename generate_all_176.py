import re
import json

with open('raw_176_questions.txt', 'r', encoding='utf-8') as f:
    text = f.read()

clean = re.sub(r'Cisco 642-457\s*|Best Material, Great Results\.\s*www\.certkingdom\.com\s*\d+\s*', '', text)
clean = re.sub(r'=== PAGE \d+ ===', '', clean)

q_blocks = re.split(r'QUESTION\s+(\d+)', clean)

DOMAINS = {
    "INFRASTRUCTURE": "1. Network Infrastructures (Topologies, WAN, LAN, Wireless)",
    "HARDWARE": "2. Network Hardware (Switches, Routers, Media, Connectors)",
    "PROTOCOLS": "3. Protocols & Services (OSI Model, IPv4, IPv6, Subnetting, TCP/UDP)",
    "SECURITY": "4. Network Security (Firewalls, DMZ, VPN, IPSec)",
    "TROUBLESHOOTING": "5. Network Troubleshooting & Utilities (CLI, ping, tracert, ipconfig)"
}

def guess_domain(q_text):
    ql = q_text.lower()
    if any(k in ql for k in ['ping', 'tracert', 'ipconfig', 'netstat', 'nbtstat', 'nslookup', 'pathping', 'troubleshoot', 'cannot connect']):
        return DOMAINS["TROUBLESHOOTING"]
    if any(k in ql for k in ['firewall', 'ipsec', 'vpn', 'perimeter', 'dmz', 'security', 'wpa', 'wep', '802.1x', 'extranet', 'trusted']):
        return DOMAINS["SECURITY"]
    if any(k in ql for k in ['switch', 'router', 'cable', 'fiber', 'cat5', 'cat6', '100baset', '1000baset', 'rj-45', 'connector', 'hub', 'hardware']):
        return DOMAINS["HARDWARE"]
    if any(k in ql for k in ['topology', 'star', 'mesh', 'ring', 'bus', 'wan', 'lan', 'wlan', '802.11', 'wireless', 'vlan', 't1', 't3', 'isdn', 'dsl']):
        return DOMAINS["INFRASTRUCTURE"]
    return DOMAINS["PROTOCOLS"]

# We will write out each question with its parsed options, answer, and comprehensive explanation.
print('Ready to parse and build 176 questions.')
