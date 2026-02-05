import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const AdminCollections = () => {
    const { collections, addCollection, updateCollection, removeCollection } = useShop();
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newCollection, setNewCollection] = useState({ name: '', gender: 'female', image: '', description: '', show_on_home: false });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewCollection(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!newCollection.name) return;

        setIsSaving(true);
        try {
            if (editingId) {
                await updateCollection({ ...newCollection, id: editingId });
                alert("Koleksiyon güncellendi!");
                setEditingId(null);
            } else {
                await addCollection(newCollection);
                alert("Koleksiyon başarıyla eklendi!");
            }
            setNewCollection({ name: '', gender: 'female', image: '', description: '', show_on_home: false });
        } catch (err) {
            alert("Hata: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const startEdit = (col) => {
        setEditingId(col.id);
        setNewCollection({ ...col });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewCollection({ name: '', gender: 'female', image: '', description: '', show_on_home: false });
    };

    const handleDelete = async (col) => {
        if (window.confirm(`${col.name} koleksiyonunu silmek istediğinize emin misiniz?`)) {
            await removeCollection(col.id);
        }
    };

    return (
        <div className="admin-section">
            <div className={`add-form glass ${editingId ? 'editing' : ''}`}>
                <h3>{editingId ? 'Koleksiyonu Düzenle' : 'Yeni Koleksiyon Ekle'}</h3>
                <div className="form-grid">
                    <input
                        type="text"
                        placeholder="Koleksiyon Adı (Örn: Yaz 24, Performance)"
                        value={newCollection.name}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <select
                        value={newCollection.gender}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, gender: e.target.value }))}
                    >
                        <option value="female">Kadın</option>
                        <option value="male">Erkek</option>
                        <option value="unisex">Unisex</option>
                    </select>

                    <div className="full-width-input" style={{ gridColumn: '1 / -1' }}>
                        <textarea
                            placeholder="Koleksiyon Açıklaması"
                            value={newCollection.description}
                            onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                            rows={2}
                            style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <div className="full-width-input" style={{ gridColumn: '1 / -1' }}>
                        <div className="image-upload-wrapper" style={{ border: '2px dashed var(--border)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                            {newCollection.image ? (
                                <div style={{ position: 'relative' }}>
                                    <img src={newCollection.image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                                    <button onClick={() => setNewCollection(prev => ({ ...prev, image: '' }))} style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: '50%', width: '30px', height: '30px', border: 'none' }}>×</button>
                                </div>
                            ) : (
                                <>
                                    <p style={{ color: '#888', marginBottom: '1rem' }}>Görsel Seç</p>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} id="col-img" style={{ display: 'none' }} />
                                    <label htmlFor="col-img" className="glow-btn" style={{ cursor: 'pointer', padding: '0.8rem 1.5rem', fontSize: '0.8rem' }}>Dosya Seç</label>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="full-width-input" style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input
                            type="checkbox"
                            id="show_on_home_col"
                            checked={newCollection.show_on_home}
                            onChange={(e) => setNewCollection(prev => ({ ...prev, show_on_home: e.target.checked }))}
                            style={{ width: '20px', height: '20px' }}
                        />
                        <label htmlFor="show_on_home_col" style={{ fontWeight: 700, cursor: 'pointer' }}>Anasayfada göster</label>
                    </div>

                    <div className="form-actions" style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
                        <button className="glow-btn" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Kaydediliyor...' : (editingId ? 'Güncelle' : 'Ekle')}
                        </button>
                        {editingId && (
                            <button className="glow-btn" style={{ background: '#666' }} onClick={cancelEdit}>İptal</button>
                        )}
                    </div>
                </div>
            </div>

            <div className="list-container">
                <div className="section-title-wrapper" style={{ marginBottom: '2rem', textAlign: 'left' }}>
                    <h2 className="section-title" style={{ fontSize: '1.5rem' }}>Mevcut Koleksiyonlar ({collections.length})</h2>
                    <div className="title-accent" style={{ margin: '0' }}></div>
                </div>
                <div className="admin-grid">
                    {collections?.map((col, idx) => (
                        <div key={col.id || idx} className="admin-item glass" style={{ justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                {col.image && (
                                    <img src={col.image} alt={col.name} style={{ width: '50px', height: '50px', borderRadius: '5px', objectFit: 'cover' }} />
                                )}
                                <div>
                                    <h4 style={{ margin: 0 }}>{col.name}</h4>
                                    <small style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                        {col.gender === 'female' ? 'Kadın' : col.gender === 'male' ? 'Erkek' : 'Unisex'}
                                    </small>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="edit-btn" onClick={() => startEdit(col)} style={{ color: 'var(--accent-cyan)' }}>✏️</button>
                                <button className="delete-btn" onClick={() => handleDelete(col)}>
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

export default AdminCollections;
