/**
 * Math Smart AI Service
 * يستدعي نقطة النهاية الآمنة /api/gemini على الخادم دون تضمين أي مفتاح API داخل حزمة المتصفح،
 * مع الرجوع التلقائي لمحرك التحليل التربوي المحلي عند عدم توفر الخادم أو المفتاح.
 */

export let isGeminiConfigured = false;

export const checkGeminiAvailability = async () => {
  try {
    if (typeof window === 'undefined') return false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('/api/gemini', { method: 'GET', signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return false;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return false;
    const data = await res.json();
    isGeminiConfigured = Boolean(data?.configured);
    return isGeminiConfigured;
  } catch {
    return false;
  }
};

const postToGeminiProxy = async (action, payload) => {
  if (typeof window === 'undefined') return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload }),
      signal: controller.signal
    });
    clearTimeout(timer);

    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;

    const data = await res.json();
    if (data?.success) {
      isGeminiConfigured = true;
      return data;
    }
    return null;
  } catch {
    clearTimeout(timer);
    return null;
  }
};

/**
 * 1. تحليل خطوة حل الطالب بالذكاء الاصطناعي
 */
export const analyzeMathStep = async ({
  problemTitle,
  problemQuestion,
  equation,
  studentInput,
  correctAnswers = [],
  unit = '',
  topic = 'الرياضيات',
  grade = 'الصف السادس الابتدائي'
}) => {
  const isCorrectDirectly = correctAnswers.some(
    ans => studentInput.trim().replace(/\s+/g, '') === ans.replace(/\s+/g, '')
  );

  const liveResult = await postToGeminiProxy('analyzeMathStep', {
    problemTitle,
    problemQuestion,
    equation,
    studentInput,
    correctAnswers,
    topic,
    grade,
    isCorrectDirectly
  });

  if (liveResult) {
    return liveResult;
  }

  // Smart Offline/Demo Rule-based Fallback
  if (isCorrectDirectly) {
    return {
      success: true,
      isCorrect: true,
      feedback: `رائع جداً! الإجابة (${studentInput} ${unit}) صحيحة ودقيقة حسابياً 100%.`,
      hint: 'لقد أتقنت هذه المهارة بنجاح، يمكنك الآن الانتقال للتحدي التالي لرفع نقاط الـ XP!',
      encouragement: '🌟 تفكير رياضي عبقري ومنظم! استمر بهذا الإبداع يا بطل!',
      isLiveAi: false
    };
  }

  return {
    success: true,
    isCorrect: false,
    feedback: `الخطوة (${studentInput}) تحتاج إلى إعادة تدقيق. انتبه للعمليات الحسابية المتطابقة على طرفي المعادلة.`,
    hint: 'فكر في عزل المجهول: ما العملية العكسية المطلوبة لنقل الحدود وتبسيط المعادلة؟',
    encouragement: '💪 المحاولة هي أول خطوة في طريق العباقرة! جرب مرة أخرى، أنت قادر على حلها!',
    isLiveAi: false
  };
};

/**
 * 2. المعلم الذكي الصوتي/النصي (Ask Math Tutor)
 */
export const askMathTutor = async ({ question, grade = 'الصف السادس الابتدائي', topic = 'عام' }) => {
  const liveResult = await postToGeminiProxy('askMathTutor', { question, grade, topic });
  if (liveResult) {
    return liveResult;
  }

  // Simulated Tutor Response
  return {
    success: true,
    answer: `أهلاً بك يا بطل! سؤال ممتاز في ${topic}. في الرياضيات، المفتاح دائماً هو التوازن: كل عملية تجريها على أحد الطرفين يجب موازنتها في الطرف الآخر. جرب تقسيم المسألة المعقدة إلى خطوات أصغر وسترى كم تصبح ممتعة وسهلة! 📐✨`,
    isLiveAi: false
  };
};

/**
 * 3. توليد تقرير تشخيصي ذكي بعد انتهاء الاختبار
 */
export const generateSmartAssessmentFeedback = async ({
  examTitle,
  grade,
  score,
  correctCount,
  totalQuestions,
  duration
}) => {
  const liveResult = await postToGeminiProxy('generateSmartAssessmentFeedback', {
    examTitle,
    grade,
    score,
    correctCount,
    totalQuestions,
    duration
  });

  if (liveResult) {
    return liveResult;
  }

  return {
    success: true,
    summary: `أداء استثنائي ومتقن! حققت نسبة ${score}% في ${duration}، مما يدل على استيعاب قوي للمفاهيم الرياضية الأساسية وسرعة بديهة عالية.`,
    strengths: [
      'الدقة الحسابية العالية والسرعة في عزل المتغيرات',
      'التطبيق المنطقي للعمليات الرياضية العكسية',
      'المثابرة في حل المسائل متعددة الخطوات'
    ],
    recommendations: [
      'التدرب على المسائل المتقدمة ذات الكسور والأقواس المركبة',
      'خوض جولات التحدي المباشر لتعزيز سرعة الاستجابة تحت الضغط الزمني'
    ],
    isLiveAi: false
  };
};
