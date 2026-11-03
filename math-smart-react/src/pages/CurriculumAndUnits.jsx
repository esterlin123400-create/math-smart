import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { mockCurriculumUnits } from '../data/mockData';

export const CurriculumAndUnits = () => {
  const { setCurrentScreen, showToast } = useApp();
  const [selectedStage, setSelectedStage] = useState('all'); // 'all' | 'elementary' | 'middle' | 'high' | 'calculus'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUnit, setExpandedUnit] = useState(9); // Default expanded to Calculus Unit 9 or first
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  const stagesList = [
    { id: 'all', name: 'جميع المراحل', icon: '🌐', count: 12 },
    { id: 'elementary', name: 'المرحلة الابتدائية', icon: '🌱', count: 3, desc: 'التأسيس والعمليات والكسور' },
    { id: 'middle', name: 'المرحلة المتوسطة', icon: '🌿', count: 3, desc: 'الجبر الخطي وفيثاغورس والدوال' },
    { id: 'high', name: 'المرحلة الثانوية', icon: '🏛️', count: 2, desc: 'المصفوفات والمتجهات والمثلثات' },
    { id: 'calculus', name: 'مرحلة التفاضل والتكامل', icon: '∫', count: 4, desc: 'النهايات، الاشتقاق، التكامل والمعادلات' }
  ];

  // Filter units by stage and search query
  const filteredUnits = useMemo(() => {
    return mockCurriculumUnits.filter(unit => {
      const matchesStage = selectedStage === 'all' || unit.stageId === selectedStage;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesStage;

      const matchesSearch =
        unit.title.toLowerCase().includes(q) ||
        unit.grade.toLowerCase().includes(q) ||
        unit.desc.toLowerCase().includes(q) ||
        unit.lessons.some(l => l.title.toLowerCase().includes(q));

      return matchesStage && matchesSearch;
    });
  }, [selectedStage, searchQuery]);

  // Overall stats
  const totalLessons = mockCurriculumUnits.reduce((acc, u) => acc + u.lessons.length, 0);
  const totalXp = mockCurriculumUnits.reduce((acc, u) => acc + u.lessons.reduce((lacc, l) => lacc + l.xp, 0), 0);
  const completedLessons = mockCurriculumUnits.reduce((acc, u) => acc + u.lessons.filter(l => l.status === 'completed').length, 0);
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  const toggleUnit = (id) => {
    setExpandedUnit(expandedUnit === id ? null : id);
  };

  const handleStartLesson = (lesson, unit) => {
    if (lesson.status === 'locked') {
      showToast('هذا الدرس مغلق حالياً، أكمل الدروس السابقة لفتحه!', 'warning');
      return;
    }
    setCurrentScreen('09');
    showToast(`الانتقال للمسائل التفاعلية لدرس: ${lesson.title} (${unit.grade})`, 'info');
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'أسطوري':
        return { bg: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: 'rgba(236, 72, 153, 0.3)' };
      case 'خبير':
        return { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' };
      case 'متقدم':
        return { bg: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' };
      case 'متوسط':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
      default:
        return { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
    }
  };

  return (
    <div>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={() => setCurrentScreen('hub')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
        >
          ← العودة لمعرض الواجهات
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setCurrentScreen('06')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              background: 'rgba(99, 102, 241, 0.1)',
              color: '#a5b4fc',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            تغيير المرحلة (شاشة 06) ⚙️
          </button>
          <span className="badge badge-primary">17 المناهج والوحدات الدراسية (مكتملة لجميع المراحل)</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="page-hero">
        <h1 className="hero-title">خارطة المناهج والوحدات الدراسية التفاعلية الكاملة</h1>
        <p className="hero-subtitle">
          تغطية شاملة تبدأ من المرحلة الابتدائية وتأسيس الحساب، مروراً بالمتوسط والثانوي، وحتى مقررات التفاضل والتكامل المتقدمة (Calculus)
        </p>
      </div>

      {/* Global Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '28px'
      }}>
        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '28px', background: 'rgba(79, 70, 229, 0.15)', padding: '10px', borderRadius: '12px' }}>📚</div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>إجمالي الوحدات المعتمدة</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>12 وحدة كاملة</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '28px', background: 'rgba(6, 182, 212, 0.15)', padding: '10px', borderRadius: '12px' }}>🎯</div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>إجمالي الدروس التفاعلية</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#38bdf8' }}>{totalLessons} درساً مشروحاً</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '28px', background: 'rgba(245, 158, 11, 0.15)', padding: '10px', borderRadius: '12px' }}>⚡</div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>نقاط الخبرة القابلة للتحصيل</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#fbbf24' }}>+{totalXp} XP</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '28px', background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '12px' }}>🏆</div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>نسبة إنجاز المنهج الكلي</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#34d399' }}>{overallProgress}% مكتمل</div>
          </div>
        </div>
      </div>

      {/* Stage Selector Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {stagesList.map(st => {
          const isActive = selectedStage === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setSelectedStage(st.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 20px',
                borderRadius: '16px',
                border: isActive ? '2px solid #6366f1' : '1px solid var(--border-card)',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.3), rgba(6, 182, 212, 0.2))'
                  : 'rgba(15, 23, 42, 0.6)',
                color: isActive ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-ar)',
                fontSize: '14px',
                fontWeight: '700',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 4px 20px rgba(99, 102, 241, 0.35)' : 'none'
              }}
            >
              <span style={{ fontSize: '18px' }}>{st.icon}</span>
              <span>{st.name}</span>
              <span style={{
                background: isActive ? '#4f46e5' : 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                {st.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Quick Filters Bar */}
      <div style={{
        display: 'flex',
        gap: '14px',
        marginBottom: '28px',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن درس أو قانون (مثلاً: تكامل، اشتقاق، كسور، نهايات، فيثاغورس)..."
            style={{
              width: '100%',
              padding: '12px 42px 12px 16px',
              borderRadius: '12px',
              border: '1px solid var(--border-card)',
              background: 'rgba(15, 23, 42, 0.7)',
              color: '#fff',
              fontFamily: 'var(--font-ar)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            🔍
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          )}
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          عرض <strong style={{ color: '#fff' }}>{filteredUnits.length}</strong> من أصل 12 وحدة
        </div>
      </div>

      {/* UNITS ACCORDION / LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        {filteredUnits.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '50px 20px' }}>
            <span style={{ fontSize: '42px', display: 'block', marginBottom: '12px' }}>🔍</span>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>لم يتم العثور على نتائج تطابق بحثك</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>جرب البحث بكلمات أخرى أو اختر مرحلة تعليمية مختلفة</p>
            <button
              onClick={() => { setSelectedStage('all'); setSearchQuery(''); }}
              className="btn btn-primary"
              style={{ padding: '8px 20px', fontSize: '13px' }}
            >
              عرض جميع المراحل والوحدات
            </button>
          </div>
        ) : (
          filteredUnits.map((unit) => {
            const isExpanded = expandedUnit === unit.id;

            return (
              <div
                key={unit.id}
                className="glass-card"
                style={{
                  padding: '0',
                  overflow: 'hidden',
                  borderColor: unit.completed
                    ? 'rgba(16, 185, 129, 0.4)'
                    : isExpanded
                    ? 'rgba(99, 102, 241, 0.5)'
                    : 'var(--border-card)',
                  transition: 'all 0.25s'
                }}
              >
                {/* Unit Header Bar */}
                <div
                  onClick={() => toggleUnit(unit.id)}
                  style={{
                    padding: '22px 28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isExpanded ? 'rgba(79, 70, 229, 0.09)' : 'transparent',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '280px' }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      background: unit.completed
                        ? 'linear-gradient(135deg, #059669, #10b981)'
                        : isExpanded
                        ? 'linear-gradient(135deg, #4f46e5, #06b6d4)'
                        : 'rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      flexShrink: 0,
                      boxShadow: isExpanded ? '0 4px 15px rgba(79, 70, 229, 0.3)' : 'none'
                    }}>
                      {unit.icon}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          background: unit.stageId === 'calculus'
                            ? 'rgba(236, 72, 153, 0.2)'
                            : unit.stageId === 'high'
                            ? 'rgba(168, 85, 247, 0.2)'
                            : unit.stageId === 'middle'
                            ? 'rgba(56, 189, 248, 0.2)'
                            : 'rgba(16, 185, 129, 0.2)',
                          color: unit.stageId === 'calculus'
                            ? '#f472b6'
                            : unit.stageId === 'high'
                            ? '#c084fc'
                            : unit.stageId === 'middle'
                            ? '#38bdf8'
                            : '#34d399'
                        }}>
                          {unit.stageName}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          • {unit.grade}
                        </span>
                        {unit.formulaPreview && (
                          <span style={{
                            fontSize: '11px',
                            fontFamily: 'monospace',
                            direction: 'ltr',
                            background: 'rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            color: '#93c5fd'
                          }}>
                            {unit.formulaPreview}
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
                        {unit.title}
                      </h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '650px' }}>
                        {unit.desc}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {/* Progress bar */}
                    <div style={{ width: '150px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <span>الإنجاز</span>
                        <span style={{ fontWeight: '800', color: unit.progress === 100 ? '#10b981' : '#fff' }}>{unit.progress}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${unit.progress}%`,
                          height: '100%',
                          background: unit.progress === 100 ? '#10b981' : 'linear-gradient(90deg, #4f46e5, #06b6d4)'
                        }} />
                      </div>
                    </div>

                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '12px'
                    }}>
                      {isExpanded ? '▲' : '▼'}
                    </div>
                  </div>
                </div>

                {/* Collapsible Lessons */}
                {isExpanded && (
                  <div style={{ padding: '24px 28px', borderTop: '1px solid var(--border-card)', background: 'rgba(0, 0, 0, 0.22)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                        محتويات المقرر ({unit.lessons.length} دروس تفاعلية مجهزة):
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        المرحلة: <strong style={{ color: '#fff' }}>{unit.stageName}</strong> ({unit.grade})
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {unit.lessons.map(lesson => {
                        const isLocked = lesson.status === 'locked';
                        const isDone = lesson.status === 'completed';
                        const diffStyle = getDifficultyBadge(lesson.difficulty);

                        return (
                          <div
                            key={lesson.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '16px 20px',
                              background: isLocked ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid var(--border-card)',
                              borderRadius: '14px',
                              opacity: isLocked ? 0.65 : 1,
                              flexWrap: 'wrap',
                              gap: '12px',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '260px' }}>
                              <span style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                background: isDone
                                  ? '#10b981'
                                  : isLocked
                                  ? 'rgba(255,255,255,0.06)'
                                  : 'linear-gradient(135deg, #f59e0b, #ef4444)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                color: '#fff',
                                flexShrink: 0
                              }}>
                                {isDone ? '✓' : isLocked ? '🔒' : '▶'}
                              </span>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
                                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>
                                    {lesson.title}
                                  </span>
                                  {lesson.difficulty && (
                                    <span style={{
                                      fontSize: '10px',
                                      fontWeight: '700',
                                      padding: '2px 8px',
                                      borderRadius: '8px',
                                      background: diffStyle.bg,
                                      color: diffStyle.color,
                                      border: `1px solid ${diffStyle.border}`
                                    }}>
                                      {lesson.difficulty}
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                  مدة الشرح: {lesson.duration} • نقاط الخبرة: +{lesson.xp} XP • {isDone ? 'مكتمل بنجاح' : isLocked ? 'يتطلب إكمال السابق' : 'قيد التدريب'}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => setActiveVideoModal({ ...lesson, unitTitle: unit.title, stageName: unit.stageName })}
                                disabled={isLocked}
                                style={{
                                  padding: '8px 14px',
                                  background: 'rgba(255, 255, 255, 0.08)',
                                  border: '1px solid var(--border-card)',
                                  borderRadius: '10px',
                                  color: '#fff',
                                  cursor: isLocked ? 'not-allowed' : 'pointer',
                                  fontSize: '12px',
                                  fontFamily: 'var(--font-ar)',
                                  fontWeight: '600'
                                }}
                              >
                                الشرح المرئي 🎬
                              </button>

                              <button
                                onClick={() => handleStartLesson(lesson, unit)}
                                disabled={isLocked}
                                className={`btn ${isDone ? 'btn-secondary' : 'btn-primary'}`}
                                style={{ padding: '8px 18px', fontSize: '12px' }}
                              >
                                {isDone ? 'مراجعة التمارين' : 'حل المسائل التفاعلية ✍️'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Video Lesson Modal */}
      {activeVideoModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.98)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '680px',
            padding: '30px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.7)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '6px' }}>{activeVideoModal.stageName}</span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>
                  {activeVideoModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '18px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* Video Preview Simulation Box */}
            <div style={{
              width: '100%',
              height: '300px',
              background: 'radial-gradient(circle at center, #0f172a, #040711)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              border: '1px solid var(--border-card)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0,0,0,0.6)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#38bdf8'
              }}>
                ⏱️ المدة: {activeVideoModal.duration} • +{activeVideoModal.xp} XP
              </div>

              <div style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                cursor: 'pointer',
                boxShadow: '0 0 35px rgba(79, 70, 229, 0.7)',
                color: '#fff',
                transition: 'transform 0.2s'
              }}>
                ▶
              </div>
              <div style={{ marginTop: '16px', fontSize: '14px', fontWeight: '700', color: '#fff' }}>
                شرح تفاعلي بالخطوات والرسوم المتحركة
              </div>
              <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                جودة فائقة HD 1080p مدعوم بالذكاء الاصطناعي لتوضيح المفاهيم
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setActiveVideoModal(null);
                  setCurrentScreen('09');
                  showToast(`بدء حل مسائل درس: ${activeVideoModal.title}`, 'success');
                }}
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px' }}
              >
                الانتقال للتمارين ومسائل الدرس الآن ✍️
              </button>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="btn btn-secondary"
                style={{ padding: '12px 20px' }}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

