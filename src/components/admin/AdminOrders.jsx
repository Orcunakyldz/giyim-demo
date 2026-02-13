import React from 'react';
import { ShoppingCart, Trash2, CheckCircle, Truck, PackageCheck, Clock } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const AdminOrders = ({ orders }) => {
    const { deleteOrder, updateOrderStatus } = useShop();

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'Hazırlanıyor';
            case 'shipped': return 'Kargoya Verildi';
            case 'delivered': return 'Teslim Edildi';
            default: return status || 'Bekliyor';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return { bg: '#fff8e1', text: '#f57c00' }; // Amber
            case 'shipped': return { bg: '#e3f2fd', text: '#1976d2' }; // Blue
            case 'delivered': return { bg: '#e8f5e9', text: '#2e7d32' }; // Green
            default: return { bg: '#f5f5f5', text: '#666' };
        }
    };

    return (
        <div className="admin-section">
            {orders?.length === 0 ? (
                <div className="placeholder-card glass">
                    <ShoppingCart size={48} />
                    <p>Henüz sipariş bulunmuyor.</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders?.map(order => {
                        const statusStyle = getStatusColor(order.status);
                        return (
                            <div key={order.id} className="order-card glass" style={{ marginBottom: '3rem', padding: '2.5rem', border: '1px solid var(--border)', borderRadius: '20px' }}>
                                <div className="order-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                        <span className="order-id" style={{ fontWeight: 900, fontSize: '1.1rem' }}>#ORD-{order.id.toString().slice(-6)}</span>
                                        <span className="order-date" style={{ color: 'var(--text-muted)' }}>{new Date(order.created_at).toLocaleDateString('tr-TR')}</span>
                                        <span className="order-status" style={{
                                            background: statusStyle.bg,
                                            color: statusStyle.text,
                                            padding: '0.4rem 1rem',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 800,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            {order.status === 'pending' && <Clock size={12} />}
                                            {order.status === 'shipped' && <Truck size={12} />}
                                            {order.status === 'delivered' && <CheckCircle size={12} />}
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            className="action-btn"
                                            title="Siparişi Sil"
                                            onClick={() => { if (window.confirm('Bu siparişi silmek istediğinize emin misiniz?')) deleteOrder(order.id) }}
                                            style={{ color: '#ff4d4d' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
                                    <div>
                                        <div className="order-customer" style={{ marginBottom: '2rem' }}>
                                            <strong style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.8rem' }}>Müşteri & Teslimat</strong>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{order.customer_details?.name}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>{order.customer_details?.phone}</div>
                                            <div style={{ marginTop: '0.8rem', padding: '1rem', background: '#f9f9f9', borderRadius: '10px', fontSize: '0.9rem', color: '#555', border: '1px solid #eee' }}>
                                                {order.customer_details?.address}, {order.customer_details?.district}/{order.customer_details?.city}
                                            </div>
                                        </div>

                                        <div className="order-items" style={{ background: '#fcfcfc', padding: '1.5rem', borderRadius: '15px', border: '1px solid #f0f0f0' }}>
                                            <strong style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>Sipariş İçeriği</strong>
                                            {order.items?.map((item, idx) => (
                                                <div key={idx} className="order-item" style={{
                                                    padding: '0.8rem 0',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    borderBottom: idx === order.items.length - 1 ? 'none' : '1px solid #f0f0f0'
                                                }}>
                                                    <div>
                                                        <span style={{ fontWeight: 700 }}>{item.name}</span>
                                                        <span style={{ marginLeft: '1rem', color: '#888', fontSize: '0.85rem' }}>Beden: {item.size}</span>
                                                    </div>
                                                    <span style={{ fontWeight: 800 }}>x{item.quantity}</span>
                                                </div>
                                            ))}
                                            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid #fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>TOPLAM</span>
                                                <span style={{ fontSize: '1.5rem', fontWeight: 950 }}>{Number(order.total).toFixed(2)} TL</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ background: '#fafafa', padding: '2rem', borderRadius: '20px', border: '1px solid #eee' }}>
                                        <strong style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1.5rem' }}>Durum Güncelle</strong>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <button
                                                className={`status-btn ${order.status === 'pending' ? 'active' : ''}`}
                                                onClick={() => updateOrderStatus(order.id, 'pending')}
                                                style={{
                                                    padding: '1rem',
                                                    borderRadius: '12px',
                                                    border: '1px solid #ddd',
                                                    background: order.status === 'pending' ? '#000' : '#fff',
                                                    color: order.status === 'pending' ? '#fff' : '#000',
                                                    fontWeight: 700,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '1rem',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                <Clock size={18} /> Hazırlanıyor
                                            </button>
                                            <button
                                                className={`status-btn ${order.status === 'shipped' ? 'active' : ''}`}
                                                onClick={() => updateOrderStatus(order.id, 'shipped')}
                                                style={{
                                                    padding: '1rem',
                                                    borderRadius: '12px',
                                                    border: '1px solid #ddd',
                                                    background: order.status === 'shipped' ? '#000' : '#fff',
                                                    color: order.status === 'shipped' ? '#fff' : '#000',
                                                    fontWeight: 700,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '1rem',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                <Truck size={18} /> Kargoya Verildi
                                            </button>
                                            <button
                                                className={`status-btn ${order.status === 'delivered' ? 'active' : ''}`}
                                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                                                style={{
                                                    padding: '1rem',
                                                    borderRadius: '12px',
                                                    border: '1px solid #ddd',
                                                    background: order.status === 'delivered' ? '#000' : '#fff',
                                                    color: order.status === 'delivered' ? '#fff' : '#000',
                                                    fontWeight: 700,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '1rem',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                <PackageCheck size={18} /> Teslim Edildi
                                            </button>
                                        </div>
                                        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#888', fontStyle: 'italic', lineHeight: '1.4' }}>
                                            * Durum değişikliği anında müşterinin hesabında güncellenecektir.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )
            }
        </div >
    );
};

export default AdminOrders;
