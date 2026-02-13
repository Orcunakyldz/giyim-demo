import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Package, Image as ImageIcon, Megaphone, Plus, ShoppingCart, Info, Users, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

// Modular Components
import AdminProducts from '../components/admin/AdminProducts';
import AdminCategories from '../components/admin/AdminCategories';
import AdminCollections from '../components/admin/AdminCollections';
import AdminBanners from '../components/admin/AdminBanners';
import AdminAnnouncements from '../components/admin/AdminAnnouncements';
import AdminOrders from '../components/admin/AdminOrders';
import AdminAbout from '../components/admin/AdminAbout';
import AdminCustomers from '../components/admin/AdminCustomers';
import AdminSocial from '../components/admin/AdminSocial';
import AdminCoupons from '../components/admin/AdminCoupons';

const Admin = () => {
  const {
    products, setProducts,
    banners, setBanners,
    announcements, setAnnouncements,
    categories, setCategories,
    orders, deleteOrder,
    aboutData, setAboutData,
    allProfiles, fetchCustomers
  } = useShop();

  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="admin-page">
      <div className="admin-sidebar glass">
        <Link to="/" className="admin-logo">GIYIM<span>.</span> ADMIN</Link>
        <div className="admin-nav">
          <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
            <Package size={20} /> <span>Ürünler</span>
          </button>
          <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => setActiveTab('categories')}>
            <Plus size={20} /> <span>Kategoriler</span>
          </button>
          <button className={activeTab === 'collections' ? 'active' : ''} onClick={() => setActiveTab('collections')}>
            <ImageIcon size={20} /> <span>Koleksiyonlar</span>
          </button>
          <button className={activeTab === 'banners' ? 'active' : ''} onClick={() => setActiveTab('banners')}>
            <ImageIcon size={20} /> <span>Reklamlar</span>
          </button>
          <button className={activeTab === 'announcements' ? 'active' : ''} onClick={() => setActiveTab('announcements')}>
            <Megaphone size={20} /> <span>Duyuru Satırı</span>
          </button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            <ShoppingCart size={20} /> <span>Siparişler</span>
          </button>
          <button className={activeTab === 'customers' ? 'active' : ''} onClick={() => setActiveTab('customers')}>
            <Users size={20} /> <span>Müşteriler</span>
          </button>
          <button className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>
            <Info size={20} /> <span>Hakkımızda</span>
          </button>
          <button className={activeTab === 'social' ? 'active' : ''} onClick={() => setActiveTab('social')}>
            <ImageIcon size={20} /> <span>Social Galeri</span>
          </button>
          <button className={activeTab === 'coupons' ? 'active' : ''} onClick={() => setActiveTab('coupons')}>
            <Tag size={20} /> <span>Kuponlar</span>
          </button>
        </div>
      </div>

      <main className="admin-content">
        <header className="content-header">
          <h1>
            {activeTab === 'products' ? 'Ürün Yönetimi' :
              activeTab === 'categories' ? 'Kategori Yönetimi' :
                activeTab === 'collections' ? 'Koleksiyon Yönetimi' :
                  activeTab === 'banners' ? 'Reklam Panoları (Billboards)' :
                    activeTab === 'orders' ? 'Siparişler' :
                      activeTab === 'customers' ? 'Müşteri Yönetimi' :
                        activeTab === 'about' ? 'Hakkımızda Sayfası' :
                          activeTab === 'social' ? 'Anasayfa Sosyal Galeri' :
                            activeTab === 'coupons' ? 'Kupon ve Promosyon Yönetimi' : 'Duyuru Satırı Yönetimi'}
          </h1>
        </header>

        <div className="admin-section-container">
          {activeTab === 'products' && (
            <AdminProducts
              products={products}
              categories={categories}
            />
          )}

          {activeTab === 'categories' && (
            <AdminCategories
              categories={categories}
            />
          )}

          {activeTab === 'collections' && (
            <AdminCollections />
          )}

          {activeTab === 'banners' && (
            <AdminBanners
              banners={banners}
            />
          )}

          {activeTab === 'announcements' && (
            <AdminAnnouncements
              announcements={announcements}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrders
              orders={orders}
            />
          )}

          {activeTab === 'customers' && (
            <AdminCustomers
              allProfiles={allProfiles}
              fetchCustomers={fetchCustomers}
            />
          )}

          {activeTab === 'about' && (
            <AdminAbout
              aboutData={aboutData}
            />
          )}

          {activeTab === 'social' && (
            <AdminSocial />
          )}

          {activeTab === 'coupons' && (
            <AdminCoupons />
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
