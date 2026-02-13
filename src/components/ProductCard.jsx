import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart, reviews } = useShop();
  const productReviews = reviews?.filter(r => String(r.product_id) === String(product.id)) || [];
  const avgRating = productReviews.length > 0
    ? (productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length)
    : 0;
  const navigate = useNavigate();
  const discountedPrice = product.discount > 0
    ? (product.price * (100 - product.discount)) / 100
    : product.price;

  /* Local state for button feedback */
  const [isAdded, setIsAdded] = React.useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const [hover, setHover] = React.useState(false);

  return (
    <div
      className={`product-card ${hover ? 'is-hovered' : ''}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="product-image-container" onClick={() => navigate(`/product/${product.id}`)}>
        <div
          className="product-image primary"
          style={{ backgroundImage: `url(${product.image})` }}
        />
        {product.images && product.images.length > 1 && (
          <div
            className="product-image secondary"
            style={{ backgroundImage: `url(${product.images[1]})` }}
          />
        )}

        {product.discount > 0 && (
          <div className="discount-tag">-%{product.discount}</div>
        )}

        <div className="hover-overlay-v2">
          <span className="quick-look-text">HIZLI BAKIŞ</span>
          <div className="overlay-actions">
            <button className="icon-btn" onClick={handleAddToCart}>
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="product-info">
        <div className="price-container">
          <span className="price-tag">₺{discountedPrice.toFixed(0)}</span>
          {product.discount > 0 && (
            <span className="old-price-tag">₺{product.price}</span>
          )}
        </div>

        <div className="brand-name">{product.category.toUpperCase()}</div>
        <h3 className="product-title" onClick={() => navigate(`/product/${product.id}`)}>{product.name}</h3>

        <div className="rating-container">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                fill={star <= avgRating ? "var(--rating-gold)" : "none"}
                color={star <= avgRating ? "var(--rating-gold)" : "#ccc"}
              />
            ))}
          </div>
          <span className="rating-count">({productReviews.length})</span>
        </div>

        <div className="delivery-info">
          Mağazadan Ücretsiz Teslimat
        </div>

        <button
          className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
          onClick={handleAddToCart}
          disabled={isAdded || product.stock === 0}
        >
          {product.stock === 0 ? 'STOKTA YOK' : (isAdded ? 'Sepete Eklendi ✔' : 'Sepete Ekle')}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
