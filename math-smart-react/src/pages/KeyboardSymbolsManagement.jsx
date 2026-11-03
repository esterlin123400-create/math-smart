import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mathSymbolCategories } from '../data/mathSymbols';

export const KeyboardSymbolsManagement = () => {
  const { setCurrentScreen, showToast } = useApp();
  const [testFormula, setTestFormula] = useState('3س² + 4ص - √16 = 25');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchSymbol, setSearchSymbol] = useState('');

  const handleInsertSymbol = (char) => {
    setTestFormula(prev => prev + char);
  };

  const handleCopySymbol = (sym) => {
    navigator.clipboard?.writeText(sym.char);
    showToast(`تم نسخ الرمز الرياضي "${sym.char}" (${sym.label}) إلى الحافظة!`, 'success');
  };

  const filteredCategories = mathSymbolCategories.map(cat => ({
    ...cat,
    symbols: cat.symbols.filter(s =>
      s.char.includes(searchSymbol) ||
      s.label.includes(searchSymbol) ||
      s.latex.includes(searchSymbol)
    )
  })).filter(cat => (selectedCategory === 'all' || cat.id === selectedCategory) && cat.symbols.length > 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setCurrentScreen('hub')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
        >
          ← العودة لمعرض الواجهات
        </button>
        <span className="badge badge-cyan">12 لوحة المفاتيح والرموز الرياضية</span>
      </div>

      <div className="page-hero">
        <h1 className="hero-title">إدارة لوحة المفاتيح والرموز الرياضية المتقدمة</h1>
        <p className="hero-subtitle">
          المكتبة الشاملة لرموز الجبر، الهندسة، التفاضل، والمجموعات مع محرّر تفاعلي لتجربة المعادلات ونسخ الأكواد
        </p>
      </div>

      {/* FORMULA TEST LAB */}
      <div className="glass-card" style={{ marginBottom: '32px', padding: '28px', borderColor: 'rgba(99, 102, 241, 0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>مختبر تجربة كتابة المعادلات والصيغ</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>انقر على أي رمز من المكتبة أدناه لإدراجه في المعادلة مباشرة</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(testFormula);
                showToast('تم نسخ المعادلة بالكامل إلى الحافظة!', 'success');
              }}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '12px' }}
            >
              📋 نسخ المعادلة
            </button>
            <button
              onClick={() => setTestFormula('')}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '12px' }}
            >
              مسح
            </button>
          </div>
        </div>

        <input
          type="text"
          value={testFormula}
          onChange={(e) => setTestFormula(e.target.value)}
          placeholder="اكتب معادلتك هنا أو استخدم الرموز أدناه..."
          style={{
            width: '100%',
            padding: '16px 20px',
            fontSize: '22px',
            fontWeight: '800',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '2px solid rgba(99, 102, 241, 0.5)',
            borderRadius: '14px',
            color: '#38bdf8',
            fontFamily: 'var(--font-en), var(--font-ar)',
            outline: 'none',
            marginBottom: '16px'
          }}
        />

        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '12px 18px',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13px',
          color: 'var(--text-muted)'
        }}>
          <span>المعاينة الرياضية الحية:</span>
          <span style={{ fontSize: '18px', color: '#fff', fontWeight: '800', fontFamily: 'var(--font-en)' }}>
            {testFormula || 'فارغ'}
          </span>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: selectedCategory === 'all' ? '#4f46e5' : 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '700'
            }}
          >
            جميع الرموز
          </button>
          {mathSymbolCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                background: selectedCategory === cat.id ? '#4f46e5' : 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '700'
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div style={{ width: '260px' }}>
          <input
            type="text"
            placeholder="ابحث عن رمز (مثال: 'جذر', 'π', 'تكامل')..."
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      {/* SYMBOLS BY CATEGORY */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {filteredCategories.map(cat => (
          <div key={cat.id} className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <span style={{ fontSize: '24px' }}>{cat.icon}</span>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>{cat.name}</h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({cat.symbols.length} رمز)</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '12px'
            }}>
              {cat.symbols.map((sym, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-card)',
                    borderRadius: '12px',
                    padding: '14px 10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(79, 70, 229, 0.2)';
                    e.currentTarget.style.borderColor = '#818cf8';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.borderColor = 'var(--border-card)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    onClick={() => handleInsertSymbol(sym.char)}
                    style={{
                      fontSize: '28px',
                      fontWeight: '900',
                      color: '#fff',
                      marginBottom: '6px',
                      fontFamily: 'var(--font-en)'
                    }}
                    title="انقر للإدراج في المعادلة"
                  >
                    {sym.char}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    {sym.label}
                  </div>
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                    <button
                      onClick={() => handleInsertSymbol(sym.char)}
                      style={{
                        padding: '3px 8px',
                        background: 'rgba(79, 70, 229, 0.3)',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#a5b4fc',
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      إدراج ✍️
                    </button>
                    <button
                      onClick={() => handleCopySymbol(sym)}
                      style={{
                        padding: '3px 8px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'var(--text-muted)',
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      نسخ 📋
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
