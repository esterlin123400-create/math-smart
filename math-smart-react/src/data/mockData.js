export const mockUserData = {
  student: {
    id: "STU-9024",
    name: "فهد عبدالعزيز السالم",
    role: "student",
    title: "بطل الجبر المتقدم",
    grade: "الصف السادس الابتدائي",
    school: "مدرسة رواد المعرفة الابتدائية",
    xp: 2480,
    nextLevelXp: 3000,
    level: 8,
    streak: 12,
    rank: 3,
    totalSolves: 184,
    accuracy: 94,
    avatar: "/assets/avatar_fahad_hero.svg",
    badges: [
      { id: 1, name: "عبقري الجبر", icon: "⚡", desc: "حل 50 معادلة خطية بنجاح دون أخطاء" },
      { id: 2, name: "صائد التحديات", icon: "🏆", desc: "الفوز بـ 10 جولات متتالية في حلبة التحدي" },
      { id: 3, name: "المثابر الذهبي", icon: "🔥", desc: "الحفاظ على سلسلة تدريب 10 أيام متواصلة" },
      { id: 4, name: "مهندس الأشكال", icon: "📐", desc: "إتقان حساب مساحات ومحيطات المضلعات" }
    ]
  },
  teacher: {
    id: "TEA-1022",
    name: "أ. طارق عبدالملك العمري",
    role: "teacher",
    title: "معلم أول رياضيات",
    school: "مدارس النخبة الأهلية",
    classesCount: 4,
    studentsCount: 96,
    activeQuizzes: 3,
    avgCompletionRate: 88,
    avatar: "/assets/avatar_math_wizard.svg"
  }
};

export const mockQuestionsResult = {
  examTitle: "التقييم الذكي: المعادلات الخطية والمساحات التناسبية",
  grade: "الصف السادس الابتدائي - الفصل الأول",
  completedAt: "2026-10-31",
  duration: "14 دقيقة و 22 ثانية",
  totalQuestions: 5,
  correctAnswers: 4,
  score: 92,
  earnedXp: 350,
  aiFeedback: {
    summary: "أداء استثنائي ومتقن! لقد أظهرت فهماً عميقاً لخصائص الجمع والطرح لحل المعادلات، وتميزت في تطبيق موازين الكتل الجبرية.",
    strengths: ["السرعة في عزل المتغير (س)", "تطبيق الخطوات الرياضية المنطقية", "الدقة الحسابية العالية"],
    recommendation: "ننصحك بالانتقال للمستوى المتقدم: المعادلات متعددة الخطوات التي تتضمن الأقواس والكسور."
  },
  questions: [
    {
      id: 1,
      text: "حل المعادلة التالية لإيجاد قيمة س: 3س + 6 = 21",
      userAnswer: "س = 5",
      correctAnswer: "س = 5",
      status: "correct",
      xp: 70,
      steps: [
        "بطرح 6 من كلا طرفي المعادلة: 3س = 21 - 6",
        "التبسيط: 3س = 15",
        "بالقسمة على معامل س (3): س = 15 ÷ 3 = 5"
      ]
    },
    {
      id: 2,
      text: "إذا كانت مساحة مستطيل تساوي 48 سم² وعرضه 6 سم، فما هو طوله؟",
      userAnswer: "الطول = 8 سم",
      correctAnswer: "الطول = 8 سم",
      status: "correct",
      xp: 70,
      steps: [
        "قانون المساحة: المساحة = الطول × العرض",
        "التعويض: 48 = الطول × 6",
        "الطول = 48 ÷ 6 = 8 سم"
      ]
    },
    {
      id: 3,
      text: "أوجد ناتج تبسيط الكسر التالي لأبسط صورة: 18 / 24",
      userAnswer: "3 / 4",
      correctAnswer: "3 / 4",
      status: "correct",
      xp: 70,
      steps: [
        "إيجاد القاسم المشترك الأكبر (ق.م.أ) للعددين 18 و 24 وهو 6",
        "قسمة البسط والمقام على 6: (18 ÷ 6) / (24 ÷ 6) = 3 / 4"
      ]
    },
    {
      id: 4,
      text: "حل المسألة اللفظية: اشترى أحمد 4 دفاتر بسعر متساوٍ، إذا كان المجموع مع قلم قيمته 5 ريالات يساوي 29 ريالاً، فما سعر الدفتر الواحد؟",
      userAnswer: "سعر الدفتر = 7 ريالات",
      correctAnswer: "سعر الدفتر = 6 ريالات",
      status: "incorrect",
      xp: 0,
      steps: [
        "صياغة المعادلة: 4د + 5 = 29",
        "بطرح 5 من الطرفين: 4د = 24",
        "بالقسمة على 4: د = 24 ÷ 4 = 6 ريالات (أنت كتبت 7 ريالات بسبب خطأ حسابي بسيط في الطرح)"
      ]
    },
    {
      id: 5,
      text: "احسب محيط مربع طول ضلعه 7.5 سم:",
      userAnswer: "المحيط = 30 سم",
      correctAnswer: "المحيط = 30 سم",
      status: "correct",
      xp: 70,
      steps: [
        "قانون محيط المربع: المحيط = 4 × طول الضلع",
        "التعويض: المحيط = 4 × 7.5 = 30 سم"
      ]
    }
  ]
};

export const mockLiveChallenge = {
  arenaTitle: "مبارزة العباقرة - السيرفر الخليجي #1",
  roomCode: "MATH-ARENA-88",
  roundNumber: 3,
  totalRounds: 5,
  timeLeft: 28,
  player1: {
    name: "فهد السالم (أنت)",
    avatar: "/assets/avatar_fahad_hero.svg",
    score: 840,
    streak: 3,
    status: "جاهز للإجابة",
    ping: "22ms"
  },
  player2: {
    name: "سارة الخالدي (الدمام)",
    avatar: "/assets/avatar_math_wizard.svg",
    score: 790,
    streak: 2,
    status: "تفكّر في الحل...",
    ping: "35ms"
  },
  currentQuestion: {
    id: 104,
    category: "الحساب الذهني السريع",
    text: "ما هو ناتج: (14 × 5) - (36 ÷ 4) ؟",
    options: [
      { id: "A", text: "59", correct: false },
      { id: "B", text: "61", correct: true },
      { id: "C", text: "63", correct: false },
      { id: "D", text: "65", correct: false }
    ],
    hint: "ابدأ بحساب الضرب (14×5 = 70) والقسمة (36÷4 = 9) ثم اطرح!"
  }
};

export const mockRecordsList = [
  {
    id: "REC-9081",
    studentName: "فهد عبدالعزيز السالم",
    grade: "الصف السادس",
    date: "2026-10-31",
    activity: "تقييم ذكي - الوحدة 2",
    result: "92%",
    status: "متميز",
    color: "#10b981",
    badgeType: "success"
  },
  {
    id: "REC-9080",
    studentName: "سارة فهد الخالدي",
    grade: "الصف السادس",
    date: "2026-10-30",
    activity: "حلبة تحدي مباشر",
    result: "فوز (الأولى)",
    status: "بطل الجولة",
    color: "#38bdf8",
    badgeType: "primary"
  },
  {
    id: "REC-9079",
    studentName: "ريان خالد القحطاني",
    grade: "الصف الخامس",
    date: "2026-10-29",
    activity: "مسائل تفاعلية ذاتية",
    result: "84%",
    status: "جيد جداً",
    color: "#fbbf24",
    badgeType: "warning"
  },
  {
    id: "REC-9078",
    studentName: "نورة محمد الغامدي",
    grade: "الصف الأول متوسط",
    date: "2026-10-28",
    activity: "تقييم جبري شامل",
    result: "96%",
    status: "متميز",
    color: "#10b981",
    badgeType: "success"
  },
  {
    id: "REC-9077",
    studentName: "عمر ماجد الدوسري",
    grade: "الصف الرابع",
    date: "2026-10-28",
    activity: "تحدي الضرب السريع",
    result: "78%",
    status: "يحتاج تدريب",
    color: "#f87171",
    badgeType: "danger"
  },
  {
    id: "REC-9076",
    studentName: "جنى سلطان العتيبي",
    grade: "الصف الثاني متوسط",
    date: "2026-10-27",
    activity: "حل مسائل الهندسة والزوايا",
    result: "90%",
    status: "متميز",
    color: "#10b981",
    badgeType: "success"
  }
];

export const mockCurriculumUnits = [
  // ========================================================
  // 1. المرحلة الابتدائية (الصفوف 1 - 6)
  // ========================================================
  {
    id: 1,
    stageId: "elementary",
    stageName: "المرحلة الابتدائية",
    grade: "الصفوف الأولية (1-3 ابتدائي)",
    title: "تأسيس الحساب والأعداد والعمليات الأساسية",
    desc: "تمثيل الأعداد حتى 100، القيمة المنزلية، وحقائق الجمع والطرح الذهني ومقدمة الضرب.",
    icon: "🌱",
    progress: 100,
    completed: true,
    formulaPreview: "٥ + ٧ = ١٢  •  ٣ × ٤ = ١٢",
    lessons: [
      { id: "e1-1", title: "تمثيل الأعداد والقيمة المنزلية حتى 100", duration: "10 دقائق", status: "completed", xp: 45, difficulty: "مبتدئ" },
      { id: "e1-2", title: "استراتيجيات الجمع والطرح الذهني الممتع", duration: "14 دقيقة", status: "completed", xp: 55, difficulty: "مبتدئ" },
      { id: "e1-3", title: "مقدمة مفهوم الضرب كجمع متكرر والعد القفزي", duration: "16 دقيقة", status: "completed", xp: 60, difficulty: "مبتدئ" },
      { id: "e1-4", title: "الأشكال المستوية والمجسمات وقراءة الساعة", duration: "12 دقيقة", status: "completed", xp: 50, difficulty: "مبتدئ" }
    ]
  },
  {
    id: 2,
    stageId: "elementary",
    stageName: "المرحلة الابتدائية",
    grade: "الصف الرابع والخامس الابتدائي",
    title: "العمليات الحسابية المطولة والكسور والقياس",
    desc: "إتقان الضرب في عددين، القسمة المطولة، القواسم والمضاعفات، وجمع وطرح الكسور.",
    icon: "🔢",
    progress: 85,
    completed: false,
    formulaPreview: "ق.م.أ (١٢، ١٨) = ٦  •  ١/٢ + ١/٤ = ٣/٤",
    lessons: [
      { id: "e2-1", title: "خوارزمية الضرب في عددين وثلاثة أرقام", duration: "15 دقيقة", status: "completed", xp: 60, difficulty: "متوسط" },
      { id: "e2-2", title: "القسمة المطولة مع باقٍ والتأكد بالضرب", duration: "20 دقيقة", status: "completed", xp: 70, difficulty: "متوسط" },
      { id: "e2-3", title: "الكسور الاعتيادية المتكافئة والتبسيط", duration: "18 دقيقة", status: "completed", xp: 65, difficulty: "متوسط" },
      { id: "e2-4", title: "جمع وطرح الكسور وتطبيقات القياس والزمن", duration: "22 دقيقة", status: "in-progress", xp: 75, difficulty: "متوسط" }
    ]
  },
  {
    id: 3,
    stageId: "elementary",
    stageName: "المرحلة الابتدائية",
    grade: "الصف السادس الابتدائي",
    title: "الأنماط العددية والجبر والنسب والهندسة",
    desc: "المعادلات الخطية البسيطة، النسب المئوية، محيط ومساحة الدائرة، وحساب الحجوم.",
    icon: "📐",
    progress: 60,
    completed: false,
    formulaPreview: "٣س + ٦ = ٢١  •  المحيط = ٢ط نق",
    lessons: [
      { id: "e3-1", title: "الخطوات الأربع لحل المسألة والأنماط الجبرية", duration: "14 دقيقة", status: "completed", xp: 60, difficulty: "متوسط" },
      { id: "e3-2", title: "المتغيرات والمعادلات ذات الخطوة الواحدة", duration: "18 دقيقة", status: "completed", xp: 70, difficulty: "متوسط" },
      { id: "e3-3", title: "النسبة والنسبة المئوية والاحتمالات", duration: "20 دقيقة", status: "in-progress", xp: 75, difficulty: "متوسط" },
      { id: "e3-4", title: "محيط ومساحة الدائرة وحجم المنشور", duration: "24 دقيقة", status: "locked", xp: 85, difficulty: "متقدم" }
    ]
  },

  // ========================================================
  // 2. المرحلة المتوسطة (الصفوف 1 - 3 متوسط)
  // ========================================================
  {
    id: 4,
    stageId: "middle",
    stageName: "المرحلة المتوسطة",
    grade: "الصف الأول متوسط",
    title: "الأعداد الصحيحة والمعادلات والدوال الخطية",
    desc: "العمليات على الأعداد الصحيحة الموجبة والسالبة، حل المعادلات، ومفهوم التناسب.",
    icon: "📘",
    progress: 70,
    completed: false,
    formulaPreview: "س - (-٤) = ١٠  •  ص = ك س",
    lessons: [
      { id: "m1-1", title: "العمليات على الأعداد الصحيحة وقواعد الإشارات", duration: "16 دقيقة", status: "completed", xp: 65, difficulty: "متوسط" },
      { id: "m1-2", title: "حل المعادلات ذات الخطوتين والمتباينات", duration: "22 دقيقة", status: "completed", xp: 80, difficulty: "متوسط" },
      { id: "m1-3", title: "النسبة والتناسب ومعدل التغير والميل", duration: "20 دقيقة", status: "in-progress", xp: 75, difficulty: "متوسط" },
      { id: "m1-4", title: "المستوي الإحداثي والدوال والتمثيل البياني", duration: "25 دقيقة", status: "locked", xp: 85, difficulty: "متقدم" }
    ]
  },
  {
    id: 5,
    stageId: "middle",
    stageName: "المرحلة المتوسطة",
    grade: "الصف الثاني متوسط",
    title: "الأعداد الحقيقية ونظرية فيثاغورس والتطابق",
    desc: "الجذور التربيعية، نظرية فيثاغورس في المثلث القائم، التحويلات الهندسية والإحصاء.",
    icon: "📗",
    progress: 40,
    completed: false,
    formulaPreview: "أ² + ب² = ج²  •  م = (ق١ + ق٢)/٢ × ع",
    lessons: [
      { id: "m2-1", title: "الأعداد الحقيقية والجذور والعمليات عليها", duration: "18 دقيقة", status: "completed", xp: 70, difficulty: "متوسط" },
      { id: "m2-2", title: "نظرية فيثاغورس وتطبيقاتها الهندسية", duration: "24 دقيقة", status: "completed", xp: 85, difficulty: "متقدم" },
      { id: "m2-3", title: "التحويلات الهندسية: الانعكاس، الانسحاب، والدوران", duration: "20 دقيقة", status: "locked", xp: 80, difficulty: "متقدم" },
      { id: "m2-4", title: "مساحات الأشكال المركبة والاحتمال المركب", duration: "26 دقيقة", status: "locked", xp: 90, difficulty: "متقدم" }
    ]
  },
  {
    id: 6,
    stageId: "middle",
    stageName: "المرحلة المتوسطة",
    grade: "الصف الثالث متوسط",
    title: "أنظمة المعادلات الخطية والدوال التربيعية",
    desc: "حل أنظمة المعادلات بالحذف والتعويض، كثيرات الحدود، والقانون العام للدالة التربيعية.",
    icon: "📙",
    progress: 25,
    completed: false,
    formulaPreview: "س = (-ب ± √(ب² - ٤أ ج)) / ٢أ",
    lessons: [
      { id: "m3-1", title: "حل أنظمة المعادلات الخطية بيانياً وجبرياً", duration: "24 دقيقة", status: "completed", xp: 85, difficulty: "متقدم" },
      { id: "m3-2", title: "كثيرات الحدود وتحليل المقادير الجبرية", duration: "28 دقيقة", status: "in-progress", xp: 90, difficulty: "متقدم" },
      { id: "m3-3", title: "الدوال التربيعية والقانون العام وحساب المميز", duration: "30 دقيقة", status: "locked", xp: 100, difficulty: "خبير" },
      { id: "m3-4", title: "العبارات والمعادلات الجذرية والمثلثات المتشابهة", duration: "25 دقيقة", status: "locked", xp: 90, difficulty: "متقدم" }
    ]
  },

  // ========================================================
  // 3. المرحلة الثانوية والمسارات التخصصية
  // ========================================================
  {
    id: 7,
    stageId: "high",
    stageName: "المرحلة الثانوية",
    grade: "المسار العام والمشترك",
    title: "المصفوفات والمتطابقات المثلثية والقطوع المخروطية",
    desc: "العمليات على المصفوفات، النظير الضربي، المتطابقات المثلثية وضعف الزاوية، ومعادلات القطوع.",
    icon: "🏛️",
    progress: 35,
    completed: false,
    formulaPreview: "جا²(θ) + جتا²(θ) = ١  •  [A][X] = [B]",
    lessons: [
      { id: "h1-1", title: "المصفوفات والمحددات وقاعدة كرامر للحل", duration: "26 دقيقة", status: "completed", xp: 90, difficulty: "متقدم" },
      { id: "h1-2", title: "المتطابقات المثلثية الأساسية وضعف ونصف الزاوية", duration: "32 دقيقة", status: "in-progress", xp: 100, difficulty: "خبير" },
      { id: "h1-3", title: "القطوع المخروطية: المكافئ والناقص والزائد", duration: "28 دقيقة", status: "locked", xp: 95, difficulty: "خبير" },
      { id: "h1-4", title: "الدوال اللوغاريتمية والأسية وخصائصها", duration: "25 دقيقة", status: "locked", xp: 90, difficulty: "متقدم" }
    ]
  },
  {
    id: 8,
    stageId: "high",
    stageName: "المرحلة الثانوية",
    grade: "مسار الهندسة والحاسب",
    title: "المتجهات والفضاء الإقليدي ثلاثي الأبعاد",
    desc: "المتجهات في المستوى والفضاء R³، الضرب الداخلي والاتجاهي، والإحداثيات القطبية.",
    icon: "💻",
    progress: 15,
    completed: false,
    formulaPreview: "u · v = |u||v|cosθ  •  u × v = |u||v|sinθ n",
    lessons: [
      { id: "h2-1", title: "المتجهات في بعدين وثلاثة أبعاد والعمليات الخطية", duration: "25 دقيقة", status: "completed", xp: 85, difficulty: "متقدم" },
      { id: "h2-2", title: "الضرب الداخلي (القياسي) والضرب المتجهي وتطبيقاته", duration: "30 دقيقة", status: "locked", xp: 100, difficulty: "خبير" },
      { id: "h2-3", title: "معادلات المستقيم والمستوى في الفضاء الثلاثي", duration: "28 دقيقة", status: "locked", xp: 95, difficulty: "خبير" },
      { id: "h2-4", title: "الإحداثيات القطبية والأعداد المركبة ونظرية ديموافر", duration: "34 دقيقة", status: "locked", xp: 110, difficulty: "خبير" }
    ]
  },

  // ========================================================
  // 4. مرحلة التفاضل والتكامل والرياضيات المتقدمة (Calculus)
  // ========================================================
  {
    id: 9,
    stageId: "calculus",
    stageName: "مرحلة التفاضل والتكامل",
    grade: "حساب التفاضل والتكامل 1 (Calculus I)",
    title: "النهايات والاتصال وسلوك الدوال (Limits & Continuity)",
    desc: "المفهوم البياني والعددي للنهاية، إزالة عدم التعيين 0/0، النهايات عند اللانهاية ومبرهنة القيمة المتوسطة.",
    icon: "⚡",
    progress: 80,
    completed: false,
    formulaPreview: "lim[x→a] f(x) = L  •  lim[x→0] (sin x)/x = 1",
    lessons: [
      { id: "c1-1", title: "مفهوم النهاية وقواعد الحساب الجبرية", duration: "22 دقيقة", status: "completed", xp: 85, difficulty: "متقدم" },
      { id: "c1-2", title: "تقنيات إزالة صيغ عدم التعيين (التحليل، المرافق)", duration: "28 دقيقة", status: "completed", xp: 95, difficulty: "خبير" },
      { id: "c1-3", title: "نهايات الدوال المثلثية ونظرية الحصر (Squeeze Theorem)", duration: "26 دقيقة", status: "completed", xp: 100, difficulty: "خبير" },
      { id: "c1-4", title: "الاتصال عند نقطة وعلى فترة ومبرهنة القيمة المتوسطة", duration: "30 دقيقة", status: "in-progress", xp: 110, difficulty: "خبير" }
    ]
  },
  {
    id: 10,
    stageId: "calculus",
    stageName: "مرحلة التفاضل والتكامل",
    grade: "حساب التفاضل والتكامل 1 (Calculus I)",
    title: "قواعد الاشتقاق وتطبيقات التفاضل (Derivatives & Applications)",
    desc: "تعريف المشتقة كمعامل ميل ومعدل تغير آني، قاعدة السلسلة، الاشتقاق الضمني، والقيم القصوى ونقاط الانقلاب.",
    icon: "📈",
    progress: 50,
    completed: false,
    formulaPreview: "d/dx [f(g(x))] = f'(g(x)) · g'(x)  •  f'(x) = 0",
    lessons: [
      { id: "c2-1", title: "تعريف المشتقة الأولى وقواعد القوة والضرب والقسمة", duration: "25 دقيقة", status: "completed", xp: 90, difficulty: "متقدم" },
      { id: "c2-2", title: "قاعدة السلسلة (Chain Rule) والاشتقاق الضمني", duration: "32 دقيقة", status: "completed", xp: 105, difficulty: "خبير" },
      { id: "c2-3", title: "المعدلات الزمنية المرتبطة (Related Rates)", duration: "35 دقيقة", status: "in-progress", xp: 120, difficulty: "أسطوري" },
      { id: "c2-4", title: "القيم العظمى والصغرى ونقاط الانقلاب ورسم المنحنيات", duration: "36 دقيقة", status: "locked", xp: 120, difficulty: "خبير" }
    ]
  },
  {
    id: 11,
    stageId: "calculus",
    stageName: "مرحلة التفاضل والتكامل",
    grade: "حساب التفاضل والتكامل 2 (Calculus II)",
    title: "التكامل المحدود وغير المحدود (Integration & Antiderivatives)",
    desc: "النظرية الأساسية لحساب التفاضل والتكامل، طرق التكامل بالتعويض وبالأجزاء وبالكسور الجزئية، وحساب المساحات.",
    icon: "∫",
    progress: 20,
    completed: false,
    formulaPreview: "∫ f(x) dx = F(x) + C  •  ∫ u dv = uv - ∫ v du",
    lessons: [
      { id: "c3-1", title: "الدوال الأصلية والنظرية الأساسية في التفاضل والتكامل", duration: "28 دقيقة", status: "completed", xp: 95, difficulty: "خبير" },
      { id: "c3-2", title: "طريقة التكامل بالتعويض (U-Substitution)", duration: "30 دقيقة", status: "locked", xp: 105, difficulty: "خبير" },
      { id: "c3-3", title: "التكامل بالتجزيء / بالأجزاء (Integration by Parts)", duration: "34 دقيقة", status: "locked", xp: 120, difficulty: "أسطوري" },
      { id: "c3-4", title: "تكامل الدوال الكسرية بالكسور الجزئية وحساب المساحات بين المنحنيات", duration: "38 دقيقة", status: "locked", xp: 130, difficulty: "أسطوري" }
    ]
  },
  {
    id: 12,
    stageId: "calculus",
    stageName: "مرحلة التفاضل والتكامل",
    grade: "حساب التفاضل والتكامل المتقدم (Calculus III)",
    title: "حجوم الأجسام الدورانية والمعادلات التفاضلية (Advanced Calculus)",
    desc: "حساب الحجوم بطريقة الأقراص والأسطوانات الدورانية، طول القوس، والمعادلات التفاضلية من الرتبة الأولى.",
    icon: "🌀",
    progress: 0,
    completed: false,
    formulaPreview: "V = π ∫ [f(x)]² dx  •  dy/dx = g(x) h(y)",
    lessons: [
      { id: "c4-1", title: "حساب حجوم الأجسام الدورانية بطريقة الأقراص والحلقات (Disks & Washers)", duration: "35 دقيقة", status: "locked", xp: 125, difficulty: "أسطوري" },
      { id: "c4-2", title: "حجوم الأجسام الدورانية بطريقة القشور الأسطوانية (Cylindrical Shells)", duration: "32 دقيقة", status: "locked", xp: 125, difficulty: "أسطوري" },
      { id: "c4-3", title: "طول المنحنى ومساحة سطح الجسم الدوراني", duration: "30 دقيقة", status: "locked", xp: 120, difficulty: "أسطوري" },
      { id: "c4-4", title: "حل المعادلات التفاضلية القابلة للفصل وتطبيقات النمو والاضمحلال", duration: "40 دقيقة", status: "locked", xp: 140, difficulty: "أسطوري" }
    ]
  }
];

