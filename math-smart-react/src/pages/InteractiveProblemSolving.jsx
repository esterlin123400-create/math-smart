import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { MathKeypad } from '../components/MathKeypad';
import { ScratchpadCanvas } from '../components/ScratchpadCanvas';
import { analyzeMathStep, askMathTutor, isGeminiConfigured } from '../services/aiService';
import { addStudentXP } from '../services/dbService';

export const InteractiveProblemSolving = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { user } = useAuth();
  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  const [equationInput, setEquationInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [solvedList, setSolvedList] = useState({}); // { 0: true, 1: true, ... }
  const [totalXpEarned, setTotalXpEarned] = useState(0);

  // AI States
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [showTutorModal, setShowTutorModal] = useState(false);
  const [tutorQuestion, setTutorQuestion] = useState('');
  const [tutorResponse, setTutorResponse] = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);

  const problems = [
    {
      id: 1,
      stage: 'المرحلة الابتدائية / المتوسطة',
      topic: 'الجبر والمعادلات بميزان الكتل',
      title: 'حل معادلات الدرجة الأولى بميزان الكتل الجبري',
      question: 'أمامك ميزان في حالة اتزان تام. الكفة اليمنى تحتوي على كتلتين مجهولتين (2س) ومكعبين وزنهما 4 كجم، والكفة اليسرى تحتوي على كتلة قدرها 14 كجم. احسب قيمة الكتلة المجهولة س:',
      equation: '2س + 4 = 14',
      xp: 80,
      diagram: '/assets/math_algebra_balance_diagram.svg',
      hintText: 'الخطوة 1: اطرح 4 كجم من كلا طرفي الميزان للحفاظ على الاتزان (2س = 10)، ثم اقسم على 2 لإيجاد وزن س الواحدة (س = 5)!',
      correctAnswers: ['5', 'س=5', 'س = 5', 'x=5', 'x = 5'],
      unit: 'كجم'
    },
    {
      id: 2,
      stage: 'المرحلة المتوسطة',
      topic: 'الهندسة ونظرية فيثاغورس',
      title: 'حساب طول الوتر في المثلث قائم الزاوية',
      question: 'مثلث قائم الزاوية طولا ضلعي القائمة هما 3 سم و 4 سم. باستخدام نظرية فيثاغورس (أ² + ب² = ج²)، احسب طول الوتر المجهول (س):',
      equation: '3² + 4² = س²',
      xp: 90,
      diagram: null,
      hintText: '3² = 9 ، و 4² = 16. إذن: 9 + 16 = 25. والجذر التربيعي لـ 25 هو: √25 = 5 سم!',
      correctAnswers: ['5', 'س=5', 'س = 5', '5 سم', 'x=5'],
      unit: 'سم'
    },
    {
      id: 3,
      stage: 'المرحلة الابتدائية / المتوسطة',
      topic: 'النسبة المئوية والتطبيقات المالية',
      title: 'حساب قيمة الخصم والسعر النهائي',
      question: 'حقيبة مدرسية سعرها الأصلي 200 ريال، أُعلن عن تخفيض بنسبة 25%. احسب السعر الجديد للحقيبة بعد تطبيق الخصم:',
      equation: 'السعر = 200 - (200 × 25%)',
      xp: 75,
      diagram: null,
      hintText: 'قيمة الخصم = 200 × 0.25 = 50 ريالاً. إذن السعر الجديد = 200 - 50 = 150 ريالاً!',
      correctAnswers: ['150', '150 ريال', '150 ر.س', 'س = 150'],
      unit: 'ريال'
    },
    {
      id: 4,
      stage: 'المرحلة الثانوية / التفاضل والتكامل',
      topic: 'قواعد الاشتقاق والميل',
      title: 'إيجاد مشتقة الدالة عند نقطة محددة',
      question: 'لتكن الدالة د(س) = 3س² + 5س - 8. أوجد قيمة المشتقة الأولى د\'(س) عند القيمة س = 2:',
      equation: 'د\'(س) = 6س + 5 ، احسب د\'(2)',
      xp: 100,
      diagram: null,
      hintText: 'مشتقة 3س² هي 6س، ومشتقة 5س هي 5. نعوض س=2: د\'(2) = 6(2) + 5 = 12 + 5 = 17!',
      correctAnswers: ['17', '17.0', 'د\'(2)=17', 'د\'=17'],
      unit: 'قيمة'
    },
    {
      id: 5,
      stage: 'المرحلة المتوسطة / الثانوية',
      topic: 'المعادلات التربيعية والتحليل',
      title: 'حل المعادلة التربيعية بالتحليل إلى عوامل',
      question: 'أوجد الحل الموجب الأكبر للمعادلة التربيعية التالية: س² - 5س + 6 = 0',
      equation: '(س - 2)(س - 3) = 0',
      xp: 85,
      diagram: null,
      hintText: 'بتحليل المقدار الثلاثي: حاصل ضربهما 6 ومجموعهما -5 هما (-2) و (-3). إذن س = 2 أو س = 3. والحل الأكبر هو 3!',
      correctAnswers: ['3', 'س=3', 'س = 3', 'x=3'],
      unit: 'عدد'
    }
  ];

  const currentProb = problems[currentProblemIdx];
  const isCurrentSolved = !!solvedList[currentProblemIdx];

  const handleInsertChar = (char) => {
    setEquationInput(prev => prev + char);
  };

  const handleClear = () => {
    setEquationInput('');
    setAiAnalysisResult(null);
  };

  // التحقق المباشر
  const handleCheckAnswer = () => {
    const clean = equationInput.trim().replace(/\s+/g, '');
    if (!clean) {
      showToast('يرجى كتابة إجابتك أولاً في مربع الحل!', 'warning');
      return;
    }

    if (currentProb.correctAnswers.some(ans => clean === ans.replace(/\s+/g, ''))) {
      if (!solvedList[currentProblemIdx]) {
        setSolvedList(prev => ({ ...prev, [currentProblemIdx]: true }));
        setTotalXpEarned(prev => prev + currentProb.xp);
        if (user?.id) {
          addStudentXP(user.id, currentProb.xp);
        }
        showToast(`🎉 إجابة عبقرية صحيحة! أحسنت! (+${currentProb.xp} XP)`, 'success');
      } else {
        showToast('هذه المسألة محلولة بنجاح مسبقاً!', 'info');
      }
    } else {
      showToast('الجواب غير دقيق بعد، جرب التحليل بالذكاء الاصطناعي 🤖', 'warning');
    }
  };

  // التحليل الذكي عبر Gemini
  const handleAiAnalysis = async () => {
    if (!equationInput.trim()) {
      showToast('اكتب خطوتك أو حلك أولاً ليحلله الذكاء الاصطناعي!', 'info');
      return;
    }

    setAiAnalyzing(true);
    setAiAnalysisResult(null);

    const result = await analyzeMathStep({
      problemTitle: currentProb.title,
      problemQuestion: currentProb.question,
      equation: currentProb.equation,
      studentInput: equationInput,
      correctAnswers: currentProb.correctAnswers,
      unit: currentProb.unit,
      topic: currentProb.topic,
      grade: currentProb.stage
    });

    setAiAnalyzing(false);
    setAiAnalysisResult(result);

    if (result.isCorrect && !solvedList[currentProblemIdx]) {
      setSolvedList(prev => ({ ...prev, [currentProblemIdx]: true }));
      setTotalXpEarned(prev => prev + currentProb.xp);
      if (user?.id) {
        addStudentXP(user.id, currentProb.xp);
      }
    }
  };

  // سؤال المعلم الذكي
  const handleAskTutor = async (e) => {
    e.preventDefault();
    if (!tutorQuestion.trim()) return;

    setTutorLoading(true);
    const res = await askMathTutor({
      question: tutorQuestion,
      topic: currentProb.topic,
      grade: currentProb.stage
    });
    setTutorLoading(false);
    setTutorResponse(res.answer);
  };

  const handleNextProblem = () => {
    if (currentProblemIdx < problems.length - 1) {
      setCurrentProblemIdx(prev => prev + 1);
      setEquationInput('');
      setShowHint(false);
      setAiAnalysisResult(null);
    }
  };

  const handlePrevProblem = () => {
    if (currentProblemIdx > 0) {
      setCurrentProblemIdx(prev => prev - 1);
      setEquationInput('');
      setShowHint(false);
      setAiAnalysisResult(null);
    }
  };

  const solvedCount = Object.keys(solvedList).length;

  return (
    <div>
      {/* Workspace Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(13, 18, 34, 0.9)',
        backdropFilter: 'blur(16px)',
        padding: '14px 24px',
        borderRadius: '18px',
        border: '1px solid var(--border-card)',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => setCurrentScreen('hub')}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border-card)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '700'
            }}
          >
            ← إنهاء الجلسة
          </button>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>مختبر حل المسائل التفاعلية</h2>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              المسألة {currentProblemIdx + 1} من {problems.length} • {currentProb.topic}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowTutorModal(true)}
            className="btn btn-secondary"
            style={{ padding: '6px 14px', fontSize: '12px', borderColor: '#818cf8', color: '#818cf8' }}
          >
            💬 اسأل المعلم الذكي
          </button>
          <span className="badge badge-warning">⭐ {totalXpEarned} XP</span>
          <span className="badge badge-success">✓ {solvedCount} من {problems.length} منجزة</span>
          <span className="badge badge-cyan">
            {isGeminiConfigured ? '⚡ Gemini 2.5 نشط' : '🤖 ذكاء اصطناعي محلي'}
          </span>
        </div>
      </div>

      {/* PROBLEM SELECTOR TABS */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {problems.map((prob, idx) => {
          const isSelected = currentProblemIdx === idx;
          const isSolved = !!solvedList[idx];
          return (
            <button
              key={prob.id}
              onClick={() => {
                setCurrentProblemIdx(idx);
                setEquationInput('');
                setShowHint(false);
                setAiAnalysisResult(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                border: isSelected ? '1px solid #4f46e5' : '1px solid var(--border-card)',
                background: isSelected ? 'rgba(79, 70, 229, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                color: isSelected ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
            >
              <span>{isSolved ? '✅' : `0${idx + 1}`}</span>
              <span>{prob.title.slice(0, 22)}...</span>
            </button>
          );
        })}
      </div>

      {/* TWO COLUMN WORKSPACE: LEFT PROBLEM/KEYPAD + RIGHT SCRATCHPAD */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Column: Problem Details, Inputs, and Virtual Keypad */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Problem Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="badge badge-primary">{currentProb.stage}</span>
              <span className="badge badge-warning">+{currentProb.xp} XP</span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', marginBottom: '10px' }}>
              {currentProb.title}
            </h3>

            <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-body)', marginBottom: '16px' }}>
              {currentProb.question}
            </p>

            {/* If diagram exists */}
            {currentProb.diagram && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '16px',
                borderRadius: '16px',
                textAlign: 'center',
                marginBottom: '16px',
                border: '1px solid var(--border-card)'
              }}>
                <img
                  src={currentProb.diagram}
                  alt="مخطط المسألة"
                  style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain' }}
                />
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  ميزان كتل جبري تفاعلي: الكفة اليمنى (2س + 4) = الكفة اليسرى (14)
                </div>
              </div>
            )}

            {/* Mathematical Equation Display */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(6, 182, 212, 0.1))',
              border: '1px solid rgba(79, 70, 229, 0.3)',
              borderRadius: '14px',
              padding: '12px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>المعادلة الأساسية:</span>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#38bdf8', direction: 'ltr', textAlign: 'right' }}>
                  {currentProb.equation}
                </div>
              </div>
              <span className="badge badge-cyan">{currentProb.unit ? `الوحدة: ${currentProb.unit}` : 'معادلة'}</span>
            </div>

            {/* Student Answer Input Box */}
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">اكتب الحل أو القيمة النهائية للمجهول (س):</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={equationInput}
                  onChange={(e) => setEquationInput(e.target.value)}
                  placeholder="مثال: 5 أو س = 5"
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    fontSize: '18px',
                    fontWeight: '800',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: isCurrentSolved ? '2px solid #10b981' : '1px solid var(--border-card)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontFamily: 'var(--font-en), var(--font-ar)',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    padding: '0 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-card)',
                    borderRadius: '12px',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                  title="مسح الحقل"
                >
                  مسح
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={handleCheckAnswer}
                className="btn btn-success"
                style={{ flex: 1.5, minWidth: '130px', padding: '12px', fontSize: '14px' }}
              >
                {isCurrentSolved ? '✓ إجابة معتمدة ومبرهنة!' : 'التحقق من الحل 🔍'}
              </button>

              <button
                onClick={handleAiAnalysis}
                disabled={aiAnalyzing}
                className="btn btn-primary"
                style={{
                  flex: 1.5,
                  minWidth: '140px',
                  padding: '12px',
                  fontSize: '14px',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  borderColor: '#a855f7'
                }}
              >
                {aiAnalyzing ? 'جاري الفحص بالذكاء الاصطناعي...' : 'تحليل الخطوة بالـ AI 🤖'}
              </button>

              <button
                onClick={() => setShowHint(!showHint)}
                className="btn btn-secondary"
                style={{ flex: 1, minWidth: '80px', padding: '12px', fontSize: '13px', color: '#fbbf24' }}
              >
                {showHint ? 'إخفاء' : 'تلميح 💡'}
              </button>
            </div>

            {/* AI Analysis Result Drawer */}
            {aiAnalysisResult && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                background: aiAnalysisResult.isCorrect
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'rgba(239, 68, 68, 0.12)',
                border: aiAnalysisResult.isCorrect
                  ? '1px solid rgba(16, 185, 129, 0.4)'
                  : '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '14px',
                fontSize: '13px',
                lineHeight: 1.7
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '800', color: aiAnalysisResult.isCorrect ? '#34d399' : '#f87171' }}>
                    {aiAnalysisResult.isCorrect ? '✅ تقييم المعلم الذكي: صائب!' : '⚠️ توجيه المعلم الذكي:'}
                  </div>
                  <span className="badge badge-cyan" style={{ fontSize: '10px' }}>
                    {aiAnalysisResult.isLiveAi ? 'Gemini 2.5 Flash' : 'Math AI Engine'}
                  </span>
                </div>
                <div style={{ color: '#fff', marginBottom: '6px' }}>{aiAnalysisResult.feedback}</div>
                {aiAnalysisResult.hint && (
                  <div style={{ color: '#fbbf24', fontSize: '12px', marginTop: '4px' }}>
                    💡 <strong>تلميح:</strong> {aiAnalysisResult.hint}
                  </div>
                )}
                {aiAnalysisResult.encouragement && (
                  <div style={{ color: '#38bdf8', fontSize: '12px', marginTop: '6px', fontStyle: 'italic' }}>
                    {aiAnalysisResult.encouragement}
                  </div>
                )}
              </div>
            )}

            {showHint && (
              <div style={{
                marginTop: '16px',
                padding: '14px',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                fontSize: '13px',
                lineHeight: 1.6,
                color: '#fbbf24'
              }}>
                {currentProb.hintText}
              </div>
            )}

            {isCurrentSolved && (
              <div style={{
                marginTop: '20px',
                padding: '18px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
                border: '1px solid #10b981',
                borderRadius: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>🏆 عبقري! أحسنت!</div>
                <div style={{ fontSize: '13px', color: '#fff', marginBottom: '14px' }}>
                  لقد حصلت على +{currentProb.xp} نقطة XP لهذه المسألة!
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {currentProblemIdx < problems.length - 1 ? (
                    <button
                      onClick={handleNextProblem}
                      className="btn btn-primary"
                      style={{ padding: '8px 20px', fontSize: '13px' }}
                    >
                      المسألة التالية ⬅️
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setCurrentScreen('01');
                        showToast('تهانينا على إكمال جميع المسائل! جاري فتح التقييم الذكي...', 'success');
                      }}
                      className="btn btn-primary"
                      style={{ padding: '8px 20px', fontSize: '13px' }}
                    >
                      استعراض بطاقة التقييم الذكي 📊
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Prev / Next navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-card)' }}>
              <button
                onClick={handlePrevProblem}
                disabled={currentProblemIdx === 0}
                className="btn btn-secondary"
                style={{ padding: '6px 14px', fontSize: '12px', opacity: currentProblemIdx === 0 ? 0.4 : 1 }}
              >
                ➡️ المسألة السابقة
              </button>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {currentProblemIdx + 1} من {problems.length}
              </span>
              <button
                onClick={handleNextProblem}
                disabled={currentProblemIdx === problems.length - 1}
                className="btn btn-secondary"
                style={{ padding: '6px 14px', fontSize: '12px', opacity: currentProblemIdx === problems.length - 1 ? 0.4 : 1 }}
              >
                المسألة التالية ⬅️
              </button>
            </div>
          </div>

          {/* Virtual Math Keypad */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
              لوحة الرموز السريعة لإدراج المعادلات:
            </div>
            <MathKeypad onInsert={handleInsertChar} compact={true} />
          </div>
        </div>

        {/* Right Column: Scratchpad Canvas */}
        <div>
          <ScratchpadCanvas height={460} />
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            💡 نصيحة: يمكنك استخدام هذه السبورة الحرة لكتابة خطوات الحل خطوة بخطوة، أو رسم مثلثات ومستقيمات للتأكد من حساباتك قبل إدخال الجواب النهائي.
          </div>
        </div>
      </div>

      {/* Ask Math Tutor Modal */}
      {showTutorModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-card" style={{ maxWidth: '560px', width: '100%', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🤖</span>
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#fff' }}>اسأل المعلم الذكي</h3>
              </div>
              <button
                onClick={() => setShowTutorModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              هل تجد صعوبة في فهم فكرة المسألة؟ اسأل المعلم الذكي أي استفسار وسيشرح لك المفهوم ببساطة!
            </p>

            <form onSubmit={handleAskTutor}>
              <textarea
                value={tutorQuestion}
                onChange={(e) => setTutorQuestion(e.target.value)}
                placeholder="اكتب سؤالك هنا.. مثلاً: كيف أطرح 4 من طرفي الميزان؟"
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid var(--border-card)',
                  color: '#fff',
                  fontSize: '14px',
                  marginBottom: '12px',
                  outline: 'none',
                  resize: 'none'
                }}
              />
              <button
                type="submit"
                disabled={tutorLoading || !tutorQuestion.trim()}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                {tutorLoading ? 'جاري التفكير وصياغة الشرح...' : 'إرسال السؤال للمعلم الذكي 🚀'}
              </button>
            </form>

            {tutorResponse && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                background: 'rgba(79, 70, 229, 0.15)',
                border: '1px solid rgba(79, 70, 229, 0.3)',
                borderRadius: '12px',
                fontSize: '13px',
                lineHeight: 1.8,
                color: '#fff'
              }}>
                <div style={{ fontWeight: '800', color: '#38bdf8', marginBottom: '6px' }}>إجابة المعلم الذكي:</div>
                {tutorResponse}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
