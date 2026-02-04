import React from 'react';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', fontFamily: 'monospace', background: '#fff', color: '#000', height: '100vh', overflow: 'auto' }}>
                    <h1>⚠️ Uygulama Çökme Hatası (Crash)</h1>
                    <p>Uygulama çalışırken beklenmeyen bir hata oluştu.</p>
                    <hr />
                    <h2 style={{ color: 'red' }}>{this.state.error && this.state.error.toString()}</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                    <hr />
                    <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ padding: '10px 20px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
                        Hafızayı Temizle ve Yeniden Dene (Reset)
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
