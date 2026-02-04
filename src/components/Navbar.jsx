import React, { useState } from 'react';
import { ShoppingBag, User, Menu } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import CartSidebar from './CartSidebar';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const { cart, currentUser } = useShop();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav className="navbar glass">
        <div className="section-container">
          <div className="nav-content">
            <div className="menu-trigger" onClick={() => setIsMenuOpen(true)}>
              <Menu size={28} />
            </div>
            <Link to="/" className="logo">GIYIM<span>.</span></Link>

            <div className="nav-links">
              <Link to="/shop">Mağaza</Link>
              <Link to="/collections">Koleksiyonlar</Link>
              <Link to="/about">Hakkımızda</Link>
            </div>

            <div className="nav-actions">
              {currentUser ? (
                <Link to="/account" className="admin-link">
                  <User size={24} />
                  <span className="nav-label" style={{ fontSize: '0.7rem', fontWeight: 800 }}>HESABIM</span>
                </Link>
              ) : (
                <Link to="/auth" className="admin-link">
                  <User size={24} />
                  <span className="nav-label" style={{ fontSize: '0.7rem', fontWeight: 800 }}>GİRİŞ</span>
                </Link>
              )}

              <Link to="/admin" className="admin-link" title="Admin Panel">
                <span style={{ fontSize: '0.6rem', background: '#000', color: '#fff', padding: '2px 5px', borderRadius: '4px' }}>ADM</span>
              </Link>

              <div className="cart-trigger" onClick={() => setIsCartOpen(true)} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <ShoppingBag size={30} style={{ transition: 'transform 0.2s', cursor: 'pointer' }} />
                {cartCount > 0 && (
                  <span className="badge" style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-8px',
                    background: '#000',
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #fff'
                  }}>
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Navbar;
