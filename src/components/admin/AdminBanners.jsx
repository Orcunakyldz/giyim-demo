import React, { useState } from 'react';
import { Trash2, Edit2, Save, X as CloseIcon, Plus } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const AdminBanners = ({ banners }) => {
    const { addBanner, updateBanner, deleteBanner } = useShop();
    const [isSaving, setIsSaving] = useState(false);
    const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', image: '', cta: 'Keşfet' });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewBanner(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!newBanner.title || !newBanner.image) {
            alert("Lütfen en az bir başlık ve görsel ekleyin.");
            return;
        }

        setIsSaving(true);
        try {
            if (editingId) {
                const { error } = await updateBanner({ ...newBanner, id: editingId });
                if (error) throw error;
                alert("Banner başarıyla güncellendi!");
                setEditingId(null);
            } else {
                const { error } = await addBanner(newBanner);
                if (error) throw error;
                alert("Yeni banner başarıyla eklendi!");
            }
            setNewBanner({ title: '', subtitle: '', image: '', cta: 'Keşfet' });
        } catch (err) {
            console.error("Banner save error:", err);
            alert("Kaydedilirken bir hata oluştu: " + (err.message || "İzin hatası (RLS)"));
        } finally {
            setIsSaving(false);
        }
    };

    const startEditBanner = (b) => {
        setEditingId(b.id);
        setNewBanner({ ...b });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewBanner({ title: '', subtitle: '', image: '', cta: 'Keşfet' });
    };

    return (
        <div className="admin-section">
            <div className={`add-form glass ${editingId ? 'editing' : ''}`}>
                <h3>Billboard Yönetimi</h3>
                <div className="form-grid">
                    <input
                        type="text"
                        placeholder="Başlık"
                        value={newBanner.title}
                        onChange={e => setNewBanner({ ...newBanner, title: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Alt Başlık"
                        value={newBanner.subtitle}
                        onChange={e => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                    />

                    <div className="file-input-wrapper">
                        <label>Banner Görseli Seç</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} />
                        {newBanner?.image && (
                            <img src={newBanner.image} alt="Preview" style={{ height: '50px', marginTop: '0.5rem', borderRadius: '5px' }} />
                        )}
                    </div>

                    <input
                        type="text"
                        placeholder="Buton Metni"
                        value={newBanner.cta}
                        onChange={e => setNewBanner({ ...newBanner, cta: e.target.value })}
                    />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="glow-btn" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Kaydediliyor...' : (editingId ? <><Save size={18} /> Kaydet</> : <><Plus size={18} /> Ekle</>)}
                        </button>
                        {editingId && (
                            <button className="glow-btn" onClick={cancelEdit} style={{ background: '#666' }} disabled={isSaving}>
                                <CloseIcon size={18} /> İptal
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="admin-grid">
                {banners?.map(banner => {
                    if (!banner) return null;
                    return (
                        <div key={banner.id} className="admin-item glass">
                            {banner?.image && (
                                <img src={banner.image} alt={banner?.title || 'Banner'} style={{ width: '120px', height: '80px', objectFit: 'cover' }} />
                            )}
                            <div className="item-details">
                                <h4>{banner.title}</h4>
                                <p>{banner.subtitle}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="edit-btn" onClick={() => startEditBanner(banner)} style={{ color: '#000' }}>
                                    <Edit2 size={18} />
                                </button>
                                <button className="delete-btn" onClick={() => deleteBanner(banner.id)}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminBanners;
