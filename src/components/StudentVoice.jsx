import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  HelpCircle, 
  ThumbsUp, 
  TrendingUp, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Filter, 
  Send, 
  Calendar, 
  Award, 
  BookOpen, 
  Copy, 
  Check, 
  Download,
  Users,
  QrCode,
  Smartphone
} from 'lucide-react';

export default function StudentVoice({ data, onUpdateStudentVoice }) {
  const initialVoiceData = data?.studentVoice || {
    topic: "Module 4: Dynamic Programming & Binary Search Trees",
    classDate: "September 5, 2026",
    ratingStats: {
      fullyUnderstood: 18,
      mostlyUnderstood: 13,
      needExplanation: 8,
      didntUnderstand: 3,
      totalVotes: 42
    },
    anonymousNotes: [
      {
        id: "note-1",
        type: "note",
        message: "I think we need more live coding examples for linked lists before jumping into tree balancing.",
        understandingLevel: "Need more explanation",
        timestamp: "Today, 11:20 AM"
      },
      {
        id: "note-2",
        type: "suggestion",
        message: "Can we have one more revision session dedicated strictly to past year exam numericals?",
        understandingLevel: "Mostly understood",
        timestamp: "Today, 09:45 AM"
      },
      {
        id: "note-3",
        type: "note",
        message: "Could you explain the difference between top-down memoization and bottom-up tabulation again on the blackboard?",
        understandingLevel: "Didn't understand",
        timestamp: "Yesterday, 04:15 PM"
      },
      {
        id: "note-4",
        type: "suggestion",
        message: "The step-by-step chalk diagrams really helped today! Sharing the diagram slides on the portal would be great.",
        understandingLevel: "Fully understood",
        timestamp: "Yesterday, 02:30 PM"
      }
    ]
  };

  const [voiceData, setVoiceData] = useState(initialVoiceData);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'doubts', 'suggestions'
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isActionPlanModalOpen, setIsActionPlanModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copiedPlan, setCopiedPlan] = useState(false);
  const [mobileVotedSuccess, setMobileVotedSuccess] = useState(false);


  // Dynamic poll score calculation
  const stats = voiceData.ratingStats;
  const totalVotes = stats.fullyUnderstood + stats.mostlyUnderstood + stats.needExplanation + stats.didntUnderstand;

  // Weighted comprehension percentage:
  // Fully (100%), Mostly (75%), Need (40%), Didn't (10%)
  const overallComprehensionPct = useMemo(() => {
    if (totalVotes === 0) return 0;
    const weightedSum = (stats.fullyUnderstood * 1.0) + 
                        (stats.mostlyUnderstood * 0.75) + 
                        (stats.needExplanation * 0.40) + 
                        (stats.didntUnderstand * 0.10);
    return Math.round((weightedSum / totalVotes) * 100);
  }, [stats, totalVotes]);

  // Vote percentages
  const fullyPct = totalVotes ? Math.round((stats.fullyUnderstood / totalVotes) * 100) : 0;
  const mostlyPct = totalVotes ? Math.round((stats.mostlyUnderstood / totalVotes) * 100) : 0;
  const needPct = totalVotes ? Math.round((stats.needExplanation / totalVotes) * 100) : 0;
  const didntPct = totalVotes ? Math.round((stats.didntUnderstand / totalVotes) * 100) : 0;

  // Handle live student poll vote simulation
  const handleVote = (tierKey) => {
    const updatedStats = {
      ...stats,
      [tierKey]: stats[tierKey] + 1,
      totalVotes: totalVotes + 1
    };

    const updated = {
      ...voiceData,
      ratingStats: updatedStats
    };

    setVoiceData(updated);
    if (onUpdateStudentVoice) {
      onUpdateStudentVoice(updated, overallComprehensionPct);
    }
  };

  // Submit new anonymous student note
  const handleSubmitNote = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const message = formData.get('message')?.toString().trim();
    const understandingLevel = formData.get('understandingLevel')?.toString() || "Need more explanation";
    const type = formData.get('type')?.toString() || "note";

    if (!message) return;

    const newNote = {
      id: `note-${Date.now()}`,
      type,
      message,
      understandingLevel,
      timestamp: "Just now"
    };

    // Also update vote counts corresponding to this tier
    let tierKey = 'needExplanation';
    if (understandingLevel === 'Fully understood') tierKey = 'fullyUnderstood';
    if (understandingLevel === 'Mostly understood') tierKey = 'mostlyUnderstood';
    if (understandingLevel === "Didn't understand") tierKey = 'didntUnderstand';

    const updatedStats = {
      ...stats,
      [tierKey]: stats[tierKey] + 1,
      totalVotes: totalVotes + 1
    };

    const updated = {
      ...voiceData,
      ratingStats: updatedStats,
      anonymousNotes: [newNote, ...voiceData.anonymousNotes]
    };

    setVoiceData(updated);
    if (onUpdateStudentVoice) {
      onUpdateStudentVoice(updated);
    }
    setIsSubmitModalOpen(false);
  };

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return voiceData.anonymousNotes.filter(n => {
      if (activeFilter === 'doubts') return n.understandingLevel === "Didn't understand" || n.understandingLevel === "Need more explanation";
      if (activeFilter === 'suggestions') return n.type === 'suggestion' || n.understandingLevel === 'Mostly understood';
      return true;
    });
  }, [voiceData.anonymousNotes, activeFilter]);

  // Action plan text
  const actionPlanText = useMemo(() => {
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    let text = `=========================================================\n`;
    text += `FACULTY PEDAGOGICAL INTERVENTION PLAN\n`;
    text += `Topic: ${voiceData.topic}\n`;
    text += `Date: ${dateStr}\n`;
    text += `Aggregate Class Comprehension: ${overallComprehensionPct}%\n`;
    text += `=========================================================\n\n`;

    text += `DIAGNOSTIC SUMMARY:\n`;
    text += `- Fully Understood: ${fullyPct}% (${stats.fullyUnderstood} students)\n`;
    text += `- Mostly Understood: ${mostlyPct}% (${stats.mostlyUnderstood} students)\n`;
    text += `- Requires Additional Explanation: ${needPct}% (${stats.needExplanation} students)\n`;
    text += `- Critical Difficulty Zone: ${didntPct}% (${stats.didntUnderstand} students)\n\n`;

    text += `RECOMMENDED FACULTY ACTION STEPS:\n`;
    text += `1. Targeted Micro-Lecture (15 mins):\n`;
    text += `   - Conduct a dedicated blackboard step-by-step walkthrough on "Dynamic Programming: Top-Down Memoization vs Bottom-Up Tabulation".\n\n`;
    text += `2. Pre-Requisite Reinforcement:\n`;
    text += `   - Review singly linked list pointer manipulation before concluding AVL tree rotations.\n\n`;
    text += `3. Resource Upload:\n`;
    text += `   - Share photographed chalkboard tree rotation trace diagrams directly to student portal.\n\n`;
    text += `4. Revision Session Allocation:\n`;
    text += `   - Reserve the final 20 minutes of tomorrow's session for past-year university numericals.\n`;

    return text;
  }, [voiceData, overallComprehensionPct, fullyPct, mostlyPct, needPct, didntPct, stats]);

  const handleCopyActionPlan = () => {
    navigator.clipboard.writeText(actionPlanText);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2000);
  };

  return (
    <div className="page-container">
      {/* Top Banner & Module Header */}
      <div className="welcome-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="badge badge-indigo">
              <Calendar size={13} />
              {voiceData.classDate}
            </span>
            <span className="badge badge-emerald">
              <Users size={13} />
              {totalVotes} Student Poll Responses
            </span>
          </div>
          <h1 className="welcome-title">{voiceData.topic}</h1>
          <p className="welcome-subtitle">
            Real-time anonymous comprehension pulse &amp; student doubts feed. Empowers shy students to voice conceptual bottlenecks before exams occur.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => { setIsQrModalOpen(true); setMobileVotedSuccess(false); }}
            id="btn-student-qr"
            style={{ borderColor: 'rgba(99, 102, 241, 0.4)', background: 'rgba(99, 102, 241, 0.15)', color: '#c7d2fe' }}
          >
            <QrCode size={16} />
            📱 Student QR &amp; Live Mobile Vote
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => setIsActionPlanModalOpen(true)}
            id="btn-action-plan"
          >
            <BookOpen size={16} />
            Faculty Action Plan
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setIsSubmitModalOpen(true)}
            id="btn-submit-doubt"
          >
            <Plus size={16} />
            Post Anonymous Doubt
          </button>
        </div>
      </div>


      {/* Main Comprehension Pulse Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(26, 39, 68, 0.7) 0%, rgba(19, 29, 53, 0.9) 100%)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
        <div className="card-header" style={{ marginBottom: '14px' }}>
          <div className="card-title">
            <TrendingUp size={20} style={{ color: 'var(--accent-primary)' }} />
            <span>Classroom Conceptual Understanding Meter</span>
            <span className="badge badge-indigo">Synchronized with Overview</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Overall Comprehension Index:</span>
            <span style={{ fontSize: '1.6rem', fontWeight: '800', color: overallComprehensionPct >= 70 ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontFamily: 'var(--font-display)' }}>
              {overallComprehensionPct}%
            </span>
          </div>
        </div>

        {/* Segmented Progress Bar */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{
            height: '14px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.08)',
            display: 'flex',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ width: `${fullyPct}%`, background: 'var(--accent-emerald)', transition: 'width 0.4s ease' }} title={`Fully: ${fullyPct}%`} />
            <div style={{ width: `${mostlyPct}%`, background: '#6366f1', transition: 'width 0.4s ease' }} title={`Mostly: ${mostlyPct}%`} />
            <div style={{ width: `${needPct}%`, background: 'var(--accent-amber)', transition: 'width 0.4s ease' }} title={`Need Explanation: ${needPct}%`} />
            <div style={{ width: `${didntPct}%`, background: 'var(--accent-rose)', transition: 'width 0.4s ease' }} title={`Didn't Understand: ${didntPct}%`} />
          </div>
        </div>

        {/* 4 Stat Cards for Each Understanding Band */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {/* Fully */}
          <div style={{ background: 'var(--bg-surface)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Fully Understood</span>
              <span className="badge badge-emerald">{fullyPct}%</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-emerald)' }}>{stats.fullyUnderstood} votes</div>
          </div>

          {/* Mostly */}
          <div style={{ background: 'var(--bg-surface)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Mostly Understood</span>
              <span className="badge badge-indigo">{mostlyPct}%</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#818cf8' }}>{stats.mostlyUnderstood} votes</div>
          </div>

          {/* Need Explanation */}
          <div style={{ background: 'var(--bg-surface)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Need Explanation</span>
              <span className="badge badge-amber">{needPct}%</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-amber)' }}>{stats.needExplanation} votes</div>
          </div>

          {/* Didn't Understand */}
          <div style={{ background: 'var(--bg-surface)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Didn't Understand</span>
              <span className="badge badge-rose">{didntPct}%</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-rose)' }}>{stats.didntUnderstand} votes</div>
          </div>
        </div>

        {/* Live Simulation Controls for Presentation */}
        <div style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '0.84rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Live Hackathon Poll Simulator:
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              (Click any button to simulate an instant student vote!)
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => handleVote('fullyUnderstood')}
              style={{ color: 'var(--accent-emerald)' }}
            >
              +1 Fully
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => handleVote('mostlyUnderstood')}
              style={{ color: '#818cf8' }}
            >
              +1 Mostly
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => handleVote('needExplanation')}
              style={{ color: 'var(--accent-amber)' }}
            >
              +1 Need Help
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => handleVote('didntUnderstand')}
              style={{ color: 'var(--accent-rose)' }}
            >
              +1 Didn't Get It
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Doubts Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={18} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Anonymous Student Doubts &amp; Feedback</h2>
          <span className="badge badge-indigo">{filteredNotes.length} notes</span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            className={`btn btn-sm ${activeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveFilter('all')}
          >
            All Feedback ({voiceData.anonymousNotes.length})
          </button>
          <button 
            className={`btn btn-sm ${activeFilter === 'doubts' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveFilter('doubts')}
            style={{ color: activeFilter === 'doubts' ? '#fff' : 'var(--accent-rose)' }}
          >
            ⚠️ Doubts &amp; Difficulties
          </button>
          <button 
            className={`btn btn-sm ${activeFilter === 'suggestions' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveFilter('suggestions')}
          >
            💡 Pace &amp; Suggestions
          </button>
        </div>
      </div>

      {/* Anonymous Notes Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {filteredNotes.map((note, idx) => {
          const isDanger = note.understandingLevel === "Didn't understand";
          const isWarning = note.understandingLevel === "Need more explanation";
          const badgeClass = isDanger ? 'badge-rose' : isWarning ? 'badge-amber' : 'badge-emerald';

          return (
            <div 
              key={note.id} 
              className="card"
              style={{ 
                borderLeft: `4px solid ${isDanger ? 'var(--accent-rose)' : isWarning ? 'var(--accent-amber)' : 'var(--accent-emerald)'}`,
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#a5b4fc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.74rem',
                      fontWeight: '700'
                    }}>
                      ?
                    </div>
                    <span style={{ fontSize: '0.84rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      Anonymous Student
                    </span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {note.timestamp}
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.55', marginBottom: '14px' }}>
                  "{note.message}"
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <span className={`badge ${badgeClass}`} style={{ fontSize: '0.74rem' }}>
                  {note.understandingLevel}
                </span>

                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {note.type === 'suggestion' ? '💡 Pedagogical Suggestion' : '❓ Conceptual Doubt'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal 1: Post Anonymous Doubt */}
      {isSubmitModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={18} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '1.1rem' }}>Submit Anonymous Doubt / Feedback</h3>
              </div>
              <button 
                onClick={() => setIsSubmitModalOpen(false)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitNote} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  How well did you understand today's lecture on {voiceData.topic}?
                </label>
                <select 
                  name="understandingLevel"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                >
                  <option value="Need more explanation">🟡 Need more explanation on a specific step</option>
                  <option value="Didn't understand">🔴 Didn't understand — need revision</option>
                  <option value="Mostly understood">🔵 Mostly understood — just a minor question</option>
                  <option value="Fully understood">🟢 Fully understood — loved the chalk diagrams</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Category
                </label>
                <select 
                  name="type"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                >
                  <option value="note">❓ Conceptual Question / Doubt</option>
                  <option value="suggestion">💡 Teaching Pace / Revision Suggestion</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Your Anonymous Question or Note for Dr. Arvind Sharma:
                </label>
                <textarea 
                  name="message"
                  required
                  rows="3"
                  placeholder="e.g. Could you explain the left-right double rotation with a diagram on the blackboard again tomorrow?"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    fontSize: '0.86rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                fontSize: '0.78rem',
                color: '#6ee7b7'
              }}>
                🔒 100% Anonymous: No student roll numbers or identity headers are stored with this feedback.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setIsSubmitModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Post Note Anonymously
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Faculty Action Plan */}
      {isActionPlanModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '1.1rem' }}>Faculty Pedagogical Action Plan</h3>
              </div>
              <button 
                onClick={() => setIsActionPlanModalOpen(false)}
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
              maxHeight: '340px',
              overflowY: 'auto',
              border: '1px solid var(--border-subtle)',
              color: '#cbd5e1',
              marginBottom: '20px'
            }}>
              {actionPlanText}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setIsActionPlanModalOpen(false)}
              >
                Close
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCopyActionPlan}
              >
                {copiedPlan ? <Check size={15} /> : <Copy size={15} />}
                {copiedPlan ? 'Action Plan Copied!' : 'Copy Action Plan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Student Live QR Code & Mobile Voting Simulator */}
      {isQrModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '820px', padding: '24px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Smartphone size={20} style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>How Students Vote Anonymously</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Scan QR code on blackboard or join via short URL (Zero login, 100% anonymous)
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsQrModalOpen(false)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '24px', alignItems: 'center' }}>
              {/* Left Column: Projected QR Code */}
              <div style={{
                background: '#0a0e17',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '12px' }}>
                  [ PROJECT ON BLACKBOARD ]
                </div>

                {/* Styled SVG QR Code */}
                <div style={{
                  background: '#ffffff',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  display: 'inline-block',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                  marginBottom: '16px'
                }}>
                  <svg width="150" height="150" viewBox="0 0 100 100" fill="none">
                    {/* QR Code Position Patterns */}
                    <rect x="5" y="5" width="30" height="30" fill="#0f172a" rx="4"/>
                    <rect x="11" y="11" width="18" height="18" fill="#ffffff" rx="2"/>
                    <rect x="15" y="15" width="10" height="10" fill="#0f172a" rx="1"/>

                    <rect x="65" y="5" width="30" height="30" fill="#0f172a" rx="4"/>
                    <rect x="71" y="11" width="18" height="18" fill="#ffffff" rx="2"/>
                    <rect x="75" y="15" width="10" height="10" fill="#0f172a" rx="1"/>

                    <rect x="5" y="65" width="30" height="30" fill="#0f172a" rx="4"/>
                    <rect x="11" y="71" width="18" height="18" fill="#ffffff" rx="2"/>
                    <rect x="15" y="75" width="10" height="10" fill="#0f172a" rx="1"/>

                    {/* Data Pattern Dots */}
                    <rect x="42" y="8" width="6" height="6" fill="#6366f1"/>
                    <rect x="52" y="18" width="6" height="6" fill="#0f172a"/>
                    <rect x="42" y="28" width="6" height="6" fill="#0f172a"/>
                    <rect x="10" y="42" width="6" height="6" fill="#0f172a"/>
                    <rect x="22" y="48" width="6" height="6" fill="#6366f1"/>
                    <rect x="38" y="42" width="6" height="6" fill="#0f172a"/>
                    <rect x="50" y="48" width="6" height="6" fill="#0f172a"/>
                    <rect x="62" y="42" width="6" height="6" fill="#6366f1"/>
                    <rect x="78" y="48" width="6" height="6" fill="#0f172a"/>
                    <rect x="88" y="42" width="6" height="6" fill="#0f172a"/>
                    <rect x="42" y="62" width="6" height="6" fill="#0f172a"/>
                    <rect x="52" y="72" width="6" height="6" fill="#6366f1"/>
                    <rect x="68" y="68" width="6" height="6" fill="#0f172a"/>
                    <rect x="78" y="78" width="6" height="6" fill="#0f172a"/>
                    <rect x="88" y="88" width="6" height="6" fill="#0f172a"/>
                  </svg>
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Scan with Phone Camera
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  URL: <code style={{ color: '#818cf8', fontWeight: '700' }}>chalk2tech.edu/poll</code>
                </div>
                <div style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(99, 102, 241, 0.4)', fontSize: '0.75rem', color: '#c7d2fe' }}>
                  Room PIN: <b>CS-302</b>
                </div>
              </div>

              {/* Right Column: Live Mock Student Phone View */}
              <div style={{
                background: '#090d16',
                border: '2px solid rgba(99, 102, 241, 0.4)',
                borderRadius: '24px',
                padding: '20px 18px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
              }}>
                {/* Mock phone status bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span>📱 Student Mobile View</span>
                  <span>100% Anonymous</span>
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {voiceData.topic}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Faculty: Dr. Arvind Sharma
                </div>

                {mobileVotedSuccess ? (
                  <div style={{
                    padding: '28px 16px',
                    textAlign: 'center',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <CheckCircle2 size={36} style={{ color: 'var(--accent-emerald)', margin: '0 auto 10px' }} />
                    <div style={{ fontWeight: '700', fontSize: '1rem', color: '#6ee7b7', marginBottom: '4px' }}>
                      Vote Recorded Anonymously!
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                      The faculty's comprehension pulse meter just updated in real time.
                    </div>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setMobileVotedSuccess(false)}
                      style={{ fontSize: '0.78rem' }}
                    >
                      Cast Another Test Vote
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      How well do you understand today's topic?
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => { handleVote('fullyUnderstood'); setMobileVotedSuccess(true); }}
                        style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '0.8rem', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                      >
                        <span style={{ fontSize: '1.1rem', marginRight: '6px' }}>🟢</span>
                        <span>I Understood Fully!</span>
                      </button>

                      <button 
                        className="btn btn-secondary"
                        onClick={() => { handleVote('mostlyUnderstood'); setMobileVotedSuccess(true); }}
                        style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '0.8rem', borderColor: 'rgba(99, 102, 241, 0.4)' }}
                      >
                        <span style={{ fontSize: '1.1rem', marginRight: '6px' }}>🔵</span>
                        <span>Mostly Understood</span>
                      </button>

                      <button 
                        className="btn btn-secondary"
                        onClick={() => { handleVote('needExplanation'); setMobileVotedSuccess(true); }}
                        style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '0.8rem', borderColor: 'rgba(245, 158, 11, 0.4)' }}
                      >
                        <span style={{ fontSize: '1.1rem', marginRight: '6px' }}>🟡</span>
                        <span>Need More Explanation</span>
                      </button>

                      <button 
                        className="btn btn-secondary"
                        onClick={() => { handleVote('didntUnderstand'); setMobileVotedSuccess(true); }}
                        style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '0.8rem', borderColor: 'rgba(244, 63, 94, 0.4)' }}
                      >
                        <span style={{ fontSize: '1.1rem', marginRight: '6px' }}>🔴</span>
                        <span>Didn't Understand / Please Revise</span>
                      </button>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      Clicking any button immediately updates the teacher's comprehension gauge.
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setIsQrModalOpen(false)}
              >
                Close Simulator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

