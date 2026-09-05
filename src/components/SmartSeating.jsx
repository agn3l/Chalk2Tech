import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Sparkles, 
  ArrowLeftRight, 
  RotateCcw, 
  Printer, 
  Copy, 
  Check, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Award, 
  Sliders, 
  Edit3, 
  Plus,
  BookOpen,
  Info
} from 'lucide-react';
import { 
  classifyStudent, 
  generatePeerTutoringLayout, 
  generateFrontRowFocusLayout, 
  generateExamDispersalLayout, 
  generateAlphabeticalLayout,
  evaluateSeatingMetrics
} from '../utils/seatingAlgorithms';

export default function SmartSeating({ data, onUpdateSeating }) {
  const initialStudents = useMemo(() => data?.seating?.students || [], [data]);
  const defaultRows = data?.seating?.defaultRows || 3;
  const defaultCols = data?.seating?.defaultCols || 4;

  const [rows, setRows] = useState(defaultRows);
  const [cols, setCols] = useState(defaultCols);
  const [activeStrategy, setActiveStrategy] = useState('peer-tutoring'); // 'peer-tutoring', 'front-row', 'exam', 'alphabetical'
  
  // Seating grid array of student objects or null (for empty seats)
  const [grid, setGrid] = useState(() => {
    return generatePeerTutoringLayout(initialStudents, defaultRows, defaultCols);
  });

  // Interactive Swap Selection
  const [selectedSeatIndex, setSelectedSeatIndex] = useState(null);

  // Modals
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [copiedBlueprint, setCopiedBlueprint] = useState(false);

  // Re-run current strategy when strategy or grid dimension changes
  const applyStrategy = (strategyName, studentList = initialStudents, r = rows, c = cols) => {
    setActiveStrategy(strategyName);
    setSelectedSeatIndex(null);
    let newGrid;
    if (strategyName === 'peer-tutoring') {
      newGrid = generatePeerTutoringLayout(studentList, r, c);
    } else if (strategyName === 'front-row') {
      newGrid = generateFrontRowFocusLayout(studentList, r, c);
    } else if (strategyName === 'exam') {
      newGrid = generateExamDispersalLayout(studentList, r, c);
    } else {
      newGrid = generateAlphabeticalLayout(studentList, r, c);
    }
    setGrid(newGrid);
  };

  // Evaluate analytics of current grid
  const metrics = useMemo(() => {
    return evaluateSeatingMetrics(grid, rows, cols);
  }, [grid, rows, cols]);

  // Handle seat click (Click A, then Click B to swap!)
  const handleSeatClick = (index) => {
    if (selectedSeatIndex === null) {
      setSelectedSeatIndex(index);
    } else if (selectedSeatIndex === index) {
      // Deselect if clicking same seat
      setSelectedSeatIndex(null);
    } else {
      // Swap selectedSeatIndex and index
      const updatedGrid = [...grid];
      const temp = updatedGrid[selectedSeatIndex];
      updatedGrid[selectedSeatIndex] = updatedGrid[index];
      updatedGrid[index] = temp;
      setGrid(updatedGrid);
      setSelectedSeatIndex(null);
    }
  };

  // Count student classifications
  const studentStats = useMemo(() => {
    const presentStudents = grid.filter(Boolean);
    const mentors = presentStudents.filter(s => s.marks >= 80).length;
    const mid = presentStudents.filter(s => s.marks >= 50 && s.marks < 80).length;
    const mentees = presentStudents.filter(s => s.marks < 50).length;
    return { mentors, mid, mentees, total: presentStudents.length };
  }, [grid]);

  // Edit / Add Student Marks Form
  const handleSaveStudentMarks = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name')?.toString().trim();
    const marks = parseInt(formData.get('marks')?.toString() || '70', 10);

    if (!name) return;

    let updatedStudentsList;
    if (editingStudent) {
      updatedStudentsList = initialStudents.map(s => s.id === editingStudent.id ? { ...s, name, marks } : s);
    } else {
      const newStudent = { id: `seat-${Date.now()}`, name, marks };
      updatedStudentsList = [...initialStudents, newStudent];
    }

    if (onUpdateSeating) {
      onUpdateSeating(updatedStudentsList);
    }
    setIsEditModalOpen(false);
    setEditingStudent(null);
    applyStrategy(activeStrategy, updatedStudentsList, rows, cols);
  };

  // Printable Blueprint Text
  const seatingBlueprintText = useMemo(() => {
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    let text = `=========================================================\n`;
    text += `CLASSROOM SEATING ARRANGEMENT BLUEPRINT\n`;
    text += `Course: ${data?.course || 'CS302: Data Structures & Algorithms'}\n`;
    text += `Faculty: ${data?.facultyName || 'Dr. Arvind Sharma'}\n`;
    text += `Date: ${dateStr}\n`;
    text += `Strategy: ${activeStrategy.toUpperCase()} MODE\n`;
    text += `Grid: ${rows} Rows × ${cols} Columns (${rows * cols} Total Desks)\n`;
    text += `=========================================================\n\n`;
    text += `[ FRONT OF ROOM — TEACHER'S PODIUM & SMART BOARD ]\n\n`;

    for (let r = 0; r < rows; r++) {
      text += `--- ROW ${r + 1} (Avg Score: ${metrics.rowAverages[r] || 0}%) ---\n`;
      for (let c = 0; c < cols; c++) {
        const student = grid[r * cols + c];
        const deskLabel = `Desk R${r+1}-C${c+1}`;
        if (student) {
          const tier = student.marks >= 80 ? 'Mentor' : student.marks < 50 ? 'Mentee' : 'Intermediate';
          text += `  [${deskLabel}] ${student.name.padEnd(12)} (${student.marks}/100) [${tier}]\n`;
        } else {
          text += `  [${deskLabel}] EMPTY SEAT\n`;
        }
      }
      text += `\n`;
    }

    text += `SUMMARY METRICS:\n`;
    text += `- Peer Tutoring Pairs Established: ${metrics.peerPairsCount}\n`;
    text += `- Students Requiring Peer Support: ${metrics.totalMenteeCount}\n`;
    text += `- Front Row Average: ${metrics.frontRowAvg}%\n`;
    text += `- Back Row Average: ${metrics.backRowAvg}%\n`;
    return text;
  }, [grid, rows, cols, activeStrategy, metrics, data]);

  const handleCopyBlueprint = () => {
    navigator.clipboard.writeText(seatingBlueprintText);
    setCopiedBlueprint(true);
    setTimeout(() => setCopiedBlueprint(false), 2000);
  };

  return (
    <div className="page-container">
      {/* Top Banner & Module Header */}
      <div className="welcome-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="badge badge-indigo">
              <Sparkles size={13} />
              AI Pedagogical Seating Engine
            </span>
            <span className="badge badge-emerald">
              <CheckCircle2 size={13} />
              {metrics.peerPairsCount} Peer Pairs Active
            </span>
          </div>
          <h1 className="welcome-title">Smart Seating Arrangement</h1>
          <p className="welcome-subtitle">
            Optimizes student desk placement based on comprehension and test scores. Pairs struggling students adjacent to supportive peer mentors and prevents isolated back-row clustering.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setIsPrintModalOpen(true)}
            id="btn-print-seating"
          >
            <Printer size={16} />
            Export Seating Plan
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => { setEditingStudent(null); setIsEditModalOpen(true); }}
            id="btn-add-student-marks"
          >
            <Plus size={16} />
            Add / Edit Student Score
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="metrics-grid">
        {/* Peer Pairs */}
        <div className="metric-card" style={{ borderColor: 'rgba(16, 185, 129, 0.35)' }}>
          <div className="metric-header">
            <span className="metric-label">Peer Tutoring Pairs</span>
            <div className="metric-icon-wrap" style={{ background: 'var(--accent-emerald-subtle)', color: 'var(--accent-emerald)' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: 'var(--accent-emerald)' }}>
            {metrics.peerPairsCount} / {metrics.totalMenteeCount}
          </div>
          <div className="metric-subtext" style={{ color: 'var(--accent-emerald)' }}>
            {metrics.peerPairsCount >= metrics.totalMenteeCount ? '100% struggling students paired!' : 'Partial peer coverage'}
          </div>
        </div>

        {/* High Performers / Mentors */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">High Performers (Mentors)</span>
            <div className="metric-icon-wrap" style={{ background: 'var(--accent-emerald-subtle)', color: 'var(--accent-emerald)' }}>
              <Award size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: 'var(--accent-emerald)' }}>
            {studentStats.mentors}
          </div>
          <div className="metric-subtext">
            Score ≥ 80% (Available as buddies)
          </div>
        </div>

        {/* Needs Support / Mentees */}
        <div className="metric-card" style={{ borderColor: studentStats.mentees > 0 ? 'rgba(244, 63, 94, 0.35)' : undefined }}>
          <div className="metric-header">
            <span className="metric-label">Needs Peer Support</span>
            <div className="metric-icon-wrap" style={{ background: 'var(--accent-rose-subtle)', color: 'var(--accent-rose)' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: 'var(--accent-rose)' }}>
            {studentStats.mentees}
          </div>
          <div className="metric-subtext">
            Score &lt; 50% (Assigned adjacent mentor)
          </div>
        </div>

        {/* Row Balance Comparison */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Row Score Balance</span>
            <div className="metric-icon-wrap" style={{ background: 'var(--accent-primary-subtle)', color: 'var(--accent-primary)' }}>
              <BookOpen size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ fontSize: '1.45rem', color: '#818cf8', paddingTop: '4px' }}>
            R1: {metrics.frontRowAvg}% | R{rows}: {metrics.backRowAvg}%
          </div>
          <div className="metric-subtext">
            Front row vs back row academic spread
          </div>
        </div>
      </div>

      {/* Algorithm Selector & Interactive Controls */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '8px' }}>
              Select Seating Strategy:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button 
                className={`btn btn-sm ${activeStrategy === 'peer-tutoring' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => applyStrategy('peer-tutoring')}
                id="btn-strategy-peer"
              >
                <Sparkles size={14} />
                🌟 Peer Tutoring Pairing
              </button>
              <button 
                className={`btn btn-sm ${activeStrategy === 'front-row' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => applyStrategy('front-row')}
                id="btn-strategy-front"
              >
                🎯 Front-Row Focus
              </button>
              <button 
                className={`btn btn-sm ${activeStrategy === 'exam' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => applyStrategy('exam')}
                id="btn-strategy-exam"
              >
                🛡️ Exam Dispersal Mode
              </button>
              <button 
                className={`btn btn-sm ${activeStrategy === 'alphabetical' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => applyStrategy('alphabetical')}
                id="btn-strategy-alpha"
              >
                🔤 Alphabetical Roster
              </button>
            </div>
          </div>

          {/* Grid Dimensions & Reset */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              <span>Grid:</span>
              <select 
                value={`${rows}x${cols}`}
                onChange={(e) => {
                  const [r, c] = e.target.value.split('x').map(Number);
                  setRows(r);
                  setCols(c);
                  applyStrategy(activeStrategy, initialStudents, r, c);
                }}
                style={{
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              >
                <option value="3x4">3 Rows × 4 Desks (12 seats)</option>
                <option value="4x3">4 Rows × 3 Desks (12 seats)</option>
                <option value="2x6">2 Rows × 6 Desks (12 seats)</option>
                <option value="4x4">4 Rows × 4 Desks (16 seats)</option>
              </select>
            </div>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => applyStrategy(activeStrategy)}
              title="Reset layout to strategy default"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>

        {/* Strategy Context Banner */}
        <div style={{
          marginTop: '14px',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div>
            <b style={{ color: 'var(--text-primary)' }}>Active Strategy: </b>
            {activeStrategy === 'peer-tutoring' && 'Smart Peer Tutoring — Low scoring students (<50) paired adjacent to high performers (≥80) on shared bench desks.'}
            {activeStrategy === 'front-row' && 'Front-Row Focus — Students needing academic support placed in Row 1 directly under faculty supervision.'}
            {activeStrategy === 'exam' && 'Anti-Cheating Dispersal — Interleaves high and low score bands to prevent answer sharing during examinations.'}
            {activeStrategy === 'alphabetical' && 'Alphabetical Order — Standard baseline attendance roster arrangement.'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Tip: Click any 2 desks to manually swap students!
            </span>
          </div>
        </div>
      </div>

      {/* Classroom Layout Container */}
      <div className="card" style={{ padding: '24px', background: '#0a0e1a', position: 'relative' }}>
        {/* Blackboard / Teacher Podium Bar */}
        <div style={{
          background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 20px',
          textAlign: 'center',
          marginBottom: '28px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
          position: 'relative'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontWeight: '700', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)' }}></div>
            Teacher's Podium & Smart Projection Board
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)' }}></div>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            [ FRONT OF CLASSROOM — FACULTY VIEW ]
          </div>
        </div>

        {/* Selected Swap Hint Banner */}
        {selectedSeatIndex !== null && (
          <div style={{
            marginBottom: '16px',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid rgba(99, 102, 241, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#fff' }}>
              <ArrowLeftRight size={16} style={{ color: 'var(--accent-primary)' }} />
              <span>
                Desk selected: <b>{grid[selectedSeatIndex]?.name || 'Empty Seat'}</b> (Desk {Math.floor(selectedSeatIndex / cols) + 1}-{(selectedSeatIndex % cols) + 1}). <b>Now click any second desk to swap seats!</b>
              </span>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedSeatIndex(null)}
              style={{ padding: '2px 8px', fontSize: '0.75rem' }}
            >
              Cancel Swap
            </button>
          </div>
        )}

        {/* Seating Grid (Rows of Desks) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Array.from({ length: rows }).map((_, r) => {
            const rowStart = r * cols;
            const rowEnd = (r + 1) * cols;
            const rowStudents = grid.slice(rowStart, rowEnd);
            const rowAvg = metrics.rowAverages[r] || 0;

            return (
              <div key={`row-${r}`} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Row Header Label */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                    Row {r + 1} {r === 0 ? '— Front Row' : r === rows - 1 ? '— Back Row' : ''}
                  </span>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    Row Mean: <b>{rowAvg}%</b>
                  </span>
                </div>

                {/* Desk Cards Grid for this row */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: `repeat(${cols}, 1fr)`, 
                  gap: '14px' 
                }}>
                  {rowStudents.map((student, colIdx) => {
                    const globalIdx = rowStart + colIdx;
                    const isSelected = selectedSeatIndex === globalIdx;
                    const classification = student ? classifyStudent(student) : null;

                    // Bench pairing logic (group adjacent pairs 0-1, 2-3)
                    const isPairStart = colIdx % 2 === 0;
                    const partner = isPairStart ? rowStudents[colIdx + 1] : rowStudents[colIdx - 1];
                    const isBuddyPair = student && partner && (
                      (student.marks >= 80 && partner.marks < 50) || 
                      (student.marks < 50 && partner.marks >= 80)
                    );

                    return (
                      <div
                        key={`seat-${globalIdx}`}
                        onClick={() => handleSeatClick(globalIdx)}
                        style={{
                          background: isSelected 
                            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(79, 70, 229, 0.3) 100%)' 
                            : 'var(--bg-surface-elevated)',
                          border: isSelected 
                            ? '2px solid #818cf8' 
                            : isBuddyPair 
                              ? '1px solid rgba(16, 185, 129, 0.45)' 
                              : '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.18s ease',
                          position: 'relative',
                          boxShadow: isSelected ? '0 0 18px rgba(99, 102, 241, 0.4)' : undefined,
                          transform: isSelected ? 'scale(1.02)' : undefined
                        }}
                        className="desk-card"
                      >
                        {/* Desk coordinate label */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            Desk {r + 1}-{colIdx + 1}
                          </span>
                          {isBuddyPair && (
                            <span 
                              title="Smart Peer-Tutoring Bench Pair Active"
                              style={{ 
                                fontSize: '0.68rem', 
                                background: 'rgba(16, 185, 129, 0.15)', 
                                color: '#34d399', 
                                padding: '1px 6px', 
                                borderRadius: '999px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                            >
                              <Users size={10} /> Buddy
                            </span>
                          )}
                        </div>

                        {student ? (
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                              <div style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                background: classification.tier === 'high' 
                                  ? 'rgba(16, 185, 129, 0.2)' 
                                  : classification.tier === 'low' 
                                    ? 'rgba(244, 63, 94, 0.2)' 
                                    : 'rgba(99, 102, 241, 0.2)',
                                color: classification.tier === 'high' 
                                  ? 'var(--accent-emerald)' 
                                  : classification.tier === 'low' 
                                    ? 'var(--accent-rose)' 
                                    : '#a5b4fc',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '0.82rem'
                              }}>
                                {student.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {student.name}
                                </div>
                                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                                  Score: <b style={{ color: classification.tier === 'high' ? 'var(--accent-emerald)' : classification.tier === 'low' ? 'var(--accent-rose)' : 'inherit' }}>{student.marks}</b>/100
                                </div>
                              </div>
                            </div>

                            {/* Badge */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span className={`badge ${classification.badgeClass}`} style={{ fontSize: '0.7rem' }}>
                                {classification.tier === 'high' && <Award size={10} />}
                                {classification.tier === 'low' && <AlertTriangle size={10} />}
                                {classification.label}
                              </span>

                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                Click to swap
                              </span>
                            </div>
                          </>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            Empty Seat
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend / Key Footer */}
        <div style={{
          marginTop: '28px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Performance Tier Key:</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-emerald)' }}></div>
              Peer Mentor (Marks ≥ 80)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
              Intermediate (Marks 50–79)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-rose)' }}></div>
              Needs Support (Marks &lt; 50)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.8)', background: 'rgba(16, 185, 129, 0.15)' }}></div>
              Active Buddy Bench Pair
            </span>
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>
            Algorithm: Complementary Heterogeneous Pairing
          </div>
        </div>
      </div>

      {/* Modal 1: Export / Print Seating Plan */}
      {isPrintModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Printer size={18} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '1.1rem' }}>Printable Seating Blueprint</h3>
              </div>
              <button 
                onClick={() => setIsPrintModalOpen(false)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Formatted classroom blueprint ready to be posted on the lecture hall entrance or distributed to students before revision sessions.
            </p>

            <div style={{
              background: '#0a0e17',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              maxHeight: '340px',
              overflowY: 'auto',
              border: '1px solid var(--border-subtle)',
              color: '#cbd5e1',
              marginBottom: '20px'
            }}>
              {seatingBlueprintText}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => window.print()}
              >
                <Printer size={15} />
                Print via Browser
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCopyBlueprint}
              >
                {copiedBlueprint ? <Check size={15} /> : <Copy size={15} />}
                {copiedBlueprint ? 'Blueprint Copied!' : 'Copy Plan to Clipboard'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Add / Edit Student Score */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem' }}>
                {editingStudent ? 'Edit Student Score' : 'Add Student to Seating'}
              </h3>
              <button 
                onClick={() => { setIsEditModalOpen(false); setEditingStudent(null); }}
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveStudentMarks} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Student Name
                </label>
                <input 
                  type="text"
                  name="name"
                  defaultValue={editingStudent?.name || ''}
                  required
                  placeholder="e.g. Sanya Mirza"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Comprehension / Midterm Marks (out of 100)
                </label>
                <input 
                  type="number"
                  name="marks"
                  defaultValue={editingStudent?.marks ?? 75}
                  min="0"
                  max="100"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                />
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  ≥ 80: Peer Mentor | 50–79: Intermediate | &lt; 50: Needs Peer Mentee Support
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => { setIsEditModalOpen(false); setEditingStudent(null); }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Save &amp; Re-optimize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
