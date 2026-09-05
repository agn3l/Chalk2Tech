import React, { useState } from 'react';
import { Sparkles, RefreshCw, BookOpen, Bell, CheckCircle2, Upload } from 'lucide-react';
import DataUploadModal from './DataUploadModal';

export default function Header({ course, semester, onResetDemo, onSelectTab, onImportRoster }) {
  const [justReset, setJustReset] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleReset = () => {
    onResetDemo();
    setJustReset(true);
    setTimeout(() => setJustReset(false), 2000);
  };

  return (
    <header className="top-header">
      {/* Course Context Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)'
        }}>
          <BookOpen size={16} color="var(--accent-primary)" />
          <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#c7d2fe' }}>
            {course}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {semester}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="header-actions">
        {/* Upload CSV Roster Button */}
        <button
          className="btn btn-secondary"
          onClick={() => setIsUploadOpen(true)}
          id="btn-upload-csv-roster"
          title="Upload or paste student roster CSV with attendance and exam marks"
          style={{ fontSize: '0.84rem' }}
        >
          <Upload size={15} />
          <span>Upload CSV Data</span>
        </button>

        {/* Load Demo Data Button */}
        <button
          className="btn btn-secondary"
          onClick={handleReset}
          title="Reload complete realistic classroom dataset for hackathon demo"
          style={{ fontSize: '0.84rem' }}
        >
          {justReset ? (
            <>
              <CheckCircle2 size={16} color="var(--accent-emerald)" />
              <span style={{ color: 'var(--accent-emerald)' }}>Demo Data Loaded!</span>
            </>
          ) : (
            <>
              <RefreshCw size={15} />
              <span>Load Demo Data</span>
            </>
          )}
        </button>

        {/* Hackathon Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-full)',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#34d399'
        }}>
          <Sparkles size={14} />
          <span>Hackathon MVP</span>
        </div>
      </div>

      {/* CSV Data Upload Modal */}
      <DataUploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onImportData={(students) => {
          if (onImportRoster) onImportRoster(students);
        }}
      />
    </header>
  );
}

