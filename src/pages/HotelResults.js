import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, Wifi, Coffee, Dumbbell, Wine, 
  Car, Waves, ChevronDown, ChevronUp, Loader2,
  BedDouble, Users, Calendar, Check, X, ArrowRight,
  Shield, Zap, PhoneCall, Heart
} from 'lucide-react';
import './HotelResults.css';

function HotelResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state?.searchParams;

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('recommended');
  const [wishlist, setWishlist] = useState(new Set());
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 1000 });
  const [ratingFilter, setRatingFilter] = useState(0);

  useEffect(() => {
    if (!searchParams) {
      navigate('/hotels');
      return;
    }
    fetchHotels();
  }, [searchParams, navigate]);

  const fetchHotels = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        location: searchParams.location || searchParams.cityCode || 'Paris',
        checkIn: searchParams.checkIn || searchParams.checkInDate || '2024-05-01',
        checkOut: searchParams.checkOut || searchParams.checkOutDate || '2024-05-05',
        guests: (searchParams.guests?.adults || searchParams.adults || 1).toString(),
        rooms: (searchParams.rooms || searchParams.roomQuantity || 1).toString()
      });

      const response = await fetch(`/api/hotels?${queryParams}`);
      const data = await response.json();

      if (data.success && data.data) {
        setHotels(data.data);
      } else {
        // Mock data for demo
        setHotels(generateMockHotels());
      }
    } catch (err) {
      console.error('Error fetching hotels:', err);
      // Use mock data on error
      setHotels(generateMockHotels());
    } finally {
      setLoading(false);
    }
  };

  const generateMockHotels = () => {
    const hotelNames = ['Le Marais Boutique', 'Eiffel Tower View Hotel', 'Luxury Champs-Élysées', 'Seine River Palace', 'Latin Quarter Inn'];
    const hotelImages = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    ];

    return hotelNames.map((name, i) => ({
      id: i + 1,
      name,
      location: {
        city: searchParams.location || 'Paris',
        address: `${123 + i * 10} Rue de l'Hotel, Paris, France`,
        coordinates: { lat: 48.8566 + i * 0.01, lng: 2.3522 + i * 0.01 }
      },
      distance: { value: 0.5 + i, unit: 'km' },
      rating: 4.2 + Math.random() * 0.8,
      reviews: Math.floor(150 + Math.random() * 350),
      price: {
        perNight: 120 + i * 30 + Math.random() * 50,
        total: (120 + i * 30 + Math.random() * 50) * 4
      },
      image: hotelImages[i],
      amenities: ['WiFi', 'Pool', 'Restaurant', 'Parking', 'Fitness Center'],
      roomType: 'Deluxe Double Room',
      bedType: 'Double Bed',
      sleeps: 2
    }));
  };

  const formatNights = () => {
    const checkIn = new Date(searchParams.checkIn || searchParams.checkInDate);
    const checkOut = new Date(searchParams.checkOut || searchParams.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)) || 4;
    return nights;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const sortHotels = (hotelsToSort) => {
    const sorted = [...hotelsToSort];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price.perNight - b.price.perNight);
      case 'price-high':
        return sorted.sort((a, b) => b.price.perNight - a.price.perNight);
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return sorted;
    }
  };

  const toggleWishlist = (hotelId) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(hotelId)) {
      newWishlist.delete(hotelId);
    } else {
      newWishlist.add(hotelId);
    }
    setWishlist(newWishlist);
  };

  const amenityIcons = {
    'WiFi': <Wifi size={16} />,
    'Restaurant': <Coffee size={16} />,
    'Fitness Center': <Dumbbell size={16} />,
    'Bar': <Wine size={16} />,
    'Parking': <Car size={16} />,
    'Pool': <Waves size={16} />
  };

  if (!searchParams) {
    return null;
  }

  const filteredHotels = sortHotels(hotels).filter(
    hotel => hotel.price.perNight >= priceFilter.min && 
             hotel.price.perNight <= priceFilter.max &&
             hotel.rating >= ratingFilter
  );

  return (
    <div className="hotel-results-page">
      {/* Search Summary Header */}
      <div className="results-header-section">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <h1>Hotel Results</h1>
              <div className="header-summary">
                <span className="summary-item">
                  <MapPin size={16} />
                  {searchParams.location || 'Paris'}
                </span>
                <span className="summary-item">
                  <Calendar size={16} />
                  {formatDate(searchParams.checkIn || searchParams.checkInDate)} - {formatDate(searchParams.checkOut || searchParams.checkOutDate)}
                </span>
                <span className="summary-item">
                  <Users size={16} />
                  {formatNights()} nights
                </span>
              </div>
            </div>
            <button className="modify-btn" onClick={() => navigate('/hotels')}>
              <ArrowRight size={16} />
              Modify Search
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="results-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <div className="filter-header">
              <h3>Filters</h3>
              <button className="reset-filters" onClick={() => {
                setPriceFilter({ min: 0, max: 1000 });
                setRatingFilter(0);
              }}>
                Reset
              </button>
            </div>

            <div className="filter-group">
              <h4>Sort By</h4>
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
              </select>
            </div>

            <div className="filter-group">
              <h4>Price per Night</h4>
              <div className="price-range">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={priceFilter.min}
                  onChange={(e) => setPriceFilter({ ...priceFilter, min: parseInt(e.target.value) || 0 })}
                  className="price-input"
                />
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={priceFilter.max}
                  onChange={(e) => setPriceFilter({ ...priceFilter, max: parseInt(e.target.value) || 1000 })}
                  className="price-input"
                />
              </div>
            </div>

            <div className="filter-group">
              <h4>Minimum Rating</h4>
              <div className="rating-filter">
                {[0, 3, 3.5, 4, 4.5].map(rating => (
                  <label key={rating} className="rating-option">
                    <input 
                      type="radio" 
                      name="rating"
                      checked={ratingFilter === rating}
                      onChange={() => setRatingFilter(rating)}
                    />
                    <span>
                      {rating === 0 ? 'All ratings' : `${rating}+ ⭐`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Results Main */}
          <main className="results-main">
            <div className="results-toolbar">
              <div className="results-info">
                {loading ? (
                  <p>Searching hotels...</p>
                ) : (
                  <p><strong>{filteredHotels.length}</strong> hotels found</p>
                )}
              </div>
            </div>

            {loading && (
              <div className="loading-state">
                <Loader2 size={48} className="spinner" />
                <p>Finding the best hotels for you...</p>
              </div>
            )}

            {error && !loading && (
              <div className="error-state">
                <X size={48} />
                <h3>Something went wrong</h3>
                <p>{error}</p>
                <button onClick={fetchHotels} className="retry-btn">Try Again</button>
              </div>
            )}

            {!loading && filteredHotels.length === 0 && (
              <div className="empty-state">
                <MapPin size={64} />
                <h3>No hotels found</h3>
                <p>Try adjusting your filters or search criteria</p>
              </div>
            )}

            {!loading && filteredHotels.length > 0 && (
              <div className="hotels-grid">
                {filteredHotels.map((hotel, index) => (
                  <div key={hotel.id} className="hotel-card">
                    <div className="hotel-card-image">
                      <img 
                        src={hotel.image} 
                        alt={hotel.name}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
                        }}
                      />
                      <div className="card-overlay">
                        <button 
                          className={`wishlist-btn ${wishlist.has(hotel.id) ? 'active' : ''}`}
                          onClick={() => toggleWishlist(hotel.id)}
                        >
                          <Heart size={20} fill={wishlist.has(hotel.id) ? 'currentColor' : 'none'} />
                        </button>
                        <div className="rating-badge">
                          <Star size={16} fill="currentColor" />
                          <span>{hotel.rating.toFixed(1)}</span>
                          <small>({hotel.reviews})</small>
                        </div>
                      </div>
                    </div>

                    <div className="hotel-card-content">
                      <h3>{hotel.name}</h3>
                      <div className="hotel-location-info">
                        <MapPin size={14} />
                        <span>{hotel.location.city}</span>
                        <span className="distance">• {hotel.distance.value} {hotel.distance.unit}</span>
                      </div>

                      <div className="amenities-list">
                        {hotel.amenities?.slice(0, 4).map((amenity, idx) => (
                          <div key={idx} className="amenity-badge">
                            {amenityIcons[amenity] || <Check size={14} />}
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="room-info">
                        <BedDouble size={14} />
                        <span>{hotel.roomType}</span>
                      </div>

                      <div className="card-footer">
                        <div className="price-section">
                          <small>Price per night</small>
                          <div className="price-display">
                            <span className="price">${hotel.price.perNight.toFixed(0)}</span>
                            <small>USD</small>
                          </div>
                        </div>
                        <button className="book-btn">
                          Book Now <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default HotelResults;
        