/**
 * Pearson VUE ITS Networking (98-366) Exam Engine Controller
 * Main Application Orchestrator, State Machine, Timer, and Event Handlers
 */

import { QUESTIONS, QUESTION_BANKS, DOMAINS } from './questions.js';
import { renderExhibitWithTabs } from './exhibits.js';
import { DragDropEngine } from './components/DragDropEngine.js';
import { EvaluationEngine } from './components/EvaluationEngine.js';

export class ExamEngine {
  constructor() {
    this.banks = (typeof QUESTION_BANKS !== 'undefined' && QUESTION_BANKS) ? QUESTION_BANKS : { part1: QUESTIONS, part2: QUESTIONS, part3: QUESTIONS };
    this.currentBankKey = localStorage.getItem('its_active_bank') || 'part1';
    this.allQuestions = this.banks[this.currentBankKey] || this.banks.part1 || QUESTIONS;
    this.activeFilter = 'all';
    this.activeQuestions = [...this.allQuestions];

    this.state = {
      mode: 'instant', // 'instant' | 'exam'
      currentIndex: 0,
      timerSeconds: 0, // count-up for instant, countdown for exam (3000s = 50min)
      isTimerRunning: true,
      userAnswers: {},
      reviewFlags: new Set(),
      evaluatedItems: {},
      theme: 'light',
      fontSize: 'normal',
      instantEvaluationEnabled: true,
      exhibitVisible: true
    };

    this.timerInterval = null;
    this.currentDndInstance = null;

    this.init();
  }

  init() {
    this.loadStateFromStorage();
    this.applyTheme(this.state.theme);
    this.applyFontSize(this.state.fontSize);
    this.setupDOMReferences();
    this.bindGlobalEvents();
    this.startTimer();
    this.renderQuestion();
  }

  /* ==========================================================================
     LOCAL STORAGE PERSISTENCE
     ========================================================================== */

  loadStateFromStorage() {
    try {
      const storageKey = `its_networking_exam_state_v2_${this.currentBankKey}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state.mode = parsed.mode || 'instant';
        this.state.currentIndex = typeof parsed.currentIndex === 'number' ? parsed.currentIndex : 0;
        this.state.userAnswers = parsed.userAnswers || {};
        this.state.reviewFlags = new Set(parsed.reviewFlags || []);
        this.state.evaluatedItems = parsed.evaluatedItems || {};
        this.state.theme = parsed.theme || 'light';
        this.state.fontSize = parsed.fontSize || 'normal';
        this.state.timerSeconds = typeof parsed.timerSeconds === 'number' ? parsed.timerSeconds : 0;
      } else {
        this.state.currentIndex = 0;
        this.state.userAnswers = {};
        this.state.reviewFlags = new Set();
        this.state.evaluatedItems = {};
      }
    } catch (e) {
      console.warn("Storage access failed, using memory state", e);
    }

    if (this.state.currentIndex < 0 || this.state.currentIndex >= this.activeQuestions.length) {
      this.state.currentIndex = 0;
    }
  }

  saveStateToStorage() {
    try {
      const storageKey = `its_networking_exam_state_v2_${this.currentBankKey}`;
      const payload = {
        mode: this.state.mode,
        currentIndex: this.state.currentIndex,
        userAnswers: this.state.userAnswers,
        reviewFlags: Array.from(this.state.reviewFlags),
        evaluatedItems: this.state.evaluatedItems,
        theme: this.state.theme,
        fontSize: this.state.fontSize,
        timerSeconds: this.state.timerSeconds
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  resetAllState() {
    if (!confirm("Are you sure you want to reset all answers, bookmarks, and score progress for this question bank?")) {
      return;
    }
    try {
      const storageKey = `its_networking_exam_state_v2_${this.currentBankKey}`;
      localStorage.removeItem(storageKey);
    } catch (e) {}

    this.state.userAnswers = {};
    this.state.reviewFlags = new Set();
    this.state.evaluatedItems = {};
    this.state.currentIndex = 0;
    this.state.timerSeconds = this.state.mode === 'exam' ? 3000 : 0;
    this.saveStateToStorage();
    this.renderQuestion();
  }

  /* ==========================================================================
     TIMER ENGINE
     ========================================================================== */

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    if (this.state.mode === 'exam' && this.state.timerSeconds <= 0) {
      this.state.timerSeconds = 3000; // 50 minutes (50 * 60)
    }

    this.timerInterval = setInterval(() => {
      if (!this.state.isTimerRunning) return;

      if (this.state.mode === 'exam') {
        this.state.timerSeconds--;
        if (this.state.timerSeconds <= 0) {
          this.state.timerSeconds = 0;
          this.updateTimerDisplay();
          this.handleExamTimeUp();
          return;
        }
      } else {
        this.state.timerSeconds++;
      }

      this.updateTimerDisplay();
    }, 1000);
  }

  updateTimerDisplay() {
    if (!this.dom.timerDisplay) return;

    const total = Math.max(0, this.state.timerSeconds);
    const hours = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;

    const formatted = hours > 0 
      ? `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    this.dom.timerDisplay.textContent = formatted;

    if (this.state.mode === 'exam' && this.state.timerSeconds <= 300) {
      this.dom.timerBadge.classList.add('warning');
    } else {
      this.dom.timerBadge.classList.remove('warning');
    }
  }

  handleExamTimeUp() {
    clearInterval(this.timerInterval);
    alert("Time has expired for this 50-minute exam simulation! Your score report is now ready.");
    this.showScoreSummaryModal();
  }

  /* ==========================================================================
     DOM REFERENCES & EVENTS SETUP
     ========================================================================== */

  setupDOMReferences() {
    this.dom = {
      workspace: document.getElementById('cbtWorkspace'),
      exhibitPane: document.getElementById('cbtExhibitPane'),
      exhibitBody: document.getElementById('exhibitBody'),
      exhibitTitle: document.getElementById('exhibitTitle'),
      assessmentPane: document.getElementById('cbtAssessmentPane'),
      questionStem: document.getElementById('questionStem'),
      questionInstructions: document.getElementById('questionInstructions'),
      questionDomainBadge: document.getElementById('questionDomainBadge'),
      questionTypeBadge: document.getElementById('questionTypeBadge'),
      interactiveContainer: document.getElementById('interactiveContainer'),
      explanationDrawer: document.getElementById('explanationDrawer'),
      questionIndicator: document.getElementById('questionIndicator'),
      timerDisplay: document.getElementById('timerDisplay'),
      timerBadge: document.getElementById('timerBadge'),
      timerLabel: document.getElementById('timerLabel'),

      // Header Controls
      btnMarkReview: document.getElementById('btnMarkReview'),
      btnModeToggle: document.getElementById('btnModeToggle'),
      btnExhibitToggle: document.getElementById('btnExhibitToggle'),
      btnCalcToggle: document.getElementById('btnCalcToggle'),
      btnFontToggle: document.getElementById('btnFontToggle'),
      btnThemeToggle: document.getElementById('btnThemeToggle'),
      btnResetExam: document.getElementById('btnResetExam'),
      filterSelect: document.getElementById('filterSelect'),
      bankSelect: document.getElementById('bankSelect'),
      jumpInput: document.getElementById('jumpInput'),
      btnJump: document.getElementById('btnJump'),

      // Footer Navigation Buttons
      btnPrev: document.getElementById('btnPrev'),
      btnNext: document.getElementById('btnNext'),
      btnCheckAnswer: document.getElementById('btnCheckAnswer'),
      btnResetAnswer: document.getElementById('btnResetAnswer'),
      btnReviewScreen: document.getElementById('btnReviewScreen'),
      btnFinishExam: document.getElementById('btnFinishExam'),

      // Modals
      reviewModal: document.getElementById('reviewModal'),
      reviewTableBody: document.getElementById('reviewTableBody'),
      closeReviewModal: document.getElementById('closeReviewModal'),
      calcModal: document.getElementById('calcModal'),
      closeCalcModal: document.getElementById('closeCalcModal'),
      scoreModal: document.getElementById('scoreModal'),
      closeScoreModal: document.getElementById('closeScoreModal')
    };
  }

  bindGlobalEvents() {
    if (!this.dom.btnPrev) return;

    this.dom.btnPrev.addEventListener('click', () => this.navigateQuestion(-1));
    this.dom.btnNext.addEventListener('click', () => this.navigateQuestion(1));
    this.dom.btnResetAnswer.addEventListener('click', () => this.resetCurrentAnswer());
    this.dom.btnCheckAnswer.addEventListener('click', () => this.checkCurrentAnswer());

    this.dom.btnMarkReview.addEventListener('click', () => this.toggleMarkForReview());
    this.dom.btnExhibitToggle.addEventListener('click', () => this.toggleExhibitPane());
    this.dom.btnModeToggle.addEventListener('click', () => this.toggleExamMode());
    this.dom.btnResetExam.addEventListener('click', () => this.resetAllState());

    if (this.dom.bankSelect) {
      this.dom.bankSelect.value = this.currentBankKey;
      this.dom.bankSelect.addEventListener('change', (e) => {
        this.switchQuestionBank(e.target.value);
      });
    }

    if (this.dom.btnJump) {
      this.dom.btnJump.addEventListener('click', () => this.jumpToQuestionNumber());
    }

    if (this.dom.jumpInput) {
      this.dom.jumpInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.jumpToQuestionNumber();
      });
    }

    if (this.dom.filterSelect) {
      this.dom.filterSelect.addEventListener('change', (e) => {
        this.applyQuestionFilter(e.target.value);
      });
    }

    this.dom.btnReviewScreen.addEventListener('click', () => this.showReviewScreenModal());
    this.dom.closeReviewModal.addEventListener('click', () => this.dom.reviewModal.classList.add('hidden-modal'));

    this.dom.btnFinishExam.addEventListener('click', () => this.showScoreSummaryModal());
    this.dom.closeScoreModal.addEventListener('click', () => this.dom.scoreModal.classList.add('hidden-modal'));

    this.dom.btnCalcToggle.addEventListener('click', () => this.dom.calcModal.classList.toggle('hidden-modal'));
    this.dom.closeCalcModal.addEventListener('click', () => this.dom.calcModal.classList.add('hidden-modal'));
    this.setupCalculator();

    this.dom.btnThemeToggle.addEventListener('click', () => this.toggleTheme());
    this.dom.btnFontToggle.addEventListener('click', () => this.cycleFontSize());

    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      if ((e.altKey && e.key.toLowerCase() === 'n') || e.key === 'ArrowRight') {
        e.preventDefault();
        this.navigateQuestion(1);
      } else if ((e.altKey && e.key.toLowerCase() === 'p') || e.key === 'ArrowLeft') {
        e.preventDefault();
        this.navigateQuestion(-1);
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        this.toggleMarkForReview();
      } else if (e.key >= '1' && e.key <= '5') {
        const idx = parseInt(e.key) - 1;
        this.handleKeyboardOptionSelect(idx);
      } else if (['a', 'b', 'c', 'd', 'e'].includes(e.key.toLowerCase())) {
        const map = { a: 0, b: 1, c: 2, d: 3, e: 4 };
        this.handleKeyboardOptionSelect(map[e.key.toLowerCase()]);
      }
    });
  }

  switchQuestionBank(bankKey) {
    if (!this.banks || !this.banks[bankKey]) return;
    this.saveStateToStorage();
    this.currentBankKey = bankKey;
    localStorage.setItem('its_active_bank', bankKey);
    this.allQuestions = this.banks[bankKey];
    this.activeFilter = 'all';
    if (this.dom.filterSelect) this.dom.filterSelect.value = 'all';
    this.activeQuestions = [...this.allQuestions];
    this.loadStateFromStorage();
    if (this.dom.bankSelect) this.dom.bankSelect.value = bankKey;
    if (this.dom.jumpInput) {
      this.dom.jumpInput.max = this.allQuestions.length;
      this.dom.jumpInput.value = '';
    }
    this.renderQuestion();
  }

  jumpToQuestionNumber() {
    if (!this.dom.jumpInput) return;
    const val = parseInt(this.dom.jumpInput.value, 10);
    if (isNaN(val)) return;

    const idx = this.activeQuestions.findIndex(q => (q.pdfNumber === val));
    if (idx !== -1) {
      this.state.currentIndex = idx;
      this.saveStateToStorage();
      this.renderQuestion();
      this.dom.jumpInput.value = '';
    } else if (val >= 1 && val <= this.activeQuestions.length) {
      this.state.currentIndex = val - 1;
      this.saveStateToStorage();
      this.renderQuestion();
      this.dom.jumpInput.value = '';
    } else {
      alert(`Question #${val} is not available in the current selection.`);
    }
  }

  applyQuestionFilter(filterKey) {
    this.activeFilter = filterKey;
    if (filterKey === 'all') {
      this.activeQuestions = [...this.allQuestions];
    } else if (filterKey.startsWith('domain-')) {
      const domNum = filterKey.replace('domain-', '');
      this.activeQuestions = this.allQuestions.filter(q => q.domain && q.domain.startsWith(domNum));
    } else if (filterKey === 'type-dnd') {
      this.activeQuestions = this.allQuestions.filter(q => q.type === 'drag-and-drop');
    } else if (filterKey === 'type-matrix') {
      this.activeQuestions = this.allQuestions.filter(q => q.type === 'matrix-yes-no');
    } else if (filterKey === 'type-dropdown') {
      this.activeQuestions = this.allQuestions.filter(q => q.type === 'dropdown-exhibit');
    } else if (filterKey === 'type-exhibit') {
      this.activeQuestions = this.allQuestions.filter(q => q.exhibit !== null || q.imageExhibit);
    } else if (filterKey === 'marked') {
      this.activeQuestions = this.allQuestions.filter(q => this.state.reviewFlags.has(q.id));
      if (this.activeQuestions.length === 0) {
        alert("No questions are currently marked for review.");
        this.activeQuestions = [...this.allQuestions];
        this.activeFilter = 'all';
        if (this.dom.filterSelect) this.dom.filterSelect.value = 'all';
      }
    }

    this.state.currentIndex = 0;
    this.renderQuestion();
  }

  /* ==========================================================================
     QUESTION RENDERING ENGINE
     ========================================================================== */

  renderQuestion() {
    const q = this.getCurrentQuestion();
    if (!q) {
      console.warn("No question found at index", this.state.currentIndex);
      return;
    }

    const totalQ = this.activeQuestions.length;
    const qNum = q.pdfNumber || (this.state.currentIndex + 1);
    this.dom.questionIndicator.textContent = `PDF Question ${qNum} of ${totalQ}`;
    this.dom.questionDomainBadge.textContent = q.domain || "Networking Fundamentals";
    this.dom.questionTypeBadge.textContent = (q.type || 'single-choice').toUpperCase().replace(/-/g, ' ');

    const isMarked = this.state.reviewFlags.has(q.id);
    if (isMarked) {
      this.dom.btnMarkReview.classList.add('flagged');
      this.dom.btnMarkReview.innerHTML = '&#9873; Marked for Review';
    } else {
      this.dom.btnMarkReview.classList.remove('flagged');
      this.dom.btnMarkReview.innerHTML = '&#9872; Mark for Review';
    }

    this.dom.btnPrev.disabled = this.state.currentIndex === 0;
    this.dom.btnNext.disabled = this.state.currentIndex === totalQ - 1;

    this.dom.questionStem.textContent = q.question;
    this.dom.questionInstructions.textContent = this.getInstructionTextForType(q);

    // Optional Original CBT Question Screenshot toggle
    let origPromptHtml = '';
    if (q.imageAnswerArea) {
      const imgSrc = q.imageAnswerArea.data || q.imageAnswerArea.file;
      origPromptHtml = `
        <div style="margin-top: 10px;">
          <button type="button" class="cbt-toggle-img-btn" id="btnToggleOrigCbt">
            &#128247; Toggle Original Exam Screenshot
          </button>
          <div id="origCbtImageContainer" style="display: none; margin-top: 8px;">
            <div class="exam-image-frame">
              <img src="${imgSrc}" alt="Original Exam Question Screenshot" class="exam-screenshot-img" />
              <div class="image-caption-bar">&#9432; Original Pearson VUE / Certiport Testing Engine Scan</div>
            </div>
          </div>
        </div>
      `;
    }

    this.renderExhibitPanel(q);
    this.renderInteractiveInput(q);

    if (origPromptHtml) {
      const promptBox = this.dom.interactiveContainer;
      const wrap = document.createElement('div');
      wrap.innerHTML = origPromptHtml;
      promptBox.insertBefore(wrap, promptBox.firstChild);

      const toggleBtn = wrap.querySelector('#btnToggleOrigCbt');
      const imgCont = wrap.querySelector('#origCbtImageContainer');
      if (toggleBtn && imgCont) {
        toggleBtn.addEventListener('click', () => {
          const isHidden = imgCont.style.display === 'none';
          imgCont.style.display = isHidden ? 'block' : 'none';
          toggleBtn.innerHTML = isHidden 
            ? '&#10006; Hide Original Exam Screenshot' 
            : '&#128247; Toggle Original Exam Screenshot';
        });
      }
    }

    const evalState = this.state.evaluatedItems[q.id];
    if (this.state.mode === 'instant') {
      this.dom.btnCheckAnswer.style.display = 'inline-flex';
      if (evalState && evalState.isEvaluated) {
        this.renderExplanation(q);
      } else {
        this.dom.explanationDrawer.innerHTML = '';
      }
    } else {
      this.dom.btnCheckAnswer.style.display = 'none';
      this.dom.explanationDrawer.innerHTML = '';
    }

    this.saveStateToStorage();
  }

  getInstructionTextForType(q) {
    switch (q.type) {
      case 'single-choice':
        return "Select the best option. Shortcut: keys A-D or 1-4.";
      case 'multi-choice':
        return "Select all correct options that apply. (Multiple choices required).";
      case 'drag-and-drop':
        return "Drag items from the left pool to the targets on the right, or click an item then click a target.";
      case 'dropdown-exhibit':
        return "Use the dropdown menus to complete each statement based on the accompanying exhibit.";
      case 'matrix-yes-no': {
        const col1 = (q.matrixColumns && q.matrixColumns[0]) || 'Yes';
        const col2 = (q.matrixColumns && q.matrixColumns[1]) || 'No';
        return `For each statement, select ${col1} if the statement is true. Otherwise, select ${col2}.`;
      }
      default:
        return "Answer the question based on the scenario.";
    }
  }

  renderExhibitPanel(q) {
    const hasExhibit = Boolean(q.exhibit || q.imageExhibit);

    if (hasExhibit) {
      this.dom.exhibitPane.classList.remove('hidden-pane');
      this.dom.workspace.classList.remove('no-exhibit');
      this.dom.exhibitTitle.textContent = (q.exhibit && q.exhibit.title) || `Question ${this.state.currentIndex + 1} Exhibit`;
      this.dom.exhibitBody.innerHTML = renderExhibitWithTabs(q);
      this.dom.btnExhibitToggle.style.display = 'inline-flex';

      // Bind tab buttons
      const tabBtns = this.dom.exhibitBody.querySelectorAll('.exhibit-tab-btn');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const target = btn.getAttribute('data-tab');
          const origEl = this.dom.exhibitBody.querySelector('#tabContentOriginal');
          const intEl = this.dom.exhibitBody.querySelector('#tabContentInteractive');
          if (target === 'original') {
            if (origEl) origEl.style.display = 'block';
            if (intEl) intEl.style.display = 'none';
          } else {
            if (origEl) origEl.style.display = 'none';
            if (intEl) intEl.style.display = 'block';
          }
        });
      });
    } else {
      this.dom.exhibitPane.classList.add('hidden-pane');
      this.dom.workspace.classList.add('no-exhibit');
      this.dom.btnExhibitToggle.style.display = 'none';
    }
  }

  renderInteractiveInput(q) {
    const currentAnswer = this.state.userAnswers[q.id];
    const isEvaluated = this.state.mode === 'instant' && this.state.evaluatedItems[q.id]?.isEvaluated;

    this.dom.interactiveContainer.innerHTML = '';

    switch (q.type) {
      case 'single-choice':
        this.renderSingleChoice(q, currentAnswer, isEvaluated);
        break;
      case 'multi-choice':
        this.renderMultiChoice(q, currentAnswer, isEvaluated);
        break;
      case 'drag-and-drop':
        this.renderDragAndDrop(q, currentAnswer, isEvaluated);
        break;
      case 'matrix-yes-no':
        this.renderMatrixYesNo(q, currentAnswer, isEvaluated);
        break;
      case 'dropdown-exhibit':
        this.renderDropdownExhibit(q, currentAnswer, isEvaluated);
        break;
      default:
        this.renderSingleChoice(q, currentAnswer, isEvaluated);
        break;
    }
  }

  renderSingleChoice(q, currentAnswer, isEvaluated) {
    const container = document.createElement('div');
    container.className = 'options-list';

    (q.options || []).forEach((opt) => {
      const isSelected = currentAnswer === opt.id;
      let evalClass = '';

      if (isEvaluated) {
        if (opt.id === q.correctAnswer) {
          evalClass = 'eval-correct';
        } else if (isSelected && opt.id !== q.correctAnswer) {
          evalClass = 'eval-incorrect';
        }
      }

      const itemEl = document.createElement('div');
      itemEl.className = `option-item ${isSelected ? 'selected' : ''} ${evalClass}`;
      itemEl.innerHTML = `
        <span class="option-key">${opt.id}</span>
        <input type="radio" name="opt-${q.id}" class="option-input" value="${opt.id}" ${isSelected ? 'checked' : ''} />
        <span class="option-text">${opt.text}</span>
      `;

      itemEl.addEventListener('click', () => {
        this.state.userAnswers[q.id] = opt.id;
        this.renderQuestion();
      });

      container.appendChild(itemEl);
    });

    this.dom.interactiveContainer.appendChild(container);
  }

  renderMultiChoice(q, currentAnswer, isEvaluated) {
    const container = document.createElement('div');
    container.className = 'options-list';
    const selectedList = Array.isArray(currentAnswer) ? currentAnswer : [];
    const correctAnswers = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];

    (q.options || []).forEach((opt) => {
      const isSelected = selectedList.includes(opt.id);
      let evalClass = '';

      if (isEvaluated) {
        if (correctAnswers.includes(opt.id)) {
          evalClass = 'eval-correct';
        } else if (isSelected && !correctAnswers.includes(opt.id)) {
          evalClass = 'eval-incorrect';
        }
      }

      const itemEl = document.createElement('div');
      itemEl.className = `option-item ${isSelected ? 'selected' : ''} ${evalClass}`;
      itemEl.innerHTML = `
        <span class="option-key">${opt.id}</span>
        <input type="checkbox" class="option-input" value="${opt.id}" ${isSelected ? 'checked' : ''} />
        <span class="option-text">${opt.text}</span>
      `;

      itemEl.addEventListener('click', () => {
        let updated;
        if (selectedList.includes(opt.id)) {
          updated = selectedList.filter(id => id !== opt.id);
        } else {
          updated = [...selectedList, opt.id];
        }
        this.state.userAnswers[q.id] = updated;
        this.renderQuestion();
      });

      container.appendChild(itemEl);
    });

    this.dom.interactiveContainer.appendChild(container);
  }

  renderDragAndDrop(q, currentAnswer, isEvaluated) {
    this.currentDndInstance = new DragDropEngine(
      this.dom.interactiveContainer,
      q,
      currentAnswer,
      (updatedAnswers) => {
        this.state.userAnswers[q.id] = updatedAnswers;
        this.saveStateToStorage();
      }
    );
  }

  renderMatrixYesNo(q, currentAnswer, isEvaluated) {
    const userAnswers = currentAnswer || {};
    const tableContainer = document.createElement('div');
    tableContainer.className = 'matrix-table-container';

    const col1 = (q.matrixColumns && q.matrixColumns[0]) || 'Yes';
    const col2 = (q.matrixColumns && q.matrixColumns[1]) || 'No';

    let html = `
      <table class="matrix-table">
        <thead>
          <tr>
            <th>Statement</th>
            <th class="col-choice">${col1}</th>
            <th class="col-choice">${col2}</th>
          </tr>
        </thead>
        <tbody>
    `;

    (q.statements || []).forEach(stmt => {
      const selectedVal = userAnswers[stmt.id];
      const isCol1 = selectedVal === col1;
      const isCol2 = selectedVal === col2;

      html += `
        <tr>
          <td>${stmt.text}</td>
          <td class="col-choice">
            <label class="matrix-radio-label">
              <input type="radio" name="stmt-${stmt.id}" value="${col1}" ${isCol1 ? 'checked' : ''} />
            </label>
          </td>
          <td class="col-choice">
            <label class="matrix-radio-label">
              <input type="radio" name="stmt-${stmt.id}" value="${col2}" ${isCol2 ? 'checked' : ''} />
            </label>
          </td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    tableContainer.innerHTML = html;

    tableContainer.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const stmtId = radio.name.replace('stmt-', '');
        if (!this.state.userAnswers[q.id]) {
          this.state.userAnswers[q.id] = {};
        }
        this.state.userAnswers[q.id][stmtId] = radio.value;
        this.saveStateToStorage();
      });
    });

    this.dom.interactiveContainer.appendChild(tableContainer);
  }

  renderDropdownExhibit(q, currentAnswer, isEvaluated) {
    const userAnswers = currentAnswer || {};
    const container = document.createElement('div');
    container.className = 'dropdown-exhibit-container';

    (q.subQuestions || []).forEach(sub => {
      const selectedVal = userAnswers[sub.id] || '';
      const card = document.createElement('div');
      card.className = 'subquestion-card';

      let selectOptions = `<option value="">-- Choose Option --</option>`;
      (sub.options || []).forEach(opt => {
        selectOptions += `<option value="${opt}" ${selectedVal === opt ? 'selected' : ''}>${opt}</option>`;
      });

      card.innerHTML = `
        <label class="subquestion-prompt">${sub.prompt}</label>
        <select class="subquestion-select" data-sub-id="${sub.id}">
          ${selectOptions}
        </select>
      `;

      card.querySelector('select').addEventListener('change', (e) => {
        if (!this.state.userAnswers[q.id]) {
          this.state.userAnswers[q.id] = {};
        }
        this.state.userAnswers[q.id][sub.id] = e.target.value;
        this.saveStateToStorage();
      });

      container.appendChild(card);
    });

    this.dom.interactiveContainer.appendChild(container);
  }

  /* ==========================================================================
     EVALUATION & FEEDBACK
     ========================================================================== */

  checkCurrentAnswer() {
    const q = this.getCurrentQuestion();
    if (!q) return;

    const answer = this.state.userAnswers[q.id];
    const evalResult = EvaluationEngine.evaluateQuestion(q, answer);

    this.state.evaluatedItems[q.id] = {
      isEvaluated: true,
      isCorrect: evalResult.isCorrect
    };

    this.renderQuestion();
  }

  renderExplanation(q) {
    const answer = this.state.userAnswers[q.id];
    const evalResult = EvaluationEngine.evaluateQuestion(q, answer);
    this.dom.explanationDrawer.innerHTML = EvaluationEngine.renderExplanationHtml(q, evalResult);
  }

  resetCurrentAnswer() {
    const q = this.getCurrentQuestion();
    if (!q) return;

    delete this.state.userAnswers[q.id];
    delete this.state.evaluatedItems[q.id];
    this.renderQuestion();
  }

  /* ==========================================================================
     NAVIGATION & SHORTCUTS
     ========================================================================== */

  navigateQuestion(delta) {
    const newIdx = this.state.currentIndex + delta;
    if (newIdx >= 0 && newIdx < this.activeQuestions.length) {
      this.state.currentIndex = newIdx;
      this.renderQuestion();
    }
  }

  jumpToQuestion(index) {
    if (index >= 0 && index < this.activeQuestions.length) {
      this.state.currentIndex = index;
      this.renderQuestion();
    }
  }

  toggleMarkForReview() {
    const q = this.getCurrentQuestion();
    if (!q) return;

    if (this.state.reviewFlags.has(q.id)) {
      this.state.reviewFlags.delete(q.id);
    } else {
      this.state.reviewFlags.add(q.id);
    }
    this.renderQuestion();
  }

  handleKeyboardOptionSelect(optionIdx) {
    const q = this.getCurrentQuestion();
    if (!q || q.type !== 'single-choice') return;

    if (q.options && q.options[optionIdx]) {
      this.state.userAnswers[q.id] = q.options[optionIdx].id;
      this.renderQuestion();
    }
  }

  getCurrentQuestion() {
    return this.activeQuestions[this.state.currentIndex] || this.activeQuestions[0];
  }

  /* ==========================================================================
     EXAM MODE TOGGLE & UI SWITCHES
     ========================================================================== */

  toggleExamMode() {
    const nextMode = this.state.mode === 'instant' ? 'exam' : 'instant';
    const confirmMsg = nextMode === 'exam' 
      ? "Switch to Pearson VUE Simulation Mode? (50-minute countdown, feedback suppressed until exam completion)"
      : "Switch to Instant Practice Mode? (Immediate feedback and technical explanations enabled)";

    if (confirm(confirmMsg)) {
      this.state.mode = nextMode;
      this.state.timerSeconds = nextMode === 'exam' ? 3000 : 0;
      this.dom.timerLabel.textContent = nextMode === 'exam' ? "Time Remaining:" : "Elapsed Time:";
      this.dom.btnModeToggle.textContent = nextMode === 'exam' ? "Mode: Exam Sim" : "Mode: Practice";
      this.renderQuestion();
    }
  }

  toggleExhibitPane() {
    this.dom.exhibitPane.classList.toggle('hidden-pane');
    this.dom.workspace.classList.toggle('no-exhibit');
  }

  toggleTheme() {
    const nextTheme = this.state.theme === 'light' ? 'dark' : 'light';
    this.state.theme = nextTheme;
    this.applyTheme(nextTheme);
    this.saveStateToStorage();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  cycleFontSize() {
    const sizes = ['normal', 'large', 'xlarge'];
    const currentIdx = sizes.indexOf(this.state.fontSize);
    const nextSize = sizes[(currentIdx + 1) % sizes.length];
    this.state.fontSize = nextSize;
    this.applyFontSize(nextSize);
    this.saveStateToStorage();
  }

  applyFontSize(size) {
    document.documentElement.setAttribute('data-font', size);
  }

  /* ==========================================================================
     REVIEW SCREEN MODAL
     ========================================================================== */

  showReviewScreenModal() {
    const tbody = this.dom.reviewTableBody;
    tbody.innerHTML = '';

    let answeredCount = 0;
    let markedCount = 0;

    this.activeQuestions.forEach((q, idx) => {
      const ans = this.state.userAnswers[q.id];
      const isAnswered = ans !== undefined && ans !== null && (
        typeof ans === 'object' ? Object.keys(ans).length > 0 : String(ans).trim() !== ''
      );
      const isMarked = this.state.reviewFlags.has(q.id);

      if (isAnswered) answeredCount++;
      if (isMarked) markedCount++;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>Question ${idx + 1} (${q.id})</strong></td>
        <td>${isMarked ? '<span class="flag-icon">&#9873; Marked</span>' : '-'}</td>
        <td><span class="${isAnswered ? 'badge-answered' : 'badge-unanswered'}">${isAnswered ? '&#10003; Answered' : '&#9888; Incomplete'}</span></td>
        <td>${q.type}</td>
      `;

      tr.addEventListener('click', () => {
        this.dom.reviewModal.classList.add('hidden-modal');
        this.jumpToQuestion(idx);
      });

      tbody.appendChild(tr);
    });

    document.getElementById('statAnswered').textContent = `${answeredCount} Answered`;
    document.getElementById('statUnanswered').textContent = `${this.activeQuestions.length - answeredCount} Incomplete`;
    document.getElementById('statMarked').textContent = `${markedCount} Marked for Review`;

    this.dom.reviewModal.classList.remove('hidden-modal');
  }

  /* ==========================================================================
     EXAM SCORING & DIAGNOSTIC REPORT MODAL
     ========================================================================== */

  showScoreSummaryModal() {
    const results = EvaluationEngine.calculateExamResults(this.activeQuestions, this.state.userAnswers);
    const container = document.getElementById('scoreResultsContainer');

    const passClass = results.isPassing ? 'pass' : 'fail';
    const statusText = results.isPassing ? 'PASS - CONGRATULATIONS!' : 'FAIL - DID NOT MEET CUTOFF';

    let domainBarsHtml = '';
    results.domainBreakdown.forEach(dom => {
      const barClass = dom.percentage >= 70 ? 'proficient' : 'needs-review';
      domainBarsHtml += `
        <div class="domain-bar-item">
          <div class="domain-bar-labels">
            <span>${dom.domain}</span>
            <span>${dom.correct}/${dom.total} (${dom.percentage}%) - ${dom.status}</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill ${barClass}" style="width: ${dom.percentage}%"></div>
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="score-banner ${passClass}">
        <div class="score-status-title">${statusText}</div>
        <div class="score-numerical">${results.scaledScore} / 1000</div>
        <div class="score-passing-cutoff">Passing Score: 700 / 1000 &bull; Raw Score: ${results.percentage}% (${results.correctCount}/${results.totalQuestions} questions)</div>
      </div>

      <div class="score-details-section">
        <h4 style="margin-bottom: 12px; font-size: 14px; text-transform: uppercase; color: var(--pv-text-muted);">
          Performance by Syllabus Domain
        </h4>
        <div class="domain-bars-list">
          ${domainBarsHtml}
        </div>
      </div>
    `;

    this.dom.scoreModal.classList.remove('hidden-modal');
  }

  /* ==========================================================================
     ON-SCREEN CALCULATOR
     ========================================================================== */

  setupCalculator() {
    const screen = document.getElementById('calcScreen');
    let expr = "0";

    const updateDisplay = () => {
      if (screen) screen.textContent = expr;
    };

    document.querySelectorAll('.calc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-val');
        const act = btn.getAttribute('data-act');

        if (act === 'clear') {
          expr = "0";
        } else if (act === 'back') {
          expr = expr.length > 1 ? expr.slice(0, -1) : "0";
        } else if (act === 'calc') {
          try {
            if (/^[0-9+\-*/. ]+$/.test(expr)) {
              // eslint-disable-next-line no-eval
              expr = String(Function(`'use strict'; return (${expr})`)());
            }
          } catch (e) {
            expr = "Error";
          }
        } else if (val) {
          if (expr === "0" || expr === "Error") {
            expr = val;
          } else {
            expr += val;
          }
        }
        updateDisplay();
      });
    });
  }
}

// Global robust launcher supporting both early and late loading
function startApp() {
  if (!window.examEngine) {
    window.examEngine = new ExamEngine();
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
  } else {
    startApp();
  }
}
