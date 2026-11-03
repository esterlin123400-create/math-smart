import React, { useState } from 'react';
import { mathSymbolCategories } from '../data/mathSymbols';
import { useApp } from '../context/AppContext';

export const MathKeypad = ({ onInsert, compact = false }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const { showToast } = useApp();

  const handleKeyClick = (char) => {
    if (onInsert) {
      onInsert(char);
    } else {
      navigator.clipboard?.writeText(char);
      showToast(`تم نسخ الرمز "${char}" إلى الحافظة!`, 'success');
    }
  };

  const currentCategory = mathSymbolCategories.find(c => c.id === activeTab) || mathSymbolCategories[0];

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--border-card)',
      borderRadius: '18px',
      padding: compact ? '12px' : '18px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {mathSymbolCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === cat.id ? 'linear-gradient(135deg, #4f46e5, #06b6d4)' : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === cat.id ? '#fff' : 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-ar)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Grid of Keys */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: compact ? 'repeat(4, 1fr)' : 'repeat(6, 1fr)',
        gap: '8px'
      }}>
        {currentCategory.symbols.map((sym, idx) => (
          <button
            key={idx}
            onClick={() => handleKeyClick(sym.char)}
            style={{
              padding: compact ? '8px 4px' : '12px 8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-card)',
              borderRadius: '10px',
              color: '#fff',
              fontFamily: 'var(--font-en), var(--font-ar)',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(79, 70, 229, 0.25)';
              e.currentTarget.style.borderColor = '#818cf8';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'var(--border-card)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title={sym.label}
          >
            <span style={{ fontSize: '18px' }}>{sym.char}</span>
            {!compact && (
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                {sym.label}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
