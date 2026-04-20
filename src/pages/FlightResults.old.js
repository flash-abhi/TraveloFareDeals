import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plane, Clock, Filter, ChevronDown, ChevronUp, ArrowRight, Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react';
import './FlightResults.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Memoized Flight Card Component for performance
const FlightCard = memo(({ 
  flight, 
  isSelected, 
  onSelect, 
  getDisplayTime, 
  getAirportCode, 
  formatDuration, 
  getStopsText,
  API_URL 
}) => {
  return (
    <div className={`flight-card ${isSelected ? 'selected' : ''}`}>
      <div className="flight-card-main">
        {/* Airline Info */}
        <div className="airline-info">
          <div className="airline-logo">
            <img 
              src={flight.airlineLogo || `${API_URL}/airlines/${flight.airline || 'default'}.png`}
              alt={flight.airlineName || flight.airline}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${API_URL}/airlines/default.png`;
              }}
            />
          </div>
          <div className="airline-details">
            <span className="airline-name">{flight.airlineName || flight.airline}</span>
            <span className="flight-number">{flight.flightNumber}</span>
          </div>
        </div>

        {/* Flight Times */}
        <div className="flight-times">
          <div className="time-block departure">
            <span className="time">{getDisplayTime(flight.departure) || flight.departureTime}</span>
            <span className="airport">{getAirportCode(flight.from)}</span>
          </div>
          
          <div className="flight-duration">
            <span className="duration-time">{formatDuration(flight.duration)}</span>
            <div className="duration-line">
              <div className="line"></div>
              <Plane size={16} />
            </div>
            <span className="stops-info">{getStopsText(flight.stops || 0)}</span>
          </div>
          
          <div className="time-block arrival">
            <span className="time">{getDisplayTime(flight.arrival) || flight.arrivalTime}</span>
            <span className="airport">{getAirportCode(flight.to)}</span>
          </div>
        </div>

        {/* Price and Select */}
        <div className="flight-price-section">
          <div className="price-display">
            <span className="price-amount">${flight.price}</span>
            <span className="price-type">per person</span>
          </div>
          <button 
            className="select-btn"
            onClick={() => onSelect(flight)}
          >
            Select
          </button>
        </div>
      </div>

      {/* Flight Details (Expandable) */}
      <div className="flight-card-footer">
        <div className="flight-features">
          {flight.cabinClass && (
            <span className="feature">{flight.cabinClass}</span>
          )}
          {flight.aircraft && (
            <span className="feature">{flight.aircraft}</span>
          )}
        </div>
        <button className="details-btn">
          Flight details <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
});

FlightCard.displayName = 'FlightCard';

// Skeleton Loader Component
const FlightCardSkeleton = memo(() => (
  <div className="flight-card skeleton">
    <div className="flight-card-main">
      <div className="airline-info">
        <div className="skeleton-logo"></div>
        <div className="airline-details">
          <div className="skeleton-text skeleton-airline"></div>
          <div className="skeleton-text skeleton-flight-num"></div>
        </div>
      </div>
      <div className="flight-times">
        <div className="skeleton-time-block">
          <div className="skeleton-text skeleton-time"></div>
          <div className="skeleton-text skeleton-airport"></div>
        </div>
        <div className="skeleton-duration"></div>
        <div className="skeleton-time-block">
          <div className="skeleton-text skeleton-time"></div>
          <div className="skeleton-text skeleton-airport"></div>
        </div>
      </div>
      <div className="flight-price-section">
        <div className="skeleton-text skeleton-price"></div>
        <div className="skeleton-btn"></div>
      </div>
    </div>
  </div>
));

FlightCardSkeleton.displayName = 'FlightCardSkeleton';

function FlightResults() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse search params from URL query string OR location state
  const urlParams = new URLSearchParams(location.search);
  const stateData = location.state;
  
  // Build searchParams: prefer state, fallback to URL params
  const searchParams = stateData ? {
    from: stateData.from || '',
    to: stateData.to || '',
    departDate: stateData.date || stateData.departDate || '', // state uses 'date', URL uses 'departDate'
    returnDate: stateData.returnDate || '',
    tripType: stateData.tripType || 'oneway',
    cabinClass: stateData.cabinClass || 'economy',
    passengers: stateData.passengers || { adults: 1, children: 0, infants: 0, total: 1 },
    directFlights: stateData.directFlights || false
  } : {
    from: urlParams.get('from') || '',
    to: urlParams.get('to') || '',
    departDate: urlParams.get('departDate') || '',
    returnDate: urlParams.get('returnDate') || '',
    tripType: urlParams.get('tripType') || 'oneway',
    cabinClass: urlParams.get('cabinClass') || 'economy',
    passengers: {
      adults: parseInt(urlParams.get('adults')) || 1,
      children: parseInt(urlParams.get('children')) || 0,
      infants: parseInt(urlParams.get('infants')) || 0,
      total: (parseInt(urlParams.get('adults')) || 1) + (parseInt(urlParams.get('children')) || 0) + (parseInt(urlParams.get('infants')) || 0)
    },
    directFlights: urlParams.get('directFlights') === 'true'
  };
  
  // Add total to passengers if not present
  if (searchParams.passengers && !searchParams.passengers.total) {
    searchParams.passengers.total = (searchParams.passengers.adults || 1) + (searchParams.passengers.children || 0) + (searchParams.passengers.infants || 0);
  }
  
  // Debug logging
  console.log('FlightResults - URL search:', location.search);
  console.log('FlightResults - State:', stateData);
  console.log('FlightResults - Parsed searchParams:', searchParams);
  
  const [outboundFlights, setOutboundFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('');
  const [note, setNote] = useState('');
  
  // Selection state for round trip
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [selectionStep, setSelectionStep] = useState('outbound'); // 'outbound' or 'return'
  
  // Filter states
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    stops: [],
    airlines: [],
    priceRange: [0, 5000],
    departureTime: [],
    arrivalTime: []
  });
  
  // Sort state
  const [sortBy, setSortBy] = useState('price'); // 'price', 'duration', 'departure', 'arrival'
  
  // Debounced price filter state
  const [priceFilterValue, setPriceFilterValue] = useState(5000);
  
  // Expanded filter sections
  const [expandedFilters, setExpandedFilters] = useState({
    stops: true,
    airlines: true,
    times: false,
    price: true
  });

  const isRoundTrip = searchParams.tripType === 'roundtrip';

  // Debounce price filter to prevent excessive re-renders
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        priceRange: [0, priceFilterValue]
      }));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [priceFilterValue]);

  useEffect(() => {
    // Validate required params before fetching
    if (!searchParams.from || !searchParams.to || !searchParams.departDate) {
      setError('Missing search parameters. Please search from the home page.');
      setLoading(false);
      return;
    }
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    setError(null);
    
    // Double check params are present
    if (!searchParams.from || !searchParams.to || !searchParams.departDate) {
      setError('Missing required search parameters');
      setLoading(false);
      return;
    }
    
    try {
      // Fetch outbound flights
      const outboundParams = new URLSearchParams({
        from: searchParams.from,
        to: searchParams.to,
        date: searchParams.departDate,
        tripType: searchParams.tripType || 'oneway',
        passengers: searchParams.passengers?.total || 1,
        cabinClass: searchParams.cabinClass || 'economy'
      });
      
      const outboundRes = await fetch(`${API_URL}/api/flights?${outboundParams}`);
      const outboundData = await outboundRes.json();
      
      if (outboundData.success) {
        setOutboundFlights(outboundData.data || []);
        setSource(outboundData.source || '');
        setNote(outboundData.note || outboundData.amadeusNote || '');
      } else {
        throw new Error(outboundData.message || 'Failed to fetch flights');
      }
      
      // Fetch return flights for round trip
      if (isRoundTrip && searchParams.returnDate) {
        const returnParams = new URLSearchParams({
          from: searchParams.to || '',
          to: searchParams.from || '',
          date: searchParams.returnDate || '',
          tripType: 'oneway',
          passengers: searchParams.passengers?.total || 1,
          cabinClass: searchParams.cabinClass || 'economy'
        });
        
        const returnRes = await fetch(`${API_URL}/api/flights?${returnParams}`);
        const returnData = await returnRes.json();
        
        if (returnData.success) {
          setReturnFlights(returnData.data || []);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    const flights = selectionStep === 'outbound' ? outboundFlights : returnFlights;
    const airlines = [...new Set(flights.map(f => f.airlineName || f.airline))];
    const maxPrice = Math.max(...flights.map(f => f.price), 1000);
    return { airlines, maxPrice };
  }, [outboundFlights, returnFlights, selectionStep]);

  // Apply filters and sorting
  const filteredFlights = useMemo(() => {
    let flights = selectionStep === 'outbound' ? [...outboundFlights] : [...returnFlights];
    
    // Filter by stops
    if (filters.stops.length > 0) {
      flights = flights.filter(f => {
        const stops = f.stops || 0;
        if (filters.stops.includes('nonstop') && stops === 0) return true;
        if (filters.stops.includes('1stop') && stops === 1) return true;
        if (filters.stops.includes('2+stops') && stops >= 2) return true;
        return false;
      });
    }
    
    // Filter by airlines
    if (filters.airlines.length > 0) {
      flights = flights.filter(f => filters.airlines.includes(f.airlineName || f.airline));
    }
    
    // Filter by price
    flights = flights.filter(f => f.price >= filters.priceRange[0] && f.price <= filters.priceRange[1]);
    
    // Sort
    flights.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return (parseDuration(a.duration) || 0) - (parseDuration(b.duration) || 0);
        case 'departure':
          return a.departureTime?.localeCompare(b.departureTime) || 0;
        case 'arrival':
          return a.arrivalTime?.localeCompare(b.arrivalTime) || 0;
        default:
          return 0;
      }
    });
    
    return flights;
  }, [outboundFlights, returnFlights, filters, sortBy, selectionStep]);

  const parseDuration = (duration) => {
    if (!duration) return 0;
    const match = duration.match(/(\d+)h\s*(\d+)?m?/);
    if (match) {
      return parseInt(match[1]) * 60 + (parseInt(match[2]) || 0);
    }
    return 0;
  };

  const formatDuration = useCallback((duration) => {
    return duration || 'N/A';
  }, []);

  const getStopsText = useCallback((stops) => {
    if (stops === 0) return 'Nonstop';
    if (stops === 1) return '1 stop';
    return `${stops} stops`;
  }, []);

  const toggleFilter = useCallback((category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      stops: [],
      airlines: [],
      priceRange: [0, filterOptions.maxPrice],
      departureTime: [],
      arrivalTime: []
    });
    setPriceFilterValue(filterOptions.maxPrice);
  }, [filterOptions.maxPrice]);

  const handleFlightSelect = useCallback((flight) => {
    if (selectionStep === 'outbound') {
      setSelectedOutbound(flight);
      if (isRoundTrip) {
        setSelectionStep('return');
      } else {
        // Proceed to booking for one-way
        navigate('/flight-order', {
          state: {
            outboundFlight: flight,
            returnFlight: null,
            searchParams: searchParams,
            totalPrice: flight?.price || 0
          }
        });
      }
    } else {
      setSelectedReturn(flight);
      navigate('/flight-order', {
        state: {
          outboundFlight: selectedOutbound,
          returnFlight: flight,
          searchParams: searchParams,
          totalPrice: (selectedOutbound?.price || 0) + (flight?.price || 0)
        }
      });
    }
  }, [selectionStep, isRoundTrip, navigate, searchParams, selectedOutbound]);

  const proceedToBooking = useCallback((outbound, returnFlight) => {
    navigate('/flight-order', {
      state: {
        outboundFlight: outbound,
        returnFlight: returnFlight,
        searchParams: searchParams,
        totalPrice: (outbound?.price || 0) + (returnFlight?.price || 0)
      }
    });
  }, [navigate, searchParams]);

  const goBackToOutbound = useCallback(() => {
    setSelectionStep('outbound');
    setSelectedReturn(null);
  }, []);

  // Helper to safely get airport code from string or object
  const getAirportCode = useCallback((location) => {
    if (!location) return '';
    if (typeof location === 'string') return location;
    return location.code || location.city || location.airport || '';
  }, []);

  // Helper to get display time from various formats
  const getDisplayTime = useCallback((timeData) => {
    if (!timeData) return '';
    if (typeof timeData === 'string') return timeData;
    return timeData.time || '';
  }, []);

  // Memoized stats for recommended options
  const flightStats = useMemo(() => {
    if (filteredFlights.length === 0) return null;
    
    const prices = filteredFlights.map(f => f.price);
    const minPrice = Math.min(...prices);
    
    const quickestFlight = filteredFlights.reduce((min, f) => 
      parseDuration(f.duration) < parseDuration(min.duration) ? f : min, 
      filteredFlights[0]
    );
    
    return {
      minPrice,
      quickestDuration: quickestFlight?.duration || 'N/A',
      quickestPrice: quickestFlight?.price || minPrice
    };
  }, [filteredFlights]);

  if (loading) {
    return (
      <div className="flight-results-page">
        {/* Search Summary Header - Skeleton */}
        <div className="search-summary">
          <div className="search-summary-content">
            <div className="route-summary">
              <span className="city">{getAirportCode(searchParams.from) || '---'}</span>
              <ArrowRight size={20} />
              <span className="city">{getAirportCode(searchParams.to) || '---'}</span>
            </div>
            <div className="search-details">
              <span>{searchParams.departDate || 'Loading...'}</span>
            </div>
          </div>
        </div>
        
        <div className="results-container">
          <aside className="filters-sidebar skeleton-sidebar">
            <div className="skeleton-filter-block"></div>
            <div className="skeleton-filter-block"></div>
            <div className="skeleton-filter-block"></div>
          </aside>
          <main className="flights-main">
            <div className="loading-header">
              <Loader2 className="spinner" size={24} />
              <span>Searching for the best flights...</span>
            </div>
            <div className="flight-cards">
              {[1, 2, 3, 4, 5].map(i => (
                <FlightCardSkeleton key={i} />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flight-results-page">
        <div className="error-container">
          <AlertCircle size={48} />
          <h2>Unable to load flights</h2>
          <p>{error}</p>
          <button onClick={fetchFlights} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  const currentFlights = filteredFlights;
  const totalFlights = selectionStep === 'outbound' ? outboundFlights.length : returnFlights.length;

  return (
    <div className="flight-results-page">
      {/* Search Summary Header */}
      <div className="search-summary">
        <div className="search-summary-content">
          <div className="route-summary">
            <span className="city">{getAirportCode(searchParams.from)}</span>
            <ArrowRight size={20} />
            <span className="city">{getAirportCode(searchParams.to)}</span>
            {isRoundTrip && (
              <>
                <ArrowRight size={20} />
                <span className="city">{getAirportCode(searchParams.from)}</span>
              </>
            )}
          </div>
          <div className="search-details">
            <span>{searchParams.departDate}</span>
            {isRoundTrip && <span> - {searchParams.returnDate}</span>}
            <span className="separator">|</span>
            <span>{searchParams.passengers?.total || 1} traveler{(searchParams.passengers?.total || 1) > 1 ? 's' : ''}</span>
            <span className="separator">|</span>
            <span className="cabin-class">{searchParams.cabinClass || 'Economy'}</span>
          </div>
          <button className="modify-search-btn" onClick={() => navigate('/flights')}>
            Modify Search
          </button>
        </div>
      </div>

      {/* Selection Progress for Round Trip */}
      {isRoundTrip && (
        <div className="selection-progress">
          <div className={`progress-step ${selectionStep === 'outbound' ? 'active' : selectedOutbound ? 'completed' : ''}`}>
            <div className="step-number">{selectedOutbound ? <CheckCircle2 size={20} /> : '1'}</div>
            <div className="step-info">
              <span className="step-label">Select departing flight</span>
              <span className="step-route">{getAirportCode(searchParams.from)} → {getAirportCode(searchParams.to)}</span>
              {selectedOutbound && (
                <span className="selected-flight-info">
                  {selectedOutbound.airlineName || selectedOutbound.airline} • ${selectedOutbound.price}
                </span>
              )}
            </div>
            {selectedOutbound && selectionStep === 'return' && (
              <button className="change-btn" onClick={goBackToOutbound}>Change</button>
            )}
          </div>
          <div className={`progress-step ${selectionStep === 'return' ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-info">
              <span className="step-label">Select return flight</span>
              <span className="step-route">{getAirportCode(searchParams.to)} → {getAirportCode(searchParams.from)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Note/Warning Banner */}
      {note && (
        <div className="info-banner">
          <AlertCircle size={18} />
          <span>{note}</span>
        </div>
      )}

      <div className="results-container">
        {/* Filters Sidebar */}
        <aside className={`filters-sidebar ${showFilters ? 'open' : ''}`}>
          <div className="filters-header">
            <h3><Filter size={18} /> Filters</h3>
            <button className="clear-filters" onClick={clearFilters}>Reset all</button>
          </div>
          
          {/* Stops Filter */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={() => setExpandedFilters(prev => ({ ...prev, stops: !prev.stops }))}
            >
              <span>Stops</span>
              {expandedFilters.stops ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedFilters.stops && (
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.stops.includes('nonstop')}
                    onChange={() => toggleFilter('stops', 'nonstop')}
                  />
                  <span>Nonstop</span>
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.stops.includes('1stop')}
                    onChange={() => toggleFilter('stops', '1stop')}
                  />
                  <span>1 stop</span>
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.stops.includes('2+stops')}
                    onChange={() => toggleFilter('stops', '2+stops')}
                  />
                  <span>2+ stops</span>
                </label>
              </div>
            )}
          </div>

          {/* Airlines Filter */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={() => setExpandedFilters(prev => ({ ...prev, airlines: !prev.airlines }))}
            >
              <span>Airlines</span>
              {expandedFilters.airlines ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedFilters.airlines && (
              <div className="filter-options">
                {filterOptions.airlines.map(airline => (
                  <label key={airline} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.airlines.includes(airline)}
                      onChange={() => toggleFilter('airlines', airline)}
                    />
                    <span>{airline}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Filter */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={() => setExpandedFilters(prev => ({ ...prev, price: !prev.price }))}
            >
              <span>Price</span>
              {expandedFilters.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedFilters.price && (
              <div className="filter-options price-filter">
                <div className="price-range-display">
                  <span>$0</span>
                  <span>${priceFilterValue}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={filterOptions.maxPrice}
                  value={priceFilterValue}
                  onChange={(e) => setPriceFilterValue(parseInt(e.target.value))}
                  className="price-slider"
                />
              </div>
            )}
          </div>
        </aside>

        {/* Main Results */}
        <main className="flights-main">
          {/* Results Header */}
          <div className="results-header">
            <div className="results-count">
              <h2>
                {selectionStep === 'outbound' ? 'Departing flights' : 'Return flights'}
              </h2>
              <span>{currentFlights.length} of {totalFlights} flights</span>
            </div>
            
            <div className="sort-options">
              <button 
                className="mobile-filter-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                Filters
              </button>
              <div className="sort-dropdown">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="price">Price (Lowest)</option>
                  <option value="duration">Duration (Shortest)</option>
                  <option value="departure">Departure (Earliest)</option>
                  <option value="arrival">Arrival (Earliest)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recommended Options */}
          {flightStats && (
            <div className="recommended-options">
              <div className="option-card best-value">
                <span className="option-label">Best</span>
                <span className="option-price">${flightStats.minPrice}</span>
              </div>
              <div className="option-card cheapest">
                <span className="option-label">Cheapest</span>
                <span className="option-price">${flightStats.minPrice}</span>
              </div>
              <div className="option-card quickest">
                <span className="option-label">Quickest</span>
                <span className="option-duration">{flightStats.quickestDuration}</span>
              </div>
            </div>
          )}

          {/* Flight Cards */}
          <div className="flight-cards">
            {currentFlights.length === 0 ? (
              <div className="no-results">
                <Plane size={48} />
                <h3>No flights found</h3>
                <p>Try adjusting your filters or search criteria</p>
                <button className="retry-btn" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              currentFlights.map((flight, index) => (
                <FlightCard
                  key={flight._id || flight.id || index}
                  flight={flight}
                  isSelected={selectedOutbound?._id === flight._id || selectedReturn?._id === flight._id}
                  onSelect={handleFlightSelect}
                  getDisplayTime={getDisplayTime}
                  getAirportCode={getAirportCode}
                  formatDuration={formatDuration}
                  getStopsText={getStopsText}
                  API_URL={API_URL}
                />
              ))
            )}
          </div>
        </main>
      </div>

      {/* Bottom Sticky Bar for Selection Summary */}
      {(selectedOutbound || selectedReturn) && (
        <div className="selection-summary-bar">
          <div className="selection-content">
            <div className="selected-flights">
              {selectedOutbound && (
                <div className="selected-flight">
                  <span className="label">Departing:</span>
                  <span className="info">{selectedOutbound.airlineName || selectedOutbound.airline} • {getDisplayTime(selectedOutbound.departure) || selectedOutbound.departureTime} - {getDisplayTime(selectedOutbound.arrival) || selectedOutbound.arrivalTime}</span>
                  <span className="price">${selectedOutbound.price}</span>
                </div>
              )}
              {selectedReturn && (
                <div className="selected-flight">
                  <span className="label">Return:</span>
                  <span className="info">{selectedReturn.airlineName || selectedReturn.airline} • {getDisplayTime(selectedReturn.departure) || selectedReturn.departureTime} - {getDisplayTime(selectedReturn.arrival) || selectedReturn.arrivalTime}</span>
                  <span className="price">${selectedReturn.price}</span>
                </div>
              )}
            </div>
            <div className="total-section">
              <div className="total-price">
                <span className="total-label">Total</span>
                <span className="total-amount">
                  ${(selectedOutbound?.price || 0) + (selectedReturn?.price || 0)}
                </span>
              </div>
              {!isRoundTrip || (selectedOutbound && selectedReturn) ? (
                <button 
                  className="continue-btn"
                  onClick={() => proceedToBooking(selectedOutbound, selectedReturn)}
                >
                  Continue to checkout
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlightResults;
