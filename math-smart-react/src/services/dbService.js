import { supabase, isSupabaseConfigured } from './supabaseClient';
import { mockUserData, mockQuestionsResult } from '../data/mockData';

/**
 * Math Smart Database Service
 * يدعم كلاً من الاتصال المباشر بقاعدة بيانات Supabase، مع نظام حفظ وتجربة محلية عند العمل بدون إنترنت
 */

// 1. حفظ نتيجة اختبار أو تقييم ذكي
export const saveQuizResult = async (resultData) => {
  if (!isSupabaseConfigured || !supabase) {
    console.info('Quiz result saved locally (Demo mode):', resultData);
    return { success: true, data: resultData, mode: 'demo' };
  }

  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .insert([
        {
          student_id: resultData.studentId,
          exam_title: resultData.examTitle,
          grade: resultData.grade,
          score: resultData.score,
          total_questions: resultData.totalQuestions,
          correct_answers: resultData.correctAnswers,
          earned_xp: resultData.earnedXp,
          duration: resultData.duration,
          ai_feedback: resultData.aiFeedback
        }
      ])
      .select();

    if (error) throw error;

    // إضافة الـ XP لرصيد الطالب
    if (resultData.studentId && resultData.earnedXp > 0) {
      await addStudentXP(resultData.studentId, resultData.earnedXp);
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error saving quiz result to Supabase:', err);
    return { success: false, error: err.message };
  }
};

// 2. جلب نتائج اختبارات الطالب
export const getStudentQuizResults = async (studentId) => {
  if (!isSupabaseConfigured || !supabase) {
    return { success: true, data: [mockQuestionsResult], mode: 'demo' };
  }

  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error fetching quiz results:', err);
    return { success: false, error: err.message };
  }
};

// 3. إضافة نقاط XP وتحديث رتبة الطالب
export const addStudentXP = async (studentId, xpToAdd) => {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('xp, level')
      .eq('id', studentId)
      .single();

    if (profile) {
      const newXp = (profile.xp || 0) + xpToAdd;
      const newLevel = Math.floor(newXp / 500) + 1; // كل 500 نقطة مستوى جديد

      await supabase
        .from('profiles')
        .update({ xp: newXp, level: newLevel, updated_at: new Date().toISOString() })
        .eq('id', studentId);
    }
  } catch (err) {
    console.warn('Could not update student XP:', err);
  }
};

// 4. جلب لوحة المتصدرين (Leaderboard)
export const getLeaderboard = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: true,
      data: [
        { name: "فهد السالم", xp: 2480, level: 8, school: "مدرسة رواد المعرفة" },
        { name: "سارة الشمري", xp: 2310, level: 7, school: "مدارس المجد الأهلية" },
        { name: "عمر الغامدي", xp: 2150, level: 7, school: "الفيصلية المتقدمة" },
        { name: "ريان القحطاني", xp: 1980, level: 6, school: "مدرسة الرواد" }
      ],
      mode: 'demo'
    };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, xp, level, avatar_url, school')
      .eq('role', 'student')
      .order('xp', { ascending: false })
      .limit(10);

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    return { success: false, error: err.message };
  }
};

// 5. إنشاء غرفة تحدي مباشر (Live Challenge Room)
export const createChallengeRoom = async (hostId, topic, grade) => {
  const roomCode = Math.floor(100000 + Math.random() * 900000).toString(); // رمز من 6 أرقام

  if (!isSupabaseConfigured || !supabase) {
    return { success: true, roomCode, mode: 'demo' };
  }

  try {
    const { data, error } = await supabase
      .from('challenge_rooms')
      .insert([
        {
          room_code: roomCode,
          host_id: hostId,
          topic,
          grade,
          status: 'waiting'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, roomCode, data };
  } catch (err) {
    console.error('Error creating challenge room:', err);
    return { success: false, error: err.message };
  }
};

// 6. الاشتراك في تحديثات غرفة التحدي اللحظية (Realtime Subscription)
export const subscribeToRoom = (roomCode, onRoomUpdate) => {
  if (!isSupabaseConfigured || !supabase) {
    return () => {}; // No-op in demo mode
  }

  const channel = supabase
    .channel(`room_${roomCode}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'challenge_rooms',
        filter: `room_code=eq.${roomCode}`
      },
      (payload) => {
        onRoomUpdate(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
