import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Navbar from '../components/Navbar';
import { Mail, Lock, CheckCircle, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
    const { register, login, resetPassword, currentUser } = useShop();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [isForgot, setIsForgot] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [registered, setRegistered] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [legal, setLegal] = useState({ kvkk: false, electronics: false });

    // Redirect if already logged in
    React.useEffect(() => {
        if (currentUser) navigate('/account');
    }, [currentUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            if (isForgot) {
                await resetPassword(formData.email);
                setSuccessMsg('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
                setIsForgot(false);
            } else if (isLogin) {
                await login(formData.email, formData.password);
                navigate('/account');
            } else {
                if (!legal.kvkk) {
                    throw new Error('Lütfen KVKK ve Üyelik Sözleşmesini kabul edin.');
                }
                await register(formData.email, formData.password);
                setRegistered(true);
            }
        } catch (err) {
            let userFriendlyMsg = err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.';

            if (err.message?.includes('Email rate limit exceeded')) {
                userFriendlyMsg = 'Çok fazla e-posta isteği gönderildi. Güvenliğiniz için lütfen bir süre (yaklaşık 1 saat) bekleyip tekrar deneyin.';
            } else if (err.message?.includes('Invalid login credentials')) {
                userFriendlyMsg = 'E-posta adresi veya şifre hatalı.';
            }

            setError(userFriendlyMsg);
        } finally {
            setIsLoading(false);
        }
    };

    if (registered) {
        return (
            <div className="auth-page">
                <Navbar />
                <div className="auth-container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="auth-box glass"
                        style={{ padding: '4rem', textAlign: 'center' }}
                    >
                        <CheckCircle size={64} color="#000" style={{ marginBottom: '2rem' }} />
                        <h2 style={{ marginBottom: '1.5rem', fontWeight: 900 }}>E-POSTANI KONTROL ET!</h2>
                        <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '2rem' }}>
                            Kaydınızı tamamlamak için <b>{formData.email}</b> adresine bir doğrulama bağlantısı gönderdik.
                            Lütfen gelen kutunuzu (ve gereksiz kutusunu) kontrol edin.
                        </p>
                        <button className="glow-btn" onClick={() => setIsLogin(true) || setRegistered(false)}>
                            Giriş Sayfasına Dön
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <Navbar />
            <div className="auth-container">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="auth-box glass"
                >
                    <div className="auth-tabs">
                        <button className={isLogin && !isForgot ? 'active' : ''} onClick={() => { setIsLogin(true); setIsForgot(false); setError(null); }}>GİRİŞ YAP</button>
                        <button className={!isLogin && !isForgot ? 'active' : ''} onClick={() => { setIsLogin(false); setIsForgot(false); setError(null); }}>KAYIT OL</button>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <h2>
                            {isForgot ? 'Şifremi Unuttum' : (isLogin ? 'Tekrar Hoş Geldiniz' : 'Aramıza Katılın')}
                        </h2>
                        <p className="subtitle">
                            {isForgot ? 'Sıfırlama bağlantısı göndermek için e-postanızı girin.' : (isLogin ? 'Hesabınıza erişmek için bilgilerinizi girin.' : 'Hızlıca kayıt olup gerçek bir deneyim yaşamaya başlayın.')}
                        </p>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ color: '#ff4d4d', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <AlertCircle size={16} /> {error}
                                </motion.div>
                            )}
                            {successMsg && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ color: '#2e7d32', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <CheckCircle size={16} /> {successMsg}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="input-group">
                            <label>E-Posta Adresi</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                <input
                                    type="email"
                                    placeholder="ornek@mail.com"
                                    style={{ paddingLeft: '3rem' }}
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {!isForgot && (
                            <div className="input-group">
                                <label>Şifre</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        style={{ paddingLeft: '3rem' }}
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {isLogin && !isForgot && (
                            <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                                <span
                                    className="link"
                                    style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                                    onClick={() => setIsForgot(true)}
                                >
                                    Şifremi Unuttum
                                </span>
                            </div>
                        )}

                        {!isLogin && !isForgot && (
                            <div className="legal-checkboxes">
                                <label className="checkbox-item">
                                    <input type="checkbox" checked={legal.kvkk} onChange={e => setLegal({ ...legal, kvkk: e.target.checked })} />
                                    <span><span className="link">Üyelik Sözleşmesi</span> ve <span className="link">KVKK Metni</span>'ni okudum, kabul ediyorum. <small>(Zorunlu)</small></span>
                                </label>
                                <label className="checkbox-item">
                                    <input type="checkbox" checked={legal.electronics} onChange={e => setLegal({ ...legal, electronics: e.target.checked })} />
                                    <span>Ticari Elektronik İleti gönderilmesini kabul ediyorum.</span>
                                </label>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {isForgot && (
                                <button
                                    type="button"
                                    className="glow-btn"
                                    style={{ background: '#eee', color: '#000' }}
                                    onClick={() => setIsForgot(false)}
                                >
                                    İptal
                                </button>
                            )}
                            <button
                                type="submit"
                                className="glow-btn full-btn"
                                disabled={isLoading}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flex: 1 }}
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isForgot ? 'Bağlantı Gönder' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol'))}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Auth;
