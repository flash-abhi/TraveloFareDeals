import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllAirlines } from '../data/airlines';
import { Plane, Search, Filter, Globe, MapPin, Star, X, ChevronRight } from 'lucide-react';
import './AirlinesNew.css';

function AirlinesNew() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAlliance, setFilterAlliance] = useState('all');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const airlines = getAllAirlines();

  const filteredAirlines = airlines.filter(airline => {
    const matchesSearch = airline.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         airline.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAlliance = filterAlliance === 'all' || airline.alliance === filterAlliance;
    return matchesSearch && matchesAlliance;
  });

  const alliances = ['Star Alliance', 'Oneworld', 'SkyTeam', 'None (Independent)'];

  return (
    <div className="airlines-new">
      {/* Hero Section */}
      <section className="airlines-hero">

        <div className="airlines-hero-content">
          <div className="airlines-hero-badge">
            <Plane size={18} />
            <span>Global Airlines</span>
          </div>
          <h1 className="airlines-hero-title">
            Explore World's <span className="hero-highlight">Best Airlines</span>
          </h1>
          <p className="airlines-hero-subtitle">
            Discover and compare airlines worldwide. Find the perfect carrier for your journey.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="airlines-controls-section">
        <div className="airlines-controls-container">
          <div className="airlines-search-wrapper">
            <div className="airlines-search-box">
              {/* <Search size={20} className="search-icon" /> */}
              <input
                type="text"
                placeholder="Search airlines by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="airlines-search-input"
              />
              {searchQuery && (
                <button
                  className="search-clear"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <button
              className="mobile-filter-btn"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
          </div>

          <div className={`airlines-filter-box ${mobileFilterOpen ? 'open' : ''}`}>
            <Filter size={20} className="filter-icon" />
            <select
              value={filterAlliance}
              onChange={(e) => {
                setFilterAlliance(e.target.value);
                setMobileFilterOpen(false);
              }}
              className="airlines-filter-select"
            >
              <option value="all">All Alliances</option>
              {alliances.map(alliance => (
                <option key={alliance} value={alliance}>{alliance}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="airlines-results-info">
          <p>Showing <strong>{filteredAirlines.length}</strong> airline{filteredAirlines.length !== 1 ? 's' : ''}</p>
        </div>
      </section>

      {/* Airlines Grid */}
      <section className="airlines-grid-section">
        <div className="airlines-grid">
          {filteredAirlines.length > 0 ? (
            filteredAirlines.map((airline, index) => (
              <Link
                key={airline.slug}
                to={`/airlines/${airline.slug}`}
                className="airline-card-new"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="airline-card-top">
                  <div className="airline-logo-container">
                    {airline.logo ? (
                      <img
                        src={airline.logo}
                        alt={`${airline.name} logo`}
                        className="airline-logo"
                      />
                    ) : (
                      <div className="airline-logo-fallback">
                        <Plane size={32} />
                      </div>
                    )}
                  </div>
                  <div className="airline-badge">
                    <span>{airline.code}</span>
                  </div>
                </div>

                <div className="airline-card-middle">
                  <h3 className="airline-name">{airline.name}</h3>
                  <p className="airline-alliance">{airline.alliance}</p>
                </div>

                <div className="airline-card-stats">
                  <div className="stat-item">
                    <Globe size={16} />
                    <span>{airline.destinations}</span>
                  </div>
                  <div className="stat-item">
                    <MapPin size={16} />
                    <span>{airline.hubs[0]}</span>
                  </div>
                </div>

                <div className="airline-card-footer-new">
                  <span>View Details</span>
                  <ChevronRight size={18} />
                </div>
              </Link>
            ))
          ) : (
            <div className="no-results">
              <Plane size={48} />
              <h3>No airlines found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AirlinesNew;
