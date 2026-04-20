import React from 'react';
import { Globe, Users, Award, TrendingUp } from 'lucide-react';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <h1>About TraveloFare</h1>
          <p>Your Trusted Partner in Affordable Travel Since 2020</p>
        </div>
      </div>

      <div className="container">
        <section className="about-section">
          <div className="about-content">
            <h2>Who We Are</h2>
            <p>
              TraveloFare is a leading online travel agency dedicated to making
              travel accessible and affordable for everyone. We specialize in
              finding the best deals on flights, hotels, cruises, and vacation
              packages, helping millions of travelers save money while creating
              unforgettable memories.
            </p>
            <p>
              Our team of travel experts works around the clock to negotiate
              exclusive deals with airlines, hotels, and cruise lines, passing
              the savings directly to you. We believe that everyone deserves to
              explore the world without breaking the bank.
            </p>
          </div>
        </section>

        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <Globe size={40} />
              <h3>500+</h3>
              <p>Destinations Worldwide</p>
            </div>
            <div className="stat-card">
              <Users size={40} />
              <h3>2M+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="stat-card">
              <Award size={40} />
              <h3>50+</h3>
              <p>Industry Awards</p>
            </div>
            <div className="stat-card">
              <TrendingUp size={40} />
              <h3>40%</h3>
              <p>Average Savings</p>
            </div>
          </div>
        </section>

        <section className="mission-section">
          <h2>Our Mission</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <h3>🎯 Best Prices</h3>
              <p>
                We guarantee the lowest prices on flights, hotels, and vacation
                packages.
              </p>
            </div>
            <div className="mission-card">
              <h3>🌟 Quality Service</h3>
              <p>
                24/7 customer support to assist you before, during, and after
                your trip.
              </p>
            </div>
            <div className="mission-card">
              <h3>🔒 Secure Booking</h3>
              <p>
                Safe and secure payment processing with industry-leading
                encryption.
              </p>
            </div>
            <div className="mission-card">
              <h3>✈️ Easy Planning</h3>
              <p>
                User-friendly platform that makes booking your dream vacation
                simple.
              </p>
            </div>
          </div>
        </section>

        <section className="values-section">
          <h2>Our Values</h2>
          <ul className="values-list">
            <li>
              <strong>Transparency:</strong> No hidden fees, no surprises - just
              honest pricing.
            </li>
            <li>
              <strong>Customer First:</strong> Your satisfaction is our top
              priority.
            </li>
            <li>
              <strong>Innovation:</strong> Constantly improving our technology
              to serve you better.
            </li>
            <li>
              <strong>Reliability:</strong> Trusted by millions of travelers
              worldwide.
            </li>
            <li>
              <strong>Excellence:</strong> Committed to providing exceptional
              travel experiences.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default About;
