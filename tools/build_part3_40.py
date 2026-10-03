import json

DOMAINS = {
    "INFRASTRUCTURE": "1. Network Infrastructures (Topologies, WAN, LAN, Wireless)",
    "HARDWARE": "2. Network Hardware (Switches, Routers, Media, Connectors)",
    "PROTOCOLS": "3. Protocols & Services (OSI Model, IPv4, IPv6, Subnetting, TCP/UDP)",
    "SECURITY": "4. Network Security (Firewalls, DMZ, VPN, IPSec)",
    "TROUBLESHOOTING": "5. Network Troubleshooting & Utilities (CLI, ping, tracert, ipconfig)"
}

part3_questions = [
    {
        "id": "p3_q1",
        "number": 1,
        "domain": DOMAINS["PROTOCOLS"],
        "type": "dnd",
        "question": "Move the appropriate address type from the list on the left to its range on the right.\nNot all address types will be used.\nNote: You will receive partial credit for each correct answer.",
        "dragItems": [
            {"id": "drag_1", "text": "Lookback addresses"},
            {"id": "drag_2", "text": "Multicast addresses"},
            {"id": "drag_3", "text": "Private network addresses"},
            {"id": "drag_4", "text": "Public network addresses"}
        ],
        "dropTargets": [
            {"id": "target_1", "label": "127.0.0.0 - 127.255.255.255", "correct": "Lookback addresses"},
            {"id": "target_2", "label": "192.168.0.0 - 192.168.255.255", "correct": "Private network addresses"},
            {"id": "target_3", "label": "224.0.0.0 - 239.255.255.255", "correct": "Multicast addresses"}
        ],
        "answer": {
            "target_1": "Lookback addresses",
            "target_2": "Private network addresses",
            "target_3": "Multicast addresses"
        },
        "explanation": "• 127.0.0.0 – 127.255.255.255: Reserved for IPv4 loopback (Lookback) functionality.\n• 192.168.0.0 – 192.168.255.255: Private network address block (RFC 1918 16-bit block).\n• 224.0.0.0 – 239.255.255.255: Class D reserved for Multicast addresses."
    },
    {
        "id": "p3_q2",
        "number": 2,
        "domain": DOMAINS["SECURITY"],
        "type": "dnd",
        "question": "Move each VPN term from the list on the left to its definition on right.\nNote: You will receive partial credit for each correct answer.",
        "dragItems": [
            {"id": "drag_1", "text": "SSL VPN"},
            {"id": "drag_2", "text": "Layer 2 Tunneling Protocol"},
            {"id": "drag_3", "text": "Site-to-Site VPN"}
        ],
        "dropTargets": [
            {"id": "target_1", "label": "Allows a remote user to connect to a private network from anywhere on the Internet.", "correct": "SSL VPN"},
            {"id": "target_2", "label": "Securely connects two portions of a private network or two private networks.", "correct": "Site-to-Site VPN"},
            {"id": "target_3", "label": "Creates an unencrypted connection between two devices.", "correct": "Layer 2 Tunneling Protocol"}
        ],
        "answer": {
            "target_1": "SSL VPN",
            "target_2": "Site-to-Site VPN",
            "target_3": "Layer 2 Tunneling Protocol"
        },
        "explanation": "• SSL VPN: Enables remote users to connect securely to corporate resources using a standard web browser without dedicated VPN software.\n• Site-to-Site VPN: Permanently interconnects two distinct physical sites or offices across the public Internet.\n• Layer 2 Tunneling Protocol (L2TP): A tunneling protocol that creates a tunnel without native encryption capabilities (typically paired with IPsec for encryption)."
    },
    {
        "id": "p3_q3",
        "number": 3,
        "domain": DOMAINS["TROUBLESHOOTING"],
        "type": "single-choice",
        "question": "On a Windows computer, which utility should you use to determine if your Domain Name System (DNS) service is properly resolving fully qualified domain names (FQDNs) to IP addresses?",
        "options": [
            {"key": "A", "text": "ipconfig"},
            {"key": "B", "text": "nslookup"},
            {"key": "C", "text": "netstat"},
            {"key": "D", "text": "nbtstat"}
        ],
        "answer": ["B"],
        "explanation": "nslookup (Name Server Lookup) is the dedicated Windows diagnostic tool used to test and query DNS servers to resolve FQDNs to IP addresses."
    },
    {
        "id": "p3_q4",
        "number": 4,
        "domain": DOMAINS["PROTOCOLS"],
        "type": "dnd",
        "question": "Move each IP address from the list on the left to its IPv4 address class on the right.\nNote: You will receive partial credit for each correct answer",
        "dragItems": [
            {"id": "drag_1", "text": "133.234.23.2"},
            {"id": "drag_2", "text": "224.100.20.3"},
            {"id": "drag_3", "text": "201.111.22.3"},
            {"id": "drag_4", "text": "64.123.12.1"}
        ],
        "dropTargets": [
            {"id": "target_1", "label": "Class A", "correct": "64.123.12.1"},
            {"id": "target_2", "label": "Class B", "correct": "133.234.23.2"},
            {"id": "target_3", "label": "Class C", "correct": "201.111.22.3"},
            {"id": "target_4", "label": "Class D", "correct": "224.100.20.3"}
        ],
        "answer": {
            "target_1": "64.123.12.1",
            "target_2": "133.234.23.2",
            "target_3": "201.111.22.3",
            "target_4": "224.100.20.3"
        },
        "explanation": "• Class A: 1 – 126 (64.123.12.1)\n• Class B: 128 – 191 (133.234.23.2)\n• Class C: 192 – 223 (201.111.22.3)\n• Class D: 224 – 239 (224.100.20.3, Multicast)"
    },
    {
        "id": "p3_q5",
        "number": 5,
        "domain": DOMAINS["HARDWARE"],
        "type": "single-choice",
        "question": "Which media type is least susceptible to external interference, including EMI and RFI?",
        "options": [
            {"key": "A", "text": "fiber optic"},
            {"key": "B", "text": "STP"},
            {"key": "C", "text": "UTP"},
            {"key": "D", "text": "Wireless"}
        ],
        "answer": ["A"],
        "explanation": "Fiber optic cabling transmits light pulses through glass or plastic fibers rather than electrical currents over copper wire, rendering it completely immune to Electromagnetic Interference (EMI) and Radio Frequency Interference (RFI)."
    },
    {
        "id": "p3_q6",
        "number": 6,
        "domain": DOMAINS["TROUBLESHOOTING"],
        "type": "multiple-choice",
        "question": "You are a network administrator at a small business. One morning at the start of business, you realize that no employees at the company can access external websites. However, all employees can access intranet sites. All computers are on the same intranet connected by a single router.\nYou need to troubleshoot the problem.\n\nWhich two actions should you complete? (Choose 2.)",
        "options": [
            {"key": "A", "text": "Check the router for proper physical connectivity."},
            {"key": "B", "text": "Check that each computer has a valid IP address."},
            {"key": "C", "text": "Connect the Internet Service Provider"},
            {"key": "D", "text": "Check for bad network adapters on individual computers."}
        ],
        "answer": ["A", "C"],
        "explanation": "Because all employees can reach the local intranet, each computer has a functioning network adapter and valid internal IP address. The inability to reach external websites isolates the fault to the router's connection to the outside world or an outage at the Internet Service Provider."
    },
    {
        "id": "p3_q7",
        "number": 7,
        "domain": DOMAINS["HARDWARE"],
        "type": "multiple-choice",
        "question": "A computer is connected to a switch via a network patch panel using copper cable. The computer is getting lower than expected data speeds.\n\nWhich two actions should you perform to identify the issue? (Choose 2.)\nNote: You will receive partial credit for each correct selection.",
        "options": [
            {"key": "A", "text": "Use an optical time domain reflectometer (OTDR) to test the line."},
            {"key": "B", "text": "Search for broken wires in your cable using a cable tester."},
            {"key": "C", "text": "To the line from Unit A to Unit B"},
            {"key": "D", "text": "Test the data speed of the cable."}
        ],
        "answer": ["B", "D"],
        "explanation": "To troubleshoot slow copper network cabling, use a cable tester to check for broken conductors, split pairs, or incorrect pinouts, and test the cable's data transmission speed and throughput capabilities. OTDR is only used for optical fiber."
    },
    {
        "id": "p3_q8",
        "number": 8,
        "domain": DOMAINS["TROUBLESHOOTING"],
        "type": "single-choice",
        "question": "You ping a server by using the fully qualified domain name (FQDN) and do not receive a response. You then ping the same server by using its IP address and receive a response.\nwhy do you receive a response on the second attempt but on the first attempt?",
        "options": [
            {"key": "A", "text": "The DNS is not resolving."},
            {"key": "B", "text": "NSLOOKUP is stopped."},
            {"key": "C", "text": "The DHCP server is offline."},
            {"key": "D", "text": "PING is improperly configured"}
        ],
        "answer": ["A"],
        "explanation": "A successful ping by IP proves that physical and network routing pathways to the server are functional. Failing to ping by FQDN indicates that the DNS server failed to resolve the name to its corresponding IP address."
    },
    {
        "id": "p3_q9",
        "number": 9,
        "domain": DOMAINS["INFRASTRUCTURE"],
        "type": "multiple-choice",
        "question": "What are two characteristics of a mesh network topology? (Choose 2.)",
        "options": [
            {"key": "A", "text": "It requires less cabling than either a star or ring topology."},
            {"key": "B", "text": "It is fault tolerant because of redundant connections."},
            {"key": "C", "text": "It works best for networks with a large number of nodes."},
            {"key": "D", "text": "Every node connects to every other node on the network"}
        ],
        "answer": ["B", "D"],
        "explanation": "In a full mesh topology, every node connects directly to every other node, providing maximum fault tolerance and redundancy at the cost of high cabling density."
    },
    {
        "id": "p3_q10",
        "number": 10,
        "domain": DOMAINS["TROUBLESHOOTING"],
        "type": "multiple-choice",
        "question": "You are a network administrator at a small business. An employee is not able to access any websites. No other employees are having this problem. All computers are on the same internet.\nYou need to troubleshoot the problem.\nWhich three actions should you complete? (Choose 3.)",
        "options": [
            {"key": "A", "text": "Check the DNS settings on the employee's computer."},
            {"key": "B", "text": "Determine whether the employee's computer has a valid IP address."},
            {"key": "C", "text": "Connect the internet Service Provider"},
            {"key": "D", "text": "Check to see if the router is working properly."},
            {"key": "E", "text": "Ensure that the router has a connection to the internet"}
        ],
        "answer": ["A", "B", "D"],
        "explanation": "Because the issue only affects a single workstation while other users browse normally, the ISP and general router internet connectivity are functional. Troubleshooting should start at the workstation level (valid IP address and DNS configuration) and verify router reachability from that machine."
    },
    {
        "id": "p3_q11",
        "number": 11,
        "domain": DOMAINS["INFRASTRUCTURE"],
        "type": "single-choice",
        "question": "An organization needs to move its infrastructure completely off-premises.\nWhere should they locate their data center?",
        "options": [
            {"key": "A", "text": "A public cloud"},
            {"key": "B", "text": "A private cloud"},
            {"key": "C", "text": "A virtual machine"},
            {"key": "D", "text": "A hybrid cloud"}
        ],
        "answer": ["A"],
        "explanation": "A public cloud (such as Microsoft Azure or AWS) hosts computing and storage infrastructure completely off-premises at third-party hyper-scale data centers."
    },
    {
        "id": "p3_q12",
        "number": 12,
        "domain": DOMAINS["PROTOCOLS"],
        "type": "single-choice",
        "question": "You work for a small office with 15 computers. Your local ISO provides you with a single public IP address. You need to enable Internet access for all 15 computers.\nWhich routing function should you enable?",
        "options": [
            {"key": "A", "text": "RIP"},
            {"key": "B", "text": "Static routing"},
            {"key": "C", "text": "Port forwarding (PAT)"},
            {"key": "D", "text": "NAT"}
        ],
        "answer": ["D"],
        "explanation": "Network Address Translation (NAT), typically implemented as Port Address Translation (PAT/NAT overload), enables multiple private IP hosts to share a single public routable IP address for outbound Internet access."
    },
    {
        "id": "p3_q13",
        "number": 13,
        "domain": DOMAINS["INFRASTRUCTURE"],
        "type": "multiple-choice",
        "question": "What are two characteristics of VLANS (Choose 2.)",
        "options": [
            {"key": "A", "text": "A VLAN can logically address packets by using IP."},
            {"key": "B", "text": "A single switch can service only a single VLAN."},
            {"key": "C", "text": "VLANs act as though they are on the same LAN regardless of physical location"},
            {"key": "D", "text": "A VLAN compartmentalizes a network and isolates traffic"}
        ],
        "answer": ["C", "D"],
        "explanation": "VLANs group devices logically into separate broadcast domains regardless of physical switch port location and isolate traffic to improve security and reduce broadcast congestion."
    },
    {
        "id": "p3_q14",
        "number": 14,
        "domain": DOMAINS["HARDWARE"],
        "type": "single-choice",
        "question": "How is a router's static routing table updated?",
        "options": [
            {"key": "A", "text": "through direct action by the network administrator"},
            {"key": "B", "text": "from the RIP protocol after resetting the router"},
            {"key": "C", "text": "with updates from the physically nearest routers"},
            {"key": "D", "text": "bt monitoring adjacent subnets"}
        ],
        "answer": ["A"],
        "explanation": "Static routing tables do not adapt dynamically to topological changes; they require manual entry and modification through direct administrative configuration."
    },
    {
        "id": "p3_q15",
        "number": 15,
        "domain": DOMAINS["INFRASTRUCTURE"],
        "type": "matrix",
        "question": "For each statement about wide area networks (WAN), select True or False.\nNote: You will receive partial credit for each correct selection.",
        "matrixRows": [
            "The Internet is a wide area network (WAN)",
            "An internet is a wide area network (WAN)",
            "Companies with offices in multiple cities use a wide area network (WAN) you share data."
        ],
        "matrixColumns": ["True", "False"],
        "answer": {
            "The Internet is a wide area network (WAN)": "True",
            "An internet is a wide area network (WAN)": "False",
            "Companies with offices in multiple cities use a wide area network (WAN) you share data.": "True"
        },
        "explanation": "• The global Internet is the most prominent WAN.\n• A lowercase 'internet' refers to any interconnected networks, which may simply be local LANs connected together.\n• Organizations with offices in multiple cities use WAN technology (such as MPLS or VPNs) to share data across wide geographic areas."
    },
    {
        "id": "p3_q16",
        "number": 16,
        "domain": DOMAINS["TROUBLESHOOTING"],
        "type": "single-choice",
        "question": "Complete the sentence by selecting the correct option from the drop-down list.\n\nAnswer Area\nThe command-line tool used in Linux to list a host's active incoming connections is.",
        "options": [
            {"key": "A", "text": "Ip addr"},
            {"key": "B", "text": "host"},
            {"key": "C", "text": "netstat"},
            {"key": "D", "text": "dig"}
        ],
        "answer": ["C"],
        "explanation": "netstat (network statistics) is the standard Linux/Windows command-line utility for displaying active incoming and outgoing network sockets and listening ports."
    },
    {
        "id": "p3_q17",
        "number": 17,
        "domain": DOMAINS["HARDWARE"],
        "type": "single-choice",
        "question": "The network connection between Building A and Building B is 550 meters and there is insertion loss on the line. Which tool should you use to test this attenuation?",
        "options": [
            {"key": "A", "text": "Toner"},
            {"key": "B", "text": "Time domain reflectometer"},
            {"key": "C", "text": "Optical time domain reflectometer"},
            {"key": "D", "text": "Multimeter"}
        ],
        "answer": ["C"],
        "explanation": "A 550m inter-building run exceeds copper limits (100m) and uses fiber optic cable. An Optical Time Domain Reflectometer (OTDR) is designed to evaluate attenuation, insertion loss, and faults in optical fiber."
    },
    {
        "id": "p3_q18",
        "number": 18,
        "domain": DOMAINS["INFRASTRUCTURE"],
        "type": "single-choice",
        "question": "Complete the sentence by selecting the correct option from the drop-down list_\nAnswer Area\nOn a wireless router, an SSID is the",
        "options": [
            {"key": "A", "text": "default Administrator account"},
            {"key": "B", "text": "Broadcast ID"},
            {"key": "C", "text": "WAN encryption protocol"},
            {"key": "D", "text": "default communication protocol"}
        ],
        "answer": ["B"],
        "explanation": "The SSID (Service Set Identifier) functions as the broadcast ID/name of the Wi-Fi network that wireless clients see when searching for available connections."
    },
    {
        "id": "p3_q19",
        "number": 19,
        "domain": DOMAINS["INFRASTRUCTURE"],
        "type": "matrix",
        "question": "For each statement about hypervisors, select True or False.\nNote: You will receive partial credit for each correct selection.",
        "matrixRows": [
            "A Type 1 hypervisor runs directly on system hardware.",
            "A Type 2 hypervisor runs directly on system hardware.",
            "A Type 1 hypervisor is also known as a hare-metal hypervisor."
        ],
        "matrixColumns": ["True", "False"],
        "answer": {
            "A Type 1 hypervisor runs directly on system hardware.": "True",
            "A Type 2 hypervisor runs directly on system hardware.": "False",
            "A Type 1 hypervisor is also known as a hare-metal hypervisor.": "True"
        },
        "explanation": "• Type 1 hypervisors (bare-metal) install and run directly on physical hardware.\n• Type 2 hypervisors execute on top of an existing host operating system (False).\n• Type 1 is also called bare-metal (noted as 'hare-metal' in the source text)."
    },
    {
        "id": "p3_q20",
        "number": 20,
        "domain": DOMAINS["SECURITY"],
        "type": "single-choice",
        "question": "What is a VPN?",
        "options": [
            {"key": "A", "text": "A secure private connection over a public network"},
            {"key": "B", "text": "A virtual network within your local area network (LAN)"},
            {"key": "C", "text": "A personal network for your use only"},
            {"key": "D", "text": "A communication tunnel between VLANs"}
        ],
        "answer": ["A"],
        "explanation": "A Virtual Private Network (VPN) creates an encrypted, authenticated tunnel that allows secure transmission of private data over untrusted public networks such as the Internet."
    },
    {
        "id": "p3_q21",
        "number": 21,
        "domain": DOMAINS["INFRASTRUCTURE"],
        "type": "matrix",
        "question": "For each statement about client-server networks, select True or False.\nNote: You will receive partial credit for each correct selection.",
        "matrixRows": [
            "A client-server network has centralized administration.",
            "A client-server network requires each computer to share its resources",
            "A client-server network requires users to have a user account on every computer they need to use."
        ],
        "matrixColumns": ["True", "False"],
        "answer": {
            "A client-server network has centralized administration.": "True",
            "A client-server network requires each computer to share its resources": "False",
            "A client-server network requires users to have a user account on every computer they need to use.": "False"
        },
        "explanation": "• Client-server architectures centralize administrative management, directory services, and security policies on dedicated servers.\n• Computers act as clients accessing centralized server resources, rather than every node sharing its local disks (which describes peer-to-peer).\n• Centralized authentication (e.g. Active Directory) allows users to log on to any domain workstation with a single centralized account."
    },
    {
        "id": "p3_q22",
        "number": 22,
        "domain": DOMAINS["TROUBLESHOOTING"],
        "type": "dropdown",
        "question": "You are trying to access a music sharing service on the Internet. The service is located at the IP address 173.194.75.105. You are experiencing problems connecting. You run a trace route to the server and receive the output shown in the image.\nEvaluate the image and complete the statements by selecting the correct options from the drop-down lists.\n\nNote: You will receive partial credit for each correct selection.",
        "exhibit": {
            "type": "cli",
            "title": "Command Prompt - tracert -d 173.194.75.105",
            "command": "tracert -d 173.194.75.105",
            "content": "command Prompt\r\nc:\\> tracert -d 173.194.75.105\r\nracing route to 173.194.75.105 over a maximum of 30 hops\r\n1   <1 ms   <1 ms   <1 ms  10.0.0.1\r\n2   25 ms   29 ms   29 ms  174.57.168.1\r\n3    9 ms    9 ms    9 ms  68.85.76.249\r\n4   10 ms    9 ms    9 ms  68.86.210.25\r\n5   14 ms   15 ms   18 ms  68.86.92.161\r\n6   15 ms   16 ms   13 ms  68.86.86.142\r\n7   14 ms   14 ms   14 ms  75.149.231.62\r\n8   14 ms   15 ms   15 ms  209.85.252.80\r\n9   17 ms   16 ms   17 ms  72.14.236.146\r\n10  27 ms   28 ms   28 ms  209.85.241.222\r\n11  26 ms   25 ms   26 ms  216.239.48.157\r\n12   *       *       *     Request timed out.\r\n13  27 ms   26 ms   25 ms  173.194.75.105"
        },
        "dropdownItems": [
            {
                "id": "dd_1",
                "label": "Each hop in the trace route is a",
                "options": ["Router", "Switch", "Firewall"],
                "correct": "Router"
            },
            {
                "id": "dd_2",
                "label": "The trace route completed.",
                "options": ["Successfully", "Unsuccessfully", "with an unknow status"],
                "correct": "Successfully"
            }
        ],
        "answer": {
            "dd_1": "Router",
            "dd_2": "Successfully"
        },
        "explanation": "• Each hop in a traceroute represents a Layer 3 routing device (Router) decrementing the packet's TTL.\n• Hop 13 reached the destination host 173.194.75.105 in 25-27 ms, indicating the traceroute completed successfully (intermediate timeout at hop 12 simply means that specific router was configured not to respond to ICMP Time Exceeded packets)."
    },
    {
        "id": "p3_q23",
        "number": 23,
        "domain": DOMAINS["HARDWARE"],
        "type": "single-choice",
        "question": "Which type of port is used to support VLAN traffic between two switches?",
        "options": [
            {"key": "A", "text": "LAN port"},
            {"key": "B", "text": "WAN port"},
            {"key": "C", "text": "Trunk port"},
            {"key": "D", "text": "Virtual port"}
        ],
        "answer": ["C"],
        "explanation": "Trunk ports (such as IEEE 802.1Q tagged links) are configured between switches to multiplex and carry Ethernet frames belonging to multiple VLANs across a single physical link."
    },
    {
        "id": "p3_q24",
        "number": 24,
        "domain": DOMAINS["PROTOCOLS"],
        "type": "single-choice",
        "question": "When a client's DHCP-issued address expires, the client will:",
        "options": [
            {"key": "A", "text": "generate a new address valid to the subnet and request approval from the DHCP server."},
            {"key": "B", "text": "disconnect from the network."},
            {"key": "C", "text": "attempt to renew its lease on the address_"},
            {"key": "D", "text": "continue to use the address until it is notified to stop."}
        ],
        "answer": ["B"],
        "explanation": "Clients attempt renewal at 50% and 87.5% of lease time. When a lease reaches 100% and officially expires without renewal, the client is no longer authorized to use that IP address and must cease communications (disconnect from the network) and request a new configuration."
    },
    {
        "id": "p3_q25",
        "number": 25,
        "domain": DOMAINS["PROTOCOLS"],
        "type": "single-choice",
        "question": "Which represents the Internet Protocol version 6 (IPv6) Loopback address?",
        "options": [
            {"key": "A", "text": "FF00::127"},
            {"key": "B", "text": ":1"},
            {"key": "C", "text": "::"},
            {"key": "D", "text": "FE80::127"}
        ],
        "answer": ["B"],
        "explanation": "The standard IPv6 loopback address is 0:0:0:0:0:0:0:1 (compressed as ::1, shown here as :1). :: is the unspecified address, FE80::/10 is link-local, and FF00::/8 is multicast."
    },
    {
        "id": "p3_q26",
        "number": 26,
        "domain": DOMAINS["PROTOCOLS"],
        "type": "single-choice",
        "question": "Complete the sentence by selecting the correct option from the drop-down list_\n\nAnswer Area\nIPv4 multicast addresses range from",
        "options": [
            {"key": "A", "text": "127.0.0.0 to 127.255155.255"},
            {"key": "B", "text": "172.16.0.0 to 172.31.255.255"},
            {"key": "C", "text": "192.168.0.0 to 192.168.255.255"},
            {"key": "D", "text": "224.0.0.0 to 239.255.255.255"}
        ],
        "answer": ["D"],
        "explanation": "Class D IPv4 addresses spanning 224.0.0.0 through 239.255.255.255 are reserved for multicast groups."
    },
    {
        "id": "p3_q27",
        "number": 27,
        "domain": DOMAINS["TROUBLESHOOTING"],
        "type": "single-choice",
        "question": "Your home computer is having problems accessing the Internet You suspect that your Internet router's DHCP service is not functioning, so you check your computer's IP address.\nWhich address indicates that your router's DHCP service is NOT functioning?",
        "options": [
            {"key": "A", "text": "10.19.1.15"},
            {"key": "B", "text": "169.254.1.15"},
            {"key": "C", "text": "192.168.1.15"},
            {"key": "D", "text": "172.16.1.15"}
        ],
        "answer": ["B"],
        "explanation": "An IP address within 169.254.0.1 to 169.254.255.254 is an APIPA (Automatic Private IP Addressing) address, assigned automatically by Windows when no DHCP server answers discovery requests."
    },
    {
        "id": "p3_q28",
        "number": 28,
        "domain": DOMAINS["INFRASTRUCTURE"],
        "type": "dropdown",
        "question": "Complete the sentences by selecting the correct option from each drop-down list.\nNote: You will receive partial credit for each correct selection.\n\nAnswer Area",
        "dropdownItems": [
            {
                "id": "dd_1",
                "label": "A vast computer network linking smaller computer networks worldwide is",
                "options": ["the Internet", "an intranet", "an extranet"],
                "correct": "the Internet"
            },
            {
                "id": "dd_2",
                "label": "A network that allows secure collaboration between a company and a supplier or partner is",
                "options": ["the Internet", "an intranet", "an extranet"],
                "correct": "an extranet"
            },
            {
                "id": "dd_3",
                "label": "A private network that is accessible only to a company's employees is",
                "options": ["the Internet", "an intranet", "an extranet"],
                "correct": "an intranet"
            }
        ],
        "answer": {
            "dd_1": "the Internet",
            "dd_2": "an extranet",
            "dd_3": "an intranet"
        },
        "explanation": "• The Internet: Globally interconnected public network.\n• Extranet: Private network extended securely to authorized business partners and suppliers.\n• Intranet: Internal private network accessible exclusively to employees."
    },
    {
        "id": "p3_q29",
        "number": 29,
        "domain": DOMAINS["HARDWARE"],
        "type": "multiple-choice",
        "question": "Your school network has multiple routers. Students in one of the dorms report that they cannot connect to the email server. You verify that the email server is operational. You suspect that the router on the subnet is causing the problem.\n\nWhich two actions should you perfume? (Choose 2.)",
        "options": [
            {"key": "A", "text": "Enable dynamic routing."},
            {"key": "B", "text": "Look in the router's NAT table."},
            {"key": "C", "text": "Enable multicast."},
            {"key": "D", "text": "Look in the router's routing table."}
        ],
        "answer": ["A", "D"],
        "explanation": "Examining the router's routing table identifies whether a valid path to the email subnet is present. Enabling dynamic routing ensures all routers automatically distribute and learn route updates without manual static intervention."
    },
    {
        "id": "p3_q30",
        "number": 30,
        "domain": DOMAINS["SECURITY"],
        "type": "single-choice",
        "question": "Security is a concern on wireless networks due to:",
        "options": [
            {"key": "A", "text": "frequency modulation issues."},
            {"key": "B", "text": "the potential for crosstalk"},
            {"key": "C", "text": "inability to encrypt transmissions."},
            {"key": "D", "text": "the radio broadcast access method."}
        ],
        "answer": ["D"],
        "explanation": "Because wireless networks broadcast signals openly through radio waves over physical airspace, transmissions can be intercepted by any nearby receiver unless protected by strong encryption."
    },
    {
        "id": "p3_q31",
        "number": 31,
        "domain": DOMAINS["TROUBLESHOOTING"],
        "type": "dropdown",
        "question": "You are studying for finals in the student lounge. When your laptop is connected to the wireless network, access to the Internet is slow When you plug your laptop into a wall jack, you can no longer access the Internet You run the ipconfig tall command. The results are shown in the image.\nEvaluate the image and complete the statements by selecting the correct option from each drop-down list.\nNote: You will receive partial credit for each correct selection.",
        "exhibit": {
            "type": "cli",
            "title": "Windows IP Configuration - ipconfig /all",
            "command": "ipconfig /all",
            "content": "Windows IP Configuration\r\n\r\n   Host Name . . . . . . . . . . . . : Win7Pro\r\n   Primary Dns Suffix  . . . . . . . : \r\n   Node Type . . . . . . . . . . . . : Hybrid\r\n   IP Routing Enabled. . . . . . . . : No\r\n   WINS Proxy Enabled. . . . . . . . : No\r\n   DNS Suffix Search List. . . . . . : domain.local\r\n\r\nWireless LAN adapter Wireless Network Connection:\r\n\r\n   Connection-specific DNS Suffix  . : \r\n   Description . . . . . . . . . . . : Intel(R) WiFi Link 5300 AGN\r\n   Physical Address. . . . . . . . . : 00-21-6A-1F-AA-DA\r\n   DHCP Enabled. . . . . . . . . . . : Yes\r\n   Autoconfiguration Enabled . . . . : Yes\r\n   IPv4 Address. . . . . . . . . . . : 192.168.11.48(Preferred)\r\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\r\n   Lease Obtained. . . . . . . . . . : Friday, May 17, 2013 9:31:02 PM\r\n   Lease Expires . . . . . . . . . . : Saturday, May 18, 2013 9:31:01 PM\r\n   Default Gateway . . . . . . . . . : 192.168.11.1\r\n   DHCP Server . . . . . . . . . . . : 192.168.11.1\r\n   DNS Servers . . . . . . . . . . . : 192.168.11.1\r\n   NetBIOS over Tcpip. . . . . . . . : Enabled\r\n\r\nEthernet adapter Local Area Connection:\r\n\r\n   Connection-specific DNS Suffix  . : domain.local\r\n   Description . . . . . . . . . . . : Intel(R) 82567LM Gigabit Network Connection\r\n   Physical Address. . . . . . . . . : 00-24-81-B3-D4-64\r\n   DHCP Enabled. . . . . . . . . . . : Yes\r\n   Autoconfiguration Enabled . . . . : Yes\r\n   Autoconfiguration IPv4 Address. . : 169.254.143.166(Preferred)\r\n   Subnet Mask . . . . . . . . . . . : 255.255.0.0\r\n   Default Gateway . . . . . . . . . : \r\n   NetBIOS over Tcpip. . . . . . . . : Enabled"
        },
        "dropdownItems": [
            {
                "id": "dd_1",
                "label": "The wireless adapter has an IP address configured.",
                "options": ["manually.", "through DHCP.", "through APIPA."],
                "correct": "through DHCP."
            },
            {
                "id": "dd_2",
                "label": "The Ethernet adapter has an IP address configured.",
                "options": ["manually.", "through DHCP.", "through APIPA."],
                "correct": "through APIPA."
            }
        ],
        "answer": {
            "dd_1": "through DHCP.",
            "dd_2": "through APIPA."
        },
        "explanation": "• Wireless adapter: Shows an IP address of 192.168.11.48 with lease obtained/expires times and DHCP Server listed as 192.168.11.1, indicating configuration through DHCP.\n• Ethernet adapter: Shows an Autoconfiguration IPv4 Address of 169.254.143.166 with no default gateway, which is an APIPA address assigned when DHCP response fails."
    },
    {
        "id": "p3_q32",
        "number": 32,
        "domain": DOMAINS["INFRASTRUCTURE"],
        "type": "single-choice",
        "question": "One reason to incorporate VLANs in a network is to",
        "options": [
            {"key": "A", "text": "increase the number of available IP addresses."},
            {"key": "B", "text": "reduce the number of broadcast domains."},
            {"key": "C", "text": "increase the number of available Media Access Control AC) addresses."},
            {"key": "D", "text": "reduce the number of nodes in a broadcast domain"}
        ],
        "answer": ["D"],
        "explanation": "Subdividing a flat switched network into multiple VLANs fragments a single massive broadcast domain into smaller ones, thereby reducing the number of nodes in any given broadcast domain."
    },
    {
        "id": "p3_q33",
        "number": 33,
        "domain": DOMAINS["SECURITY"],
        "type": "single-choice",
        "question": "Which of the following uses a tunneling protocol to encapsulate data for transmission?",
        "options": [
            {"key": "A", "text": "VLAN"},
            {"key": "B", "text": "Internet"},
            {"key": "C", "text": "NAT"},
            {"key": "D", "text": "VPN"}
        ],
        "answer": ["D"],
        "explanation": "Virtual Private Networks (VPNs) encapsulate data packets inside other carrier protocol packets using tunneling protocols (e.g., L2TP, PPTP, IPsec, OpenVPN) to travel across intermediate networks."
    },
    {
        "id": "p3_q34",
        "number": 34,
        "domain": DOMAINS["PROTOCOLS"],
        "type": "single-choice",
        "question": "Which service uses PTR and A records?",
        "options": [
            {"key": "A", "text": "IDS"},
            {"key": "B", "text": "DNS"},
            {"key": "C", "text": "IPS"},
            {"key": "D", "text": "NAT"}
        ],
        "answer": ["B"],
        "explanation": "DNS (Domain Name System) uses 'A' records to map hostname to IPv4 address and 'PTR' (Pointer) records in reverse lookup zones to map IP address to hostname."
    },
    {
        "id": "p3_q35",
        "number": 35,
        "domain": DOMAINS["HARDWARE"],
        "type": "single-choice",
        "question": "What is a justification for using STP instead of UTP cable to wire a network expansion?",
        "options": [
            {"key": "A", "text": "You are routing cables through an area with high external interference."},
            {"key": "B", "text": "You want to minimize the costs relating to the new installation."},
            {"key": "C", "text": "You need to reduce attenuation."},
            {"key": "D", "text": "You need the cable to be as light and flexible as possible."}
        ],
        "answer": ["A"],
        "explanation": "Shielded Twisted Pair (STP) cable incorporates metallic shielding to protect transmitted signals from electromagnetic interference (EMI) and radio frequency interference (RFI) present in noisy industrial environments."
    },
    {
        "id": "p3_q36",
        "number": 36,
        "domain": DOMAINS["INFRASTRUCTURE"],
        "type": "single-choice",
        "question": "Which physical network topology provides fault tolerant communication by providing redundant communication paths?",
        "options": [
            {"key": "A", "text": "Ring"},
            {"key": "B", "text": "Mesh"},
            {"key": "C", "text": "Bus"},
            {"key": "D", "text": "Star"}
        ],
        "answer": ["B"],
        "explanation": "Mesh topology provides high fault tolerance by interconnecting multiple nodes via redundant paths; failure of any single link simply triggers rerouting over alternate pathways."
    },
    {
        "id": "p3_q37",
        "number": 37,
        "domain": DOMAINS["HARDWARE"],
        "type": "matrix",
        "question": "For each statement about switches, select True or False.\nNote: You will receive partial credit for each correct selection.",
        "matrixRows": [
            "A switch sends unicast frames to one destination port only.",
            "A switch floods ports if it does not know where to send a frame.",
            "A switch sends broadcast frames to the uplink port only."
        ],
        "matrixColumns": ["True", "False"],
        "answer": {
            "A switch sends unicast frames to one destination port only.": "True",
            "A switch floods ports if it does not know where to send a frame.": "True",
            "A switch sends broadcast frames to the uplink port only.": "False"
        },
        "explanation": "• Known unicast frames are forwarded solely to the specific destination switch port.\n• Unknown unicast frames are flooded out all ports in the VLAN except the ingress port.\n• Broadcast frames are flooded to all ports in that broadcast domain (VLAN), not merely the uplink port."
    },
    {
        "id": "p3_q38",
        "number": 38,
        "domain": DOMAINS["PROTOCOLS"],
        "type": "dnd",
        "question": "Move the appropriate protocol from the list on the left to its description on the right.\nNot all protocols will be used.\nNote: You will receive partial credit for each correct answer.",
        "dragItems": [
            {"id": "drag_1", "text": "TCP"},
            {"id": "drag_2", "text": "ICMP"},
            {"id": "drag_3", "text": "ARP"},
            {"id": "drag_4", "text": "UDP"},
            {"id": "drag_5", "text": "IGMP"}
        ],
        "dropTargets": [
            {"id": "target_1", "label": "Connectionless, message-based protocol with best-effort service", "correct": "UDP"},
            {"id": "target_2", "label": "Connection-oriented protocol with guaranteed service", "correct": "TCP"},
            {"id": "target_3", "label": "Resolves a MAC address to an IP address.", "correct": "ARP"}
        ],
        "answer": {
            "target_1": "UDP",
            "target_2": "TCP",
            "target_3": "ARP"
        },
        "explanation": "• UDP: Connectionless, unreliable, best-effort transport protocol.\n• TCP: Connection-oriented transport protocol featuring three-way handshaking and guaranteed delivery.\n• ARP: Address Resolution Protocol maps network layer addresses to MAC addresses."
    },
    {
        "id": "p3_q39",
        "number": 39,
        "domain": DOMAINS["HARDWARE"],
        "type": "single-choice",
        "question": "Complete the sentence by selecting the correct option from the drop-down list.\nAnswer Area",
        "options": [
            {"key": "A", "text": "Static routing  Is fault tolerant."},
            {"key": "B", "text": "Dynamic routing Is fault tolerant."},
            {"key": "C", "text": "The default route Is fault tolerant."},
            {"key": "D", "text": "Least cost routing Is fault tolerant."}
        ],
        "answer": ["B"],
        "explanation": "Dynamic routing protocols dynamically adapt to topology failures and reroute traffic automatically, making dynamic routing fault tolerant."
    },
    {
        "id": "p3_q40",
        "number": 40,
        "domain": DOMAINS["SECURITY"],
        "type": "single-choice",
        "question": "What is the primary purpose of a perimeter network?",
        "options": [
            {"key": "A", "text": "to act as a hidden location in which to deploy network clients."},
            {"key": "B", "text": "to provide a buffer area between a private intranet and the pubic internet"},
            {"key": "C", "text": "to act as a secure location for deploying highly sensitive network servers"},
            {"key": "D", "text": "to monitor traffic between routed subnets in a private LAN"}
        ],
        "answer": ["B"],
        "explanation": "A perimeter network (Demilitarized Zone or DMZ) acts as a physical or logical buffer zone between an untrusted public network (such as the Internet) and a trusted internal corporate network."
    }
]

with open("part3_questions.json", "w", encoding="utf-8") as f:
    json.dump(part3_questions, f, indent=2, ensure_ascii=False)

print(f"Successfully generated part3_questions.json with {len(part3_questions)} questions.")
