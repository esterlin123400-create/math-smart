import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const GradeLevelSelection = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { updateProfile } = useAuth();
  const [selectedStage, setSelectedStage] = useState('elementary'); // 'elementary' | 'middle' | 'high'
  const [activeGrade, setActiveGrade] = useState('الصف السادس الابتدائي');

  const stages = [
    { id: 'elementary', name: 'المرحلة الابتدائية', icon: '🌱', desc: 'تأسيس الحساب الذهني، العمليات الأساسية، والكسور' },
    { id: 'middle', name: 'المرحلة المتوسطة', icon: '🌿', desc: 'الجبر الخطي، الإحصاء، معادلات الدرجة الأولى، والهندسة' },
    { id: 'high', name: 'المرحلة الثانوية والمسارات', icon: '🌳', desc: 'المصفوفات، حساب المثلثات، الهندسة التحليلية، والمتجهات' },
    { id: 'calculus', name: 'مرحلة التفاضل والتكامل', icon: '∫', desc: 'النهايات والاتصال، قواعد الاشتقاق، التكامل المحدود، والمعادلات التفاضلية' }
  ];

  const gradeData = {
    elementary: [
      { id: 'p1', title: 'الصف الأول الابتدائي', icon: '1️⃣', topics: ['الأعداد حتى 100', 'الجمع البسيط', 'الأشكال الهندسية'] },
      { id: 'p2', title: 'الصف الثاني الابتدائي', icon: '2️⃣', topics: ['حقائق الجمع والطرح', 'قراءة الساعة', 'النقود والقياس'] },
      { id: 'p3', title: 'الصف الثالث الابتدائي', icon: '3️⃣', topics: ['مقدمة الضرب والقسمة', 'الكسور كأجزاء من الكل', 'المحيط والمساحة'] },
      { id: 'p4', title: 'الصف الرابع الابتدائي', icon: '4️⃣', topics: ['الضرب في عددين', 'القسمة المطولة', 'الزوايا والمستقيمات'] },
      { id: 'p5', title: 'الصف الخامس الابتدائي', icon: '5️⃣', topics: ['الكسور العشرية والنسبة', 'القواسم والمضاعفات', 'حجم المجسمات'] },
      { id: 'p6', title: 'الصف السادس الابتدائي', icon: '6️⃣', topics: ['المعادلات والأنماط الجبرية', 'النسب المئوية', 'التمثيلات البيانية والسطوح'] }
    ],
    middle: [
      { id: 'm1', title: 'الصف الأول متوسط', icon: '📘', topics: ['الأعداد الصحيحة والجبر', 'المعادلات ذات الخطوة الواحدة', 'النسبة والتناسب'] },
      { id: 'm2', title: 'الصف الثاني متوسط', icon: '📗', topics: ['الأعداد الحقيقية ونظرية فيثاغورس', 'التطابق والتشابه', 'الاحتمالات'] },
      { id: 'm3', title: 'الصف الثالث متوسط', icon: '📙', topics: ['المعادلات الخطية ونظمها', 'الدوال التربيعية', 'العبارات الجذرية'] }
    ],
    high: [
      { id: 'h1', title: 'المسار العام (ثانوي)', icon: '🏛️', topics: ['التبرير والبرهان الرياضي', 'المصفوفات والمحددات', 'المتطابقات المثلثية'] },
      { id: 'h2', title: 'مسار الهندسة والحاسب', icon: '💻', topics: ['الخوارزميات والمنطق الرياضي', 'المتجهات ثلاثية الأبعاد', 'الإحداثيات القطبية والأعداد المركبة'] },
      { id: 'h3', title: 'مسار الصحة والحياة', icon: '🧬', topics: ['الإحصاء الحيوي والاحتمالات', 'النمذجة الرياضية التكاثرية', 'النسب التناسبية الطبية'] }
    ],
    calculus: [
      { id: 'c1', title: 'حساب التفاضل والتكامل 1 (Calculus I)', icon: '⚡', topics: ['النهايات والاتصال وإزالة عدم التعيين 0/0', 'قواعد الاشتقاق وسلسلة الدوال والاشتقاق الضمني', 'المعدلات الزمنية المرتبطة والقيم القصوى'] },
      { id: 'c2', title: 'حساب التفاضل والتكامل 2 (Calculus II)', icon: '∫', topics: ['النظرية الأساسية للتفاضل والتكامل', 'طرق التكامل بالتعويض والتجزيء والكسور الجزئية', 'حساب المساحات المحصورة بين المنحنيات'] },
      { id: 'c3', title: 'التفاضل والتكامل المتقدم (Calculus III)', icon: '🌀', topics: ['حجوم الأجسام الدورانية بطريقة الأقراص والقشور', 'طول المنحنى ومساحة السطوح الدورانية', 'المعادلات التفاضلية القابلة للفصل وتطبيقاتها'] }
    ]
  };

  const handleSelectGrade = (gradeTitle) => {
    setActiveGrade(gradeTitle);
    updateProfile({ grade: gradeTitle });
    showToast(`تم تعيين مرحلتك الدراسية إلى: ${gradeTitle}`, 'success');
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
        <span className="badge badge-primary">06 المراحل الدراسية</span>
      </div>

      <div className="page-hero">
        <h1 className="hero-title">اختيار وتخصيص المرحلة والمناهج الدراسية</h1>
        <p className="hero-subtitle">
          اختر صفك الدراسي لتهيئة بنك المسائل الذكي، شجرة المناهج، والتحديات التفاعلية المناسبة لمستواك الأكاديمي
        </p>
      </div>

      {/* Stage Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {stages.map(st => (
          <div
            key={st.id}
            onClick={() => setSelectedStage(st.id)}
            style={{
              background: selectedStage === st.id ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.25), rgba(6, 182, 212, 0.15))' : 'var(--bg-card)',
              border: selectedStage === st.id ? '2px solid #6366f1' : '1px solid var(--border-card)',
              borderRadius: '20px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div style={{ fontSize: '36px' }}>{st.icon}</div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>{st.name}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{st.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grade Cards Grid */}
      <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '18px' }}>
        الصفوف المتاحة في هذه المرحلة:
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {gradeData[selectedStage].map((grade) => {
          const isSelected = activeGrade === grade.title;

          return (
            <div
              key={grade.id}
              className="glass-card"
              style={{
                borderColor: isSelected ? '#10b981' : 'var(--border-card)',
                background: isSelected ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(15, 23, 42, 0.85))' : 'var(--bg-card)',
                boxShadow: isSelected ? '0 0 25px rgba(16, 185, 129, 0.25)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '28px' }}>{grade.icon}</span>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>{grade.title}</h3>
                </div>
                {isSelected && (
                  <span className="badge badge-success">الصف الحالي النشط</span>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '700', marginBottom: '8px' }}>
                  أهم المحاور التعليمية:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {grade.topics.map((t, i) => (
                    <span key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', color: 'var(--text-body)' }}>
                      • {t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleSelectGrade(grade.title)}
                  className={`btn ${isSelected ? 'btn-success' : 'btn-primary'}`}
                  style={{ flex: 1, padding: '10px' }}
                >
                  {isSelected ? '✓ الصف المختار' : 'تحديد هذا الصف'}
                </button>
                <button
                  onClick={() => {
                    handleSelectGrade(grade.title);
                    setCurrentScreen('17'); // View units
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '10px 14px' }}
                >
                  استعراض الوحدات 📖
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
