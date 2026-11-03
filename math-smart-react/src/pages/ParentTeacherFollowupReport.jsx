import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ParentTeacherFollowupReport = () => {
  const { setCurrentScreen, showToast } = useApp();
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [parentNote, setParentNote] = useState('');
  const [selectedMeetingTime, setSelectedMeetingTime] = useState('الثلاثاء 04:30 مساءً (عن بُعد)');

  const handleSendNote = (e) => {
    e.preventDefault();
    if (!parentNote.trim()) return;
    showToast('تم إرسال رسالتكم وملاحظاتكم إلى الأستاذ طارق العمري بنجاح!', 'success');
    setParentNote('');
  };

  const handleBookMeeting = (e) => {
    e.preventDefault();
    showToast(`تم حجز موعد الاجتماع مع المعلم: ${selectedMeetingTime}`, 'success');
    setShowMeetingModal(false);
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
        <span className="badge badge-primary">16 تقرير متابعة ولي الأمر والمعلم</span>
      </div>

      <div className="page-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-success">تقرير دوري معتمد</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>الفصل الدراسي الأول - الأسبوع التاسع</span>
            </div>
            <h1 className="hero-title">تقرير متابعة الطالب: فهد عبدالعزيز السالم</h1>
            <p className="hero-subtitle">
              التواصل التكاملي بين المعلم وولي الأمر لمتابعة نواتج التعلم وسلوك التفكير الرياضي
            </p>
          </div>

          <button onClick={() => setShowMeetingModal(true)} className="btn btn-primary">
            📅 حجز موعد اجتماع مع المعلم
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>الحضور والتفاعل الصفي</div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#10b981', fontFamily: 'var(--font-en)' }}>98%</div>
          <span style={{ fontSize: '11px', color: '#34d399' }}>ملتزم ومبادر جداً</span>
        </div>

        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>تسليم الواجبات في موعدها</div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#38bdf8', fontFamily: 'var(--font-en)' }}>100%</div>
          <span style={{ fontSize: '11px', color: '#38bdf8' }}>14 من 14 واجب مكتمل</span>
        </div>

        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>التقييم الذكي التراكمي</div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#fbbf24', fontFamily: 'var(--font-en)' }}>92%</div>
          <span style={{ fontSize: '11px', color: '#fbbf24' }}>مستوى متقدم (Advanced)</span>
        </div>

        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>المنافسة والروح الرياضية</div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#ec4899', fontFamily: 'var(--font-en)' }}>ممتاز</div>
          <span style={{ fontSize: '11px', color: '#ec4899' }}>تعاوني مع زملائه في الفريق</span>
        </div>
      </div>

      {/* TEACHER NOTE CARD */}
      <div className="glass-card" style={{ marginBottom: '32px', padding: '30px', borderColor: 'rgba(79, 70, 229, 0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#4f46e5', padding: '6px' }}>
            <img src="/assets/avatar_math_wizard.svg" alt="Teacher" style={{ width: '100%', height: '100%' }} />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>
              ملاحظة وتوصية معلم المادة: أ. طارق عبدالملك العمري
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              معلم أول الرياضيات - مدارس رواد المعرفة
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(0, 0, 0, 0.25)',
          borderRight: '4px solid #4f46e5',
          padding: '20px 24px',
          borderRadius: '12px',
          fontSize: '14px',
          lineHeight: 1.8,
          color: 'var(--text-body)',
          marginBottom: '20px'
        }}>
          "يسرني إحاطتكم بأن الطالب فهد يظهر نبوغاً وشغفاً لافتاً في التفكير الجبري واستنتاج العلاقات بين المتغيرات. لقد حل جميع اختبارات الوحدة الثانية بكفاءة عالية وأظهر سرعة بديهة في حلبة التحديات المباشرة. نقترح الاستمرار في تشجيعه على حل المسائل الإثرائية، ومساعدته على تنظيم وقت التدريب بانتظام للحفاظ على وتيرة التميز."
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCurrentScreen('01')}
            className="btn btn-primary"
            style={{ fontSize: '13px' }}
          >
            استعراض آخر تقييم ذكي للطالب (01) 📊
          </button>
          <button
            onClick={() => setCurrentScreen('08')}
            className="btn btn-secondary"
            style={{ fontSize: '13px' }}
          >
            عرض مصفوفة المهارات الكاملة (08) 📈
          </button>
        </div>
      </div>

      {/* PARENT INTERACTIVE FEEDBACK */}
      <div className="glass-card" style={{ padding: '30px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '14px' }}>
          إرسال رسالة أو استفسار للمعلم:
        </h3>
        <form onSubmit={handleSendNote}>
          <div className="form-group">
            <textarea
              rows={3}
              value={parentNote}
              onChange={(e) => setParentNote(e.target.value)}
              placeholder="اكتب رسالتك أو استفسارك هنا (مثال: شكراً أستاذ طارق، نود الاستفسار عن مواعيد الأنشطة الإثرائية القادمة)..."
              className="form-textarea"
            />
          </div>
          <button type="submit" className="btn btn-success" style={{ padding: '10px 24px' }}>
            إرسال الملاحظة للمعلم 📨
          </button>
        </form>
      </div>

      {/* BOOK MEETING MODAL */}
      {showMeetingModal && (
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
            maxWidth: '480px',
            padding: '30px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>
              حجز موعد اجتماع تشاوري مع المعلم
            </h3>
            <form onSubmit={handleBookMeeting}>
              <div className="form-group">
                <label className="form-label">اختر الموعد المتاح:</label>
                <select
                  value={selectedMeetingTime}
                  onChange={(e) => setSelectedMeetingTime(e.target.value)}
                  className="form-select"
                >
                  <option value="الثلاثاء 04:30 مساءً (عن بُعد)">الثلاثاء 04:30 مساءً (اجتماع مرئي عن بُعد)</option>
                  <option value="الأربعاء 05:00 مساءً (عن بُعد)">الأربعاء 05:00 مساءً (اجتماع مرئي عن بُعد)</option>
                  <option value="الخميس 10:30 صباحاً (حضوري بالمدرسة)">الخميس 10:30 صباحاً (حضوري بالمدرسة)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">محور النقاش الأساسي:</label>
                <input
                  type="text"
                  placeholder="مثال: الخطة الإثرائية للاستعداد لأولمبياد الرياضيات"
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  تأكيد الحجز والإرسال 📅
                </button>
                <button
                  type="button"
                  onClick={() => setShowMeetingModal(false)}
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
