import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { screensCatalog } from '../data/screensCatalog';

export const AccessDeniedGuard = ({ attemptedScreen }) => {
  const { setCurrentScreen } = useApp();
  const { role, loginAs, getRoleNameArabic, getDefaultDashboard, ROLE_PERMISSIONS } = useAuth();

  const screenInfo = screensCatalog.find(s => s.id === attemptedScreen) || {
    id: attemptedScreen,
    title: attemptedScreen === 'hub' ? 'الصفحة الرئيسية' : `شاشة رقم (${attemptedScreen})`,
    icon: '🔒',
    category: 'نظام المنصة'
  };

  const roleConfig = ROLE_PERMISSIONS?.[role] || {
    name: getRoleNameArabic ? getRoleNameArabic(role) : role,
    home: 'hub',
    deniedMessage: 'لا تملك صلاحية الوصول إلى هذه الصفحة وفق إعدادات حسابك.'
  };

  // Find who has access to this screen
  const authorizedRoles = Object.entries(ROLE_PERMISSIONS || {})
    .filter(([rKey, config]) => rKey !== 'guest' && config.allowedScreens?.includes(attemptedScreen))
    .map(([_, config]) => config.name);

  const homeScreen = getDefaultDashboard ? getDefaultDashboard(role) : (role === 'admin' ? '07' : role === 'teacher' ? '02' : role === 'parent' ? '16' : '13');

  return (
    <div style={{ maxWidth: '780px', margin: '40px auto', padding: '0 16px' }}>
      <div className="glass-card" style={{
        padding: '48px 36px',
        textAlign: 'center',
        borderRadius: '28px',
        border: '1.5px solid rgba(249, 115, 22, 0.35)',
        background: 'linear-gradient(180deg, rgba(254, 243, 199, 0.15) 0%, var(--bg-card) 100%)',
        boxShadow: '0 20px 45px rgba(249, 115, 22, 0.08)'
      }}>
        {/* Shield & Lock Badge */}
        <div style={{
          width: '84px',
          height: '84px',
          borderRadius: '26px',
          background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.2), rgba(249, 115, 22, 0.15))',
          border: '2px solid rgba(251, 146, 60, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '38px',
          margin: '0 auto 20px',
          boxShadow: '0 10px 25px rgba(249, 115, 22, 0.15)'
        }}>
          🛡️
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '20px',
          background: 'rgba(249, 115, 22, 0.12)',
          color: '#ea580c',
          fontSize: '12px',
          fontWeight: '800',
          marginBottom: '16px',
          border: '1px solid rgba(249, 115, 22, 0.25)'
        }}>
          <span>🔒</span>
          <span>حماية الصلاحيات والخصوصية (RBAC Security Guard)</span>
        </div>

        <h1 style={{
          fontSize: '26px',
          fontWeight: '900',
          color: 'var(--text-heading)',
          marginBottom: '12px'
        }}>
          هذه الصفحة مخصصة لأدوار محددة فقط
        </h1>

        <div style={{
          padding: '16px',
          background: 'var(--bg-subtle)',
          borderRadius: '16px',
          border: '1px solid var(--border-card)',
          maxWidth: '560px',
          margin: '0 auto 24px',
          textAlign: 'right'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>{screenInfo.icon}</span>
            <div>
              <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-heading)' }}>{screenInfo.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{screenInfo.subtitle || screenInfo.category}</div>
            </div>
          </div>
          <hr style={{ borderColor: 'var(--border-card)', opacity: 0.6, margin: '10px 0' }} />
          <div style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.7 }}>
            <div>• <strong>دورك الحالي:</strong> <span style={{ color: 'var(--primary)', fontWeight: '800' }}>{roleConfig.name}</span></div>
            {authorizedRoles.length > 0 && (
              <div>• <strong>المصرح لهم فقط:</strong> {authorizedRoles.join('، ')}</div>
            )}
            <div style={{ marginTop: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>
              {roleConfig.deniedMessage}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginTop: '8px'
        }}>
          {role !== 'guest' ? (
            <button
              type="button"
              onClick={() => setCurrentScreen(homeScreen)}
              className="btn btn-primary"
              style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '16px' }}
            >
              <span>⬅</span>
              <span>الانتقال إلى لوحة تحكم {roleConfig.name}</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  loginAs('student');
                  setCurrentScreen('13');
                }}
                className="btn btn-primary"
                style={{ padding: '10px 20px', fontSize: '13px', borderRadius: '14px' }}
              >
                🎒 دخول كطالب
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAs('teacher');
                  setCurrentScreen('02');
                }}
                className="btn btn-secondary"
                style={{ padding: '10px 20px', fontSize: '13px', borderRadius: '14px' }}
              >
                👨‍🏫 دخول كمعلم
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAs('parent');
                  setCurrentScreen('16');
                }}
                className="btn btn-secondary"
                style={{ padding: '10px 20px', fontSize: '13px', borderRadius: '14px' }}
              >
                👨‍👩‍👧 دخول كولي أمر
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setCurrentScreen('hub')}
            className="btn btn-secondary"
            style={{ padding: '12px 20px', fontSize: '14px', borderRadius: '16px' }}
          >
            🏛️ الصفحة الرئيسية
          </button>
        </div>

        {/* Quick Role Switcher for Testing & Ease of Use */}
        <div style={{
          marginTop: '36px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-card)',
          fontSize: '12px',
          color: 'var(--text-muted)'
        }}>
          <span style={{ marginLeft: '8px' }}>للتجربة السريعة، بدّل حسابك مباشرة:</span>
          <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => {
                loginAs('admin');
                setCurrentScreen(attemptedScreen === '07' || attemptedScreen === '08' || attemptedScreen === '02' ? attemptedScreen : '07');
              }}
              style={{
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                color: '#0284c7',
                padding: '4px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '700',
                fontFamily: 'var(--font-ar)'
              }}
            >
              مدير النظام (م. عبدالعزيز) 🛠️
            </button>
            <button
              type="button"
              onClick={() => {
                loginAs('student');
                setCurrentScreen(attemptedScreen === '13' || attemptedScreen === '09' || attemptedScreen === '03' || attemptedScreen === '17' ? attemptedScreen : '13');
              }}
              style={{
                background: 'rgba(251, 146, 60, 0.1)',
                border: '1px solid rgba(251, 146, 60, 0.3)',
                color: '#ea580c',
                padding: '4px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontFamily: 'var(--font-ar)'
              }}
            >
              طالب عادٍ (فهد) 🎒
            </button>
            <button
              type="button"
              onClick={() => {
                loginAs('teacher');
                setCurrentScreen(attemptedScreen === '02' || attemptedScreen === '07' || attemptedScreen === '08' || attemptedScreen === '17' ? attemptedScreen : '02');
              }}
              style={{
                background: 'rgba(13, 148, 136, 0.1)',
                border: '1px solid rgba(13, 148, 136, 0.3)',
                color: '#0d9488',
                padding: '4px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontFamily: 'var(--font-ar)'
              }}
            >
              معلم (أ. طارق) 👨‍🏫
            </button>
            <button
              type="button"
              onClick={() => {
                loginAs('parent');
                setCurrentScreen('16');
              }}
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981',
                padding: '4px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontFamily: 'var(--font-ar)'
              }}
            >
              ولي أمر (عبدالعزيز) 👨‍👩‍👧
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
