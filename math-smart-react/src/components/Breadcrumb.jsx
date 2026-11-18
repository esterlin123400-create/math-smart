import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Breadcrumb = ({ items = [], backTo = null, backLabel = null, tag = null }) => {
  const { setCurrentScreen } = useApp();
  const { role } = useAuth();

  const handleBack = () => {
    if (backTo) {
      setCurrentScreen(backTo);
    } else if (role === 'teacher') {
      setCurrentScreen('02');
    } else if (role === 'student') {
      setCurrentScreen('13');
    } else {
      setCurrentScreen('hub');
    }
  };

  const defaultBackLabel = backLabel || (
    backTo === '13' ? 'العودة لبوابة الطالب' :
    backTo === '02' ? 'العودة للوحة المعلم' :
    backTo === 'hub' ? 'العودة للرئيسية' :
    role === 'teacher' ? 'العودة للوحة المعلم' :
    role === 'student' ? 'العودة لبوابة الطالب' :
    'العودة للرئيسية'
  );

  return (
    <div className="platform-breadcrumb-container">
      <nav className="platform-breadcrumb-nav" aria-label="مسار التنقل">
        <button
          type="button"
          onClick={() => setCurrentScreen('hub')}
          className="breadcrumb-link breadcrumb-home"
        >
          <span>🏛️</span>
          <span>الرئيسية</span>
        </button>

        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <span className="breadcrumb-separator">/</span>
            {item.screen ? (
              <button
                type="button"
                onClick={() => setCurrentScreen(item.screen)}
                className="breadcrumb-link"
              >
                {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ) : (
              <span className="breadcrumb-current">
                {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>

      <div className="breadcrumb-actions">
        {tag && <span className="breadcrumb-status-tag">{tag}</span>}
        <button
          type="button"
          onClick={handleBack}
          className="breadcrumb-back-btn"
          title={defaultBackLabel}
        >
          <span>←</span>
          <span>{defaultBackLabel}</span>
        </button>
      </div>
    </div>
  );
};
