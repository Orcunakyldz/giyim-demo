import React, { useState } from 'react';
import { Trash2, Edit2, Save, X as CloseIcon, Plus } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const AdminAnnouncements = ({ announcements }) => {
    const { addAnnouncement, updateAnnouncement, deleteAnnouncement } = useShop();
    const [isSaving, setIsSaving] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({ text: '' });

    const handleSave = async () => {
        if (!newAnnouncement.text) return;
        setIsSaving(true);
        try {
            if (editingId) {
                const { error } = await updateAnnouncement(editingId, newAnnouncement.text);
                if (error) throw error;
                alert("Duyuru güncellendi!");
                setEditingId(null);
            } else {
                const { error } = await addAnnouncement(newAnnouncement.text);
                if (error) throw error;
                alert("Yeni duyuru eklendi!");
            }
            setNewAnnouncement({ text: '' });
        } catch (err) {
            alert("Hata: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const startEditAnnouncement = (a) => {
        setEditingId(a.id);
        setNewAnnouncement({ text: a.content });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewAnnouncement({ text: '' });
    };

    return (
        <div className="admin-section">
            <div className={`add-form glass ${editingId ? 'editing' : ''}`}>
                <h3>Duyuru Metni</h3>
                <div className="form-grid" style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Mesaj..."
                        value={newAnnouncement.text}
                        onChange={e => setNewAnnouncement({ ...newAnnouncement, text: e.target.value })}
                        style={{ flex: 1 }}
                    />
                    <button className="glow-btn" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? '...' : (editingId ? <Save size={18} /> : <Plus size={18} />)}
                    </button>
                    {editingId && (
                        <button className="glow-btn" onClick={cancelEdit} style={{ background: '#666' }} disabled={isSaving}>
                            <CloseIcon size={18} />
                        </button>
                    )}
                </div>
            </div>
            <div className="list-container">
                {announcements?.map((a) => (
                    <div key={a.id} className="admin-item glass" style={{ justifyContent: 'space-between' }}>
                        <p style={{ margin: 0 }}>{a.content}</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="edit-btn" onClick={() => startEditAnnouncement(a)} style={{ color: '#000' }}>
                                <Edit2 size={18} />
                            </button>
                            <button className="delete-btn" onClick={() => deleteAnnouncement(a.id)}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminAnnouncements;
