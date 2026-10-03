import re
import json

with open('exact_pdf_pages_60_129.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Clean up recurring header/footer artifacts
clean = re.sub(r'Cisco\s+642-457\s*', '', text)
clean = re.sub(r'["“]?Best Material, Great Results["”]?\.\s*www\.certkingdom\.com\s*\d*', '', clean)
clean = re.sub(r'=== PAGE \d+ ===', '', clean)

q_blocks = re.split(r'QUESTION\s+(\d+)', clean)

questions = {}
for i in range(1, len(q_blocks), 2):
    qn = int(q_blocks[i])
    content = q_blocks[i+1].strip()
    questions[qn] = content

print(f"Total questions found: {len(questions)}")

# Let's inspect the questions
for qn in sorted(questions.keys()):
    c = questions[qn]
    has_mcq = bool(re.search(r'(?:^|\n)\s*A\.\s+', c))
    has_ans = bool(re.search(r'Answer:\s*|Correct Answer:\s*', c))
    if not has_mcq or not has_ans:
        first_line = c.split('\n')[0]
        print(f"Q{qn} (mcq={has_mcq}, ans={has_ans}): {first_line}")
