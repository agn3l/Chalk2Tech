# Chalk2Tech — "From Chalk to Technology"

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite 6](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> **Chalk2Tech** is a unified, intelligent faculty command center designed to eliminate the repetitive administrative burden on educators. From predictive 75% attendance recovery calculations and peer-tutoring seating optimization to code plagiarism AST diffs, AI-generation heuristics, personalized report comments, and anonymous student comprehension voting — all in one modern dashboard.

---

## 📌 The Problem
College and university faculty spend upwards of **15 hours every week** on mundane administrative tasks:
- Manually calculating how many consecutive lectures a student must attend to avoid examination debarment.
- Trying to arrange classroom seating so struggling students don't hide in back-row clusters.
- Manually checking if student code was copied or generated with ChatGPT.
- Writing generic, uninspired report card comments for 50+ students.
- Guessing whether a class understood a lecture topic, only finding out at final exam time.

**Chalk2Tech brings all these workflows into a single high-contrast, responsive faculty dashboard.**

---

## 🌟 Core Features & Modules

### 1. 📊 Faculty Command Center (Executive Overview)
- **Bird's-Eye KPI Cards**: Live counters for total students, attendance risks ($<75\%$), late submissions, AI/collusion flags, and class comprehension.
- **73% Conceptual Understanding Radial Meter**: Real-time visualization of classroom pulse on active lecture topics.
- **Critical Alert Feed**: Direct navigation shortcuts to flagged items (e.g. 87% similarity alert between Rahul and Akhil).
- **Recent Academic Activity Log**: Live audit trail of on-time/late submissions and student notes.

### 2. ⏱️ Feature 5: Attendance Analyzer & Recovery Engine
- **Exact Mathematical Formulas**:
  - **Minimum Consecutive Classes Needed ($x$) to reach $\ge 75\%$**:
    $$\frac{P + x}{W + x} \ge 0.75 \implies x = \max\left(0, \lceil 3W - 4P \rceil\right)$$
    *Example: Rahul (41/60, 68.3%) $\implies 3(60) - 4(41) =$ **16 consecutive classes**.*
  - **Safe Absence Margin ($y$) while maintaining $\ge 75\%$**:
    $$\frac{P}{W + y} \ge 0.75 \implies y = \max\left(0, \left\lfloor \frac{4P - 3W}{3} \right\rfloor\right)$$
    *Example: Rohan (46/60, 76.7%) $\implies \lfloor(184 - 180)/3\rfloor =$ can miss only **1 class** before risk zone.*
- **Interactive What-If Simulator**: Drag sliders for remaining lectures and attendance to project exam eligibility in real time.
- **Live Demo Controls**: Click `+1` (Present) or `-1` (Absent) next to any student to watch required makeup days update live.
- **Official Defaulter Notice Generator**: Generates formatted academic notices with 1-click clipboard copy and `.txt` file export.

### 3. 🎓 Feature 3: Smart Seating Arrangement
- **AI Pedagogical Strategies**:
  - 🌟 **Peer Tutoring Pairing (Buddy System)**: Automatically clusters struggling students ($\text{Marks} < 50$) adjacent to high-scoring mentors ($\text{Marks} \ge 80$) on shared benches with a green `🤝 Buddy` badge.
  - 🎯 **Front-Row Focus**: Positions students needing immediate faculty intervention in Row 1 directly under the podium.
  - 🛡️ **Exam Dispersal Mode**: Interleaves ability tiers in a checkerboard distribution to prevent answer copying.
  - 🔤 **Alphabetical Roster**: Traditional roll-call order.
- **Interactive Click-to-Swap**: Click Desk 1 $\to$ Click Desk 2 $\to$ Instant desk swap with live row score recalculation.
- **Classroom Orientation**: Teacher's Podium & Smart Projection Board anchor at the front.
- **Printable Classroom Blueprint**: Formatted door notices with 1-click browser printing and clipboard copy.

### 4. 🛡️ Feature 1: Smart Assignment & Submission Manager
- **Deadline Tracking**: Compares submission timestamps against the 10:00 AM cutoff (e.g. *Rahul: Late by 35 mins*).
- **Side-by-Side Plagiarism & Code Diff**: Compares Rahul ↔ Akhil (**87% similarity**) with AST syntax breakdown, pinpointing identical AVL tree rotation helpers with renamed identifiers (`rootNode` $\to$ `y`).
- **Linguistic AI-Likelihood Detector**: Evaluates Burstiness (18/100), Perplexity Variance (22/100), and formulaicness (94/100) with a 1-click **"Flag for Oral Viva Voce"** action.
- **Cohort Cross-Similarity Matrix**: Pairwise similarity table uncovering batch-wide collaboration networks.
- **Inline Grading**: Direct marks input with a dedicated **`-5 Late`** penalty deduction shortcut.

### 5. ✍️ Feature 2: Smart Report Card Comment Generator
- **Diagnostic Concept Diagnosis**: Combines exam score, attendance compliance, and answer-sheet concept tagging.
- **3 AI-Generated Tones**:
  - 💼 **Professional**: Formal, objective summary for official transcripts.
  - 🌟 **Encouraging**: Growth-mindset tone highlighting strengths to motivate students and parents.
  - ⚡ **Concise**: High-impact, character-restricted summary.
- **Editable Feedback Area**: With live word and character counters.
- **Batch Class Export**: 1-click export of remarks for all cohort students.

### 6. 📱 Feature 4: Anonymous Student Voice & Comprehension Pulse
- **Zero-Login Anonymous Voting**: Students point their phone camera at a projected QR code on the blackboard to join `chalk2tech.edu/poll` without logging in.
- **Classroom Comprehension Pulse**: Visual 4-tier breakdown (Fully Understood, Mostly Understood, Need Explanation, Didn't Understand).
- **Live Phone Simulator**: Interactive mock mobile screen right inside the app where tapping any choice updates the teacher's comprehension gauge in real time!
- **Categorized Anonymous Doubts Feed**: Filter by *Doubts & Difficulties* or *Pace & Suggestions*.
- **Faculty Action Plan**: Automatically summarizes key student struggles into concrete next steps (e.g. 15-minute blackboard walkthrough).

### 7. 📥 Universal CSV / Excel Roster Importer
- **Bulk Upload**: Dedicated modal to upload `.csv` files or paste spreadsheet rows directly from Excel/Google Sheets.
- **Instant Sync**: Updates Attendance records, Smart Seating marks, and Dashboard metrics simultaneously with zero manual entry.

---

## 🛠️ Architecture & Tech Stack

```
chalk-to-tech/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx              # Navigation with live alert notification badges
│   │   ├── Header.jsx               # Course context, CSV import, demo reset
│   │   ├── DashboardOverview.jsx    # Executive overview, KPI cards & alert feed
│   │   ├── AttendanceAnalyzer.jsx   # Exact 75% math engine & simulator
│   │   ├── SmartSeating.jsx         # Classroom grid & peer tutoring pairing
│   │   ├── AssignmentManager.jsx    # Late tracking, AST diff & AI heuristics
│   │   ├── ReportCardGenerator.jsx  # 3-tone personalized remarks generator
│   │   ├── StudentVoice.jsx         # Anonymous comprehension pulse & QR voting
│   │   └── DataUploadModal.jsx      # Universal CSV/Excel roster parser
│   ├── data/
│   │   └── demoData.js              # Realistic 12-student seed dataset
│   ├── utils/
│   │   ├── attendanceCalculator.js  # Mathematical recovery equations
│   │   ├── seatingAlgorithms.js     # Seating optimization & pairing logic
│   │   ├── assignmentAnalysis.js    # Plagiarism AST diffs & AI indicators
│   │   └── commentGenerator.js      # Natural language remark synthesizer
│   ├── App.jsx                      # App root with localStorage persistence
│   └── index.css                    # Slate & Indigo SaaS design tokens
```

- **Frontend**: React 19, JavaScript (ES6+)
- **Build Tool**: Vite 6 (HMR sub-second compilation)
- **Icons**: Lucide React
- **Styling**: Pure Vanilla CSS with tailored design tokens, glassmorphism, and responsive CSS grids
- **State & Storage**: React State with automatic `localStorage` synchronization (offline-capable)

---

## ⚡ Quickstart & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup
```bash
# 1. Clone the repository
git clone https://github.com/your-username/chalk2tech.git

# 2. Navigate to project directory
cd chalk2tech

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Open your browser at `http://localhost:5173/`.

### Production Build
```bash
npm run build
```
Generates an optimized, minified bundle in `dist/` in under 3 seconds.

Project Link- https://chalk2-tech-seven.vercel.app/

