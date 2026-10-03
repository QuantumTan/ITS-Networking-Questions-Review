import re
import json

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Verify bankSelect has part1, part2, part3
assert 'value="part1"' in html
assert 'value="part2"' in html
assert 'value="part3"' in html
print("Verified: bankSelect HTML contains all 3 parts!")

# Verify script is present
scripts = re.findall(r'<script(?:\s+[^>]*)?>([\s\S]*?)</script>', html)
app_script = scripts[-1]
assert 'QUESTION_BANKS' in app_script
assert '"part1":' in app_script
assert '"part2":' in app_script
assert '"part3":' in app_script
print("Verified: QUESTION_BANKS present in bundle with part1, part2, and part3!")

# Load and test with Python
with open('part1_questions.json', 'r', encoding='utf-8') as f:
    p1 = json.load(f)
with open('part2_questions.json', 'r', encoding='utf-8') as f:
    p2 = json.load(f)
with open('part3_questions.json', 'r', encoding='utf-8') as f:
    p3 = json.load(f)

print(f"Bank 1 (Version 20.0): {len(p1)} questions (Q1 to Q{len(p1)})")
print(f"Bank 2 (Version 10.0): {len(p2)} questions (Q1 to Q{len(p2)})")
print(f"Bank 3 (Feb 2023 Update): {len(p3)} questions (Q1 to Q{len(p3)})")

assert len(p1) == 234
assert len(p2) == 176
assert len(p3) == 40
print(f"Total across all 3 banks: {len(p1) + len(p2) + len(p3)} questions!")

# Verify Part 3 Questions 1-40 consecutively numbered
for idx, q in enumerate(p3):
    assert q['pdfNumber'] == idx + 1, f"Part 3 Q{idx+1} mismatch: {q.get('pdfNumber')}"
    assert 'question' in q and len(q['question']) > 5
    assert 'type' in q
    assert 'explanation' in q

print("Verified: All 40 questions in Part 3 are strictly consecutive from 1 to 40 with complete data!")
