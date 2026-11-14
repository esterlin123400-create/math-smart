import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { mockCurriculumUnits } from '../data/mockData';
import { readStorageJson, writeStorageJson } from '../utils/platformHelpers';
import { playSuccessChime } from '../utils/soundEffects';

const applySavedStatuses = (baseUnits, savedStatuses) => {
  return baseUnits.map(unit => {
    const updatedLessons = unit.lessons.map(lesson => ({
      ...lesson,
      status: savedStatuses[lesson.id] || lesson.status
    }));
    const doneCount = updatedLessons.filter(l => l.status === 'completed').length;
    const progress = Math.round((doneCount / updatedLessons.length) * 100);
    return {
      ...unit,
      lessons: updatedLessons,
      progress,
      completed: doneCount === updatedLessons.length
    };
  });
};

export const CurriculumAndUnits = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { user, updateProfile } = useAuth();
  const [selectedStage, setSelectedStage] = useState('all'); // 'all' | 'elementary' | 'middle' | 'high' | 'calculus'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUnit, setExpandedUnit] = useState(9); // Default expanded to Calculus Unit 9 or first
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [lessonStatuses, setLessonStatuses] = useState(() => readStorageJson('math_smart_curriculum_progress_v1', {}));

  useEffect(() => {
    writeStorageJson('math_smart_curriculum_progress_v1', lessonStatuses);
  }, [lessonStatuses]);

  const units = useMemo(() => applySavedStatuses(mockCurriculumUnits, lessonStatuses), [lessonStatuses]);

  const stagesList = [
    { id: 'all', name: 'جميع المراحل', icon: '🌐', count: 12 },
    { id: 'elementary', name: 'المرحلة الابتدائية', icon: '🌱', count: 3, desc: 'التأسيس والعمليات والكسور' },
    { id: 'middle', name: 'المرحلة المتوسطة', icon: '🌿', count: 3, desc: 'الجبر الخطي وفيثاغورس والدوال' },
    { id: 'high', name: 'المرحلة الثانوية', icon: '🏛️', count: 2, desc: 'المصفوفات والمتجهات والمثلثات' },
    { id: 'calculus', name: 'مرحلة التفاضل والتكامل', icon: '∫', count: 4, desc: 'النهايات، الاشتقاق، التكامل والمعادلات' }
  ];

  // Filter units by stage and search query
  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
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
  }, [units, selectedStage, searchQuery]);

  // Overall stats
  const totalLessons = units.reduce((acc, u) => acc + u.lessons.length, 0);
  const totalXp = units.reduce((acc, u) => acc + u.lessons.reduce((lacc, l) => lacc + l.xp, 0), 0);
  const completedLessons = units.reduce((acc, u) => acc + u.lessons.filter(l => l.status === 'completed').length, 0);
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  const toggleUnit = (id) => {
    setExpandedUnit(expandedUnit === id ? null : id);
  };

  const handleCompleteLesson = async (lesson, unit) => {
    if (lesson.status === 'locked') {
      showToast('هذا الدرس مغلق حالياً، أكمل الدروس السابقة أولاً!', 'warning');
      return;
    }
    if (lesson.status === 'completed') {
      showToast('هذا الدرس مكتمل وموثق بالفعل!', 'info');
      return;
    }

    const nextStatuses = { ...lessonStatuses, [lesson.id]: 'completed' };
    const lessonIdx = unit.lessons.findIndex(l => l.id === lesson.id);
    if (lessonIdx !== -1 && unit.lessons[lessonIdx + 1]?.status === 'locked') {
      nextStatuses[unit.lessons[lessonIdx + 1].id] = 'in-progress';
    }
    setLessonStatuses(nextStatuses);
    await updateProfile({ xp: (user?.xp || 0) + lesson.xp });
    playSuccessChime();
    showToast(`🎉 تم إتمام درس "${lesson.title}" وحصلت على +${lesson.xp} XP!`, 'success');
    if (activeVideoModal?.id === lesson.id) {
      setActiveVideoModal(prev => (prev ? { ...prev, status: 'completed' } : null));
    }
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
          type="button"
          onClick={() => setCurrentScreen('hub')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
        >
          ← العودة لمعرض الواجهات
        </button>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setCurrentScreen('06')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              background: 'rgba(99, 102, 241, 0.12)',
              color: '#6366f1',
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
            <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-heading)' }}>12 وحدة كاملة</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '28px', background: 'rgba(6, 182, 212, 0.15)', padding: '10px', borderRadius: '12px' }}>🎯</div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>إجمالي الدروس التفاعلية</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#0284c7' }}>{totalLessons} درساً مشروحاً</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '28px', background: 'rgba(245, 158, 11, 0.15)', padding: '10px', borderRadius: '12px' }}>⚡</div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>نقاط الخبرة القابلة للتحصيل</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#d97706' }}>+{totalXp} XP</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '28px', background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '12px' }}>🏆</div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>نسبة إنجاز المنهج الكلي</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#059669' }}>{overallProgress}% مكتمل</div>
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
              type="button"
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
                  ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.22), rgba(6, 182, 212, 0.16))'
                  : 'var(--bg-card)',
                color: isActive ? 'var(--text-heading)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-ar)',
                fontSize: '14px',
                fontWeight: '700',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 4px 20px rgba(99, 102, 241, 0.25)' : 'none'
              }}
            >
              <span style={{ fontSize: '18px' }}>{st.icon}</span>
              <span>{st.name}</span>
              <span style={{
                background: isActive ? '#4f46e5' : 'var(--bg-subtle-strong)',
                color: isActive ? '#fff' : 'var(--text-body)',
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
        <div style={{ position: 'relative', flex: 1, minWidth: 'min(100%, 240px)' }}>
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
              background: 'var(--bg-input)',
              color: 'var(--text-heading)',
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
              type="button"
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
          عرض <strong style={{ color: 'var(--text-heading)' }}>{filteredUnits.length}</strong> من أصل 12 وحدة
        </div>
      </div>

      {/* UNITS ACCORDION / LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        {filteredUnits.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '50px 20px' }}>
            <span style={{ fontSize: '42px', display: 'block', marginBottom: '12px' }}>🔍</span>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '8px' }}>لم يتم العثور على نتائج تطابق بحثك</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>جرب البحث بكلمات أخرى أو اختر مرحلة تعليمية مختلفة</p>
            <button
              type="button"
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
                    background: isExpanded ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 'min(100%, 240px)' }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      background: unit.completed
                        ? 'linear-gradient(135deg, #059669, #10b981)'
                        : isExpanded
                        ? 'linear-gradient(135deg, #4f46e5, #06b6d4)'
                        : 'var(--bg-subtle-strong)',
                      color: (unit.completed || isExpanded) ? '#fff' : 'var(--text-heading)',
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
                            ? 'rgba(236, 72, 153, 0.16)'
                            : unit.stageId === 'high'
                            ? 'rgba(168, 85, 247, 0.16)'
                            : unit.stageId === 'middle'
                            ? 'rgba(56, 189, 248, 0.16)'
                            : 'rgba(16, 185, 129, 0.16)',
                          color: unit.stageId === 'calculus'
                            ? '#ec4899'
                            : unit.stageId === 'high'
                            ? '#9333ea'
                            : unit.stageId === 'middle'
                            ? '#0284c7'
                            : '#059669'
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
                            background: 'var(--bg-inset)',
                            border: '1px solid var(--border-card)',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            color: '#6366f1'
                          }}>
                            {unit.formulaPreview}
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '4px' }}>
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
                        <span style={{ fontWeight: '800', color: unit.progress === 100 ? '#10b981' : 'var(--text-heading)' }}>{unit.progress}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--bg-subtle-strong)', borderRadius: '3px', overflow: 'hidden' }}>
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
                      background: 'var(--bg-subtle)',
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
                  <div style={{ padding: '24px 28px', borderTop: '1px solid var(--border-card)', background: 'var(--bg-inset)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-heading)' }}>
                        محتويات المقرر ({unit.lessons.length} دروس تفاعلية مجهزة):
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        المرحلة: <strong style={{ color: 'var(--text-heading)' }}>{unit.stageName}</strong> ({unit.grade})
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
                              background: isLocked ? 'var(--bg-subtle)' : 'var(--bg-card)',
                              border: '1px solid var(--border-card)',
                              borderRadius: '14px',
                              opacity: isLocked ? 0.65 : 1,
                              flexWrap: 'wrap',
                              gap: '12px',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 'min(100%, 240px)' }}>
                              <span style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                background: isDone
                                  ? '#10b981'
                                  : isLocked
                                  ? 'var(--bg-subtle-strong)'
                                  : 'linear-gradient(135deg, #f59e0b, #ef4444)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                color: isLocked ? 'var(--text-muted)' : '#fff',
                                flexShrink: 0
                              }}>
                                {isDone ? '✓' : isLocked ? '🔒' : '▶'}
                              </span>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
                                  <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-heading)' }}>
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

                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsPlayingPreview(false);
                                  setActiveVideoModal({
                                    ...lesson,
                                    unitId: unit.id,
                                    unitTitle: unit.title,
                                    unitRef: unit,
                                    formulaPreview: unit.formulaPreview,
                                    stageName: unit.stageName
                                  });
                                }}
                                disabled={isLocked}
                                style={{
                                  padding: '8px 14px',
                                  background: 'var(--bg-subtle)',
                                  border: '1px solid var(--border-card)',
                                  borderRadius: '10px',
                                  color: 'var(--text-heading)',
                                  cursor: isLocked ? 'not-allowed' : 'pointer',
                                  fontSize: '12px',
                                  fontFamily: 'var(--font-ar)',
                                  fontWeight: '600'
                                }}
                              >
                                الشرح المرئي 🎬
                              </button>

                              <button
                                type="button"
                                onClick={() => handleStartLesson(lesson, unit)}
                                disabled={isLocked}
                                className={`btn ${isDone ? 'btn-secondary' : 'btn-primary'}`}
                                style={{ padding: '8px 18px', fontSize: '12px' }}
                              >
                                {isDone ? 'مراجعة التمارين' : 'حل المسائل التفاعلية ✍️'}
                              </button>

                              {!isLocked && !isDone && (
                                <button
                                  type="button"
                                  onClick={() => handleCompleteLesson(lesson, unit)}
                                  className="btn btn-success"
                                  style={{ padding: '8px 14px', fontSize: '12px' }}
                                >
                                  ✓ إتمام الدرس
                                </button>
                              )}
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
            background: 'var(--bg-modal)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '680px',
            padding: '30px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.45)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '6px' }}>{activeVideoModal.stageName}</span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-heading)' }}>
                  {activeVideoModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                style={{
                  background: 'var(--bg-subtle)',
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

              {!isPlayingPreview ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsPlayingPreview(true)}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '30px',
                      cursor: 'pointer',
                      boxShadow: '0 0 35px rgba(79, 70, 229, 0.7)',
                      color: '#fff',
                      transition: 'transform 0.2s'
                    }}
                    title="تشغيل الشرح التفاعلي"
                  >
                    ▶
                  </button>
                  <div style={{ marginTop: '16px', fontSize: '14px', fontWeight: '700', color: '#fff' }}>
                    شرح تفاعلي بالخطوات والرسوم المتحركة
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#94a3b8' }}>
                    انقر على زر التشغيل لعرض خطوات الشرح المفهومي للدرس
                  </div>
                </>
              ) : (
                <div style={{ padding: '24px', textAlign: 'right', width: '100%', maxWidth: '560px', color: '#e2e8f0' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#38bdf8', marginBottom: '10px' }}>
                    📖 ملخص الشرح التفاعلي — {activeVideoModal.unitTitle}
                  </div>
                  {activeVideoModal.formulaPreview && (
                    <div style={{
                      background: 'rgba(79, 70, 229, 0.25)',
                      border: '1px solid rgba(99, 102, 241, 0.45)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      fontFamily: 'monospace',
                      direction: 'ltr',
                      textAlign: 'center',
                      fontSize: '15px',
                      color: '#fff',
                      marginBottom: '12px'
                    }}>
                      {activeVideoModal.formulaPreview}
                    </div>
                  )}
                  <ol style={{ paddingRight: '20px', fontSize: '13px', lineHeight: 1.8, marginBottom: '14px' }}>
                    <li>استيعاب القاعدة الأساسية للدرس والمصطلحات الرياضية المرتبطة بها.</li>
                    <li>تطبيق مثال محلول خطوة بخطوة مع التحقق من صحة الناتج النهائي.</li>
                    <li>الانتقال لحل المسائل التفاعلية في المختبر الذكي لترسيخ المهارة.</li>
                  </ol>
                  <button
                    type="button"
                    onClick={() => setIsPlayingPreview(false)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '12px' }}
                  >
                    إيقاف المعاينة ⏸
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
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
              {activeVideoModal.status !== 'completed' && activeVideoModal.unitRef && (
                <button
                  type="button"
                  onClick={() => handleCompleteLesson(activeVideoModal, activeVideoModal.unitRef)}
                  className="btn btn-success"
                  style={{ padding: '12px 18px' }}
                >
                  ✓ إتمام الدرس (+{activeVideoModal.xp} XP)
                </button>
              )}
              <button
                type="button"
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

