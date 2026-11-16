import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { isGeminiConfigured } from '../services/aiService';

export const Footer = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { role } = useAuth();

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    {
      title: 'بوابات التعلّم والتنافس',
      links: [
        { label: 'بوابة الطالب الرئيسية', screen: '13', badge: 'تفاعلي' },
        { label: 'مختبر حل المسائل والسبورة', screen: '09', badge: 'ذكي' },
        { label: 'حلبة التحديات والمبارزات 1v1', screen: '03', badge: 'مباشر' },
        { label: 'خارطة المناهج والوحدات', screen: '17', badge: '12 وحدة' },
        { label: 'لوحة الرموز والمعادلات', screen: '12' },
        { label: 'تحديد واختيار المرحلة', screen: '06' }
      ]
    },
    {
      title: 'بوابة المعلم والتقارير',
      links: [
        { label: 'لوحة تحكم المعلم والمشرف', screen: '02', badge: 'معتمد' },
        { label: 'إدارة السجلات المركزية (CSV)', screen: '07' },
        { label: 'التقارير الأكاديمية الشاملة', screen: '08' },
        { label: 'تقرير متابعة ولي الأمر والمعلم', screen: '16' },
        { label: 'بطاقة التقييم التشخيصي', screen: '01' }
      ]
    },
    {
      title: 'الحساب والأمان والتقنية',
      links: [
        { label: 'دخول حساب الطالب', screen: '04' },
        { label: 'تسجيل طالب جديد', screen: '15' },
        { label: 'دخول المعلم والمشرف', screen: '10' },
        { label: 'توثيق حساب معلم جديد', screen: '14' },
        { label: 'استعادة كلمة المرور (OTP)', screen: '05' },
        { label: 'الملف الشخصي وتفضيلات النظام', screen: '11' },
        { label: 'دليل الهوية والشعار الرسمي', screen: '18' }
      ]
    }
  ];

  return (
    <footer className="app-footer">
      <div className="app-footer-container">
        {/* Top Section: Brand + Navigation Columns */}
        <div className="app-footer-grid">
          {/* Brand Info Column */}
          <div className="app-footer-brand-col">
            <div
              onClick={() => setCurrentScreen('hub')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1.5px solid rgba(56, 189, 248, 0.4)',
                boxShadow: '0 6px 20px rgba(79, 70, 229, 0.4)',
                background: '#090d1a',
                flexShrink: 0
              }}>
                <img
                  src="/assets/math_smart_logo.jpg"
                  alt="شعار أذكياء الرياضيات"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.src = '/assets/math_smart_logo.svg'; }}
                />
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-heading)' }}>
                  أذكياء الرياضيات
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Math Smart Platform
                </div>
              </div>
            </div>

            <p style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              lineHeight: 1.8,
              marginBottom: '20px',
              maxWidth: '360px'
            }}>
              المنظومة التعليمية الرقمية المتقدمة لتعليم الرياضيات التفاعلية بالمملكة العربية السعودية، تجمع بين التقييم التشخيصي بالذكاء الاصطناعي، حلبات المبارزة اللحظية، وتغطية المناهج من التأسيس حتى التفاضل والتكامل.
            </p>

            {/* Badges / Tech Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '12px',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-card)',
                fontSize: '11px',
                color: 'var(--text-body)',
                width: 'fit-content'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                <span>حالة قاعدة البيانات:</span>
                <strong style={{ color: '#10b981' }}>{isSupabaseConfigured ? 'سحابي (Supabase)' : 'مفعل (محلي / تجريبي)'}</strong>
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '12px',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-card)',
                fontSize: '11px',
                color: 'var(--text-body)',
                width: 'fit-content'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
                <span>محرك الذكاء الاصطناعي:</span>
                <strong style={{ color: '#38bdf8' }}>{isGeminiConfigured ? 'Gemini 2.5 Flash' : 'Math AI Engine'}</strong>
              </div>
            </div>
          </div>

          {/* Nav Columns */}
          {navLinks.map((col, idx) => (
            <div key={idx} className="app-footer-col">
              <h4 style={{
                fontSize: '14px',
                fontWeight: '800',
                color: 'var(--text-heading)',
                marginBottom: '16px',
                position: 'relative',
                paddingBottom: '8px',
                borderBottom: '2px solid rgba(99, 102, 241, 0.3)',
                display: 'inline-block'
              }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <button
                      type="button"
                      onClick={() => setCurrentScreen(link.screen)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '13px',
                        padding: '3px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: 'var(--font-ar)',
                        textAlign: 'right',
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#38bdf8'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      <span>• {link.label}</span>
                      {link.badge && (
                        <span style={{
                          fontSize: '10px',
                          background: 'rgba(99, 102, 241, 0.16)',
                          color: '#818cf8',
                          padding: '1px 6px',
                          borderRadius: '8px',
                          border: '1px solid rgba(99, 102, 241, 0.3)'
                        }}>
                          {link.badge}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Sub-footer */}
        <div className="app-footer-bottom">
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span>© 2026 منصة أذكياء الرياضيات | Math Smart. جميع الحقوق محفوظة.</span>
            <span>•</span>
            <span style={{ color: '#10b981' }}>نظام تعليمي وتقني موحد متوافق مع معايير وزارة التعليم</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              type="button"
              onClick={() => {
                setCurrentScreen('18');
                showToast('الانتقال لدليل الهوية والشعار الرسمي', 'info');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              الهوية والشعار 🎨
            </button>
            <button
              type="button"
              onClick={scrollToTop}
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-heading)',
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '700'
              }}
              title="العودة لأعلى الصفحة"
            >
              <span>القمة</span>
              <span>⬆</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
