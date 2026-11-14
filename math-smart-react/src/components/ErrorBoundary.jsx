import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || 'حدث خطأ غير متوقع أثناء عرض الصفحة.'
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Math Smart UI ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, errorMessage: '' });
    if (typeof window !== 'undefined') {
      window.location.hash = '';
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-card" style={{ maxWidth: '540px', margin: '60px auto', textAlign: 'center', padding: '36px' }}>
          <div style={{ fontSize: '44px', marginBottom: '12px' }}>⚠️</div>
          <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-heading)', marginBottom: '8px' }}>
            تعذر تحميل هذه الواجهة مؤقتاً
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.7 }}>
            {this.state.errorMessage}
          </p>
          <button type="button" onClick={this.handleReload} className="btn btn-primary">
            إعادة تحميل المنصة 🔄
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

