import React from 'react';
import { useSiteSettings } from '../context/ContactContext';
import './Logo.css';

function Logo({ size = 'medium' }) {
  const { siteSettings } = useSiteSettings();

  const sizeClasses = {
    small: 'logo-small',
    medium: 'logo-medium',
    large: 'logo-large'
  };

  return (
    <div className={`logo-container ${sizeClasses[size]}`}>
     <img
        src={siteSettings.logoUrl || '/logo.png'}
        alt={siteSettings.siteName || 'TraveloFare'}
        className="logo-img"
        onError={(e) => { e.target.src = '/logo.pn'; }}
      />
    </div>
  );
}

export default Logo;
