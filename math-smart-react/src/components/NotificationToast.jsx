import React from 'react';
import { useApp } from '../context/AppContext';

export const NotificationToast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const bgColors = {
    success: 'linear-gradient(135deg, #10b981, #059669)',
    info: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
    warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
    danger: 'linear-gradient(135deg, #ef4444, #b91c1c)'
  };

  const icons = {
    success: '✅',
    info: '✨',
    warning: '⚠️',
    danger: '🛑'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      zIndex: 110,
      background: bgColors[toast.type] || bgColors.info,
      color: '#fff',
      padding: '14px 22px',
      borderRadius: '16px',
      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14px',
      fontWeight: '700',
      animation: 'slideUp 0.3s ease-out'
    }}>
      <span style={{ fontSize: '18px' }}>{icons[toast.type] || '✨'}</span>
      <span>{toast.message}</span>
    </div>
  );
};
