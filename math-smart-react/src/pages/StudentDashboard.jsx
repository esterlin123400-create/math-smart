import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { mockUserData } from '../data/mockData';

export const StudentDashboard = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { user } = useAuth();
  const student = mockUserData.student;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setCurrentScreen('hub')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
        >
          ← العودة لمعرض الواجهات
        </button>
        <span className="badge badge-warning">13 لوحة تحكم الطالب</span>
      </div>

      {/* GAMIFIED HERO */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95))',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-card)',
        borderRadius: '28px',
        padding: '36px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #f59e0b, #ec4899, #4f46e5)'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          {/* Avatar and Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              padding: '10px',
              boxShadow: '0 12px 30px rgba(245, 158, 11, 0.4)'
            }}>
              <img
                src={user.avatar || student.avatar}
                alt="Avatar"
                className="float-anim"
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#fff' }}>
                  {user.name || student.name}
                </h1>
                <span className="badge badge-warning">المستوى {student.level}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '12px' }}>
                {student.title} • {user.grade || student.grade}
              </p>

              {/* XP Progress Bar */}
              <div style={{ width: '320px', maxWidth: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>نقاط الخبرة: {student.xp} XP</span>
                  <span>المستوى التالي: {student.nextLevelXp} XP</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(student.xp / student.nextLevelXp) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #f59e0b, #ec4899)'
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Badges / KPIs */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-card)', padding: '14px 20px', borderRadius: '18px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#f59e0b', fontFamily: 'var(--font-en)' }}>🔥 {student.streak}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>أيام حماس متتالية</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-card)', padding: '14px 20px', borderRadius: '18px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#38bdf8', fontFamily: 'var(--font-en)' }}>#{student.rank}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>الترتيب على الصف</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-card)', padding: '14px 20px', borderRadius: '18px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#10b981', fontFamily: 'var(--font-en)' }}>{student.accuracy}%</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>دقة الإجابات</div>
            </div>
          </div>
        </div>
      </div>

      {/* DAILY QUEST BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(6, 182, 212, 0.15))',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        borderRadius: '20px',
        padding: '24px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '36px' }}>🎯</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>
                المهمة اليومية: تحدي موازين الكتل الجبرية
              </h3>
              <span className="badge badge-warning">+120 XP</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-body)' }}>
              أكمل حل 3 مسائل في مختبر المسائل التفاعلية لتحافظ على سلسلة أيامك وتفتح شارة "صائد المعادلات"!
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setCurrentScreen('09');
            showToast('بدء المهمة اليومية في حل المسائل...', 'info');
          }}
          className="btn btn-primary"
          style={{ padding: '12px 28px' }}
        >
          بدء المهمة الآن 🚀
        </button>
      </div>

      {/* 2-COLUMN HUB SECTIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Quick Launch Arenas */}
        <div className="glass-card">
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>
            بوابات التدريب والمبارزات:
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              onClick={() => setCurrentScreen('03')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: 'rgba(236, 72, 153, 0.1)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                borderRadius: '14px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>⚡</span>
                <div>
                  <div style={{ fontWeight: '800', color: '#fff' }}>حلبة التحديات المباشرة</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>مبارزة حية 1 ضد 1 مع طلاب المملكة</div>
                </div>
              </div>
              <span className="badge badge-danger">مباشر الآن</span>
            </div>

            <div
              onClick={() => setCurrentScreen('09')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '14px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>✍️</span>
                <div>
                  <div style={{ fontWeight: '800', color: '#fff' }}>مساحة حل المسائل التفاعلية</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>سبورة ذكية ولوحة رموز رياضيات</div>
                </div>
              </div>
              <span className="badge badge-cyan">مختبر ذكي</span>
            </div>

            <div
              onClick={() => setCurrentScreen('17')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '14px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>📚</span>
                <div>
                  <div style={{ fontWeight: '800', color: '#fff' }}>شجرة المناهج والوحدات</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>دروس تفاعلية وتمارين لكل وحدة</div>
                </div>
              </div>
              <span className="badge badge-success">4 وحدات</span>
            </div>
          </div>
        </div>

        {/* Badges Showcase */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>
              أوسمة الإنجاز المكتسبة ({student.badges.length}):
            </h3>
            <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: '700' }}>مكتملة 🏅</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {student.badges.map(b => (
              <div
                key={b.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '14px',
                  padding: '14px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>{b.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>{b.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
