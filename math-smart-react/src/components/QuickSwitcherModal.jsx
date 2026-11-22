import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { screensCatalog } from '../data/screensCatalog';

export const QuickSwitcherModal = () => {
  const { isQuickSwitcherOpen, setIsQuickSwitcherOpen, setCurrentScreen } = useApp();
  const { role, canAccessScreen } = useAuth();
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsQuickSwitcherOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsQuickSwitcherOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsQuickSwitcherOpen]);

  if (!isQuickSwitcherOpen) return null;

  const filtered = screensCatalog
    .filter(s => canAccessScreen ? canAccessScreen(s.id, role) : true)
    .filter(s =>
      s.title.includes(filterText) ||
      s.category.includes(filterText) ||
      s.subtitle.includes(filterText) ||
      s.id.includes(filterText)
    );

  return (
    <div
      onClick={() => setIsQuickSwitcherOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'var(--bg-modal)',
          border: '1px solid var(--border-card)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh'
        }}
      >
        {/* Header & Search */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-card)', display: 'flex', gap: '14px', alignItems: 'center' }}>
          <span style={{ fontSize: '20px' }}>🔍</span>
          <input
            type="text"
            autoFocus
            placeholder="ابحث عن درس، أداة، حلبة تحديات، أو بوابة (مثال: 'حلبة', 'مناهج', 'معلم')..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: 'var(--text-heading)',
              fontSize: '16px',
              fontFamily: 'var(--font-ar)',
              outline: 'none'
            }}
          />
          <button
            type="button"
            onClick={() => setIsQuickSwitcherOpen(false)}
            style={{
              background: 'var(--bg-subtle-strong)',
              border: 'none',
              color: 'var(--text-muted)',
              borderRadius: '8px',
              padding: '4px 10px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div style={{ padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
              لم يتم العثور على نتيجة مطابقة للبحث &quot;{filterText}&quot;
            </div>
          ) : (
            filtered.map((screen) => (
              <button
                type="button"
                key={screen.id}
                onClick={() => {
                  setCurrentScreen(screen.id);
                  setIsQuickSwitcherOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 16px',
                  background: 'var(--bg-subtle)',
                  border: '1px solid transparent',
                  borderRadius: '12px',
                  color: 'var(--text-heading)',
                  cursor: 'pointer',
                  textAlign: 'right',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-ar)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(20, 184, 166, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-subtle)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--bg-subtle-strong)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {screen.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '800' }}>{screen.title}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {screen.subtitle}
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: '700' }}>
                  {screen.category}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div style={{
          padding: '12px 20px',
          background: 'var(--bg-inset)',
          borderTop: '1px solid var(--border-card)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--text-muted)'
        }}>
          <span>اختر أي بوابة أو أداة للانتقال إليها مباشرة</span>
          <span>منصة أذكياء الرياضيات الذكية</span>
        </div>
      </div>
    </div>
  );
};
