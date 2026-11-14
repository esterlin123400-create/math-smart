import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { readStorageJson, writeStorageJson } from '../utils/platformHelpers';
import { playSuccessChime } from '../utils/soundEffects';

const INITIAL_ASSIGNMENTS = [
  { id: 'ASG-101', title: 'اختبار المعادلات الخطية وميزان الكتل', targetClass: 'فصل 6A (الرياضيات المتقدمة)', createdAt: '2026-10-30', active: true },
  { id: 'ASG-102', title: 'تدريبات الكسور الاعتيادية والنسب المئوية', targetClass: 'فصل 6B (الرياضيات الأساسية)', createdAt: '2026-10-29', active: true },
  { id: 'ASG-103', title: 'مراجعة الهندسة وحساب المساحات', targetClass: 'جميع طلاب الصف السادس', createdAt: '2026-10-28', active: true }
];

export const TeacherDashboard = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState('6A');
  const [showAddModal, setShowAddModal] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [targetClass, setTargetClass] = useState('فصل 6A (الرياضيات المتقدمة)');
  const [assignments, setAssignments] = useState(() => readStorageJson('math_smart_assignments_v1', INITIAL_ASSIGNMENTS));

  useEffect(() => {
    writeStorageJson('math_smart_assignments_v1', assignments);
  }, [assignments]);

  const activeAssignmentsCount = assignments.filter(a => a.active).length;

  const stats = [
    { label: 'إجمالي الطلاب المسجلين', value: '96 طالباً', icon: '👨‍🎓', color: '#38bdf8', change: '+12 هذا الشهر' },
    { label: 'متوسط نسبة الإتقان', value: '88.4%', icon: '📈', color: '#10b981', change: '+4.2% تحسن عام' },
    { label: 'الاختبارات والتقييمات النشطة', value: `${activeAssignmentsCount} اختبارات`, icon: '📝', color: '#a855f7', change: `${assignments.length} إجمالي المرسلة` },
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
    const newAssignment = {
      id: `ASG-${Date.now().toString().slice(-4)}`,
      title: assignmentTitle.trim(),
      targetClass,
      createdAt: new Date().toISOString().slice(0, 10),
      active: true
    };
    setAssignments(prev => [newAssignment, ...prev]);
    playSuccessChime();
    showToast(`تم إنشاء وحفظ الواجب "${assignmentTitle}" للفصل بنجاح!`, 'success');
    setAssignmentTitle('');
    setShowAddModal(false);
  };

  const handleToggleAssignment = (id) => {
    setAssignments(prev => prev.map(a => (a.id === id ? { ...a, active: !a.active } : a)));
  };

  const handleDeleteAssignment = (id) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    showToast('تم حذف الواجب من القائمة النشطة', 'info');
  };

  return (
    <div>
      {/* Header */}
      <div className="page-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-primary">02 لوحة تحكم المعلم</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>مرحباً بك، {user?.name || 'أ. طارق العمري'}</span>
            </div>
            <h1 className="hero-title">لوحة المعلم الشاملة لإدارة الرياضيات</h1>
            <p className="hero-subtitle">متابعة دقيقة لمستويات الطلاب، نتائج التقييم التلقائي، وتوزيع التحديات</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              ➕ إنشاء واجب / اختبار ذكي
            </button>
            <button
              type="button"
              onClick={() => setCurrentScreen('08')}
              className="btn btn-secondary"
            >
              📊 التقارير الأكاديمية
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {stats.map((st, i) => (
          <div key={i} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'var(--bg-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              flexShrink: 0
            }}>
              {st.icon}
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{st.label}</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-heading)', fontFamily: 'var(--font-en)' }}>{st.value}</div>
              <div style={{ fontSize: '11px', color: st.color, fontWeight: '700' }}>{st.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-heading)' }}>سجل متابعة طلاب الرياضيات</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>قائمة الطلاب، نسب الإنجاز التفاعلية، والتقييمات الأخيرة</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>الفصل:</span>
            {['ALL', '6A', '6B'].map(cls => (
              <button
                type="button"
                key={cls}
                onClick={() => setSelectedClass(cls)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid var(--border-card)',
                  background: selectedClass === cls ? '#4f46e5' : 'var(--bg-subtle)',
                  color: selectedClass === cls ? '#fff' : 'var(--text-body)',
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
                  <td style={{ fontWeight: '800', color: 'var(--text-heading)' }}>{student.name}</td>
                  <td><span className="badge badge-primary">{student.class}</span></td>
                  <td style={{ width: '180px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ flex: 1, height: '6px', background: 'var(--bg-subtle-strong)', borderRadius: '4px', overflow: 'hidden' }}>
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
                      type="button"
                      onClick={() => {
                        setCurrentScreen('01');
                        showToast(`جاري فتح التقييم الذكي للطالب ${student.name}`, 'info');
                      }}
                      style={{
                        padding: '6px 12px',
                        background: 'var(--bg-subtle)',
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

      {/* Saved Assignments Section */}
      <div className="glass-card" style={{ padding: '24px', marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-heading)' }}>
            الواجبات والتقييمات المنشورة ({assignments.length})
          </h2>
          <button type="button" onClick={() => setShowAddModal(true)} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '12px' }}>
            ➕ إضافة واجب
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {assignments.map(asg => (
            <div key={asg.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '12px 16px',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-card)',
              borderRadius: '12px'
            }}>
              <div>
                <div style={{ fontWeight: '800', color: 'var(--text-heading)', fontSize: '14px' }}>{asg.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {asg.targetClass} • تاريخ الإنشاء: {asg.createdAt}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleToggleAssignment(asg.id)}
                  className={`badge ${asg.active ? 'badge-success' : 'badge-warning'}`}
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  {asg.active ? 'نشط ✓' : 'متوقف'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteAssignment(asg.id)}
                  style={{
                    padding: '4px 10px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#f87171',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  title="حذف الواجب"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
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
            background: 'var(--bg-modal)',
            border: '1px solid var(--border-card)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '500px',
            padding: '30px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '16px' }}>
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
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="form-select"
                >
                  <option value="فصل 6A (الرياضيات المتقدمة)">فصل 6A (الرياضيات المتقدمة)</option>
                  <option value="فصل 6B (الرياضيات الأساسية)">فصل 6B (الرياضيات الأساسية)</option>
                  <option value="جميع طلاب الصف السادس">جميع طلاب الصف السادس</option>
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
