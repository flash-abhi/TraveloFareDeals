import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plane, Hotel, TrendingUp, MapPin, Calendar, 
  Users, ArrowRight, Star, Shield, Sparkles, Globe,
  Award, Percent, PhoneCall, Mail, CheckCircle, Zap, HeartHandshake, Navigation, CreditCard, Headphones
} from 'lucide-react';
import { useContact } from '../context/ContactContext';
import SearchWidget from '../components/SearchWidget';
import "./HomeNew.css";

function HomeNew() {
  const navigate = useNavigate();
  const { contactSettings } = useContact();
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  const popularRoutes = [
    {
      from: "New York",
      fromCode: "JFK",
      to: "London",
      toCode: "LHR",
      price: 389,
      airline: "Multiple Airlines",
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=250&fit=crop",
    },
    {
      from: "Los Angeles",
      fromCode: "LAX",
      to: "Tokyo",
      toCode: "NRT",
      price: 549,
      airline: "Multiple Airlines",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=250&fit=crop",
    },
    {
      from: "Chicago",
      fromCode: "ORD",
      to: "Paris",
      toCode: "CDG",
      price: 429,
      airline: "Multiple Airlines",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=250&fit=crop",
    },
    {
      from: "Miami",
      fromCode: "MIA",
      to: "Dubai",
      toCode: "DXB",
      price: 619,
      airline: "Multiple Airlines",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop",
    },
    {
      from: "San Francisco",
      fromCode: "SFO",
      to: "Singapore",
      toCode: "SIN",
      price: 499,
      airline: "Multiple Airlines",
      image:
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=250&fit=crop",
    },
    {
      from: "Dallas",
      fromCode: "DFW",
      to: "Cancun",
      toCode: "CUN",
      price: 219,
      airline: "Multiple Airlines",
      image:
        "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=400&h=250&fit=crop",
    },
  ];

  const exclusiveDeals = [
    {
      destination: "Bali, Indonesia",
      tagline: "Tropical Escape",
      price: 849,
      originalPrice: 1199,
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop",
      rating: 4.9,
      reviews: 2840,
      badge: "Best Seller",
    },
    {
      destination: "Santorini, Greece",
      tagline: "Mediterranean Dream",
      price: 729,
      originalPrice: 1049,
      image:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop",
      rating: 4.8,
      reviews: 1920,
      badge: "Hot Deal",
    },
    {
      destination: "Maldives",
      tagline: "Paradise Found",
      price: 1199,
      originalPrice: 1799,
      image:
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop",
      rating: 4.9,
      reviews: 3150,
      badge: "Premium",
    },
    {
      destination: "Swiss Alps",
      tagline: "Mountain Adventure",
      price: 679,
      originalPrice: 999,
      image:
        "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop",
      rating: 4.7,
      reviews: 1680,
      badge: "New",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      location: "Toronto, Canada",
      text: "TraveloFare saved me $400 on my round-trip to London! The booking process was seamless and their customer support is phenomenal.",
      rating: 5,
      avatar: "👩‍💼",
    },
    {
      name: "James K.",
      location: "Vancouver, Canada",
      text: "Best travel platform I've ever used. Found amazing deals to Tokyo that I couldn't find anywhere else. Highly recommend!",
      rating: 5,
      avatar: "👨‍💻",
    },
    {
      name: "Emily R.",
      location: "Los Angeles, USA",
      text: "Their 24/7 support team helped me rebook my flight during a layover delay. Incredible service and the prices cannot be beat.",
      rating: 5,
      avatar: "👩‍🎨",
    },
  ];

  const [stats, setStats] = useState({
    bookings: 0,
    customers: 0,
    destinations: 0,
    savings: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) setStatsVisible(true);
      },
      { threshold: 0.3 },
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsVisible]);

  useEffect(() => {
    if (!statsVisible) return;
    const targets = {
      bookings: 50000,
      customers: 25000,
      destinations: 150,
      savings: 15,
    };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setStats({
        bookings: Math.floor((targets.bookings / steps) * step),
        customers: Math.floor((targets.customers / steps) * step),
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
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    document
      .querySelectorAll(".scroll-animate")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-new">
      {/* ===== HERO SECTION ===== */}
      <section
        className="hero"
        style={{
          backgroundImage: "url('/HeroImage.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
      <div className='overlay'>
        <div className="hero-inner container">
          <div className="hero-left">
            <div className="hero-badge scroll-animate">
              <Globe size={16} />
              <span>Explore The World</span>
            </div>

            <h1 className="hero-title scroll-animate">
              The World is Waiting
              <span className="hero-highlight">Start Your Journey</span>
            </h1>

            <p className="hero-subtitle scroll-animate">
              Find the best flights and hotels at unbeatable prices. Book now
              and save up to 50% on your next trip.
            </p>
          </div>

          <div className="hero-right">
            <SearchWidget />
          </div>
        </div>
        </div>
      </section>

      {/* ===== SERVICES STRIP ===== */}
      <section className="services-strip">
        <div className="container">
          <div className="services-row">
            <div className="service-pill">
              <Plane size={20} /> <span>500+ Airlines</span>
            </div>
            <div className="service-pill">
              <Hotel size={20} /> <span>1M+ Hotels</span>
            </div>
            <div className="service-pill">
              <CreditCard size={20} /> <span>Secure Payment</span>
            </div>
            <div className="service-pill">
              <Headphones size={20} /> <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CALL TO BOOK BANNER ===== */}
      <section className="call-banner scroll-animate">
        <div className="container">
          <div className="call-banner-inner">
            <div className="call-banner-left">
              <div className="call-banner-icon">
                <PhoneCall size={32} />
              </div>
              <div>
                <h3>🇺🇸 🇨🇦 Exclusive Phone-Only Deals</h3>
                <p>
                  Save extra when you book by phone — unpublished fares
                  available!
                </p>
              </div>
            </div>
            <div className="call-banner-right">
              <a
                href={`tel:${(contactSettings.tfn || "+1-888-859-0441").replace(/[^0-9+]/g, "")}`}
                className="call-banner-btn"
                onclick="return gtag_report_call_conversion('tel:+18008899279');"
              >
                <PhoneCall size={20} />
                <div>
                  <span className="banner-phone">
                    {contactSettings.tfn || "+1-888-859-0441"}
                  </span>
                  <span className="banner-avail">Toll-Free · 24/7</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POPULAR ROUTES - NEW DESIGN ===== */}
      <section className="popular-routes-section scroll-animate">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Trending Routes Now</h2>
              <p>Hot flights being booked right now</p>
            </div>
            <button
              className="see-all-btn"
              onClick={() => navigate("/flights")}
            >
              Explore All <ArrowRight size={16} />
            </button>
          </div>
          <div className="routes-grid-new">
            {popularRoutes.map((route, idx) => (
              <div
                key={idx}
                className="route-card-modern"
                onClick={() => navigate("/flights")}
                style={{
                  backgroundImage: `url(${route.image})`,
                }}
              >
                
                <div className="route-overlay-gradient"></div>
                <div className="route-card-content">
                  <div className="route-tag">✈️ Flight Deal</div>
                  <div className="route-info">
                    <div className="route-from">
                      <div className="city-name">{route.from}</div>
                      <div className="city-code">{route.fromCode}</div>
                    </div>
                    <div className="route-arrow">
                      <ArrowRight size={20} />
                    </div>
                    <div className="route-to">
                      <div className="city-name">{route.to}</div>
                      <div className="city-code">{route.toCode}</div>
                    </div>
                  </div>
                  <div className="route-bottom">
                    <span className="airline-info">{route.airline}</span>
                    <span className="price-large">${route.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DEALS SHOWCASE ===== */}
      <section className="deals-showcase scroll-animate">
        <div className="container">
          <div className="showcase-header">
            <h2>💎 Premium Vacation Packages</h2>
            <p>Curated destinations for unforgettable experiences</p>
          </div>
          <div className="deals-showcase-grid">
            {exclusiveDeals.map((deal, idx) => (
              <div key={idx} className="deal-showcase-card">
                <div className="deal-showcase-img">
                  <img src={deal.image} alt={deal.destination} loading="lazy" />
                  <div className="deal-overlay-new">
                    <span className="deal-badge-new">{deal.badge}</span>
                  </div>
                </div>
                <div className="deal-showcase-content">
                  <h3>{deal.destination}</h3>
                  <p className="deal-tagline">{deal.tagline}</p>
                  <div className="deal-rating-new">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={
                            i < Math.floor(deal.rating) ? "#f59e0b" : "#e5e7eb"
                          }
                          stroke={
                            i < Math.floor(deal.rating) ? "#f59e0b" : "#e5e7eb"
                          }
                        />
                      ))}
                    </div>
                    <span className="review-count">({deal.reviews})</span>
                  </div>
                  <div className="price-comparison">
                    <span className="original-price">
                      ${deal.originalPrice}
                    </span>
                    <span className="current-price">${deal.price}</span>
                    <span className="discount">
                      {Math.round(
                        ((deal.originalPrice - deal.price) /
                          deal.originalPrice) *
                          100,
                      )}
                      % OFF
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="why-section scroll-animate">
        <div className="container">
          <div className="section-head centered">
            <h2>Why Choose TraveloFare?</h2>
            <p>We make travel simple, affordable, and unforgettable</p>
          </div>
          <div className="why-grid">
            {[
              {
                icon: TrendingUp,
                title: "Best Price Guarantee",
                desc: "Find a lower price? We'll match it and give you an extra 10% off. That's our promise.",
                color: "#DC143C",
              },
              {
                icon: Shield,
                title: "Secure Booking",
                desc: "Your data is protected with 256-bit encryption. Book with confidence every time.",
                color: "#10b981",
              },
              {
                icon: Headphones,
                title: "24/7 Expert Support",
                desc: "Real humans, real help. Our travel experts are available around the clock.",
                color: "#f59e0b",
              },
              {
                icon: Zap,
                title: "Instant Confirmation",
                desc: "Get your booking confirmed in seconds with instant e-tickets sent to your inbox.",
                color: "#ef4444",
              },
              {
                icon: HeartHandshake,
                title: "Flexible Cancellation",
                desc: "Plans change. Most bookings offer free cancellation up to 24 hours before travel.",
                color: "#DC143C",
              },
              {
                icon: Globe,
                title: "500+ Airlines",
                desc: "Access to every major and low-cost carrier worldwide for the best selection and prices.",
                color: "#06b6d4",
              },
            ].map((feature, idx) => (
              <div key={idx} className="why-card">
                <div
                  className="why-icon"
                  style={{
                    background: `${feature.color}15`,
                    color: feature.color,
                  }}
                >
                  <feature.icon size={28} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="newsLetter scroll-animate">
        <div className="container">
          <div className="newsletter-inner">
            <div className="newsletter-text">
              <h2>Get Exclusive Deals in Your Inbox</h2>
              <p>
                Subscribe for the latest travel deals, insider tips, and up to
                50% off your next booking.
              </p>
            </div>
            <form
              className="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for subscribing!");
              }}
            >
              <div className="newsletter-input-wrap">
                <Mail size={20} />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div type="submit" className="newsletter-btn">
                Subscribe <ArrowRight size={18} />
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeNew;
