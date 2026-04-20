import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAirlineBySlug } from '../data/airlines';
import AirportAutocomplete from '../components/AirportAutocomplete';
import { 
  Plane, MapPin, Globe, Award, Star, Users, Calendar,
  CheckCircle, Phone, ExternalLink, Clock, DollarSign,
  Wifi, Coffee, Tv, Shield, TrendingUp, Tag, Search,
  ArrowRightLeft, ChevronRight, ArrowLeft
} from 'lucide-react';
import './AirlinePageNew.css';

function AirlinePageNew() {
  const { airlineSlug } = useParams();
  const navigate = useNavigate();
  const [airline, setAirline] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const passengerDropdownRef = useRef(null);
  const departDateRef = useRef(null);
  const returnDateRef = useRef(null);
  
  const [searchData, setSearchData] = useState({
    tripType: 'round-trip',
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    },
    cabinClass: 'economy'
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (passengerDropdownRef.current && !passengerDropdownRef.current.contains(event.target)) {
        setShowPassengerDropdown(false);
      }
    };

    if (showPassengerDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPassengerDropdown]);

  useEffect(() => {
    const airlineData = getAirlineBySlug(airlineSlug);
    if (airlineData) {
      setAirline(airlineData);
      document.title = `${airlineData.name} - Flight Deals & Information | TraveloFare`;
    }
  }, [airlineSlug]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    if (!searchData.from || !searchData.to || !searchData.departDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (searchData.tripType === 'round-trip' && !searchData.returnDate) {
      alert('Please select a return date');
      return;
    }

    const queryParams = new URLSearchParams({
      from: searchData.from,
      to: searchData.to,
      departDate: searchData.departDate,
      tripType: searchData.tripType,
      adults: searchData.passengers.adults,
      children: searchData.passengers.children,
      infants: searchData.passengers.infants,
      cabinClass: searchData.cabinClass,
      airline: airline.code
    });

    if (searchData.tripType === 'round-trip' && searchData.returnDate) {
      queryParams.append('returnDate', searchData.returnDate);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    navigate(`/flight-results?${queryParams.toString()}`, {
      state: {
        from: searchData.from,
        to: searchData.to,
        departDate: searchData.departDate,
        returnDate: searchData.tripType === 'round-trip' ? searchData.returnDate : null,
        tripType: searchData.tripType,
        passengers: searchData.passengers,
        cabinClass: searchData.cabinClass,
        airline: airline.code,
        airlineName: airline.name
      }
    });
  };

  const updatePassengers = (type, increment) => {
    setSearchData(prev => {
      const currentValue = prev.passengers[type];
      const newValue = currentValue + increment;
      const minValue = type === 'adults' ? 1 : 0;
      const finalValue = Math.max(minValue, newValue);
      
      return {
        ...prev,
        passengers: {
          ...prev.passengers,
          [type]: finalValue
        }
      };
    });
  };

  if (!airline) {
    return (
      <div className="airline-not-found">
        <div className="not-found-content">
          <Plane size={64} />
          <h2>Airline Not Found</h2>
          <p>The airline you're looking for doesn't exist.</p>
          <Link to="/airlines" className="not-found-btn">View All Airlines</Link>
        </div>
      </div>
    );
  }

  const totalPassengers = searchData.passengers.adults + searchData.passengers.children + searchData.passengers.infants;

  return (
    <div className="airline-page-new">
      {/* Hero Section */}
      <section className="airline-hero-new">
        <button className="back-btn-hero" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="airline-hero-bg">
          <div className="hero-particles">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`particle particle-${i + 1}`}></div>
            ))}
          </div>
        </div>

        <div className="airline-hero-content">
          <div className="airline-header">
            <div className="airline-logo-box">
              {airline.logo ? (
                <img src={airline.logo} alt={airline.name} />
              ) : (
                <Plane size={48} />
              )}
            </div>
            <div className="airline-header-info">
              <h1>{airline.name}</h1>
              <div className="airline-badges">
                <span className="code-badge">{airline.code}</span>
                <span className="alliance-badge">{airline.alliance}</span>
              </div>
            </div>
          </div>

          <p className="airline-tagline">{airline.description}</p>

          <div className="airline-quick-stats">
            <div className="stat">
              <Globe size={20} />
              <div>
                <span className="stat-value">{airline.destinations}</span>
                <span className="stat-label">Destinations</span>
              </div>
            </div>
            <div className="stat">
              <Plane size={20} />
              <div>
                <span className="stat-value">{airline.fleet}</span>
                <span className="stat-label">Aircraft</span>
              </div>
            </div>
            <div className="stat">
              <Calendar size={20} />
              <div>
                <span className="stat-value">{airline.founded}</span>
                <span className="stat-label">Established</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Form Section */}
      <section className="airline-search-section">
        <div className="search-container">
          <h2 className="search-heading">
            <Search size={24} />
            Search {airline.name} Flights
          </h2>

          <form className="airline-search-form" onSubmit={handleSearchSubmit}>
            {/* Trip Type */}
            <div className="trip-selector">
              {['round-trip', 'one-way', 'multi-city'].map(type => (
                <label key={type} className={`trip-option ${searchData.tripType === type ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="tripType"
                    value={type}
                    checked={searchData.tripType === type}
                    onChange={(e) => setSearchData({...searchData, tripType: e.target.value})}
                  />
                  <span>{type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                </label>
              ))}
            </div>

            {/* Search Fields Grid */}
            <div className="search-fields-grid">
              {/* From */}
              <div className="search-field">
                <label>From</label>
                <AirportAutocomplete
                  value={searchData.from}
                  onChange={(code) => setSearchData({...searchData, from: code})}
                  placeholder="Departure City"
                />
              </div>

              {/* Swap Button */}
              <button
                type="button"
                className="swap-btn"
                onClick={() => {
                  const temp = searchData.from;
                  setSearchData({...searchData, from: searchData.to, to: temp});
                }}
                title="Swap airports"
              >
                <ArrowRightLeft size={20} />
              </button>

              {/* To */}
              <div className="search-field">
                <label>To</label>
                <AirportAutocomplete
                  value={searchData.to}
                  onChange={(code) => setSearchData({...searchData, to: code})}
                  placeholder="Arrival City"
                />
              </div>

              {/* Depart Date */}
              <div className="search-field">
                <label>Depart</label>
                <div className="date-input-wrapper">
                  <Calendar size={18} />
                  <input
                    type="date"
                    value={searchData.departDate}
                    onChange={(e) => setSearchData({...searchData, departDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Return Date */}
              {searchData.tripType === 'round-trip' && (
                <div className="search-field">
                  <label>Return</label>
                  <div className="date-input-wrapper">
                    <Calendar size={18} />
                    <input
                      type="date"
                      value={searchData.returnDate}
                      onChange={(e) => setSearchData({...searchData, returnDate: e.target.value})}
                      min={searchData.departDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              )}

              {/* Passengers */}
              <div className="search-field passengers-field" ref={passengerDropdownRef}>
                <label>Passengers</label>
                <div className="passengers-dropdown">
                  <button
                    type="button"
                    className="passengers-btn"
                    onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                  >
                    <Users size={18} />
                    <span>{totalPassengers}</span>
                  </button>

                  {showPassengerDropdown && (
                    <div className="passengers-menu">
                      {['adults', 'children', 'infants'].map(type => (
                        <div key={type} className="passenger-row">
                          <div>
                            <span className="passenger-label">
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </span>
                            <span className="passenger-age">
                              {type === 'adults' ? '12+ years' : type === 'children' ? '2-11 years' : 'Under 2'}
                            </span>
                          </div>
                          <div className="passenger-controls">
                            <button
                              type="button"
                              onClick={() => updatePassengers(type, -1)}
                              disabled={type === 'adults' && searchData.passengers[type] <= 1}
                            >
                              −
                            </button>
                            <span>{searchData.passengers[type]}</span>
                            <button
                              type="button"
                              onClick={() => updatePassengers(type, 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Cabin Class */}
              <div className="search-field">
                <label>Class</label>
                <select
                  value={searchData.cabinClass}
                  onChange={(e) => setSearchData({...searchData, cabinClass: e.target.value})}
                  className="cabin-select"
                >
                  <option value="economy">Economy</option>
                  <option value="premium-economy">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>

            <button type="submit" className="search-submit-btn">
              <Search size={20} />
              Search Flights
            </button>
          </form>
        </div>
      </section>

      {/* Tabs Navigation */}
      <nav className="airline-tabs-nav">
        <div className="tabs-container">
          {[
            { id: 'overview', label: 'Overview', icon: Star },
            { id: 'info', label: 'Information', icon: Globe },
            { id: 'classes', label: 'Classes', icon: Award },
            { id: 'deals', label: 'Deals', icon: Tag }
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Tab Content */}
      <section className="airline-content">
        {activeTab === 'overview' && (
          <div className="content-grid">
            <div className="info-card">
              <h3><MapPin size={20} /> Hub Airports</h3>
              <div className="hubs-list">
                {airline.hubs.map((hub, i) => (
                  <div key={i} className="hub-item">
                    <MapPin size={16} />
                    <span>{hub}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="info-card">
              <h3><Award size={20} /> Key Features</h3>
              <div className="features-list">
                {airline.features?.slice(0, 5).map((feature, i) => (
                  <div key={i} className="feature-item">
                    <CheckCircle size={16} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="info-section">
            <div className="info-card-large">
              <h3><Globe size={20} /> Airline Details</h3>
              <div className="info-grid">
                <div className="info-row">
                  <span className="label">Headquarters</span>
                  <span className="value">{airline.headquarters}</span>
                </div>
                <div className="info-row">
                  <span className="label">Founded</span>
                  <span className="value">{airline.founded}</span>
                </div>
                <div className="info-row">
                  <span className="label">Alliance</span>
                  <span className="value">{airline.alliance}</span>
                </div>
                <div className="info-row">
                  <span className="label">Fleet Size</span>
                  <span className="value">{airline.fleet} aircraft</span>
                </div>
                <div className="info-row">
                  <span className="label">Destinations</span>
                  <span className="value">{airline.destinations} cities</span>
                </div>
                <div className="info-row">
                  <span className="label">Frequent Flyer Program</span>
                  <span className="value">{airline.frequentFlyer}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="classes-grid">
            {airline.classes?.map((cabinClass, i) => (
              <div key={i} className="class-card">
                <Star size={24} />
                <h4>{cabinClass}</h4>
                <div className="class-amenities">
                  <div className="amenity"><Wifi size={16} /> Premium WiFi</div>
                  <div className="amenity"><Coffee size={16} /> Meals</div>
                  <div className="amenity"><Tv size={16} /> Entertainment</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="deals-grid">
            <div className="deal-card">
              <Tag size={24} />
              <h4>Current Deals</h4>
              <p>Save up to 40% on select routes</p>
              <button className="deal-btn">View Deals</button>
            </div>
            <div className="deal-card">
              <TrendingUp size={24} />
              <h4>Best Booking Tips</h4>
              <p>Book 2-3 months in advance for better deals</p>
              <button className="deal-btn">Learn More</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default AirlinePageNew;
