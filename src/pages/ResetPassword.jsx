import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Navbar from '../components/Navbar';
import { Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
    const { updatePassword, currentUser } = useShop();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // If there's no session after a few seconds, it might be an invalid link
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsCheckingSession(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Şifreler eşleşmiyor.');
            return;
        }
        if (password.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await updatePassword(password);
            setSuccess(true);
            setTimeout(() => navigate('/auth'), 3000);
        } catch (err) {
            setError(err.message || 'Şifre güncellenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Navbar />
            <div className="auth-container">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="auth-box glass"
                    style={{ padding: '3rem' }}
                >
                    {isCheckingSession ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <Loader2 className="animate-spin" size={48} color="#000" style={{ margin: '0 auto 1.5rem' }} />
                            <p>Oturum doğrulanıyor, lütfen bekleyin...</p>
                        </div>
                    ) : !currentUser && !success ? (
                        <div style={{ textAlign: 'center' }}>
                            <AlertCircle size={64} color="#ff4d4d" style={{ marginBottom: '2rem' }} />
                            <h2 style={{ marginBottom: '1rem', fontWeight: 900 }}>OTURUM BULUNAMADI</h2>
                            <p style={{ color: '#666', marginBottom: '2rem' }}>
                                Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş. Lütfen yeni bir bağlantı talep edin.
                            </p>
                            <button className="glow-btn" onClick={() => navigate('/auth')}>
                                Giriş Sayfasına Dön
                            </button>
                        </div>
                    ) : success ? (
                        <div style={{ textAlign: 'center' }}>
                            <CheckCircle size={64} color="#2e7d32" style={{ marginBottom: '2rem' }} />
                            <h2 style={{ marginBottom: '1rem', fontWeight: 900 }}>ŞİFRE GÜNCELLENDİ!</h2>
                            <p style={{ color: '#666' }}>Yeni şifreniz başarıyla kaydedildi. Giriş sayfasına yönlendiriliyorsunuz...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="auth-form">
                            <h2>Yeni Şifre Belirleyin</h2>
                            <p className="subtitle">Lütfen hesabınız için yeni ve güvenli bir şifre girin.</p>

                            {error && (
                                <div style={{ color: '#ff4d4d', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            <div className="input-group">
                                <label>Yeni Şifre</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        style={{ paddingLeft: '3rem' }}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Şifre Tekrar</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        style={{ paddingLeft: '3rem' }}
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="glow-btn full-btn"
                                disabled={isLoading}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Şifreyi Güncelle'}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ResetPassword;
