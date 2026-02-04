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
        if (window.confirm(`${cat.name} kategorisini silmek istediğinize emin misiniz?`)) {
            await removeCategory(cat.id);
        }
    };

    return (
        <div className="admin-section">
            <div className={`add-form glass ${editingId ? 'editing' : ''}`}>
                <h3>{editingId ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}</h3>
                <div className="form-grid">
                    <input
                        type="text"
                        placeholder="Kategori Adı"
                        value={newCategory.name}
                        onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                    />
                    <select
                        value={newCategory.gender}
                        onChange={e => setNewCategory({ ...newCategory, gender: e.target.value })}
                    >
                        <option value="female">Kadın</option>
                        <option value="male">Erkek</option>
                        <option value="unisex">Unisex</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Kısa Açıklama (Anasayfa için)"
                        value={newCategory.description || ''}
                        onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                        style={{ gridColumn: 'span 2' }}
                    />

                    <div className="file-input-wrapper">
                        <label>Koleksiyon Görseli Seç</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} />
                        {newCategory.image && (
                            <img src={newCategory.image} alt="Preview" style={{ height: '50px', marginTop: '0.5rem', borderRadius: '5px' }} />
                        )}
                    </div>

                    <div className="checkbox-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            disabled={isSaving}
                            id="showOnHome"
                            checked={newCategory.show_on_home}
                            onChange={e => setNewCategory({ ...newCategory, show_on_home: e.target.checked })}
                        />
                        <label htmlFor="showOnHome">Anasayfa Koleksiyonlarında Göster</label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', gridColumn: 'span 2' }}>
                        <button className="glow-btn" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? '...' : (editingId ? 'Güncelle' : 'Ekle')}
                        </button>
                        {editingId && (
                            <button className="glow-btn" onClick={cancelEdit} style={{ background: '#666' }}>İptal</button>
                        )}
                    </div>
                </div>
            </div>
            <div className="list-container">
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
