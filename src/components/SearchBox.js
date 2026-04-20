import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, ArrowRightLeft } from 'lucide-react';
import AirportAutocomplete from './AirportAutocomplete';
import './SearchBox.css';

function SearchBox({ type = 'flight', selectedAirlines = [] }) {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: '',
    returnDate: '',
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    },
    tripType: 'roundtrip',
    cabinClass: 'economy',
    directFlights: false
  });

  const [showPassengers, setShowPassengers] = useState(false);
  const passengerRef = useRef(null);
  const departDateRef = useRef(null);
  const returnDateRef = useRef(null);

  // Close passenger dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (passengerRef.current && !passengerRef.current.contains(event.target)) {
        setShowPassengers(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTotalPassengers = () => {
    return searchData.passengers.adults + searchData.passengers.children + searchData.passengers.infants;
  };

  const updatePassengers = (type, delta) => {
    setSearchData({
      ...searchData,
      passengers: {
        ...searchData.passengers,
        [type]: Math.max(0, searchData.passengers[type] + delta)
      }
    });
  };

  const swapLocations = () => {
    setSearchData({
      ...searchData,
      from: searchData.to,
      to: searchData.from
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!searchData.from || !searchData.to) {
      alert('Please select departure and arrival airports');
      return;
    }
    if (!searchData.date) {
      alert('Please select a departure date');
      return;
    }
    if (searchData.tripType === 'roundtrip' && !searchData.returnDate) {
      alert('Please select a return date');
      return;
    }
    
    const params = new URLSearchParams();
    params.set('from', searchData.from.toUpperCase());
    params.set('to', searchData.to.toUpperCase());
    params.set('departDate', searchData.date);
    params.set('tripType', searchData.tripType);
    params.set('cabinClass', searchData.cabinClass);
    params.set('adults', String(searchData.passengers.adults));
    if (searchData.passengers.children) params.set('children', String(searchData.passengers.children));
    if (searchData.passengers.infants) params.set('infants', String(searchData.passengers.infants));
    if (searchData.tripType === 'roundtrip' && searchData.returnDate) {
      params.set('returnDate', searchData.returnDate);
    }
    if (searchData.directFlights) params.set('directFlights', 'true');
    if (selectedAirlines?.length > 0) params.set('airline', selectedAirlines[0]);

    navigate(`/flight-results?${params.toString()}`, {
      state: searchData
    });
  };

  return (
    <div className="search-box-modern">
      {/* Tab Navigation */}
      <div className="search-tabs">
        <button className="search-tab active">
          <span>✈️</span> Flights
        </button>
        <button className="search-tab">
          <span>🏨</span> Hotels
        </button>
        <button className="search-tab">
          <span>📦</span> Packages
        </button>
        <button className="search-tab">
          <span>🚗</span> Cars
        </button>
      </div>

      <form onSubmit={handleSubmit} className="search-form-modern">
        {/* Trip Type Toggle */}
        <div className="trip-type-toggle">
          <label className={searchData.tripType === 'roundtrip' ? 'active' : ''}>
            <input
              type="radio"
              name="tripType"
              value="roundtrip"
              checked={searchData.tripType === 'roundtrip'}
              onChange={(e) => setSearchData({ ...searchData, tripType: e.target.value })}
            />
            Round-trip
          </label>
          <label className={searchData.tripType === 'oneway' ? 'active' : ''}>
            <input
              type="radio"
              name="tripType"
              value="oneway"
              checked={searchData.tripType === 'oneway'}
              onChange={(e) => setSearchData({ ...searchData, tripType: e.target.value })}
            />
            One-way
          </label>
        </div>

        {/* Main Search Fields */}
        <div className="search-fields-row">
          {/* From Airport */}
          <div className="search-field from-field">
            <label>From</label>
            <AirportAutocomplete
              value={searchData.from}
              onChange={(value) => setSearchData({ ...searchData, from: value })}
              placeholder="City or Airport"
            />
          </div>

          {/* Swap Button */}
          <button type="button" className="swap-btn" onClick={swapLocations}>
            <ArrowRightLeft size={20} />
          </button>

          {/* To Airport */}
          <div className="search-field to-field">
            <label>To</label>
            <AirportAutocomplete
              value={searchData.to}
              onChange={(value) => setSearchData({ ...searchData, to: value })}
              placeholder="City or Airport"
            />
          </div>

          {/* Depart Date */}
          <div className="search-field date-field">
            <label>Depart</label>
            <div className="date-input-wrapper">
              <Calendar size={18} className="date-icon" />
              <input
                ref={departDateRef}
                type="date"
                value={searchData.date}
                onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Return Date */}
          {searchData.tripType === 'roundtrip' && (
            <div className="search-field date-field">
              <label>Return</label>
              <div className="date-input-wrapper">
                <Calendar size={18} className="date-icon" />
                <input
                  ref={returnDateRef}
                  type="date"
                  value={searchData.returnDate}
                  onChange={(e) => setSearchData({ ...searchData, returnDate: e.target.value })}
                  min={searchData.date || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
          )}

          {/* Travelers & Class */}
          <div className="search-field passengers-field" ref={passengerRef}>
            <label>Travelers & Class</label>
            <div 
              className="passengers-trigger"
              onClick={() => setShowPassengers(!showPassengers)}
            >
              <Users size={18} />
              <span>{getTotalPassengers()} Traveler{getTotalPassengers() > 1 ? 's' : ''}, {searchData.cabinClass}</span>
            </div>

            {showPassengers && (
              <div className="passengers-dropdown">
                <div className="passenger-row">
                  <div className="passenger-info">
                    <strong>Adults</strong>
                    <span>12+ years</span>
                  </div>
                  <div className="passenger-controls">
                    <button type="button" onClick={() => updatePassengers('adults', -1)} disabled={searchData.passengers.adults <= 1}>−</button>
                    <span>{searchData.passengers.adults}</span>
                    <button type="button" onClick={() => updatePassengers('adults', 1)}>+</button>
                  </div>
                </div>

                <div className="passenger-row">
                  <div className="passenger-info">
                    <strong>Children</strong>
                    <span>2-11 years</span>
                  </div>
                  <div className="passenger-controls">
                    <button type="button" onClick={() => updatePassengers('children', -1)} disabled={searchData.passengers.children <= 0}>−</button>
                    <span>{searchData.passengers.children}</span>
                    <button type="button" onClick={() => updatePassengers('children', 1)}>+</button>
                  </div>
                </div>

                <div className="passenger-row">
                  <div className="passenger-info">
                    <strong>Infants</strong>
                    <span>Under 2</span>
                  </div>
                  <div className="passenger-controls">
                    <button type="button" onClick={() => updatePassengers('infants', -1)} disabled={searchData.passengers.infants <= 0}>−</button>
                    <span>{searchData.passengers.infants}</span>
                    <button type="button" onClick={() => updatePassengers('infants', 1)}>+</button>
                  </div>
                </div>

                <div className="cabin-class-select">
                  <label>Cabin Class</label>
                  <select
                    value={searchData.cabinClass}
                    onChange={(e) => setSearchData({ ...searchData, cabinClass: e.target.value })}
                  >
                    <option value="economy">Economy</option>
                    <option value="premium">Premium Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button type="submit" className="search-btn-modern">
            <Search size={20} />
            Search Flights
          </button>
        </div>

        {/* Options Row */}
        <div className="search-options">
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={searchData.directFlights}
              onChange={(e) => setSearchData({ ...searchData, directFlights: e.target.checked })}
            />
            Direct Flights Only
          </label>
        </div>
      </form>
    </div>
  );
}

export default SearchBox;
