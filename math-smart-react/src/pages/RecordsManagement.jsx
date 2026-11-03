import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mockRecordsList } from '../data/mockData';

export const RecordsManagement = () => {
  const { setCurrentScreen, showToast } = useApp();
  const [records, setRecords] = useState(mockRecordsList);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActivity, setFilterActivity] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.studentName.includes(searchTerm) || r.id.includes(searchTerm) || r.grade.includes(searchTerm);
    const matchesActivity = filterActivity === 'ALL' || r.activity.includes(filterActivity);
    return matchesSearch && matchesActivity;
  });

  const handleDelete = (id) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    showToast(`تم حذف السجل ${id} بنجاح`, 'info');
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "رقم السجل,اسم الطالب,المرحلة,التاريخ,نوع النشاط,النتيجة,الحالة\n" +
      records.map(r => `${r.id},${r.studentName},${r.grade},${r.date},${r.activity},${r.result},${r.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "math_records_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('تم تصدير ملف سجلات الطلاب بتنسيق CSV بنجاح!', 'success');
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
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleExportCSV} className="btn btn-success">
              📥 تصدير السجلات CSV
            </button>
            <button
              onClick={() => showToast('تم تحديث البيانات ومزامنتها مع الخادم المركزي!', 'info')}
              className="btn btn-secondary"
            >
              🔄 تحديث السجلات
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ marginBottom: '24px', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1', minWidth: '260px' }}>
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
                key={f.id}
                onClick={() => setFilterActivity(f.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: 'none',
                  background: filterActivity === f.id ? '#4f46e5' : 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
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
                    <td style={{ fontWeight: '800', color: '#fff' }}>{rec.studentName}</td>
                    <td>{rec.grade}</td>
                    <td style={{ fontFamily: 'var(--font-en)', fontSize: '13px' }}>{rec.date}</td>
                    <td>{rec.activity}</td>
                    <td><strong style={{ color: rec.color, fontFamily: 'var(--font-en)', fontSize: '15px' }}>{rec.result}</strong></td>
                    <td><span className={`badge badge-${rec.badgeType}`}>{rec.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => setSelectedRecord(rec)}
                          style={{
                            padding: '6px 10px',
                            background: 'rgba(255, 255, 255, 0.06)',
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
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid var(--border-card)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '540px',
            padding: '30px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>
                تفاصيل السجل #{selectedRecord.id}
              </h3>
              <button
                onClick={() => setSelectedRecord(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-card)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>اسم الطالب:</span>
                <strong style={{ color: '#fff' }}>{selectedRecord.studentName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-card)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>المرحلة الدراسية:</span>
                <span style={{ color: '#fff' }}>{selectedRecord.grade}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-card)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>نوع النشاط:</span>
                <span style={{ color: '#fff' }}>{selectedRecord.activity}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-card)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>تاريخ الإنجاز:</span>
                <span style={{ fontFamily: 'var(--font-en)', color: '#fff' }}>{selectedRecord.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-card)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>النتيجة المكتسبة:</span>
                <strong style={{ color: selectedRecord.color, fontSize: '18px' }}>{selectedRecord.result}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
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
                onClick={() => setSelectedRecord(null)}
                className="btn btn-secondary"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
