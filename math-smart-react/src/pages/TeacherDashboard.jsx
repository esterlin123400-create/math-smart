import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { mockUserData } from '../data/mockData';

export const TeacherDashboard = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState('6A');
  const [showAddModal, setShowAddModal] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('');

  const stats = [
    { label: 'إجمالي الطلاب المسجلين', value: '96 طالباً', icon: '👨‍🎓', color: '#38bdf8', change: '+12 هذا الشهر' },
    { label: 'متوسط نسبة الإتقان', value: '88.4%', icon: '📈', color: '#10b981', change: '+4.2% تحسن عام' },
    { label: 'الاختبارات والتقييمات النشطة', value: '3 اختبارات', icon: '📝', color: '#a855f7', change: 'تنتهي اليوم' },
    { label: 'التحديات المباشرة اليوم', value: '14 جولة', icon: '⚡', color: '#f59e0b', change: 'معدل تنافسي عالي' }
  ];

  const students = [
    { id: 1, name: 'فهد عبدالعزيز السالم', class: '6A', progress: 94, status: 'متميز', lastActivity: 'قبل 10 دقائق', score: '92%' },
    { id: 2, name: 'سارة فهد الخالدي', class: '6A', progress: 96, status: 'متفوقة جداً', lastActivity: 'قبل نصف ساعة', score: '98%' },
    { id: 3, name: 'ريان خالد القحطاني', class: '6A', progress: 84, status: 'جيد جداً', lastActivity: 'منذ ساعتين', score: '84%' },
    { id: 4, name: 'عمر ماجد الدوسري', class: '6B', progress: 72, status: 'يحتاج متابعة', lastActivity: 'يوم أمس', score: '70%' },
    { id: 5, name: 'نورة محمد الغامدي', class: '6B', progress: 90, status: 'متميزة', lastActivity: 'قبل 4 ساعات', score: '91%' }
  ];

  const filteredStudents = selectedClass === 'ALL' ? students : students.filter(s => s.class === selectedClass);

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!assignmentTitle.trim()) return;
    showToast(`تم إرسال الواجب "${assignmentTitle}" لجميع طلاب الفصل بنجاح!`, 'success');
    setAssignmentTitle('');
    setShowAddModal(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-primary">02 لوحة تحكم المعلم</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>مرحباً بك، {user.name}</span>
            </div>
            <h1 className="hero-title">لوحة المعلم الشاملة لإدارة الرياضيات</h1>
            <p className="hero-subtitle">متابعة دقيقة لمستويات الطلاب، نتائج التقييم التلقائي، وتوزيع التحديات</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              ➕ إنشاء واجب / اختبار ذكي
            </button>
            <button
              onClick={() => setCurrentScreen('08')}
              className="btn btn-secondary"
            >
              📊 التقارير الأكاديمية
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {stats.map((st, i) => (
          <div key={i} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: `rgba(255, 255, 255, 0.05)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px'
            }}>
              {st.icon}
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{st.label}</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#fff', fontFamily: 'var(--font-en)' }}>{st.value}</div>
              <div style={{ fontSize: '11px', color: st.color, fontWeight: '700' }}>{st.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>سجل متابعة طلاب الرياضيات</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>قائمة الطلاب، نسب الإنجاز التفاعلية، والتقييمات الأخيرة</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>الفصل:</span>
            {['ALL', '6A', '6B'].map(cls => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: 'none',
                  background: selectedClass === cls ? '#4f46e5' : 'rgba(255, 255, 255, 0.06)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '700'
                }}
              >
                {cls === 'ALL' ? 'جميع الفصول' : `فصل ${cls}`}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>اسم الطالب</th>
                <th>الفصل</th>
                <th>نسبة إنجاز المنهج</th>
                <th>آخر نتيجة تقييم</th>
                <th>الحالة</th>
                <th>آخر نشاط</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td style={{ fontWeight: '800', color: '#fff' }}>{student.name}</td>
                  <td><span className="badge badge-primary">{student.class}</span></td>
                  <td style={{ width: '180px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${student.progress}%`, height: '100%', background: 'linear-gradient(90deg, #4f46e5, #06b6d4)' }} />
                      </div>
                      <span style={{ fontSize: '12px', fontFamily: 'var(--font-en)' }}>{student.progress}%</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: '800', color: '#10b981', fontFamily: 'var(--font-en)' }}>{student.score}</td>
                  <td>
                    <span className={`badge ${student.progress > 85 ? 'badge-success' : 'badge-warning'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{student.lastActivity}</td>
                  <td>
                    <button
                      onClick={() => {
                        setCurrentScreen('01');
                        showToast(`جاري فتح التقييم الذكي للطالب ${student.name}`, 'info');
                      }}
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-card)',
                        borderRadius: '8px',
                        color: '#38bdf8',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontFamily: 'var(--font-ar)'
                      }}
                    >
                      عرض التقرير 🔍
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid var(--border-card)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '500px',
            padding: '30px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>
              إنشاء واجب أو تحدي جديد للفصل
            </h3>
            <form onSubmit={handleCreateAssignment}>
              <div className="form-group">
                <label className="form-label">عنوان الواجب أو الاختبار:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تحدي المعادلات التربيعية وحساب المساحة"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">الفصل المستهدف:</label>
                <select className="form-select">
                  <option>فصل 6A (الرياضيات المتقدمة)</option>
                  <option>فصل 6B (الرياضيات الأساسية)</option>
                  <option>جميع طلاب الصف السادس</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  إرسال وتفعيل التحدي الآن
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
