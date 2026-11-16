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

  // Close dropdowns on outside click
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
    if (role === 'student') return `طالب (المستوى ${user?.level || 1})`;
    if (role === 'teacher') return 'معلم رياضيات';
    if (role === 'supervisor') return 'مشرف تربوي';
    return 'زائر المنصة';
  };

  const primaryNavItems = [
    { id: 'hub', label: 'الرئيسية', icon: '🏛️' },
    { id: '13', label: 'بوابة الطالب', icon: '🎒' },
    { id: '09', label: 'مختبر المسائل', icon: '✍️' },
    { id: '03', label: 'حلبة التحديات', icon: '⚡' },
    { id: '17', label: 'المناهج والوحدات', icon: '📖' },
    { id: '02', label: 'بوابة المعلم', icon: '👨‍🏫' }
  ];

  const moreNavItems = [
    { id: '01', label: 'بطاقة التقييم والشهادة', icon: '📋', desc: 'تقييم فوري وطباعة شهادة' },
    { id: '06', label: 'تحديد المرحلة والصف', icon: '🎯', desc: 'ابتدائي، متوسط، ثانوي' },
    { id: '07', label: 'إدارة السجلات المركزية', icon: '📊', desc: 'تصدير درجات الطلاب CSV' },
    { id: '08', label: 'التقارير الأكاديمية', icon: '📈', desc: 'تحليلات الأداء والمهارات' },
    { id: '12', label: 'لوحة الرموز والمعادلات', icon: '⌨️', desc: 'مدخلات رياضية متقدمة' },
    { id: '16', label: 'متابعة ولي الأمر', icon: '👨‍👩‍👧', desc: 'حجز المقابلات والملاحظات' },
    { id: '18', label: 'دليل الهوية والشعار', icon: '🎨', desc: 'الألوان والرموز المعتمدة' }
  ];

  const isMoreActive = moreNavItems.some(item => item.id === currentScreen);

  return (
    <header className="app-navbar">
      {/* Brand & Sidebar Toggle */}
      <div className="app-navbar-brand-section">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="navbar-icon-btn"
          title={isSidebarOpen ? 'إخفاء القائمة الجانبية' : 'إظهار القائمة الجانبية'}
        >
          {isSidebarOpen ? '◀' : '☰'}
        </button>

        <button
          type="button"
          onClick={() => setCurrentScreen('hub')}
          className="app-navbar-brand-btn"
          title="الانتقال إلى البوابة الرئيسية"
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
            <div className="app-navbar-brand-tagline">منظومة الرياضيات الذكية</div>
          </div>
        </button>
      </div>

      {/* Primary Educational Navigation Links */}
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

        {/* More Portals Dropdown */}
        <div className="navbar-dropdown-wrapper" ref={moreMenuRef}>
          <button
            type="button"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`app-navbar-nav-link ${isMoreActive ? 'active' : ''}`}
            title="استعراض باقي بوابات النظام"
          >
            <span className="nav-item-icon">📂</span>
            <span className="nav-item-label">المزيد</span>
            <span className="dropdown-caret">▼</span>
            {isMoreActive && <span className="nav-item-indicator" />}
          </button>

          {showMoreMenu && (
            <div className="navbar-dropdown-menu">
              <div className="dropdown-header">بوابات إضافية في المنصة:</div>
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

      {/* Quick Search & Switcher Bar */}
      <div className="app-navbar-search">
        <input
          type="text"
          placeholder="ابحث في البوابات والمسائل والأدوات..."
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
        <button
          type="button"
          onClick={() => setIsQuickSwitcherOpen(true)}
          className="navbar-search-shortcut"
          title="فتح القافز السريع (⌘ K)"
        >
          ⌘ K
        </button>
      </div>

      {/* Right Controls: Theme + Quick Switcher Badge + User Role Dropdown */}
      <div className="app-navbar-actions">
        {/* All Screens Indicator / Switcher Trigger */}
        <button
          type="button"
          onClick={() => setIsQuickSwitcherOpen(true)}
          className="screens-badge-pill"
          title="عرض جميع بوابات النظام الـ 18"
        >
          <span className="badge-live-dot" />
          <span className="badge-text">18 بوابة</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="navbar-icon-btn"
          title={theme === 'dark' ? 'التحويل للوضع الفاتح ☀️' : 'التحويل للوضع الداكن 🌙'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* User Account / Role Menu */}
        <div className="navbar-user-wrapper" ref={roleMenuRef}>
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="navbar-user-btn"
            title="إدارة الحساب وتبديل الدور"
          >
            <div
              className="navbar-user-avatar"
              style={{
                background:
                  role === 'student' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                  role === 'teacher' ? 'linear-gradient(135deg, #4f46e5, #06b6d4)' :
                  role === 'supervisor' ? 'linear-gradient(135deg, #10b981, #059669)' :
                  'linear-gradient(135deg, #64748b, #475569)'
              }}
            >
              {role === 'student' ? '🎒' : role === 'teacher' ? '👨‍🏫' : role === 'supervisor' ? '🛡️' : '👤'}
            </div>
            <div className="navbar-user-details">
              <div className="navbar-user-name">{user?.name || 'زائر المنصة'}</div>
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
                  {getRoleLabel()} • منصة أذكياء الرياضيات
                </div>
              </div>

              <div className="user-dropdown-section-title">
                تبديل الدور للتجربة والمعاينة:
              </div>

              <button
                type="button"
                onClick={() => {
                  loginAs('student');
                  setShowRoleMenu(false);
                  showToast('تم التبديل إلى حساب الطالب (فهد السالم)', 'info');
                }}
                className={`user-dropdown-action ${role === 'student' ? 'active' : ''}`}
              >
                <span>🎒</span>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontWeight: '700' }}>طالب (فهد السالم)</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>المستوى 3 • 1,250 XP</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  loginAs('teacher');
                  setShowRoleMenu(false);
                  showToast('تم التبديل إلى حساب المعلم (أ. طارق العمري)', 'info');
                }}
                className={`user-dropdown-action ${role === 'teacher' ? 'active' : ''}`}
              >
                <span>👨‍🏫</span>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontWeight: '700' }}>معلم (أ. طارق العمري)</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>معلم رياضيات • 3 فصول</div>
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
                <span style={{ flex: 1, textAlign: 'right' }}>الملف الشخصي وتفضيلات النظام</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  setShowRoleMenu(false);
                  showToast('تم تسجيل الخروج بنجاح', 'info');
                  setCurrentScreen('04');
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
