# Pearson VUE / Certiport IT Specialist: Networking Fundamentals (98-366) Exam Reviewer

An authentic, production-ready Computer-Based Testing (CBT) assessment Single Page Application (SPA) recreating the official Pearson VUE / Certiport testing engine for the **Microsoft / Certiport IT Specialist: Networking Fundamentals (98-366)** certification.

This release contains the **complete, full repository of all 176 authentic exam questions** (Questions 1 through 176) extracted directly from the official CertKingdom / MTA 98-366 assessment document, along with all interactive formats and native vector/monospace exhibits.

---

## What Was Fixed

1. **"No Questions" Bug on Direct File Launch (`file://` Protocol):**
   - **Root Cause:** When double-clicking an HTML file directly from Windows Explorer, Chromium-based browsers (Google Chrome, Microsoft Edge, Opera, Brave) enforce a strict origin policy where `origin === 'null'`, causing `<script type="module" src="...">` imports to be blocked by browser CORS restrictions. Additionally, if the script executes after the document reaches an `interactive` or `complete` ready state, the `DOMContentLoaded` event never fires.
   - **Resolution:** `index.html` and `standalone.html` are now compiled into **100% self-contained, zero-dependency applications**. All 176 questions, high-fidelity CSS styling, vector exhibits, and testing engines are embedded directly into the page. Opening either `index.html` or `standalone.html` in ANY browser immediately boots the CBT engine with zero errors, zero server requirements, and zero CORS blocks.

2. **Complete 176 Question Bank Integration:**
   - Previous builds included only a 61-question subset.
   - **Now 100% complete:** Every question from Question 1 through Question 176 is parsed, validated, and interactive:
     - **126 Single-Choice Multiple Choice (SC-MCQ)** items with keyboard shortcut navigation (`A`–`D` or `1`–`4`).
     - **18 Multiple-Choice Multi-Select (MC-MSQ)** items enforcing exact set matching for *(Choose two)* or *(Choose all that apply)*.
     - **11 Drag-and-Drop Matching** questions (OSI layer ordering, IP address classification, protocol descriptions, network scopes, VPN types, 802.11 standards, topologies, and port assignments) with desktop mouse drag & drop AND touch/click-to-match fallback.
     - **14 Decision Matrix (Yes / No Tables)** evaluating each networking statement independently.
     - **7 Dropdown Exhibit Fill-in** items paired with native scalable terminal/dialog/topology mockups.

---

## Key Features

### 1. Dual Operational Modes
- **Instant Practice & Review Mode:**
  - Check your answer immediately using `[Check Answer]` or on selection.
  - Correct choices are outlined in emerald green (`#10B981`); incorrect choices are outlined in crimson red (`#EF4444`).
  - Automatically unfolds the **Technical Explanation Drawer** providing RFC citations, standard IEEE mechanics (802.3, 802.11, IPv4/IPv6, subnetting, TCP/UDP), and distractor analysis explaining why incorrect choices fail.
  - Count-up stopwatch session timer.
- **Pearson VUE Simulation Mode:**
  - 50-minute timed countdown exam simulation with blinking warning alerts when $\le 5$ minutes remain.
  - Immediate feedback suppressed during the test.
  - Authentic Pearson VUE **Review Screen** displaying the status of all 176 questions (*Answered*, *Incomplete*, *Marked for Review*) with one-click jump navigation.
  - Official **1000-Point Pearson VUE Scaled Score Report** (Passing cutoff: 700/1000) with diagnostic breakdown bars across all 5 syllabus domains.
  - Post-exam "Review Answers" mode to study full explanations.

### 2. High-Fidelity Native CSS & SVG Exhibits (Zero Broken Images)
- **`<CliTerminal />`:** Authentic Windows Command Prompt console (`#0c0c0c` background, window controls, Consolas monospace font) for `tracert -d 173.194.75.105`, `ping 172.16.2.11`, and `ipconfig /all`.
- **`<WinDialog />`:** Authentic recreation of the Windows **Internet Protocol Version 4 (TCP/IPv4) Properties** dialog (tabs, radio buttons, 4-octet boxed inputs) and **Wireless Network Properties** dialog.
- **`<CableExhibit />`:** Scalable SVG diagram of an 8P8C RJ-45 modular plug with color-coded T568B twisted pairs (White/Orange, Orange, White/Green, Blue, White/Blue, Green, White/Brown, Brown) and gold contact pins.
- **`<TopologyCanvas />`:** Interactive SVG diagram showing Internet, Perimeter Firewall, Demilitarized Zone (DMZ / Web Server), Internal Firewall, LAN switch, Workstations, and encrypted VPN tunnels.

### 3. Built-In Candidate Utilities
- **Domain & Type Filter Selector:** Filter the 176 questions on the fly by Domain (Infrastructures, Hardware, Protocols, Security, Troubleshooting) or by format (Drag & Drop, Matrix Yes/No, Exhibits, Marked).
- **On-Screen CBT Calculator:** Floating calculator popup for subnetting and bit-rate arithmetic.
- **Font Size Scaler:** Standard (100%), Large (125%), and Extra Large (150%).
- **Theme Switcher:** Clean Pearson VUE cool-slate skin and High-Contrast Dark mode.
- **Local Persistence:** Progress, bookmarks, and scores automatically save to `localStorage`.

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Alt + N` / `ArrowRight` | Navigate to **Next Question** |
| `Alt + P` / `ArrowLeft` | Navigate to **Previous Question** |
| `M` | Toggle **Mark for Review** flag |
| `A`, `B`, `C`, `D`, `E` or `1`–`5` | Select multiple choice answer option |

---

## How to Run

### Method 1: Instant Standalone (No Node, No Server Required)
Simply double-click [`index.html`](file:///c:/Users/ACER/Desktop/ITS1-Networking/index.html) or [`standalone.html`](file:///c:/Users/ACER/Desktop/ITS1-Networking/standalone.html) in Windows Explorer to open it in Google Chrome, Microsoft Edge, Mozilla Firefox, or Brave. Everything runs client-side.

### Method 2: Optional Development Server
If developing or modifying source components:
```powershell
cd c:\Users\ACER\Desktop\ITS1-Networking
npm start
# Serves index.html at http://localhost:3000
```

To re-bundle after editing source files:
```powershell
npm run bundle
```

---

## Codebase Directory Structure
```
ITS1-Networking/
├── index.html                 # Complete self-contained 176-question CBT SPA (Runs anywhere)
├── standalone.html            # Mirrored portable standalone file
├── index.template.html        # Clean HTML5 template with controls & modals
├── styles.css                 # Pearson VUE CBT skin, terminal, dialog & SVG styles
├── app.js                     # Core state machine, timers, shortcuts & navigation
├── questions.js               # All 176 questions with exhibits & RFC explanations
├── exhibits.js                # Native CSS/SVG generators for CLI, Windows dialogs & topologies
├── bundle.js                  # Automated bundler script
├── build_176_questions.py     # Parser script extracting all 176 questions from raw exam text
└── components/
    ├── DragDropEngine.js      # Touch-friendly drag-and-drop & click-to-match engine
    └── EvaluationEngine.js    # Grading algorithm & 1000-point diagnostic score calculator
```
