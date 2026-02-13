import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import MainLayout from '../components/MainLayout';
import { ShoppingBag, CreditCard, ChevronLeft, MapPin, Phone, Mail, User } from 'lucide-react';

const Checkout = () => {
    const { cart, placeOrder, currentUser, coupons, updateProfile } = useShop();
    const navigate = useNavigate();
    const [promoCode, setPromoCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [promoError, setPromoError] = useState('');
    const [saveToProfile, setSaveToProfile] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        district: '',
        address: ''
    });

    useEffect(() => {
        if (cart.length === 0) {
            navigate('/shop');
        }
    }, [cart, navigate]);

    // Load saved profile data
    useEffect(() => {
        if (currentUser?.profile) {
            const p = currentUser.profile;
            setCustomer({
                name: p.name || '',
                email: currentUser.email || '',
                phone: p.phone || '',
                city: p.city || '',
                district: p.district || '',
                address: p.address || ''
            });
        } else if (currentUser) {
            setCustomer(prev => ({ ...prev, email: currentUser.email || '' }));
        }
    }, [currentUser]);

    const subtotal = cart.reduce((acc, item) => acc + (item.price * (1 - item.discount / 100)) * item.quantity, 0);
    const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discount_percent / 100) : 0;
    const total = subtotal - discountAmount;

    const handleApplyPromo = () => {
        setPromoError('');
        const found = coupons.find(c => c.code === promoCode.toUpperCase());
        if (found) {
            setAppliedCoupon(found);
            setPromoCode('');
        } else {
            setPromoError('Geçersiz kupon kodu.');
            setAppliedCoupon(null);
        }
    };

    const isFormValid = customer.name && customer.email.includes('@') && customer.phone.length >= 10 && customer.city && customer.district && customer.address;

    const handlePayment = async () => {
        if (!isFormValid) return;

        const customerDetails = {
            ...customer,
            fullAddress: `${customer.address}, ${customer.district}/${customer.city}`
        };

        // Save to profile if logged in and requested
        if (currentUser && saveToProfile) {
            await updateProfile({
                name: customer.name,
                phone: customer.phone,
                city: customer.city,
                district: customer.district,
                address: customer.address
            });
        }

        // Record the order as pending in Supabase
        const orderId = await placeOrder(customerDetails);

        if (orderId) {
            // iyzico Payment Link (Placeholder) - BYPASSED FOR SIMULATION
            // const iyzicoPaymentUrl = "https://iyzi.link/AIxyzPlaceholder";
            // window.location.href = iyzicoPaymentUrl;

            setIsSuccess(true);
        } else {
            alert("Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
        }
    };

    return (
        <MainLayout>
            <div className="checkout-page">
                <div className="section-container">
                    <button className="back-btn" onClick={() => navigate(-1)} style={{ marginBottom: '2rem' }}>
                        <ChevronLeft size={20} /> Geri Dön
                    </button>

                    {isSuccess ? (
                        <div className="order-success-container glass" style={{ padding: '4rem', textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
                            <div className="success-icon-wrapper" style={{ color: '#000', marginBottom: '2rem' }}>
                                <ShoppingBag size={80} strokeWidth={1} />
                            </div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Siparişiniz Alındı!</h2>
                            <p style={{ color: '#666', marginBottom: '2rem', lineHeight: 1.6 }}>
                                Bilgileriniz başarıyla kaydedildi ve siparişiniz simüle edildi.
                                Profilinizdeki kayıtlı bilgileri ve sipariş detaylarını Admin panelinden veya "Hesabım" sayfasından kontrol edebilirsiniz.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <button className="glow-btn" onClick={() => navigate('/shop')}>Alışverişe Devam Et</button>
                                <button className="glow-btn-cyan" onClick={() => navigate('/account')}>Hesabıma Git</button>
                            </div>
                        </div>
                    ) : (
                        <div className="checkout-layout">
                            <div className="checkout-form-container glass">
                                <div className="checkout-header">
                                    <CreditCard size={24} />
                                    <h2>Ödeme Bilgileri</h2>
                                </div>

                                <div className="checkout-form">
                                    <section className="form-section">
                                        <h3>İletişim Bilgileri</h3>
                                        <div className="input-group">
                                            <div className="input-wrapper">
                                                <User size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="Ad Soyad"
                                                    value={customer.name}
                                                    onChange={e => setCustomer({ ...customer, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="input-wrapper">
                                                <Phone size={18} />
                                                <input
                                                    type="tel"
                                                    placeholder="Telefon (Örn: 0555...)"
                                                    value={customer.phone}
                                                    onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    <section className="form-section">
                                        <h3>Teslimat Adresi</h3>
                                        <div className="input-group">
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div className="input-wrapper">
                                                    <MapPin size={18} />
                                                    <input
                                                        type="text"
                                                        placeholder="Şehir (İl)"
                                                        value={customer.city}
                                                        onChange={e => setCustomer({ ...customer, city: e.target.value })}
                                                    />
                                                </div>
                                                <div className="input-wrapper">
                                                    <MapPin size={18} />
                                                    <input
                                                        type="text"
                                                        placeholder="İlçe"
                                                        value={customer.district}
                                                        onChange={e => setCustomer({ ...customer, district: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="input-wrapper textarea-wrapper">
                                                <Home size={18} />
                                                <textarea
                                                    placeholder="Açık Adres (Sokak, Bina No, Kat, Daire)"
                                                    value={customer.address}
                                                    onChange={e => setCustomer({ ...customer, address: e.target.value })}
                                                    rows={3}
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    <div className="checkout-footer">
                                        {currentUser && (
                                            <div className="save-profile-toggle" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                <input
                                                    type="checkbox"
                                                    id="saveProfile"
                                                    checked={saveToProfile}
                                                    onChange={e => setSaveToProfile(e.target.checked)}
                                                    style={{ width: '20px', height: '20px' }}
                                                />
                                                <label htmlFor="saveProfile" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                                                    Bilgilerimi sonraki alışverişlerim için profilime kaydet.
                                                </label>
                                            </div>
                                        )}
                                        <div className="info-text">
                                            <p>* Tüm alanların doldurulması zorunludur.</p>
                                            <p>* "Ödeme Yap" butonuna tıkladığınızda iyzico güvenli ödeme sayfasına yönlendirileceksiniz.</p>
                                        </div>
                                        <button
                                            className={`glow-btn checkout-btn ${!isFormValid ? 'disabled' : ''}`}
                                            disabled={!isFormValid}
                                            onClick={handlePayment}
                                        >
                                            ÖDEME YAP - {total.toFixed(2)} TL
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="order-summary glass">
                                <h3>Sipariş Özeti</h3>
                                <div className="summary-items">
                                    {cart.map((item, idx) => (
                                        <div key={`${item.id}-${item.size}`} className="summary-item">
                                            <div className="summary-img">
                                                <img src={item.image} alt={item.name} />
                                                <span className="summary-qty">{item.quantity}</span>
                                            </div>
                                            <div className="summary-info">
                                                <h4>{item.name}</h4>
                                                <small>{item.size} / {item.category}</small>
                                                <p>{(item.price * (1 - item.discount / 100)).toFixed(0)} TL</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="summary-promo">
                                    <div className="promo-input-group">
                                        <input
                                            type="text"
                                            placeholder="Promosyon kodu"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                        />
                                        <button onClick={handleApplyPromo}>Kullan</button>
                                    </div>
                                    {promoError && <p className="promo-error">{promoError}</p>}
                                    {appliedCoupon && (
                                        <div className="applied-promo">
                                            <span>Kupon: {appliedCoupon.code}</span>
                                            <button onClick={() => setAppliedCoupon(null)}>Kaldır</button>
                                        </div>
                                    )}
                                </div>

                                <div className="summary-totals">
                                    <div className="total-line">
                                        <span>Ara Toplam</span>
                                        <span>{subtotal.toFixed(0)} TL</span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="total-line promo-discount">
                                            <span>İndirim (%{appliedCoupon.discount_percent})</span>
                                            <span>-{discountAmount.toFixed(0)} TL</span>
                                        </div>
                                    )}
                                    <div className="total-line">
                                        <span>Kargo</span>
                                        <span>ÜCRETSİZ</span>
                                    </div>
                                    <div className="total-line grand-total">
                                        <span>TOPLAM</span>
                                        <span>{total.toFixed(0)} TL</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Checkout;
