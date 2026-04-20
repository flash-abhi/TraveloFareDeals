import React, { useState, useEffect } from 'react';
import { Plane, Globe, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import './AirlineBanner.css';

function AirlineBanner({ onExploreClick }) {
  const [airlines, setAirlines] = useState([]);

  useEffect(() => {
    fetchFeaturedAirlines();
  }, []);

  const fetchFeaturedAirlines = async () => {
    try {
      const response = await fetch('/api/airlines');
      const data = await response.json();
      if (data.success) {
        // Get 6 random featured airlines
        const featured = data.data
          .sort(() => Math.random() - 0.5)
          .slice(0, 6);
        setAirlines(featured);
      }
    } catch (error) {
      console.error('Error fetching airlines:', error);
    }
  };

  return (
    <div className="airline-banner">
      <div className="banner-content">
        <div className="banner-text">
          <h2>Choose from 50+ Premium Airlines</h2>
          <p>
            Select your preferred airlines and alliances for a personalized flight search experience. 
            Compare prices across Star Alliance, Oneworld, and SkyTeam carriers.
          </p>
          
          <div className="banner-features">
            <div className="banner-feature">
              <CheckCircle size={18} />
              <span>Best Price Guarantee</span>
            </div>
            <div className="banner-feature">
              <CheckCircle size={18} />
              <span>Real-time Availability</span>
            </div>
            <div className="banner-feature">
              <CheckCircle size={18} />
              <span>Instant Confirmation</span>
            </div>
          </div>

          <div className="banner-action">
            <button 
              className="explore-airlines-btn"
              onClick={onExploreClick}
            >
              <Plane size={20} />
              Explore Airlines
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="banner-stats">
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Airlines</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Destinations</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support</span>
          </div>
        </div>
      </div>

      {airlines.length > 0 && (
        <div className="banner-logos" style={{ marginTop: '25px' }}>
          {airlines.map(airline => (
            <div key={airline.code} className="banner-logo-item">
              <img
                src={`${airline.logo.replace('.png', '.svg')}`}
                alt={airline.name}
                title={airline.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/airlines/default.svg';
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AirlineBanner;
