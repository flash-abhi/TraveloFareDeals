import React, { useState, useRef, useEffect } from 'react';
import { Users, Plus, Minus } from 'lucide-react';
import './PassengerSelector.css';

function PassengerSelector({ value, onChange, type = 'flight' }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [passengers, setPassengers] = useState(
    value || {
      adults: 1,
      children: 0,
      infants: 0
    }
  );
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updatePassengers = (field, value) => {
    const newPassengers = { ...passengers, [field]: value };
    setPassengers(newPassengers);
    onChange(newPassengers);
  };

  const increment = (field) => {
    const limits = {
      adults: 9,
      children: 9,
      infants: passengers.adults // Infants can't exceed adults
    };
    if (passengers[field] < limits[field]) {
      updatePassengers(field, passengers[field] + 1);
    }
  };

  const decrement = (field) => {
    const minimums = {
      adults: 1, // At least 1 adult required
      children: 0,
      infants: 0
    };
    if (passengers[field] > minimums[field]) {
      updatePassengers(field, passengers[field] - 1);
    }
  };

  const getTotalPassengers = () => {
    return passengers.adults + passengers.children + passengers.infants;
  };

  const getDisplayText = () => {
    const total = getTotalPassengers();
    if (type === 'hotel') {
      return `${total} Guest${total !== 1 ? 's' : ''}`;
    }
    
    const parts = [];
    if (passengers.adults > 0) parts.push(`${passengers.adults} Adult${passengers.adults !== 1 ? 's' : ''}`);
    if (passengers.children > 0) parts.push(`${passengers.children} Child${passengers.children !== 1 ? 'ren' : ''}`);
    if (passengers.infants > 0) parts.push(`${passengers.infants} Infant${passengers.infants !== 1 ? 's' : ''}`);
    
    return parts.join(', ') || '1 Adult';
  };

  return (
    <div className="passenger-selector" ref={wrapperRef}>
      <div 
        className="passenger-display"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Users size={20} className="field-icon" />
        <span className="passenger-text">{getDisplayText()}</span>
      </div>

      {showDropdown && (
        <div className="passenger-dropdown">
          <div className="passenger-row">
            <div className="passenger-info">
              <span className="passenger-label">Adults</span>
              <span className="passenger-desc">12+ years</span>
            </div>
            <div className="passenger-controls">
              <button
                type="button"
                className="control-btn"
                onClick={() => decrement('adults')}
                disabled={passengers.adults <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="passenger-count">{passengers.adults}</span>
              <button
                type="button"
                className="control-btn"
                onClick={() => increment('adults')}
                disabled={passengers.adults >= 9}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="passenger-row">
            <div className="passenger-info">
              <span className="passenger-label">Children</span>
              <span className="passenger-desc">2-11 years</span>
            </div>
            <div className="passenger-controls">
              <button
                type="button"
                className="control-btn"
                onClick={() => decrement('children')}
                disabled={passengers.children <= 0}
              >
                <Minus size={16} />
              </button>
              <span className="passenger-count">{passengers.children}</span>
              <button
                type="button"
                className="control-btn"
                onClick={() => increment('children')}
                disabled={passengers.children >= 9}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="passenger-row">
            <div className="passenger-info">
              <span className="passenger-label">Infants</span>
              <span className="passenger-desc">Under 2 years</span>
            </div>
            <div className="passenger-controls">
              <button
                type="button"
                className="control-btn"
                onClick={() => decrement('infants')}
                disabled={passengers.infants <= 0}
              >
                <Minus size={16} />
              </button>
              <span className="passenger-count">{passengers.infants}</span>
              <button
                type="button"
                className="control-btn"
                onClick={() => increment('infants')}
                disabled={passengers.infants >= passengers.adults}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {passengers.infants >= passengers.adults && passengers.infants > 0 && (
            <div className="passenger-note">
              Note: Each infant requires an accompanying adult
            </div>
          )}

          <div className="passenger-footer">
            <button
              type="button"
              className="done-btn"
              onClick={() => setShowDropdown(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PassengerSelector;
