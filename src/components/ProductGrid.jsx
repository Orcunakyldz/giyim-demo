import React from 'react';
import ProductCard from './ProductCard';
import { useShop } from '../context/ShopContext';

const ProductGrid = ({ limit }) => {
  const { products } = useShop();

  const displayProducts = products && Array.isArray(products)
    ? products.filter(p => p.is_best_seller).slice(0, limit || 8)
    : [];

  return (
    <div className="grid">
      {displayProducts.length > 0 ? (
        displayProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="loading-placeholder">Ürünler Yükleniyor...</div>
      )}
    </div>
  );
};

export default ProductGrid;
