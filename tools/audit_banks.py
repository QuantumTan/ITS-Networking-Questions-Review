import json

with open('part1_questions.json', 'r', encoding='utf-8') as f:
    p1 = json.load(f)
with open('part2_questions.json', 'r', encoding='utf-8') as f:
    p2 = json.load(f)
with open('part3_questions.json', 'r', encoding='utf-8') as f:
    p3 = json.load(f)

def audit_bank(name, bank):
    print(f"\n==========================================")
    print(f"=== Auditing {name} ({len(bank)} questions) ===")
    print(f"==========================================")
    issues = []
    for i, q in enumerate(bank):
        qnum = q.get('pdfNumber', i+1)
        qtype = q.get('type')
        qstem = q.get('question', '')
        ans = q.get('correctAnswer')
        opts = q.get('options', [])

        if qtype == 'single-choice':
            opt_ids = [o['id'] for o in opts]
            if not ans or ans not in opt_ids:
                issues.append((qnum, f"Single-choice answer {ans} not in options {opt_ids}"))
        elif qtype in ('multi-choice', 'multiple-choice'):
            opt_ids = [o['id'] for o in opts]
            if not isinstance(ans, list) or len(ans) == 0:
                issues.append((qnum, f"Multi-choice answer {ans} is not a valid list"))
            else:
                for a in ans:
                    if a not in opt_ids:
                        issues.append((qnum, f"Multi-choice answer item {a} not in {opt_ids}"))
            if 'Choose two' in qstem or 'Choose 2' in qstem:
                if isinstance(ans, list) and len(ans) != 2:
                    issues.append((qnum, f"Prompt says Choose 2, but has {len(ans)} answers: {ans}"))
            if 'Choose three' in qstem or 'Choose 3' in qstem:
                if isinstance(ans, list) and len(ans) != 3:
                    issues.append((qnum, f"Prompt says Choose 3, but has {len(ans)} answers: {ans}"))
        elif qtype == 'drag-and-drop':
            drag_ids = [d['id'] for d in q.get('dragItems', [])]
            for z in q.get('dropZones', []):
                zid = z.get('id')
                cid = z.get('correctItemId')
                if cid not in drag_ids:
                    issues.append((qnum, f"Drop zone {zid} correctItemId '{cid}' not in dragItems {drag_ids}"))
        elif qtype == 'matrix-yes-no':
            for s in q.get('statements', []):
                sid = s.get('id')
                if not s.get('correctAnswer'):
                    issues.append((qnum, f"Matrix statement {sid} has empty correctAnswer"))
        elif qtype == 'dropdown-exhibit':
            for sq in q.get('subQuestions', []):
                sqid = sq.get('id')
                sans = sq.get('correctAnswer')
                sopts = sq.get('options', [])
                if sans not in sopts:
                    issues.append((qnum, f"Subquestion {sqid} correctAnswer '{sans}' not in options {sopts}"))

    print(f"Total issues found: {len(issues)}")
    for qnum, msg in issues:
        print(f"  Q{qnum}: {msg}")
    return issues

i1 = audit_bank('Part 1', p1)
i2 = audit_bank('Part 2', p2)
i3 = audit_bank('Part 3', p3)
