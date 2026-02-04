import React from 'react';
import ProductCard from './ProductCard';
import { useShop } from '../context/ShopContext';

const ProductGrid = () => {
  const { products } = useShop();

  return (
    <section className="product-grid-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">En Çok Satanlar</h2>
          <p className="section-desc">Performansınızı zirveye taşıyacak koleksiyonumuzu keşfedin.</p>
        </div>
        <div className="grid">
          {products && Array.isArray(products) ? (
            products.filter(p => p.isBestSeller).map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="loading-placeholder">Ürünler Yükleniyor...</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
