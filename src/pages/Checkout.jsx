import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import MainLayout from '../components/MainLayout';
import { ShoppingBag, CreditCard, ChevronLeft, MapPin, Phone, Mail, User } from 'lucide-react';

const Checkout = () => {
    const { cart, placeOrder, currentUser } = useShop();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
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

    const total = cart.reduce((acc, item) => acc + (item.price * (1 - item.discount / 100)) * item.quantity, 0);

    const isFormValid = customer.name && customer.email.includes('@') && customer.phone.length >= 10 && customer.city && customer.district && customer.address;

    const handlePayment = async () => {
        if (!isFormValid) return;

        const customerDetails = {
            ...customer,
            fullAddress: `${customer.address}, ${customer.district}/${customer.city}`
        };

        // Record the order as pending in Supabase
        const orderId = await placeOrder(customerDetails);

        if (orderId) {
            // iyzico Payment Link (Placeholder)
            // ÖNEMLİ: Gerçek iyzico linkinizi buraya ekleyin
            const iyzicoPaymentUrl = "https://iyzi.link/AIxyzPlaceholder";

            // Redirect to iyzico
            window.location.href = iyzicoPaymentUrl;
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

                    <div className="checkout-layout">
                        <div className="checkout-form-container glass">
                            <div className="checkout-header">
                                <CreditCard size={24} />
                                <h2>Ödeme Bilgileri</h2>
                            </div>

                            <div className="checkout-form">
                                <section className="form-section">
                                    <h3>Kişisel Bilgiler</h3>
                                    <div className="input-group">
                                        <div className="input-with-icon">
                                            <User size={18} />
                                            <input
                                                type="text"
                                                placeholder="Ad Soyad"
                                                value={customer.name}
                                                onChange={e => setCustomer({ ...customer, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="input-with-icon">
                                            <Mail size={18} />
                                            <input
                                                type="email"
                                                placeholder="E-posta Adresi"
                                                value={customer.email}
                                                onChange={e => setCustomer({ ...customer, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="input-with-icon">
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
                                            <div className="input-with-icon">
                                                <MapPin size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="Şehir (İl)"
                                                    value={customer.city}
                                                    onChange={e => setCustomer({ ...customer, city: e.target.value })}
                                                />
                                            </div>
                                            <div className="input-with-icon">
                                                <MapPin size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="İlçe"
                                                    value={customer.district}
                                                    onChange={e => setCustomer({ ...customer, district: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <textarea
                                            placeholder="Açık Adres (Sokak, Bina No, Kat, Daire)"
                                            value={customer.address}
                                            onChange={e => setCustomer({ ...customer, address: e.target.value })}
                                            rows={3}
                                            className="detail-address-input"
                                        />
                                    </div>
                                </section>

                                <div className="checkout-footer">
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
                            <div className="summary-totals">
                                <div className="total-line">
                                    <span>Ara Toplam</span>
                                    <span>{total.toFixed(2)} TL</span>
                                </div>
                                <div className="total-line">
                                    <span>Kargo</span>
                                    <span>ÜCRETSİZ</span>
                                </div>
                                <div className="total-line grand-total">
                                    <span>TOPLAM</span>
                                    <span>{total.toFixed(2)} TL</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Checkout;
