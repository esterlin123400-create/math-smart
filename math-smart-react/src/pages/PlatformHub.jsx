import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { screensCatalog, categoriesList } from '../data/screensCatalog';

export const PlatformHub = () => {
  const { setCurrentScreen, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, showToast } = useApp();
  const [selectedPhase, setSelectedPhase] = useState('الكل');

  const phasesList = [
    { id: 'الكل', label: 'جميع المراحل (18 واجهة)', icon: '🌐' },
    { id: 'المرحلة 1: الهوية والدخول والحسابات', label: 'المرحلة 1: الهوية والحسابات', count: 6, icon: '🚀' },
    { id: 'المرحلة 2: المراحل والمناهج الدراسية', label: 'المرحلة 2: المناهج والصفوف', count: 2, icon: '📚' },
    { id: 'المرحلة 3: تجربة الطالب والتعلم النشط والتقييم', label: 'المرحلة 3: تجربة الطالب والتحديات', count: 5, icon: '⚡' },
    { id: 'المرحلة 4: لوحة المعلم والمتابعة والتقارير الأكاديمية', label: 'المرحلة 4: لوحة المعلم والتقارير', count: 4, icon: '👨‍🏫' },
    { id: 'المرحلة 5: الملف الشخصي والإعدادات العامة', label: 'المرحلة 5: الإعدادات العامة', count: 1, icon: '⚙️' }
  ];

  const filteredScreens = screensCatalog.filter(screen => {
    const matchesPhase = selectedPhase === 'الكل' || screen.phase === selectedPhase;
    const matchesCategory = selectedCategory === 'الكل' || screen.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      screen.title.includes(searchQuery) ||
      screen.subtitle.includes(searchQuery) ||
      screen.category.includes(searchQuery) ||
      screen.id.includes(searchQuery);
    return matchesPhase && matchesCategory && matchesSearch;
  });

  const handleStartTour = () => {
    setCurrentScreen('18');
    showToast('بدء الجولة التفاعلية! الخطوة 01: الهوية والشعار الرسمي', 'info');
  };

  return (
    <div>
      {/* HERO BANNER */}
      <div className="page-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flex: '1', minWidth: 'min(100%, 260px)' }}>
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '22px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(79, 70, 229, 0.45)',
              border: '2px solid rgba(56, 189, 248, 0.4)',
              flexShrink: 0,
              background: '#090d1a'
            }}>
              <img
                src="/assets/math_smart_logo.jpg"
                alt="أذكياء الرياضيات"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.src = '/assets/math_smart_logo.svg'; }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-success">منصة أذكياء الرياضيات التفاعلية</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>نظام React الموحد والشامل</span>
              </div>
              <h1 className="hero-title">بوابة واجهات النظام الشاملة (18 واجهة تفاعلية كاملة)</h1>
              <p className="hero-subtitle">
                منظومة تعليمية متكاملة لتعليم الرياضيات التفاعلية تشمل لوحات المعلم والطالب، حلبة التحديات، التقييم الذكي، والمناهج الشاملة
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-card)', padding: '10px 20px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#0284c7', fontFamily: 'var(--font-en)' }}>18</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>واجهة متكاملة</div>
            </div>
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-card)', padding: '10px 20px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#10b981', fontFamily: 'var(--font-en)' }}>100%</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>مكونات تفاعلية نشطة</div>
            </div>
            <button
              type="button"
              onClick={handleStartTour}
              className="btn btn-primary"
              style={{ padding: '12px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span>🚀</span> بدء الجولة التعريفية
            </button>
          </div>
        </div>
      </div>

      {/* QUICK LAUNCH SHORTCUTS BAR */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        marginBottom: '28px'
      }}>
        <div
          onClick={() => setCurrentScreen('03')}
          className="glass-card"
          style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'all 0.2s', borderColor: 'rgba(236, 72, 153, 0.4)' }}
        >
          <div style={{ fontSize: '26px', background: 'rgba(236, 72, 153, 0.15)', padding: '8px', borderRadius: '12px' }}>⚡</div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-heading)' }}>حلبة التحديات الحية</div>
            <div style={{ fontSize: '11px', color: '#ec4899' }}>مبارزات ومؤقت مباشر ⏱️</div>
          </div>
        </div>

        <div
          onClick={() => setCurrentScreen('09')}
          className="glass-card"
          style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'all 0.2s', borderColor: 'rgba(99, 102, 241, 0.4)' }}
        >
          <div style={{ fontSize: '26px', background: 'rgba(99, 102, 241, 0.15)', padding: '8px', borderRadius: '12px' }}>✍️</div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-heading)' }}>مساحة حل المسائل</div>
            <div style={{ fontSize: '11px', color: '#6366f1' }}>سبورة ذكية ولوحة رموز ⌨️</div>
          </div>
        </div>

        <div
          onClick={() => setCurrentScreen('17')}
          className="glass-card"
          style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'all 0.2s', borderColor: 'rgba(16, 185, 129, 0.4)' }}
        >
          <div style={{ fontSize: '26px', background: 'rgba(16, 185, 129, 0.15)', padding: '8px', borderRadius: '12px' }}>📖</div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-heading)' }}>خارطة المناهج والوحدات</div>
            <div style={{ fontSize: '11px', color: '#10b981' }}>12 وحدة لجميع المراحل 📚</div>
          </div>
        </div>

        <div
          onClick={() => setCurrentScreen('02')}
          className="glass-card"
          style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'all 0.2s', borderColor: 'rgba(6, 182, 212, 0.4)' }}
        >
          <div style={{ fontSize: '26px', background: 'rgba(6, 182, 212, 0.15)', padding: '8px', borderRadius: '12px' }}>👨‍🏫</div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-heading)' }}>لوحة تحكم المعلم</div>
            <div style={{ fontSize: '11px', color: '#0284c7' }}>إدارة الفصول والواجبات 📊</div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="ابحث عن واجهة بالاسم، التصنيف، أو الرقم (مثال: 'حلبة', 'معلم', 'مسائل', 'شعار', '01')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ padding: '16px 48px 16px 20px', fontSize: '15px' }}
          />
          <span style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: 'var(--text-muted)' }}>
            🔍
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ✕ مسح
            </button>
          )}
        </div>

        {/* Phase Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', flexWrap: 'wrap' }}>
          {phasesList.map(ph => (
            <button
              type="button"
              key={ph.id}
              onClick={() => setSelectedPhase(ph.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '16px',
                border: selectedPhase === ph.id ? '1px solid #0284c7' : '1px solid var(--border-card)',
                background: selectedPhase === ph.id ? 'rgba(56, 189, 248, 0.16)' : 'var(--bg-subtle)',
                color: selectedPhase === ph.id ? '#0ea5e9' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '700',
                fontFamily: 'var(--font-ar)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{ph.icon}</span>
              <span>{ph.label}</span>
            </button>
          ))}
        </div>

        {/* Categories Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categoriesList.map(cat => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '24px',
                border: '1px solid var(--border-card)',
                background: selectedCategory === cat ? 'linear-gradient(135deg, #4f46e5, #06b6d4)' : 'var(--bg-subtle)',
                color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '700',
                fontFamily: 'var(--font-ar)',
                transition: 'all 0.2s',
                boxShadow: selectedCategory === cat ? '0 4px 15px rgba(79, 70, 229, 0.4)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 18 SCREENS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
        gap: '24px'
      }}>
        {filteredScreens.map((screen) => (
          <div
            key={screen.id}
            className="glass-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setCurrentScreen(screen.id)}
          >
            <div>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <span className="badge badge-primary">
                  {screen.category}
                </span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '800',
                  color: '#0284c7',
                  fontFamily: 'var(--font-ar)',
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  padding: '3px 10px',
                  borderRadius: '12px'
                }}>
                  {screen.step ? `خطوة ${screen.step < 10 ? '0' + screen.step : screen.step}` : `#${screen.id}`} • واجهة {screen.id}
                </span>
              </div>

              {/* Icon & Title */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                  flexShrink: 0
                }}>
                  {screen.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '4px', lineHeight: 1.4 }}>
                    {screen.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {screen.subtitle}
                  </p>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-muted)', opacity: 0.85, marginBottom: '6px' }}>
                {screen.phase}
              </div>
            </div>

            {/* Card Footer Button */}
            <div style={{
              borderTop: '1px solid var(--border-card)',
              paddingTop: '14px',
              marginTop: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: '700' }}>
                {screen.badge}
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                style={{
                  padding: '6px 14px',
                  fontSize: '12px',
                  borderRadius: '8px'
                }}
              >
                فتح الواجهة ⬅️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
