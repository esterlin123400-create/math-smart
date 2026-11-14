import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const PasswordRecovery = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { resetPassword, updatePassword, isLiveBackend } = useAuth();
  const [step, setStep] = useState(1); // 1: contact, 2: OTP, 3: new pass, 4: success
  const [contact, setContact] = useState('fahad.salem@math.edu.sa');
  const [otp, setOtp] = useState(['1', '2', '3', '4']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const otpInputRefs = useRef([]);

  const handleOtpChange = (index, rawVal) => {
    const val = rawVal.replace(/\D/g, '').slice(-1);
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);
    if (val && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const calculateStrength = (pass) => {
    if (!pass) return { score: 0, text: 'أدخل كلمة المرور', color: 'var(--text-muted)' };
    if (pass.length < 6) return { score: 25, text: 'ضعيفة جداً', color: '#ef4444' };
    if (pass.length < 8) return { score: 50, text: 'متوسطة', color: '#f59e0b' };
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) return { score: 100, text: 'قوية وممتازة', color: '#10b981' };
    return { score: 75, text: 'جيدة', color: '#3b82f6' };
  };

  const strength = calculateStrength(newPassword);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (isLiveBackend && contact.includes('@')) {
      const res = await resetPassword(contact.trim());
      if (res.success) {
        setStep(2);
        showToast(`تم إرسال رابط ورمز الاستعادة إلى ${contact}`, 'success');
      } else {
        showToast(res.error || 'تعذر إرسال رمز الاستعادة', 'danger');
      }
    } else {
      setStep(2);
      showToast(`تم إرسال رمز التحقق إلى ${contact}`, 'success');
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.some((digit) => !digit.trim())) {
      showToast('يرجى إدخال رمز التحقق المكون من 4 أرقام كاملاً', 'warning');
      return;
    }
    setStep(3);
    showToast('تم التحقق من الرمز بنجاح! أدخل كلمة المرور الجديدة', 'success');
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل!', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('كلمتا المرور غير متطابقتين!', 'danger');
      return;
    }
    if (!isLiveBackend) {
      await updatePassword('', newPassword);
    }
    setStep(4);
    showToast('تم تحديث كلمة المرور بنجاح!', 'success');
  };

  return (
    <div style={{ maxWidth: '560px', margin: '40px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setCurrentScreen('04')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
        >
          ← العودة لتسجيل الدخول
        </button>
        <span className="badge badge-warning">05 استعادة كلمة المرور</span>
      </div>

      <div className="glass-card" style={{ padding: '36px' }}>
        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', position: 'relative' }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2 }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: step >= s ? '#4f46e5' : 'var(--bg-subtle-strong)',
                color: step >= s ? '#fff' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '14px',
                border: step === s ? '2px solid #38bdf8' : 'none'
              }}>
                {s}
              </div>
              <span style={{ fontSize: '11px', color: step >= s ? 'var(--text-heading)' : 'var(--text-muted)' }}>
                {s === 1 ? 'البريد/الهاتف' : s === 2 ? 'رمز OTP' : 'كلمة السر'}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: Enter email/phone */}
        {step === 1 && (
          <form onSubmit={handleSendCode}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔐</div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-heading)' }}>استعادة كلمة المرور</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>أدخل بريدك الإلكتروني أو رقم الجوال المرتبط بحسابك</p>
            </div>

            <div className="form-group">
              <label className="form-label">البريد الإلكتروني أو رقم الجوال:</label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="form-input"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              إرسال رمز التحقق (OTP) ✉️
            </button>
          </form>
        )}

        {/* STEP 2: Enter 4-digit OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>📱</div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-heading)' }}>أدخل رمز التحقق</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>أرسلنا رمزاً مكوناً من 4 أرقام إلى {contact}</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px', direction: 'ltr' }}>
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  ref={(el) => { otpInputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  required
                  value={otp[i]}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  style={{
                    width: '54px',
                    height: '58px',
                    textAlign: 'center',
                    fontSize: '24px',
                    fontWeight: '900',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-card)',
                    borderRadius: '12px',
                    color: '#38bdf8',
                    fontFamily: 'var(--font-en)'
                  }}
                />
              ))}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              تأكيد الرمز والمتابعة ➡️
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                type="button"
                onClick={handleSendCode}
                style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '12px', cursor: 'pointer' }}
              >
                لم يصلك الرمز؟ إعادة الإرسال
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Enter New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔑</div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-heading)' }}>تعيين كلمة المرور الجديدة</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>اختر كلمة مرور قوية تحتوي أرقاماً وحروفاً</p>
            </div>

            <div className="form-group">
              <label className="form-label">كلمة المرور الجديدة:</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            {/* Password strength meter */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>مستوى الأمان:</span>
                <span style={{ color: strength.color, fontWeight: '800' }}>{strength.text}</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-subtle-strong)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${strength.score}%`, height: '100%', background: strength.color, transition: 'all 0.3s' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">تأكيد كلمة المرور:</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            <button type="submit" className="btn btn-success" style={{ width: '100%', padding: '12px' }}>
              حفظ كلمة المرور وتأكيد الحساب ✅
            </button>
          </form>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '54px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#10b981', marginBottom: '8px' }}>
              تم استعادة الحساب بنجاح!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
              يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة والعودة لمغامرات الرياضيات.
            </p>
            <button
              type="button"
              onClick={() => setCurrentScreen('04')}
              className="btn btn-primary"
              style={{ padding: '12px 30px' }}
            >
              الانتقال لتسجيل الدخول 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
