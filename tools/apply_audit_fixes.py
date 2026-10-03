import json

# ==============================================================================
# 1. FIX PART 1
# ==============================================================================
with open('part1_questions.json', 'r', encoding='utf-8') as f:
    p1 = json.load(f)

for q in p1:
    num = q['pdfNumber']

    # Q5: Fix duplicated option A from question stem
    if num == 5:
        q['question'] = (
            "You are employed as a network designer at ABC.com.\n"
            "ABC.com’s network is made up of two network segments, named Subnet A and Subnet B. "
            "DHCP clients are located on Subnet A. A DHCP server, named ABC-SR07, is located on Subnet B.\n"
            "You need to make sure that DHCP clients are able to connect to ABC-SR07.\n"
            "Which of the following actions should you take?"
        )
        q['options'] = [
            {"id": "A", "text": "You should make sure that the RRAS service is configured."},
            {"id": "B", "text": "You should make sure that the Web service is configured."},
            {"id": "C", "text": "You should make sure that the DNS service is configured."},
            {"id": "D", "text": "You should make sure that the DHCP relay agent service is configured."}
        ]
        q['correctAnswer'] = "D"
        q['explanation'] = "DHCP broadcast messages (DHCPDISCOVER) cannot cross routers. A DHCP Relay Agent (or IP helper address) must be configured on the intermediate router to forward DHCP requests between Subnet A and the DHCP server on Subnet B."

    # Q6: FDDI network characteristics
    elif num == 6:
        q['type'] = 'multi-choice'
        q['correctAnswer'] = ["A", "C"]
        q['explanation'] = "• A: Under ANSI/ISO FDDI standards, a single ring cannot exceed a total circumference of 100 kilometers (200 km total for dual-ring).\n• C: Each ring in an FDDI network supports a maximum of 500 connected physical stations (nodes)."

    # Q41: DNS Server Fails (Choose two)
    elif num == 41:
        q['type'] = 'multi-choice'
        q['correctAnswer'] = ["B", "D"]
        q['explanation'] = "• B: When the DNS server fails, host name resolution stops working, so users will not be able to connect to resources using their host names.\n• D: Network routing and IP-level communication remain functional; therefore, users can still ping resources directly using their IP addresses.\n(Note: Brain dumps erroneously listed only C; B and D are the correct answers)."

    # Q45: DHCP characteristics (Choose two)
    elif num == 45:
        q['type'] = 'multi-choice'
        q['correctAnswer'] = ["A", "C"]
        q['explanation'] = "• A: DHCP options (such as option 44/46) provide configuration support for NetBIOS over TCP/IP (WINS servers and NetBT node types).\n• C: DHCP provides automated, reliable IP address configuration for clients while substantially reducing manual administrative overhead.\n(Note: Brain dumps omitted option A; A and C are the correct answers)."

    # Q74: OSI layer verifying error-free data delivery
    elif num == 74:
        q['correctAnswer'] = "D"
        q['explanation'] = "The Transport Layer (Layer 4) is responsible for end-to-end reliable data transfer, flow control, and verifying that messages are delivered error-free, in sequence, and without duplication (e.g., TCP acknowledgments and retransmissions).\n(Note: Older dumps incorrectly marked C Network layer; Transport Layer D is the correct answer according to official Microsoft MTA 98-366 curriculum)."

    # Q117: Signal degradation
    elif num == 117:
        q['correctAnswer'] = "B"
        q['explanation'] = "Attenuation is the technical networking term describing the progressive loss of signal strength as an electrical or optical transmission travels through a physical cable.\n(Note: Some dumps marked A 'Degradation', but B 'Attenuation' is the official technical networking answer)."

    # Q147: Command displaying NetBIOS over TCP/IP statistics
    elif num == 147:
        q['correctAnswer'] = "A"
        q['explanation'] = "nbtstat (NetBIOS over TCP/IP Statistics) is the dedicated Windows command for displaying NetBIOS statistics, local/remote NetBIOS name tables, and the NetBIOS name cache.\n(Note: Dumps contained an error listing B netstat; A nbtstat is 100% correct)."

    # Q191: Point where admin responsibility ends and telco begins
    elif num == 191:
        q['correctAnswer'] = "B"
        q['explanation'] = "The demarcation point (demarc) is the physical point at which the public telecommunications provider's network ends and the customer's on-premise private network begins.\n(Note: Dumps erroneously keyed D 'PAD interface'; B 'demarc' is the universal correct answer)."

    # Q213: Port used by L2TP
    elif num == 213:
        q['correctAnswer'] = "C"
        q['explanation'] = "Layer 2 Tunneling Protocol (L2TP) uses UDP port 1701. (Port 1723 is used by PPTP).\n(Note: Dumps incorrectly keyed B 1723; C 1701 is the correct port for L2TP)."

    # Q225: Router separating DHCP server from clients
    elif num == 225:
        q['correctAnswer'] = "C"
        q['explanation'] = "Because routers block broadcast traffic by default, clients on the opposite side of a router without a DHCP relay agent will be unable to obtain or renew their IP leases from the server (Option C).\n(Note: Dumps incorrectly marked A; C is the correct answer, identical to Part 2 Q78)."

    # Q226: Internal network for an organization
    elif num == 226:
        q['correctAnswer'] = "C"
        q['explanation'] = "An Intranet is a private internal network accessible exclusively to members or employees of an organization.\n(Note: Dumps had an obvious typo keying A Internet; C Intranet is 100% correct)."

with open('part1_questions.json', 'w', encoding='utf-8') as f:
    json.dump(p1, f, indent=2, ensure_ascii=False)
print("Updated part1_questions.json with verified answers!")


# ==============================================================================
# 2. FIX PART 2
# ==============================================================================
with open('part2_questions.json', 'r', encoding='utf-8') as f:
    p2 = json.load(f)

for q in p2:
    num = q.get('pdfNumber')

    # Q87: Minimum cable for 100BaseTX
    if num == 87:
        q['correctAnswer'] = "B"
        q['explanation'] = "100BaseTX (Fast Ethernet) operates at 100 Mbps over two pairs of wires and strictly requires Category 5 (Cat5) or higher UTP cabling. Cat3 is limited to 10 Mbps (or 100BaseT4 which requires 4 pairs).\n(Note: Dumps incorrectly marked A; B Category 5 UTP is the correct answer)."

    # Q88: IKE functions (Choose two)
    elif num == 88:
        q['correctAnswer'] = ["C", "D"]
        q['explanation'] = "Internet Key Exchange (IKE) is the IPsec protocol responsible for: (1) Negotiating security parameters and cryptographic algorithms to use (C), and (2) Exchanging public key material / Diffie-Hellman keys (D).\n(Note: Dumps erroneously printed A, B; C and D are the true IKE functions)."

    # Q94: Authority for a domain DNS record
    elif num == 94:
        q['correctAnswer'] = "D"
        q['explanation'] = "The SOA (Start of Authority) resource record specifies authoritative information for a DNS zone, including the primary name server, domain administrator contact, and serial number.\n(Note: Dumps incorrectly marked B MX; D SOA is 100% correct)."

    # Q98: Transport layer protocol
    elif num == 98:
        q['correctAnswer'] = "C"
        q['explanation'] = "UDP (User Datagram Protocol) and TCP are the primary Transport Layer (Layer 4) protocols in the TCP/IP suite.\n(Note: Dumps had an error marking D ASCII; C UDP is the correct answer)."

    # Q106: Coffee shop perimeter network (Choose two)
    elif num == 106:
        q['correctAnswer'] = ["B", "D"]
        q['explanation'] = "A perimeter network (DMZ) isolates public/external services from private corporate data. The public-facing Web server (B) and the guest customer Wi-Fi network (D) must be placed in the perimeter network to protect internal point-of-sale terminals, file servers, and printers.\n(Note: Dumps incorrectly marked A, B; placing a private network printer in the DMZ is a critical security vulnerability)."

    # Q109: Fiber optic characteristics (Choose two)
    elif num == 109:
        q['correctAnswer'] = ["C", "D"]
        q['explanation'] = "• C: Fiber optic cables support splicing (both fusion splicing and mechanical splicing).\n• D: Optical fibers require specialized polishing (e.g., PC, UPC, APC) for end connectors to ensure proper light transmission.\n(Note: Fiber does NOT conduct electricity; dumps that marked A are physically inaccurate)."

    # Q120: Mandatory components for a LAN node (Choose two)
    elif num == 120:
        q['correctAnswer'] = ["C", "D"]
        q['explanation'] = "To function as a node on a Local Area Network, a device must possess physical network connectivity via a Network Interface Card (NIC - Option C) and a logical host address (IP address - Option D).\n(Note: Dumps incorrectly marked B, E; C and D are the correct answers)."

    # Q133: IPsec reasons (Choose two)
    elif num == 133:
        q['correctAnswer'] = ["B", "D"]
        q['explanation'] = "IPsec provides two primary security protections: Data Integrity (B) to verify packets are not modified in transit, and Data Confidentiality (D) through encryption.\n(Note: Dumps erroneously marked A, B; IPsec does not provide data compression)."

    # Q138: Device associating network address with port
    elif num == 138:
        q['correctAnswer'] = "B"
        q['explanation'] = "A Router operates at Layer 3 and associates network layer (IP) addresses/subnets with specific physical or virtual router interfaces/ports. (Hubs are passive Layer 1 devices with no address awareness).\n(Note: Dumps incorrectly marked C Hub; B Router is the correct answer)."

    # Q142: Ethernet characteristics (Choose three)
    elif num == 142:
        q['correctAnswer'] = ["B", "C", "E"]
        q['explanation'] = "• B: Ethernet supports coaxial cable (10Base2/5), twisted pair (10/100/1000Base-T), and fiber optic media (100Base-FX, 1000Base-SX).\n• C: Ethernet is the dominant LAN standard comprising the largest share of modern networks.\n• E: Ethernet interfaces support auto-negotiation to dynamically agree on speed and duplex.\n(Note: Ethernet uses CSMA/CD, NOT tokens; dumps that marked A are confusing Token Ring with Ethernet)."

    # Q146: Address indicating DHCP failure
    elif num == 146:
        q['correctAnswer'] = "A"
        q['explanation'] = "169.254.1.15 is an Automatic Private IP Addressing (APIPA) address in the 169.254.0.1–169.254.255.254 range, indicating that the computer was unable to contact a DHCP server.\n(Note: Dumps listed 'Answer: B' due to option order confusion; Option A 169.254.1.15 is the correct APIPA address)."

    # Q147: Public address space
    elif num == 147:
        q['correctAnswer'] = "B"
        q['explanation'] = "197.16.0.0/12 is a public routable IP address block. The private address ranges (RFC 1918) are 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.\n(Note: Dumps incorrectly marked D 172.16.0.0/12 which is private; B 197.16.0.0/12 is the only public address space listed)."

    # Q152: CSMA/CD characteristics (Choose two)
    elif num == 152:
        q['correctAnswer'] = ["A", "D"]
        q['explanation'] = "CSMA/CD (Carrier Sense Multiple Access with Collision Detection):\n• D: Carrier Sense: Waits until the transmission medium is idle before transmitting.\n• A: Collision Detection: Monitors the wire during transmission to detect if a collision occurred.\n(Note: Dumps erroneously marked B, C; A and D define CSMA/CD)."

    # Q153: Mesh network characteristics (Choose two)
    elif num == 153:
        q['correctAnswer'] = ["A", "B"]
        q['explanation'] = "• A: Mesh networks are highly fault tolerant due to redundant interconnected links.\n• B: In a full mesh network, every node connects directly to every other node.\n(Note: Mesh is impractical for large networks due to n(n-1)/2 cabling growth; A and B are the correct answers)."

    # Q154: Protocol automatically assigning IP addresses
    elif num == 154:
        q['correctAnswer'] = "B"
        q['explanation'] = "DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses, subnet masks, default gateways, and DNS settings to network clients.\n(Note: Dumps had an obvious typo marking A HTTP; B DHCP is 100% correct)."

    # Q159: Remotely configured switch
    elif num == 159:
        q['correctAnswer'] = "D"
        q['explanation'] = "A Managed Switch allows network administrators to configure settings (such as VLANs, port security, QoS, and SNMP monitoring) remotely via SSH, Telnet, or a web interface.\n(Note: Dumps incorrectly marked A Unmanaged switch; D Managed switch is the correct answer)."

    # Q166: Layer 3 device connecting multiple computers and networks
    elif num == 166:
        q['correctAnswer'] = "D"
        q['explanation'] = "A Router is a Layer 3 (Network Layer) hardware device that forwards data packets between different IP networks and subnets.\n(Note: Dumps absurdly marked A 'Packet' as a device; D Router is the correct answer)."

    # Q167: RIP metric
    elif num == 167:
        q['correctAnswer'] = "C"
        q['explanation'] = "RIP (Routing Information Protocol) uses Hop Count as its sole routing metric, with a maximum of 15 hops (16 represents an unreachable network).\n(Note: Dumps incorrectly marked A Delay; C Hop count is the correct answer)."

    # Q168: Differences between switches and hubs (Choose two)
    elif num == 168:
        q['correctAnswer'] = ["C", "D"]
        q['explanation'] = "• C: Switches support full-duplex transmission (sending and receiving simultaneously), whereas hubs operate in half-duplex.\n• D: Switches inspect destination MAC addresses and forward frames only to the designated port, whereas hubs blindly broadcast to all ports.\n(Note: Dumps marked B, C; B is false because hubs broadcast to all computers, not switches)."

    # Q169: DNS alias record
    elif num == 169:
        q['correctAnswer'] = "B"
        q['explanation'] = "A CNAME (Canonical Name) record creates an alias for an existing 'A' record (e.g., mapping www.example.com to example.com).\n(Note: Dumps incorrectly marked C NS; B CNAME is the correct alias record)."

with open('part2_questions.json', 'w', encoding='utf-8') as f:
    json.dump(p2, f, indent=2, ensure_ascii=False)
print("Updated part2_questions.json with verified answers!")
