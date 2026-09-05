import React, { useState, useMemo } from 'react';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Plus, 
  FileText, 
  Copy, 
  Check, 
  Sparkles, 
  UserCheck, 
  UserX, 
  Edit2, 
  Trash2, 
  Download, 
  X,
  Sliders,
  TrendingUp,
  Info,
  Calendar
} from 'lucide-react';
import { calculateStudentAttendance, simulateProjectedAttendance } from '../utils/attendanceCalculator';

export default function AttendanceAnalyzer({ data, onUpdateAttendance }) {
  const studentsList = data?.attendance?.students || [];
  const totalWorkingDays = data?.attendance?.totalWorkingDays || 60;

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'danger', 'warning', 'safe'
  const [sortBy, setSortBy] = useState('urgent'); // 'urgent', 'highest', 'name'

  // Modals & Tools state
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [showSimulator, setShowSimulator] = useState(true);

  // Simulator state
  const [selectedStudentId, setSelectedStudentId] = useState(() => {
    // Default to first student below 75% or first student in list
    const atRisk = studentsList.find(s => (s.presentDays / s.totalDays) < 0.75);
    return atRisk ? atRisk.id : (studentsList[0]?.id || '');
  });
  const [remainingClasses, setRemainingClasses] = useState(20);
  const [classesToAttend, setClassesToAttend] = useState(18);

  // Calculate statistics for all students
  const analyzedStudents = useMemo(() => {
    return studentsList.map(student => {
      const stats = calculateStudentAttendance(student.presentDays, student.totalDays);
      return {
        ...student,
        ...stats
      };
    });
  }, [studentsList]);

  // Aggregate metrics
  const totalCount = analyzedStudents.length;
  const criticalCount = analyzedStudents.filter(s => s.status === 'danger').length;
  const monitorCount = analyzedStudents.filter(s => s.status === 'warning').length;
  const safeCount = analyzedStudents.filter(s => s.status === 'safe').length;

  const classAveragePct = useMemo(() => {
    if (analyzedStudents.length === 0) return 0;
    const totalPcts = analyzedStudents.reduce((sum, s) => sum + s.pct, 0);
    return Math.round((totalPcts / analyzedStudents.length) * 10) / 10;
  }, [analyzedStudents]);

  // Filtered and sorted students
  const filteredStudents = useMemo(() => {
    return analyzedStudents
      .filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchesSearch) return false;
        if (statusFilter === 'all') return true;
        return student.status === statusFilter;
      })
      .sort((a, b) => {
        if (sortBy === 'urgent') return a.pct - b.pct;
        if (sortBy === 'highest') return b.pct - a.pct;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [analyzedStudents, searchTerm, statusFilter, sortBy]);

  // Student currently selected for simulator
  const activeSimStudent = useMemo(() => {
    return analyzedStudents.find(s => s.id === selectedStudentId) || analyzedStudents[0];
  }, [analyzedStudents, selectedStudentId]);

  // Projected simulator results
  const simulationResult = useMemo(() => {
    if (!activeSimStudent) return null;
    return simulateProjectedAttendance(
      activeSimStudent.presentDays,
      activeSimStudent.totalDays,
      remainingClasses,
      classesToAttend
    );
  }, [activeSimStudent, remainingClasses, classesToAttend]);

  // Live simulation: +1 Present for a student
  const handleAddDay = (studentId, isPresent) => {
    const updated = studentsList.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          presentDays: isPresent ? s.presentDays + 1 : s.presentDays,
          totalDays: s.totalDays + 1
        };
      }
      return s;
    });
    onUpdateAttendance(updated);
  };

  // Delete student
  const handleDeleteStudent = (studentId) => {
    if (window.confirm("Are you sure you want to remove this student record?")) {
      const updated = studentsList.filter(s => s.id !== studentId);
      onUpdateAttendance(updated);
    }
  };

  // Add / Edit student form submission
  const handleSaveStudent = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name')?.toString().trim();
    const presentDays = parseInt(formData.get('presentDays')?.toString() || '0', 10);
    const totalDays = parseInt(formData.get('totalDays')?.toString() || '60', 10);

    if (!name) return;

    let updated;
    if (editingStudent) {
      updated = studentsList.map(s => s.id === editingStudent.id ? { ...s, name, presentDays, totalDays } : s);
    } else {
      const newStudent = {
        id: `att-${Date.now()}`,
        name,
        presentDays,
        totalDays
      };
      updated = [newStudent, ...studentsList];
    }

    onUpdateAttendance(updated);
    setIsAddModalOpen(false);
    setEditingStudent(null);
  };

  // Generate Defaulter Warning Notice Text
  const defaulterNoticeText = useMemo(() => {
    const dangerList = analyzedStudents.filter(s => s.status === 'danger');
    const warningDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    let text = `=========================================================\n`;
    text += `ACADEMIC ATTENDANCE WARNING NOTICE\n`;
    text += `Course: ${data?.course || 'CS302: Data Structures & Algorithms'}\n`;
    text += `Faculty: ${data?.facultyName || 'Dr. Arvind Sharma'}\n`;
    text += `Date of Notice: ${warningDate}\n`;
    text += `Institutional Minimum Threshold: 75.0%\n`;
    text += `=========================================================\n\n`;
    text += `The following ${dangerList.length} students have fallen below the mandatory 75% attendance threshold as of today.\n\n`;

    dangerList.forEach((s, idx) => {
      text += `${idx + 1}. ${s.name.toUpperCase()}\n`;
      text += `   - Current Attendance: ${s.pct}% (${s.presentDays}/${s.totalDays} classes)\n`;
      text += `   - RECOVERY REQUIREMENT: Must attend the next ${s.minConsecutiveNeeded} consecutive classes without absence.\n\n`;
    });

    text += `IMPORTANT ADVISORY:\n`;
    text += `Students failing to attain 75% before the final semester cutoff will be disqualified from appearing for end-semester examinations under university regulations.\n\n`;
    text += `Issued by Course Faculty,\n${data?.facultyName || 'Dr. Arvind Sharma'}`;
    return text;
  }, [analyzedStudents, data]);

  const handleCopyNotice = () => {
    navigator.clipboard.writeText(defaulterNoticeText);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  const handleDownloadNotice = () => {
    const element = document.createElement("a");
    const file = new Blob([defaulterNoticeText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Attendance_Warning_Notice_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="page-container">
      {/* Top Banner & Module Header */}
      <div className="welcome-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="badge badge-indigo">
              <Calendar size={13} />
              Semester IV Real-Time Audit
            </span>
            <span className="badge badge-rose">
              <AlertTriangle size={13} />
              {criticalCount} Students Below 75%
            </span>
          </div>
          <h1 className="welcome-title">Attendance Analyzer</h1>
          <p className="welcome-subtitle">
            Calculates exact mathematical consecutive recovery days needed to reach 75%, safe absence margins, and produces instant institutional defaulter notices.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setIsNoticeModalOpen(true)}
            id="btn-defaulter-notice"
          >
            <FileText size={16} />
            Generate Warning Notice
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => { setEditingStudent(null); setIsAddModalOpen(true); }}
            id="btn-add-student"
          >
            <Plus size={16} />
            Add Student
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="metrics-grid">
        {/* Critical Risk */}
        <div 
          className="metric-card" 
          style={{ borderColor: criticalCount > 0 ? 'rgba(244, 63, 94, 0.4)' : undefined }}
          onClick={() => setStatusFilter(statusFilter === 'danger' ? 'all' : 'danger')}
        >
          <div className="metric-header">
            <span className="metric-label">Below 75% Threshold</span>
            <div className="metric-icon-wrap" style={{ background: 'var(--accent-rose-subtle)', color: 'var(--accent-rose)' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: 'var(--accent-rose)' }}>{criticalCount}</div>
          <div className="metric-subtext" style={{ color: 'var(--accent-rose)' }}>
            ⚠️ Barred from exam unless recovered
          </div>
        </div>

        {/* Monitor Zone */}
        <div 
          className="metric-card" 
          style={{ borderColor: monitorCount > 0 ? 'rgba(245, 158, 11, 0.3)' : undefined }}
          onClick={() => setStatusFilter(statusFilter === 'warning' ? 'all' : 'warning')}
        >
          <div className="metric-header">
            <span className="metric-label">Monitor Zone (75-80%)</span>
            <div className="metric-icon-wrap" style={{ background: 'var(--accent-amber-subtle)', color: 'var(--accent-amber)' }}>
              <Clock size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: 'var(--accent-amber)' }}>{monitorCount}</div>
          <div className="metric-subtext">
            Can safely miss 1-2 classes max
          </div>
        </div>

        {/* Safe Zone */}
        <div 
          className="metric-card"
          onClick={() => setStatusFilter(statusFilter === 'safe' ? 'all' : 'safe')}
        >
          <div className="metric-header">
            <span className="metric-label">Safe Zone (80%+)</span>
            <div className="metric-icon-wrap" style={{ background: 'var(--accent-emerald-subtle)', color: 'var(--accent-emerald)' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: 'var(--accent-emerald)' }}>{safeCount}</div>
          <div className="metric-subtext">
            Compliant with university policy
          </div>
        </div>

        {/* Class Average */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Class Attendance Avg</span>
            <div className="metric-icon-wrap" style={{ background: 'var(--accent-primary-subtle)', color: 'var(--accent-primary)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: classAveragePct >= 75 ? '#818cf8' : 'var(--accent-rose)' }}>
            {classAveragePct}%
          </div>
          <div className="metric-subtext">
            {classAveragePct >= 75 ? 'Above 75% target baseline' : 'Below institutional target!'}
          </div>
        </div>
      </div>

      {/* What-If Interactive Attendance Simulator */}
      {showSimulator && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(26, 39, 68, 0.6) 0%, rgba(19, 29, 53, 0.8) 100%)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
          <div className="card-header" style={{ marginBottom: '14px' }}>
            <div className="card-title">
              <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
              <span>Predictive What-If Attendance Simulator</span>
              <span className="badge badge-indigo" style={{ marginLeft: '6px' }}>Interactive Math Engine</span>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setShowSimulator(false)}
            >
              Hide Simulator
            </button>
          </div>

          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Simulate future scenarios for any student. Adjust upcoming lectures in the semester to test whether the student can achieve or maintain examination eligibility.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
            {/* Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Select Student to Simulate:
                </label>
                <select 
                  className="form-select"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                >
                  {analyzedStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} — Current: {s.pct}% ({s.presentDays}/{s.totalDays}) [{s.status === 'danger' ? '🔴 Below 75%' : s.status === 'warning' ? '🟡 Monitor' : '🟢 Safe'}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Classes Remaining in Semester:</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{remainingClasses} classes</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="40" 
                  value={remainingClasses}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setRemainingClasses(val);
                    if (classesToAttend > val) setClassesToAttend(val);
                  }}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Classes Student Will Attend:</span>
                  <span style={{ fontWeight: '700', color: classesToAttend >= (activeSimStudent?.minConsecutiveNeeded || 0) ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                    {classesToAttend} / {remainingClasses} classes
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max={remainingClasses} 
                  value={classesToAttend}
                  onChange={(e) => setClassesToAttend(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Projection Results Output Card */}
            {activeSimStudent && simulationResult && (
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px 22px',
                border: `1px solid ${simulationResult.isEligible ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: '600' }}>
                    Simulation Outcome for {activeSimStudent.name}
                  </span>
                  <span className={`badge ${simulationResult.isEligible ? 'badge-emerald' : 'badge-rose'}`}>
                    {simulationResult.isEligible ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                    {simulationResult.isEligible ? 'Eligible for Exams' : 'Disqualified (< 75%)'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '6px' }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: simulationResult.isEligible ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                    {simulationResult.projectedPct}%
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    from current <b>{activeSimStudent.pct}%</b> ({simulationResult.projectedPct > activeSimStudent.pct ? '+' : ''}{(simulationResult.projectedPct - activeSimStudent.pct).toFixed(1)}%)
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Projected Record: <b>{simulationResult.newPresent}</b> attended out of <b>{simulationResult.newTotal}</b> total semester lectures.
                </div>

                {/* Status Explanation Pill */}
                <div style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: simulationResult.isEligible ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                  fontSize: '0.82rem',
                  color: simulationResult.isEligible ? '#6ee7b7' : '#fda4af',
                  lineHeight: '1.4'
                }}>
                  {simulationResult.isEligible ? (
                    <span>
                      ✅ <b>Eligible:</b> With {classesToAttend} attendances, {activeSimStudent.name} exceeds the 75% university requirement by {(simulationResult.projectedPct - 75.0).toFixed(1)}%!
                    </span>
                  ) : (
                    <span>
                      ⚠️ <b>Still Ineligible:</b> {activeSimStudent.name} needs at least <b>{activeSimStudent.minConsecutiveNeeded}</b> consecutive attendances to cross 75%. Currently falling short by {(75.0 - simulationResult.projectedPct).toFixed(1)}%.
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '240px', flex: '1' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Search student by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              id="input-search-students"
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

          {/* Status Pills Filter */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button 
              className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({totalCount})
            </button>
            <button 
              className={`btn btn-sm ${statusFilter === 'danger' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('danger')}
              style={{ color: statusFilter === 'danger' ? '#fff' : 'var(--accent-rose)' }}
            >
              🔴 Below 75% ({criticalCount})
            </button>
            <button 
              className={`btn btn-sm ${statusFilter === 'warning' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('warning')}
              style={{ color: statusFilter === 'warning' ? '#fff' : 'var(--accent-amber)' }}
            >
              🟡 Monitor ({monitorCount})
            </button>
            <button 
              className={`btn btn-sm ${statusFilter === 'safe' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('safe')}
              style={{ color: statusFilter === 'safe' ? '#fff' : 'var(--accent-emerald)' }}
            >
              🟢 Safe ({safeCount})
            </button>
          </div>

          {/* Sort Dropdown & Simulator Toggle */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="urgent">Sort: Lowest Attendance (Urgent)</option>
              <option value="highest">Sort: Highest Attendance</option>
              <option value="name">Sort: Name (A to Z)</option>
            </select>

            {!showSimulator && (
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setShowSimulator(true)}
              >
                <Sparkles size={14} />
                Simulator
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Student Attendance Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '14px 20px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Student
                </th>
                <th style={{ padding: '14px 16px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Attendance Record
                </th>
                <th style={{ padding: '14px 16px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', width: '180px' }}>
                  Percentage
                </th>
                <th style={{ padding: '14px 16px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Status
                </th>
                <th style={{ padding: '14px 16px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Predictive Action / Recovery Math
                </th>
                <th style={{ padding: '14px 20px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                  Live Demo Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No students match the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isDanger = student.status === 'danger';
                  const isWarning = student.status === 'warning';
                  const fillColor = isDanger ? 'var(--accent-rose)' : isWarning ? 'var(--accent-amber)' : 'var(--accent-emerald)';

                  return (
                    <tr 
                      key={student.id}
                      style={{ 
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background 0.15s ease',
                        background: isDanger ? 'rgba(244, 63, 94, 0.03)' : undefined
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
                            background: isDanger ? 'rgba(244, 63, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                            color: isDanger ? 'var(--accent-rose)' : '#a5b4fc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '0.85rem'
                          }}>
                            {student.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                              {student.name}
                            </div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                              ID: {student.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Attended / Total */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{student.presentDays}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}> / {student.totalDays} classes</span>
                      </td>

                      {/* Percentage & Progress Bar */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: '700', color: fillColor, fontFamily: 'var(--font-display)', fontSize: '0.92rem' }}>
                            {student.pct}%
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {student.pct >= 75 ? 'Pass' : 'Risk'}
                          </span>
                        </div>
                        <div className="progress-bar-wrap" style={{ height: '6px', margin: 0 }}>
                          <div 
                            className="progress-bar-fill" 
                            style={{ 
                              width: `${Math.min(100, student.pct)}%`, 
                              background: fillColor 
                            }} 
                          />
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge ${student.badgeClass}`}>
                          {isDanger && <AlertTriangle size={12} />}
                          {isWarning && <Clock size={12} />}
                          {!isDanger && !isWarning && <CheckCircle2 size={12} />}
                          {student.statusLabel}
                        </span>
                      </td>

                      {/* Predictive Action Recovery Chip */}
                      <td style={{ padding: '14px 16px' }}>
                        {isDanger ? (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(244, 63, 94, 0.12)',
                            color: '#fda4af',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem',
                            border: '1px solid rgba(244, 63, 94, 0.25)',
                            fontWeight: '500'
                          }}>
                            <AlertTriangle size={13} style={{ color: 'var(--accent-rose)' }} />
                            <span>Needs <b>{student.minConsecutiveNeeded}</b> consecutive classes to reach 75%</span>
                          </div>
                        ) : isWarning ? (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(245, 158, 11, 0.12)',
                            color: '#fde68a',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem',
                            border: '1px solid rgba(245, 158, 11, 0.25)',
                            fontWeight: '500'
                          }}>
                            <Clock size={13} style={{ color: 'var(--accent-amber)' }} />
                            <span>Can safely miss only <b>{student.safeMarginAbsences}</b> {student.safeMarginAbsences === 1 ? 'class' : 'classes'}</span>
                          </div>
                        ) : (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(16, 185, 129, 0.12)',
                            color: '#a7f3d0',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                            fontWeight: '500'
                          }}>
                            <CheckCircle2 size={13} style={{ color: 'var(--accent-emerald)' }} />
                            <span>Can safely miss up to <b>{student.safeMarginAbsences}</b> classes</span>
                          </div>
                        )}
                      </td>

                      {/* Live Demo Actions (+1 Present, +1 Absent, Edit) */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                          {/* +1 Present */}
                          <button 
                            className="btn btn-secondary btn-sm"
                            title="Simulate student attending today's class (+1 Present, +1 Total)"
                            onClick={() => handleAddDay(student.id, true)}
                            style={{ padding: '4px 8px', color: 'var(--accent-emerald)' }}
                          >
                            <UserCheck size={14} />
                            <span>+1</span>
                          </button>

                          {/* +1 Absent */}
                          <button 
                            className="btn btn-secondary btn-sm"
                            title="Simulate student missing today's class (+0 Present, +1 Total)"
                            onClick={() => handleAddDay(student.id, false)}
                            style={{ padding: '4px 8px', color: 'var(--accent-rose)' }}
                          >
                            <UserX size={14} />
                            <span>-1</span>
                          </button>

                          {/* Edit */}
                          <button 
                            className="btn btn-secondary btn-sm"
                            title="Edit attendance records"
                            onClick={() => { setEditingStudent(student); setIsAddModalOpen(true); }}
                            style={{ padding: '4px 8px' }}
                          >
                            <Edit2 size={13} />
                          </button>

                          {/* Delete */}
                          <button 
                            className="btn btn-secondary btn-sm"
                            title="Remove student"
                            onClick={() => handleDeleteStudent(student.id)}
                            style={{ padding: '4px 8px', color: 'var(--text-muted)' }}
                          >
                            <Trash2 size={13} />
                          </button>
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

      {/* Modal 1: Official Defaulter Warning Notice */}
      {isNoticeModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '1.1rem' }}>Official Attendance Warning Notice</h3>
              </div>
              <button 
                onClick={() => setIsNoticeModalOpen(false)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Standard university notice formatted with calculated consecutive recovery requirements for all students currently under 75%. Ready to post to bulletin, parent portals, or student group.
            </p>

            {/* Notice Preview Box */}
            <div style={{
              background: '#0a0e17',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              maxHeight: '320px',
              overflowY: 'auto',
              border: '1px solid var(--border-subtle)',
              color: '#cbd5e1',
              marginBottom: '20px'
            }}>
              {defaulterNoticeText}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="btn btn-secondary"
                onClick={handleDownloadNotice}
              >
                <Download size={15} />
                Download as .TXT
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCopyNotice}
              >
                {copiedNotice ? <Check size={15} /> : <Copy size={15} />}
                {copiedNotice ? 'Copied to Clipboard!' : 'Copy Formatted Notice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Add / Edit Student Record */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem' }}>
                {editingStudent ? 'Edit Student Attendance' : 'Add New Student'}
              </h3>
              <button 
                onClick={() => { setIsAddModalOpen(false); setEditingStudent(null); }}
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Student Full Name
                </label>
                <input 
                  type="text"
                  name="name"
                  defaultValue={editingStudent?.name || ''}
                  required
                  placeholder="e.g. Vikramaditya Rao"
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Classes Attended (P)
                  </label>
                  <input 
                    type="number"
                    name="presentDays"
                    defaultValue={editingStudent?.presentDays ?? 40}
                    min="0"
                    max="200"
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
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Total Lectures (W)
                  </label>
                  <input 
                    type="number"
                    name="totalDays"
                    defaultValue={editingStudent?.totalDays ?? totalWorkingDays}
                    min="1"
                    max="200"
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
                </div>
              </div>

              <div style={{
                background: 'rgba(99, 102, 241, 0.08)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '4px' }}>
                  <Info size={14} style={{ color: 'var(--accent-primary)' }} />
                  Automated Calculation
                </div>
                The system will immediately compute the 75% threshold, minimum consecutive makeup days, and safe absence margins upon saving.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => { setIsAddModalOpen(false); setEditingStudent(null); }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  {editingStudent ? 'Update Record' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
