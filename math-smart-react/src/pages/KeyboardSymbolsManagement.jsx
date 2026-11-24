import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { mathSymbolCategories } from '../data/mathSymbols';
import { copyToClipboard } from '../utils/platformHelpers';
import { Breadcrumb } from '../components/Breadcrumb';

export const KeyboardSymbolsManagement = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { role } = useAuth();
  const [testFormula, setTestFormula] = useState('3س² + 4ص - √16 = 25');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchSymbol, setSearchSymbol] = useState('');

  const handleInsertSymbol = (char) => {
    setTestFormula(prev => prev + char);
  };

  const handleCopySymbol = async (sym) => {
    const ok = await copyToClipboard(sym.char);
    if (ok) {
      showToast(`تم نسخ الرمز الرياضي "${sym.char}" (${sym.label}) إلى الحافظة!`, 'success');
    } else {
      showToast('تعذر النسخ التلقائي إلى الحافظة', 'warning');
    }
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
      <Breadcrumb
        items={[
          {
            label: role === 'admin' ? 'إدارة النظام' : role === 'teacher' ? 'لوحة المعلم' : role === 'parent' ? 'بوابة ولي الأمر' : 'فضاء الطالب',
            screen: role === 'admin' ? '07' : role === 'teacher' ? '02' : role === 'parent' ? '16' : '13',
            icon: role === 'admin' ? '🛠️' : role === 'teacher' ? '👨‍🏫' : role === 'parent' ? '👨‍👧' : '🎒'
          },
          { label: 'لوحة الرموز والمعادلات الرياضية', icon: '⌨️' }
        ]}
        backTo={role === 'admin' ? '07' : role === 'teacher' ? '02' : role === 'parent' ? '16' : '13'}
        backLabel={role === 'admin' ? 'العودة لإدارة السجلات' : role === 'teacher' ? 'العودة للوحة المعلم' : role === 'parent' ? 'العودة للمتابعة' : 'العودة لبوابة الطالب'}
        tag="محرر الرموز"
      />

      <div className="page-hero">
        <h1 className="hero-title">إدارة لوحة المفاتيح والرموز الرياضية المتقدمة</h1>
        <p className="hero-subtitle">
          المكتبة الشاملة لرموز الجبر، الهندسة، التفاضل، والمجموعات مع محرّر تفاعلي لتجربة المعادلات ونسخ الأكواد
        </p>
      </div>

      {/* FORMULA TEST LAB */}
      <div className="glass-card" style={{ marginBottom: '32px', padding: '28px', borderColor: 'rgba(20, 184, 166, 0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-heading)' }}>مختبر تجربة كتابة المعادلات والصيغ</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>انقر على أي رمز من المكتبة أدناه لإدراجه في المعادلة مباشرة</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={async () => {
                if (!testFormula.trim()) {
                  showToast('المعادلة فارغة حالياً!', 'warning');
                  return;
                }
                const ok = await copyToClipboard(testFormula);
                showToast(ok ? 'تم نسخ المعادلة بالكامل إلى الحافظة!' : 'تعذر النسخ إلى الحافظة', ok ? 'success' : 'warning');
              }}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '12px' }}
            >
              📋 نسخ المعادلة
            </button>
            <button
              type="button"
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
            background: 'var(--bg-input)',
            border: '2px solid rgba(20, 184, 166, 0.5)',
            borderRadius: '14px',
            color: '#0ea5e9',
            fontFamily: 'var(--font-en), var(--font-ar)',
            outline: 'none',
            marginBottom: '16px'
          }}
        />

        <div style={{
          background: 'var(--bg-inset)',
          padding: '12px 18px',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: '13px',
          color: 'var(--text-muted)'
        }}>
          <span>المعاينة الرياضية الحية:</span>
          <span style={{ fontSize: '18px', color: 'var(--text-heading)', fontWeight: '800', fontFamily: 'var(--font-en)' }}>
            {testFormula || 'فارغ'}
          </span>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid var(--border-card)',
              background: selectedCategory === 'all' ? '#0d9488' : 'var(--bg-subtle)',
              color: selectedCategory === 'all' ? '#fff' : 'var(--text-body)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '700'
            }}
          >
            جميع الرموز
          </button>
          {mathSymbolCategories.map(cat => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid var(--border-card)',
                background: selectedCategory === cat.id ? '#0d9488' : 'var(--bg-subtle)',
                color: selectedCategory === cat.id ? '#fff' : 'var(--text-body)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '700'
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div style={{ width: '260px', maxWidth: '100%' }}>
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
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-heading)' }}>{cat.name}</h3>
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
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-card)',
                    borderRadius: '12px',
                    padding: '14px 10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(13, 148, 136, 0.18)';
                    e.currentTarget.style.borderColor = '#14b8a6';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-subtle)';
                    e.currentTarget.style.borderColor = 'var(--border-card)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    onClick={() => handleInsertSymbol(sym.char)}
                    style={{
                      fontSize: '28px',
                      fontWeight: '900',
                      color: 'var(--text-heading)',
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
                      type="button"
                      onClick={() => handleInsertSymbol(sym.char)}
                      style={{
                        padding: '3px 8px',
                        background: 'rgba(13, 148, 136, 0.2)',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#14b8a6',
                        fontSize: '10px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      إدراج ✍️
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopySymbol(sym)}
                      style={{
                        padding: '3px 8px',
                        background: 'var(--bg-subtle-strong)',
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

      {/* FOOTER ACTIONS & NAVIGATION */}
      <div className="glass-card" style={{ marginTop: '30px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <button
          type="button"
          onClick={() => setCurrentScreen(role === 'admin' ? '07' : role === 'teacher' ? '02' : role === 'parent' ? '16' : '13')}
          className="btn btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <span>←</span>
          <span>{role === 'admin' ? 'العودة لإدارة السجلات (07)' : role === 'teacher' ? 'العودة للوحة المعلم (02)' : role === 'parent' ? 'العودة للمتابعة (16)' : 'العودة لفضاء الطالب (13)'}</span>
        </button>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setCurrentScreen('09')}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <span>✍️</span>
            <span>الانتقال لمختبر حل المسائل (09)</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentScreen('17')}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <span>📚</span>
            <span>استعراض المناهج (17)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
