import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Breadcrumb } from '../components/Breadcrumb';

export const StudentLogin = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { loginAs, loginWithSupabase, isLiveBackend, updateProfile, loading } = useAuth();
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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLiveBackend && studentCode.includes('@')) {
      const res = await loginWithSupabase(studentCode.trim(), pin);
      if (res.success) {
        await updateProfile({ avatar: selectedAvatar });
        showToast('أهلاً بك يا بطل الرياضيات في منصتك السحابية!', 'success');
        setCurrentScreen('13');
      } else {
        showToast(res.error || 'تعذر تسجيل الدخول، تأكد من البريد والرمز السري', 'danger');
      }
    } else {
      loginAs('student');
      await updateProfile({ avatar: selectedAvatar });
      showToast('أهلاً بك يا بطل الرياضيات في منصتك!', 'success');
      setCurrentScreen('13'); // Navigate to Student Dashboard
    }
  };

  const handleDemoFill = () => {
    setStudentCode('STU-9024');
    setPin('1234');
    setSelectedAvatar('/assets/avatar_fahad_hero.svg');
    showToast('تمت تعبئة بيانات الطالب التجريبي فهد السالم', 'info');
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '20px 0' }}>
      <Breadcrumb
        items={[{ label: 'تسجيل دخول الطالب', icon: '🔐' }]}
        backTo="hub"
        backLabel="الصفحة الرئيسية"
        tag="بوابة الطالب"
      />

      <div className="glass-card" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
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
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-heading)', marginBottom: '4px' }}>
            مدارك • أذكياء الرياضيات 🚀
          </h2>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px' }}>
            منصة تعليمية رقمية تفاعلية
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            انضم الآن لخوض التحديات اليومية، جمع نقاط الخبرة XP، والتنافس مع زملائك على صدارة المتصدرين!
          </p>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-warning">🔥 تحدي أسبوعي</span>
            <span className="badge badge-success">🏆 جوائز وأوسمة</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '20px' }}>
            تسجيل دخول الطالب
          </h3>

          {/* Avatar Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">اختر شخصيتك الرمزية المفضلة:</label>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
              {avatars.map((av, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedAvatar(av.src)}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: selectedAvatar === av.src ? '#0d9488' : 'var(--bg-subtle)',
                    border: selectedAvatar === av.src ? '3px solid #38bdf8' : '1px solid var(--border-card)',
                    padding: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  title={av.name}
                >
                  <img src={av.src} alt={av.name} style={{ width: '100%', height: '100%' }} />
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">البريد الإلكتروني أو رمز الطالب التعريفي:</label>
              <input
                type="text"
                required
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                placeholder="STU-XXXX أو email@example.com"
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

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
              {loading ? 'جاري تسجيل الدخول...' : 'دخول إلى منصة الأذكياء 🎯'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
            ليس لديك حساب طالب؟{' '}
            <button
              type="button"
              onClick={() => setCurrentScreen('15')}
              style={{ background: 'none', border: 'none', color: '#f97316', fontWeight: '800', cursor: 'pointer' }}
            >
              سجل حساباً جديداً مجاناً
            </button>
          </div>

          {/* Quick links to Parent & Teacher Login Portals */}
          <div style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-card)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <button
              type="button"
              onClick={() => {
                loginAs('parent');
                setCurrentScreen('16');
                showToast('تم تسجيل دخول ولي الأمر (عبدالعزيز السالم) لمتابعة الابن', 'success');
              }}
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981',
                padding: '6px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '700',
                fontFamily: 'var(--font-ar)'
              }}
            >
              👨‍👩‍👧 دخول ولي أمر الطالب
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreen('10')}
              style={{
                background: 'rgba(13, 148, 136, 0.1)',
                border: '1px solid rgba(13, 148, 136, 0.3)',
                color: '#0d9488',
                padding: '6px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '700',
                fontFamily: 'var(--font-ar)'
              }}
            >
              👨‍🏫 بوابة المعلم والمشرف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
