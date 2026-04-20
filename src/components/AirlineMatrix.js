import React, { useState, useEffect } from 'react';
import { Plane } from 'lucide-react';
import './AirlineMatrix.css';

function AirlineMatrix({ onAirlineSelect, selectedAirlines = [] }) {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAirlines();
  }, []);

  const fetchAirlines = async () => {
    try {
      const response = await fetch('/api/airlines');
      const data = await response.json();
      if (data.success) {
        setAirlines(data.data);
      }
    } catch (error) {
      console.error('Error fetching airlines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAirlineClick = (airlineCode) => {
    if (onAirlineSelect) {
      onAirlineSelect(airlineCode);
    }
  };

  const getFilteredAirlines = () => {
    if (filter === 'all') return airlines;
    return airlines.filter(airline => airline.alliance === filter);
  };

  const groupedAirlines = {
    'Star Alliance': airlines.filter(a => a.alliance === 'Star Alliance'),
    'Oneworld': airlines.filter(a => a.alliance === 'Oneworld'),
    'SkyTeam': airlines.filter(a => a.alliance === 'SkyTeam'),
    'Independent': airlines.filter(a => !a.alliance)
  };

  if (loading) {
    return (
      <div className="airline-matrix-loading">
        <Plane className="loading-icon" size={32} />
        <p>Loading airlines...</p>
      </div>
    );
  }

  return (
    <div className="airline-matrix">
      <div className="airline-matrix-header">
        <h3>Select Preferred Airlines</h3>
        <div className="alliance-filters">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All Airlines
          </button>
          <button 
            className={filter === 'Star Alliance' ? 'active' : ''} 
            onClick={() => setFilter('Star Alliance')}
          >
            Star Alliance
          </button>
          <button 
            className={filter === 'Oneworld' ? 'active' : ''} 
            onClick={() => setFilter('Oneworld')}
          >
            Oneworld
          </button>
          <button 
            className={filter === 'SkyTeam' ? 'active' : ''} 
            onClick={() => setFilter('SkyTeam')}
          >
            SkyTeam
          </button>
        </div>
      </div>

      <div className="airline-matrix-content">
        {filter === 'all' ? (
          Object.entries(groupedAirlines).map(([alliance, airlineList]) => (
            airlineList.length > 0 && (
              <div key={alliance} className="alliance-group">
                <h4 className="alliance-title">{alliance}</h4>
                <div className="airline-grid">
                  {airlineList.map(airline => (
                    <div
                      key={airline.code}
                      className={`airline-card ${selectedAirlines.includes(airline.code) ? 'selected' : ''}`}
                      onClick={() => handleAirlineClick(airline.code)}
                    >
                      <div className="airline-logo-container">
                        <img
                          src={`${airline.logo.replace('.png', '.svg')}`}
                          alt={airline.name}
                          className="airline-logo"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/airlines/default.svg';
                          }}
                        />
                      </div>
                      <div className="airline-info">
                        <span className="airline-code">{airline.code}</span>
                        <span className="airline-name">{airline.name}</span>
                        <span className="airline-country">{airline.country}</span>
                      </div>
                      {selectedAirlines.includes(airline.code) && (
                        <div className="selected-badge">✓</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))
        ) : (
          <div className="airline-grid">
            {getFilteredAirlines().map(airline => (
              <div
                key={airline.code}
                className={`airline-card ${selectedAirlines.includes(airline.code) ? 'selected' : ''}`}
                onClick={() => handleAirlineClick(airline.code)}
              >
                <div className="airline-logo-container">
                  <img
                    src={`${airline.logo.replace('.png', '.svg')}`}
                    alt={airline.name}
                    className="airline-logo"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/airlines/default.svg';
                    }}
                  />
                </div>
                <div className="airline-info">
                  <span className="airline-code">{airline.code}</span>
                  <span className="airline-name">{airline.name}</span>
                  <span className="airline-country">{airline.country}</span>
                </div>
                {selectedAirlines.includes(airline.code) && (
                  <div className="selected-badge">✓</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedAirlines.length > 0 && (
        <div className="selected-airlines-summary">
          <p>
            <strong>{selectedAirlines.length}</strong> airline{selectedAirlines.length > 1 ? 's' : ''} selected
          </p>
          <button 
            className="clear-selection-btn"
            onClick={() => onAirlineSelect(null)}
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
}

export default AirlineMatrix;
