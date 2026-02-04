import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Navbar from '../components/Navbar';
import { User, Package, LogOut, ChevronRight, ShoppingBag, Clock, CheckCircle, Lock } from 'lucide-react';

const Account = () => {
    const { currentUser, orders, logout } = useShop();
    const navigate = useNavigate();

    if (!currentUser) {
        React.useEffect(() => { navigate('/auth'); }, []);
        return null;
    }

    const [activeTab, setActiveTab] = React.useState('orders');
    const userOrders = orders.filter(o => o.userId === currentUser.id);

    return (
        <div className="account-page">
            <Navbar />

            <div className="account-hero">
                <div className="section-container">
                    <div className="welcome-box">
                        <div className="user-avatar">
                            <User size={40} />
                        </div>
                        <div className="user-info">
                            <h1>Merhaba!</h1>
                            <p>{currentUser.email}</p>
                        </div>
                        <button className="logout-btn" onClick={() => { logout(); navigate('/'); }}>
                            <LogOut size={20} /> ÇIKIŞ YAP
                        </button>
                    </div>
                </div>
            </div>

            <div className="section-container">
                <div className="account-layout">
                    <div className="account-aside">
                        <div className={`nav-card glass ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                            <Package size={20} /> Siparişlerim
                        </div>
                        <div className={`nav-card glass ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                            <User size={20} /> Profil Bilgilerim
                        </div>
                    </div>

                    <div className="account-main">
                        {activeTab === 'orders' ? (
                            <div className="orders-section">
                                <h2>Sipariş Geçmişi ({userOrders.length})</h2>

                                {userOrders.length === 0 ? (
                                    <div className="empty-orders glass">
                                        <ShoppingBag size={48} />
                                        <h3>Henüz siparişiniz yok.</h3>
                                        <p>Keşfetmeye başlayın ve ilk siparişinizi oluşturun.</p>
                                        <button className="glow-btn" onClick={() => navigate('/shop')}>Alışverişe Başla</button>
                                    </div>
                                ) : (
                                    <div className="user-orders-list">
                                        {userOrders.map(order => (
                                            <div key={order.id} className="user-order-card glass">
                                                <div className="order-main-info">
                                                    <div className="header-top">
                                                        <span className="order-id">#ORD-{order.id.toString().slice(-6)}</span>
                                                        <span className="order-date"><Clock size={14} /> {order.date}</span>
                                                    </div>
                                                    <div className="order-status-badge">
                                                        <CheckCircle size={14} /> Sipariş Alındı
                                                    </div>
                                                    <div className="order-items-summary">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="item-line">
                                                                {item.name} ({item.size}) x {item.quantity}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="order-price-info">
                                                    <span className="label">Toplam Tutar</span>
                                                    <span className="value">{order.total.toFixed(2)} TL</span>
                                                    <button className="detail-btn">Detay <ChevronRight size={16} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="profile-section">
                                <h2>Profil Bilgilerim</h2>
                                <div className="profile-card glass">
                                    <div className="profile-field">
                                        <label>E-POSTA ADRESİ</label>
                                        <input type="email" value={currentUser.email} readOnly />
                                    </div>
                                    <div className="profile-info-note">
                                        <Lock size={14} /> Güvenlik gerekçesiyle e-posta adresi değiştirilemez.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
