import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const AdminSocial = () => {
    const { socialGallery, addSocialImage, deleteSocialImage } = useShop();
    const [isSaving, setIsSaving] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAdd = async () => {
        if (!previewImage) return;

        setIsSaving(true);
        try {
            const { error } = await addSocialImage(previewImage);
            if (error) throw error;
            alert("Görsel başarıyla eklendi!");
            setPreviewImage('');
        } catch (err) {
            alert("Hata: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bu görseli silmek istediğinize emin misiniz?")) {
            await deleteSocialImage(id);
        }
    };

    return (
        <div className="admin-section">
            <div className="add-form glass">
                <h3>Yeni Galeri Görseli</h3>
                <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
                    <div className="file-input-wrapper" style={{ border: '2px dashed var(--border)', padding: '2rem', textAlign: 'center', borderRadius: '15px' }}>
                        <ImageIcon size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Maksimum 2MB görsel yükleyin</p>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} id="social-upload" />
                        <label htmlFor="social-upload" className="glow-btn" style={{ padding: '0.8rem 1.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                            Dosya Seç
                        </label>
                    </div>

                    {previewImage && (
                        <div className="preview-container" style={{ position: 'relative' }}>
                            <img src={previewImage} alt="Preview" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--border)' }} />
                            <button onClick={() => setPreviewImage('')} style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff4d4d', color: '#fff', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>×</button>
                        </div>
                    )}

                    <button className="glow-btn" onClick={handleAdd} disabled={!previewImage || isSaving} style={{ width: '100%' }}>
                        {isSaving ? 'Yükleniyor...' : 'Galeriye Ekle'}
                    </button>
                </div>
            </div>

            <div className="list-container">
                <div className="section-title-wrapper" style={{ marginBottom: '2rem', textAlign: 'left' }}>
                    <h2 className="section-title" style={{ fontSize: '1.5rem' }}>Mevcut Görseller ({socialGallery?.length || 0})</h2>
                    <div className="title-accent" style={{ margin: '0' }}></div>
                </div>
                <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                    {socialGallery?.map((item) => (
                        <div key={item.id} className="admin-item glass" style={{ padding: '0', overflow: 'hidden', position: 'relative', display: 'block' }}>
                            <img src={item.image} alt="Social" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />
                            <button
                                className="delete-btn"
                                onClick={() => handleDelete(item.id)}
                                style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '0.5rem', borderRadius: '8px' }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminSocial;
