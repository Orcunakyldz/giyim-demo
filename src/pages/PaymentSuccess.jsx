import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const PaymentSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="payment-status-page">
            <Navbar />
            <div className="section-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="status-card glass"
                    style={{ textAlign: 'center', padding: '4rem', maxWidth: '500px', width: '100%' }}
                >
                    <div className="success-icon" style={{ color: '#27ae60', marginBottom: '2rem' }}>
                        <CheckCircle size={80} strokeWidth={1.5} />
                    </div>
                    <h1 style={{ fontWeight: 900, marginBottom: '1.5rem', fontSize: '2.5rem' }}>ÖDEME BAŞARILI!</h1>
                    <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '2rem' }}>
                        Siparişiniz başarıyla alındı. Hazırlık sürecine hemen başlıyoruz.
                        Detayları e-posta adresinizde bulabilirsiniz.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button className="glow-btn full-btn" onClick={() => navigate('/account')}>
                            Siparişlerimi Gör
                        </button>
                        <button className="text-btn" onClick={() => navigate('/')}>
                            Alışverişe Devam Et
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
