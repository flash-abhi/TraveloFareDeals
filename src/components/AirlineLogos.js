import React from 'react';
import './AirlineLogos.css';

function AirlineLogos() {
  const airlines = [
    { name: 'American Airlines', color: '#0078D2', abbr: 'AA' },
    { name: 'Delta Air Lines', color: '#C8102E', abbr: 'DL' },
    { name: 'United Airlines', color: '#0033A0', abbr: 'UA' },
    { name: 'Southwest Airlines', color: '#304CB2', abbr: 'WN' },
    { name: 'JetBlue Airways', color: '#003876', abbr: 'B6' },
    { name: 'Alaska Airlines', color: '#01426A', abbr: 'AS' },
    { name: 'Spirit Airlines', color: '#FFE900', abbr: 'NK', textColor: '#000' },
    { name: 'Frontier Airlines', color: '#1B8543', abbr: 'F9' },
    { name: 'Hawaiian Airlines', color: '#CC0033', abbr: 'HA' },
    { name: 'Air Canada', color: '#D71921', abbr: 'AC' },
    { name: 'British Airways', color: '#1E3D8F', abbr: 'BA' },
    { name: 'Lufthansa', color: '#05164D', abbr: 'LH' },
    { name: 'Emirates', color: '#D71921', abbr: 'EK' },
    { name: 'Qatar Airways', color: '#5C0A3B', abbr: 'QR' },
    { name: 'Singapore Airlines', color: '#00205B', abbr: 'SQ' },
    { name: 'Air France', color: '#002157', abbr: 'AF' },
  ];

  return (
    <section className="airline-logos-section">
      <div className="airline-logos-container">
        <div className="section-header">
          <h2>Our Airline Partners</h2>
          <p>Book with confidence - We partner with the world's leading airlines</p>
        </div>
        
        <div className="logos-slider">
          <div className="logos-track">
            {/* First set of logos */}
            {airlines.map((airline, index) => (
              <div key={`airline-1-${index}`} className="logo-item">
                <div className="logo-wrapper" style={{ 
                  background: `linear-gradient(135deg, ${airline.color} 0%, ${airline.color}dd 100%)` 
                }}>
                  <div className="airline-content">
                    <div className="airline-abbr" style={{ color: airline.textColor || '#fff' }}>
                      {airline.abbr}
                    </div>
                    <div className="airline-name" style={{ color: airline.textColor || '#fff' }}>
                      {airline.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {airlines.map((airline, index) => (
              <div key={`airline-2-${index}`} className="logo-item">
                <div className="logo-wrapper" style={{ 
                  background: `linear-gradient(135deg, ${airline.color} 0%, ${airline.color}dd 100%)` 
                }}>
                  <div className="airline-content">
                    <div className="airline-abbr" style={{ color: airline.textColor || '#fff' }}>
                      {airline.abbr}
                    </div>
                    <div className="airline-name" style={{ color: airline.textColor || '#fff' }}>
                      {airline.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AirlineLogos;
