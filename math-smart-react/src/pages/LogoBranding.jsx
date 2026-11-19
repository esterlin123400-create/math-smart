import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { copyToClipboard } from '../utils/platformHelpers';
import { Breadcrumb } from '../components/Breadcrumb';

export const LogoBranding = () => {
  const { setCurrentScreen, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'official' | 'variations' | 'colors' | 'typography' | 'downloads'

  const tabs = [
    { id: 'all', label: 'العرض الشامل (الكل)', icon: '🌐' },
    { id: 'official', label: 'الشعار الرسمي والدلالات', icon: '✨' },
    { id: 'variations', label: 'تطبيقات وأنماط الشعار', icon: '📐' },
    { id: 'colors', label: 'لوحة الألوان المعتمدة', icon: '🎨' },
    { id: 'typography', label: 'الخطوط والتايبوغرافي', icon: '🔤' },
    { id: 'downloads', label: 'حزمة الأصول والتنزيلات', icon: '💾' }
  ];

  const colors = [
    { name: 'الفيروزي الرئيسي (Turquoise Primary)', hex: '#0d9488', cssVar: '--primary', role: 'الهوية البصرية والأزرار والمكونات الأساسية' },
    { name: 'الفيروزي المشرق (Bright Turquoise)', hex: '#14b8a6', cssVar: '--primary-light', role: 'المؤشرات والبيانات التفاعلية والتأثيرات الهادئة' },
    { name: 'الأخضر النعناعي (Mint Green)', hex: '#10b981', cssVar: '--accent-emerald', role: 'الإجابات الصحيحة ونسب الإتقان والتفوق الدراسي' },
    { name: 'النعناعي الفاتح (Soft Mint)', hex: '#34d399', cssVar: '--accent-mint', role: 'التدرجات اللطيفة وإبراز المهارات المكتسبة' },
    { name: 'البرتقالي الفاتح (Light Orange)', hex: '#fb923c', cssVar: '--accent-amber', role: 'نقاط الخبرة XP والشارات والمهام اليومية' },
    { name: 'البرتقالي الدافئ (Warm Orange)', hex: '#f97316', cssVar: '--accent-pink', role: 'حلبة التحديات المباشرة والمبارزات الحماسية' },
    { name: 'الأبيض النعناعي الفاتح (Mint Ivory)', hex: '#f4fbf9', cssVar: '--bg-base', role: 'الخلفيات الفاتحة والمريحة للعين في جميع الصفحات' }
  ];

  const handleCopyHex = async (color) => {
    const ok = await copyToClipboard(color.hex);
    showToast(ok ? `تم نسخ رمز اللون ${color.hex} إلى الحافظة!` : `رمز اللون: ${color.hex}`, ok ? 'success' : 'info');
  };

  const handleDownloadAsset = (fileName, label) => {
    const link = document.createElement('a');
    link.href = `/assets/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`تم بدء تنزيل ${label} بنجاح!`, 'success');
  };

  return (
    <div>
      <Breadcrumb
        items={[{ label: 'دليل الهوية والشعار الرسمي للمنصة', icon: '🎨' }]}
        backTo="hub"
        backLabel="الرئيسية"
        tag="الهوية الرسمية"
      />

      {/* BRAND HERO SHOWCASE */}
      <div className="glass-card" style={{
        padding: '50px 30px',
        textAlign: 'center',
        marginBottom: '28px',
        borderColor: 'rgba(20, 184, 166, 0.45)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow ambient background */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '380px',
          height: '260px',
          background: 'radial-gradient(ellipse at center, rgba(13, 148, 136, 0.35) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 75%)',
          pointerEvents: 'none'
        }} />

        {/* Real Brand Logo Image Showcase */}
        <div style={{
          width: '180px',
          height: '180px',
          margin: '0 auto 24px',
          borderRadius: '38px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(13, 148, 136, 0.5), 0 0 30px rgba(6, 182, 212, 0.35)',
          border: '2px solid rgba(56, 189, 248, 0.5)',
          background: '#e6faf5',
          position: 'relative'
        }}>
          <img
            src="/assets/math_smart_logo.jpg"
            alt="شعار منصة أذكياء الرياضيات الرسمي"
            className="float-anim"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.currentTarget.src = '/assets/math_smart_logo.svg'; }}
          />
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '20px',
          padding: '4px 14px',
          color: '#0284c7',
          fontSize: '12px',
          fontWeight: '800',
          marginBottom: '14px'
        }}>
          <span>✨</span> الشعار الرسمي المعتمد لمنصة أذكياء الرياضيات
        </div>

        <h1 style={{
          fontSize: '34px',
          fontWeight: '900',
          background: 'var(--hero-title-gradient)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        }}>
          أذكياء الرياضيات | Math Smart
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '680px', margin: '0 auto 26px', lineHeight: 1.8 }}>
          المنظومة التعليمية الرقمية المتقدمة لتعليم الرياضيات التفاعلية بالمملكة العربية السعودية، تجمع بين الذكاء الاصطناعي، التقييم التكيفي، وحلبات التحدي الرياضي
        </p>

        {/* Action Downloads */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => handleDownloadAsset('math_smart_logo.jpg', 'الشعار الرسمي عالي الدقة (JPG/PNG)')}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '14px' }}
          >
            <span>🖼️</span> تحميل الشعار بجودة فائقة (HD Image)
          </button>
          <button
            type="button"
            onClick={() => handleDownloadAsset('math_smart_logo.svg', 'الشعار المتجهي (Vector SVG)')}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '14px' }}
          >
            <span>📐</span> تحميل ملف الفكتور (SVG المتجه)
          </button>
        </div>
      </div>

      {/* INTERACTIVE BRAND TABS */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '16px',
                border: isActive ? '1px solid #14b8a6' : '1px solid var(--border-card)',
                background: isActive ? 'linear-gradient(135deg, #0d9488, #06b6d4)' : 'var(--bg-subtle)',
                color: isActive ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-ar)',
                fontSize: '13px',
                fontWeight: '700',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 4px 15px rgba(13, 148, 136, 0.35)' : 'none'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: PHILOSOPHY & SYMBOLISM */}
      {(activeTab === 'all' || activeTab === 'official') && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🌀</span> دلالات وعناصر الشعار البصري (Logo Symbolism):
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: '20px'
          }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
                🌀
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '8px' }}>
                اللولب الذهبي ومتتالية فيبوناتشي
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                يمثل النسبة الذهبية (Phi = 1.618) ونمو التفكير الرياضي الطبيعي من المفاهيم البسيطة إلى قمم النبوغ والتحليل الرياضي العميق.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(20, 184, 166, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
                🧊
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '8px' }}>
                المكعب البلوري ثلاثي الأبعاد
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                يعكس قوة الهندسة الفراغية، التفكير المنطقي متعدد الأبعاد، وحل المسائل الرياضية المعقدة بوضوح ودقة متناهية.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
                ✨
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '8px' }}>
                نجمة البوصلة والعبقرية المشعة
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                ترمز لشرارة الإبداع، التوجيه الذكي للمسار التعليمي، والوصول لأعلى مراتب الشرف في المنافسات والأولمبياد الرياضي.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: LOGO VARIATIONS */}
      {(activeTab === 'all' || activeTab === 'variations') && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📐</span> تطبيقات الشعار في بيئات الاستخدام المختلفة:
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: '20px'
          }}>
            {/* Dark Mode */}
            <div className="glass-card" style={{ textAlign: 'center', background: '#143b40', padding: '30px 20px' }}>
              <div style={{ width: '80px', height: '80px', margin: '0 auto 16px', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src="/assets/math_smart_logo.jpg" alt="Dark Mode" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>النمط الداكن السيبراني</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>مخصص لواجهات المنصة وشاشات الهواتف والأجهزة اللوحية</div>
            </div>

            {/* Vector SVG Icon */}
            <div className="glass-card" style={{ textAlign: 'center', background: '#19474c', padding: '30px 20px' }}>
              <div style={{ width: '80px', height: '80px', margin: '0 auto 16px' }}>
                <img src="/assets/math_smart_logo.svg" alt="Vector SVG" style={{ width: '100%', height: '100%' }} />
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>الأيقونة المتجهة (Vector SVG)</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>تنسيق خفيف الوزن وفائق الدقة للويب وشريط التنقل والـ Favicon</div>
            </div>

            {/* Light Mode / Printing */}
            <div className="glass-card" style={{ textAlign: 'center', background: '#f8fafc', color: '#134e4a', padding: '30px 20px', borderColor: '#cbd5e1' }}>
              <div style={{ width: '80px', height: '80px', margin: '0 auto 16px', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
                <img src="/assets/math_smart_logo.jpg" alt="Light Mode" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#134e4a', marginBottom: '4px' }}>تطبيق المطبوعات والشهادات</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>لشهادات الشرف، خطابات التقدير، والتقارير المدرسية الرسمية</div>
            </div>

            {/* Horizontal Lockup */}
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '30px 20px', background: '#19474c' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', overflow: 'hidden' }}>
                <img src="/assets/math_smart_logo.jpg" alt="Horizontal Lockup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: '900', color: '#fff' }}>أذكياء الرياضيات</div>
                <div style={{ fontSize: '11px', color: '#38bdf8' }}>Math Smart Platform</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: COLOR PALETTE */}
      {(activeTab === 'all' || activeTab === 'colors') && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🎨</span> لوحة الألوان المعتمدة (Brand Color Palette):
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '16px'
          }}>
            {colors.map((c, i) => (
              <div
                key={i}
                onClick={() => handleCopyHex(c)}
                className="glass-card"
                style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
                title="انقر لنسخ رمز اللون"
              >
                <div style={{ height: '90px', background: c.hex, boxShadow: `0 8px 20px ${c.hex}33`, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '8px' }}>
                  <span style={{ fontSize: '10px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>
                    نسخ 📋
                  </span>
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '4px' }}>{c.name}</div>
                  <div style={{ fontSize: '14px', fontWeight: '900', color: '#0284c7', fontFamily: 'var(--font-en)', marginBottom: '4px' }}>
                    {c.hex}
                  </div>
                  <div style={{ fontSize: '10px', color: '#14b8a6', fontFamily: 'var(--font-en)', marginBottom: '6px' }}>
                    {c.cssVar}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: TYPOGRAPHY */}
      {(activeTab === 'all' || activeTab === 'typography') && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🔤</span> الخطوط والتايبوغرافي الرسمية (Official Typography):
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span className="badge badge-primary">الخط العربي الرئيسي</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Google Fonts • Cairo</span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-heading)', marginBottom: '10px', fontFamily: 'Cairo' }}>
                أبجد هوز حطي كلمن 123
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
                خط حديث متوازن، صُمم خصيصاً للشاشات الرقمية ليمنح وضوحاً فائقاً في قراءة المسائل الرياضية والنصوص التعليمية.
              </p>
              <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: '#0284c7', fontFamily: 'var(--font-en)' }}>
                font-family: 'Cairo', sans-serif;
              </div>
            </div>

            <div className="glass-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span className="badge badge-cyan">خط الأرقام والرموز اللاتينية</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Google Fonts • Outfit</span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-heading)', marginBottom: '10px', fontFamily: 'Outfit' }}>
                y = 3x² + 2x - 5 (98.4%)
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
                خط هندسي متناسق مخصص لكتابة الأرقام الإنجليزية، نسب الإنجاز، والمعادلات الجبرية بدقة هندسية عالية.
              </p>
              <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: '#0284c7', fontFamily: 'var(--font-en)' }}>
                font-family: 'Outfit', sans-serif;
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: DOWNLOAD PACK */}
      {(activeTab === 'all' || activeTab === 'downloads') && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>💾</span> مركز تنزيل حزمة الأصول الرسمية (Asset Downloads Pack):
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '18px' }}>
            <div className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>🖼️</div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '6px' }}>الشعار الرسمي فائق الدقة (HD)</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>ملف صورة محسن عالي الدقة (51KB JPG) مناسب للعروض والشاشات.</p>
              </div>
              <button type="button" onClick={() => handleDownloadAsset('math_smart_logo.jpg', 'الشعار عالي الدقة')} className="btn btn-primary" style={{ width: '100%', fontSize: '12px' }}>
                تحميل JPG HD 📥
              </button>
            </div>

            <div className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>📐</div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '6px' }}>شعار الفكتور المتجه (SVG)</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>تنسيق متجهي قابل للتكبير اللانهائي دون أي فقد في الدقة.</p>
              </div>
              <button type="button" onClick={() => handleDownloadAsset('math_smart_logo.svg', 'شعار الفكتور SVG')} className="btn btn-secondary" style={{ width: '100%', fontSize: '12px' }}>
                تحميل Vector SVG 📥
              </button>
            </div>

            <div className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>🎒</div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '6px' }}>أيقونة بطل الرياضيات (Mascot)</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>شخصية الطالب البطل الرمزية للمنصة بتنسيق متجهي نقي.</p>
              </div>
              <button type="button" onClick={() => handleDownloadAsset('student_hero_mascot.svg', 'أيقونة البطل الرمزية')} className="btn btn-secondary" style={{ width: '100%', fontSize: '12px' }}>
                تحميل Mascot SVG 📥
              </button>
            </div>

            <div className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>⚖️</div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '6px' }}>مخطط ميزان الجبر التفاعلي</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>المخطط الهندسي التفاعلي لمسائل الميزان والمعادلات الخطية.</p>
              </div>
              <button type="button" onClick={() => handleDownloadAsset('math_algebra_balance_diagram.svg', 'مخطط ميزان الجبر')} className="btn btn-secondary" style={{ width: '100%', fontSize: '12px' }}>
                تحميل Diagram SVG 📥
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
