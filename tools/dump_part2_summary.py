import json

with open('part2_questions.json', 'r', encoding='utf-8') as f:
    p2 = json.load(f)

with open('part2_summary.txt', 'w', encoding='utf-8') as f:
    for q in p2:
        qnum = q.get('pdfNumber')
        qtype = q.get('type')
        ans = q.get('correctAnswer')
        stem = q.get('question', '').replace('\n', ' ')[:80]
        
        opts_str = ''
        if qtype in ('single-choice', 'multi-choice'):
            opts_str = ' | '.join([o['id'] + ': ' + o['text'].replace('\n', ' ')[:40] for o in q.get('options', [])])
        elif qtype == 'drag-and-drop':
            opts_str = 'DropZones: ' + str([z.get('id') + '->' + str(z.get('correctItemId')) for z in q.get('dropZones', [])])
        elif qtype == 'matrix-yes-no':
            opts_str = 'Statements: ' + str([s.get('id') + '->' + str(s.get('correctAnswer')) for s in q.get('statements', [])])
        elif qtype == 'dropdown-exhibit':
            opts_str = 'Dropdowns: ' + str([sq.get('id') + '->' + str(sq.get('correctAnswer')) for sq in q.get('subQuestions', [])])
            
        f.write(f"Q{qnum} ({qtype}): Ans={ans} | {stem}...\n  Details: {opts_str}\n\n")

print(f"Wrote part2_summary.txt with {len(p2)} questions.")
