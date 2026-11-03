import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { screensCatalog } from '../data/screensCatalog';

export const QuickSwitcherModal = () => {
  const { isQuickSwitcherOpen, setIsQuickSwitcherOpen, setCurrentScreen } = useApp();
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

  const filtered = screensCatalog.filter(s =>
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
        background: 'rgba(0, 0, 0, 0.75)',
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
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
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
            placeholder="ابحث بالاسم، التصنيف، أو الرقم (مثال: 'حلبة', 'معلم', '09')..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '16px',
              fontFamily: 'var(--font-ar)',
              outline: 'none'
            }}
          />
          <button
            onClick={() => setIsQuickSwitcherOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
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
              لم يتم العثور على شاشة مطابقة للبحث "{filterText}"
            </div>
          ) : (
            filtered.map((screen) => (
              <button
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
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid transparent',
                  borderRadius: '12px',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'right',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-ar)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(79, 70, 229, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.06)',
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
                    <span style={{ fontSize: '11px', background: 'rgba(255, 255, 255, 0.08)', padding: '2px 8px', borderRadius: '10px', color: 'var(--text-muted)' }}>
                      #{screen.id}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {screen.subtitle}
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '700' }}>
                  {screen.category}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div style={{
          padding: '12px 20px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderTop: '1px solid var(--border-card)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--text-muted)'
        }}>
          <span>اضغط على أي واجهة للانتقال إليها فوراً</span>
          <span>18 واجهة جاهزة</span>
        </div>
      </div>
    </div>
  );
};
