import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { screensCatalog } from '../data/screensCatalog';

export const Navbar = () => {
  const { currentScreen, setCurrentScreen, setIsQuickSwitcherOpen, searchQuery, setSearchQuery, isSidebarOpen, setIsSidebarOpen } = useApp();
  const { user, role, loginAs } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <header style={{
      background: 'rgba(13, 18, 34, 0.82)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-card)',
      padding: '14px 28px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px'
    }}>
      {/* Brand & Hub Link */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
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
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.currentTarget.src = '/assets/math_smart_logo.svg'; }}
            />
          </div>
          <div>
            <div style={{
              fontSize: '18px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #ffffff 40%, #93c5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.2
            }}>
              أذكياء الرياضيات
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              منصة التقييم والتحديات التفاعلية
            </div>
          </div>
        </button>

        {/* 18 Screens Badge */}
        <span
          onClick={() => setIsQuickSwitcherOpen(true)}
          style={{
            cursor: 'pointer',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title="فتح القافز السريع بين الواجهات الـ 18"
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
          18 واجهة مفعلة بالكامل
        </span>
      </div>

      {/* Center Search & Quick Navigator trigger */}
      <div style={{ flex: '1', maxWidth: '420px', position: 'relative' }}>
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
            padding: '10px 42px 10px 16px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid var(--border-card)',
            borderRadius: '30px',
            color: '#fff',
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
          fontSize: '15px'
        }}>
          🔍
        </span>
        <button
          onClick={() => setIsQuickSwitcherOpen(true)}
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.08)',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Hub Button */}
        <button
          onClick={() => setCurrentScreen('hub')}
          className={`btn ${currentScreen === 'hub' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '12px' }}
        >
          🏛️ معرض كل الواجهات
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: '38px',
            height: '38px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-card)',
            borderRadius: '10px',
            color: '#fff',
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
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
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
              background: role === 'student' ? '#f59e0b' : '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px'
            }}>
              {role === 'student' ? '🎒' : role === 'teacher' ? '👨‍🏫' : '🛡️'}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', fontWeight: '800' }}>{user.name}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {role === 'student' ? 'طالب (المستوى 8)' : role === 'teacher' ? 'معلم رياضيات' : 'مشرف تربوي'}
              </div>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>▼</span>
          </button>

          {showRoleMenu && (
            <div style={{
              position: 'absolute',
              left: 0,
              top: '46px',
              width: '210px',
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border-card)',
              borderRadius: '14px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
              padding: '8px',
              zIndex: 50
            }}>
              <div style={{ padding: '8px 12px', fontSize: '11px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-card)' }}>
                تبديل الدور للتجربة:
              </div>
              <button
                onClick={() => { loginAs('student'); setShowRoleMenu(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  background: role === 'student' ? 'rgba(245, 158, 11, 0.15)' : 'none',
                  border: 'none',
                  borderRadius: '8px',
                  color: role === 'student' ? '#fbbf24' : '#fff',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ar)',
                  fontSize: '13px',
                  textAlign: 'right'
                }}
              >
                🎒 طالب (فهد السالم)
              </button>
              <button
                onClick={() => { loginAs('teacher'); setShowRoleMenu(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  background: role === 'teacher' ? 'rgba(79, 70, 229, 0.15)' : 'none',
                  border: 'none',
                  borderRadius: '8px',
                  color: role === 'teacher' ? '#818cf8' : '#fff',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ar)',
                  fontSize: '13px',
                  textAlign: 'right'
                }}
              >
                👨‍🏫 معلم (أ. طارق العمري)
              </button>
              <button
                onClick={() => { setCurrentScreen('11'); setShowRoleMenu(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  background: 'none',
                  borderTop: '1px solid var(--border-card)',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ar)',
                  fontSize: '12px',
                  textAlign: 'right',
                  marginTop: '4px'
                }}
              >
                ⚙️ الملف الشخصي والإعدادات
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
