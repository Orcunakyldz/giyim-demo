import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const AdminCategories = ({ categories }) => {
    const { addCategory, removeCategory } = useShop();
    const [newCategory, setNewCategory] = useState({ name: '', gender: 'female' });

    const handleAdd = async () => {
        if (!newCategory.name) return;

        const exists = categories.find(c => c.name.toLowerCase() === newCategory.name.toLowerCase() && c.gender === newCategory.gender);
        if (exists) {
            alert("Bu kategori zaten mevcut.");
            return;
        }

        await addCategory(newCategory);
        setNewCategory({ name: '', gender: 'female' });
    };

    const handleDelete = async (cat) => {
        if (window.confirm(`${cat.name} kategorisini silmek istediğinize emin misiniz?`)) {
            await removeCategory(cat.id);
        }
    };

    return (
        <div className="admin-section">
            <div className="add-form glass">
                <h3>Yeni Kategori</h3>
                <div className="form-grid" style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Kategori Adı"
                        value={newCategory.name}
                        onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                        style={{ flex: 1 }}
                    />
                    <select
                        value={newCategory.gender}
                        onChange={e => setNewCategory({ ...newCategory, gender: e.target.value })}
                        style={{ width: '150px' }}
                    >
                        <option value="female">Kadın</option>
                        <option value="male">Erkek</option>
                        <option value="unisex">Unisex</option>
                    </select>
                    <button className="glow-btn" onClick={handleAdd}>
                        <Plus size={18} /> Ekle
                    </button>
                </div>
            </div>
            <div className="list-container">
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
