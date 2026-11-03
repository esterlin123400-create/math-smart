import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AcademicReports = () => {
  const { setCurrentScreen, showToast } = useApp();
  const [selectedTerm, setSelectedTerm] = useState('term1');

  const skills = [
    { name: 'الجبر والمعادلات الخطية', level: 96, status: 'متقن بامتياز', color: '#10b981' },
    { name: 'الهندسة والزوايا والمساحات', level: 92, status: 'متقن', color: '#38bdf8' },
    { name: 'الكسور والعمليات التناسبية', level: 86, status: 'جيد جداً', color: '#818cf8' },
    { name: 'الإحصاء وقراءة الرسوم البيانية', level: 76, status: 'يحتاج تدريباً إضافياً', color: '#fbbf24' },
    { name: 'الحساب الذهني وحل المشكلات اللفظية', level: 90, status: 'متقن', color: '#34d399' }
  ];

  const handlePrint = () => {
    window.print();
    showToast('جاري تحضير التقرير الأكاديمي للطباعة...', 'info');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setCurrentScreen('hub')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
        >
          ← العودة لمعرض الواجهات
        </button>
        <span className="badge badge-cyan">08 التقارير والتحليلات</span>
      </div>

      <div className="page-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 className="hero-title">التقارير والتحليلات الأكاديمية الشاملة</h1>
            <p className="hero-subtitle">
              رسم بياني تحليلي لمستوى الإتقان في مختلف فروع الرياضيات، ومؤشرات التطور الزمني
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handlePrint} className="btn btn-primary">
              🖨️ طباعة التقرير PDF
            </button>
            <button
              onClick={() => showToast('تم إرسال نسخة رقمية من التقرير إلى ولي الأمر عبر الواتساب والبريد!', 'success')}
              className="btn btn-secondary"
            >
              📤 مشاركة التقرير
            </button>
          </div>
        </div>
      </div>

      {/* Top Academic KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>المعدل العام التراكمي</div>
          <div style={{ fontSize: '38px', fontWeight: '900', color: '#10b981', fontFamily: 'var(--font-en)' }}>91.8%</div>
          <span className="badge badge-success" style={{ marginTop: '6px' }}>مرتبة الشرف الأولى</span>
        </div>

        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>إجمالي المسائل المنجزة</div>
          <div style={{ fontSize: '38px', fontWeight: '900', color: '#38bdf8', fontFamily: 'var(--font-en)' }}>248</div>
          <span className="badge badge-cyan" style={{ marginTop: '6px' }}>معدل حل: 94% دقة</span>
        </div>

        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>متوسط سرعة الإجابة</div>
          <div style={{ fontSize: '38px', fontWeight: '900', color: '#fbbf24', fontFamily: 'var(--font-en)' }}>32s</div>
          <span className="badge badge-warning" style={{ marginTop: '6px' }}>أسرع من 88% من الطلاب</span>
        </div>

        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>الالتزام وسلسلة النشاط</div>
          <div style={{ fontSize: '38px', fontWeight: '900', color: '#ec4899', fontFamily: 'var(--font-en)' }}>12 يوم</div>
          <span className="badge badge-primary" style={{ marginTop: '6px' }}>سلسلة متواصلة 🔥</span>
        </div>
      </div>

      {/* Skills Mastery Breakdown Bars */}
      <div className="glass-card" style={{ marginBottom: '32px', padding: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '24px' }}>
          مؤشر إتقان فروع الرياضيات (Skill Mastery Matrix)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {skills.map((sk, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>{sk.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', color: sk.color, fontWeight: '700' }}>{sk.status}</span>
                  <span style={{ fontSize: '14px', fontWeight: '900', color: '#fff', fontFamily: 'var(--font-en)' }}>{sk.level}%</span>
                </div>
              </div>
              <div style={{ height: '10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{
                  width: `${sk.level}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${sk.color}, #06b6d4)`,
                  borderRadius: '6px',
                  transition: 'width 1s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations & Followup trigger */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="glass-card" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fbbf24', marginBottom: '12px' }}>
            🎯 خطة التطوير المقترحة للأسبوع القادم:
          </h3>
          <p style={{ fontSize: '13px', lineHeight: 1.8, color: 'var(--text-body)', marginBottom: '16px' }}>
            يوصى بتركيز 3 جلسات تدريبية على درس "الوسيط والمنوال وتفسير القطاعات الدائرية" لرفع نسبة الإتقان في فرع الإحصاء إلى ما فوق 90%.
          </p>
          <button
            onClick={() => {
              setCurrentScreen('09');
              showToast('جاري فتح تدريب الإحصاء التفاعلي...', 'info');
            }}
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '13px' }}
          >
            بدء جلسة التدريب المقترحة الآن 🚀
          </button>
        </div>

        <div className="glass-card" style={{ borderColor: 'rgba(56, 189, 248, 0.3)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#38bdf8', marginBottom: '12px' }}>
            👨‍👩‍👧‍👦 تقرير المتابعة مع المعلم:
          </h3>
          <p style={{ fontSize: '13px', lineHeight: 1.8, color: 'var(--text-body)', marginBottom: '16px' }}>
            أشاد الأستاذ طارق بالالتزام العالي ومعدل سرعة التفكير المنطقي لدى الطالب. يمكنكم استعراض التقرير الموجه لولي الأمر مباشرة.
          </p>
          <button
            onClick={() => setCurrentScreen('16')}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '13px' }}
          >
            الانتقال لتقرير ولي الأمر والمعلم 📋
          </button>
        </div>
      </div>
    </div>
  );
};
