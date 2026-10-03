/**
 * DragDropEngine.js
 * Dual-interaction Drag-and-Drop controller supporting desktop HTML5 drag & drop
 * and seamless click-to-match / touch selection fallback.
 */

export class DragDropEngine {
  constructor(container, question, currentAnswers, onAnswerChange) {
    this.container = container;
    this.question = question;
    // userAnswers format: { [dropZoneId]: itemId }
    this.answers = currentAnswers ? { ...currentAnswers } : {};
    this.onAnswerChange = onAnswerChange;
    this.selectedSourceId = null;

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    const { dragItems, dropZones } = this.question;
    const assignedItemIds = new Set(Object.values(this.answers));

    let html = `
      <div class="dnd-engine-wrapper">
        <div class="dnd-instructions-bar">
          <span class="dnd-hint-icon">&#9432;</span>
          <span class="dnd-hint-text">
            <strong>Desktop:</strong> Drag items from the pool to the targets. 
            <strong>Touch/Click:</strong> Click an item on the left, then click a target on the right.
          </span>
        </div>

        <div class="dnd-board">
          <!-- Left Pool of Items -->
          <div class="dnd-pool-column">
            <div class="dnd-column-header">
              <span class="header-title">Available Options</span>
              <span class="header-count">${dragItems.length} items</span>
            </div>
            <div class="dnd-pool-items" id="dndPool">
    `;

    dragItems.forEach(item => {
      const isAssigned = assignedItemIds.has(item.id);
      const isSelected = this.selectedSourceId === item.id;
      html += `
        <div 
          class="dnd-item ${isAssigned ? 'assigned' : ''} ${isSelected ? 'selected-source' : ''}" 
          draggable="${!isAssigned}" 
          data-item-id="${item.id}"
          tabindex="0"
          role="button"
          aria-grabbed="${isSelected}"
        >
          <span class="dnd-grab-handle">&#x22EE;&#x22EE;</span>
          <span class="dnd-item-label">${item.label}</span>
          ${isAssigned ? '<span class="dnd-used-indicator">&#10003; Placed</span>' : ''}
        </div>
      `;
    });

    html += `
            </div>
          </div>

          <!-- Middle Divider / Arrow -->
          <div class="dnd-connector-column" aria-hidden="true">
            <div class="dnd-flow-arrow">&#10142;</div>
          </div>

          <!-- Right Drop Zones -->
          <div class="dnd-targets-column">
            <div class="dnd-column-header">
              <span class="header-title">Answer Targets</span>
              <button class="dnd-reset-btn" id="dndResetAll" type="button" title="Clear all targets">
                &#8634; Reset All
              </button>
            </div>
            <div class="dnd-targets-list" id="dndTargets">
    `;

    dropZones.forEach(zone => {
      const assignedItemId = this.answers[zone.id];
      const assignedItem = dragItems.find(i => i.id === assignedItemId);

      html += `
        <div 
          class="dnd-drop-zone ${assignedItem ? 'has-item' : 'empty'}" 
          data-zone-id="${zone.id}"
          tabindex="0"
          role="region"
          aria-label="${zone.label}"
        >
          <div class="zone-label-row">
            <span class="zone-badge">&#9672; Target</span>
            <span class="zone-title">${zone.label}</span>
          </div>

          <div class="zone-slot" data-zone-id="${zone.id}">
            ${assignedItem ? `
              <div class="dnd-slotted-card" data-item-id="${assignedItem.id}">
                <span class="slotted-label">${assignedItem.label}</span>
                <button type="button" class="dnd-remove-item" data-zone-id="${zone.id}" title="Remove item">&times;</button>
              </div>
            ` : `
              <div class="zone-placeholder">
                <span class="placeholder-icon">&#10515;</span>
                <span class="placeholder-text">Drop or click target to assign</span>
              </div>
            `}
          </div>
        </div>
      `;
    });

    html += `
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }

  bindEvents() {
    const pool = this.container.querySelector('#dndPool');
    const targets = this.container.querySelector('#dndTargets');
    const resetBtn = this.container.querySelector('#dndResetAll');

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.answers = {};
        this.selectedSourceId = null;
        this.render();
        this.bindEvents();
        this.onAnswerChange(this.answers);
      });
    }

    // --- HTML5 Desktop Drag and Drop ---
    this.container.querySelectorAll('.dnd-item:not(.assigned)').forEach(itemEl => {
      itemEl.addEventListener('dragstart', (e) => {
        const itemId = itemEl.getAttribute('data-item-id');
        e.dataTransfer.setData('text/plain', itemId);
        e.dataTransfer.effectAllowed = 'move';
        itemEl.classList.add('dragging');
      });

      itemEl.addEventListener('dragend', () => {
        itemEl.classList.remove('dragging');
      });

      // Click to select
      itemEl.addEventListener('click', () => {
        const itemId = itemEl.getAttribute('data-item-id');
        if (this.selectedSourceId === itemId) {
          this.selectedSourceId = null;
        } else {
          this.selectedSourceId = itemId;
        }
        this.render();
        this.bindEvents();
      });
    });

    // Drop Zones
    this.container.querySelectorAll('.dnd-drop-zone').forEach(zoneEl => {
      const zoneId = zoneEl.getAttribute('data-zone-id');

      zoneEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        zoneEl.classList.add('drag-over');
      });

      zoneEl.addEventListener('dragleave', () => {
        zoneEl.classList.remove('drag-over');
      });

      zoneEl.addEventListener('drop', (e) => {
        e.preventDefault();
        zoneEl.classList.remove('drag-over');
        const itemId = e.dataTransfer.getData('text/plain');
        if (itemId) {
          this.assignItemToZone(itemId, zoneId);
        }
      });

      // Click-to-Target Fallback
      zoneEl.addEventListener('click', (e) => {
        if (e.target.closest('.dnd-remove-item')) return;

        if (this.selectedSourceId) {
          this.assignItemToZone(this.selectedSourceId, zoneId);
          this.selectedSourceId = null;
        }
      });
    });

    // Remove buttons on slotted items
    this.container.querySelectorAll('.dnd-remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const zoneId = btn.getAttribute('data-zone-id');
        delete this.answers[zoneId];
        this.render();
        this.bindEvents();
        this.onAnswerChange(this.answers);
      });
    });
  }

  assignItemToZone(itemId, zoneId) {
    // If this item was already assigned in another zone, unassign it from old zone
    for (const [zId, itId] of Object.entries(this.answers)) {
      if (itId === itemId) {
        delete this.answers[zId];
      }
    }
    // Assign to new zone
    this.answers[zoneId] = itemId;
    this.render();
    this.bindEvents();
    this.onAnswerChange(this.answers);
  }
}
