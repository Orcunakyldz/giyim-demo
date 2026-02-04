import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const AdminCategories = ({ categories }) => {
    const { addCategory, updateCategory, removeCategory } = useShop();
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '', gender: 'female', image: '', description: '', show_on_home: false });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewCategory(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!newCategory.name) return;

        setIsSaving(true);
        try {
            if (editingId) {
                await updateCategory({ ...newCategory, id: editingId });
                alert("Kategori güncellendi!");
                setEditingId(null);
            } else {
                const exists = categories.find(c => c.name.toLowerCase() === newCategory.name.toLowerCase() && c.gender === newCategory.gender);
                if (exists) {
                    alert("Bu kategori zaten mevcut.");
                    return;
                }
                await addCategory(newCategory);
                alert("Kategori başarıyla eklendi!");
            }
            setNewCategory({ name: '', gender: 'female', image: '', description: '', show_on_home: false });
        } catch (err) {
            alert("Hata: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const startEdit = (cat) => {
        setEditingId(cat.id);
        setNewCategory({ ...cat });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewCategory({ name: '', gender: 'female', image: '', description: '', show_on_home: false });
    };

    const handleDelete = async (cat) => {
        if (window.confirm(`${cat.name} koleksiyonunu silmek istediğinize emin misiniz?`)) {
            await removeCategory(cat.id);
        }
    };

    return (
        <div className="admin-section">
            <div className={`add-form glass ${editingId ? 'editing' : ''}`}>
                <h3>{editingId ? 'Koleksiyonu Düzenle' : 'Yeni Koleksiyon Ekle'}</h3>
                <div className="form-grid">
                    <input
                        type="text"
                        placeholder="Koleksiyon Adı (Örn: Tayt, Tişört)"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <select
                        value={newCategory.gender}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, gender: e.target.value }))}
                    >
                        <option value="female">Kadın</option>
                        <option value="male">Erkek</option>
                        <option value="unisex">Unisex</option>
                    </select>

                    <div className="full-width-input" style={{ gridColumn: '1 / -1' }}>
                        <textarea
                            placeholder="Koleksiyon Açıklaması (Anasayfada görünür)"
                            value={newCategory.description}
                            onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                            rows={2}
                            style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <div className="full-width-input" style={{ gridColumn: '1 / -1' }}>
                        <div className="image-upload-wrapper" style={{ border: '2px dashed var(--border)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                            {newCategory.image ? (
                                <div style={{ position: 'relative' }}>
                                    <img src={newCategory.image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                                    <button onClick={() => setNewCategory(prev => ({ ...prev, image: '' }))} style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: '50%', width: '30px', height: '30px', border: 'none' }}>×</button>
                                </div>
                            ) : (
                                <>
                                    <p style={{ color: '#888', marginBottom: '1rem' }}>Koleksiyon Görseli (E-Ticaret Standartlarında)</p>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} id="cat-img" style={{ display: 'none' }} />
                                    <label htmlFor="cat-img" className="glow-btn" style={{ cursor: 'pointer', padding: '0.8rem 1.5rem', fontSize: '0.8rem' }}>Resim Seç</label>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="full-width-input" style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input
                            type="checkbox"
                            id="show_on_home"
                            checked={newCategory.show_on_home}
                            onChange={(e) => setNewCategory(prev => ({ ...prev, show_on_home: e.target.checked }))}
                            style={{ width: '20px', height: '20px' }}
                        />
                        <label htmlFor="show_on_home" style={{ fontWeight: 700, cursor: 'pointer' }}>Anasayfa "Koleksiyonlar" bölümünde göster</label>
                    </div>

                    <div className="form-actions" style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
                        <button className="glow-btn" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Kaydediliyor...' : (editingId ? 'Değişiklikleri Kaydet' : 'Koleksiyon Ekle')}
                        </button>
                        {editingId && (
                            <button className="glow-btn" style={{ background: '#666' }} onClick={() => { setEditingId(null); setNewCategory({ name: '', gender: 'female', image: '', description: '', show_on_home: false }); }}>
                                İptal
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="list-container">
                <div className="section-title-wrapper" style={{ marginBottom: '2rem', textAlign: 'left' }}>
                    <h2 className="section-title" style={{ fontSize: '1.5rem' }}>Mevcut Koleksiyonlar ({categories.length})</h2>
                    <div className="title-accent" style={{ margin: '0' }}></div>
                </div>
                <div className="admin-grid">
                    {categories?.map((cat, idx) => (
                        <div key={cat.id || idx} className="admin-item glass" style={{ justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                {cat.image && (
                                    <img src={cat.image} alt={cat.name} style={{ width: '50px', height: '50px', borderRadius: '5px', objectFit: 'cover' }} />
                                )}
                                <div>
                                    <h4 style={{ margin: 0 }}>{cat.name} {cat.show_on_home && <span style={{ color: 'var(--accent-cyan)', fontSize: '0.7rem' }}>● ANASAYFA</span>}</h4>
                                    <small style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                        {cat.gender === 'female' ? 'Kadın' : cat.gender === 'male' ? 'Erkek' : 'Unisex'}
                                    </small>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="edit-btn" onClick={() => startEdit(cat)} style={{ color: 'var(--accent-cyan)' }}>✏️</button>
                                <button className="delete-btn" onClick={() => handleDelete(cat)}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminCategories;
