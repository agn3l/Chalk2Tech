import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import AttendanceAnalyzer from './components/AttendanceAnalyzer';
import SmartSeating from './components/SmartSeating';
import AssignmentManager from './components/AssignmentManager';
import ReportCardGenerator from './components/ReportCardGenerator';
import StudentVoice from './components/StudentVoice';
import ModulePlaceholder from './components/ModulePlaceholder';
import { initialDemoData } from './data/demoData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Load data from localStorage or fallback to initialDemoData
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('chalk2tech_data');
      return saved ? JSON.parse(saved) : initialDemoData;
    } catch {
      return initialDemoData;
    }
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('chalk2tech_data', JSON.stringify(data));
    } catch (e) {
      console.error('Error saving data to localStorage', e);
    }
  }, [data]);

  const handleResetDemo = () => {
    setData(initialDemoData);
    localStorage.removeItem('chalk2tech_data');
  };

  // Sync attendance updates to both attendance list and global metrics
  const handleUpdateAttendance = (newStudentsList) => {
    setData(prev => {
      const dangerCount = newStudentsList.filter(s => {
        const p = s.presentDays || 0;
        const w = s.totalDays || 1;
        return (p / w) < 0.75;
      }).length;

      return {
        ...prev,
        metrics: {
          ...prev.metrics,
          attendanceAlerts: dangerCount
        },
        attendance: {
          ...prev.attendance,
          students: newStudentsList
        }
      };
    });
  };

  // Sync seating updates
  const handleUpdateSeating = (newStudentsList) => {
    setData(prev => ({
      ...prev,
      seating: {
        ...prev.seating,
        students: newStudentsList
      }
    }));
  };

  // Sync assignments updates
  const handleUpdateAssignments = (newSubmissions) => {
    setData(prev => {
      const lateCount = newSubmissions.filter(s => s.isLate).length;
      const flaggedCount = newSubmissions.filter(s => s.similarityScore >= 50 || s.aiLikelihood >= 60).length;

      return {
        ...prev,
        metrics: {
          ...prev.metrics,
          assignmentAlerts: lateCount,
          aiSimilarityFlags: flaggedCount
        },
        assignments: {
          ...prev.assignments,
          submissions: newSubmissions
        }
      };
    });
  };

  // Sync report cards
  const handleUpdateReportCards = (newReports) => {
    setData(prev => ({
      ...prev,
      reportCards: newReports
    }));
  };

  // Sync student voice and live comprehension meter
  const handleUpdateStudentVoice = (newVoiceData, newUnderstandingPct) => {
    setData(prev => ({
      ...prev,
      studentVoice: newVoiceData,
      metrics: {
        ...prev.metrics,
        classUnderstanding: typeof newUnderstandingPct === 'number' ? newUnderstandingPct : prev.metrics.classUnderstanding
      }
    }));
  };

  // Bulk import roster from CSV/Excel
  const handleImportRoster = (newStudentsList) => {
    const attendanceList = newStudentsList.map(s => ({
      id: s.id,
      name: s.name,
      presentDays: s.presentDays,
      totalDays: s.totalDays
    }));

    const seatingList = newStudentsList.map(s => ({
      id: s.id,
      name: s.name,
      marks: s.marks
    }));

    const dangerCount = attendanceList.filter(s => (s.presentDays / s.totalDays) < 0.75).length;

    setData(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        totalStudents: newStudentsList.length,
        attendanceAlerts: dangerCount
      },
      attendance: {
        ...prev.attendance,
        students: attendanceList
      },
      seating: {
        ...prev.seating,
        students: seatingList
      }
    }));
  };

  return (
    <div className="app-container">
      {/* Left Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        onSelectTab={setActiveTab} 
        metrics={data.metrics} 
      />

      {/* Main Faculty Command Center Area */}
      <div className="main-content">
        <Header 
          course={data.course} 
          semester={data.semester} 
          onResetDemo={handleResetDemo}
          onSelectTab={setActiveTab}
          onImportRoster={handleImportRoster}
        />

        {activeTab === 'dashboard' && (
          <DashboardOverview 
            data={data} 
            onSelectTab={setActiveTab} 
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceAnalyzer 
            data={data} 
            onUpdateAttendance={handleUpdateAttendance}
          />
        )}

        {activeTab === 'smart-seating' && (
          <SmartSeating 
            data={data} 
            onUpdateSeating={handleUpdateSeating}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentManager 
            data={data} 
            onUpdateAssignments={handleUpdateAssignments}
          />
        )}

        {activeTab === 'report-cards' && (
          <ReportCardGenerator 
            data={data} 
            onUpdateReportCards={handleUpdateReportCards}
          />
        )}

        {activeTab === 'student-voice' && (
          <StudentVoice 
            data={data} 
            onUpdateStudentVoice={handleUpdateStudentVoice}
          />
        )}

        {activeTab !== 'dashboard' && 
         activeTab !== 'attendance' && 
         activeTab !== 'smart-seating' && 
         activeTab !== 'assignments' && 
         activeTab !== 'report-cards' && 
         activeTab !== 'student-voice' && (
          <ModulePlaceholder 
            tabId={activeTab} 
            onBack={() => setActiveTab('dashboard')} 
          />
        )}
      </div>
    </div>
  );
}




