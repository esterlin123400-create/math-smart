import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { mockRecordsList } from '../data/mockData';
import { getAllQuizResults } from '../services/dbService';
import { readStorageJson, writeStorageJson } from '../utils/platformHelpers';
import { playSuccessChime } from '../utils/soundEffects';

const STATUS_META = {
  'متميز': { color: '#10b981', badgeType: 'success' },
  'بطل الجولة': { color: '#38bdf8', badgeType: 'primary' },
  'جيد جداً': { color: '#fbbf24', badgeType: 'warning' },
  'يحتاج تدريب': { color: '#f87171', badgeType: 'danger' }
};

export const RecordsManagement = () => {
  const { setCurrentScreen, showToast } = useApp();
  const [records, setRecords] = useState(() => readStorageJson('math_smart_records_v1', mockRecordsList));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActivity, setFilterActivity] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [newRec, setNewRec] = useState({
    studentName: '',
    grade: 'الصف السادس',
    activity: 'تقييم ذكي - الوحدة 3',
    result: '95%',
    status: 'متميز'
  });

  useEffect(() => {
    writeStorageJson('math_smart_records_v1', records);
  }, [records]);

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.studentName.includes(searchTerm) || r.id.includes(searchTerm) || r.grade.includes(searchTerm);
    const matchesActivity = filterActivity === 'ALL' || r.activity.includes(filterActivity);
    return matchesSearch && matchesActivity;
  });

  const handleDelete = (id) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    showToast(`تم حذف السجل ${id} بنجاح`, 'info');
  };

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!newRec.studentName.trim()) return;
    const meta = STATUS_META[newRec.status] || STATUS_META['متميز'];
    const created = {
      id: `REC-${Date.now().toString().slice(-4)}`,
      studentName: newRec.studentName.trim(),
      grade: newRec.grade,
      date: new Date().toISOString().slice(0, 10),
      activity: newRec.activity.trim() || 'تقييم ذكي',
      result: newRec.result.trim() || '90%',
      status: newRec.status,
      color: meta.color,
      badgeType: meta.badgeType
    };
    setRecords(prev => [created, ...prev]);
    setNewRec({ studentName: '', grade: 'الصف السادس', activity: 'تقييم ذكي - الوحدة 3', result: '95%', status: 'متميز' });
    setShowAddModal(false);
    playSuccessChime();
    showToast(`تمت إضافة السجل #${created.id} للطالب ${created.studentName} بنجاح!`, 'success');
  };

  const handleUpdateRecordStatus = (id, nextStatus) => {
    const meta = STATUS_META[nextStatus] || STATUS_META['متميز'];
    setRecords(prev => prev.map(r => (r.id === id ? { ...r, status: nextStatus, color: meta.color, badgeType: meta.badgeType } : r)));
    setSelectedRecord(prev => (prev && prev.id === id ? { ...prev, status: nextStatus, color: meta.color, badgeType: meta.badgeType } : prev));
    showToast(`تم تحديث حالة السجل #${id} إلى "${nextStatus}"`, 'success');
  };

  const handleRefreshRecords = async () => {
    setSyncing(true);
    const res = await getAllQuizResults();
    setSyncing(false);

    if (res.mode !== 'demo' && res.success && res.data.length > 0) {
      const mapped = res.data.map(row => {
        const pct = `${row.score ?? 0}%`;
        const status = (row.score ?? 0) >= 90 ? 'متميز' : (row.score ?? 0) >= 80 ? 'جيد جداً' : 'يحتاج تدريب';
        const meta = STATUS_META[status];
        return {
          id: `SB-${String(row.id).slice(0, 4).toUpperCase()}`,
          studentName: row.profiles?.full_name || 'طالب مسجل',
          grade: row.grade || 'الصف السادس',
          date: String(row.created_at || '').slice(0, 10),
          activity: row.exam_title || 'تقييم ذكي',
          result: pct,
          status,
          color: meta.color,
          badgeType: meta.badgeType
        };
      });
      setRecords(mapped);
      showToast(`تمت مزامنة ${mapped.length} سجل من قاعدة بيانات Supabase!`, 'success');
      return;
    }

    const latestLocal = readStorageJson('math_smart_latest_result_v1', null);
    if (latestLocal && latestLocal.examTitle) {
      const scoreVal = Number(latestLocal.score) || 0;
      const status = scoreVal >= 90 ? 'متميز' : scoreVal >= 80 ? 'جيد جداً' : 'يحتاج تدريب';
      const meta = STATUS_META[status];
      const latestRec = {
        id: `REC-LOC-${latestLocal.completedAt || 'NEW'}`,
        studentName: 'فهد عبدالعزيز السالم (جلسة حديثة)',
        grade: latestLocal.grade || 'الصف السادس',
        date: latestLocal.completedAt || new Date().toISOString().slice(0, 10),
        activity: latestLocal.examTitle,
        result: `${scoreVal}%`,
        status,
        color: meta.color,
        badgeType: meta.badgeType
      };
      setRecords(prev => (prev.some(r => r.id === latestRec.id) ? prev : [latestRec, ...prev]));
    } else if (records.length === 0) {
      setRecords(mockRecordsList);
    }
    showToast('تم تحديث ومزامنة السجلات بنجاح!', 'success');
  };

  const escapeCsvCell = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;

  const handleExportCSV = () => {
    const header = ['رقم السجل', 'اسم الطالب', 'المرحلة', 'التاريخ', 'نوع النشاط', 'النتيجة', 'الحالة'].map(escapeCsvCell).join(',');
    const rows = filteredRecords.map(r => [r.id, r.studentName, r.grade, r.date, r.activity, r.result, r.status].map(escapeCsvCell).join(','));
    const csvContent = `\uFEFF${header}\n${rows.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `math_smart_records_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    playSuccessChime();
    showToast('تم تصدير ملف السجلات بترميز UTF-8 (CSV متوافق مع Excel) بنجاح!', 'success');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setCurrentScreen('hub')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
        >
          ← العودة لمعرض الواجهات
        </button>
        <span className="badge badge-primary">07 إدارة السجلات</span>
      </div>

      <div className="page-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 className="hero-title">لوحة التحكم وإدارة السجلات المركزية</h1>
            <p className="hero-subtitle">
              إدارة أرشيف سجلات الطلاب، نتائج التقييمات الذكية، وجولات حلبة التحديات مع أدوات البحث والتصدير
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => setShowAddModal(true)} className="btn btn-primary">
              ➕ إضافة سجل
            </button>
            <button type="button" onClick={handleExportCSV} className="btn btn-success">
              📥 تصدير السجلات CSV
            </button>
            <button
              type="button"
              onClick={handleRefreshRecords}
              disabled={syncing}
              className="btn btn-secondary"
            >
              {syncing ? 'جاري المزامنة...' : '🔄 تحديث السجلات'}
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ marginBottom: '24px', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1', minWidth: 'min(100%, 240px)' }}>
            <input
              type="text"
              placeholder="ابحث برقم السجل، اسم الطالب، أو المرحلة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>نوع النشاط:</span>
            {[
              { id: 'ALL', name: 'الكل' },
              { id: 'تقييم', name: 'تقييم ذكي' },
              { id: 'تحدي', name: 'تحدي مباشر' },
              { id: 'مسائل', name: 'حل مسائل' }
            ].map(f => (
              <button
                type="button"
                key={f.id}
                onClick={() => setFilterActivity(f.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid var(--border-card)',
                  background: filterActivity === f.id ? '#4f46e5' : 'var(--bg-subtle)',
                  color: filterActivity === f.id ? '#fff' : 'var(--text-body)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '700'
                }}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>رقم السجل</th>
                <th>اسم الطالب</th>
                <th>المرحلة الدراسية</th>
                <th>التاريخ</th>
                <th>نوع النشاط</th>
                <th>النتيجة</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    لا توجد سجلات مطابقة للبحث
                  </td>
                </tr>
              ) : (
                filteredRecords.map(rec => (
                  <tr key={rec.id}>
                    <td style={{ fontFamily: 'var(--font-en)', fontWeight: '800', color: '#38bdf8' }}>
                      #{rec.id}
                    </td>
                    <td style={{ fontWeight: '800', color: 'var(--text-heading)' }}>{rec.studentName}</td>
                    <td>{rec.grade}</td>
                    <td style={{ fontFamily: 'var(--font-en)', fontSize: '13px' }}>{rec.date}</td>
                    <td>{rec.activity}</td>
                    <td><strong style={{ color: rec.color, fontFamily: 'var(--font-en)', fontSize: '15px' }}>{rec.result}</strong></td>
                    <td><span className={`badge badge-${rec.badgeType}`}>{rec.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedRecord(rec)}
                          style={{
                            padding: '6px 10px',
                            background: 'var(--bg-subtle)',
                            border: '1px solid var(--border-card)',
                            borderRadius: '8px',
                            color: '#38bdf8',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                          title="عرض تفاصيل السجل"
                        >
                          تفاصيل 👁️
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(rec.id)}
                          style={{
                            padding: '6px 10px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            color: '#f87171',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                          title="حذف هذا السجل"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRecord && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
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
            maxWidth: '540px',
            padding: '30px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-heading)' }}>
                تفاصيل السجل #{selectedRecord.id}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-card)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>اسم الطالب:</span>
                <strong style={{ color: 'var(--text-heading)' }}>{selectedRecord.studentName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-card)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>المرحلة الدراسية:</span>
                <span style={{ color: 'var(--text-heading)' }}>{selectedRecord.grade}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-card)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>نوع النشاط:</span>
                <span style={{ color: 'var(--text-heading)' }}>{selectedRecord.activity}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-card)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>تاريخ الإنجاز:</span>
                <span style={{ fontFamily: 'var(--font-en)', color: 'var(--text-heading)' }}>{selectedRecord.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-card)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>النتيجة المكتسبة:</span>
                <strong style={{ color: selectedRecord.color, fontSize: '18px' }}>{selectedRecord.result}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', paddingTop: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>تحديث التقييم:</span>
                <select
                  value={selectedRecord.status}
                  onChange={(e) => handleUpdateRecordStatus(selectedRecord.id, e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', minWidth: '150px', padding: '6px 12px', fontSize: '12px' }}
                >
                  <option value="متميز">متميز</option>
                  <option value="بطل الجولة">بطل الجولة</option>
                  <option value="جيد جداً">جيد جداً</option>
                  <option value="يحتاج تدريب">يحتاج تدريب</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setSelectedRecord(null);
                  setCurrentScreen('01');
                }}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                فتح تقرير التقييم الكامل 🔍
              </button>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="btn btn-secondary"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
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
            maxWidth: '480px',
            padding: '28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-heading)' }}>
                إضافة سجل طالب جديد
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddRecord}>
              <div className="form-group">
                <label className="form-label">اسم الطالب:</label>
                <input
                  type="text"
                  required
                  value={newRec.studentName}
                  onChange={(e) => setNewRec({ ...newRec, studentName: e.target.value })}
                  placeholder="مثال: عبدالله محمد الحربي"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">المرحلة الدراسية:</label>
                <input
                  type="text"
                  required
                  value={newRec.grade}
                  onChange={(e) => setNewRec({ ...newRec, grade: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">نوع النشاط:</label>
                <input
                  type="text"
                  required
                  value={newRec.activity}
                  onChange={(e) => setNewRec({ ...newRec, activity: e.target.value })}
                  className="form-input"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">النتيجة:</label>
                  <input
                    type="text"
                    required
                    value={newRec.result}
                    onChange={(e) => setNewRec({ ...newRec, result: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">الحالة:</label>
                  <select
                    value={newRec.status}
                    onChange={(e) => setNewRec({ ...newRec, status: e.target.value })}
                    className="form-select"
                  >
                    <option value="متميز">متميز</option>
                    <option value="بطل الجولة">بطل الجولة</option>
                    <option value="جيد جداً">جيد جداً</option>
                    <option value="يحتاج تدريب">يحتاج تدريب</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  حفظ السجل ✅
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
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
