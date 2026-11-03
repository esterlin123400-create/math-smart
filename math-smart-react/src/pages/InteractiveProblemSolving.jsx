import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MathKeypad } from '../components/MathKeypad';
import { ScratchpadCanvas } from '../components/ScratchpadCanvas';

export const InteractiveProblemSolving = () => {
  const { setCurrentScreen, showToast } = useApp();
  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  const [equationInput, setEquationInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [solvedList, setSolvedList] = useState({}); // { 0: true, 1: true, ... }
  const [totalXpEarned, setTotalXpEarned] = useState(0);

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
  };

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
        showToast(`🎉 إجابة عبقرية صحيحة! أحسنت! (+${currentProb.xp} XP)`, 'success');
      } else {
        showToast('هذه المسألة محلولة بنجاح مسبقاً!', 'info');
      }
    } else {
      showToast('الجواب غير دقيق بعد، تفقد الخطوات أو اضغط على زر التلميح 💡', 'warning');
    }
  };

  const handleNextProblem = () => {
    if (currentProblemIdx < problems.length - 1) {
      setCurrentProblemIdx(prev => prev + 1);
      setEquationInput('');
      setShowHint(false);
    }
  };

  const handlePrevProblem = () => {
    if (currentProblemIdx > 0) {
      setCurrentProblemIdx(prev => prev - 1);
      setEquationInput('');
      setShowHint(false);
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
          <span className="badge badge-warning">⭐ {totalXpEarned} XP تم جمعها</span>
          <span className="badge badge-success">✓ {solvedCount} من {problems.length} منجزة</span>
          <span className="badge badge-cyan" style={{ fontFamily: 'var(--font-en)' }}>⏱️ نشط</span>
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
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '14px',
                border: isSelected ? '2px solid #6366f1' : '1px solid var(--border-card)',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.35), rgba(6, 182, 212, 0.25))'
                  : 'rgba(255, 255, 255, 0.04)',
                color: isSelected ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-ar)',
                fontSize: '13px',
                fontWeight: '700',
                transition: 'all 0.2s'
              }}
            >
              <span>{isSolved ? '✅' : '🔢'}</span>
              <span>مسألة {prob.id}</span>
              <span style={{ fontSize: '11px', opacity: 0.8 }}>({prob.xp} XP)</span>
            </button>
          );
        })}
      </div>

      {/* Grid: Left Question & Keypad, Right Scratchpad */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Column: Problem & Input & Virtual Keypad */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Question Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="badge badge-primary">
                {currentProb.stage}
              </span>
              <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: '800' }}>
                +{currentProb.xp} XP
              </span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>
              {currentProb.title}
            </h3>

            {/* Diagram Image if available */}
            {currentProb.diagram && (
              <div style={{
                background: '#040711',
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'center',
                marginBottom: '16px',
                border: '1px solid var(--border-card)'
              }}>
                <img
                  src={currentProb.diagram}
                  alt="Balance diagram"
                  style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'contain' }}
                />
              </div>
            )}

            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-body)', marginBottom: '14px' }}>
              {currentProb.question}
            </p>

            <div style={{
              background: 'rgba(79, 70, 229, 0.12)',
              border: '1px solid rgba(79, 70, 229, 0.3)',
              borderRadius: '12px',
              padding: '12px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>الصيغة الرياضية:</span>
              <strong style={{ fontSize: '20px', color: '#38bdf8', fontFamily: 'var(--font-en)' }}>
                {currentProb.equation}
              </strong>
            </div>

            {/* Answer Input Box */}
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">اكتب حلك النهائي لقيمة ({currentProb.unit}):</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="مثال: 5 أو س = 5"
                  value={equationInput}
                  onChange={(e) => setEquationInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCheckAnswer(); }}
                  style={{
                    flex: 1,
                    padding: '14px 18px',
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
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleCheckAnswer}
                className="btn btn-success"
                style={{ flex: 2, minWidth: '150px', padding: '14px', fontSize: '15px' }}
              >
                {isCurrentSolved ? '✓ إجابة معتمدة ومبرهنة!' : 'التحقق من الحل 🔍'}
              </button>
              <button
                onClick={() => setShowHint(!showHint)}
                className="btn btn-secondary"
                style={{ flex: 1, minWidth: '100px', padding: '14px', fontSize: '13px', color: '#fbbf24' }}
              >
                {showHint ? 'إخفاء التلميح' : 'تلميح 💡'}
              </button>
            </div>

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
    </div>
  );
};
