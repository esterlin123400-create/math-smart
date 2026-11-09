import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { mockQuestionsResult } from '../data/mockData';
import { generateSmartAssessmentFeedback } from '../services/aiService';
import { saveQuizResult } from '../services/dbService';

export const SmartAssessmentResult = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { user } = useAuth();
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const data = mockQuestionsResult;
  const [aiFeedback, setAiFeedback] = useState(data.aiFeedback);
  const [aiLoading, setAiLoading] = useState(false);
  const [savingResult, setSavingResult] = useState(false);

  const toggleQuestion = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const handleRefreshAiReport = async () => {
    setAiLoading(true);
    const res = await generateSmartAssessmentFeedback({
      examTitle: data.examTitle,
      grade: data.grade,
      score: data.score,
      correctCount: data.correctAnswers,
      totalQuestions: data.totalQuestions,
      duration: data.duration
    });
    setAiLoading(false);
    if (res.success) {
      setAiFeedback({
        summary: res.summary,
        strengths: res.strengths || data.aiFeedback.strengths,
        recommendation: Array.isArray(res.recommendations)
          ? res.recommendations.join(' • ')
          : res.recommendations || data.aiFeedback.recommendation
      });
      showToast(
        res.isLiveAi ? 'تم توليد تحليل جديد عبر Gemini 2.5 Flash!' : 'تم تحديث التقرير التشخيصي الذكي بنجاح!',
        'success'
      );
    }
  };

  const handleSaveToCloud = async () => {
    setSavingResult(true);
    const res = await saveQuizResult({
      studentId: user?.id || 'demo-student',
      examTitle: data.examTitle,
      grade: data.grade,
      score: data.score,
      totalQuestions: data.totalQuestions,
      correctAnswers: data.correctAnswers,
      earnedXp: data.earnedXp,
      duration: data.duration,
      aiFeedback
    });
    setSavingResult(false);
    if (res.success) {
      showToast(
        res.mode === 'demo' ? 'تم حفظ النتيجة محلياً في سجل الأداء!' : 'تم توثيق النتيجة وإضافة الـ XP في سحابة Supabase!',
        'success'
      );
    }
  };

  return (
    <div>
      {/* Header breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setCurrentScreen('hub')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ← العودة لمعرض الواجهات
        </button>
        <span className="badge badge-success">01 التقييم ومراجعة الحل</span>
      </div>

      {/* SCORE HERO */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95))',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-card)',
        borderRadius: '28px',
        padding: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #10b981, #3b82f6, #a855f7)'
        }} />

        {/* Trophy Mascot */}
        <div style={{ width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/assets/trophy_genius.svg"
            alt="Trophy"
            style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 25px rgba(245, 158, 11, 0.45))' }}
          />
        </div>

        {/* Main Score Details */}
        <div style={{ textAlign: 'center', maxWidth: '380px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '10px' }}>
            تقييم ذكي فوري بالذكاء الاصطناعي
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', marginBottom: '8px' }}>
            {data.examTitle}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
            {data.grade} • وقت الإنجاز: {data.duration}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '38px', fontWeight: '900', color: '#10b981', fontFamily: 'var(--font-en)' }}>
                {data.score}%
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>درجة الإتقان</div>
            </div>
            <div style={{ borderRight: '1px solid var(--border-card)', paddingRight: '20px' }}>
              <div style={{ fontSize: '38px', fontWeight: '900', color: '#fbbf24', fontFamily: 'var(--font-en)' }}>
                +{data.earnedXp}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>نقاط خبرة XP</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => {
              setCurrentScreen('09');
              showToast('جاري بدء تدريب جديد لحل المسائل...', 'info');
            }}
            className="btn btn-primary"
            style={{ padding: '12px 24px' }}
          >
            🚀 إعادة الاختبار وتحدي جديد
          </button>
          <button
            onClick={handleSaveToCloud}
            disabled={savingResult}
            className="btn btn-success"
            style={{ padding: '12px 24px' }}
          >
            {savingResult ? 'جاري الحفظ...' : '💾 حفظ النتيجة في السجل'}
          </button>
          <button
            onClick={() => showToast('تم تنزيل شهادة الإتقان والتقرير بصيغة PDF بنجاح!', 'success')}
            className="btn btn-secondary"
            style={{ padding: '12px 24px' }}
          >
            📥 تحميل الشهادة والتقرير
          </button>
        </div>
      </div>

      {/* AI FEEDBACK ANALYSIS CARD */}
      <div className="glass-card" style={{ marginBottom: '32px', borderColor: 'rgba(99, 102, 241, 0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🤖
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>
                تقرير وتحليل المرشد الذكي (Math AI Tutor)
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                تحليل دقيق لنقاط القوة والمسائل التي تحتاج تعزيزاً
              </p>
            </div>
          </div>

          <button
            onClick={handleRefreshAiReport}
            disabled={aiLoading}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '12px', borderColor: '#818cf8', color: '#818cf8' }}
          >
            {aiLoading ? 'جاري التوليد...' : '🔄 تحديث التحليل الذكي'}
          </button>
        </div>

        <p style={{ fontSize: '14px', lineHeight: 1.8, marginBottom: '18px', color: 'var(--text-body)' }}>
          {aiFeedback.summary}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#34d399', marginBottom: '8px' }}>
              🌟 نقاط القوة المكتشفة:
            </div>
            <ul style={{ paddingRight: '20px', fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.7 }}>
              {aiFeedback.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '16px', borderRadius: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#fbbf24', marginBottom: '8px' }}>
              💡 الخطة التدريبية الموصى بها:
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.7 }}>
              {aiFeedback.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* QUESTIONS REVIEW BREAKDOWN */}
      <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '18px' }}>
        مراجعة وتفصيل إجابات المسائل (5 مسائل)
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {data.questions.map((q) => {
          const isCorrect = q.status === 'correct';
          const isExpanded = expandedQuestion === q.id;

          return (
            <div
              key={q.id}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.2s'
              }}
            >
              {/* Question Bar Header */}
              <div
                onClick={() => toggleQuestion(q.id)}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: isCorrect ? 'rgba(16, 185, 129, 0.04)' : 'rgba(239, 68, 68, 0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isCorrect ? '#10b981' : '#ef4444',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '14px'
                  }}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>
                      مسألة {q.id}: {q.text}
                    </div>
                    <div style={{ fontSize: '12px', color: isCorrect ? '#34d399' : '#f87171' }}>
                      إجابتك: {q.userAnswer} {isCorrect ? '(صحيحة + ' + q.xp + ' XP)' : '(غير صحيحة)'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {isExpanded ? 'إخفاء الخطوات ▲' : 'عرض خطوات الحل ▼'}
                  </span>
                </div>
              </div>

              {/* Collapsible Steps */}
              {isExpanded && (
                <div style={{ padding: '20px', borderTop: '1px solid var(--border-card)', background: 'rgba(0, 0, 0, 0.2)' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#38bdf8', marginBottom: '10px' }}>
                    📐 خطوات الحل النموذجية وتوضيح المرشد:
                  </div>
                  <ol style={{ paddingRight: '22px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-body)' }}>
                    {q.steps.map((st, sIdx) => (
                      <li key={sIdx}>{st}</li>
                    ))}
                  </ol>
                  <div style={{ marginTop: '14px', fontSize: '13px', fontWeight: '800', color: '#10b981' }}>
                    الإجابة الصحيحة المعتمدة: {q.correctAnswer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
