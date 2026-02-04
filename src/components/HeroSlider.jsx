import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const HeroSlider = () => {
  const { banners = [] } = useShop();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  // Unified Timer Effect
  useEffect(() => {
    if (!banners || banners.length <= 1) {
      if (current !== 0) setCurrent(0);
      return;
    }

    const timer = setInterval(() => {
      setCurrent((prev) => (prev >= banners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length, current]);

  if (!banners || banners.length === 0) return null;

  // Paranoid Index Safety: Always fallback to 0 if out of bounds
  const safeIndex = (current >= 0 && current < banners.length) ? current : 0;
  const currentBanner = banners[safeIndex];

  if (!currentBanner) return null;

  return (
    <div className="hero-slider">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner.id || safeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="slide"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${currentBanner.image || ''})` }}
        >
          <div className="section-container">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="slide-content"
            >
              <h2 className="subtitle">{currentBanner.subtitle || ''}</h2>
              <h1 className="title">{currentBanner.title || ''}</h1>
              <button className="glow-btn" onClick={() => navigate('/shop')}>{currentBanner.cta || 'Keşfet'}</button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {banners.length > 1 && (
        <div className="slider-controls">
          <button onClick={() => setCurrent(safeIndex === 0 ? banners.length - 1 : safeIndex - 1)}><ChevronLeft size={32} /></button>
          <button onClick={() => setCurrent(safeIndex === banners.length - 1 ? 0 : safeIndex + 1)}><ChevronRight size={32} /></button>
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
