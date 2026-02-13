import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, MessageCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateCartQuantity, placeOrder, currentUser } = useShop();
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
              {cart.length === 0 ? (
                <div className="empty-cart" style={{ padding: '2rem' }}>
                  <p>Sepetiniz boş.</p>
                  <button className="glow-btn" onClick={onClose} style={{ marginTop: '2rem' }}>Alışverişe Başla</button>
                </div>
              ) : (
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
                    <button className="glow-btn full-btn checkout-btn" onClick={() => { onClose(); navigate('/checkout'); }}>Siparişini Tamamla</button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
