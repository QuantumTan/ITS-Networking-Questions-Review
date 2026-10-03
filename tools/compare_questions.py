import json
import re

with open('exact_pdf_pages_60_129.txt', 'r', encoding='utf-8') as f:
    text = f.read()

clean = re.sub(r'Cisco\s+642-457\s*', '', text)
clean = re.sub(r'["“]?Best Material, Great Results["”]?\.\s*www\.certkingdom\.com\s*\d*', '', clean)
clean = re.sub(r'=== PAGE \d+ ===', '', clean)

q_blocks = re.split(r'QUESTION\s+(\d+)', clean)
pdf_q = {}
for i in range(1, len(q_blocks), 2):
    pdf_q[int(q_blocks[i])] = q_blocks[i+1].strip()

with open('questions.js', 'r', encoding='utf-8') as f:
    qjs_content = f.read()

# Extract QUESTIONS json
m = re.search(r'export const QUESTIONS = (\[[\s\S]*?\]);\s*$', qjs_content)
if not m:
    # try without export
    m = re.search(r'QUESTIONS = (\[[\s\S]*?\]);', qjs_content)

qjs = json.loads(m.group(1))
print(f"Loaded {len(qjs)} questions from questions.js")

diffs = []
for item in qjs:
    qid_num = int(item['id'].replace('Q-', ''))
    raw_pdf = pdf_q[qid_num]
    
    # Check if question text is in raw_pdf
    q_text = item['question']
    
    # Normalize whitespaces
    norm_q = ' '.join(q_text.split())
    norm_pdf = ' '.join(raw_pdf.split())
    
    # If standard mcq
    if item['type'] in ['single-choice', 'multi-choice'] and qid_num not in [124, 175]:
        # stem should match raw_pdf
        # let's see how much matches
        first_opt = item['options'][0]['text'] if item.get('options') else ''
        if norm_q not in norm_pdf:
            diffs.append((qid_num, "STEM_DIFF", norm_q[:80], norm_pdf[:80]))
    else:
        # Check interactive question wording
        # Does the question match?
        if norm_q not in norm_pdf:
            diffs.append((qid_num, "INTERACTIVE_STEM_DIFF", norm_q[:80], norm_pdf[:80]))

print(f"Total diffs found: {len(diffs)}")
for qid, dtype, stem, pdf_sub in diffs:
    print(f"Q{qid} [{dtype}]:\n  JS:  {stem}\n  PDF: {pdf_sub}\n")
