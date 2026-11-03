import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const ProfileAndSettings = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { user, updateProfile, role } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user.name || '');
  const [school, setSchool] = useState(user.school || 'مدرسة رواد المعرفة الابتدائية');
  const [email, setEmail] = useState('fahad.salem@math.edu.sa');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'preferences' | 'security'

  const avatars = [
    '/assets/avatar_fahad_hero.svg',
    '/assets/avatar_astronaut.svg',
    '/assets/avatar_robot.svg',
    '/assets/avatar_ninja.svg',
    '/assets/avatar_math_wizard.svg',
    '/assets/avatar_scientist.svg'
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, school });
    showToast('تم حفظ تحديثات الملف الشخصي بنجاح!', 'success');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setCurrentScreen('hub')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
        >
          ← العودة لمعرض الواجهات
        </button>
        <span className="badge badge-primary">11 الملف الشخصي والإعدادات</span>
      </div>

      <div className="page-hero">
        <h1 className="hero-title">الملف الشخصي وتفضيلات المنصة</h1>
        <p className="hero-subtitle">
          تخصيص الهوية الرمزية، إعدادات الأمان، المظهر البصري، وتنبيهات التحديات
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        {[
          { id: 'profile', name: 'بيانات الحساب والشخصية', icon: '👤' },
          { id: 'preferences', name: 'تفضيلات النظام والمظهر', icon: '⚙️' },
          { id: 'security', name: 'الأمان وكلمة المرور', icon: '🔒' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #4f46e5, #06b6d4)' : 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '700',
              fontFamily: 'var(--font-ar)'
            }}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* TAB 1: Profile */}
      {activeTab === 'profile' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <form onSubmit={handleSaveProfile}>
            {/* Avatar Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '30px', flexWrap: 'wrap' }}>
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: '#4f46e5',
                padding: '8px',
                boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)'
              }}>
                <img src={user.avatar || '/assets/avatar_fahad_hero.svg'} alt="Avatar" style={{ width: '100%', height: '100%' }} />
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
                  اختر شخصيتك الرمزية في المنصة:
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {avatars.map((av, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        updateProfile({ avatar: av });
                        showToast('تم تغيير الشخصية الرمزية!', 'info');
                      }}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: user.avatar === av ? '#4f46e5' : 'rgba(255, 255, 255, 0.05)',
                        border: user.avatar === av ? '2px solid #38bdf8' : '1px solid var(--border-card)',
                        padding: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <img src={av} alt="Avatar option" style={{ width: '100%', height: '100%' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">الاسم الكامل:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">البريد الإلكتروني:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">المدرسة أو المؤسسة التعليمية:</label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">المرحلة الدراسية المسجلة:</label>
                <input
                  type="text"
                  disabled
                  value={user.grade || 'الصف السادس الابتدائي'}
                  className="form-input"
                  style={{ opacity: 0.7 }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '20px', padding: '12px 30px' }}>
              حفظ التعديلات ✅
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: Preferences */}
      {activeTab === 'preferences' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '20px' }}>
            تفضيلات العرض والمؤثرات التفاعلية
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Dark / Light Mode */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px' }}>
              <div>
                <div style={{ fontWeight: '800', color: '#fff' }}>مظهر الواجهة (السمة)</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>التبديل بين الوضع الداكن والوضع الفاتح</div>
              </div>
              <button
                onClick={toggleTheme}
                className="btn btn-secondary"
                style={{ padding: '8px 16px' }}
              >
                {theme === 'dark' ? '🌙 الوضع الداكن (مفعل)' : '☀️ الوضع الفاتح (مفعل)'}
              </button>
            </div>

            {/* Sound Effects */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px' }}>
              <div>
                <div style={{ fontWeight: '800', color: '#fff' }}>المؤثرات الصوتية وأصوات الفوز</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>تشغيل نغمات الاحتفال عند حل المسائل وصعود المستويات</div>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => {
                  setSoundEnabled(e.target.checked);
                  showToast(e.target.checked ? 'تم تفعيل المؤثرات الصوتية' : 'تم كتم المؤثرات الصوتية', 'info');
                }}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>

            {/* Notifications */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px' }}>
              <div>
                <div style={{ fontWeight: '800', color: '#fff' }}>تنبيهات التحديات اليومية</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>إشعارك عند بدء جولات حلبة التحدي المباشر وإضافة واجبات جديدة</div>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => {
                  setNotificationsEnabled(e.target.checked);
                  showToast('تم حفظ تفضيلات الإشعارات', 'info');
                }}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Security */}
      {activeTab === 'security' && (
        <div className="glass-card" style={{ padding: '32px', maxWidth: '600px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '20px' }}>
            تغيير كلمة المرور وإعدادات الأمان
          </h2>
          <form onSubmit={(e) => { e.preventDefault(); showToast('تم تحديث كلمة المرور بنجاح!', 'success'); }}>
            <div className="form-group">
              <label className="form-label">كلمة المرور الحالية:</label>
              <input type="password" required className="form-input" placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label className="form-label">كلمة المرور الجديدة:</label>
              <input type="password" required className="form-input" placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label className="form-label">تأكيد كلمة المرور الجديدة:</label>
              <input type="password" required className="form-input" placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              تحديث كلمة المرور 🔒
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
