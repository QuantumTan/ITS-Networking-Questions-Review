import json

with open('part1_questions.json', 'r', encoding='utf-8') as f:
    p1 = json.load(f)

with open('part1_summary.txt', 'w', encoding='utf-8') as f:
    for q in p1:
        opts_str = ' | '.join([o['id'] + ': ' + o['text'].replace('\n', ' ')[:45] for o in q.get('options', [])])
        qnum = q['pdfNumber']
        ans = q['correctAnswer']
        stem = q['question'].replace('\n', ' ')[:80]
        f.write(f"Q{qnum}: Ans={ans} | {stem}...\n  Options: {opts_str}\n\n")

print("Wrote part1_summary.txt")
