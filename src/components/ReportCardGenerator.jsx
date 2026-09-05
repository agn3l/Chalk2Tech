import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Download, 
  X, 
  Save, 
  Sliders, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Tag, 
  MessageSquare,
  Award
} from 'lucide-react';
import { generateReportComment } from '../utils/commentGenerator';

const standardStrengthOptions = [
  "Linear Equations", "Matrix Arithmetic", "Calculus", "Basic Algebra", 
  "Binary Search Trees", "Logical Proofs", "Algorithm Tracing", "AVL Balancing"
];

const standardWeaknessOptions = [
  "Quadratic Equations", "Graph Interpretation", "Calculation Accuracy", 
  "Tree Rotations", "Asymptotic Analysis", "Step Verification", "Boundary Conditions"
];

export default function ReportCardGenerator({ data, onUpdateReportCards }) {
  const initialReports = useMemo(() => data?.reportCards || [], [data]);
  const seatingStudents = useMemo(() => data?.seating?.students || [], [data]);
  const attendanceStudents = useMemo(() => data?.attendance?.students || [], [data]);

  // Combine available student roster
  const studentRoster = useMemo(() => {
    const list = [...seatingStudents];
    if (list.length === 0) {
      return [
        { id: "s-1", name: "Rahul", marks: 68 },
        { id: "s-2", name: "Akhil", marks: 92 },
        { id: "s-3", name: "Anu", marks: 85 },
        { id: "s-4", name: "Vishnu", marks: 41 }
      ];
    }
    return list;
  }, [seatingStudents]);

  const [selectedStudentName, setSelectedStudentName] = useState("Rahul");
  const [selectedTone, setSelectedTone] = useState("professional"); // 'professional', 'encouraging', 'concise'

  // Diagnostic state for selected student
  const [marks, setMarks] = useState(68);
  const [totalMarks, setTotalMarks] = useState(100);
  const [attendancePct, setAttendancePct] = useState(68);
  const [selectedStrengths, setSelectedStrengths] = useState(["Basic algebra", "Linear equations", "Matrix arithmetic"]);
  const [selectedWeaknesses, setSelectedWeaknesses] = useState(["Quadratic equations", "Graph interpretation", "Calculation accuracy"]);
  const [answerSheetNotes, setAnswerSheetNotes] = useState("Skipped intermediate simplification step in Q4; sign error in quadratic formula discriminant.");
  const [customTagInput, setCustomTagInput] = useState("");

  // Generated comments state (store per tone)
  const [generatedComments, setGeneratedComments] = useState(() => {
    const initial = initialReports.find(r => r.studentName === "Rahul");
    if (initial && initial.comments) {
      return initial.comments;
    }
    return {
      professional: generateReportComment({ name: "Rahul", marks: 68, totalMarks: 100, attendancePct: 68, strongConcepts: ["Basic algebra", "Linear equations"], weakConcepts: ["Quadratic equations"] }, 'professional'),
      encouraging: generateReportComment({ name: "Rahul", marks: 68, totalMarks: 100, attendancePct: 68, strongConcepts: ["Basic algebra", "Linear equations"], weakConcepts: ["Quadratic equations"] }, 'encouraging'),
      concise: generateReportComment({ name: "Rahul", marks: 68, totalMarks: 100, attendancePct: 68, strongConcepts: ["Basic algebra", "Linear equations"], weakConcepts: ["Quadratic equations"] }, 'concise')
    };
  });

  // Active editable text in textarea
  const [activeCommentText, setActiveCommentText] = useState(() => generatedComments.professional);
  const [copied, setCopied] = useState(false);
  const [savedBadge, setSavedBadge] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [copiedBatch, setCopiedBatch] = useState(false);

  // When student changes from dropdown, reload their profile
  const handleSelectStudent = (name) => {
    setSelectedStudentName(name);
    const existing = initialReports.find(r => r.studentName.toLowerCase() === name.toLowerCase());
    const seatObj = seatingStudents.find(s => s.name.toLowerCase() === name.toLowerCase());
    const attObj = attendanceStudents.find(s => s.name.toLowerCase() === name.toLowerCase());

    const studentMarks = existing?.marks ?? seatObj?.marks ?? 70;
    const studentAtt = existing?.attendancePct ?? (attObj ? Math.round((attObj.presentDays / attObj.totalDays) * 100) : 75);
    const studentStrengths = existing?.answerSheetNotes?.strongConcepts ?? ["Basic Algebra", "Linear Equations"];
    const studentWeaknesses = existing?.answerSheetNotes?.weakConcepts ?? ["Calculation Accuracy"];
    const studentNotes = existing?.answerSheetNotes?.commonMistakes ?? "";

    setMarks(studentMarks);
    setAttendancePct(studentAtt);
    setSelectedStrengths(studentStrengths);
    setSelectedWeaknesses(studentWeaknesses);
    setAnswerSheetNotes(studentNotes);

    // Generate fresh comments for all 3 tones
    const studentData = {
      name,
      marks: studentMarks,
      totalMarks,
      attendancePct: studentAtt,
      strongConcepts: studentStrengths,
      weakConcepts: studentWeaknesses,
      customNote: studentNotes
    };

    const newComments = {
      professional: existing?.comments?.professional || generateReportComment(studentData, 'professional'),
      encouraging: existing?.comments?.encouraging || generateReportComment(studentData, 'encouraging'),
      concise: existing?.comments?.concise || generateReportComment(studentData, 'concise')
    };

    setGeneratedComments(newComments);
    setActiveCommentText(newComments[selectedTone]);
  };

  // Tone switch handler
  const handleToneChange = (tone) => {
    setSelectedTone(tone);
    setActiveCommentText(generatedComments[tone]);
  };

  // Regenerate button
  const handleGenerate = () => {
    const studentData = {
      name: selectedStudentName,
      marks,
      totalMarks,
      attendancePct,
      strongConcepts: selectedStrengths,
      weakConcepts: selectedWeaknesses,
      customNote: answerSheetNotes
    };

    const newComments = {
      professional: generateReportComment(studentData, 'professional'),
      encouraging: generateReportComment(studentData, 'encouraging'),
      concise: generateReportComment(studentData, 'concise')
    };

    setGeneratedComments(newComments);
    setActiveCommentText(newComments[selectedTone]);
  };

  // Copy active comment to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(activeCommentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Save to student record
  const handleSaveToRecord = () => {
    const updatedRecord = {
      id: `rep-${Date.now()}`,
      studentName: selectedStudentName,
      subject: data?.course || "Data Structures & Algorithms",
      marks,
      totalMarks,
      attendancePct,
      answerSheetNotes: {
        strongConcepts: selectedStrengths,
        weakConcepts: selectedWeaknesses,
        commonMistakes: answerSheetNotes
      },
      comments: {
        ...generatedComments,
        [selectedTone]: activeCommentText
      }
    };

    let updatedList;
    const exists = initialReports.some(r => r.studentName.toLowerCase() === selectedStudentName.toLowerCase());
    if (exists) {
      updatedList = initialReports.map(r => r.studentName.toLowerCase() === selectedStudentName.toLowerCase() ? updatedRecord : r);
    } else {
      updatedList = [...initialReports, updatedRecord];
    }

    if (onUpdateReportCards) {
      onUpdateReportCards(updatedList);
    }

    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 2500);
  };

  // Tag toggle helper
  const toggleStrength = (tag) => {
    setSelectedStrengths(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleWeakness = (tag) => {
    setSelectedWeaknesses(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = (isStrength) => {
    if (!customTagInput.trim()) return;
    if (isStrength) {
      setSelectedStrengths(prev => [...prev, customTagInput.trim()]);
    } else {
      setSelectedWeaknesses(prev => [...prev, customTagInput.trim()]);
    }
    setCustomTagInput("");
  };

  // Batch Export Text
  const batchReportText = useMemo(() => {
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    let text = `=========================================================\n`;
    text += `STUDENT REPORT CARD REMARKS BATCH EXPORT\n`;
    text += `Course: ${data?.course || 'CS302: Data Structures & Algorithms'}\n`;
    text += `Faculty: ${data?.facultyName || 'Dr. Arvind Sharma'}\n`;
    text += `Date: ${dateStr}\n`;
    text += `=========================================================\n\n`;

    studentRoster.forEach(student => {
      const existing = initialReports.find(r => r.studentName.toLowerCase() === student.name.toLowerCase());
      const studentComment = existing?.comments?.professional || generateReportComment({
        name: student.name,
        marks: student.marks,
        totalMarks: 100,
        attendancePct: 80,
        strongConcepts: ["Core syllabus concepts"],
        weakConcepts: ["Complex algorithm tracing"]
      }, 'professional');

      text += `STUDENT: ${student.name.toUpperCase()}\n`;
      text += `Score: ${student.marks}/100\n`;
      text += `Professional Remark:\n"${studentComment}"\n`;
      text += `---------------------------------------------------------\n\n`;
    });

    return text;
  }, [studentRoster, initialReports, data]);

  const handleCopyBatch = () => {
    navigator.clipboard.writeText(batchReportText);
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 2000);
  };

  return (
    <div className="page-container">
      {/* Top Banner & Module Header */}
      <div className="welcome-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="badge badge-indigo">
              <Sparkles size={13} />
              AI Pedagogical Remark Engine
            </span>
            <span className="badge badge-emerald">
              <CheckCircle2 size={13} />
              3 Tone Variants Available
            </span>
          </div>
          <h1 className="welcome-title">Report Card Comment Generator</h1>
          <p className="welcome-subtitle">
            Produces tailored, professional, growth-mindset feedback for students based on diagnostic answer-sheet analysis, exam scores, and attendance standing.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setIsBatchModalOpen(true)}
            id="btn-batch-export-comments"
          >
            <Download size={16} />
            Batch Class Export
          </button>
        </div>
      </div>

      {/* Main 2-Column Work Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px' }}>
        {/* Left Column: Student Diagnostic Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Student Selector Card */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                1. Select Student
              </div>
              <span className="badge badge-indigo">
                {studentRoster.length} Students in Cohort
              </span>
            </div>

            <select
              value={selectedStudentName}
              onChange={(e) => handleSelectStudent(e.target.value)}
              id="select-report-student"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '0.92rem',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              {studentRoster.map(s => (
                <option key={s.id || s.name} value={s.name}>
                  {s.name} — Current Score: {s.marks}/100
                </option>
              ))}
            </select>

            {/* Quick Metrics Bar for Selected Student */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Exam Marks (/100):
                </label>
                <input 
                  type="number"
                  value={marks}
                  min="0"
                  max={totalMarks}
                  onChange={(e) => setMarks(parseInt(e.target.value, 10) || 0)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: marks >= 80 ? 'var(--accent-emerald)' : marks < 50 ? 'var(--accent-rose)' : 'inherit',
                    fontWeight: '700',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Attendance (%):
                </label>
                <input 
                  type="number"
                  value={attendancePct}
                  min="0"
                  max="100"
                  onChange={(e) => setAttendancePct(parseInt(e.target.value, 10) || 0)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: attendancePct < 75 ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                    fontWeight: '700',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {attendancePct < 75 && (
              <div style={{
                marginTop: '12px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                fontSize: '0.78rem',
                color: '#fda4af',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <AlertTriangle size={13} />
                Attendance ({attendancePct}%) is below the mandatory 75% university policy. Comment will incorporate attendance advisory.
              </div>
            )}
          </div>

          {/* Concepts Identified in Answer Sheet Card */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '14px' }}>
              2. Answer-Sheet Concept Diagnosis
            </div>

            {/* Strengths */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--accent-emerald)' }}>
                  ✅ Strong Concepts (Click to toggle):
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {standardStrengthOptions.map(tag => {
                  const isSelected = selectedStrengths.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleStrength(tag)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.76rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        border: isSelected ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-surface-elevated)',
                        color: isSelected ? '#6ee7b7' : 'var(--text-secondary)'
                      }}
                    >
                      {isSelected ? '✓ ' : '+ '}{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weaknesses */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--accent-rose)' }}>
                  ⚠️ Needs Reinforcement (Click to toggle):
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {standardWeaknessOptions.map(tag => {
                  const isSelected = selectedWeaknesses.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleWeakness(tag)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.76rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        border: isSelected ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'rgba(244, 63, 94, 0.2)' : 'var(--bg-surface-elevated)',
                        color: isSelected ? '#fda4af' : 'var(--text-secondary)'
                      }}
                    >
                      {isSelected ? '✗ ' : '+ '}{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specific Answer Sheet Observation */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Specific Answer Sheet Observation / Error Pattern:
              </label>
              <textarea 
                rows="2"
                value={answerSheetNotes}
                onChange={(e) => setAnswerSheetNotes(e.target.value)}
                placeholder="e.g. Skipped step in AVL tree rotation; sign error in discriminant formula..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <button 
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '14px' }}
              onClick={handleGenerate}
              id="btn-generate-comment"
            >
              <Sparkles size={16} />
              Synthesize Tailored Comments
            </button>
          </div>
        </div>

        {/* Right Column: AI-Generated Comments & Tone Switcher */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="card" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                3. Generated Feedback
              </div>
              {savedBadge && (
                <span className="badge badge-emerald" style={{ animation: 'fadeIn 0.2s ease-out' }}>
                  <Check size={12} /> Saved to Record!
                </span>
              )}
            </div>

            {/* Tone Selector Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button 
                className={`btn btn-sm ${selectedTone === 'professional' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleToneChange('professional')}
                style={{ flex: 1 }}
              >
                💼 Professional
              </button>
              <button 
                className={`btn btn-sm ${selectedTone === 'encouraging' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleToneChange('encouraging')}
                style={{ flex: 1 }}
              >
                🌟 Encouraging
              </button>
              <button 
                className={`btn btn-sm ${selectedTone === 'concise' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleToneChange('concise')}
                style={{ flex: 1 }}
              >
                ⚡ Concise
              </button>
            </div>

            {/* Tone Explanation Callout */}
            <div style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              marginBottom: '12px'
            }}>
              {selectedTone === 'professional' && "Formal academic evaluation for institutional permanent records and grade transcripts."}
              {selectedTone === 'encouraging' && "Growth-mindset oriented tone designed to motivate the student and engage parents positively."}
              {selectedTone === 'concise' && "Succinct summary optimized for character-restricted reporting systems or fast entry."}
            </div>

            {/* Editable Comment Box */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '14px' }}>
              <textarea 
                value={activeCommentText}
                onChange={(e) => setActiveCommentText(e.target.value)}
                style={{
                  width: '100%',
                  flex: 1,
                  minHeight: '180px',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  outline: 'none',
                  resize: 'none'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                <span>{activeCommentText.split(/\s+/).filter(Boolean).length} words</span>
                <span>{activeCommentText.length} characters</span>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-secondary"
                onClick={handleGenerate}
                title="Regenerate phrasing"
              >
                <RefreshCw size={15} />
                Regenerate
              </button>
              <button 
                className="btn btn-secondary"
                onClick={handleCopy}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? 'Copied!' : 'Copy Remark'}
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSaveToRecord}
              >
                <Save size={15} />
                Save to Record
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Batch Class Report Export */}
      {isBatchModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '1.1rem' }}>Cohort Report Card Remarks</h3>
              </div>
              <button 
                onClick={() => setIsBatchModalOpen(false)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Export batch comments for all students in the class, formatted for direct administrative upload into university portal software.
            </p>

            <div style={{
              background: '#0a0e17',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              maxHeight: '340px',
              overflowY: 'auto',
              border: '1px solid var(--border-subtle)',
              color: '#cbd5e1',
              marginBottom: '20px'
            }}>
              {batchReportText}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setIsBatchModalOpen(false)}
              >
                Close
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCopyBatch}
              >
                {copiedBatch ? <Check size={15} /> : <Copy size={15} />}
                {copiedBatch ? 'Batch Remarks Copied!' : 'Copy All Remarks'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
