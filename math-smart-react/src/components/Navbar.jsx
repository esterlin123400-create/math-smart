import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar = () => {
  const {
    currentScreen,
    setCurrentScreen,
    setIsQuickSwitcherOpen,
    searchQuery,
    setSearchQuery,
    isSidebarOpen,
    setIsSidebarOpen,
    showToast
  } = useApp();
  const { user, role, loginAs, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const roleMenuRef = useRef(null);
  const moreMenuRef = useRef(null);

  const isFullWidthPage = currentScreen === 'hub' || ['04', '05', '10', '14', '15'].includes(currentScreen);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target)) {
        setShowRoleMenu(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getRoleLabel = () => {
    if (role === 'student') return `طالب • المستوى ${user?.level || 1}`;
    if (role === 'teacher') return 'معلم رياضيات';
    if (role === 'supervisor') return 'مشرف تربوي';
    return 'زائر المنصة';
  };

  const primaryNavItems = [
    { id: 'hub', label: 'الرئيسية', icon: '🏛️' },
    { id: '13', label: 'بوابة الطالب', icon: '🎒' },
    { id: '09', label: 'مختبر المسائل', icon: '✍️' },
    { id: '03', label: 'حلبة التحديات', icon: '⚡' },
    { id: '17', label: 'المناهج', icon: '📖' },
    { id: '02', label: 'بوابة المعلم', icon: '👨‍🏫' }
  ];

  const moreNavItems = [
    { id: '01', label: 'التقييم الذكي والشهادة', icon: '📋', desc: 'تقييم فوري وطباعة شهادة التفوق' },
    { id: '06', label: 'تحديد المرحلة والصف', icon: '🎯', desc: 'ابتدائي، متوسط، ثانوي' },
    { id: '07', label: 'إدارة السجلات المركزية', icon: '📊', desc: 'سجلات الدرجات وتصدير CSV' },
    { id: '08', label: 'التقارير الأكاديمية', icon: '📈', desc: 'تحليلات الأداء والمهارات' },
    { id: '12', label: 'لوحة الرموز والمعادلات', icon: '⌨️', desc: 'محرر معادلات رياضية متخصص' },
    { id: '16', label: 'متابعة ولي الأمر', icon: '👨‍👩‍👧', desc: 'حجز المقابلات وتقارير التقدم' },
    { id: '18', label: 'الهوية البصرية والشعار', icon: '🎨', desc: 'دليل الألوان والرموز الرسمية' }
  ];

  const isMoreActive = moreNavItems.some(item => item.id === currentScreen);

  return (
    <header className="app-navbar">
      {/* Brand & Contextual Sidebar Toggle */}
      <div className="app-navbar-brand-section">
        {!isFullWidthPage && (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="navbar-icon-btn"
            title={isSidebarOpen ? 'طي القائمة الجانبية' : 'فتح قائمة الأدوات'}
          >
            {isSidebarOpen ? '◀' : '☰'}
          </button>
        )}

        <button
          type="button"
          onClick={() => setCurrentScreen('hub')}
          className="app-navbar-brand-btn"
          title="الانتقال إلى الصفحة الرئيسية"
        >
          <div className="navbar-logo-wrapper">
            <img
              src="/assets/math_smart_logo.jpg"
              alt="شعار أذكياء الرياضيات"
              decoding="async"
              className="navbar-logo-img"
              onError={(e) => { e.currentTarget.src = '/assets/math_smart_logo.svg'; }}
            />
          </div>
          <div>
            <div className="app-navbar-brand-title">أذكياء الرياضيات</div>
            <div className="app-navbar-brand-tagline">منصة التعليم الذكي للرياضيات</div>
          </div>
        </button>
      </div>

      {/* Main Navigation Menu */}
      <nav className="app-navbar-nav-menu" aria-label="التنقل الرئيسي">
        {primaryNavItems.map(item => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentScreen(item.id)}
              className={`app-navbar-nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span className="nav-item-label">{item.label}</span>
              {isActive && <span className="nav-item-indicator" />}
            </button>
          );
        })}

        {/* More Academic Portals Dropdown */}
        <div className="navbar-dropdown-wrapper" ref={moreMenuRef}>
          <button
            type="button"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`app-navbar-nav-link ${isMoreActive ? 'active' : ''}`}
          >
            <span className="nav-item-icon">📂</span>
            <span className="nav-item-label">أدوات أخرى</span>
            <span className="dropdown-caret">▼</span>
            {isMoreActive && <span className="nav-item-indicator" />}
          </button>

          {showMoreMenu && (
            <div className="navbar-dropdown-menu">
              <div className="dropdown-header">أدوات ومرافق المنصة التعليمية</div>
              <div className="dropdown-grid">
                {moreNavItems.map(sub => {
                  const isSubActive = currentScreen === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        setCurrentScreen(sub.id);
                        setShowMoreMenu(false);
                      }}
                      className={`dropdown-item ${isSubActive ? 'active' : ''}`}
                    >
                      <span className="dropdown-item-icon">{sub.icon}</span>
                      <div className="dropdown-item-info">
                        <div className="dropdown-item-title">{sub.label}</div>
                        <div className="dropdown-item-desc">{sub.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Search Bar */}
      <div className="app-navbar-search">
        <input
          type="text"
          placeholder="ابحث عن درس، مسألة، أو أداة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClick={() => {
            if (currentScreen !== 'hub') {
              setIsQuickSwitcherOpen(true);
            }
          }}
          className="navbar-search-input"
        />
        <span className="navbar-search-icon">🔍</span>
      </div>

      {/* Right Action Bar: Theme Toggle + Auth/Role Profile */}
      <div className="app-navbar-actions">
        {/* Login CTA for guests or Quick XP Pill for students */}
        {role === 'guest' ? (
          <button
            type="button"
            onClick={() => setCurrentScreen('04')}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '12px' }}
          >
            تسجيل الدخول
          </button>
        ) : role === 'student' ? (
          <button
            type="button"
            onClick={() => setCurrentScreen('13')}
            className="screens-badge-pill"
            style={{
              background: 'rgba(217, 119, 6, 0.1)',
              borderColor: 'rgba(217, 119, 6, 0.3)',
              color: '#d97706'
            }}
            title="رصيد نقاط التميز XP"
          >
            <span>🏆</span>
            <span>{user?.xp || 1250} XP</span>
          </button>
        ) : null}

        {/* Theme Switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          className="navbar-icon-btn"
          title={theme === 'dark' ? 'تفعيل المظهر المشرق المريح للعين ☀️' : 'تفعيل الوضع الليلي الهادئ 🌙'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Account & Role Switcher Menu */}
        <div className="navbar-user-wrapper" ref={roleMenuRef}>
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="navbar-user-btn"
            title="حسابي وتبديل الدور"
          >
            <div
              className="navbar-user-avatar"
              style={{
                background:
                  role === 'student' ? 'linear-gradient(135deg, #fb923c, #f97316)' :
                  role === 'teacher' ? 'linear-gradient(135deg, #10b981, #14b8a6)' :
                  role === 'supervisor' ? 'linear-gradient(135deg, #0d9488, #06b6d4)' :
                  'linear-gradient(135deg, #64748b, #475569)'
              }}
            >
              {role === 'student' ? '🎒' : role === 'teacher' ? '👨‍🏫' : role === 'supervisor' ? '🛡️' : '👤'}
            </div>
            <div className="navbar-user-details">
              <div className="navbar-user-name">{user?.name || 'حساب تجريبي'}</div>
              <div className="navbar-user-role">{getRoleLabel()}</div>
            </div>
            <span className="dropdown-caret">▼</span>
          </button>

          {showRoleMenu && (
            <div className="navbar-user-dropdown">
              <div className="user-dropdown-header">
                <div style={{ fontWeight: '800', color: 'var(--text-heading)' }}>
                  {user?.name || 'زائر المنصة'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {getRoleLabel()}
                </div>
              </div>

              <div className="user-dropdown-section-title">
                تبديل الدور السريع (للتجربة والمعاينة):
              </div>

              <button
                type="button"
                onClick={() => {
                  loginAs('student');
                  setShowRoleMenu(false);
                  showToast('تم التبديل إلى حساب الطالب (فهد السالم)', 'info');
                  setCurrentScreen('13');
                }}
                className={`user-dropdown-action ${role === 'student' ? 'active' : ''}`}
              >
                <span>🎒</span>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontWeight: '700' }}>فضاء الطالب</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>فهد السالم • المستوى 3</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  loginAs('teacher');
                  setShowRoleMenu(false);
                  showToast('تم التبديل إلى حساب المعلم (أ. طارق العمري)', 'info');
                  setCurrentScreen('02');
                }}
                className={`user-dropdown-action ${role === 'teacher' ? 'active' : ''}`}
              >
                <span>👨‍🏫</span>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontWeight: '700' }}>فضاء المعلم</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>أ. طارق العمري • معلم رياضيات</div>
                </div>
              </button>

              <div style={{ borderTop: '1px solid var(--border-card)', margin: '6px 0' }} />

              <button
                type="button"
                onClick={() => {
                  setCurrentScreen('11');
                  setShowRoleMenu(false);
                }}
                className="user-dropdown-action"
              >
                <span>⚙️</span>
                <span style={{ flex: 1, textAlign: 'right' }}>الملف الشخصي والإعدادات</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentScreen('04');
                  setShowRoleMenu(false);
                }}
                className="user-dropdown-action"
              >
                <span>🔐</span>
                <span style={{ flex: 1, textAlign: 'right' }}>بوابات الدخول والتسجيل</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  setShowRoleMenu(false);
                  showToast('تم تسجيل الخروج بنجاح', 'info');
                  setCurrentScreen('hub');
                }}
                className="user-dropdown-action logout-action"
              >
                <span>🚪</span>
                <span style={{ flex: 1, textAlign: 'right' }}>تسجيل الخروج</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
