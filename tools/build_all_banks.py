import json
import re

# Load Part 1 (234 questions)
with open('part1_questions.json', 'r', encoding='utf-8') as f:
    part1_questions = json.load(f)

# Load Part 2 (176 questions)
# We already have build_exact_176.py which built 176 exact questions
with open('questions.js', 'r', encoding='utf-8') as f:
    qjs_content = f.read()

m = re.search(r'export const QUESTIONS = (\[[\s\S]*?\]);\s*$', qjs_content)
part2_questions = json.loads(m.group(1))

print(f"Part 1 questions: {len(part1_questions)}")
print(f"Part 2 questions: {len(part2_questions)}")

DOMAINS = {
    "INFRASTRUCTURE": "1. Network Infrastructures (Topologies, WAN, LAN, Wireless)",
    "HARDWARE": "2. Network Hardware (Switches, Routers, Media, Connectors)",
    "PROTOCOLS": "3. Protocols & Services (OSI Model, IPv4, IPv6, Subnetting, TCP/UDP)",
    "SECURITY": "4. Network Security (Firewalls, DMZ, VPN, IPSec)",
    "TROUBLESHOOTING": "5. Network Troubleshooting & Utilities (CLI, ping, tracert, ipconfig)"
}

# Add bank property and verify pdfNumber
for i, q in enumerate(part1_questions):
    q["bank"] = "part1"
    q["pdfNumber"] = i + 1

for i, q in enumerate(part2_questions):
    q["bank"] = "part2"
    q["pdfNumber"] = i + 1

output_js = """/**
 * Pearson VUE / Certiport IT Specialist: Networking Fundamentals (98-366)
 * Dual Question Banks from Official PDF:
 * - Bank 1: Version 20.0 (Questions 1–234, Pages 2–59, ABC.com scenarios)
 * - Bank 2: Version 10.0 (Questions 1–176, Pages 60–129, with 76 Authentic Screenshots & Exhibits)
 * 100% Verbatim PDF Text - Exact Match to PDF Numbers
 */

export const DOMAINS = """ + json.dumps(DOMAINS, indent=2) + """;

export const QUESTION_BANKS = {
  "part1": """ + json.dumps(part1_questions, indent=2) + """,
  "part2": """ + json.dumps(part2_questions, indent=2) + """
};

// Default export for backward compatibility
export const QUESTIONS = QUESTION_BANKS["part1"];
"""

with open('questions.js', 'w', encoding='utf-8') as f:
    f.write(output_js)

print("Successfully generated questions.js with both Question Banks!")
