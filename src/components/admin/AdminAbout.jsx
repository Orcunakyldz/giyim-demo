import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const AdminAbout = ({ aboutData: remoteAboutData }) => {
    const { updateAboutData } = useShop();
    const [localAboutData, setLocalAboutData] = useState(null);
    const [newTestimonial, setNewTestimonial] = useState({ name: '', comment: '', rating: 5, image: '/images/t1.png' });
    const [isSaving, setIsSaving] = useState(false);

    // Sync local state with remote data only when remote data changes (initial load)
    useEffect(() => {
        if (remoteAboutData && !localAboutData) {
            setLocalAboutData(JSON.parse(JSON.stringify(remoteAboutData)));
        }
    }, [remoteAboutData]);

    const handleImageUpload = (e, callback) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => callback(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            const { error } = await updateAboutData(localAboutData);
            if (!error) {
                alert("Hakkımızda sayfası başarıyla güncellendi!");
            } else {
                alert("Hata oluştu: " + error.message);
            }
        } catch (err) {
            alert("Sistem hatası!");
        } finally {
            setIsSaving(false);
        }
    };

    if (!localAboutData) return <div style={{ padding: '2rem', textAlign: 'center' }}>Hakkımızda verileri yükleniyor...</div>;

    return (
        <div className="admin-section">
            <button
                className="glow-btn"
                onClick={handleSaveAll}
                disabled={isSaving}
                style={{ marginBottom: '2rem', width: '100%', padding: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
            >
                {isSaving ? 'Kaydediliyor...' : <><Save size={20} /> TÜM DEĞİŞİKLİKLERİ KAYDET</>}
            </button>

            <div className="add-form glass">
                <h3>Hero Bölümü (Üst Görsel)</h3>
                <div className="form-grid">
                    <input
                        type="text"
                        placeholder="Başlık"
                        value={localAboutData?.hero?.title || ''}
                        onChange={e => setLocalAboutData({ ...localAboutData, hero: { ...(localAboutData?.hero || {}), title: e.target.value } })}
                    />
                    <input
                        type="text"
                        placeholder="Alt Başlık"
                        value={localAboutData?.hero?.subtitle || ''}
                        onChange={e => setLocalAboutData({ ...localAboutData, hero: { ...(localAboutData?.hero || {}), subtitle: e.target.value } })}
                    />
                    <div className="file-input-wrapper">
                        <label>Hero Görseli Seç</label>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (data) => setLocalAboutData(prev => ({ ...prev, hero: { ...(prev?.hero || {}), image: data } })))} />
                        {localAboutData?.hero?.image && <img src={localAboutData.hero.image} alt="Preview" style={{ height: '50px', marginTop: '0.5rem', borderRadius: '5px' }} />}
                    </div>
                </div>
            </div>

            <div className="add-form glass" style={{ marginTop: '2rem' }}>
                <h3>Marka Hikayesi</h3>
                <div className="form-grid">
                    <input
                        type="text"
                        placeholder="Başlık"
                        value={localAboutData?.story?.title || ''}
                        onChange={e => setLocalAboutData({ ...localAboutData, story: { ...(localAboutData?.story || {}), title: e.target.value } })}
                    />
                    <textarea
                        rows="4"
                        placeholder="Hikaye Metni"
                        value={localAboutData?.story?.text || ''}
                        onChange={e => setLocalAboutData({ ...localAboutData, story: { ...(localAboutData?.story || {}), text: e.target.value } })}
                        style={{ background: '#f9f9f9', border: '1px solid #eee', padding: '1rem', borderRadius: '10px', width: '100%', color: '#333' }}
                    />
                    <div className="file-input-wrapper">
                        <label>Hikaye Görseli Seç</label>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (data) => setLocalAboutData(prev => ({ ...prev, story: { ...(prev?.story || {}), image: data } })))} />
                        {localAboutData?.story?.image && <img src={localAboutData.story.image} alt="Preview" style={{ height: '50px', marginTop: '0.5rem', borderRadius: '5px' }} />}
                    </div>
                </div>
            </div>

            <div className="add-form glass" style={{ marginTop: '2rem' }}>
                <h3>Galeri Yönetimi</h3>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        className="glow-btn"
                        onClick={() => {
                            setLocalAboutData(prev => {
                                const currentGallery = prev.gallery || prev.instagram || [];
                                return { ...prev, gallery: [...currentGallery, { image: '', caption: '' }] };
                            });
                        }}
                        style={{ padding: '0.8rem 1.5rem', fontSize: '0.8rem' }}
                    >
                        <Plus size={16} /> Yeni Resim Ekle
                    </button>
                </div>
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    {(localAboutData.gallery || localAboutData.instagram || []).map((item, i) => {
                        // Handle backward compatibility - instagram might be array of strings
                        const imgSrc = typeof item === 'string' ? item : (item?.image || '');
                        const caption = typeof item === 'string' ? '' : (item?.caption || '');

                        return (
                            <div key={i} className="file-input-wrapper" style={{ position: 'relative', border: '1px solid #eee', padding: '1rem', borderRadius: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <label>Resim {i + 1}</label>
                                    <button
                                        onClick={() => {
                                            const currentGallery = localAboutData.gallery || localAboutData.instagram || [];
                                            const newGallery = currentGallery.filter((_, idx) => idx !== i);
                                            setLocalAboutData({ ...localAboutData, gallery: newGallery });
                                        }}
                                        style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Başlık (İsteğe bağlı)"
                                    value={caption}
                                    onChange={(e) => {
                                        setLocalAboutData(prev => {
                                            const currentGallery = prev.gallery || prev.instagram || [];
                                            const newGallery = currentGallery.map((gItem, gIdx) => {
                                                if (gIdx !== i) return gItem;
                                                if (typeof gItem === 'string') return { image: gItem, caption: e.target.value };
                                                return { ...gItem, caption: e.target.value };
                                            });
                                            return { ...prev, gallery: newGallery };
                                        });
                                    }}
                                    style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, (data) => {
                                        setLocalAboutData(prev => {
                                            const currentGallery = prev.gallery || prev.instagram || [];
                                            const newGallery = currentGallery.map((gItem, gIdx) => {
                                                if (gIdx !== i) return gItem;
                                                if (typeof gItem === 'string') return { image: data, caption: '' };
                                                return { ...(gItem || {}), image: data };
                                            });
                                            return { ...prev, gallery: newGallery };
                                        });
                                    })}
                                />
                                {imgSrc && <img src={imgSrc} alt={`Gallery ${i}`} style={{ height: '100px', width: '100%', marginTop: '0.5rem', borderRadius: '5px', objectFit: 'cover' }} />}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="add-form glass" style={{ marginTop: '2rem' }}>
                <h3>Müşteri Yorumları</h3>
                <div className="form-grid">
                    <input type="text" placeholder="Ad Soyad" value={newTestimonial.name} onChange={e => setNewTestimonial({ ...newTestimonial, name: e.target.value })} />
                    <input type="text" placeholder="Yorum" value={newTestimonial.comment} onChange={e => setNewTestimonial({ ...newTestimonial, comment: e.target.value })} />
                    <div className="file-input-wrapper" style={{ gridColumn: 'span 2' }}>
                        <label>Müşteri Görseli Seç</label>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (data) => setNewTestimonial({ ...newTestimonial, image: data }))} />
                        {newTestimonial.image && <img src={newTestimonial.image} alt="Preview" style={{ height: '50px', marginTop: '0.5rem', borderRadius: '50%' }} />}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', gridColumn: 'span 2' }}>
                        <input type="number" min="1" max="5" placeholder="Puan" value={newTestimonial.rating} onChange={e => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })} style={{ width: '80px' }} />
                        <button className="glow-btn" onClick={() => {
                            if (!newTestimonial.name || !newTestimonial.comment) return;
                            const updated = {
                                ...localAboutData,
                                testimonials: [...(localAboutData.testimonials || []), { ...newTestimonial, id: Date.now() }]
                            };
                            setLocalAboutData(updated);
                            setNewTestimonial({ name: '', comment: '', rating: 5, image: '/images/t1.png' });
                        }}><Plus size={18} /> Listeye Ekle</button>
                    </div>
                </div>
            </div>

            <div className="list-container" style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>* Listeye eklenen yorumların kalıcı olması için üstteki "Kaydet" butonuna basmayı unutmayın.</p>
                <div className="admin-grid">
                    {localAboutData.testimonials?.map(t => (
                        <div key={t.id} className="admin-item glass" style={{ display: 'block' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <strong>{t.name} ({t.rating} Yıldız)</strong>
                                <button className="delete-btn" onClick={() => {
                                    const updated = {
                                        ...localAboutData,
                                        testimonials: localAboutData.testimonials.filter(x => x.id !== t.id)
                                    };
                                    setLocalAboutData(updated);
                                }}><Trash2 size={16} /></button>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>{t.comment}</p>
                        </div>
                    ))}
                </div>
            </div>

            <button
                className="glow-btn"
                onClick={handleSaveAll}
                disabled={isSaving}
                style={{ marginTop: '2rem', width: '100%', padding: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
            >
                {isSaving ? 'Kaydediliyor...' : <><Save size={20} /> TÜM DEĞİŞİKLİKLERİ KAYDET</>}
            </button>
        </div>
    );
};

export default AdminAbout;
