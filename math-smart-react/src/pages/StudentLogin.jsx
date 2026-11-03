import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const StudentLogin = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { loginAs } = useAuth();
  const [studentCode, setStudentCode] = useState('STU-9024');
  const [pin, setPin] = useState('1234');
  const [selectedAvatar, setSelectedAvatar] = useState('/assets/avatar_fahad_hero.svg');

  const avatars = [
    { src: '/assets/avatar_fahad_hero.svg', name: 'البطل فهد' },
    { src: '/assets/avatar_astronaut.svg', name: 'رائد الفضاء' },
    { src: '/assets/avatar_robot.svg', name: 'الروبوت الذكي' },
    { src: '/assets/avatar_ninja.svg', name: 'نينجا الحساب' },
    { src: '/assets/avatar_math_wizard.svg', name: 'الساحر العبقري' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    loginAs('student');
    showToast('أهلاً بك يا بطل الرياضيات في منصتك!', 'success');
    setCurrentScreen('13'); // Navigate to Student Dashboard
  };

  const handleDemoFill = () => {
    setStudentCode('STU-9024');
    setPin('1234');
    setSelectedAvatar('/assets/avatar_fahad_hero.svg');
    showToast('تمت تعبئة بيانات الطالب التجريبي فهد السالم', 'info');
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setCurrentScreen('hub')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
        >
          ← العودة لمعرض الواجهات
        </button>
        <span className="badge badge-cyan">04 تسجيل دخول الطالب</span>
      </div>

      <div className="glass-card" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '40px',
        padding: '40px',
        alignItems: 'center'
      }}>
        {/* Left Mascot Column */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '220px', height: '220px', margin: '0 auto 20px' }}>
            <img
              src="/assets/student_hero_mascot.svg"
              alt="Mascot"
              className="float-anim"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', marginBottom: '8px' }}>
            بوابة عباقرة الرياضيات 🚀
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            انضم الآن لخوض التحديات اليومية، جمع نقاط الخبرة XP، والتنافس مع زملائك على صدارة المتصدرين!
          </p>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <span className="badge badge-warning">🔥 تحدي أسبوعي</span>
            <span className="badge badge-success">🏆 جوائز وأوسمة</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '20px' }}>
            تسجيل دخول الطالب
          </h3>

          {/* Avatar Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">اختر شخصيتك الرمزية المفضلة:</label>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
              {avatars.map((av, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedAvatar(av.src)}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: selectedAvatar === av.src ? '#4f46e5' : 'rgba(255, 255, 255, 0.05)',
                    border: selectedAvatar === av.src ? '3px solid #38bdf8' : '1px solid var(--border-card)',
                    padding: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  title={av.name}
                >
                  <img src={av.src} alt={av.name} style={{ width: '100%', height: '100%' }} />
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">رمز الطالب التعريفي:</label>
              <input
                type="text"
                required
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                placeholder="STU-XXXX"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">الرمز السري (PIN / كلمة المرور):</label>
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '24px' }}>
              <button
                type="button"
                onClick={() => setCurrentScreen('05')}
                style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer' }}
              >
                نسيت الرمز السري؟
              </button>
              <button
                type="button"
                onClick={handleDemoFill}
                style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', fontWeight: '700' }}
              >
                ⚡ تعبئة بيانات تجريبية
              </button>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
              دخول إلى منصة الأذكياء 🎯
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
            ليس لديك حساب طالب؟{' '}
            <button
              onClick={() => setCurrentScreen('15')}
              style={{ background: 'none', border: 'none', color: '#ec4899', fontWeight: '800', cursor: 'pointer' }}
            >
              سجل حساباً جديداً مجاناً
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
