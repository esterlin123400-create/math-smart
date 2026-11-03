export const mathSymbolCategories = [
  {
    id: "basic",
    name: "العمليات الأساسية والمقارنة",
    icon: "➕",
    symbols: [
      { char: "+", label: "جمع", latex: "+" },
      { char: "−", label: "طرح", latex: "-" },
      { char: "×", label: "ضرب", latex: "\\times" },
      { char: "÷", label: "قسمة", latex: "\\div" },
      { char: "=", label: "يساوي", latex: "=" },
      { char: "≠", label: "لا يساوي", latex: "\\neq" },
      { char: "±", label: "زائد أو ناقص", latex: "\\pm" },
      { char: "<", label: "أصغر من", latex: "<" },
      { char: ">", label: "أكبر من", latex: ">" },
      { char: "≤", label: "أصغر من أو يساوي", latex: "\\leq" },
      { char: "≥", label: "أكبر من أو يساوي", latex: "\\geq" },
      { char: "≈", label: "يساوي تقريباً", latex: "\\approx" }
    ]
  },
  {
    id: "algebra",
    name: "الجبر والمتغيرات والأسس",
    icon: "📐",
    symbols: [
      { char: "س", label: "المتغير سين", latex: "x" },
      { char: "ص", label: "المتغير صاد", latex: "y" },
      { char: "ع", label: "المتغير عين", latex: "z" },
      { char: "x²", label: "تربيع", latex: "x^2" },
      { char: "x³", label: "تكعيب", latex: "x^3" },
      { char: "xⁿ", label: "أس ن", latex: "x^n" },
      { char: "√", label: "جذر تربيعي", latex: "\\sqrt{}" },
      { char: "∛", label: "جذر تكعيبي", latex: "\\sqrt[3]{}" },
      { char: "½", label: "نصف", latex: "\\frac{1}{2}" },
      { char: "¼", label: "ربع", latex: "\\frac{1}{4}" },
      { char: "( )", label: "أقواس دائرية", latex: "()" },
      { char: "[ ]", label: "أقواس مربعة", latex: "[]" }
    ]
  },
  {
    id: "geometry",
    name: "الهندسة والقياس والزوايا",
    icon: "📏",
    symbols: [
      { char: "π", label: "ط (النسبة التقريبية باي)", latex: "\\pi" },
      { char: "°", label: "درجة الزاوية", latex: "^\\circ" },
      { char: "∠", label: "زاوية", latex: "\\angle" },
      { char: "△", label: "مثلث", latex: "\\triangle" },
      { char: "⟂", label: "عمودي على", latex: "\\perp" },
      { char: "∥", label: "موازي لـ", latex: "\\parallel" },
      { char: "≅", label: "يطابق", latex: "\\cong" },
      { char: "∼", label: "يشابه", latex: "\\sim" }
    ]
  },
  {
    id: "sets_calculus",
    name: "المجموعات والرموز المتقدمة",
    icon: "♾️",
    symbols: [
      { char: "∞", label: "ما لا نهاية", latex: "\\infty" },
      { char: "∅", label: "المجموعة الخالية فاي", latex: "\\emptyset" },
      { char: "∈", label: "ينتمي إلى", latex: "\\in" },
      { char: "∉", label: "لا ينتمي إلى", latex: "\\notin" },
      { char: "⊂", label: "مجموعة جزئية", latex: "\\subset" },
      { char: "∪", label: "اتحاد", latex: "\\cup" },
      { char: "∩", label: "تقاطع", latex: "\\cap" },
      { char: "∑", label: "المجموع سيجما", latex: "\\sum" },
      { char: "∫", label: "تكامل", latex: "\\int" },
      { char: "lim", label: "نهاية (Limit)", latex: "\\lim_{x \\to a}" },
      { char: "d/dx", label: "مشتقة تفاضلية", latex: "\\frac{d}{dx}" },
      { char: "f'(x)", label: "المشتقة الأولى", latex: "f'(x)" },
      { char: "dx", label: "تفاضل المتغير x", latex: "dx" },
      { char: "θ", label: "الزاوية ثيتا (Theta)", latex: "\\theta" }
    ]
  }
];
