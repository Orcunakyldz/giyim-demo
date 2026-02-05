import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const AdminCategories = ({ categories }) => {
    const { addCategory, removeCategory } = useShop();
    const [isSaving, setIsSaving] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', gender: 'female' });

    const handleSave = async () => {
        if (!newCategory.name) return;

        setIsSaving(true);
        try {
            const exists = categories.find(c => c.name.toLowerCase() === newCategory.name.toLowerCase() && c.gender === newCategory.gender);
            if (exists) {
                alert("Bu kategori zaten mevcut.");
                return;
            }
            await addCategory(newCategory);
            alert("Kategori eklendi!");
            setNewCategory({ name: '', gender: 'female' });
        } catch (err) {
            alert("Hata: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (cat) => {
        if (window.confirm(`${cat.name} kategorisini silmek istediğinize emin misiniz?`)) {
            await removeCategory(cat.id);
        }
    };

    return (
        <div className="admin-section">
            <div className="add-form glass">
                <h3>Yeni Kategori Ekle</h3>
                <div className="form-grid">
                    <input
                        type="text"
                        placeholder="Kategori Adı (Örn: Tayt, Tişört)"
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

                    <div className="form-actions">
                        <button className="glow-btn" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Ekleniyor...' : 'Kategori Ekle'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="list-container">
                <div className="section-title-wrapper" style={{ marginBottom: '2rem', textAlign: 'left' }}>
                    <h2 className="section-title" style={{ fontSize: '1.5rem' }}>Mevcut Kategoriler ({categories.length})</h2>
                    <div className="title-accent" style={{ margin: '0' }}></div>
                </div>
                <div className="admin-grid">
                    {categories?.map((cat, idx) => (
                        <div key={cat.id || idx} className="admin-item glass" style={{ justifyContent: 'space-between' }}>
                            <div>
                                <h4 style={{ margin: 0 }}>{cat.name}</h4>
                                <small style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                    {cat.gender === 'female' ? 'Kadın' : cat.gender === 'male' ? 'Erkek' : 'Unisex'}
                                </small>
                            </div>
                            <button className="delete-btn" onClick={() => handleDelete(cat)}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminCategories;
