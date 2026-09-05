import React, { useState } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  Check, 
  X, 
  AlertCircle, 
  FileText, 
  Download,
  Info
} from 'lucide-react';

export default function DataUploadModal({ isOpen, onClose, onImportData }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('csv'); // 'csv' or 'paste'
  const [pastedText, setPastedText] = useState('');
  const [previewStudents, setPreviewStudents] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successCount, setSuccessCount] = useState(null);

  const sampleCsvTemplate = `Name,PresentDays,TotalDays,Marks
Vikram Rao,42,60,78
Sanya Mirza,58,60,94
Karthik Nair,36,60,42
Divya Sharma,50,60,82
Abhishek Sen,39,60,45`;

  // Parse CSV string into students array
  const parseCsvText = (text) => {
    setErrorMsg('');
    try {
      const lines = text.trim().split('\n');
      if (lines.length < 2) {
        setErrorMsg('File must contain a header row and at least 1 student data row.');
        return null;
      }

      const header = lines[0].split(',').map(h => h.trim().toLowerCase());
      const nameIdx = header.findIndex(h => h.includes('name'));
      const presentIdx = header.findIndex(h => h.includes('present'));
      const totalIdx = header.findIndex(h => h.includes('total'));
      const marksIdx = header.findIndex(h => h.includes('mark') || h.includes('score'));

      if (nameIdx === -1) {
        setErrorMsg("CSV must have a 'Name' column header.");
        return null;
      }

      const parsed = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(',').map(c => c.trim());

        const name = cols[nameIdx];
        const presentDays = presentIdx !== -1 ? parseInt(cols[presentIdx], 10) || 45 : 45;
        const totalDays = totalIdx !== -1 ? parseInt(cols[totalIdx], 10) || 60 : 60;
        const marks = marksIdx !== -1 ? parseInt(cols[marksIdx], 10) || 70 : 70;

        if (name) {
          parsed.push({
            id: `student-upload-${Date.now()}-${i}`,
            name,
            presentDays,
            totalDays,
            marks
          });
        }
      }

      if (parsed.length === 0) {
        setErrorMsg('No valid student rows found in the data.');
        return null;
      }

      return parsed;
    } catch (err) {
      setErrorMsg('Error parsing CSV. Please check formatting.');
      return null;
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const parsed = parseCsvText(content);
        if (parsed) {
          setPreviewStudents(parsed);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleParsePasted = () => {
    if (!pastedText.trim()) {
      setErrorMsg('Please paste your CSV or spreadsheet data first.');
      return;
    }
    const parsed = parseCsvText(pastedText);
    if (parsed) {
      setPreviewStudents(parsed);
    }
  };

  const handleConfirmImport = () => {
    if (!previewStudents || previewStudents.length === 0) return;

    onImportData(previewStudents);
    setSuccessCount(previewStudents.length);
    setTimeout(() => {
      setSuccessCount(null);
      setPreviewStudents(null);
      onClose();
    }, 1500);
  };

  const handleDownloadSample = () => {
    const element = document.createElement("a");
    const file = new Blob([sampleCsvTemplate], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = "chalk2tech_sample_students.csv";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={20} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Upload Class Roster Data (CSV / Excel)</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Imports student records directly into Attendance, Smart Seating, and Dashboard
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '4px 8px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button 
            className={`btn btn-sm ${activeTab === 'csv' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('csv'); setPreviewStudents(null); }}
            style={{ flex: 1 }}
          >
            <Upload size={14} />
            Upload .CSV File
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'paste' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('paste'); setPreviewStudents(null); }}
            style={{ flex: 1 }}
          >
            <FileText size={14} />
            Paste Spreadsheet Rows
          </button>
        </div>

        {/* Mode 1: File Drag & Drop / Input */}
        {activeTab === 'csv' && !previewStudents && (
          <div style={{
            border: '2px dashed var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px 20px',
            textAlign: 'center',
            background: 'var(--bg-surface)',
            marginBottom: '16px'
          }}>
            <FileSpreadsheet size={36} style={{ color: 'var(--accent-primary)', marginBottom: '10px' }} />
            <div style={{ fontSize: '0.92rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Choose a .CSV file from your computer
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Columns required: <code>Name, PresentDays, TotalDays, Marks</code>
            </div>

            <input 
              type="file" 
              accept=".csv,.txt"
              onChange={handleFileUpload}
              id="file-input-csv"
              style={{ display: 'none' }}
            />
            <label 
              htmlFor="file-input-csv"
              className="btn btn-primary"
              style={{ cursor: 'pointer', display: 'inline-flex' }}
            >
              <Upload size={15} />
              Browse CSV File
            </label>

            <div style={{ marginTop: '14px' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={handleDownloadSample}
                style={{ fontSize: '0.76rem' }}
              >
                <Download size={13} />
                Download Sample CSV Template
              </button>
            </div>
          </div>
        )}

        {/* Mode 2: Paste CSV Text */}
        {activeTab === 'paste' && !previewStudents && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                Paste CSV or Excel Tabular Text:
              </label>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setPastedText(sampleCsvTemplate)}
                style={{ fontSize: '0.74rem', padding: '2px 8px' }}
              >
                Load Sample Text
              </button>
            </div>

            <textarea 
              rows="6"
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Name,PresentDays,TotalDays,Marks&#10;Vikram Rao,42,60,78&#10;Sanya Mirza,58,60,94"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: '#0a0e17',
                border: '1px solid var(--border-subtle)',
                color: '#e2e8f0',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />

            <button 
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px' }}
              onClick={handleParsePasted}
            >
              Parse and Preview Data
            </button>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fda4af',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <AlertCircle size={15} />
            {errorMsg}
          </div>
        )}

        {/* Preview parsed data */}
        {previewStudents && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Previewing {previewStudents.length} Students Ready to Import:
              </span>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setPreviewStudents(null)}
                style={{ fontSize: '0.74rem' }}
              >
                Change File
              </button>
            </div>

            <div style={{
              maxHeight: '220px',
              overflowY: 'auto',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              background: '#0a0e17',
              marginBottom: '16px'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Name</th>
                    <th style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Attendance (P/W)</th>
                    <th style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Exam Marks</th>
                    <th style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>75% Status</th>
                  </tr>
                </thead>
                <tbody>
                  {previewStudents.map((s, idx) => {
                    const pct = Math.round((s.presentDays / s.totalDays) * 100);
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '8px 12px', fontWeight: '600' }}>{s.name}</td>
                        <td style={{ padding: '8px 12px' }}>{s.presentDays} / {s.totalDays} ({pct}%)</td>
                        <td style={{ padding: '8px 12px' }}>{s.marks} / 100</td>
                        <td style={{ padding: '8px 12px' }}>
                          <span className={`badge ${pct < 75 ? 'badge-rose' : 'badge-emerald'}`}>
                            {pct < 75 ? 'Below 75%' : 'Safe'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleConfirmImport}
              >
                {successCount ? <Check size={16} /> : <Upload size={16} />}
                {successCount ? `Successfully Imported ${successCount} Students!` : `Import ${previewStudents.length} Students`}
              </button>
            </div>
          </div>
        )}

        {/* Footer guide */}
        {!previewStudents && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)'
          }}>
            <Info size={14} style={{ display: 'inline', marginRight: '6px', color: 'var(--accent-primary)' }} />
            Uploading updates both attendance records and smart seating arrangement marks instantaneously.
          </div>
        )}
      </div>
    </div>
  );
}
