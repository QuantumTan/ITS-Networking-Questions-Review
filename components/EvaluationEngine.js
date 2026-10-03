/**
 * EvaluationEngine.js
 * Answer grading algorithms, scaled score calculations (Pearson VUE 1000-pt scale),
 * domain diagnostic analysis, and explanation drawer rendering with official solution images.
 */

export class EvaluationEngine {
  /**
   * Evaluate an individual question item against candidate user answer.
   * Returns: { isCorrect: boolean, score: number, maxScore: number, details: object }
   */
  static evaluateQuestion(question, answer) {
    if (!question) return { isCorrect: false, score: 0, maxScore: 1, details: {} };

    switch (question.type) {
      case 'single-choice': {
        const isCorrect = Boolean(answer && answer === question.correctAnswer);
        return {
          isCorrect,
          score: isCorrect ? 1 : 0,
          maxScore: 1,
          details: {
            userAnswer: answer,
            correctAnswer: question.correctAnswer
          }
        };
      }

      case 'multi-choice': {
        const correctSet = new Set(Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer]);
        const userList = Array.isArray(answer) ? answer : [];
        const userSet = new Set(userList);

        const isExactMatch = 
          correctSet.size === userSet.size && 
          [...correctSet].every(item => userSet.has(item));

        return {
          isCorrect: isExactMatch,
          score: isExactMatch ? 1 : 0,
          maxScore: 1,
          details: {
            userAnswer: userList,
            correctAnswer: question.correctAnswer
          }
        };
      }

      case 'drag-and-drop': {
        const userObj = answer || {};
        let matches = 0;
        const total = (question.dropZones || []).length;
        const zoneDetails = {};

        (question.dropZones || []).forEach(zone => {
          const userItemId = userObj[zone.id];
          const isZoneCorrect = Boolean(userItemId && userItemId === zone.correctItemId);
          if (isZoneCorrect) matches++;
          zoneDetails[zone.id] = {
            userItemId,
            correctItemId: zone.correctItemId,
            isCorrect: isZoneCorrect
          };
        });

        const isAllCorrect = total > 0 && matches === total;
        return {
          isCorrect: isAllCorrect,
          score: isAllCorrect ? 1 : (total > 0 ? matches / total : 0),
          maxScore: 1,
          details: {
            matches,
            total,
            zoneDetails
          }
        };
      }

      case 'matrix-yes-no': {
        const userObj = answer || {};
        let matches = 0;
        const total = (question.statements || []).length;
        const stmtDetails = {};

        (question.statements || []).forEach(stmt => {
          const userVal = userObj[stmt.id];
          const isStmtCorrect = Boolean(userVal && userVal.toLowerCase() === stmt.correctAnswer.toLowerCase());
          if (isStmtCorrect) matches++;
          stmtDetails[stmt.id] = {
            userVal,
            correctVal: stmt.correctAnswer,
            isCorrect: isStmtCorrect
          };
        });

        const isAllCorrect = total > 0 && matches === total;
        return {
          isCorrect: isAllCorrect,
          score: isAllCorrect ? 1 : (total > 0 ? matches / total : 0),
          maxScore: 1,
          details: {
            matches,
            total,
            stmtDetails
          }
        };
      }

      case 'dropdown-exhibit': {
        const userObj = answer || {};
        let matches = 0;
        const total = (question.subQuestions || []).length;
        const subDetails = {};

        (question.subQuestions || []).forEach(sub => {
          const userVal = userObj[sub.id];
          const isSubCorrect = Boolean(userVal && userVal.trim().toLowerCase() === sub.correctAnswer.trim().toLowerCase());
          if (isSubCorrect) matches++;
          subDetails[sub.id] = {
            userVal,
            correctVal: sub.correctAnswer,
            isCorrect: isSubCorrect
          };
        });

        const isAllCorrect = total > 0 && matches === total;
        return {
          isCorrect: isAllCorrect,
          score: isAllCorrect ? 1 : (total > 0 ? matches / total : 0),
          maxScore: 1,
          details: {
            matches,
            total,
            subDetails
          }
        };
      }

      default:
        return { isCorrect: false, score: 0, maxScore: 1, details: {} };
    }
  }

  /**
   * Calculates overall exam results including 1000-point scaled score and domain breakdown.
   */
  static calculateExamResults(questions, userAnswers) {
    let totalQuestions = questions.length;
    let earnedRawScore = 0;
    let correctCount = 0;
    let answeredCount = 0;

    const domainStats = {};

    questions.forEach(q => {
      const ans = userAnswers[q.id];
      const isAnswered = ans !== undefined && ans !== null && (
        typeof ans === 'object' ? Object.keys(ans).length > 0 : String(ans).trim() !== ''
      );

      if (isAnswered) answeredCount++;

      const evalResult = this.evaluateQuestion(q, ans);
      if (evalResult.isCorrect) correctCount++;
      earnedRawScore += evalResult.score;

      const domName = q.domain || "General Networking";
      if (!domainStats[domName]) {
        domainStats[domName] = { total: 0, correct: 0, score: 0 };
      }
      domainStats[domName].total += 1;
      if (evalResult.isCorrect) domainStats[domName].correct += 1;
      domainStats[domName].score += evalResult.score;
    });

    const percentage = totalQuestions > 0 ? Math.round((earnedRawScore / totalQuestions) * 100) : 0;
    const scaledScore = Math.round(300 + (percentage / 100) * 700);
    const isPassing = scaledScore >= 700;

    const domainBreakdown = Object.entries(domainStats).map(([name, data]) => {
      const pct = Math.round((data.score / data.total) * 100);
      return {
        domain: name,
        total: data.total,
        correct: data.correct,
        percentage: pct,
        status: pct >= 70 ? 'Proficient' : 'Needs Review'
      };
    });

    return {
      totalQuestions,
      answeredCount,
      unansweredCount: totalQuestions - answeredCount,
      correctCount,
      rawScore: earnedRawScore,
      percentage,
      scaledScore,
      isPassing,
      domainBreakdown
    };
  }

  /**
   * Render rich HTML explanation drawer content with official exam solution images.
   */
  static renderExplanationHtml(question, evalResult) {
    const isCorrect = evalResult.isCorrect;
    const verdictClass = isCorrect ? 'verdict-correct' : 'verdict-incorrect';
    const verdictLabel = isCorrect ? 'Correct' : 'Incorrect';
    const verdictIcon = isCorrect ? '&#10004;' : '&#10008;';

    let itemBreakdownHtml = '';

    // Drag-and-Drop breakdown
    if (question.type === 'drag-and-drop' && question.dropZones) {
      itemBreakdownHtml += `
        <div class="explanation-subgroup">
          <div class="subgroup-title">Matching Matrix Solution:</div>
          <table class="solution-table">
            <thead>
              <tr>
                <th>Target</th>
                <th>Correct Assigned Option</th>
              </tr>
            </thead>
            <tbody>
              ${question.dropZones.map(zone => {
                const item = (question.dragItems || []).find(i => i.id === zone.correctItemId);
                return `
                  <tr>
                    <td><strong>${zone.label}</strong></td>
                    <td class="text-correct">${item ? item.label : zone.correctItemId}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    // Matrix Yes/No breakdown
    if (question.type === 'matrix-yes-no' && question.statements) {
      itemBreakdownHtml += `
        <div class="explanation-subgroup">
          <div class="subgroup-title">Statement Evaluation:</div>
          <table class="solution-table">
            <thead>
              <tr>
                <th>Statement</th>
                <th>Correct Answer</th>
              </tr>
            </thead>
            <tbody>
              ${question.statements.map(stmt => `
                <tr>
                  <td>${stmt.text}</td>
                  <td><span class="badge-${stmt.correctAnswer.toLowerCase()}">${stmt.correctAnswer}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    // Dropdown Exhibit breakdown
    if (question.type === 'dropdown-exhibit' && question.subQuestions) {
      itemBreakdownHtml += `
        <div class="explanation-subgroup">
          <div class="subgroup-title">Correct Dropdown Completions:</div>
          <ul class="solution-list">
            ${question.subQuestions.map(sub => `
              <li><strong>${sub.prompt}</strong> <span class="highlight-val">${sub.correctAnswer}</span></li>
            `).join('')}
          </ul>
        </div>
      `;
    }

    // Official Exam Solution Image Graphic
    let solutionImageHtml = '';
    if (question.imageSolution) {
      const solSrc = question.imageSolution.data || question.imageSolution.file;
      solutionImageHtml = `
        <div class="explanation-subgroup">
          <div class="subgroup-title">&#128247; Official Exam Dump Solution Graphic:</div>
          <div class="exam-solution-image-container">
            <img src="${solSrc}" alt="Official Exam Solution Graphic" class="exam-solution-image" />
            <div class="image-caption-bar">
              <span>&#9432; Official answer key verification scan from Microsoft MTA 98-366 exam</span>
            </div>
          </div>
        </div>
      `;
    }

    // Distractor analysis if present
    let distractorsHtml = '';
    if (question.distractors && Object.keys(question.distractors).length > 0) {
      distractorsHtml = `
        <div class="explanation-subgroup">
          <div class="subgroup-title">Why Other Options Are Incorrect:</div>
          <ul class="distractor-list">
            ${Object.entries(question.distractors).map(([opt, reason]) => `
              <li><span class="distractor-key">${opt}</span>: ${reason}</li>
            `).join('')}
          </ul>
        </div>
      `;
    }

    return `
      <div class="explanation-container ${verdictClass}">
        <div class="explanation-header">
          <div class="verdict-banner">
            <span class="verdict-icon">${verdictIcon}</span>
            <span class="verdict-text">${verdictLabel}</span>
          </div>
          <div class="domain-tag">
            <span class="tag-label">Exam Domain:</span>
            <span class="tag-value">${question.domain}</span>
          </div>
        </div>

        <div class="explanation-body">
          <div class="rationale-section">
            <div class="section-heading">&#9733; Technical Rationale & RFC Reference</div>
            <p class="rationale-text">${question.explanation}</p>
          </div>

          ${solutionImageHtml}
          ${itemBreakdownHtml}
          ${distractorsHtml}
        </div>
      </div>
    `;
  }
}
