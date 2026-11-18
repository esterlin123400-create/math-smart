import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { screensCatalog } from '../data/screensCatalog';

export const Sidebar = () => {
  const { currentScreen, setCurrentScreen, isSidebarOpen, setIsSidebarOpen } = useApp();
  const { role } = useAuth();

  const studentGroup = {
    title: '🎒 فضاء الطالب والتعلّم',
    items: [
      { id: '13', label: 'لوحة الطالب والمهام', badge: 'رئيسي' },
      { id: '09', label: 'مختبر المسائل والسبورة', badge: 'ذكي' },
      { id: '03', label: 'حلبة التحديات 1v1', badge: 'مباشر' },
      { id: '17', label: 'المناهج والوحدات', badge: '12 وحدة' },
      { id: '01', label: 'التقييم الذكي والشهادة', badge: 'شهادة' },
      { id: '12', label: 'لوحة الرموز والمعادلات', badge: null },
      { id: '06', label: 'تحديد المرحلة والصف', badge: null }
    ]
  };

  const teacherGroup = {
    title: '👨‍🏫 بوابة المعلم والإشراف',
    items: [
      { id: '02', label: 'لوحة تحكم المعلم', badge: 'قيادة' },
      { id: '07', label: 'إدارة السجلات (CSV)', badge: 'سجلات' },
      { id: '08', label: 'التقارير والتحليلات', badge: 'أكاديمي' },
      { id: '16', label: 'تواصل ومتابعة ولي الأمر', badge: 'جلسات' }
    ]
  };

  const settingsGroup = {
    title: '⚙️ الحساب والمنظومة',
    items: [
      { id: '11', label: 'الملف الشخصي والإعدادات', badge: null },
      { id: '18', label: 'دليل الهوية والشعار', badge: null }
    ]
  };

  // Prioritize active user role at the top of the workspace sidebar
  const groups = (role === 'teacher' || role === 'supervisor')
    ? [teacherGroup, studentGroup, settingsGroup]
    : [studentGroup, teacherGroup, settingsGroup];

  if (!isSidebarOpen) {
    return (
      <aside className="app-sidebar-collapsed">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="sidebar-collapsed-btn"
          title="توسيع قائمة مساحة العمل"
        >
          <span>☰</span>
          <span className="collapsed-text">الأدوات</span>
        </button>
      </aside>
    );
  }

  return (
    <aside className="app-sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-header-title">
          <span>{role === 'teacher' ? 'مساحة عمل المعلم' : 'مساحة التعلّم النشط'}</span>
        </div>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="sidebar-close-btn"
          title="طي القائمة لتوسيع مساحة العمل"
        >
          ✕
        </button>
      </div>

      {/* Back to Platform Home Card */}
      <button
        type="button"
        onClick={() => setCurrentScreen('hub')}
        className={`sidebar-hub-card ${currentScreen === 'hub' ? 'active' : ''}`}
      >
        <span className="hub-card-icon">🏛️</span>
        <div className="hub-card-content">
          <div className="hub-card-title">الصفحة الرئيسية للمنصة</div>
          <div className="hub-card-subtitle">نظرة شاملة على المنظومة</div>
        </div>
      </button>

      {/* Contextual Role Groups */}
      <div className="sidebar-groups-container">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="sidebar-group">
            <div className="sidebar-group-title">
              {group.title}
            </div>

            <div className="sidebar-group-items">
              {group.items.map(itemObj => {
                const screen = screensCatalog.find(s => s.id === itemObj.id);
                if (!screen) return null;
                const isActive = currentScreen === screen.id;

                return (
                  <button
                    type="button"
                    key={screen.id}
                    onClick={() => setCurrentScreen(screen.id)}
                    className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
                    title={screen.subtitle}
                  >
                    <span className="sidebar-item-icon">{screen.icon}</span>
                    <span className="sidebar-item-title">
                      {itemObj.label}
                    </span>
                    {itemObj.badge && (
                      <span className={`sidebar-item-badge ${isActive ? 'badge-active' : ''}`}>
                        {itemObj.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
