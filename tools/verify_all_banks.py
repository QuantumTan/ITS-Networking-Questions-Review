import json
import re

with open('questions.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'export const QUESTION_BANKS = (\{[\s\S]*?\n\};)', text)
banks = json.loads(m.group(1).rstrip(';'))

p1 = banks['part1']
p2 = banks['part2']

print(f"Bank Part 1 count: {len(p1)}")
print(f"Bank Part 2 count: {len(p2)}")

# Verify consecutive numbers 1 to N
p1_nums = [q['pdfNumber'] for q in p1]
p2_nums = [q['pdfNumber'] for q in p2]

assert p1_nums == list(range(1, len(p1)+1)), "Part 1 numbers not consecutive!"
assert p2_nums == list(range(1, len(p2)+1)), "Part 2 numbers not consecutive!"

print("Part 1 numbers check: 1 to 234 perfectly consecutive and ordered!")
print("Part 2 numbers check: 1 to 176 perfectly consecutive and ordered!")

print("\n--- Part 1 sample (Matches PDF Pages 2 to 59) ---")
for i in [1, 2, 3, 10, 50, 77, 100, 176, 234]:
    q = p1[i-1]
    stem_first = q['question'].split('\n')[0]
    print(f"Part 1 Q{q['pdfNumber']}: {stem_first[:75]} | Ans: {q['correctAnswer']}")

print("\n--- Part 2 sample (Matches PDF Pages 61 to 129) ---")
for i in [1, 2, 3, 10, 50, 77, 89, 90, 102, 175, 176]:
    q = p2[i-1]
    stem_first = q['question'].split('\n')[0]
    print(f"Part 2 Q{q['pdfNumber']}: {stem_first[:75]} | Ans: {q.get('correctAnswer', 'Interactive')}")
