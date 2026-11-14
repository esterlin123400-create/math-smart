const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const clampText = (val, maxLen = 1200) => String(val ?? '').trim().slice(0, maxLen);

const getServerApiKey = () => {
  const key = (process.env.GEMINI_API_KEY || '').trim();
  if (!key || key === 'your-gemini-api-key-here' || key.includes('your-key')) {
    return '';
  }
  return key;
};

const callGeminiRest = async (apiKey, prompt, expectJson = false) => {
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    ...(expectJson ? { generationConfig: { responseMimeType: 'application/json' } } : {})
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Gemini HTTP ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Empty Gemini response');
    }
    return text;
  } finally {
    clearTimeout(timeout);
  }
};

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const apiKey = getServerApiKey();

  if (req.method === 'GET') {
    return res.status(200).json({ configured: Boolean(apiKey), model: 'gemini-2.5-flash' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  if (!apiKey) {
    return res.status(200).json({ success: false, fallback: true, configured: false });
  }

  try {
    const rawBody = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { action, payload = {} } = rawBody;

    if (action === 'analyzeMathStep') {
      const problemTitle = clampText(payload.problemTitle, 200);
      const problemQuestion = clampText(payload.problemQuestion, 800);
      const equation = clampText(payload.equation, 200);
      const studentInput = clampText(payload.studentInput, 300);
      const topic = clampText(payload.topic || 'الرياضيات', 120);
      const grade = clampText(payload.grade || 'الصف السادس الابتدائي', 120);
      const correctAnswers = Array.isArray(payload.correctAnswers)
        ? payload.correctAnswers.slice(0, 8).map(a => clampText(a, 80))
        : [];
      const isCorrectDirectly = Boolean(payload.isCorrectDirectly);

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
      const text = await callGeminiRest(apiKey, prompt, true);
      const parsed = JSON.parse(text);
      return res.status(200).json({ success: true, ...parsed, isLiveAi: true });
    }

    if (action === 'askMathTutor') {
      const question = clampText(payload.question, 800);
      const grade = clampText(payload.grade || 'الصف السادس الابتدائي', 120);
      const topic = clampText(payload.topic || 'عام', 120);

      if (!question) {
        return res.status(400).json({ success: false, error: 'Missing question' });
      }

      const prompt = `
أنت "المرشد الذكي للرياضيات" في منصة Math Smart.
طالب في مرحلة (${grade}) يسألك السؤال التالي حول موضوع (${topic}):
"${question}"

أجب باختصار (في 3-4 أسطر)، بأسلوب مبسط ومشوق ومناسب لعمر الطالب، مع استخدام أمثلة واقعية مبسطة ورموز رياضية واضحة.
`;
      const answer = await callGeminiRest(apiKey, prompt, false);
      return res.status(200).json({ success: true, answer, isLiveAi: true });
    }

    if (action === 'generateSmartAssessmentFeedback') {
      const examTitle = clampText(payload.examTitle, 200);
      const grade = clampText(payload.grade, 120);
      const score = Number(payload.score) || 0;
      const correctCount = Number(payload.correctCount) || 0;
      const totalQuestions = Number(payload.totalQuestions) || 0;
      const duration = clampText(payload.duration, 100);

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
      const text = await callGeminiRest(apiKey, prompt, true);
      const parsed = JSON.parse(text);
      return res.status(200).json({ success: true, ...parsed, isLiveAi: true });
    }

    return res.status(400).json({ success: false, error: 'Unsupported action' });
  } catch (err) {
    console.warn('Gemini proxy fallback notice:', err.message);
    return res.status(200).json({ success: false, fallback: true });
  }
};

