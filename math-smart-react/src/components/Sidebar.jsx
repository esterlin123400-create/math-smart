import React from 'react';
import { useApp } from '../context/AppContext';
import { screensCatalog } from '../data/screensCatalog';

export const Sidebar = () => {
  const { currentScreen, setCurrentScreen, isSidebarOpen, setIsSidebarOpen } = useApp();

  const groups = [
    {
      title: '🚀 1. الهوية وبوابات الدخول (6)',
      items: ['18', '04', '15', '10', '14', '05']
    },
    {
      title: '📚 2. المراحل والمناهج الدراسية (2)',
      items: ['06', '17']
    },
    {
      title: '🎯 3. بيئة الطالب والتعلم والتقييم (5)',
      items: ['13', '09', '12', '03', '01']
    },
    {
      title: '👨‍🏫 4. لوحة المعلم والتقارير والمتابعة (4)',
      items: ['02', '07', '08', '16']
    },
    {
      title: '⚙️ 5. الملف الشخصي والإعدادات (1)',
      items: ['11']
    }
  ];

  if (!isSidebarOpen) {
    return (
      <aside className="app-sidebar-collapsed">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-ar)'
          }}
          title="توسيع القائمة"
        >
          <span>☰</span>
        </button>
      </aside>
    );
  }

  return (
    <aside className="app-sidebar">
      {/* Sidebar Top / Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--border-card)'
      }}>
        <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)' }}>
          فهرس شاشات المنصة
        </span>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          title="تصغير القائمة الجانبية"
        >
          ✕
        </button>
      </div>

      {/* Main Hub Link */}
      <button
        type="button"
        onClick={() => setCurrentScreen('hub')}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 14px',
          background: currentScreen === 'hub' ? 'linear-gradient(135deg, #4f46e5, #06b6d4)' : 'var(--bg-subtle)',
          border: '1px solid var(--border-card)',
          borderRadius: '12px',
          color: currentScreen === 'hub' ? '#fff' : 'var(--text-heading)',
          fontFamily: 'var(--font-ar)',
          fontSize: '13px',
          fontWeight: '800',
          cursor: 'pointer',
          marginBottom: '20px',
          textAlign: 'right',
          boxShadow: currentScreen === 'hub' ? '0 4px 15px rgba(79, 70, 229, 0.35)' : 'none'
        }}
      >
        <span style={{ fontSize: '18px' }}>🏛️</span>
        <div style={{ flex: 1 }}>
          <div>بوابة المعرض الرئيسية</div>
          <div style={{ fontSize: '10px', opacity: 0.8 }}>استعراض الواجهات الـ 18</div>
        </div>
        <span style={{
          background: currentScreen === 'hub' ? 'rgba(255,255,255,0.22)' : 'var(--bg-subtle-strong)',
          padding: '2px 8px',
          borderRadius: '10px',
          fontSize: '11px'
        }}>
          18
        </span>
      </button>

      {/* Categorized Nav Groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {groups.map((group, gIdx) => (
          <div key={gIdx}>
            <div style={{
              fontSize: '11px',
              fontWeight: '800',
              color: 'var(--text-muted)',
              marginBottom: '8px',
              paddingRight: '6px'
            }}>
              {group.title}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {group.items.map(screenId => {
                const screen = screensCatalog.find(s => s.id === screenId);
                if (!screen) return null;
                const isActive = currentScreen === screen.id;

                return (
                  <button
                    type="button"
                    key={screen.id}
                    onClick={() => setCurrentScreen(screen.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      background: isActive ? 'rgba(79, 70, 229, 0.18)' : 'transparent',
                      border: isActive ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid transparent',
                      borderRadius: '10px',
                      color: isActive ? 'var(--text-heading)' : 'var(--text-body)',
                      fontFamily: 'var(--font-ar)',
                      fontSize: '12px',
                      fontWeight: isActive ? '800' : '600',
                      cursor: 'pointer',
                      textAlign: 'right',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>{screen.icon}</span>
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {screen.title}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-en)'
                    }}>
                      #{screen.id}
                    </span>
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
