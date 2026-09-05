import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  Clock, 
  Bot, 
  BrainCircuit, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles,
  Grid3X3,
  FileCheck,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export default function DashboardOverview({ data, onSelectTab }) {
  const { metrics, understandingBreakdown, recentAlerts, recentActivity, facultyName, course } = data;

  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div>
          <div style={{ 
            fontSize: '0.78rem', 
            fontWeight: 700, 
            color: '#a5b4fc', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em',
            marginBottom: '4px'
          }}>
            Faculty Intelligence Command Center
          </div>
          <h1 className="welcome-title">WELCOME, FACULTY 👋</h1>
          <p className="welcome-subtitle">
            Overview for <strong>{course}</strong>. Monitor attendance risks, examine assignment similarity flags, and gauge real-time classroom comprehension.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-primary"
            onClick={() => onSelectTab('assignments')}
          >
            <Sparkles size={16} />
            <span>Review Assignment 3</span>
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => onSelectTab('attendance')}
          >
            <AlertTriangle size={16} color="var(--accent-amber)" />
            <span>Attendance Risks</span>
          </button>
        </div>
      </div>

      {/* Class Overview KPI Metrics */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
            Class Overview
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Real-time batch sync: Active
          </span>
        </div>

        <div className="metrics-grid">
          {/* Total Students */}
          <div className="metric-card" onClick={() => onSelectTab('attendance')}>
            <div className="metric-header">
              <span className="metric-label">Total Students</span>
              <div className="metric-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
                <Users size={20} />
              </div>
            </div>
            <div className="metric-value">{metrics.totalStudents}</div>
            <div className="metric-subtext">
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>35 Regular</span>
              <span>•</span>
              <span style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>7 At-Risk</span>
            </div>
          </div>

          {/* Attendance Alerts */}
          <div className="metric-card" onClick={() => onSelectTab('attendance')}>
            <div className="metric-header">
              <span className="metric-label">Attendance Alerts</span>
              <div className="metric-icon-wrap" style={{ background: 'var(--accent-rose-subtle)', color: 'var(--accent-rose)' }}>
                <ShieldAlert size={20} />
              </div>
            </div>
            <div className="metric-value" style={{ color: 'var(--accent-rose)' }}>
              {metrics.attendanceAlerts}
            </div>
            <div className="metric-subtext">
              <span className="badge badge-rose">🔴 Below 75% Cutoff</span>
            </div>
          </div>

          {/* Assignment Alerts */}
          <div className="metric-card" onClick={() => onSelectTab('assignments')}>
            <div className="metric-header">
              <span className="metric-label">Assignment Alerts</span>
              <div className="metric-icon-wrap" style={{ background: 'var(--accent-amber-subtle)', color: 'var(--accent-amber)' }}>
                <Clock size={20} />
              </div>
            </div>
            <div className="metric-value" style={{ color: 'var(--accent-amber)' }}>
              {metrics.assignmentAlerts}
            </div>
            <div className="metric-subtext">
              <span className="badge badge-amber">⚠️ Past 10:00 AM Cutoff</span>
            </div>
          </div>

          {/* Possible AI / Similarity Flags */}
          <div className="metric-card" onClick={() => onSelectTab('assignments')}>
            <div className="metric-header">
              <span className="metric-label">AI / Similarity Flags</span>
              <div className="metric-icon-wrap" style={{ background: 'var(--accent-purple-subtle)', color: 'var(--accent-purple)' }}>
                <Bot size={20} />
              </div>
            </div>
            <div className="metric-value" style={{ color: '#c084fc' }}>
              {metrics.aiSimilarityFlags}
            </div>
            <div className="metric-subtext">
              <span className="badge badge-purple">🤖 1 High AI • 1 Match</span>
            </div>
          </div>

          {/* Class Understanding */}
          <div className="metric-card" onClick={() => onSelectTab('student-voice')}>
            <div className="metric-header">
              <span className="metric-label">Class Understanding</span>
              <div className="metric-icon-wrap" style={{ background: 'var(--accent-emerald-subtle)', color: 'var(--accent-emerald)' }}>
                <BrainCircuit size={20} />
              </div>
            </div>
            <div className="metric-value" style={{ color: 'var(--accent-emerald)' }}>
              {metrics.classUnderstanding}%
            </div>
            <div className="metric-subtext">
              <span className="badge badge-emerald">🙂 73% Comprehension</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Layout: Recent Alerts & Understanding Breakdown */}
      <div className="dashboard-columns">
        {/* Left Column: Recent Alerts */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <AlertTriangle size={18} color="var(--accent-amber)" />
                <span>Recent Critical Alerts</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Automated flags requiring faculty attention
              </div>
            </div>
            <span className="badge badge-indigo">{recentAlerts.length} Action Items</span>
          </div>

          <div>
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className="alert-item"
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectTab(alert.targetTab)}
              >
                <div 
                  className="alert-icon" 
                  style={{
                    background: alert.severity === 'danger' ? 'var(--accent-rose-subtle)' :
                                alert.severity === 'warning' ? 'var(--accent-amber-subtle)' :
                                alert.severity === 'purple' ? 'var(--accent-purple-subtle)' :
                                'rgba(99, 102, 241, 0.15)',
                    color: alert.severity === 'danger' ? 'var(--accent-rose)' :
                           alert.severity === 'warning' ? 'var(--accent-amber)' :
                           alert.severity === 'purple' ? 'var(--accent-purple)' :
                           'var(--accent-primary)'
                  }}
                >
                  {alert.type === 'attendance' && <ShieldAlert size={18} />}
                  {alert.type === 'similarity' && <AlertTriangle size={18} />}
                  {alert.type === 'ai' && <Bot size={18} />}
                  {alert.type === 'voice' && <MessageSquare size={18} />}
                </div>

                <div className="alert-content">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="alert-title">{alert.title}</div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {alert.timestamp}
                    </span>
                  </div>
                  <div className="alert-desc">{alert.desc}</div>
                </div>

                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Class Understanding Meter */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <BrainCircuit size={18} color="var(--accent-emerald)" />
                <span>Class Understanding Meter</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Aggregated from anonymous student feedback
              </div>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onSelectTab('student-voice')}
            >
              Details
            </button>
          </div>

          {/* Big Percentage Showcase */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '20px', 
            padding: '16px', 
            background: 'var(--bg-surface-elevated)', 
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'conic-gradient(var(--accent-emerald) 0deg 263deg, rgba(255,255,255,0.08) 263deg 360deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              flexShrink: 0
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'var(--bg-surface-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.05rem',
                color: 'var(--accent-emerald)'
              }}>
                73%
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                Healthy Topic Comprehension
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Most students understand BST balancing concepts; small subset requested linked list revision.
              </div>
            </div>
          </div>

          {/* Breakdown Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>😀 Fully understood</span>
                <span style={{ color: 'var(--accent-emerald)' }}>{understandingBreakdown.fullyUnderstood}%</span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${understandingBreakdown.fullyUnderstood}%`, background: 'var(--accent-emerald)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>🙂 Mostly understood</span>
                <span style={{ color: '#38bdf8' }}>{understandingBreakdown.mostlyUnderstood}%</span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${understandingBreakdown.mostlyUnderstood}%`, background: '#38bdf8' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>😐 Need more explanation</span>
                <span style={{ color: 'var(--accent-amber)' }}>{understandingBreakdown.needExplanation}%</span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${understandingBreakdown.needExplanation}%`, background: 'var(--accent-amber)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>😕 Didn't understand</span>
                <span style={{ color: 'var(--accent-rose)' }}>{understandingBreakdown.didntUnderstand}%</span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${understandingBreakdown.didntUnderstand}%`, background: 'var(--accent-rose)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed & Module Quick Launch */}
      <div className="dashboard-columns">
        {/* Left: Recent Activity */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Clock size={18} color="var(--accent-primary)" />
                <span>Recent Classroom Activity</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Live submission log and anonymous check-ins
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivity.map((act) => (
              <div 
                key={act.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '14px', 
                  padding: '12px', 
                  background: 'var(--bg-surface-elevated)', 
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ 
                  padding: '4px 8px', 
                  borderRadius: 'var(--radius-sm)', 
                  background: 'rgba(255,255,255,0.06)', 
                  fontSize: '0.74rem', 
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap'
                }}>
                  {act.time}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{act.student}</span>
                    <span className={`badge badge-${act.tagColor}`}>{act.tag}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{act.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Module Jump */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Sparkles size={18} color="var(--accent-cyan)" />
                <span>Chalk2Tech Modules</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Jump directly into any faculty module
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div 
              className="alert-item" 
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectTab('attendance')}
            >
              <div className="alert-icon" style={{ background: 'var(--accent-rose-subtle)', color: 'var(--accent-rose)' }}>
                <ShieldAlert size={18} />
              </div>
              <div className="alert-content">
                <div className="alert-title">Attendance Analyzer</div>
                <div className="alert-desc">Exact math calculation for 75% target & allowed absences</div>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </div>

            <div 
              className="alert-item" 
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectTab('smart-seating')}
            >
              <div className="alert-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
                <Grid3X3 size={18} />
              </div>
              <div className="alert-content">
                <div className="alert-title">Smart Peer Seating</div>
                <div className="alert-desc">Distribute performance levels for collaborative revision</div>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </div>

            <div 
              className="alert-item" 
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectTab('report-cards')}
            >
              <div className="alert-icon" style={{ background: 'var(--accent-purple-subtle)', color: 'var(--accent-purple)' }}>
                <Sparkles size={18} />
              </div>
              <div className="alert-content">
                <div className="alert-title">AI Report Card Generator</div>
                <div className="alert-desc">Deep answer sheet concept analysis & personalized comments</div>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </div>

            <div 
              className="alert-item" 
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectTab('assignments')}
            >
              <div className="alert-icon" style={{ background: 'var(--accent-amber-subtle)', color: 'var(--accent-amber)' }}>
                <Clock size={18} />
              </div>
              <div className="alert-content">
                <div className="alert-title">AI Assignment Analyzer</div>
                <div className="alert-desc">Deadlines, 87% similarity compare, and AI likelihood indicators</div>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </div>

            <div 
              className="alert-item" 
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectTab('student-voice')}
            >
              <div className="alert-icon" style={{ background: 'var(--accent-emerald-subtle)', color: 'var(--accent-emerald)' }}>
                <MessageSquare size={18} />
              </div>
              <div className="alert-content">
                <div className="alert-title">Anonymous Student Voice</div>
                <div className="alert-desc">Real-time understanding meter & anonymous faculty notes</div>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
