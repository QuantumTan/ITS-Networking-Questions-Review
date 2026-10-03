import json

with open('questions.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

p2_lines = lines[6859:12635]
p2_text = ''.join(p2_lines).strip()
if p2_text.startswith('"part2":'):
    p2_text = p2_text[len('"part2":'):].strip()

p2_json = json.loads(p2_text)
print('Loaded part2 questions:', len(p2_json))
with open('part2_questions.json', 'w', encoding='utf-8') as out:
    json.dump(p2_json, out, indent=2)
print('Saved part2_questions.json successfully.')
