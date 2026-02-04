import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, MessageCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, placeOrder, currentUser } = useShop();
  const navigate = useNavigate();
  const [step, setStep] = useState('cart'); // cart, checkout, success
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
  const [isSimulating, setIsSimulating] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      setCustomer({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        address: customer.address || '' // Keep address if they typed it
      });
    }
  }, [currentUser, isOpen]);

  const total = cart.reduce((acc, item) => acc + (item.price * (1 - item.discount / 100)) * item.quantity, 0);

  const handleCheckout = () => {
    if (!customer.name || !customer.phone || !customer.address) return alert('Lütfen tüm bilgileri doldurun.');

    // Record the order as pending
    placeOrder(customer, 'pending');

    // iyzico Payment Link (Placeholder)
    // ÖNEMLİ: Buradaki linki iyzico panelinizden aldığınız gerçek linkle değiştirin.
    const iyzicoPaymentUrl = "https://iyzi.link/AIxyzPlaceholder";

    // Redirect to iyzico
    window.location.href = iyzicoPaymentUrl;
  };

  const closeAndReset = () => {
    onClose();
    setStep('cart');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAndReset}
            className="cart-overlay"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="cart-sidebar glass"
          >
            <div className="cart-header">
              <div className="title">
                <ShoppingBag size={24} />
                <h2>{step === 'success' ? 'Başarılı!' : 'Sepetim'}</h2>
              </div>
              <button onClick={closeAndReset}><X size={28} /></button>
            </div>

            <div className="cart-content">
              {cart.length === 0 && step !== 'success' ? (
                <div className="empty-cart" style={{ padding: '2rem' }}>
                  <p>Sepetiniz boş.</p>
                  <button className="glow-btn" onClick={onClose} style={{ marginTop: '2rem' }}>Alışverişe Başla</button>
                </div>
              ) : step === 'success' ? (
                <div className="order-success-view" style={{ padding: '3rem', textAlign: 'center' }}>
                  <div className="success-icon" style={{ color: '#000', marginBottom: '2rem' }}>
                    <CheckCircle size={80} strokeWidth={1} />
                  </div>
                  <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Siparişiniz Alındı!</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
                    Sipariş simülasyonu başarıyla tamamlandı. Artık Admin panelinden siparişi kontrol edebilirsiniz.
                  </p>
                  <button className="glow-btn full-btn" onClick={closeAndReset}>Kapat</button>
                </div>
              ) : step === 'cart' ? (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={`${item.id}-${item.size}`} className="cart-item glass">
                        <div className="item-image-wrapper">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="item-info">
                          <h4>{item.name}</h4>
                          <span className="item-size-badge">BEDEN: {item.size}</span>
                          <p className="item-price">{(item.price * (1 - item.discount / 100)).toFixed(0)} TL</p>

                          <div className="quantity-controls">
                            <button onClick={() => updateCartQuantity(item.id, item.size, -1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.id, item.size, 1)}>+</button>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id, item.size)} className="delete-btn">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="cart-footer">
                    <div className="total-row">
                      <span>ARA TOPLAM</span>
                      <span className="total-price">{total.toFixed(0)} TL</span>
                    </div>
                    <p className="shipping-info">Kargo: <span>ÜCRETSİZ</span></p>
                    <button className="glow-btn full-btn checkout-btn" onClick={() => setStep('checkout')}>Siparişini Tamamla</button>
                  </div>
                </>
              ) : (
                <div className="checkout-form" style={{ padding: '2rem' }}>
                  <h3>Sipariş Bilgileri</h3>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="input-with-label">
                      <label style={{ fontSize: '0.7rem', fontWeight: 800 }}>AD SOYAD</label>
                      <input
                        type="text"
                        placeholder="Adınız Soyadınız"
                        value={customer.name}
                        onChange={e => setCustomer({ ...customer, name: e.target.value })}
                        style={{ width: '100%', padding: '1rem', border: '1px solid #eee', borderRadius: '10px' }}
                      />
                    </div>
                    <div className="input-with-label">
                      <label style={{ fontSize: '0.7rem', fontWeight: 800 }}>TELEFON</label>
                      <input
                        type="tel"
                        placeholder="05XX XXX XX XX"
                        value={customer.phone}
                        onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                        style={{ width: '100%', padding: '1rem', border: '1px solid #eee', borderRadius: '10px' }}
                      />
                    </div>
                    <div className="input-with-label">
                      <label style={{ fontSize: '0.7rem', fontWeight: 800 }}>ADRES</label>
                      <textarea
                        placeholder="Teslimat Adresi"
                        value={customer.address}
                        onChange={e => setCustomer({ ...customer, address: e.target.value })}
                        rows={3}
                        style={{ width: '100%', padding: '1rem', border: '1px solid #eee', borderRadius: '10px', resize: 'none' }}
                      />
                    </div>
                    {!currentUser && (
                      <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
                        💡 <span onClick={() => { closeAndReset(); navigate('/auth'); }} style={{ color: '#000', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Giriş yaparak</span> bilgilerinizi kaydedebilirsiniz.
                      </p>
                    )}
                  </div>
                  <div className="cart-footer">
                    <button className="back-btn" onClick={() => setStep('cart')} style={{ border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer' }}>Geri Dön</button>
                    <button className="glow-btn whatsapp-btn" onClick={handleCheckout} disabled={isSimulating}>
                      {isSimulating ? 'Sipariş İşleniyor...' : 'Siparişi Tamamla'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
