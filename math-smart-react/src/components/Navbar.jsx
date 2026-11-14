import React, { useState } from 'react';
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

  const getRoleLabel = () => {
    if (role === 'student') return `طالب (المستوى ${user?.level || 1})`;
    if (role === 'teacher') return 'معلم رياضيات';
    if (role === 'supervisor') return 'مشرف تربوي';
    return 'زائر المنصة';
  };

  return (
    <header className="app-navbar">
      {/* Brand & Hub Link */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-card)',
            color: 'var(--text-muted)',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          title={isSidebarOpen ? 'إخفاء القائمة الجانبية' : 'إظهار القائمة الجانبية'}
        >
          {isSidebarOpen ? '◀' : '☰'}
        </button>

        <button
          type="button"
          onClick={() => setCurrentScreen('hub')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'right'
          }}
          title="الانتقال إلى البوابة الرئيسية والمعرض"
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.45)',
            border: '1.5px solid rgba(56, 189, 248, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0e1c'
          }}>
            <img
              src="/assets/math_smart_logo.jpg"
              alt="شعار أذكياء الرياضيات"
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.currentTarget.src = '/assets/math_smart_logo.svg'; }}
            />
          </div>
          <div>
            <div className="app-navbar-brand-title">
              أذكياء الرياضيات
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              منصة التقييم والتحديات التفاعلية
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsQuickSwitcherOpen(true)}
          style={{
            cursor: 'pointer',
            background: 'rgba(16, 185, 129, 0.14)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: 'var(--accent-emerald)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-ar)'
          }}
          title="فتح القافز السريع بين الواجهات الـ 18"
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
          18 واجهة مفعلة بالكامل
        </button>
      </div>

      {/* Center Search & Quick Navigator trigger */}
      <div className="app-navbar-search">
        <input
          type="text"
          placeholder="ابحث في الواجهات الـ 18، المسائل، أو الأدوات..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClick={() => {
            if (currentScreen !== 'hub') {
              setIsQuickSwitcherOpen(true);
            }
          }}
          style={{
            width: '100%',
            padding: '10px 42px 10px 58px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-card)',
            borderRadius: '30px',
            color: 'var(--text-heading)',
            fontFamily: 'var(--font-ar)',
            fontSize: '13px',
            outline: 'none',
            transition: 'all 0.2s'
          }}
        />
        <span style={{
          position: 'absolute',
          right: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)',
          fontSize: '15px',
          pointerEvents: 'none'
        }}>
          🔍
        </span>
        <button
          type="button"
          onClick={() => setIsQuickSwitcherOpen(true)}
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--bg-subtle-strong)',
            border: '1px solid var(--border-card)',
            borderRadius: '6px',
            padding: '2px 7px',
            fontSize: '11px',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
          title="فتح مستكشف الواجهات"
        >
          ⌘ K
        </button>
      </div>

      {/* Actions & Role Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setCurrentScreen('hub')}
          className={`btn ${currentScreen === 'hub' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '12px' }}
        >
          🏛️ معرض كل الواجهات
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          style={{
            width: '38px',
            height: '38px',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-card)',
            borderRadius: '10px',
            color: 'var(--text-heading)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px'
          }}
          title={theme === 'dark' ? 'التحويل للوضع الفاتح' : 'التحويل للوضع الداكن'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Role Switcher Pill */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-card)',
              borderRadius: '24px',
              padding: '6px 14px',
              cursor: 'pointer',
              color: 'var(--text-heading)'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: role === 'student' ? '#f59e0b' : role === 'guest' ? '#64748b' : '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px'
            }}>
              {role === 'student' ? '🎒' : role === 'teacher' ? '👨‍🏫' : role === 'supervisor' ? '🛡️' : '👤'}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-heading)' }}>{user?.name || 'زائر المنصة'}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {getRoleLabel()}
              </div>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>▼</span>
          </button>

          {showRoleMenu && (
            <div style={{
              position: 'absolute',
              left: 0,
              top: '48px',
              width: '220px',
              background: 'var(--bg-modal)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border-card)',
              borderRadius: '14px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
              padding: '8px',
              zIndex: 50
            }}>
              <div style={{ padding: '8px 12px', fontSize: '11px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-card)' }}>
                تبديل الدور للتجربة:
              </div>
              <button
                type="button"
                onClick={() => { loginAs('student'); setShowRoleMenu(false); showToast('تم التبديل إلى حساب الطالب (فهد السالم)', 'info'); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  background: role === 'student' ? 'rgba(245, 158, 11, 0.16)' : 'none',
                  border: 'none',
                  borderRadius: '8px',
                  color: role === 'student' ? '#f59e0b' : 'var(--text-heading)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ar)',
                  fontSize: '13px',
                  fontWeight: '700',
                  textAlign: 'right'
                }}
              >
                🎒 طالب (فهد السالم)
              </button>
              <button
                type="button"
                onClick={() => { loginAs('teacher'); setShowRoleMenu(false); showToast('تم التبديل إلى حساب المعلم (أ. طارق العمري)', 'info'); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  background: role === 'teacher' ? 'rgba(79, 70, 229, 0.16)' : 'none',
                  border: 'none',
                  borderRadius: '8px',
                  color: role === 'teacher' ? 'var(--primary-light)' : 'var(--text-heading)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ar)',
                  fontSize: '13px',
                  fontWeight: '700',
                  textAlign: 'right'
                }}
              >
                👨‍🏫 معلم (أ. طارق العمري)
              </button>
              <button
                type="button"
                onClick={() => { setCurrentScreen('11'); setShowRoleMenu(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  background: 'none',
                  border: 'none',
                  borderTop: '1px solid var(--border-card)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ar)',
                  fontSize: '12px',
                  textAlign: 'right',
                  marginTop: '4px'
                }}
              >
                ⚙️ الملف الشخصي والإعدادات
              </button>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  setShowRoleMenu(false);
                  showToast('تم تسجيل الخروج بنجاح', 'info');
                  setCurrentScreen('04');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  background: 'none',
                  border: 'none',
                  borderTop: '1px solid var(--border-card)',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ar)',
                  fontSize: '12px',
                  fontWeight: '700',
                  textAlign: 'right'
                }}
              >
                🚪 تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
