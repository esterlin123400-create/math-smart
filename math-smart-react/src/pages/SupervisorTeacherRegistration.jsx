import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const SupervisorTeacherRegistration = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { loginAs } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'teacher',
    schoolName: '',
    city: 'الرياض',
    nationalId: '',
    licenseNumber: '',
    assignedStage: 'الصف السادس الابتدائي'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginAs('teacher');
    showToast(`تم إنشاء وتوثيق حساب المعلم/المشرف ${formData.name} بنجاح!`, 'success');
    setCurrentScreen('02'); // Jump to teacher dashboard
  };

  return (
    <div style={{ maxWidth: '680px', margin: '30px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setCurrentScreen('hub')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
        >
          ← العودة لمعرض الواجهات
        </button>
        <span className="badge badge-success">14 إنشاء حساب مشرف ومعلم</span>
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
            إنشاء حساب معلم أو مشرف تربوي جديد
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            سجل بياناتك المعتمدة للوصول إلى بنك الاختبارات الذكي، أدوات إدارة الفصول، والتقارير المتقدمة
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">الاسم الثلاثي أو الرباعي:</label>
              <input
                type="text"
                required
                placeholder="أ. خالد بن عبدالله التميمي"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">البريد الإلكتروني المهني:</label>
              <input
                type="email"
                required
                placeholder="teacher@schools.edu.sa"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">الصفة المهنية:</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="form-select"
              >
                <option value="teacher">معلم رياضيات ممارس</option>
                <option value="lead">رئيس قسم الرياضيات</option>
                <option value="supervisor">مشرف تربوي رياضيات</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">المدينة / الإدارة التعليمية:</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="form-select"
              >
                <option value="الرياض">إدارة تعليم الرياض</option>
                <option value="جدة">إدارة تعليم جدة</option>
                <option value="المنطقة الشرقية">إدارة تعليم المنطقة الشرقية</option>
                <option value="مكة المكرمة">إدارة تعليم مكة المكرمة</option>
                <option value="القصيم">إدارة تعليم القصيم</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">اسم المدرسة أو المجمع التعليمي:</label>
              <input
                type="text"
                required
                placeholder="مدارس المناهج الأهلية"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">رقم الرخصة المهنية التعليمية:</label>
              <input
                type="text"
                required
                placeholder="LIC-99281"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ marginTop: '20px', marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-body)', cursor: 'pointer' }}>
              <input type="checkbox" required defaultChecked />
              أوافق على ميثاق النزاهة الأكاديمية وضوابط استخدام أدوات التقييم الذكي
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px' }}>
            توثيق الحساب والدخول لمنصة المعلم 🎓
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          لديك حساب مسجل بالفعل؟{' '}
          <button
            onClick={() => setCurrentScreen('10')}
            style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: '800', cursor: 'pointer' }}
          >
            سجل دخولك هنا
          </button>
        </div>
      </div>
    </div>
  );
};
