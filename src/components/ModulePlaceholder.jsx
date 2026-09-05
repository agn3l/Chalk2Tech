import React from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldAlert, 
  Grid3X3, 
  FileCheck, 
  MessageSquare, 
  CheckCircle2, 
  Layers
} from 'lucide-react';

export default function ModulePlaceholder({ tabId, onBack }) {
  const moduleMeta = {
    'assignments': {
      title: 'AI Assignment Analyzer',
      tagline: 'Deadline verification, similarity comparison, and AI pattern likelihood',
      icon: FileCheck,
      phase: 'Phase 5',
      accentColor: 'var(--accent-amber)',
      features: [
        'Deadline Verification: Detect ON TIME vs LATE (e.g. Rahul 10:35 AM vs 10:00 AM)',
        'Similarity Detection: Rahul ↔ Akhil (87% similarity) with "Compare Answers" viewer',
        'AI Likelihood Scoring: 82% pattern indicator with transparent indicators disclaimer'
      ]
    },
    'attendance': {
      title: 'Attendance Analyzer & 75% Rule Engine',
      tagline: 'Mathematically exact consecutive days required & allowed future absences',
      icon: ShieldAlert,
      phase: 'Phase 2 (Next Step)',
      accentColor: 'var(--accent-rose)',
      features: [
        'Precise formula: (P + x) / (W + x) >= 0.75 to find minimum consecutive days needed',
        'Safe margin analysis: exact count of future classes a student can miss without dropping below 75%',
        'Visual status badges: Safe (🟢), Monitor (🟡), Below 75% (🔴) with batch simulation'
      ]
    },
    'smart-seating': {
      title: 'Smart Peer-Assisted Seating Arrangement',
      tagline: 'Strategic performance distribution for collaborative revision without stigmatization',
      icon: Grid3X3,
      phase: 'Phase 3',
      accentColor: 'var(--accent-primary)',
      features: [
        'Configurable Rows × Columns classroom grid layout',
        'Deterministic algorithm strategically interleaving high and low marks for peer revision',
        'Visual classroom seats preview with Regenerate and Reset controls'
      ]
    },
    'report-cards': {
      title: 'AI Report Card & Answer Sheet Analysis',
      tagline: 'Deep concept breakdown and personalized, encouraging remarks',
      icon: Sparkles,
      phase: 'Phase 4',
      accentColor: '#c084fc',
      features: [
        'Answer sheet analysis identifying strong concepts, weak concepts, and missed steps',
        'Three distinct faculty voices: Professional, Encouraging, and Concise',
        'Reliable fallback template engine with zero external API dependencies required'
      ]
    },
    'student-voice': {
      title: 'Anonymous Student Voice & Understanding Meter',
      tagline: 'Safe, pressure-free student communication and real-time comprehension feedback',
      icon: MessageSquare,
      phase: 'Phase 6',
      accentColor: 'var(--accent-emerald)',
      features: [
        '4-tier comprehension scale (Fully understood, Mostly understood, Need explanation, Didn\'t understand)',
        'Anonymous suggestion box for revision requests and classroom feedback',
        'Guaranteed student anonymity protection'
      ]
    }
  };

  const current = moduleMeta[tabId] || {
    title: 'Module Overview',
    tagline: 'Chalk2Tech Faculty Module',
    icon: Layers,
    phase: 'Upcoming Phase',
    accentColor: 'var(--accent-primary)',
    features: ['Feature integration in progress']
  };

  const Icon = current.icon;

  return (
    <div className="page-container">
      <button 
        className="btn btn-secondary btn-sm"
        onClick={onBack}
        style={{ width: 'fit-content' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </button>

      <div className="card" style={{ maxWidth: '800px', margin: '20px auto', padding: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-surface-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: current.accentColor,
            border: '1px solid var(--border-medium)'
          }}>
            <Icon size={30} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{current.title}</h2>
              <span className="badge badge-indigo">{current.phase}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
              {current.tagline}
            </p>
          </div>
        </div>

        <div style={{
          padding: '20px',
          background: 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginTop: '24px'
        }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
            Module Roadmap & Capabilities:
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none' }}>
            {current.features.map((feat, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px', gap: '12px' }}>
          <button className="btn btn-primary" onClick={onBack}>
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
