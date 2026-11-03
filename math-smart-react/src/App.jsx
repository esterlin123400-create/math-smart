import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { QuickSwitcherModal } from './components/QuickSwitcherModal';
import { NotificationToast } from './components/NotificationToast';

// 18 Page Components + Hub
import { PlatformHub } from './pages/PlatformHub';
import { SmartAssessmentResult } from './pages/SmartAssessmentResult';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { LiveChallengeArena } from './pages/LiveChallengeArena';
import { StudentLogin } from './pages/StudentLogin';
import { PasswordRecovery } from './pages/PasswordRecovery';
import { GradeLevelSelection } from './pages/GradeLevelSelection';
import { RecordsManagement } from './pages/RecordsManagement';
import { AcademicReports } from './pages/AcademicReports';
import { InteractiveProblemSolving } from './pages/InteractiveProblemSolving';
import { SupervisorTeacherLogin } from './pages/SupervisorTeacherLogin';
import { ProfileAndSettings } from './pages/ProfileAndSettings';
import { KeyboardSymbolsManagement } from './pages/KeyboardSymbolsManagement';
import { StudentDashboard } from './pages/StudentDashboard';
import { SupervisorTeacherRegistration } from './pages/SupervisorTeacherRegistration';
import { StudentRegistration } from './pages/StudentRegistration';
import { ParentTeacherFollowupReport } from './pages/ParentTeacherFollowupReport';
import { CurriculumAndUnits } from './pages/CurriculumAndUnits';
import { LogoBranding } from './pages/LogoBranding';

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
          {renderScreen()}
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
