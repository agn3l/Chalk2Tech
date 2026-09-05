import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  ShieldAlert, 
  Eye, 
  Sliders, 
  Download, 
  X, 
  ArrowRight, 
  Check, 
  GitCompare, 
  Cpu, 
  UserCheck, 
  Edit3,
  Calendar,
  Layers
} from 'lucide-react';
import { 
  demoDetailedSubmissions, 
  crossSimilarityMatrix, 
  getAiAnalysisDetails 
} from '../utils/assignmentAnalysis';

export default function AssignmentManager({ data, onUpdateAssignments }) {
  const assignmentInfo = data?.assignments?.activeAssignment || {
    id: "asg-3",
    title: "Lab 3: Binary Search Trees & AVL Balancing",
    subject: "Data Structures & Algorithms",
    deadline: "Today, 10:00 AM",
    totalMarks: 50,
    totalSubmissions: 38,
    lateCount: 3,
    flaggedCount: 4
  };

  const initialSubmissions = useMemo(() => data?.assignments?.submissions || [], [data]);
  const [submissions, setSubmissions] = useState(initialSubmissions);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'late', 'similarity', 'ai', 'ungraded'

  // Modals state
  const [diffModalData, setDiffModalData] = useState(null); // { studentA, studentB, score }
  const [aiModalData, setAiModalData] = useState(null); // submission object
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);

  // Sync back to parent if updated
  const updateSubmissionItem = (id, newFields) => {
    const updated = submissions.map(sub => {
      if (sub.id === id) {
        return { ...sub, ...newFields };
      }
      return sub;
    });
    setSubmissions(updated);
    if (onUpdateAssignments) {
      onUpdateAssignments(updated);
    }
  };

  // Quick grading handler
  const handleGradeChange = (id, newMarks) => {
    const marksVal = newMarks === '' ? null : Math.min(assignmentInfo.totalMarks, Math.max(0, parseInt(newMarks, 10) || 0));
    updateSubmissionItem(id, { marks: marksVal });
  };

  // Late penalty handler (-5 marks)
  const handleApplyLatePenalty = (id) => {
    const sub = submissions.find(s => s.id === id);
    if (sub && sub.marks !== null) {
      const penalized = Math.max(0, sub.marks - 5);
      updateSubmissionItem(id, { marks: penalized, status: 'Late Penalty Applied (-5)' });
    }
  };

  // Flag for Viva Voce
  const handleFlagForViva = (id) => {
    updateSubmissionItem(id, { status: 'Flagged for Oral Viva' });
    setAiModalData(null);
  };

  // Approve Submission
  const handleApproveSubmission = (id) => {
    updateSubmissionItem(id, { status: 'Verified & Approved' });
    setDiffModalData(null);
    setAiModalData(null);
  };

  // Metrics
  const lateSubmissionsCount = submissions.filter(s => s.isLate).length;
  const similarityFlagsCount = submissions.filter(s => s.similarityScore >= 50).length;
  const aiFlagsCount = submissions.filter(s => s.aiLikelihood >= 60).length;
  const ungradedCount = submissions.filter(s => s.marks === null).length;

  // Filtered Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      const matchesSearch = sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            sub.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      if (activeFilter === 'late') return sub.isLate;
      if (activeFilter === 'similarity') return sub.similarityScore >= 50;
      if (activeFilter === 'ai') return sub.aiLikelihood >= 60;
      if (activeFilter === 'ungraded') return sub.marks === null;
      return true;
    });
  }, [submissions, searchTerm, activeFilter]);

  // Exportable Grade Sheet Text
  const exportGradeSheetText = useMemo(() => {
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    let text = `=========================================================\n`;
    text += `ASSIGNMENT EVALUATION & INTEGRITY REPORT\n`;
    text += `Assignment: ${assignmentInfo.title}\n`;
    text += `Course: ${assignmentInfo.subject}\n`;
    text += `Max Marks: ${assignmentInfo.totalMarks}\n`;
    text += `Generated: ${dateStr}\n`;
    text += `=========================================================\n\n`;
    text += `ROLL NO   STUDENT NAME   SCORE   SUBMITTED   SIMILARITY   AI SCORE   STATUS\n`;
    text += `---------------------------------------------------------------------------------\n`;

    submissions.forEach(s => {
      const roll = s.rollNo.padEnd(8);
      const name = s.studentName.padEnd(14);
      const score = (s.marks !== null ? `${s.marks}/${assignmentInfo.totalMarks}` : 'PENDING').padEnd(8);
      const submit = (s.isLate ? `${s.submitTime} (LATE)` : `${s.submitTime} (OK)`).padEnd(14);
      const sim = `${s.similarityScore}%`.padEnd(12);
      const ai = `${s.aiLikelihood}%`.padEnd(10);
      const status = s.status;
      text += `${roll}  ${name} ${score} ${submit} ${sim} ${ai} ${status}\n`;
    });

    text += `\nSUMMARY STATISTICS:\n`;
    text += `- Total Evaluated: ${submissions.length - ungradedCount} / ${submissions.length}\n`;
    text += `- Flagged for Similarity: ${similarityFlagsCount}\n`;
    text += `- Flagged for AI Generation: ${aiFlagsCount}\n`;
    text += `- Late Submissions: ${lateSubmissionsCount}\n`;
    return text;
  }, [submissions, assignmentInfo, ungradedCount, similarityFlagsCount, aiFlagsCount, lateSubmissionsCount]);

  const handleCopyExport = () => {
    navigator.clipboard.writeText(exportGradeSheetText);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  return (
    <div className="page-container">
      {/* Top Banner & Module Header */}
      <div className="welcome-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="badge badge-indigo">
              <Calendar size={13} />
              {assignmentInfo.subject}
            </span>
            <span className="badge badge-rose">
              <AlertTriangle size={13} />
              {similarityFlagsCount + aiFlagsCount} Integrity Flags
            </span>
          </div>
          <h1 className="welcome-title">{assignmentInfo.title}</h1>
          <p className="welcome-subtitle">
            Automated submission verification with late timestamp tracking, cross-student code similarity analysis, and linguistic AI-generation heuristics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setIsMatrixModalOpen(true)}
            id="btn-similarity-matrix"
          >
            <GitCompare size={16} />
            Similarity Matrix
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setIsExportModalOpen(true)}
            id="btn-export-grades"
          >
            <Download size={16} />
            Export Grade Sheet
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="metrics-grid">
        {/* Late Submissions */}
        <div 
          className="metric-card" 
          style={{ borderColor: lateSubmissionsCount > 0 ? 'rgba(244, 63, 94, 0.4)' : undefined }}
          onClick={() => setActiveFilter(activeFilter === 'late' ? 'all' : 'late')}
        >
          <div className="metric-header">
            <span className="metric-label">Late Submissions</span>
            <div className="metric-icon-wrap" style={{ background: 'var(--accent-rose-subtle)', color: 'var(--accent-rose)' }}>
              <Clock size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: 'var(--accent-rose)' }}>{lateSubmissionsCount}</div>
          <div className="metric-subtext">
            Past 10:00 AM cutoff timestamp
          </div>
        </div>

        {/* High Similarity Alerts */}
        <div 
          className="metric-card" 
          style={{ borderColor: similarityFlagsCount > 0 ? 'rgba(245, 158, 11, 0.4)' : undefined }}
          onClick={() => setActiveFilter(activeFilter === 'similarity' ? 'all' : 'similarity')}
        >
          <div className="metric-header">
            <span className="metric-label">Similarity Collusion</span>
            <div className="metric-icon-wrap" style={{ background: 'var(--accent-amber-subtle)', color: 'var(--accent-amber)' }}>
              <GitCompare size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: 'var(--accent-amber)' }}>{similarityFlagsCount}</div>
          <div className="metric-subtext">
            Rahul ↔ Akhil (87% identical logic)
          </div>
        </div>

        {/* AI Likelihood */}
        <div 
          className="metric-card" 
          style={{ borderColor: aiFlagsCount > 0 ? 'rgba(168, 85, 247, 0.4)' : undefined }}
          onClick={() => setActiveFilter(activeFilter === 'ai' ? 'all' : 'ai')}
        >
          <div className="metric-header">
            <span className="metric-label">AI-Generated Flags</span>
            <div className="metric-icon-wrap" style={{ background: 'var(--accent-purple-subtle)', color: '#d8b4fe' }}>
              <Cpu size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: '#d8b4fe' }}>{aiFlagsCount}</div>
          <div className="metric-subtext">
            Uniform perplexity &amp; boilerplate
          </div>
        </div>

        {/* Grading Status */}
        <div 
          className="metric-card"
          onClick={() => setActiveFilter(activeFilter === 'ungraded' ? 'all' : 'ungraded')}
        >
          <div className="metric-header">
            <span className="metric-label">Needs Grading</span>
            <div className="metric-icon-wrap" style={{ background: 'var(--accent-primary-subtle)', color: 'var(--accent-primary)' }}>
              <Edit3 size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: ungradedCount > 0 ? 'var(--accent-primary)' : 'var(--accent-emerald)' }}>
            {ungradedCount}
          </div>
          <div className="metric-subtext">
            {ungradedCount === 0 ? 'All submissions evaluated' : 'Pending faculty scoring'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '240px', flex: '1' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Search by student name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              id="input-search-submissions"
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '0.88rem'
              }}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button 
              className={`btn btn-sm ${activeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveFilter('all')}
            >
              All ({submissions.length})
            </button>
            <button 
              className={`btn btn-sm ${activeFilter === 'late' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveFilter('late')}
              style={{ color: activeFilter === 'late' ? '#fff' : 'var(--accent-rose)' }}
            >
              🔴 Late ({lateSubmissionsCount})
            </button>
            <button 
              className={`btn btn-sm ${activeFilter === 'similarity' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveFilter('similarity')}
              style={{ color: activeFilter === 'similarity' ? '#fff' : 'var(--accent-amber)' }}
            >
              ⚠️ High Similarity ({similarityFlagsCount})
            </button>
            <button 
              className={`btn btn-sm ${activeFilter === 'ai' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveFilter('ai')}
              style={{ color: activeFilter === 'ai' ? '#fff' : '#d8b4fe' }}
            >
              🔮 High AI ({aiFlagsCount})
            </button>
            <button 
              className={`btn btn-sm ${activeFilter === 'ungraded' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveFilter('ungraded')}
            >
              📝 Needs Grading ({ungradedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '14px 20px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Student
                </th>
                <th style={{ padding: '14px 16px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Submit Timestamp
                </th>
                <th style={{ padding: '14px 16px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Code Similarity
                </th>
                <th style={{ padding: '14px 16px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  AI Likelihood
                </th>
                <th style={{ padding: '14px 16px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', width: '140px' }}>
                  Marks (/{assignmentInfo.totalMarks})
                </th>
                <th style={{ padding: '14px 20px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                  Audit Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No submissions found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map(sub => {
                  const isHighSim = sub.similarityScore >= 70;
                  const isHighAi = sub.aiLikelihood >= 60;

                  return (
                    <tr 
                      key={sub.id}
                      style={{ 
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background 0.15s ease',
                        background: (sub.isLate || isHighSim) ? 'rgba(244, 63, 94, 0.02)' : undefined
                      }}
                      className="attendance-row"
                    >
                      {/* Student Info */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: isHighSim ? 'rgba(244, 63, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                            color: isHighSim ? 'var(--accent-rose)' : '#a5b4fc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '0.85rem'
                          }}>
                            {sub.studentName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                              {sub.studentName}
                            </div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                              Roll: {sub.rollNo}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Timestamp & Late Indicator */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{sub.submitTime}</span>
                          {sub.isLate ? (
                            <span className="badge badge-rose" title="Submitted past 10:00 AM cutoff">
                              <Clock size={11} /> Late (35m)
                            </span>
                          ) : (
                            <span className="badge badge-emerald">
                              <CheckCircle2 size={11} /> On Time
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Similarity Score */}
                      <td style={{ padding: '14px 16px' }}>
                        {sub.similarityScore >= 50 ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="badge badge-rose" style={{ fontWeight: '700' }}>
                              <AlertTriangle size={11} />
                              {sub.similarityScore}% ↔ {sub.similarityWith}
                            </span>
                            <button 
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '3px 7px', fontSize: '0.74rem' }}
                              onClick={() => setDiffModalData({ studentA: sub.studentName, studentB: sub.similarityWith, score: sub.similarityScore })}
                              title="Compare code side-by-side"
                            >
                              <GitCompare size={12} /> Inspect
                            </button>
                          </div>
                        ) : (
                          <span className="badge badge-emerald">
                            {sub.similarityScore}% Clean
                          </span>
                        )}
                      </td>

                      {/* AI Likelihood */}
                      <td style={{ padding: '14px 16px' }}>
                        {isHighAi ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="badge badge-purple" style={{ fontWeight: '700' }}>
                              <Cpu size={11} /> {sub.aiLikelihood}% AI
                            </span>
                            <button 
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '3px 7px', fontSize: '0.74rem' }}
                              onClick={() => setAiModalData(sub)}
                              title="Inspect AI linguistic markers"
                            >
                              <Eye size={12} /> Details
                            </button>
                          </div>
                        ) : (
                          <span className="badge badge-emerald">
                            {sub.aiLikelihood}% Authentic
                          </span>
                        )}
                      </td>

                      {/* Marks Inline Input */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input 
                            type="number"
                            min="0"
                            max={assignmentInfo.totalMarks}
                            value={sub.marks !== null ? sub.marks : ''}
                            placeholder="Marks"
                            onChange={(e) => handleGradeChange(sub.id, e.target.value)}
                            style={{
                              width: '65px',
                              padding: '5px 8px',
                              borderRadius: 'var(--radius-sm)',
                              background: 'var(--bg-surface-elevated)',
                              border: sub.marks === null ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-medium)',
                              color: 'var(--text-primary)',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              outline: 'none',
                              textAlign: 'center'
                            }}
                          />
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            /{assignmentInfo.totalMarks}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                          {sub.isLate && sub.marks !== null && (
                            <button 
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--accent-rose)' }}
                              onClick={() => handleApplyLatePenalty(sub.id)}
                              title="Deduct 5 marks for late submission past cutoff"
                            >
                              -5 Late
                            </button>
                          )}

                          {isHighSim ? (
                            <button 
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--accent-amber)' }}
                              onClick={() => setDiffModalData({ studentA: sub.studentName, studentB: sub.similarityWith, score: sub.similarityScore })}
                            >
                              <GitCompare size={13} />
                              Diff
                            </button>
                          ) : (
                            <button 
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              onClick={() => setAiModalData(sub)}
                            >
                              <Eye size={13} />
                              Review
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Side-by-Side Plagiarism & Code Diff Comparator */}
      {diffModalData && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '920px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GitCompare size={20} style={{ color: 'var(--accent-rose)' }} />
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>
                    Code Similarity Comparison: {diffModalData.studentA} ↔ {diffModalData.studentB}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Algorithm: Abstract Syntax Tree &amp; Structural Token Match
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setDiffModalData(null)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Match Overview Ribbon */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              marginBottom: '16px'
            }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Overall Similarity: </span>
                <b style={{ fontSize: '1.1rem', color: 'var(--accent-rose)', marginLeft: '4px' }}>
                  {diffModalData.score}% Match
                </b>
                <span style={{ fontSize: '0.78rem', color: '#fda4af', marginLeft: '12px' }}>
                  (Identical helper structure with variable renaming pattern)
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-rose">AST Match: 92%</span>
                <span className="badge badge-amber">Token Match: 89%</span>
              </div>
            </div>

            {/* Side by Side Code Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              {/* Left Student */}
              <div style={{ background: '#0a0e17', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '12px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--accent-rose)' }}>
                    {diffModalData.studentA} (Submitted 10:35 AM - LATE)
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Roll: CS2401</span>
                </div>
                <pre style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.76rem',
                  lineHeight: '1.5',
                  color: '#e2e8f0',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap'
                }}>
                  {demoDetailedSubmissions["sub-1"]?.codeSnippet}
                </pre>
              </div>

              {/* Right Student */}
              <div style={{ background: '#0a0e17', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '12px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--accent-emerald)' }}>
                    {diffModalData.studentB} (Submitted 09:48 AM - ON TIME)
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Roll: CS2402</span>
                </div>
                <pre style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.76rem',
                  lineHeight: '1.5',
                  color: '#e2e8f0',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap'
                }}>
                  {demoDetailedSubmissions["sub-2"]?.codeSnippet}
                </pre>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                * Akhil submitted 47 minutes earlier. Investigation indicates Rahul adopted Akhil's rotation implementation.
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setDiffModalData(null)}
                >
                  Close Viewer
                </button>
                <button 
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)' }}
                  onClick={() => handleApplyLatePenalty("sub-1")}
                >
                  Apply Collusion Penalty
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: AI Likelihood Heuristics Inspector */}
      {aiModalData && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Cpu size={20} style={{ color: '#d8b4fe' }} />
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>AI Likelihood Analysis: {aiModalData.studentName}</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Natural Language Processing &amp; Perplexity Variance Audit
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setAiModalData(null)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Score Banner */}
            {(() => {
              const aiDetails = getAiAnalysisDetails(aiModalData.aiLikelihood);
              return (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(168, 85, 247, 0.1)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Synthesized Content Probability</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#d8b4fe', fontFamily: 'var(--font-display)' }}>
                        {aiModalData.aiLikelihood}% Probability
                      </div>
                    </div>
                    <span className={`badge ${aiDetails.badgeClass}`} style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
                      {aiDetails.riskLevel}
                    </span>
                  </div>

                  {/* 3 Linguistic Heuristic Metrics */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '2px' }}>
                        1. Burstiness (Sentence Length Cadence)
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {aiDetails.burstiness}
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '2px' }}>
                        2. Perplexity Variance (Token Predictability)
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {aiDetails.perplexity}
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '2px' }}>
                        3. Structural Formulaicness
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {aiDetails.structuralConsistency}
                      </div>
                    </div>
                  </div>

                  {/* Student Submission Snippet */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Sample Submitted Excerpt:
                    </div>
                    <div style={{
                      background: '#0a0e17',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.82rem',
                      lineHeight: '1.5',
                      color: '#cbd5e1',
                      border: '1px solid var(--border-subtle)',
                      fontStyle: 'italic'
                    }}>
                      "{aiModalData.snippet}"
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleApproveSubmission(aiModalData.id)}
                    >
                      Approve Work
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleFlagForViva(aiModalData.id)}
                    >
                      Flag for Oral Viva Voce
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Modal 3: Cross Similarity Matrix View */}
      {isMatrixModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GitCompare size={18} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '1.1rem' }}>Cohort Cross-Similarity Matrix</h3>
              </div>
              <button 
                onClick={() => setIsMatrixModalOpen(false)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Pairwise similarity matrix between student submissions. Highlights potential cluster copying or shared assignments.
            </p>

            <div style={{ overflowX: 'auto', marginBottom: '18px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '10px 14px', color: 'var(--text-secondary)', textAlign: 'left' }}>Student Pair</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-secondary)', textAlign: 'center' }}>Similarity %</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-secondary)', textAlign: 'center' }}>Risk Level</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-secondary)', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {crossSimilarityMatrix.map((pair, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px 14px', fontWeight: '600' }}>
                        {pair.studentA} ↔ {pair.studentB}
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: '700', color: pair.score >= 50 ? 'var(--accent-rose)' : 'inherit' }}>
                        {pair.score}%
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <span className={`badge ${pair.score >= 50 ? 'badge-rose' : 'badge-emerald'}`}>
                          {pair.score >= 50 ? 'High Similarity' : 'Clean'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                        {pair.score >= 50 ? (
                          <button 
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                            onClick={() => {
                              setIsMatrixModalOpen(false);
                              setDiffModalData({ studentA: pair.studentA, studentB: pair.studentB, score: pair.score });
                            }}
                          >
                            View Diff
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Verified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setIsMatrixModalOpen(false)}
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Export Grade Sheet */}
      {isExportModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={18} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '1.1rem' }}>Export Assignment Grade Sheet</h3>
              </div>
              <button 
                onClick={() => setIsExportModalOpen(false)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{
              background: '#0a0e17',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              maxHeight: '320px',
              overflowY: 'auto',
              border: '1px solid var(--border-subtle)',
              color: '#cbd5e1',
              marginBottom: '20px'
            }}>
              {exportGradeSheetText}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setIsExportModalOpen(false)}
              >
                Close
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCopyExport}
              >
                {copiedExport ? <Check size={15} /> : <FileText size={15} />}
                {copiedExport ? 'Report Copied!' : 'Copy Evaluation Summary'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
