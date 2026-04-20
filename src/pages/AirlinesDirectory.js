import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllAirlines, getAirlinesByAlliance } from '../data/airlines';
import { Plane, Search, Globe, Star, MapPin, Filter } from 'lucide-react';
import './AirlinesDirectory.css';

function AirlinesDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAlliance, setFilterAlliance] = useState('all');
  const airlines = getAllAirlines();

  const filteredAirlines = airlines.filter(airline => {
    const matchesSearch = airline.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         airline.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAlliance = filterAlliance === 'all' || airline.alliance === filterAlliance;
    return matchesSearch && matchesAlliance;
  });

  const alliances = ['Star Alliance', 'Oneworld', 'SkyTeam', 'None (Independent)'];

  return (
    <div className="airlines-directory">
      {/* Hero Section */}
      <div className="directory-hero">
        <h1><Plane size={40} /> Airlines Directory</h1>
        <p>Explore all major airlines and find the best deals for your next flight</p>
      </div>

      {/* Search and Filter */}
      <div className="directory-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search airlines by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <Filter size={20} />
          <select value={filterAlliance} onChange={(e) => setFilterAlliance(e.target.value)}>
            <option value="all">All Alliances</option>
            {alliances.map(alliance => (
              <option key={alliance} value={alliance}>{alliance}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count">
        Showing {filteredAirlines.length} airline{filteredAirlines.length !== 1 ? 's' : ''}
      </div>

      {/* Airlines Grid */}
      <div className="airlines-grid">
        {filteredAirlines.map(airline => (
          <Link 
            to={`/airlines/${airline.slug}`} 
            key={airline.slug}
            className="airline-card"
          >
            <div className="airline-card-header">
              <div className="airline-logo-small">
                {airline.logo ? (
                  <img 
                    src={airline.logo} 
                    alt={`${airline.name} logo`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <Plane size={32} style={{ display: airline.logo ? 'none' : 'flex' }} />
              </div>
              <div className="airline-title">
                <h3>{airline.name}</h3>
                <span className="airline-code-small">{airline.code}</span>
              </div>
            </div>

            <div className="airline-card-info">
              <div className="info-row">
                <Globe size={16} />
                <span>{airline.destinations} destinations</span>
              </div>
              <div className="info-row">
                <MapPin size={16} />
                <span>{airline.hubs[0]}</span>
              </div>
              <div className="info-row">
                <Star size={16} />
                <span>{airline.alliance}</span>
              </div>
            </div>

            <div className="airline-card-footer">
              <span className="view-details">View Details →</span>
            </div>
          </Link>
        ))}
      </div>

      {filteredAirlines.length === 0 && (
        <div className="no-results">
          <Plane size={64} />
          <h3>No airlines found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Alliance Information */}
      <div className="alliance-info">
        <h2>Airline Alliances</h2>
        <p>Many airlines are part of global alliances, offering benefits like coordinated schedules and shared loyalty programs.</p>
        
        <div className="alliance-cards">
          <div className="alliance-card">
            <h3>Star Alliance</h3>
            <p>World's largest airline alliance with 26 member airlines</p>
            <div className="alliance-count">
              {airlines.filter(a => a.alliance === 'Star Alliance').length} airlines
            </div>
          </div>
          <div className="alliance-card">
            <h3>Oneworld</h3>
            <p>Premium alliance focused on seamless global travel</p>
            <div className="alliance-count">
              {airlines.filter(a => a.alliance === 'Oneworld').length} airlines
            </div>
          </div>
          <div className="alliance-card">
            <h3>SkyTeam</h3>
            <p>Global airline alliance serving 175+ countries</p>
            <div className="alliance-count">
              {airlines.filter(a => a.alliance === 'SkyTeam').length} airlines
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="directory-cta">
        <h2>Ready to Book Your Flight?</h2>
        <p>Search and compare prices across all airlines to find the best deal</p>
        <Link to="/" className="cta-button">
          <Plane size={20} /> Search Flights Now
        </Link>
      </div>
    </div>
  );
}

export default AirlinesDirectory;
