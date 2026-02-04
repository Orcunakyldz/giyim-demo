import React from 'react';
import { ShoppingCart, Trash2, CheckCircle } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const AdminOrders = ({ orders }) => {
    const { deleteOrder } = useShop();

    return (
        <div className="admin-section">
            {orders?.length === 0 ? (
                <div className="placeholder-card glass">
                    <ShoppingCart size={48} />
                    <p>Henüz sipariş bulunmuyor.</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders?.map(order => (
                        <div key={order.id} className="order-card glass" style={{ marginBottom: '3rem', padding: '2.5rem' }}>
                            <div className="order-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                    <span className="order-id" style={{ fontWeight: 900, fontSize: '1.1rem' }}>#ORD-{order.id.toString().slice(-6)}</span>
                                    <span className="order-date" style={{ color: 'var(--text-muted)' }}>{new Date(order.created_at).toLocaleDateString('tr-TR')}</span>
                                    <span className="order-status" style={{ background: '#f0fff0', color: '#27ae60', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                                        <CheckCircle size={14} /> {order.status === 'success' || order.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                                    </span>
                                </div>
                                <button className="delete-btn" onClick={() => { if (window.confirm('Bu siparişi silmek istediğinize emin misiniz?')) deleteOrder(order.id) }} style={{ padding: '0.8rem', background: '#fff0f0', color: '#ff4d4d', borderRadius: '50%' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="order-customer" style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>
                                <strong style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Müşteri Bilgileri</strong>
                                <div>{order.customer_details?.name} | <span style={{ fontWeight: 700 }}>{order.customer_details?.phone}</span></div>
                                <small>{order.customer_details?.address}</small>
                            </div>
                            <div className="order-items" style={{ marginBottom: '1.5rem', background: '#fcfcfc', padding: '1.5rem', borderRadius: '10px' }}>
                                <strong style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>Ürünler</strong>
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="order-item" style={{ padding: '0.5rem 0', borderBottom: idx === order.items.length - 1 ? 'none' : '1px solid #f0f0f0' }}>
                                        {item.name} <span style={{ fontWeight: 700, color: '#666' }}>({item.size})</span> x {item.quantity}
                                    </div>
                                ))}
                            </div>
                            <div className="order-footer" style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1.5rem', borderTop: '1px dashed var(--border)' }}>
                                <div style={{ fontSize: '1.2rem' }}>
                                    <span style={{ color: 'var(--text-muted)', marginRight: '1rem' }}>Toplam:</span>
                                    <strong style={{ fontSize: '1.5rem', fontWeight: 900 }}>{Number(order.total).toFixed(2)} TL</strong>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
