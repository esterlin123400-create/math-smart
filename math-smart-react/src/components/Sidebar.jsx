import React from 'react';
import { useApp } from '../context/AppContext';
import { screensCatalog } from '../data/screensCatalog';

export const Sidebar = () => {
  const { currentScreen, setCurrentScreen, isSidebarOpen, setIsSidebarOpen } = useApp();

  const groups = [
    {
      title: '🎒 بيئة الطالب والتعلّم',
      items: [
        { id: '13', badge: 'رئيسي' },
        { id: '09', badge: 'ذكي' },
        { id: '03', badge: 'مباشر' },
        { id: '01', badge: 'شهادة' },
        { id: '12', badge: null }
      ]
    },
    {
      title: '📚 المناهج والمسارات',
      items: [
        { id: '17', badge: '12 وحدة' },
        { id: '06', badge: null }
      ]
    },
    {
      title: '👨‍🏫 لوحة المعلم والمتابعة',
      items: [
        { id: '02', badge: 'معتمد' },
        { id: '07', badge: 'CSV' },
        { id: '08', badge: 'تحليلات' },
        { id: '16', badge: 'جلسات' }
      ]
    },
    {
      title: '🔐 بوابات الدخول والتسجيل',
      items: [
        { id: '04', badge: null },
        { id: '15', badge: 'جديد' },
        { id: '10', badge: null },
        { id: '14', badge: null },
        { id: '05', badge: 'OTP' }
      ]
    },
    {
      title: '⚙️ إعدادات النظام والهوية',
      items: [
        { id: '11', badge: null },
        { id: '18', badge: 'الهوية' }
      ]
    }
  ];

  if (!isSidebarOpen) {
    return (
      <aside className="app-sidebar-collapsed">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="sidebar-collapsed-btn"
          title="توسيع القائمة الجانبية"
        >
          <span>☰</span>
          <span className="collapsed-text">القائمة</span>
        </button>
      </aside>
    );
  }

  return (
    <aside className="app-sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-header-title">
          <span>فهرس بوابات المنصة</span>
          <span className="sidebar-count-badge">18 بوابة</span>
        </div>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="sidebar-close-btn"
          title="تصغير القائمة الجانبية"
        >
          ✕
        </button>
      </div>

      {/* Main Hub Overview Card */}
      <button
        type="button"
        onClick={() => setCurrentScreen('hub')}
        className={`sidebar-hub-card ${currentScreen === 'hub' ? 'active' : ''}`}
      >
        <span className="hub-card-icon">🏛️</span>
        <div className="hub-card-content">
          <div className="hub-card-title">بوابة الاستكشاف الشاملة</div>
          <div className="hub-card-subtitle">الصفحة الرئيسية للمنصة</div>
        </div>
        <span className="hub-card-badge">الرئيسية</span>
      </button>

      {/* Navigation Sections */}
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
                      {screen.title}
                    </span>
                    {itemObj.badge ? (
                      <span className={`sidebar-item-badge ${isActive ? 'badge-active' : ''}`}>
                        {itemObj.badge}
                      </span>
                    ) : (
                      <span className="sidebar-item-id">
                        {screen.id}
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
