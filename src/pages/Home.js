import React from 'react';
import SeoMeta from '../components/SeoMeta';
import { useNavigate } from 'react-router-dom';
import { Plane, Hotel, Package, Award, MapPin, Calendar, User, TrendingDown, ArrowRight } from 'lucide-react';
import AirportAutocomplete from '../components/AirportAutocomplete';
import Card from '../components/Card';
import { API_URL } from '../config/api';
import './Home.css';

// Popular routes configuration
const POPULAR_ROUTES = [
  // Domestic US routes
  { from: 'JFK', to: 'LAX', fromCity: 'New York', toCity: 'Los Angeles', type: 'domestic', image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=400' },
  { from: 'ORD', to: 'MIA', fromCity: 'Chicago', toCity: 'Miami', type: 'domestic', image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=400' },
  { from: 'SFO', to: 'LAS', fromCity: 'San Francisco', toCity: 'Las Vegas', type: 'domestic', image: 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=400' },
  // International routes
  { from: 'JFK', to: 'LHR', fromCity: 'New York', toCity: 'London', type: 'international', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400' },
  { from: 'LAX', to: 'NRT', fromCity: 'Los Angeles', toCity: 'Tokyo', type: 'international', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
  { from: 'MIA', to: 'CDG', fromCity: 'Miami', toCity: 'Paris', type: 'international', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
];

function Home() {
  const destinations = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500',
      title: 'Paris, France',
      description: 'Experience the city of love with iconic landmarks',
      price: '$899',
      rating: 4.8,
      location: 'Europe'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
      title: 'Tokyo, Japan',
      description: 'Discover the perfect blend of tradition and technology',
      price: '$1,299',
      rating: 4.9,
      location: 'Asia'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=500',
      title: 'Santorini, Greece',
      description: 'Stunning sunsets and whitewashed buildings',
      price: '$1,099',
      rating: 4.7,
      location: 'Europe'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?w=500',
      title: 'Bali, Indonesia',
      description: 'Tropical paradise with beautiful beaches',
      price: '$799',
      rating: 4.6,
      location: 'Asia'
    }
  ];

  const [activeTab, setActiveTab] = React.useState('flights');
  const [tripType, setTripType] = React.useState('roundtrip');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [passengerDropdown, setPassengerDropdown] = React.useState(false);
  const passengerDropdownRef = React.useRef();
  const departDateRef = React.useRef();
  const returnDateRef = React.useRef();
  
  // Stays form state
  const [staysDestination, setStaysDestination] = React.useState('');
  const [checkIn, setCheckIn] = React.useState('');
  const [checkOut, setCheckOut] = React.useState('');
  const [staysDropdown, setStaysDropdown] = React.useState(false);
  const staysDropdownRef = React.useRef();
  const [staysAdults, setStaysAdults] = React.useState(2);
  const [staysChildren, setStaysChildren] = React.useState(0);
  const [staysRooms, setStaysRooms] = React.useState(1);
  
  // Packages form state
  const [packageFrom, setPackageFrom] = React.useState('');
  const [packageTo, setPackageTo] = React.useState('');
  const [packageDepartDate, setPackageDepartDate] = React.useState('');
  const [packageReturnDate, setPackageReturnDate] = React.useState('');
  const [packagesDropdown, setPackagesDropdown] = React.useState(false);
  const packagesDropdownRef = React.useRef();
  const [packagesAdults, setPackagesAdults] = React.useState(2);
  const [packagesChildren, setPackagesChildren] = React.useState(0);
  const [packagesRooms, setPackagesRooms] = React.useState(1);

  // Popular routes flight deals state
  const [popularDeals, setPopularDeals] = React.useState([]);
  const [dealsLoading, setDealsLoading] = React.useState(true);

  // Fetch popular route deals on mount
  React.useEffect(() => {
    const fetchPopularDeals = async () => {
      setDealsLoading(true);
      const deals = [];
      
      // Get date 7 days from now for better availability
      const searchDate = new Date();
      searchDate.setDate(searchDate.getDate() + 14);
      const dateStr = searchDate.toISOString().split('T')[0];

      // Fetch all routes in parallel
      const promises = POPULAR_ROUTES.map(async (route) => {
        try {
          const response = await fetch(
            `${API_URL}/api/flights?from=${route.from}&to=${route.to}&date=${dateStr}&tripType=oneway&passengers=1`
          );
          const data = await response.json();
          
          if (data.success && data.data && data.data.length > 0) {
            // Find the cheapest flight
            const cheapest = data.data.reduce((min, flight) => 
              flight.price < min.price ? flight : min
            , data.data[0]);
            
            return {
              ...route,
              price: cheapest.price,
              airline: cheapest.airlineName || cheapest.airline,
              airlineLogo: cheapest.airlineLogo,
              duration: cheapest.duration,
              departureTime: cheapest.departure?.time,
              arrivalTime: cheapest.arrival?.time,
              stops: cheapest.stops,
              date: dateStr,
              available: true
            };
          }
          return { ...route, available: false };
        } catch (error) {
          console.error(`Error fetching ${route.from}-${route.to}:`, error);
          return { ...route, available: false };
        }
      });

      const results = await Promise.all(promises);
      setPopularDeals(results.filter(deal => deal.available));
      setDealsLoading(false);
    };

    fetchPopularDeals();
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (
        passengerDropdownRef.current &&
        !passengerDropdownRef.current.contains(event.target)
      ) {
        setPassengerDropdown(false);
      }
      if (
        staysDropdownRef.current &&
        !staysDropdownRef.current.contains(event.target)
      ) {
        setStaysDropdown(false);
      }
      if (
        packagesDropdownRef.current &&
        !packagesDropdownRef.current.contains(event.target)
      ) {
        setPackagesDropdown(false);
      }
    }
    if (passengerDropdown || staysDropdown || packagesDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [passengerDropdown, staysDropdown, packagesDropdown]);
  const [adult, setAdult] = React.useState(1);
  const [child, setChild] = React.useState(0);
  const [infant, setInfant] = React.useState(0);

  const navigate = useNavigate();

  // Extract dates and class from form
  const [departDate, setDepartDate] = React.useState('');
  const [returnDate, setReturnDate] = React.useState('');
  const [cabinClass, setCabinClass] = React.useState('economy');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!from || !to || !departDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Build query parameters for API
    const searchParams = new URLSearchParams({
      from,
      to,
      date: departDate,
      tripType,
      passengers: adult + child + infant,
      cabinClass
    });
    
    // Add return date for roundtrip
    if (tripType === 'roundtrip' && returnDate) {
      searchParams.append('returnDate', returnDate);
    }
    
    navigate(`/flight-results?${searchParams.toString()}`, {
      state: {
        from,
        to,
        date: departDate,
        returnDate: tripType === 'roundtrip' ? returnDate : null,
        tripType,
        passengers: { adults: adult, children: child, infants: infant },
        cabinClass
      }
    });
  };

  const handleStaysSearch = (e) => {
    e.preventDefault();
    if (!staysDestination || !checkIn || !checkOut) {
      alert('Please fill in all required fields');
      return;
    }
    // Navigate to hotel results with search parameters for Amadeus API
    navigate('/hotel-results', {
      state: {
        cityCode: staysDestination,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        roomQuantity: staysRooms,
        adults: staysAdults,
        children: staysChildren,
        guests: staysAdults + staysChildren,
        provider: 'amadeus'
      }
    });
  };

  const handlePackagesSearch = (e) => {
    e.preventDefault();
    if (!packageFrom || !packageTo || !packageDepartDate || !packageReturnDate) {
      alert('Please fill in all required fields');
      return;
    }
    // Navigate to vacation packages with search parameters for Amadeus API
    navigate('/vacation-search', {
      state: {
        departureCityCode: packageFrom,
        destinationCode: packageTo,
        checkIn: packageDepartDate,
        checkOut: packageReturnDate,
        adults: packagesAdults,
        children: packagesChildren,
        travelers: packagesAdults + packagesChildren,
        rooms: packagesRooms,
        packageType: 'flight-hotel',
        flightClass: 'economy',
        provider: 'amadeus'
      }
    });
  };

  return (
    <>
      <SeoMeta
        title="travelofaredeals.com - Best Flight & Travel Deals"
        description="Find the best flight deals, hotels, cruises and vacation packages at travelofaredeals.com. Book cheap flights and save on your next trip."
        keywords="flights, travel, deals, hotels, vacation, booking, cheap flights, airfare"
        image="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500"
        url="https://travelofaredeals.com/"
      />
      <div className="home">
        <section className="hero">
          <div className="container">
            <h1>Best Flight & Travel Deals</h1>
            <p>
              Book flights, hotels, and packages to amazing destinations
              worldwide
            </p>
          </div>
        </section>

        {/* --- Begin Expedia-Style Search Form --- */}
        <section className="search-section">
          <div className="search-container">
            <div className="search-card">
              {/* Travel Type Tabs */}
              <div className="travel-tabs">
                <button
                  className={`tab-btn ${activeTab === "flights" ? "active" : ""}`}
                  onClick={() => setActiveTab("flights")}
                >
                  <Plane size={20} />
                  <span>Flights</span>
                </button>
                <button
                  className={`tab-btn ${activeTab === "stays" ? "active" : ""}`}
                  onClick={() => setActiveTab("stays")}
                >
                  <Hotel size={20} />
                  <span>Stays</span>
                </button>
                <button
                  className={`tab-btn ${activeTab === "packages" ? "active" : ""}`}
                  onClick={() => setActiveTab("packages")}
                >
                  <Package size={20} />
                  <span>Packages</span>
                </button>
              </div>

              {/* Flights Form */}
              {activeTab === "flights" && (
                <>
                  {/* Trip Type Selector */}
                  <div className="trip-options">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="tripType"
                        value="roundtrip"
                        checked={tripType === "roundtrip"}
                        onChange={() => setTripType("roundtrip")}
                      />
                      <span>Roundtrip</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="tripType"
                        value="oneway"
                        checked={tripType === "oneway"}
                        onChange={() => setTripType("oneway")}
                      />
                      <span>One-way</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="tripType"
                        value="multicity"
                        checked={tripType === "multicity"}
                        onChange={() => setTripType("multicity")}
                      />
                      <span>Multi-city</span>
                    </label>
                  </div>

                  {/* Search Form */}
                  <form
                    onSubmit={handleSearch}
                    className="flight-search-form-new"
                  >
                    <div className="search-grid-container">
                      {/* Row 1: From and To */}
                      <div className="search-row-airports">
                        <div className="input-group">
                          <div className="input-icon-wrapper">
                            <Plane className="input-icon-left" size={20} />
                          </div>
                          <div className="input-content">
                            <label className="input-label-small">From</label>
                            <AirportAutocomplete
                              value={from}
                              onChange={(code) => setFrom(code)}
                              placeholder="Where from?"
                            />
                          </div>
                        </div>

                        <div className="input-group">
                          <div className="input-icon-wrapper">
                            <MapPin className="input-icon-left" size={20} />
                          </div>
                          <div className="input-content">
                            <label className="input-label-small">To</label>
                            <AirportAutocomplete
                              value={to}
                              onChange={(code) => setTo(code)}
                              placeholder="Where to?"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Dates and Travelers */}
                      <div className="search-row-details">
                        <div className="input-group">
                          <div className="input-icon-wrapper">
                            <Calendar className="input-icon-left" size={20} />
                          </div>
                          <div className="input-content-dates">
                            <label className="input-label-small">Depart</label>
                            <input
                              ref={departDateRef}
                              type="date"
                              className="date-input-modern"
                              value={departDate}
                              onChange={(e) => setDepartDate(e.target.value)}
                              min={new Date().toISOString().split("T")[0]}
                              required
                            />
                          </div>
                        </div>

                        {tripType === "roundtrip" && (
                          <div className="input-group">
                            <div className="input-icon-wrapper">
                              <Calendar className="input-icon-left" size={20} />
                            </div>
                            <div className="input-content-dates">
                              <label className="input-label-small">
                                Return
                              </label>
                              <input
                                ref={returnDateRef}
                                type="date"
                                className="date-input-modern"
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                                min={
                                  departDate ||
                                  new Date().toISOString().split("T")[0]
                                }
                                required
                              />
                            </div>
                          </div>
                        )}

                        <div className="input-group" ref={passengerDropdownRef}>
                          <div className="input-icon-wrapper">
                            <User className="input-icon-left" size={20} />
                          </div>
                          <div className="input-content">
                            <label className="input-label-small">
                              Travelers
                            </label>
                            <div
                              className="travelers-display"
                              onClick={() =>
                                setPassengerDropdown(!passengerDropdown)
                              }
                            >
                              <span className="travelers-text">
                                {adult + child + infant}{" "}
                                {adult + child + infant === 1
                                  ? "Traveler"
                                  : "Travelers"}
                              </span>
                              <span className="travelers-class">
                                {cabinClass === "economy"
                                  ? "Economy"
                                  : cabinClass === "premium_economy"
                                    ? "Premium"
                                    : cabinClass === "business"
                                      ? "Business"
                                      : "First"}
                              </span>
                            </div>
                          </div>

                          {passengerDropdown && (
                            <div className="travelers-dropdown-new">
                              <div className="travelers-header">
                                <h4>Select travelers</h4>
                              </div>

                              <div className="travelers-list">
                                <div className="traveler-item">
                                  <div className="traveler-info-new">
                                    <span className="traveler-label">
                                      Adults
                                    </span>
                                    <span className="traveler-desc">
                                      18+ years
                                    </span>
                                  </div>
                                  <div className="traveler-counter">
                                    <button
                                      type="button"
                                      className="counter-btn"
                                      onClick={() =>
                                        setAdult(Math.max(1, adult - 1))
                                      }
                                      disabled={adult <= 1}
                                    >
                                      −
                                    </button>
                                    <span className="counter-value">
                                      {adult}
                                    </span>
                                    <button
                                      type="button"
                                      className="counter-btn"
                                      onClick={() =>
                                        setAdult(Math.min(9, adult + 1))
                                      }
                                      disabled={adult >= 9}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                <div className="traveler-item">
                                  <div className="traveler-info-new">
                                    <span className="traveler-label">
                                      Children
                                    </span>
                                    <span className="traveler-desc">
                                      0-17 years
                                    </span>
                                  </div>
                                  <div className="traveler-counter">
                                    <button
                                      type="button"
                                      className="counter-btn"
                                      onClick={() =>
                                        setChild(Math.max(0, child - 1))
                                      }
                                      disabled={child <= 0}
                                    >
                                      −
                                    </button>
                                    <span className="counter-value">
                                      {child}
                                    </span>
                                    <button
                                      type="button"
                                      className="counter-btn"
                                      onClick={() =>
                                        setChild(Math.min(9, child + 1))
                                      }
                                      disabled={child >= 9}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                <div className="traveler-item">
                                  <div className="traveler-info-new">
                                    <span className="traveler-label">
                                      Infants
                                    </span>
                                    <span className="traveler-desc">
                                      Under 2 years
                                    </span>
                                  </div>
                                  <div className="traveler-counter">
                                    <button
                                      type="button"
                                      className="counter-btn"
                                      onClick={() =>
                                        setInfant(Math.max(0, infant - 1))
                                      }
                                      disabled={infant <= 0}
                                    >
                                      −
                                    </button>
                                    <span className="counter-value">
                                      {infant}
                                    </span>
                                    <button
                                      type="button"
                                      className="counter-btn"
                                      onClick={() =>
                                        setInfant(Math.min(9, infant + 1))
                                      }
                                      disabled={infant >= 9}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="cabin-selector">
                                <label className="cabin-label-new">
                                  Cabin class
                                </label>
                                <div className="cabin-options">
                                  {[
                                    "economy",
                                    "premium_economy",
                                    "business",
                                    "first",
                                  ].map((cabin) => (
                                    <button
                                      key={cabin}
                                      type="button"
                                      className={`cabin-option ${cabinClass === cabin ? "active" : ""}`}
                                      onClick={() => setCabinClass(cabin)}
                                    >
                                      {cabin === "economy"
                                        ? "Economy"
                                        : cabin === "premium_economy"
                                          ? "Premium"
                                          : cabin === "business"
                                            ? "Business"
                                            : "First"}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <button
                                type="button"
                                className="dropdown-done-btn"
                                onClick={() => setPassengerDropdown(false)}
                              >
                                Done
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Search Button */}
                    <button type="submit" className="search-btn-new">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M19 19L14.65 14.65M17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9Z"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      Search Flights
                    </button>
                  </form>
                </>
              )}

              {/* Stays Form */}
              {activeTab === "stays" && (
                <>
                  <form onSubmit={handleStaysSearch}>
                    <div className="search-fields">
                      {/* Going to */}
                      <div className="field-wrapper">
                        <label className="field-label">Going to</label>
                        <div className="field-input">
                          <MapPin size={18} className="field-icon" />
                          <AirportAutocomplete
                            value={staysDestination}
                            onChange={(code) => setStaysDestination(code)}
                            placeholder="City, hotel, airport, or region"
                          />
                        </div>
                      </div>

                      {/* Check-in */}
                      <div className="field-wrapper">
                        <label className="field-label">Check-in</label>
                        <div className="field-input">
                          <Calendar size={18} className="field-icon" />
                          <input
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </div>

                      {/* Check-out */}
                      <div className="field-wrapper">
                        <label className="field-label">Check-out</label>
                        <div className="field-input">
                          <Calendar size={18} className="field-icon" />
                          <input
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            min={
                              checkIn || new Date().toISOString().split("T")[0]
                            }
                          />
                        </div>
                      </div>

                      {/* Travelers */}
                      <div className="field-wrapper" ref={staysDropdownRef}>
                        <label className="field-label">Travelers</label>
                        <div
                          className="field-input travelers-input"
                          onClick={() => setStaysDropdown(!staysDropdown)}
                        >
                          <User size={18} className="field-icon" />
                          <span>
                            {staysAdults + staysChildren} traveler
                            {staysAdults + staysChildren > 1 ? "s" : ""},{" "}
                            {staysRooms} room{staysRooms > 1 ? "s" : ""}
                          </span>
                          <span className="dropdown-icon">▼</span>
                        </div>
                        {staysDropdown && (
                          <div className="travelers-dropdown">
                            <div className="traveler-row">
                              <div className="traveler-info">
                                <div className="traveler-type">Adults</div>
                                <div className="traveler-age">18+</div>
                              </div>
                              <div className="traveler-controls">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setStaysAdults(Math.max(1, staysAdults - 1))
                                  }
                                >
                                  -
                                </button>
                                <span>{staysAdults}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setStaysAdults(Math.min(9, staysAdults + 1))
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="traveler-row">
                              <div className="traveler-info">
                                <div className="traveler-type">Children</div>
                                <div className="traveler-age">0-17</div>
                              </div>
                              <div className="traveler-controls">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setStaysChildren(
                                      Math.max(0, staysChildren - 1),
                                    )
                                  }
                                >
                                  -
                                </button>
                                <span>{staysChildren}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setStaysChildren(
                                      Math.min(9, staysChildren + 1),
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="traveler-row">
                              <div className="traveler-info">
                                <div className="traveler-type">Rooms</div>
                              </div>
                              <div className="traveler-controls">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setStaysRooms(Math.max(1, staysRooms - 1))
                                  }
                                >
                                  -
                                </button>
                                <span>{staysRooms}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setStaysRooms(Math.min(9, staysRooms + 1))
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <button type="submit" className="search-button">
                      Search
                    </button>
                  </form>
                </>
              )}

              {/* Packages Form */}
              {activeTab === "packages" && (
                <>
                  <div className="trip-options">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="packageType"
                        value="flight-hotel"
                        defaultChecked
                      />
                      <span>Flight + Hotel</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="packageType"
                        value="flight-hotel-car"
                      />
                      <span>Flight + Hotel + Car</span>
                    </label>
                  </div>

                  <form onSubmit={handlePackagesSearch}>
                    <div className="search-fields">
                      {/* Leaving From */}
                      <div className="field-wrapper">
                        <label className="field-label">Leaving from</label>
                        <div className="field-input">
                          <MapPin size={18} className="field-icon" />
                          <AirportAutocomplete
                            value={packageFrom}
                            onChange={(code) => setPackageFrom(code)}
                            placeholder="Airport, city or station"
                          />
                        </div>
                      </div>

                      {/* Swap Button */}
                      <button
                        type="button"
                        className="swap-btn"
                        onClick={() => {
                          const temp = packageFrom;
                          setPackageFrom(packageTo);
                          setPackageTo(temp);
                        }}
                      >
                        ⇄
                      </button>

                      {/* Going to */}
                      <div className="field-wrapper">
                        <label className="field-label">Going to</label>
                        <div className="field-input">
                          <MapPin size={18} className="field-icon" />
                          <AirportAutocomplete
                            value={packageTo}
                            onChange={(code) => setPackageTo(code)}
                            placeholder="City, airport or region"
                          />
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="field-wrapper dates-wrapper">
                        <label className="field-label">Dates</label>
                        <div className="dates-fields">
                          <div className="field-input date-input">
                            <Calendar size={18} className="field-icon" />
                            <input
                              type="date"
                              value={packageDepartDate}
                              onChange={(e) =>
                                setPackageDepartDate(e.target.value)
                              }
                              placeholder="Depart"
                              min={new Date().toISOString().split("T")[0]}
                            />
                          </div>
                          <span className="date-separator">-</span>
                          <div className="field-input date-input">
                            <input
                              type="date"
                              value={packageReturnDate}
                              onChange={(e) =>
                                setPackageReturnDate(e.target.value)
                              }
                              placeholder="Return"
                              min={
                                packageDepartDate ||
                                new Date().toISOString().split("T")[0]
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Travelers */}
                      <div className="field-wrapper" ref={packagesDropdownRef}>
                        <label className="field-label">Travelers</label>
                        <div
                          className="field-input travelers-input"
                          onClick={() => setPackagesDropdown(!packagesDropdown)}
                        >
                          <User size={18} className="field-icon" />
                          <span>
                            {packagesAdults + packagesChildren} traveler
                            {packagesAdults + packagesChildren > 1 ? "s" : ""},{" "}
                            {packagesRooms} room{packagesRooms > 1 ? "s" : ""}
                          </span>
                          <span className="dropdown-icon">▼</span>
                        </div>
                        {packagesDropdown && (
                          <div className="travelers-dropdown">
                            <div className="traveler-row">
                              <div className="traveler-info">
                                <div className="traveler-type">Adults</div>
                                <div className="traveler-age">18+</div>
                              </div>
                              <div className="traveler-controls">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPackagesAdults(
                                      Math.max(1, packagesAdults - 1),
                                    )
                                  }
                                >
                                  -
                                </button>
                                <span>{packagesAdults}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPackagesAdults(
                                      Math.min(9, packagesAdults + 1),
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="traveler-row">
                              <div className="traveler-info">
                                <div className="traveler-type">Children</div>
                                <div className="traveler-age">0-17</div>
                              </div>
                              <div className="traveler-controls">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPackagesChildren(
                                      Math.max(0, packagesChildren - 1),
                                    )
                                  }
                                >
                                  -
                                </button>
                                <span>{packagesChildren}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPackagesChildren(
                                      Math.min(9, packagesChildren + 1),
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="traveler-row">
                              <div className="traveler-info">
                                <div className="traveler-type">Rooms</div>
                              </div>
                              <div className="traveler-controls">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPackagesRooms(
                                      Math.max(1, packagesRooms - 1),
                                    )
                                  }
                                >
                                  -
                                </button>
                                <span>{packagesRooms}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPackagesRooms(
                                      Math.min(9, packagesRooms + 1),
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <button type="submit" className="search-button">
                      Search packages
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
        {/* --- End Expedia-Style Search Form --- */}

        {/* Popular Routes Section */}
        <section className="popular-routes-section">
          <div className="container">
            <div className="section-header">
              <h2>
                <TrendingDown size={28} /> Popular Flight Deals
              </h2>
              <p>Lowest fares on trending routes - prices updated live</p>
            </div>

            {dealsLoading ? (
              <div className="deals-loading">
                <div className="loading-spinner"></div>
                <p>Finding the best deals...</p>
              </div>
            ) : (
              <>
                {/* Domestic Routes */}
                <div className="routes-category">
                  <h3>
                    <MapPin size={20} /> Domestic US Flights
                  </h3>
                  <div className="deals-grid">
                    {popularDeals
                      .filter((d) => d.type === "domestic")
                      .map((deal, index) => (
                        <div
                          key={index}
                          className="deal-card"
                          onClick={() =>
                            navigate(
                              `/flight-results?from=${deal.from}&to=${deal.to}&date=${deal.date}&tripType=oneway&passengers=1`,
                            )
                          }
                        >
                          <div
                            className="deal-image"
                            style={{ backgroundImage: `url(${deal.image})` }}
                          >
                            <div className="deal-badge">Lowest Price</div>
                          </div>
                          <div className="deal-content">
                            <div className="deal-route">
                              <span className="deal-city">{deal.fromCity}</span>
                              <ArrowRight size={16} className="route-arrow" />
                              <span className="deal-city">{deal.toCity}</span>
                            </div>
                            <div className="deal-codes">
                              {deal.from} → {deal.to}
                            </div>
                            <div className="deal-details">
                              <div className="deal-airline">
                                {deal.airlineLogo && (
                                  <img
                                    src={deal.airlineLogo}
                                    alt={deal.airline}
                                    className="airline-logo-small"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                )}
                                <span>{deal.airline}</span>
                              </div>
                              <div className="deal-duration">
                                {deal.duration
                                  ?.replace("PT", "")
                                  .replace("H", "h ")
                                  .replace("M", "m")}
                                {deal.stops === 0
                                  ? " • Nonstop"
                                  : ` • ${deal.stops} stop${deal.stops > 1 ? "s" : ""}`}
                              </div>
                            </div>
                            <div className="deal-price-row">
                              <div className="deal-price">
                                <span className="price-from">from</span>
                                <span className="price-amount">
                                  ${Math.round(deal.price)}
                                </span>
                              </div>
                              <button className="deal-book-btn">
                                View Deal
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* International Routes */}
                <div className="routes-category">
                  <h3>
                    <Plane size={20} /> International Flights
                  </h3>
                  <div className="deals-grid">
                    {popularDeals
                      .filter((d) => d.type === "international")
                      .map((deal, index) => (
                        <div
                          key={index}
                          className="deal-card international"
                          onClick={() =>
                            navigate(
                              `/flight-results?from=${deal.from}&to=${deal.to}&date=${deal.date}&tripType=oneway&passengers=1`,
                            )
                          }
                        >
                          <div
                            className="deal-image"
                            style={{ backgroundImage: `url(${deal.image})` }}
                          >
                            <div className="deal-badge international">
                              International
                            </div>
                          </div>
                          <div className="deal-content">
                            <div className="deal-route">
                              <span className="deal-city">{deal.fromCity}</span>
                              <ArrowRight size={16} className="route-arrow" />
                              <span className="deal-city">{deal.toCity}</span>
                            </div>
                            <div className="deal-codes">
                              {deal.from} → {deal.to}
                            </div>
                            <div className="deal-details">
                              <div className="deal-airline">
                                {deal.airlineLogo && (
                                  <img
                                    src={deal.airlineLogo}
                                    alt={deal.airline}
                                    className="airline-logo-small"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                )}
                                <span>{deal.airline}</span>
                              </div>
                              <div className="deal-duration">
                                {deal.duration
                                  ?.replace("PT", "")
                                  .replace("H", "h ")
                                  .replace("M", "m")}
                                {deal.stops === 0
                                  ? " • Nonstop"
                                  : ` • ${deal.stops} stop${deal.stops > 1 ? "s" : ""}`}
                              </div>
                            </div>
                            <div className="deal-price-row">
                              <div className="deal-price">
                                <span className="price-from">from</span>
                                <span className="price-amount">
                                  ${Math.round(deal.price)}
                                </span>
                              </div>
                              <button className="deal-book-btn">
                                View Deal
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h2>Why Choose TraveloFare?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <Plane size={48} className="feature-icon" />
                <h3>Best Flight Deals</h3>
                <p>Compare prices from 500+ airlines</p>
              </div>
              <div className="feature-card">
                <Hotel size={48} className="feature-icon" />
                <h3>Luxury Hotels</h3>
                <p>Over 1 million hotels worldwide</p>
              </div>
              <div className="feature-card">
                <Package size={48} className="feature-icon" />
                <h3>Vacation Packages</h3>
                <p>All-inclusive travel packages</p>
              </div>
              <div className="feature-card">
                <Award size={48} className="feature-icon" />
                <h3>Award Winning</h3>
                <p>Best travel service 2023</p>
              </div>
            </div>
          </div>
        </section>

        <section className="destinations">
          <div className="container">
            <h2>Popular Destinations</h2>

            <div className="destinations-grid">
              {destinations.map((dest) => (
                <Card key={dest.id} {...dest} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
