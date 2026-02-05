import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X as CloseIcon } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const AdminProducts = ({ products, categories }) => {
    const { addProduct, updateProduct, removeProduct } = useShop();
    const [editingId, setEditingId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        category: categories[0]?.name || '',
        gender: 'female',
        image: '',
        images: [],
        discount: 0,
        isBestSeller: false,
        stock: 50,
        collection: '',
        size_stock: { S: 10, M: 10, L: 10, XL: 10 }
    });

    const handleSave = async () => {
        if (!newProduct.name || !newProduct.price) {
            alert("Lütfen ürün adı ve fiyat bilgisini doldurun.");
            return;
        }

        setIsSaving(true);
        try {
            const finalProduct = {
                ...newProduct,
                image: newProduct.images?.length > 0 ? newProduct.images[0] : newProduct.image,
                price: Number(newProduct.price)
            };

            if (editingId) {
                const { error } = await updateProduct({ ...finalProduct, id: editingId });
                if (error) throw error;
                alert("Ürün başarıyla güncellendi!");
                setEditingId(null);
            } else {
                const { error } = await addProduct(finalProduct);
                if (error) throw error;
                alert("Yeni ürün başarıyla eklendi!");
            }

            setNewProduct({
                name: '',
                price: '',
                category: categories[0]?.name || '',
                gender: 'female',
                image: '',
                images: [],
                discount: 0,
                isBestSeller: false,
                stock: 50,
                collection: '',
                size_stock: { S: 10, M: 10, L: 10, XL: 10 }
            });
        } catch (err) {
            console.error("Product save error:", err);
            alert("Kaydedilirken bir hata oluştu: " + (err.message || "Bilinmeyen hata"));
        } finally {
            setIsSaving(false);
        }
    };

    const startEditProduct = (p) => {
        setEditingId(p.id);
        setNewProduct({
            ...p,
            size_stock: p.size_stock || { S: 10, M: 10, L: 10, XL: 10 },
            images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : [])
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct(prev => ({
                    ...prev,
                    images: [...(prev.images || []), reader.result],
                    image: prev.image || reader.result
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewProduct({
            name: '',
            price: '',
            category: categories[0]?.name || '',
            gender: 'female',
            image: '',
            images: [],
            discount: 0,
            isBestSeller: false,
            stock: 50,
            collection: '',
            size_stock: { S: 10, M: 10, L: 10, XL: 10 }
        });
    };

    return (
        <div className="admin-section">
            <div className={`add-form glass ${editingId ? 'editing' : ''}`}>
                <h3>{editingId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h3>
                <div className="form-grid">
                    <input
                        type="text"
                        placeholder="Ürün Adı"
                        value={newProduct.name}
                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Fiyat (TL)"
                        value={newProduct.price}
                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <select
                            value={newProduct.category}
                            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                        >
                            <option value="">Kategori Seçin</option>
                            {categories?.map(cat => (
                                <option key={`${cat.id || cat.name}`} value={cat.name}>
                                    {cat.name} ({cat.gender === 'female' ? 'Kadın' : cat.gender === 'male' ? 'Erkek' : 'Unisex'})
                                </option>
                            ))}
                        </select>

                        <select
                            value={newProduct.gender}
                            onChange={e => setNewProduct({ ...newProduct, gender: e.target.value })}
                        >
                            <option value="female">Kadın</option>
                            <option value="male">Erkek</option>
                            <option value="unisex">Unisex</option>
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <select
                            value={newProduct.collection}
                            onChange={e => setNewProduct({ ...newProduct, collection: e.target.value })}
                        >
                            <option value="">Koleksiyon Seçin (Opsiyonel)</option>
                            {useShop().collections?.map(col => (
                                <option key={col.id} value={col.name}>{col.name}</option>
                            ))}
                        </select>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                id="bestSeller"
                                checked={newProduct.isBestSeller}
                                onChange={e => setNewProduct({ ...newProduct, isBestSeller: e.target.checked })}
                                style={{ width: '20px', height: '20px' }}
                            />
                            <label htmlFor="bestSeller" style={{ fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>Anasayfa (Çok Satan)</label>
                        </div>
                    </div>

                    <div className="file-input-wrapper" style={{ gridColumn: 'span 2' }}>
                        <label>Ürün Görselleri ({newProduct.images?.length || 0})</label>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
                        <div className="image-preview-grid" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                            {newProduct.images?.map((img, idx) => (
                                <div key={idx} style={{ position: 'relative', width: '80px', height: '100px' }}>
                                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px', border: idx === 0 ? '2px solid var(--accent)' : '1px solid #ddd' }} />
                                    <button
                                        onClick={() => setNewProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                        style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="input-with-label">
                        <label>İndirim Oranı (%)</label>
                        <input
                            type="number"
                            placeholder="Örn: 20"
                            value={newProduct.discount}
                            onChange={e => setNewProduct({ ...newProduct, discount: Number(e.target.value) })}
                        />
                    </div>
                    <div className="input-with-label">
                        <label>Stok Adedi</label>
                        <input
                            type="number"
                            placeholder="Örn: 50"
                            value={newProduct.stock}
                            onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                        />
                    </div>
                    <div className="size-management-section" style={{ gridColumn: 'span 2', marginTop: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h4 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '0.9rem', letterSpacing: '0.05em' }}>BEDEN VE STOK YÖNETİMİ</h4>
                        <div className="size-stocks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
                            {['S', 'M', 'L', 'XL'].map(size => (
                                <div key={size} className="size-stock-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input
                                            type="checkbox"
                                            id={`size-${size}`}
                                            checked={(newProduct.size_stock?.[size] || 0) > 0}
                                            onChange={(e) => {
                                                const newSizeStock = { ...(newProduct.size_stock || { S: 0, M: 0, L: 0, XL: 0 }) };
                                                newSizeStock[size] = e.target.checked ? 10 : 0;
                                                setNewProduct({ ...newProduct, size_stock: newSizeStock });
                                            }}
                                        />
                                        <label htmlFor={`size-${size}`} style={{ fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>{size}</label>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="Adet"
                                        min="0"
                                        value={newProduct.size_stock?.[size] || 0}
                                        onChange={(e) => {
                                            const newSizeStock = { ...(newProduct.size_stock || { S: 0, M: 0, L: 0, XL: 0 }) };
                                            newSizeStock[size] = Number(e.target.value);
                                            setNewProduct({ ...newProduct, size_stock: newSizeStock });
                                        }}
                                        style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', opacity: (newProduct.size_stock?.[size] || 0) > 0 ? 1 : 0.5 }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

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

            <div className="list-container">
                <h3>Ürün Listesi ({products?.length || 0})</h3>
                <div className="admin-grid">
                    {products?.map(product => {
                        if (!product) return null;
                        return (
                            <div key={product.id} className="admin-item glass">
                                <img src={product.image} alt={product.name} />
                                <div className="item-details">
                                    <h4>{product.name} {product.isBestSeller && <span className="best-seller-tag">ÇOK SATAN</span>}</h4>
                                    <div className="admin-info-row" style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <span className="admin-badge badge-price">{product.price} TL</span>
                                            {product.discount > 0 && <span className="admin-badge badge-discount">%{product.discount} İndirim</span>}
                                        </div>
                                        <div className="size-status-row" style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '0.7rem', color: '#888', marginRight: '0.2rem', fontWeight: 700 }}>Bedenler:</span>
                                            {['S', 'M', 'L', 'XL'].map(size => (
                                                <span
                                                    key={size}
                                                    style={{
                                                        fontSize: '0.65rem',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        backgroundColor: (product.size_stock?.[size] || 0) > 0 ? 'rgba(46, 125, 50, 0.2)' : 'rgba(255,255,255,0.05)',
                                                        color: (product.size_stock?.[size] || 0) > 0 ? '#4caf50' : '#666',
                                                        border: (product.size_stock?.[size] || 0) > 0 ? '1px solid #4caf50' : '1px solid #444',
                                                        textDecoration: (product.size_stock?.[size] || 0) > 0 ? 'none' : 'line-through'
                                                    }}
                                                >
                                                    {size}: {product.size_stock?.[size] || 0}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <small style={{ display: 'block', color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>
                                        {product.category} | {product.collection || 'Koleksiyon Yok'} | {product.gender === 'female' ? 'Kadın' : 'Erkek'}
                                    </small>
                                </div>
                                <div className="item-actions">
                                    <button className="edit-btn" onClick={() => startEditProduct(product)}>
                                        <Edit2 size={18} />
                                    </button>
                                    <button className="delete-btn" onClick={() => removeProduct(product.id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;
