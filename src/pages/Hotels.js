import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Star,
  Shield,
  Sparkles,
  Globe,
  Award,
  Percent,
  PhoneCall,
  Mail,
  Search,
  CheckCircle,
  Zap,
  HeartHandshake,
  Navigation,
  CreditCard,
  Headphones,
} from "lucide-react";
import { useContact } from "../context/ContactContext";
import "./Hotels.css";

function Hotels() {
  const navigate = useNavigate();
  const { contactSettings } = useContact();
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: { adults: 1, children: 0 },
    rooms: 1,
  });
  const [showGuests, setShowGuests] = useState(false);

  const popularDestinations = [
    {
      name: "Paris, France",
      hotels: 2540,
      avgPrice: 125,
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=250&fit=crop",
      rating: 4.8,
    },
    {
      name: "Bali, Indonesia",
      hotels: 1890,
      avgPrice: 85,
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=250&fit=crop",
      rating: 4.9,
    },
    {
      name: "Tokyo, Japan",
      hotels: 3200,
      avgPrice: 110,
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=250&fit=crop",
      rating: 4.7,
    },
    {
      name: "Dubai, UAE",
      hotels: 1650,
      avgPrice: 145,
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop",
      rating: 4.8,
    },
    {
      name: "New York, USA",
      hotels: 2890,
      avgPrice: 135,
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=250&fit=crop",
      rating: 4.6,
    },
    {
      name: "Barcelona, Spain",
      hotels: 1420,
      avgPrice: 95,
      image:
        "https://images.unsplash.com/photo-1504681869696-d977e3a37e4d?w=400&h=250&fit=crop",
      rating: 4.7,
    },
  ];

  const exclusiveDeals = [
    {
      destination: "Luxury Swiss Alps",
      hotel: "Badrutt's Palace",
      price: 299,
      originalPrice: 450,
      image:
        "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop",
      rating: 5.0,
      reviews: 892,
      badge: "Premium",
    },
    {
      destination: "Tropical Maldives",
      hotel: "Soneva Jani",
      price: 249,
      originalPrice: 399,
      image:
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop",
      rating: 4.9,
      reviews: 1250,
      badge: "Best Deal",
    },
    {
      destination: "Greek Island Escape",
      hotel: "Aura Suites",
      price: 189,
      originalPrice: 299,
      image:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop",
      rating: 4.8,
      reviews: 654,
      badge: "Hot Deal",
    },
    {
      destination: "Venice Canal View",
      hotel: "The Gritti Palace",
      price: 349,
      originalPrice: 550,
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop",
      rating: 4.9,
      reviews: 1105,
      badge: "Luxury",
    },
  ];

  const testimonials = [
    {
      name: "Maria S.",
      location: "Madrid, Spain",
      text: "Found the perfect boutique hotel in Paris through TraveloFare. The personalized recommendations saved me hours of searching. Absolutely fantastic!",
      rating: 5,
      avatar: "👩‍💼",
    },
    {
      name: "David H.",
      location: "Sydney, Australia",
      text: "Best hotel booking platform. The deals are incredible and customer service helped me change my booking twice without any issues.",
      rating: 5,
      avatar: "👨‍💼",
    },
    {
      name: "Jessica L.",
      location: "Toronto, Canada",
      text: "Compared TraveloFare with other platforms and consistently found better prices. Love the detailed reviews and photos.",
      rating: 5,
      avatar: "👩‍🎨",
    },
  ];

  const [stats, setStats] = useState({
    bookings: 0,
    hotels: 0,
    destinations: 0,
    savings: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) setStatsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsVisible]);

  useEffect(() => {
    if (!statsVisible) return;
    const targets = {
      bookings: 75000,
      hotels: 45000,
      destinations: 350,
      savings: 25,
    };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setStats({
        bookings: Math.floor((targets.bookings / steps) * step),
        hotels: Math.floor((targets.hotels / steps) * step),
        destinations: Math.floor((targets.destinations / steps) * step),
        savings: Math.floor((targets.savings / steps) * step),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [statsVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate-in");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document
      .querySelectorAll(".scroll-animate")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSearch = () => {
    if (!searchData.location) {
      alert("Please select a hotel destination");
      return;
    }
    if (!searchData.checkIn) {
      alert("Please select check-in date");
      return;
    }
    if (!searchData.checkOut) {
      alert("Please select check-out date");
      return;
    }
    navigate("/hotel-results", {
      state: {
        searchParams: {
          location: searchData.location,
          checkIn: searchData.checkIn,
          checkOut: searchData.checkOut,
          guests: searchData.guests,
          rooms: searchData.rooms,
        },
      },
    });
  };

  const updateGuests = (type, value) => {
    setSearchData((prev) => ({
      ...prev,
      guests: { ...prev.guests, [type]: Math.max(0, value) },
    }));
  };

  const totalGuests = searchData.guests.adults + searchData.guests.children;

  return (
    <div className="hotels-page">
      {/* ===== HERO SECTION ===== */}
      <section
        className="hero-section"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1564501049351-005e2b6534d3?w=1920&h=1080&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>

        <div className="hero-inner container">
          <div className="hero-left">
            <div className="hero-badge scroll-animate">
              <Building2 size={16} />
              <span>Premium Hotel Experiences</span>
            </div>

            <h1 className="hero-title scroll-animate">
              Discover Your Perfect
              <span className="hero-highlight">Hotel Stay</span>
            </h1>

            <p className="hero-subtitle scroll-animate">
              Browse thousands of hotels worldwide and save up to 60% on your
              accommodation. Find luxury, comfort, and great deals.
            </p>
          </div>

          <div className="hero-right">
            <div className="search-widget scroll-animate">
              <div className="search-body">
                <div className="search-row">
                  <div className="search-field">
                    <label>Destination</label>
                    <div className="input-wrapper">
                      <MapPin size={18} />
                      <input
                        type="text"
                        placeholder="Where do you want to stay?"
                        value={searchData.location}
                        onChange={(e) =>
                          setSearchData((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="search-row">
                  <div className="search-field">
                    <label>Check-in</label>
                    <div className="input-wrapper">
                      <Calendar size={18} />
                      <input
                        type="date"
                        value={searchData.checkIn}
                        onChange={(e) =>
                          setSearchData((prev) => ({
                            ...prev,
                            checkIn: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="search-field">
                    <label>Check-out</label>
                    <div className="input-wrapper">
                      <Calendar size={18} />
                      <input
                        type="date"
                        value={searchData.checkOut}
                        onChange={(e) =>
                          setSearchData((prev) => ({
                            ...prev,
                            checkOut: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="search-row">
                  <div className="search-field">
                    <label>Guests & Rooms</label>
                    <button
                      className="guests-selector"
                      onClick={() => setShowGuests(!showGuests)}
                    >
                      <Users size={18} />
                      <span>
                        {totalGuests} Guest{totalGuests !== 1 ? "s" : ""} •{" "}
                        {searchData.rooms} Room{searchData.rooms !== 1 ? "s" : ""}
                      </span>
                    </button>
                    {showGuests && (
                      <div className="guests-dropdown">
                        <div className="guest-option">
                          <span>Adults</span>
                          <div className="quantity-control">
                            <button
                              onClick={() =>
                                updateGuests(
                                  "adults",
                                  searchData.guests.adults - 1
                                )
                              }
                            >
                              −
                            </button>
                            <span>{searchData.guests.adults}</span>
                            <button
                              onClick={() =>
                                updateGuests(
                                  "adults",
                                  searchData.guests.adults + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="guest-option">
                          <span>Children</span>
                          <div className="quantity-control">
                            <button
                              onClick={() =>
                                updateGuests(
                                  "children",
                                  searchData.guests.children - 1
                                )
                              }
                            >
                              −
                            </button>
                            <span>{searchData.guests.children}</span>
                            <button
                              onClick={() =>
                                updateGuests(
                                  "children",
                                  searchData.guests.children + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="guest-option">
                          <span>Rooms</span>
                          <div className="quantity-control">
                            <button
                              onClick={() =>
                                setSearchData((prev) => ({
                                  ...prev,
                                  rooms: Math.max(1, prev.rooms - 1),
                                }))
                              }
                            >
                              −
                            </button>
                            <span>{searchData.rooms}</span>
                            <button
                              onClick={() =>
                                setSearchData((prev) => ({
                                  ...prev,
                                  rooms: prev.rooms + 1,
                                }))
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

                <button className="search-btn" onClick={handleSearch}>
                  <Search size={18} />
                  Search Hotels
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POPULAR DESTINATIONS ===== */}
      <section className="popular-destinations">
        <div className="container">
          <div className="section-header scroll-animate">
            <h2>Popular Hotel Destinations</h2>
            <p>Explore our most sought-after hotel locations worldwide</p>
          </div>

          <div className="destinations-grid">
            {popularDestinations.map((dest, idx) => (
              <div
                key={idx}
                className="destination-card scroll-animate"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div
                  className="dest-image"
                  style={{ backgroundImage: `url('${dest.image}')` }}
                >
                  <div className="dest-overlay">
                    <button className="view-btn">View Hotels</button>
                  </div>
                </div>
                <div className="dest-info">
                  <h3>{dest.name}</h3>
                  <div className="dest-details">
                    <span className="hotels-count">{dest.hotels} Hotels</span>
                    <span className="rating">
                      <Star size={14} fill="currentColor" />
                      {dest.rating}
                    </span>
                  </div>
                  <div className="avg-price">
                    From <strong>${dest.avgPrice}</strong>/night
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EXCLUSIVE DEALS ===== */}
      <section className="exclusive-deals">
        <div className="container">
          <div className="section-header scroll-animate">
            <h2>Exclusive Hotel Deals</h2>
            <p>Limited-time offers on premium accommodations</p>
          </div>

          <div className="deals-grid">
            {exclusiveDeals.map((deal, idx) => (
              <div
                key={idx}
                className="deal-card scroll-animate"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div
                  className="deal-image"
                  style={{ backgroundImage: `url('${deal.image}')` }}
                >
                  <span className="deal-badge">{deal.badge}</span>
                  <span className="discount">
                    -
                    {Math.round(
                      ((deal.originalPrice - deal.price) / deal.originalPrice) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="deal-content">
                  <h3>{deal.hotel}</h3>
                  <p className="location">{deal.destination}</p>
                  <div className="deal-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill="currentColor"
                          className="star-filled"
                        />
                      ))}
                    </div>
                    <span className="reviews">({deal.reviews} reviews)</span>
                  </div>
                  <div className="deal-price">
                    <div className="price-tag">
                      <span className="original">${deal.originalPrice}</span>
                      <span className="sale">${deal.price}</span>
                    </div>
                    <button className="book-btn">Book Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="stats-section" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card scroll-animate">
              <div className="stat-icon">
                <CreditCard size={32} />
              </div>
              <div className="stat-content">
                <h3>{stats.bookings.toLocaleString()}+</h3>
                <p>Hotel Bookings</p>
              </div>
            </div>

            <div className="stat-card scroll-animate">
              <div className="stat-icon">
                <Building2 size={32} />
              </div>
              <div className="stat-content">
                <h3>{stats.hotels.toLocaleString()}+</h3>
                <p>Hotels Listed</p>
              </div>
            </div>

            <div className="stat-card scroll-animate">
              <div className="stat-icon">
                <Globe size={32} />
              </div>
              <div className="stat-content">
                <h3>{stats.destinations}+</h3>
                <p>Destinations</p>
              </div>
            </div>

            <div className="stat-card scroll-animate">
              <div className="stat-icon">
                <Percent size={32} />
              </div>
              <div className="stat-content">
                <h3>${stats.savings}M+</h3>
                <p>Saved for Guests</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header scroll-animate">
            <h2>What Our Guests Say</h2>
            <p>Real experiences from travelers like you</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="testimonial-card scroll-animate"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="testimonial-header">
                  <span className="avatar">{testimonial.avatar}</span>
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p className="location">{testimonial.location}</p>
                  </div>
                </div>
                <div className="stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill="currentColor"
                      className="star-filled"
                    />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="features-section">
        <div className="container">
          <div className="section-header scroll-animate">
            <h2>Why Choose TraveloFare Hotels</h2>
            <p>Everything you need for the perfect stay</p>
          </div>

          <div className="features-grid">
            <div className="feature-card scroll-animate">
              <div className="feature-icon">
                <Award size={28} />
              </div>
              <h3>Best Price Guarantee</h3>
              <p>If you find a lower price elsewhere, we'll match it</p>
            </div>

            <div className="feature-card scroll-animate">
              <div className="feature-icon">
                <Shield size={28} />
              </div>
              <h3>Secure Booking</h3>
              <p>Your payment and personal information are always protected</p>
            </div>

            <div className="feature-card scroll-animate">
              <div className="feature-icon">
                <Headphones size={28} />
              </div>
              <h3>24/7 Support</h3>
              <p>Our team is always available to help with your booking</p>
            </div>

            <div className="feature-card scroll-animate">
              <div className="feature-icon">
                <Zap size={28} />
              </div>
              <h3>Instant Confirmation</h3>
              <p>Book your hotel instantly and receive instant confirmation</p>
            </div>

            <div className="feature-card scroll-animate">
              <div className="feature-icon">
                <Navigation size={28} />
              </div>
              <h3>Verified Reviews</h3>
              <p>Read authentic reviews from real guests who stayed there</p>
            </div>

            <div className="feature-card scroll-animate">
              <div className="feature-icon">
                <HeartHandshake size={28} />
              </div>
              <h3>Loyalty Rewards</h3>
              <p>Earn points on every booking and redeem for discounts</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content scroll-animate">
            <h2>Ready to Book Your Perfect Stay?</h2>
            <p>Discover amazing hotels and save up to 60% on your next trip</p>
            <button className="cta-button" onClick={handleSearch}>
              Search Hotels Now <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hotels;
