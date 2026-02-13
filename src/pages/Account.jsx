import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Navbar from '../components/Navbar';
import { User, Package, LogOut, ChevronRight, ShoppingBag, Clock, CheckCircle, Lock, Phone, MapPin, Home, Truck } from 'lucide-react';

const Account = () => {
    const { currentUser, orders, logout, updateProfile } = useShop();
    const navigate = useNavigate();

    if (!currentUser) {
        React.useEffect(() => { navigate('/auth'); }, []);
        return null;
    }

    const [activeTab, setActiveTab] = React.useState('orders');
    const [saving, setSaving] = React.useState(false);
    const [message, setMessage] = React.useState({ type: '', text: '' });

    // Profile state
    const [formData, setFormData] = React.useState({
        name: '',
        phone: '',
        city: '',
        district: '',
        address: ''
    });

    React.useEffect(() => {
        if (currentUser?.profile) {
            const p = currentUser.profile;
            setFormData({
                name: p.name || '',
                phone: p.phone || '',
                city: p.city || '',
                district: p.district || '',
                address: p.address || ''
            });
        }
    }, [currentUser]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        const { error } = await updateProfile(formData);

        if (error) {
            setMessage({ type: 'error', text: 'Güncelleme başarısız: ' + error });
        } else {
            setMessage({ type: 'success', text: 'Profil bilgileriniz başarıyla güncellendi.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
        setSaving(false);
    };

    const userOrders = orders.filter(o => {
        // Handle both UUID and potentially numeric IDs for mapping
        return o.user_id === currentUser.id;
    });

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
                            {currentUser?.profile?.role === 'admin' && (
                                <span className="admin-badge">YÖNETİCİ</span>
                            )}
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
                                                        <span className="order-date"><Clock size={14} /> {new Date(order.created_at).toLocaleDateString('tr-TR')}</span>
                                                    </div>
                                                    <div className="order-status-badge" style={{
                                                        background: order.status === 'pending' ? '#fff8e1' : order.status === 'shipped' ? '#e3f2fd' : order.status === 'delivered' ? '#e8f5e9' : '#f5f5f5',
                                                        color: order.status === 'pending' ? '#f57c00' : order.status === 'shipped' ? '#1976d2' : order.status === 'delivered' ? '#2e7d32' : '#666'
                                                    }}>
                                                        {order.status === 'pending' && <Clock size={14} />}
                                                        {order.status === 'shipped' && <Truck size={14} />}
                                                        {order.status === 'delivered' && <CheckCircle size={14} />}
                                                        {order.status === 'pending' ? 'Hazırlanıyor' :
                                                            order.status === 'shipped' ? 'Kargoya Verildi' :
                                                                order.status === 'delivered' ? 'Teslim Edildi' : 'Bekliyor'}
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
                                                    <span className="value">{order.total.toFixed(0)} TL</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="profile-section">
                                <h2>Profil Bilgilerim</h2>
                                <form className="profile-card glass" onSubmit={handleProfileUpdate}>
                                    {message.text && (
                                        <div className={`status-message ${message.type}`} style={{
                                            padding: '1rem',
                                            borderRadius: '8px',
                                            marginBottom: '1.5rem',
                                            background: message.type === 'success' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                                            color: message.type === 'success' ? '#2ecc71' : '#e74c3c',
                                            border: `1px solid ${message.type === 'success' ? '#2ecc71' : '#e74c3c'}`
                                        }}>
                                            {message.text}
                                        </div>
                                    )}

                                    <div className="profile-grid">
                                        <div className="profile-field">
                                            <label>Ad Soyad</label>
                                            <div className="input-wrapper">
                                                <User size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="Henüz girilmedi"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="profile-field">
                                            <label>Telefon</label>
                                            <div className="input-wrapper">
                                                <Phone size={18} />
                                                <input
                                                    type="tel"
                                                    placeholder="Henüz girilmedi"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="profile-grid">
                                        <div className="profile-field">
                                            <label>Şehir</label>
                                            <div className="input-wrapper">
                                                <MapPin size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="Henüz girilmedi"
                                                    value={formData.city}
                                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="profile-field">
                                            <label>İlçe</label>
                                            <div className="input-wrapper">
                                                <MapPin size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="Henüz girilmedi"
                                                    value={formData.district}
                                                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="profile-field">
                                        <label>Açık Adres</label>
                                        <div className="input-wrapper textarea-wrapper">
                                            <Home size={18} />
                                            <textarea
                                                placeholder="Henüz girilmedi"
                                                rows={3}
                                                value={formData.address}
                                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="profile-field">
                                        <label>E-POSTA ADRESİ</label>
                                        <div className="input-wrapper readonly">
                                            <Lock size={18} />
                                            <input type="email" value={currentUser.email} readOnly />
                                        </div>
                                    </div>

                                    <button type="submit" className="glow-btn full-btn" disabled={saving}>
                                        {saving ? 'KAYDEDİLİYOR...' : 'DEĞİŞİKLİKLERİ KAYDET'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
