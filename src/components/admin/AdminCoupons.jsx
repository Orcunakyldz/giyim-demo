import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Plus, Trash2, Tag, Percent } from 'lucide-react';

const AdminCoupons = () => {
    const { coupons, addCoupon, deleteCoupon } = useShop();
    const [newCoupon, setNewCoupon] = useState({ code: '', discount_percent: '' });
    const [loading, setLoading] = useState(false);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newCoupon.code || !newCoupon.discount_percent) return;

        setLoading(true);
        const { error } = await addCoupon({
            code: newCoupon.code.toUpperCase(),
            discount_percent: parseInt(newCoupon.discount_percent)
        });
        setLoading(false);

        if (!error) {
            setNewCoupon({ code: '', discount_percent: '' });
        } else {
            alert('Kupon eklenirken hata: ' + error.message);
        }
    };

    return (
        <div className="admin-section">
            <div className="admin-header">
                <h2>Kupon Yönetimi</h2>
                <p>Sponsorlar için indirim kodları oluşturun ve yönetin.</p>
            </div>

            <form onSubmit={handleAdd} className="admin-form-card" style={{ marginBottom: '2rem' }}>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Kupon Kodu</label>
                        <div className="input-wrapper">
                            <Tag size={18} />
                            <input
                                type="text"
                                value={newCoupon.code}
                                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                                placeholder="Örn: SPONSOR20"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>İndirim Oranı (%)</label>
                        <div className="input-wrapper">
                            <Percent size={18} />
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={newCoupon.discount_percent}
                                onChange={(e) => setNewCoupon({ ...newCoupon, discount_percent: e.target.value })}
                                placeholder="Örn: 20"
                                required
                            />
                        </div>
                    </div>
                </div>
                <button type="submit" className="glow-btn-cyan" disabled={loading} style={{ marginTop: '1.5rem' }}>
                    <Plus size={20} />
                    {loading ? 'Ekleniyor...' : 'Kupon Oluştur'}
                </button>
            </form>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Kod</th>
                            <th>İndirim</th>
                            <th>Oluşturulma Tarihi</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon.id}>
                                <td>
                                    <span className="coupon-badge">{coupon.code}</span>
                                </td>
                                <td>%{coupon.discount_percent}</td>
                                <td>{new Date(coupon.created_at).toLocaleDateString('tr-TR')}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Bu kuponu silmek istediğinize emin misiniz?')) {
                                                deleteCoupon(coupon.id);
                                            }
                                        }}
                                        className="action-btn delete"
                                        title="Kuponu Sil"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {coupons.length === 0 && (
                    <div className="empty-state">Henüz aktif kupon bulunmuyor.</div>
                )}
            </div>
        </div>
    );
};

export default AdminCoupons;
