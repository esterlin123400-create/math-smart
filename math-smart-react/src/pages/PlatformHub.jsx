import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const PlatformHub = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { user, role, loginAs } = useAuth();

  const rolePortals = [
    {
      id: 'student',
      targetScreen: '13',
      title: 'فضاء الطالب والتعلّم النشط',
      subtitle: 'رحلة تعلّم يومية ممتعة ومحفزة',
      desc: 'مساحة تعليمية متكاملة للطالب تشمل المهام اليومية، نقاط التميز XP، مختبر حل المسائل بسبورة ذكية، وحلبة المبارزات المباشرة.',
      icon: '🎒',
      accent: '#f97316',
      cta: 'الدخول لبوابة الطالب',
      highlights: [
        'تتبع التقدم والمستويات والشارات التنافسية',
        'تدريبات تفاعلية وسبورة رقمية للحل',
        'شهادات تفوق وتقييم تشخيصي فوري'
      ]
    },
    {
      id: 'teacher',
      targetScreen: '02',
      title: 'فضاء المعلم والإشراف التربوي',
      subtitle: 'قيادة ذكية للفصول والتقييمات',
      desc: 'لوحة قيادة متطورة تُمكّن المعلم من متابعة تقدم كل طالب، إسناد الواجبات والاختبارات، استخراج التقارير الأكاديمية، وتصدير السجلات.',
      icon: '👨‍🏫',
      accent: '#0d9488',
      cta: 'الدخول لبوابة المعلم',
      highlights: [
        'إدارة الفصول والواجبات بنقرة واحدة',
        'سجلات مركزية قابلة للتصدير بصيغة CSV',
        'تحليلات ذكية لمواطن القوة والضعف'
      ]
    },
    {
      id: 'parent',
      targetScreen: '16',
      title: 'فضاء متابعة ولي الأمر',
      subtitle: 'شراكة حقيقية بين المدرسة والأسرة',
      desc: 'نافذة مباشرة تضع ولي الأمر في قلب المسيرة التعليمية عبر تقارير الأداء الدورية وإمكانية حجز جلسات متابعة مباشرة مع المعلم.',
      icon: '👨‍👩‍👧',
      accent: '#10b981',
      cta: 'فتح بوابة ولي الأمر',
      highlights: [
        'متابعة حية لمستوى الإتقان والمشاركة',
        'حجز مواعيد ومقابلات مع معلم المادة',
        'توثيق الملاحظات وخطط الدعم الأكاديمي'
      ]
    },
    {
      id: 'admin',
      targetScreen: '07',
      title: 'إدارة النظام والتحكم المركزي (Super Admin)',
      subtitle: 'إشراف كامل على السجلات والمستخدمين',
      desc: 'بوابة مدير النظام (مستخدم النظام) لإدارة قواعد البيانات المركزية، تصدير سجلات الطلاب CSV، تحليلات الأداء، والتحكم في الصلاحيات.',
      icon: '🛠️',
      accent: '#06b6d4',
      cta: 'الدخول للوحة مدير النظام',
      highlights: [
        'التحكم المركزي بالسجلات وقواعد البيانات',
        'تقارير تحليلية ومؤشرات الأداء العامة',
        'حماية أمنية صارمة لصلاحيات النظام'
      ]
    }
  ];

  const interactiveTools = [
    {
      screen: '09',
      icon: '✍️',
      title: 'مختبر المسائل والسبورة الذكية',
      desc: 'سبورة رسم رقمية معززة بلوحة رموز رياضية ومرشد ذكاء اصطناعي فوري.',
      badge: 'تدريب ذكي',
      color: '#0d9488'
    },
    {
      screen: '03',
      icon: '⚡',
      title: 'حلبة التحديات والمبارزات 1v1',
      desc: 'منافسات حماسية بمؤقت مباشر، رموز غرف لحظية، ولوحة متصدرين تفاعلية.',
      badge: 'تحدٍ مباشر',
      color: '#f97316'
    },
    {
      screen: '17',
      icon: '📖',
      title: 'خارطة المناهج والوحدات',
      desc: '12 وحدة تعليمية منظمة مع تتبع نسب الإنجاز وشروحات مرئية تفاعلية.',
      badge: 'المناهج المعتمدة',
      color: '#10b981'
    },
    {
      screen: '01',
      icon: '📋',
      title: 'التقييم التشخيصي والشهادات',
      desc: 'تحليل شامل للإجابات وتوليد شهادات تفوق رسمية جاهزة للطباعة والـ PDF.',
      badge: 'شهادة فورية',
      color: '#0284c7'
    }
  ];

  const platformAdvantages = [
    {
      icon: '🤖',
      title: 'مرشد ذكي بالذكاء الاصطناعي',
      desc: 'تحليل ذكي وفوري لخطوات الحل وتقديم تلميحات تربوية مخصصة لكل طالب عبر محرك Gemini AI.'
    },
    {
      icon: '🏆',
      title: 'تعلّم محفّز بالتلعيب والتنافس',
      desc: 'نظام نقاط الخبرة XP والأوسمة والمستويات يجعل ممارسة الرياضيات عادة يومية ممتعة.'
    },
    {
      icon: '🛡️',
      title: 'أمان سحابي وموثوقية عالية',
      desc: 'بنية قاعدة بيانات سحابية مؤمّنة عبر Supabase مع سياسات خصوصية وحماية صارمة للبيانات.'
    },
    {
      icon: '📱',
      title: 'تجربة سلسة ومتجاوبة بالكامل',
      desc: 'تصميم عصري مريح للعين يعمل بسلاسة تامة على الحواسيب والأجهزة اللوحية والهواتف الذكية.'
    }
  ];

  const quickServices = [
    { label: 'اختيار المرحلة والصف الدراسي', screen: '06', icon: '🎯' },
    { label: 'إدارة السجلات وتصدير CSV', screen: '07', icon: '📊' },
    { label: 'التقارير الأكاديمية والتحليلات', screen: '08', icon: '📈' },
    { label: 'لوحة الرموز والمعادلات الرياضية', screen: '12', icon: '⌨️' },
    { label: 'تسجيل دخول الطالب', screen: '04', icon: '🔐' },
    { label: 'تسجيل طالب جديد', screen: '15', icon: '📝' },
    { label: 'دخول المعلم والمشرف', screen: '10', icon: '👨‍🏫' },
    { label: 'توثيق حساب معلم جديد', screen: '14', icon: '✅' },
    { label: 'استعادة كلمة المرور (OTP)', screen: '05', icon: '🔑' },
    { label: 'الملف الشخصي والإعدادات', screen: '11', icon: '⚙️' },
    { label: 'دليل الهوية والشعار الرسمي', screen: '18', icon: '🎨' }
  ];

  return (
    <div className="hub-landing-page">
      {/* 1. BRIGHT EDUCATIONAL HERO SECTION */}
      <section className="hub-hero-banner">
        <div className="hub-hero-content">
          <div className="hub-hero-badges-row">
            <span className="hub-pill-badge hub-pill-primary">
              <span>✨</span>
              <span>منصة التعليم التفاعلي الذكي للرياضيات</span>
            </span>
            <span className="hub-pill-badge hub-pill-tech">
              <span>🎓</span>
              <span>متوافقة مع معايير المناهج الحديثة</span>
            </span>
          </div>

          <h1 className="hub-hero-title">
            تعلّم الرياضيات بمتعة وذكاء وتنافس حقيقي
          </h1>

          <p className="hub-hero-desc">
            منصة <strong>أذكياء الرياضيات</strong> هي منظومة تعليمية متكاملة تجمع بين التعلّم التفاعلي، الذكاء الاصطناعي التشخيصي، والمبارزات الحية؛ صُممت بعناية لتمكين الطالب، دعم المعلم، وإشراك ولي الأمر في رحلة تفوق مستمرة.
          </p>

          {/* Primary Role CTAs */}
          <div className="hub-hero-cta-group">
            <button
              type="button"
              onClick={() => {
                loginAs('student');
                setCurrentScreen('13');
                showToast('مرحباً بك في فضاء الطالب ولوحة المهام!', 'info');
              }}
              className="btn btn-primary hub-cta-btn-lg"
            >
              <span>🎒</span>
              <span>بوابة الطالب</span>
            </button>

            <button
              type="button"
              onClick={() => {
                loginAs('teacher');
                setCurrentScreen('02');
                showToast('مرحباً بك في فضاء المعلم والإشراف!', 'info');
              }}
              className="btn btn-secondary hub-cta-btn-lg"
            >
              <span>👨‍🏫</span>
              <span>بوابة المعلم</span>
            </button>

            <button
              type="button"
              onClick={() => {
                loginAs('parent');
                setCurrentScreen('16');
                showToast('مرحباً بك في بوابة متابعة ولي الأمر!', 'info');
              }}
              className="btn btn-secondary hub-cta-btn-lg"
              style={{
                borderColor: 'rgba(16, 185, 129, 0.4)',
                color: '#10b981'
              }}
            >
              <span>👨‍👩‍👧</span>
              <span>بوابة ولي الأمر</span>
            </button>

            <button
              type="button"
              onClick={() => {
                loginAs('admin');
                setCurrentScreen('07');
                showToast('مرحباً بك م. عبدالعزيز في لوحة إدارة النظام العام!', 'info');
              }}
              className="btn btn-secondary hub-cta-btn-lg"
              style={{
                borderColor: 'rgba(6, 182, 212, 0.4)',
                color: '#0891b2'
              }}
            >
              <span>🛠️</span>
              <span>مدير النظام</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreen('03')}
              className="btn btn-secondary hub-cta-btn-lg hub-cta-battle"
            >
              <span>⚡</span>
              <span>حلبة التحديات</span>
            </button>
          </div>

          {user?.name && (
            <div className="hub-user-welcome-banner">
              <span>👋</span>
              <span>
                مرحباً بعودتك يا <strong>{user.name}</strong> — جميع بياناتك وتقدمك الدراسي محفوظ ومتزامن لحظياً.
              </span>
            </div>
          )}
        </div>

        {/* Clean Academic Impact Stats */}
        <div className="hub-hero-stats-card">
          <div className="hub-stat-item">
            <div className="hub-stat-num">12+</div>
            <div className="hub-stat-label">وحدة منهجية شاملة</div>
          </div>
          <div className="hub-stat-divider" />
          <div className="hub-stat-item">
            <div className="hub-stat-num">AI</div>
            <div className="hub-stat-label">تصحيح وتوجيه ذكي فوري</div>
          </div>
          <div className="hub-stat-divider" />
          <div className="hub-stat-item">
            <div className="hub-stat-num">1v1</div>
            <div className="hub-stat-label">حلبات مبارزة وتحدي مباشر</div>
          </div>
          <div className="hub-stat-divider" />
          <div className="hub-stat-item">
            <div className="hub-stat-num">24/7</div>
            <div className="hub-stat-label">مزامنة سحابية آمنة Supabase</div>
          </div>
        </div>
      </section>

      {/* 2. DEDICATED ROLE SPACES (STUDENT / TEACHER / PARENT) */}
      <section className="hub-section">
        <div className="hub-section-header">
          <div>
            <div className="hub-section-pretitle">بيئة مصممة لكل مستخدم</div>
            <h2 className="hub-section-title">بوابات متخصصة لأطراف العملية التعليمية</h2>
          </div>
          <p className="hub-section-subtitle">
            تجربة مستخدم منظمة ومخصصة تمنح كل دور الأدوات الدقيقة التي يحتاجها دون أي تشتيت
          </p>
        </div>

        <div className="hub-pillars-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))' }}>
          {rolePortals.map(portal => (
            <div
              key={portal.id}
              className="hub-pillar-card"
              style={{ '--pillar-accent': portal.accent }}
              onClick={() => {
                if (portal.id === 'student') loginAs('student');
                if (portal.id === 'teacher') loginAs('teacher');
                if (portal.id === 'parent') loginAs('parent');
                if (portal.id === 'admin') loginAs('admin');
                setCurrentScreen(portal.targetScreen);
                showToast(`الانتقال إلى ${portal.title}`, 'info');
              }}
            >
              <div className="hub-pillar-top">
                <div className="hub-pillar-icon-box">
                  <span className="hub-pillar-icon">{portal.icon}</span>
                </div>
                <span className="hub-pillar-badge">{portal.subtitle}</span>
              </div>

              <h3 className="hub-pillar-title">{portal.title}</h3>
              <p className="hub-pillar-desc">{portal.desc}</p>

              <div className="hub-pillar-features-list">
                {portal.highlights.map((item, idx) => (
                  <div key={idx} className="hub-pillar-feat-item">
                    <span className="feat-check">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="hub-pillar-action-row">
                <span className="hub-pillar-cta-text">{portal.cta}</span>
                <span className="hub-pillar-cta-arrow">⬅</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CORE INTERACTIVE LEARNING TOOLS */}
      <section className="hub-section">
        <div className="hub-section-header">
          <div>
            <div className="hub-section-pretitle">الأدوات التفاعلية</div>
            <h2 className="hub-section-title">بيئة تعلم عملية تتجاوز التلقين التقليدي</h2>
          </div>
          <p className="hub-section-subtitle">
            أدوات ذكية جاهزة للعمل الفوري لتدريب الطلاب ورفع مستوى إتقانهم للرياضيات
          </p>
        </div>

        <div className="hub-shortcuts-strip" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {interactiveTools.map((tool, idx) => (
            <div
              key={idx}
              className="hub-directory-card"
              onClick={() => setCurrentScreen(tool.screen)}
            >
              <div className="hub-dir-card-header">
                <div className="hub-dir-icon-badge">{tool.icon}</div>
                <span
                  className="hub-dir-category-pill"
                  style={{ color: tool.color, background: `${tool.color}12` }}
                >
                  {tool.badge}
                </span>
              </div>
              <h4 className="hub-dir-card-title">{tool.title}</h4>
              <p className="hub-dir-card-subtitle">{tool.desc}</p>
              <div className="hub-dir-card-footer">
                <span className="hub-dir-open-btn" style={{ color: tool.color }}>
                  الدخول للأداة الآن ⬅
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WHY MATH SMART? */}
      <section className="hub-section">
        <div className="hub-section-header">
          <div>
            <div className="hub-section-pretitle">مميزات المنظومة</div>
            <h2 className="hub-section-title">لماذا يثق الطلاب والمعلمون بمنصة أذكياء الرياضيات؟</h2>
          </div>
        </div>

        <div className="hub-features-grid">
          {platformAdvantages.map((adv, idx) => (
            <div key={idx} className="hub-feature-card">
              <div className="hub-feature-icon">{adv.icon}</div>
              <h4 className="hub-feature-title">{adv.title}</h4>
              <p className="hub-feature-desc">{adv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CLEAN PLATFORM SERVICES & QUICK ACCESS STRIP */}
      <section className="hub-section">
        <div className="hub-section-header">
          <div>
            <div className="hub-section-pretitle">مرافق وخدمات إضافية</div>
            <h2 className="hub-section-title">الوصول السريع إلى خدمات المنصة والحسابات</h2>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: '12px'
        }}>
          {quickServices.map((srv, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentScreen(srv.screen)}
              className="hub-shortcut-item"
              style={{
                border: '1px solid var(--border-card)',
                fontFamily: 'var(--font-ar)',
                textAlign: 'right',
                padding: '14px 16px'
              }}
            >
              <span style={{ fontSize: '20px' }}>{srv.icon}</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-heading)' }}>
                {srv.label}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
