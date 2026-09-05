import React from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  UserCheck, 
  Grid3X3, 
  Sparkles, 
  MessageSquareHeart,
  GraduationCap,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab, metrics }) {
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      badge: null 
    },
    { 
      id: 'assignments', 
      label: 'Assignments', 
      icon: FileCheck2,
      badge: metrics?.assignmentAlerts ? `${metrics.assignmentAlerts} alerts` : '3 alerts',
      badgeClass: 'alert'
    },
    { 
      id: 'attendance', 
      label: 'Attendance', 
      icon: UserCheck,
      badge: metrics?.attendanceAlerts ? `${metrics.attendanceAlerts} risk` : '7 risk',
      badgeClass: 'alert'
    },
    { 
      id: 'smart-seating', 
      label: 'Smart Seating', 
      icon: Grid3X3,
      badge: 'New'
    },
    { 
      id: 'report-cards', 
      label: 'Report Cards', 
      icon: Sparkles,
      badge: 'AI Gen'
    },
    { 
      id: 'student-voice', 
      label: 'Student Voice', 
      icon: MessageSquareHeart,
      badge: '12 notes'
    },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="logo-icon-wrap">
          <GraduationCap size={24} />
        </div>
        <div>
          <div className="brand-name">Chalk2Tech</div>
          <div className="brand-tagline">From Chalk to Tech</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div style={{ 
          fontSize: '0.72rem', 
          fontWeight: 700, 
          color: 'var(--text-muted)', 
          textTransform: 'uppercase', 
          letterSpacing: '0.08em', 
          padding: '8px 12px 4px' 
        }}>
          Faculty Command Center
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <Icon size={19} />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`nav-badge ${item.badgeClass === 'alert' ? 'alert' : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Faculty Profile Footer */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '38px', 
            height: '38px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>
            AS
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Dr. Arvind Sharma
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)', display: 'inline-block' }}></span>
              Faculty Active
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
