import React from 'react';
import { useShop } from '../context/ShopContext';

const AnnouncementBar = () => {
  const { announcements } = useShop();

  return (
    <div className="announcement-bar">
      <div className="scrolling-wrapper">
        <div className="scrolling-content">
          {[...announcements, ...announcements].map((item, index) => (
            <span key={index} className="announcement-item">
              {item.content || item}
              <span className="separator">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
