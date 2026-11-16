import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { screensCatalog, categoriesList } from '../data/screensCatalog';

export const PlatformHub = () => {
  const {
    setCurrentScreen,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    showToast
  } = useApp();
  const { user, role } = useAuth();

  const [activeTab, setActiveTab] = useState('الكل');

  const filteredScreens = screensCatalog.filter(screen => {
    const matchesCategory = selectedCategory === 'الكل' || screen.category === selectedCategory;
    const matchesTab = activeTab === 'الكل' ||
      (activeTab === 'طالب' && ['13', '09', '03', '01', '12', '06', '04', '15'].includes(screen.id)) ||
      (activeTab === 'معلم' && ['02', '07', '08', '16', '10', '14'].includes(screen.id)) ||
      (activeTab === 'مناهج' && ['17', '06'].includes(screen.id));
    const matchesSearch = !searchQuery ||
      screen.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      screen.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      screen.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      screen.id.includes(searchQuery);

    return matchesCategory && matchesTab && matchesSearch;
  });

  const corePillars = [
    {
      id: '13',
      title: 'بوابة الطالب والتعلّم',
      tagline: 'بيئة التعلّم النشط والمهام اليومية',
      desc: 'واجهة مخصصة للطالب تشتمل على المهام اليومية، نقاط XP، مسار التقدم الأكاديمي، والشارات التنافسية المحفزة.',
      icon: '🎒',
      accent: '#f59e0b',
      badge: 'المدخل الرئيسي للطالب',
      features: ['مهام يومية تفاعلية', 'رصيد نقاط XP وشارات', 'خارطة التقدّم الدراسي']
    },
    {
      id: '03',
      title: 'حلبة التحديات والمبارزات 1v1',
      tagline: 'المنافسة الرياضية المباشرة',
      desc: 'حلبة تحديات حية بنظام الأسئلة الموقوتة، حساب دقيق للنقاط وسرعة الإجابة، ولوحة صدارة تنافسية فورية.',
      icon: '⚡',
      accent: '#ec4899',
      badge: 'مبارزة حية مباشرة',
      features: ['مبارزات تفاعلية 1v1', 'مؤقت ذكي لكل سؤال', 'لوحة المتصدرين الفورية']
    },
    {
      id: '09',
      title: 'مختبر المسائل والسبورة الذكية',
      tagline: 'مساحة التدريب والتفكير الرياضي',
      desc: 'مختبر رقمي مزود بسبورة رسم تفاعلية، لوحة إدخال رموز ومعادلات متطورة، وتحليل ذكي للخطوات الرياضية.',
      icon: '✍️',
      accent: '#6366f1',
      badge: 'سبورة ذكية تفاعلية',
      features: ['سبورة رقمية للرسم والحل', 'لوحة رموز رياضية متكاملة', 'تغذية راجعة فورية']
    },
    {
      id: '02',
      title: 'لوحة تحكم المعلم والإشراف',
      tagline: 'إدارة الفصول والتقييمات المتقدمة',
      desc: 'مركز قيادة المعلم لمتابعة مستويات الطلاب، إسناد الواجبات، مراجعة الإجابات، وتصدير التقارير بصيغة CSV.',
      icon: '👨‍🏫',
      accent: '#0284c7',
      badge: 'لوحة القيادة الأكاديمية',
      features: ['إدارة الفصول والطلاب', 'تعيين الواجبات والاختبارات', 'تصدير البيانات والسجلات']
    }
  ];

  const educationalFeatures = [
    {
      icon: '🤖',
      title: 'مرشد ذكي وتوجيه فوري',
      desc: 'تكامل مع نموذج Gemini AI لتحليل حلول المسائل، وتقديم تلميحات ذكية وشروحات خطوة بخطوة عند الحاجة.'
    },
    {
      icon: '🏆',
      title: 'تلعيب تعليمي محفّز (Gamification)',
      desc: 'نظام متكامل لنقاط الخبرة XP، الأوسمة، والمستويات يُبقي دافعية الطالب في أعلى مستوياتها طوال الفصل.'
    },
    {
      icon: '🛡️',
      title: 'أمان سحابي وسياسات RLS',
      desc: 'قاعدة بيانات سحابية متينة مبنية على Supabase مع سياسات وصول دقيقة لحماية خصوصية بيانات الطلاب والمعلمين.'
    },
    {
      icon: '👨‍👩‍👧',
      title: 'تكامل وثيق مع ولي الأمر',
      desc: 'تقارير دورية تضع ولي الأمر في قلب الحدث مع إمكانية حجز جلسات متابعة مباشرة مع المعلم المختص.'
    }
  ];

  return (
    <div className="hub-landing-page">
      {/* 1. HERO BANNER */}
      <section className="hub-hero-banner">
        <div className="hub-hero-content">
          <div className="hub-hero-badges-row">
            <span className="hub-pill-badge hub-pill-primary">
              <span className="live-dot" />
              المنصة التعليمية الذكية الأولى في الرياضيات
            </span>
            <span className="hub-pill-badge hub-pill-tech">
              ⚡ مبنية بأحدث معايير React + Supabase + AI
            </span>
          </div>

          <h1 className="hub-hero-title">
            منظومة أذكياء الرياضيات التفاعلية
          </h1>

          <p className="hub-hero-desc">
            بيئة تعليمية وتقنية متكاملة تجمع بين التعلّم النشط، التقييم التشخيصي الذكي، والمبارزات الحية. مصممة لتمكين الطالب، دعم المعلم، وإشراك ولي الأمر في رحلة تعليمية ملهمة وممتعة.
          </p>

          {/* Quick CTAs */}
          <div className="hub-hero-cta-group">
            <button
              type="button"
              onClick={() => setCurrentScreen('13')}
              className="btn btn-primary hub-cta-btn-lg"
            >
              <span>🎒</span>
              <span>دخول بوابة الطالب</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreen('03')}
              className="btn btn-secondary hub-cta-btn-lg hub-cta-battle"
            >
              <span>⚡</span>
              <span>حلبة التحديات 1v1</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreen('02')}
              className="btn btn-secondary hub-cta-btn-lg"
            >
              <span>👨‍🏫</span>
              <span>بوابة المعلم والمشرف</span>
            </button>
          </div>

          {/* User Welcome Pill if logged in */}
          {user?.name && (
            <div className="hub-user-welcome-banner">
              <span>👋</span>
              <span>
                أهلاً بك، <strong>{user.name}</strong> ({role === 'student' ? 'طالب' : role === 'teacher' ? 'معلم' : 'مشرف'}) — يمكنك الوصول المباشر لبوابتك عبر الأزرار أعلاه
              </span>
            </div>
          )}
        </div>

        {/* Hero KPI Stats Ticker */}
        <div className="hub-hero-stats-card">
          <div className="hub-stat-item">
            <div className="hub-stat-num">18</div>
            <div className="hub-stat-label">بوابة تفاعلية مفعلة</div>
          </div>
          <div className="hub-stat-divider" />
          <div className="hub-stat-item">
            <div className="hub-stat-num">12</div>
            <div className="hub-stat-label">وحدة تعليمية بالمناهج</div>
          </div>
          <div className="hub-stat-divider" />
          <div className="hub-stat-item">
            <div className="hub-stat-num">100%</div>
            <div className="hub-stat-label">ربط سحابي Supabase RLS</div>
          </div>
          <div className="hub-stat-divider" />
          <div className="hub-stat-item">
            <div className="hub-stat-num">AI</div>
            <div className="hub-stat-label">توجيه ذكي بالذكاء الاصطناعي</div>
          </div>
        </div>
      </section>

      {/* 2. CORE EDUCATIONAL PILLARS (4 PRIMARY PORTALS) */}
      <section className="hub-section">
        <div className="hub-section-header">
          <div>
            <div className="hub-section-pretitle">الركائز الأساسية للمنصة</div>
            <h2 className="hub-section-title">بوابات التعلّم والإدارة المركزية</h2>
          </div>
          <p className="hub-section-subtitle">
            أربعة مسارات رئيسية تلبي احتياجات كل أطراف العملية التعليمية بكفاءة ودقة عالية
          </p>
        </div>

        <div className="hub-pillars-grid">
          {corePillars.map(pillar => (
            <div
              key={pillar.id}
              className="hub-pillar-card"
              style={{ '--pillar-accent': pillar.accent }}
              onClick={() => {
                setCurrentScreen(pillar.id);
                showToast(`تم فتح ${pillar.title}`, 'info');
              }}
            >
              <div className="hub-pillar-top">
                <div className="hub-pillar-icon-box">
                  <span className="hub-pillar-icon">{pillar.icon}</span>
                </div>
                <span className="hub-pillar-badge">{pillar.badge}</span>
              </div>

              <h3 className="hub-pillar-title">{pillar.title}</h3>
              <div className="hub-pillar-tagline">{pillar.tagline}</div>
              <p className="hub-pillar-desc">{pillar.desc}</p>

              <div className="hub-pillar-features-list">
                {pillar.features.map((feat, idx) => (
                  <div key={idx} className="hub-pillar-feat-item">
                    <span className="feat-check">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="hub-pillar-action-row">
                <span className="hub-pillar-cta-text">دخول البوابة الآن</span>
                <span className="hub-pillar-cta-arrow">⬅</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. QUICK SHORTCUTS STRIP */}
      <section className="hub-shortcuts-strip">
        <div className="hub-shortcut-item" onClick={() => setCurrentScreen('17')}>
          <span className="shortcut-icon">📖</span>
          <div>
            <div className="shortcut-title">خارطة المناهج والوحدات</div>
            <div className="shortcut-desc">12 وحدة وتدريبات تفاعلية</div>
          </div>
        </div>

        <div className="hub-shortcut-item" onClick={() => setCurrentScreen('01')}>
          <span className="shortcut-icon">📋</span>
          <div>
            <div className="shortcut-title">بطاقة التقييم والشهادة</div>
            <div className="shortcut-desc">توليد وطباعة شهادة التفوق</div>
          </div>
        </div>

        <div className="hub-shortcut-item" onClick={() => setCurrentScreen('12')}>
          <span className="shortcut-icon">⌨️</span>
          <div>
            <div className="shortcut-title">لوحة الرموز والمعادلات</div>
            <div className="shortcut-desc">محرر رموز رياضية متخصص</div>
          </div>
        </div>

        <div className="hub-shortcut-item" onClick={() => setCurrentScreen('16')}>
          <span className="shortcut-icon">👨‍👩‍👧</span>
          <div>
            <div className="shortcut-title">متابعة ولي الأمر</div>
            <div className="shortcut-desc">حجز المقابلات وتقارير المتابعة</div>
          </div>
        </div>
      </section>

      {/* 4. WHY MATH SMART? (EDUCATIONAL VALUE PROP) */}
      <section className="hub-section">
        <div className="hub-section-header">
          <div>
            <div className="hub-section-pretitle">القيمة المضافة</div>
            <h2 className="hub-section-title">لماذا تختار منصة أذكياء الرياضيات؟</h2>
          </div>
          <p className="hub-section-subtitle">
            صُممت المنصة وفق أحدث النظريات البنائية في تدريس الرياضيات لتجمع بين متعة التنافس ودقة التقييم
          </p>
        </div>

        <div className="hub-features-grid">
          {educationalFeatures.map((feat, idx) => (
            <div key={idx} className="hub-feature-card">
              <div className="hub-feature-icon">{feat.icon}</div>
              <h4 className="hub-feature-title">{feat.title}</h4>
              <p className="hub-feature-desc">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. COMPLETE PORTALS DIRECTORY (ALL 18 SCREENS) */}
      <section className="hub-section hub-directory-section">
        <div className="hub-section-header">
          <div>
            <div className="hub-section-pretitle">الدليل الكامل والشامل</div>
            <h2 className="hub-section-title">فهرس جميع بوابات وشاشات المنصة (18 بوابة)</h2>
          </div>
          <p className="hub-section-subtitle">
            استعرض أو ابحث في كافة بوابات النظام التعليمي والإداري للوصول السريع إلى أي مكون
          </p>
        </div>

        {/* Directory Controls: Search + Target Audience Tabs + Category Chips */}
        <div className="hub-directory-controls">
          {/* Search Bar */}
          <div className="hub-directory-search-wrapper">
            <input
              type="text"
              placeholder="ابحث بالاسم، التصنيف، أو الكلمات المفتاحية (مثال: 'حلبة', 'معلم', 'مناهج', 'سجلات', '03')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hub-directory-search-input"
            />
            <span className="hub-directory-search-icon">🔍</span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="hub-directory-clear-btn"
              >
                ✕ مسح البحث
              </button>
            )}
          </div>

          {/* Audience Filter Tabs */}
          <div className="hub-audience-tabs">
            <button
              type="button"
              onClick={() => setActiveTab('الكل')}
              className={`hub-tab-btn ${activeTab === 'الكل' ? 'active' : ''}`}
            >
              🌐 جميع البوابات (18)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('طالب')}
              className={`hub-tab-btn ${activeTab === 'طالب' ? 'active' : ''}`}
            >
              🎒 بوابات الطالب (8)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('معلم')}
              className={`hub-tab-btn ${activeTab === 'معلم' ? 'active' : ''}`}
            >
              👨‍🏫 بوابات المعلم والإشراف (6)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('مناهج')}
              className={`hub-tab-btn ${activeTab === 'مناهج' ? 'active' : ''}`}
            >
              📚 المناهج والمسارات (2)
            </button>
          </div>

          {/* Category Chips */}
          <div className="hub-category-chips">
            {categoriesList.map(cat => (
              <button
                type="button"
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`hub-cat-chip ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Cards Grid */}
        <div className="hub-directory-grid">
          {filteredScreens.map(screen => (
            <div
              key={screen.id}
              className="hub-directory-card"
              onClick={() => {
                setCurrentScreen(screen.id);
                showToast(`تم فتح ${screen.title}`, 'info');
              }}
            >
              <div className="hub-dir-card-header">
                <div className="hub-dir-icon-badge">{screen.icon}</div>
                <div className="hub-dir-category-pill">{screen.category}</div>
              </div>

              <h4 className="hub-dir-card-title">{screen.title}</h4>
              <p className="hub-dir-card-subtitle">{screen.subtitle}</p>

              <div className="hub-dir-card-footer">
                <span className="hub-dir-screen-id">بوابة رقم #{screen.id}</span>
                <span className="hub-dir-open-btn">
                  فتح البوابة ⬅
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredScreens.length === 0 && (
          <div className="hub-empty-state">
            <div style={{ fontSize: '42px', marginBottom: '12px' }}>🔍</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-heading)' }}>
              لم يتم العثور على بوابات تطابق معايير البحث
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
              جرّب البحث بكلمة أخرى أو اختر تصنيف "الكل" لعرض كافة الواجهات
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('الكل');
                setActiveTab('الكل');
              }}
              className="btn btn-secondary"
              style={{ marginTop: '16px' }}
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
