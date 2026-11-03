import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const SupervisorTeacherLogin = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { loginAs } = useAuth();
  const [email, setEmail] = useState('tariq.omari@schools.edu.sa');
  const [password, setPassword] = useState('Teacher@2026');
  const [schoolCode, setSchoolCode] = useState('SCH-1088');
  const [require2FA, setRequire2FA] = useState(true);

  const handleLogin = (e) => {
    e.preventDefault();
    loginAs('teacher');
    showToast('أهلاً بك أ. طارق العمري في لوحة تحكم المعلم!', 'success');
    setCurrentScreen('02'); // Navigate to Teacher Dashboard
  };

  const handleDemoFill = () => {
    setEmail('tariq.omari@schools.edu.sa');
    setPassword('Teacher@2026');
    setSchoolCode('SCH-1088');
    showToast('تم تعبئة بيانات المعلم المعتمد أ. طارق العمري', 'info');
  };

  return (
    <div style={{ maxWidth: '520px', margin: '40px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setCurrentScreen('hub')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
        >
          ← العودة لمعرض الواجهات
        </button>
        <span className="badge badge-primary">10 دخول المشرف والمعلم</span>
      </div>

      <div className="glass-card" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '74px',
            height: '74px',
            borderRadius: '20px',
            overflow: 'hidden',
            margin: '0 auto 16px',
            boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)',
            border: '2px solid rgba(56, 189, 248, 0.4)',
            background: '#090d1a'
          }}>
            <img
              src="/assets/math_smart_logo.jpg"
              alt="أذكياء الرياضيات"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.currentTarget.src = '/assets/math_smart_logo.svg'; }}
            />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#fff', marginBottom: '6px' }}>
            بوابة المعلمين والمشرفين التربويين
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            الدخول المعتمد لإدارة الفصول ومتابعة مخرجات تعلم الرياضيات
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">البريد الإلكتروني التعليمي / الهوية الوطنية:</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">رمز اعتماد المدرسة / الإدارة التعليمية:</label>
            <input
              type="text"
              required
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value)}
              placeholder="SCH-XXXX"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">كلمة المرور:</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-body)' }}>
              <input
                type="checkbox"
                checked={require2FA}
                onChange={(e) => setRequire2FA(e.target.checked)}
              />
              تفعيل التحقق بخطوتين (2FA) للأمان
            </label>
            <button
              type="button"
              onClick={() => setCurrentScreen('05')}
              style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '12px', cursor: 'pointer' }}
            >
              نسيت كلمة المرور؟
            </button>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px' }}>
            تسجيل الدخول إلى لوحة المعلم 🛡️
          </button>

          <button
            type="button"
            onClick={handleDemoFill}
            style={{
              width: '100%',
              marginTop: '12px',
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-card)',
              borderRadius: '10px',
              color: '#fbbf24',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '700'
            }}
          >
            ⚡ تجربة الدخول المباشر كمعلم معتمد
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
          معلم أو مشرف جديد؟{' '}
          <button
            onClick={() => setCurrentScreen('14')}
            style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: '800', cursor: 'pointer' }}
          >
            طلب إنشاء حساب واعتماد مدرسة
          </button>
        </div>
      </div>
    </div>
  );
};
