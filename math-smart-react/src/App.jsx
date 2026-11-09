import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { QuickSwitcherModal } from './components/QuickSwitcherModal';
import { NotificationToast } from './components/NotificationToast';

// Lazy-loaded 18 Page Components + Hub (Code Splitting for fast mobile/desktop loading)
const PlatformHub = lazy(() => import('./pages/PlatformHub').then(m => ({ default: m.PlatformHub })));
const SmartAssessmentResult = lazy(() => import('./pages/SmartAssessmentResult').then(m => ({ default: m.SmartAssessmentResult })));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard').then(m => ({ default: m.TeacherDashboard })));
const LiveChallengeArena = lazy(() => import('./pages/LiveChallengeArena').then(m => ({ default: m.LiveChallengeArena })));
const StudentLogin = lazy(() => import('./pages/StudentLogin').then(m => ({ default: m.StudentLogin })));
const PasswordRecovery = lazy(() => import('./pages/PasswordRecovery').then(m => ({ default: m.PasswordRecovery })));
const GradeLevelSelection = lazy(() => import('./pages/GradeLevelSelection').then(m => ({ default: m.GradeLevelSelection })));
const RecordsManagement = lazy(() => import('./pages/RecordsManagement').then(m => ({ default: m.RecordsManagement })));
const AcademicReports = lazy(() => import('./pages/AcademicReports').then(m => ({ default: m.AcademicReports })));
const InteractiveProblemSolving = lazy(() => import('./pages/InteractiveProblemSolving').then(m => ({ default: m.InteractiveProblemSolving })));
const SupervisorTeacherLogin = lazy(() => import('./pages/SupervisorTeacherLogin').then(m => ({ default: m.SupervisorTeacherLogin })));
const ProfileAndSettings = lazy(() => import('./pages/ProfileAndSettings').then(m => ({ default: m.ProfileAndSettings })));
const KeyboardSymbolsManagement = lazy(() => import('./pages/KeyboardSymbolsManagement').then(m => ({ default: m.KeyboardSymbolsManagement })));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
const SupervisorTeacherRegistration = lazy(() => import('./pages/SupervisorTeacherRegistration').then(m => ({ default: m.SupervisorTeacherRegistration })));
const StudentRegistration = lazy(() => import('./pages/StudentRegistration').then(m => ({ default: m.StudentRegistration })));
const ParentTeacherFollowupReport = lazy(() => import('./pages/ParentTeacherFollowupReport').then(m => ({ default: m.ParentTeacherFollowupReport })));
const CurriculumAndUnits = lazy(() => import('./pages/CurriculumAndUnits').then(m => ({ default: m.CurriculumAndUnits })));
const LogoBranding = lazy(() => import('./pages/LogoBranding').then(m => ({ default: m.LogoBranding })));

const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '55vh',
    flexDirection: 'column',
    gap: '16px'
  }}>
    <div style={{
      width: '44px',
      height: '44px',
      border: '3px solid rgba(56, 189, 248, 0.2)',
      borderTopColor: '#38bdf8',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '700' }}>
      جاري تحميل الواجهة التفاعلية...
    </div>
  </div>
);

const MainRouter = () => {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case '01':
        return <SmartAssessmentResult />;
      case '02':
        return <TeacherDashboard />;
      case '03':
        return <LiveChallengeArena />;
      case '04':
        return <StudentLogin />;
      case '05':
        return <PasswordRecovery />;
      case '06':
        return <GradeLevelSelection />;
      case '07':
        return <RecordsManagement />;
      case '08':
        return <AcademicReports />;
      case '09':
        return <InteractiveProblemSolving />;
      case '10':
        return <SupervisorTeacherLogin />;
      case '11':
        return <ProfileAndSettings />;
      case '12':
        return <KeyboardSymbolsManagement />;
      case '13':
        return <StudentDashboard />;
      case '14':
        return <SupervisorTeacherRegistration />;
      case '15':
        return <StudentRegistration />;
      case '16':
        return <ParentTeacherFollowupReport />;
      case '17':
        return <CurriculumAndUnits />;
      case '18':
        return <LogoBranding />;
      case 'hub':
      default:
        return <PlatformHub />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="page-wrapper">
          <Suspense fallback={<PageLoader />}>
            {renderScreen()}
          </Suspense>
        </div>
      </main>
      <QuickSwitcherModal />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Navbar />
          <MainRouter />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
