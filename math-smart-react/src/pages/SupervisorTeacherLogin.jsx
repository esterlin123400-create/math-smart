import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Breadcrumb } from '../components/Breadcrumb';

export const SupervisorTeacherLogin = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { loginAs, loginWithSupabase, isLiveBackend, loading } = useAuth();
  const [email, setEmail] = useState('tariq.omari@schools.edu.sa');
  const [password, setPassword] = useState('Teacher@2026');
  const [schoolCode, setSchoolCode] = useState('SCH-1088');
  const [require2FA, setRequire2FA] = useState(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLiveBackend && email.includes('@')) {
      const res = await loginWithSupabase(email.trim(), password);
      if (res.success) {
        showToast('أهلاً بك في لوحة تحكم المعلم السحابية!', 'success');
        setCurrentScreen('02');
      } else {
        showToast(res.error || 'تعذر تسجيل الدخول، تأكد من البريد وكلمة المرور', 'danger');
      }
    } else {
      loginAs('teacher');
      showToast('أهلاً بك أ. طارق العمري في لوحة تحكم المعلم!', 'success');
      setCurrentScreen('02'); // Navigate to Teacher Dashboard
    }
  };

  const handleDemoFill = () => {
    setEmail('tariq.omari@schools.edu.sa');
    setPassword('Teacher@2026');
    setSchoolCode('SCH-1088');
    showToast('تم تعبئة بيانات المعلم المعتمد أ. طارق العمري', 'info');
  };

  return (
    <div style={{ maxWidth: '520px', margin: '40px auto' }}>
      <Breadcrumb
        items={[{ label: 'تسجيل دخول المعلم والمشرف', icon: '👨‍🏫' }]}
        backTo="hub"
        backLabel="الصفحة الرئيسية"
        tag="بوابة المعلمين"
      />

      <div className="glass-card" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '74px',
            height: '74px',
            borderRadius: '20px',
            overflow: 'hidden',
            margin: '0 auto 16px',
            boxShadow: '0 8px 25px rgba(13, 148, 136, 0.4)',
            border: '2px solid rgba(56, 189, 248, 0.4)',
            background: '#e6faf5'
          }}>
            <img
              src="/assets/math_smart_logo.jpg"
              alt="أذكياء الرياضيات"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.currentTarget.src = '/assets/math_smart_logo.svg'; }}
            />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-heading)', marginBottom: '4px' }}>
            مدارك • أذكياء الرياضيات
          </h1>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
            منصة تعليمية رقمية تفاعلية — بوابة الكادر التعليمي
          </div>
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

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px' }}>
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول إلى لوحة المعلم 🛡️'}
          </button>

          <button
            type="button"
            onClick={handleDemoFill}
            style={{
              width: '100%',
              marginTop: '12px',
              padding: '10px',
              background: 'var(--bg-subtle)',
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

          <button
            type="button"
            onClick={() => {
              loginAs('admin');
              setCurrentScreen('07');
              showToast('أهلاً بك م. عبدالعزيز المحمود في لوحة إدارة النظام العام!', 'success');
            }}
            style={{
              width: '100%',
              marginTop: '8px',
              padding: '10px',
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              borderRadius: '10px',
              color: '#0891b2',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '700'
            }}
          >
            🛠️ تجربة الدخول كمدير نظام (Super Admin)
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
          معلم أو مشرف جديد؟{' '}
          <button
            type="button"
            onClick={() => setCurrentScreen('14')}
            style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: '800', cursor: 'pointer' }}
          >
            طلب إنشاء حساب واعتماد مدرسة
          </button>
        </div>

        {/* Quick Cross-Role Links */}
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
            onClick={() => setCurrentScreen('04')}
            style={{
              background: 'rgba(249, 115, 22, 0.1)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              color: '#f97316',
              padding: '6px 12px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '700',
              fontFamily: 'var(--font-ar)'
            }}
          >
            🎒 بوابة دخول الطالب
          </button>

          <button
            type="button"
            onClick={() => {
              loginAs('parent');
              setCurrentScreen('16');
              showToast('تم تسجيل دخول ولي الأمر (عبدالعزيز السالم)', 'success');
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
            👨‍👩‍👧 بوابة دخول ولي الأمر
          </button>
        </div>
      </div>
    </div>
  );
};
