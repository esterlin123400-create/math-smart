import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { createChallengeRoom, subscribeToRoom, joinChallengeRoom, updateChallengeRoomScore } from '../services/dbService';
import { copyToClipboard } from '../utils/platformHelpers';
import { playSuccessChime, playErrorTone, playLevelUpFanfare } from '../utils/soundEffects';

export const LiveChallengeArena = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { user, updateProfile } = useAuth();

  const battleQuestions = [
    {
      round: 1,
      category: 'الحساب الذهني السريع',
      text: 'ما هو ناتج العملية التالية: 7 × 8 + 5؟',
      hint: 'احسب حاصل ضرب 7 × 8 أولاً (56) ثم أضف 5',
      options: [
        { id: 'أ', text: '59', correct: false },
        { id: 'ب', text: '61', correct: true },
        { id: 'ج', text: '63', correct: false },
        { id: 'د', text: '56', correct: false }
      ]
    },
    {
      round: 2,
      category: 'الجذور والعمليات الحسابية',
      text: 'ما هو ناتج مجموع الجذرين: √144 + √25؟',
      hint: 'الجذر التربيعي لـ 144 هو 12، ولـ 25 هو 5',
      options: [
        { id: 'أ', text: '17', correct: true },
        { id: 'ب', text: '19', correct: false },
        { id: 'ج', text: '13', correct: false },
        { id: 'د', text: '169', correct: false }
      ]
    },
    {
      round: 3,
      category: 'الكسور والتفكير المنطقي',
      text: 'ما هو نصف رُبع العدد 80؟',
      hint: 'ربع 80 هو 20، ونصف الـ 20 هو...',
      options: [
        { id: 'أ', text: '5', correct: false },
        { id: 'ب', text: '10', correct: true },
        { id: 'ج', text: '20', correct: false },
        { id: 'د', text: '40', correct: false }
      ]
    },
    {
      round: 4,
      category: 'النسب المئوية والتقدير',
      text: 'احسب القيمة: 15% من العدد 200؟',
      hint: '10% من 200 = 20، و 5% = 10، إذن 15% = ...',
      options: [
        { id: 'أ', text: '25', correct: false },
        { id: 'ب', text: '30', correct: true },
        { id: 'ج', text: '35', correct: false },
        { id: 'د', text: '20', correct: false }
      ]
    },
    {
      round: 5,
      category: 'القوى والأسس الحسابية',
      text: 'ما هو ناتج العملية: 2³ + 3²؟',
      hint: '2³ = 8 ، و 3² = 9 ، اجمعهما',
      options: [
        { id: 'أ', text: '15', correct: false },
        { id: 'ب', text: '17', correct: true },
        { id: 'ج', text: '18', correct: false },
        { id: 'د', text: '14', correct: false }
      ]
    }
  ];

  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isMatchFinished, setIsMatchFinished] = useState(false);
  const [roomCode, setRoomCode] = useState('ARENA-8491');
  const [isHost, setIsHost] = useState(true);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [inputRoomCode, setInputRoomCode] = useState('');

  const [player1, setPlayer1] = useState({
    name: user?.name || 'فهد السالم (أنت)',
    score: 0,
    streak: 0,
    avatar: user?.avatar || '/assets/avatar_fahad_hero.svg',
    ping: '24ms'
  });

  useEffect(() => {
    setPlayer1(prev => ({
      ...prev,
      name: user?.name || 'فهد السالم (أنت)',
      avatar: user?.avatar || '/assets/avatar_fahad_hero.svg'
    }));
  }, [user?.name, user?.avatar]);

  const [player2, setPlayer2] = useState({
    name: 'زياد الغامدي (منافس مباشر)',
    score: 0,
    status: 'متصل وجاهز للنزال...',
    avatar: '/assets/avatar_robot.svg'
  });

  const currentQ = battleQuestions[currentRoundIdx];

  // Subscribe to Realtime Room Updates (when connected to Supabase)
  useEffect(() => {
    const cleanCode = roomCode.replace(/^ARENA-/i, '');
    const unsubscribe = subscribeToRoom(cleanCode, (updatedRoom) => {
      if (updatedRoom) {
        const opponentScore = isHost ? updatedRoom.guest_score : updatedRoom.host_score;
        if (typeof opponentScore === 'number') {
          setPlayer2(prev => ({
            ...prev,
            score: opponentScore,
            status: updatedRoom.status === 'in_progress' ? 'ينافس الآن في الوقت الفعلي!' : prev.status
          }));
        }
      }
    });
    return () => unsubscribe();
  }, [roomCode, isHost]);

  const handleCreateLiveRoom = async () => {
    const res = await createChallengeRoom(user?.id || 'demo-host', currentQ.category, user?.grade || 'الصف السادس');
    if (res.success && res.roomCode) {
      setIsHost(true);
      setRoomCode(`ARENA-${res.roomCode}`);
      showToast(`تم توليد غرفة تحدي جديدة برمز: ARENA-${res.roomCode}`, 'success');
    } else {
      showToast(res.error || 'تعذر إنشاء غرفة تحدي حالياً', 'danger');
    }
  };

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || isAnswered || isMatchFinished) {
      if (timeLeft <= 0 && !isAnswered && !isMatchFinished) {
        setIsAnswered(true);
        showToast('⏰ انتهى وقت الجولة!', 'danger');
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, isMatchFinished, showToast]);

  // Simulate live opponent reactions and answers
  useEffect(() => {
    if (isAnswered || isMatchFinished) return;
    const opponentDelay = 3500 + Math.random() * 4500;
    const oppTimer = setTimeout(() => {
      const isOppCorrect = Math.random() > 0.25; // 75% accuracy
      if (isOppCorrect) {
        setPlayer2(prev => ({
          ...prev,
          score: prev.score + 120,
          status: 'أجاب إجابة صحيحة! (+120)'
        }));
      } else {
        setPlayer2(prev => ({
          ...prev,
          status: 'أخطأ في الحساب!'
        }));
      }
    }, opponentDelay);

    return () => clearTimeout(oppTimer);
  }, [currentRoundIdx, isAnswered, isMatchFinished]);

  const handleSelectOption = (opt) => {
    if (isAnswered || isMatchFinished) return;
    setSelectedOption(opt.id);
    setIsAnswered(true);

    if (opt.correct) {
      const bonus = timeLeft * 4; // speed bonus
      const roundScore = 120 + bonus;
      const newTotalScore = player1.score + roundScore;
      setPlayer1(prev => ({
        ...prev,
        score: newTotalScore,
        streak: prev.streak + 1
      }));
      updateChallengeRoomScore(roomCode, isHost ? 'host_score' : 'guest_score', newTotalScore, 'in_progress');
      playSuccessChime();
      showToast(`🎉 إجابة خارقة السرعة! حصلت على +${roundScore} نقطة!`, 'success');
    } else {
      setPlayer1(prev => ({
        ...prev,
        streak: 0
      }));
      playErrorTone();
      showToast('❌ إجابة خاطئة! ركّز في الجولة القادمة', 'danger');
    }
  };

  const handleNextRound = async () => {
    if (currentRoundIdx < battleQuestions.length - 1) {
      setCurrentRoundIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(25);
      setPlayer2(prev => ({ ...prev, status: 'يفكر في الحل...' }));
      showToast(`انطلاق الجولة ${currentRoundIdx + 2} من ${battleQuestions.length} ⚡`, 'info');
    } else {
      setIsMatchFinished(true);
      const earnedXp = player1.score >= player2.score ? 250 : 100;
      await updateProfile({ xp: (user?.xp || 0) + earnedXp });
      updateChallengeRoomScore(roomCode, isHost ? 'host_score' : 'guest_score', player1.score, 'completed');
      playLevelUpFanfare();
      showToast(`🏆 انتهت المبارزة الرياضية! حصلت على +${earnedXp} XP!`, 'success');
    }
  };

  const handleRematch = () => {
    setCurrentRoundIdx(0);
    setTimeLeft(25);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsMatchFinished(false);
    setPlayer1(prev => ({ ...prev, score: 0, streak: 0 }));
    setPlayer2(prev => ({ ...prev, score: 0, status: 'متصل وجاهز للنزال...' }));
    showToast('بدأت جولة جديدة من المبارزة! بالتوفيق يا بطل!', 'info');
  };

  const handleCopyRoomCode = async () => {
    const ok = await copyToClipboard(roomCode);
    if (ok) {
      showToast(`تم نسخ كود الغرفة (${roomCode}) بنجاح! شاركه مع زميلك`, 'success');
    } else {
      showToast(`كود الغرفة: ${roomCode}`, 'info');
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!inputRoomCode.trim()) return;
    const formattedCode = inputRoomCode.trim().toUpperCase();
    const res = await joinChallengeRoom(formattedCode, user?.id);
    setIsHost(false);
    setRoomCode(formattedCode.startsWith('ARENA-') ? formattedCode : `ARENA-${formattedCode}`);
    setJoinModalOpen(false);
    setInputRoomCode('');
    setPlayer2({
      name: 'زميل متصل (مباشر)',
      score: 0,
      status: res.mode === 'demo' ? 'انضم إلى الغرفة للتو!' : 'متصل في الغرفة السحابية!',
      avatar: '/assets/avatar_ninja.svg'
    });
    showToast(`تم الانضمام للغرفة ${formattedCode} بنجاح!`, 'success');
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg-navbar)',
        backdropFilter: 'blur(16px)',
        padding: '16px 24px',
        borderRadius: '20px',
        border: '1px solid var(--border-card)',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setCurrentScreen('hub')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '700'
            }}
          >
            ← مغادرة الحلبة
          </button>
          <div style={{
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontWeight: '900',
            fontSize: '13px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚡ حلبة النزال الذهبي المباشر</span>
          </div>
          <span style={{
            background: '#ef4444',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '10px',
            fontSize: '11px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span className="live-dot" /> نزال حي مباشر
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-card)',
            borderRadius: '12px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>كود الغرفة:</span>
            <strong style={{ color: '#38bdf8', fontFamily: 'var(--font-en)', fontSize: '13px' }}>{roomCode}</strong>
            <button
              type="button"
              onClick={handleCopyRoomCode}
              title="نسخ كود الغرفة"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-heading)',
                fontSize: '14px'
              }}
            >
              📋
            </button>
          </div>

          <button
            type="button"
            onClick={handleCreateLiveRoom}
            className="btn btn-primary"
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            غرفة جديدة ⚡
          </button>

          <button
            type="button"
            onClick={() => setJoinModalOpen(true)}
            className="btn btn-secondary"
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            انضمام لغرفة 🔗
          </button>

          <span style={{ fontSize: '12px', color: '#10b981' }}>
            سرعة الاتصال: {player1.ping}
          </span>
        </div>
      </div>

      {/* BATTLE STAGE VS */}
      <div className="battle-stage-grid">
        {/* Player 1 Card */}
        <div className="glass-card" style={{
          borderColor: 'rgba(56, 189, 248, 0.4)',
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12), var(--bg-card))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#0284c7', padding: '6px', flexShrink: 0 }}>
              <img src={player1.avatar} alt="P1" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-heading)' }}>{player1.name}</div>
              <div style={{ fontSize: '12px', color: '#0ea5e9' }}>سلسلة الفوز: 🔥 {player1.streak} متتالية</div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#0284c7', fontFamily: 'var(--font-en)' }}>
                {player1.score} <span style={{ fontSize: '13px' }}>نقطة</span>
              </div>
            </div>
          </div>
        </div>

        {/* VS / Timer */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ec4899, #f59e0b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '18px',
            color: '#fff',
            boxShadow: '0 0 25px rgba(236, 72, 153, 0.5)'
          }}>
            VS
          </div>
          <div style={{
            fontSize: '22px',
            fontWeight: '900',
            fontFamily: 'var(--font-en)',
            color: timeLeft <= 5 ? '#ef4444' : '#f59e0b'
          }}>
            ⏱️ {timeLeft}s
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            الجولة {currentRoundIdx + 1} من {battleQuestions.length}
          </div>
        </div>

        {/* Player 2 Card */}
        <div className="glass-card" style={{
          borderColor: 'rgba(236, 72, 153, 0.4)',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12), var(--bg-card))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-heading)' }}>{player2.name}</div>
              <div style={{ fontSize: '12px', color: '#ec4899' }}>الحالة: {player2.status}</div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#db2777', fontFamily: 'var(--font-en)' }}>
                {player2.score} <span style={{ fontSize: '13px' }}>نقطة</span>
              </div>
            </div>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#be185d', padding: '6px', flexShrink: 0 }}>
              <img src={player2.avatar} alt="P2" style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* QUESTION BOX OR PODIUM */}
      {!isMatchFinished ? (
        <div className="glass-card" style={{ padding: '36px', textAlign: 'center', marginBottom: '28px' }}>
          <span className="badge badge-warning" style={{ marginBottom: '14px' }}>
            الجولة {currentRoundIdx + 1}: {currentQ.category}
          </span>
          <h2 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-heading)', marginBottom: '14px' }}>
            {currentQ.text}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '28px' }}>
            💡 تلميح العباقرة: {currentQ.hint}
          </p>

          {/* Options Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            maxWidth: '600px',
            margin: '0 auto 24px'
          }}>
            {currentQ.options.map(opt => {
              const optStyle = {
                padding: '18px 24px',
                borderRadius: '16px',
                border: '1px solid var(--border-card)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-heading)',
                fontSize: '20px',
                fontWeight: '900',
                fontFamily: 'var(--font-en)',
                cursor: isAnswered ? 'default' : 'pointer',
                transition: 'all 0.2s'
              };

              if (isAnswered) {
                if (opt.correct) {
                  optStyle.background = 'linear-gradient(135deg, #10b981, #059669)';
                  optStyle.borderColor = '#34d399';
                  optStyle.color = '#fff';
                } else if (selectedOption === opt.id) {
                  optStyle.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                  optStyle.borderColor = '#f87171';
                  optStyle.color = '#fff';
                }
              }

              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  style={optStyle}
                >
                  {opt.id}. {opt.text}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div style={{ marginTop: '20px' }}>
              <button type="button" onClick={handleNextRound} className="btn btn-primary" style={{ padding: '12px 32px' }}>
                {currentRoundIdx < battleQuestions.length - 1 ? 'الانتقال للجولة التالية ⏭️' : 'استعراض النتيجة النهائية والتتويج 🏆'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* VICTORY PODIUM */
        <div className="glass-card" style={{ padding: '48px 30px', textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '50px', marginBottom: '14px' }}>
            {player1.score >= player2.score ? '👑' : '🥈'}
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-heading)', marginBottom: '10px' }}>
            {player1.score >= player2.score ? 'مبروك الفوز الساحق بالنزال!' : 'مباراة قوية ومستوى رائع!'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto 28px' }}>
            {player1.score >= player2.score
              ? `تفوق البطل ${player1.name} بنتيجة ${player1.score} مقابل ${player2.score} للمنافس! وتمت إضافة +250 XP لحسابك في لوحة المتصدرين!`
              : `أنهيت الجولات بنتيجة ${player1.score} نقطة. استمر في التدريب لتحقيق النصر في الجولة القادمة!`}
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" onClick={handleRematch} className="btn btn-primary" style={{ padding: '12px 28px' }}>
              🔄 إعادة المبارزة
            </button>
            <button type="button" onClick={() => setCurrentScreen('01')} className="btn btn-secondary" style={{ padding: '12px 28px' }}>
              📊 التقييم ومراجعة الحل
            </button>
            <button type="button" onClick={() => setCurrentScreen('hub')} className="btn btn-secondary" style={{ padding: '12px 28px' }}>
              🏛️ العودة للمعرض
            </button>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {joinModalOpen && (
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
          <div className="glass-card" style={{ maxWidth: '420px', width: '100%', padding: '28px', background: 'var(--bg-modal)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-heading)' }}>الانضمام إلى غرفة منافس</h3>
              <button
                type="button"
                onClick={() => setJoinModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              أدخل كود الغرفة المكون من 6 إلى 10 خانات الذي أرسله لك زميلك لبدء المبارزة المباشرة:
            </p>
            <form onSubmit={handleJoinRoom}>
              <input
                type="text"
                required
                value={inputRoomCode}
                onChange={(e) => setInputRoomCode(e.target.value)}
                placeholder="مثال: ARENA-9021"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-card)',
                  color: 'var(--text-heading)',
                  fontSize: '16px',
                  fontWeight: '800',
                  textAlign: 'center',
                  letterSpacing: '2px',
                  marginBottom: '16px',
                  outline: 'none',
                  textTransform: 'uppercase'
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                دخول الغرفة وبدء النزال ⚔️
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
