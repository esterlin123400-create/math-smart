import { GoogleGenAI } from '@google/genai';

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

export const isGeminiConfigured = Boolean(
  geminiApiKey && 
  geminiApiKey !== 'your-gemini-api-key-here' &&
  !geminiApiKey.includes('your-key')
);

// Initialize Gemini Client
const ai = isGeminiConfigured ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

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

  // If Gemini API Key is configured, use live Gemini Flash model
  if (isGeminiConfigured && ai) {
    try {
      const prompt = `
أنت "المعلم الذكي للرياضيات" في منصة Math Smart التعليمية.
مهمتك تقييم خطوة الطالب بأسلوب تربوي لطيف ومشجع باللغة العربية الفصحى.

بيانات المسألة:
- العنوان: ${problemTitle}
- الموضوع: ${topic}
- الصف: ${grade}
- نص السؤال: ${problemQuestion}
- المعادلة الأصلية: ${equation}
- الإجابات النموذجية الصحيحة: ${correctAnswers.join(' أو ')}
- مدخل/خطوة الطالب: ${studentInput}

المطلوب:
حلل خطوة الطالب وقدم له إرشاداً ذكياً:
1. هل إجابته أو خطوته صحيحة؟
2. تعليق دقيق ومختصر (لا تعطِه الحل النهائي مباشرة إذا أخطأ، بل دله على الفكرة لتشغيل عقله).
3. تلميح ذكي موجه للخطوة التالية.
4. عبارة تشجيعية دافئة.

أرجع الإجابة ككائن JSON صالح فقط بالشكل التالي:
{
  "isCorrect": ${isCorrectDirectly ? 'true' : 'false'},
  "feedback": "شرح وتحليل الخطوة",
  "hint": "تلميح ذكي للخطوة التالية",
  "encouragement": "عبارة تحفيزية ممتازة"
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text;
      const parsed = JSON.parse(text);
      return { success: true, ...parsed, isLiveAi: true };
    } catch (err) {
      console.warn('Live Gemini API call notice, falling back to smart engine:', err.message);
    }
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
  } else {
    return {
      success: true,
      isCorrect: false,
      feedback: `الخطوة (${studentInput}) تحتاج إلى إعادة تدقيق. انتبه للعمليات الحسابية المتطابقة على طرفي المعادلة.`,
      hint: `فكر في عزل المجهول: ما العملية العكسية المطلوبة لنقل الحدود وتبسيط المعادلة؟`,
      encouragement: '💪 المحاولة هي أول خطوة في طريق العباقرة! جرب مرة أخرى، أنت قادر على حلها!',
      isLiveAi: false
    };
  }
};

/**
 * 2. المعلم الذكي الصوتي/النصي (Ask Math Tutor)
 */
export const askMathTutor = async ({ question, grade = 'الصف السادس الابتدائي', topic = 'عام' }) => {
  if (isGeminiConfigured && ai) {
    try {
      const prompt = `
أنت "المرشد الذكي للرياضيات" في منصة Math Smart.
طالب في مرحلة (${grade}) يسألك السؤال التالي حول موضوع (${topic}):
"${question}"

أجب باختصار (في 3-4 أسطر)، بأسلوب مبسط ومشوق ومناسب لعمر الطالب، مع استخدام أمثلة واقعية مبسطة ورموز رياضية واضحة.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      return { success: true, answer: response.text, isLiveAi: true };
    } catch (err) {
      console.warn('Gemini tutor call error:', err);
    }
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
  if (isGeminiConfigured && ai) {
    try {
      const prompt = `
قم بصفتك خبيراً تربوياً في تدريس الرياضيات بإعداد تقرير تشخيصي ذكي وموجز باللغة العربية لطالب:
- عنوان الاختبار: ${examTitle}
- الصف: ${grade}
- الدرجة المحققة: ${score}% (${correctCount} من ${totalQuestions})
- وقت الإنجاز: ${duration}

أرجع الإجابة كـ JSON:
{
  "summary": "ملخص الأداء العام بأسلوب محفز",
  "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
  "recommendations": ["توصية عملية 1", "توصية عملية 2"]
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      return { success: true, ...JSON.parse(response.text), isLiveAi: true };
    } catch (err) {
      console.warn('Gemini assessment error:', err);
    }
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
