import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const StudentRegistration = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { loginAs, updateProfile } = useAuth();
  const [studentName, setStudentName] = useState('');
  const [grade, setGrade] = useState('الصف السادس الابتدائي');
  const [parentPhone, setParentPhone] = useState('05XXXXXXXX');
  const [pin, setPin] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('/assets/avatar_fahad_hero.svg');

  const avatars = [
    { src: '/assets/avatar_fahad_hero.svg', name: 'البطل' },
    { src: '/assets/avatar_astronaut.svg', name: 'رائد الفضاء' },
    { src: '/assets/avatar_robot.svg', name: 'الروبوت' },
    { src: '/assets/avatar_ninja.svg', name: 'النينجا' },
    { src: '/assets/avatar_math_wizard.svg', name: 'الساحر' }
  ];

  const handleRegister = (e) => {
    e.preventDefault();
    loginAs('student');
    updateProfile({
      name: studentName || 'طالب جديد',
      grade,
      avatar: selectedAvatar
    });
    showToast(`مرحباً بك يا بطل الرياضيات ${studentName}! تم إنشاء حسابك بنجاح!`, 'success');
    setCurrentScreen('13'); // Go to student dashboard
  };

  return (
    <div style={{ maxWidth: '640px', margin: '30px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setCurrentScreen('hub')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
        >
          ← العودة لمعرض الواجهات
        </button>
        <span className="badge badge-primary">15 إنشاء حساب طالب جديد</span>
      </div>

      <div className="glass-card" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '100px', height: '100px', margin: '0 auto 12px' }}>
            <img
              src="/assets/student_hero_mascot.svg"
              alt="Mascot"
              className="float-anim"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#fff', marginBottom: '6px' }}>
            انضمام بطل رياضيات جديد 🌟
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            سجل الآن مجاناً وابدأ حل المسائل والمنافسة في حلبة التحديات مع زملائك
          </p>
        </div>

        {/* Avatar Picker */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <label className="form-label">اختر شخصيتك الرمزية الأولى:</label>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            {avatars.map((av, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedAvatar(av.src)}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: selectedAvatar === av.src ? '#4f46e5' : 'rgba(255, 255, 255, 0.05)',
                  border: selectedAvatar === av.src ? '3px solid #38bdf8' : '1px solid var(--border-card)',
                  padding: '6px',
                  cursor: 'pointer',
                  transform: selectedAvatar === av.src ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.2s'
                }}
                title={av.name}
              >
                <img src={av.src} alt={av.name} style={{ width: '100%', height: '100%' }} />
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">اسم الطالب الكامل:</label>
            <input
              type="text"
              required
              placeholder="مثال: زياد بن فيصل الحربي"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">المرحلة والصف الدراسي:</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="form-select"
            >
              <optgroup label="المرحلة الابتدائية">
                <option value="الصف الأول الابتدائي">الصف الأول الابتدائي</option>
                <option value="الصف الثاني الابتدائي">الصف الثاني الابتدائي</option>
                <option value="الصف الثالث الابتدائي">الصف الثالث الابتدائي</option>
                <option value="الصف الرابع الابتدائي">الصف الرابع الابتدائي</option>
                <option value="الصف الخامس الابتدائي">الصف الخامس الابتدائي</option>
                <option value="الصف السادس الابتدائي">الصف السادس الابتدائي</option>
              </optgroup>
              <optgroup label="المرحلة المتوسطة">
                <option value="الصف الأول متوسط">الصف الأول متوسط</option>
                <option value="الصف الثاني متوسط">الصف الثاني متوسط</option>
                <option value="الصف الثالث متوسط">الصف الثالث متوسط</option>
              </optgroup>
              <optgroup label="المرحلة الثانوية والمسارات">
                <option value="المسار العام (ثانوي)">المسار العام (ثانوي)</option>
                <option value="مسار الهندسة والحاسب">مسار الهندسة والحاسب</option>
                <option value="مسار الصحة والحياة">مسار الصحة والحياة</option>
              </optgroup>
              <optgroup label="مرحلة التفاضل والتكامل">
                <option value="حساب التفاضل والتكامل 1 (Calculus I)">حساب التفاضل والتكامل 1 (Calculus I)</option>
                <option value="حساب التفاضل والتكامل 2 (Calculus II)">حساب التفاضل والتكامل 2 (Calculus II)</option>
                <option value="التفاضل والتكامل المتقدم (Calculus III)">التفاضل والتكامل المتقدم (Calculus III)</option>
              </optgroup>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">رقم جوال ولي الأمر (لتلقي تقارير الإنجاز):</label>
            <input
              type="tel"
              required
              placeholder="05XXXXXXXX"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">الرمز السري الخاص بك (PIN):</label>
            <input
              type="password"
              required
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="form-input"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: '10px' }}>
            إنشاء الحساب وبدء المغامرة الآن 🚀
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          لديك حساب بالفعل؟{' '}
          <button
            onClick={() => setCurrentScreen('04')}
            style={{ background: 'none', border: 'none', color: '#06b6d4', fontWeight: '800', cursor: 'pointer' }}
          >
            سجل دخولك هنا
          </button>
        </div>
      </div>
    </div>
  );
};
