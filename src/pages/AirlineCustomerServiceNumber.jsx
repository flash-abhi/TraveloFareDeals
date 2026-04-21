import React from "react";
import { Helmet } from "react-helmet";
import { Phone, Clock, CheckCircle, Shield, Headphones, Globe, Plane, Users, MessageCircle, Star } from "lucide-react";
import { useContact } from '../context/ContactContext';
import "./AirlineCustomerServiceNumber.css";

const AirlineCustomerServiceNumber = () => {
  const { contactSettings } = useContact();
  const tfn = contactSettings.tfn || "+1-888-859-0441";
  const tfnClean = tfn.replace(/[^0-9+]/g, '');

  const airlines = [
    { name: "American Airlines", code: "AA", color: "#0078D2" },
    { name: "Delta Air Lines", code: "DL", color: "#003A70" },
    { name: "United Airlines", code: "UA", color: "#002244" },
    { name: "Southwest Airlines", code: "WN", color: "#304CB2" },
    { name: "JetBlue Airways", code: "B6", color: "#003876" },
    { name: "Alaska Airlines", code: "AS", color: "#01426A" },
    { name: "Spirit Airlines", code: "NK", color: "#FFE600" },
    { name: "Frontier Airlines", code: "F9", color: "#004225" },
  ];

  const services = [
    {
      icon: <Plane size={32} />,
      title: "Flight Reservations",
      description: "Book new flights, modify existing reservations, or get help finding the best fares for your travel dates."
    },
    {
      icon: <Clock size={32} />,
      title: "Flight Status & Updates",
      description: "Get real-time information about departures, arrivals, delays, gate changes, and cancellations."
    },
    {
      icon: <Users size={32} />,
      title: "Booking Changes",
      description: "Change your travel dates, upgrade seats, add passengers, or modify your itinerary with ease."
    },
    {
      icon: <Shield size={32} />,
      title: "Cancellation & Refunds",
      description: "Cancel your booking and understand refund policies, credits, and rebooking options."
    },
    {
      icon: <Headphones size={32} />,
      title: "Baggage Assistance",
      description: "Report lost luggage, track delayed bags, or get information about baggage allowances and fees."
    },
    {
      icon: <Globe size={32} />,
      title: "Travel Information",
      description: "Learn about visa requirements, COVID policies, special assistance, and destination guidelines."
    }
  ];

  const faqs = [
    {
      question: "What is the best airline customer service number to call?",
      answer: `For general travel assistance and flight booking support, you can call ${tfn}. Our dedicated travel specialists are available to help with reservations, flight information, and travel guidance for all major airlines.`
    },
    {
      question: "What are the airline customer service hours?",
      answer: "Most airline customer service lines operate 24/7. Our travel assistance helpline at " + tfn + " is available around the clock to help you with any travel-related queries."
    },
    {
      question: "How do I speak to a live person at an airline?",
      answer: `To speak with a live travel specialist immediately, call ${tfn}. Skip the automated menus and connect directly with a knowledgeable agent who can assist with your airline-related needs.`
    },
    {
      question: "Can I change my flight over the phone?",
      answer: "Yes, flight changes can be made over the phone. Call " + tfn + " to speak with an agent who can help you modify your travel dates, upgrade your seat, or make other changes to your reservation."
    },
    {
      question: "How do I get a refund for a cancelled flight?",
      answer: `For refund assistance, call ${tfn}. Our agents can guide you through the refund process, explain your options, and help you understand the airline's cancellation policies.`
    },
    {
      question: "What information do I need when calling airline customer service?",
      answer: "Have your booking confirmation number, flight details, passenger names, and payment information ready. This helps our agents at " + tfn + " assist you more quickly and efficiently."
    }
  ];

  return (
    <>
      <Helmet>
        <title>
          Airline Customer Service Number | Call {tfn} for 24/7 Support
        </title>
        <meta
          name="description"
          content={`Need airline customer service? Call ${tfn} for 24/7 flight booking assistance, reservations, cancellations, refunds, and travel support. Speak to a live agent now!`}
        />
        <meta
          name="keywords"
          content="airline customer service number, airline phone number, flight booking help, airline reservations, airline support, travel assistance, flight cancellation, airline refund"
        />
        <link
          rel="canonical"
          href="https://travelofaredeals.com/airline-customer-service-number"
        />
        <meta
          property="og:title"
          content={`Airline Customer Service Number | Call ${tfn}`}
        />
        <meta
          property="og:description"
          content="Get 24/7 airline customer service support. Book flights, change reservations, request refunds, and more."
        />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "TraveloFare - Airline Customer Service",
            url: "https://travelofaredeals.com/airline-customer-service-number",
            logo: "https://travelofaredeals.com/logo.svg",
            contactPoint: [
              {
                "@type": "ContactPoint",
                telephone: tfn,
                contactType: "customer support",
                areaServed: "US",
                availableLanguage: ["English", "Spanish"],
              },
            ],
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          })}
        </script>
      </Helmet>

      <div className="airline-service-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            <img
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80"
              alt="Airplane flying in the sky"
              className="hero-bg-image"
            />
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-content">
            <div className="hero-badge">
              <Headphones size={20} />
              <span>24/7 Live Support Available</span>
            </div>
            <h1>Airline Customer Service Number</h1>
            <p className="hero-subtitle">
              Get instant help with flight bookings, reservations,
              cancellations, and refunds. Our travel specialists are ready to
              assist you 24 hours a day, 7 days a week.
            </p>
            <a href={`tel:${tfnClean}`} className="hero-cta">
              <Phone size={24} />
              <span>Call Now: {tfn}</span>
            </a>
            <div className="hero-features">
              <div className="feature">
                <CheckCircle size={18} />
                <span>No Wait Time</span>
              </div>
              <div className="feature">
                <CheckCircle size={18} />
                <span>Live Agents</span>
              </div>
              <div className="feature">
                <CheckCircle size={18} />
                <span>24/7 Available</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Banner */}
        <section className="trust-banner">
          <div className="container">
            <div className="trust-stats">
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Travelers Helped</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.9/5</span>
                <span className="stat-label">Customer Rating</span>
              </div>
              <div className="stat">
                <span className="stat-number">30 sec</span>
                <span className="stat-label">Avg. Response Time</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Always Available</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="main-content">
          <div className="container">
            {/* Introduction */}
            <section className="content-section intro-section">
              <div className="section-content">
                <h2>
                  Why Travelers Trust Our Airline Customer Service Helpline
                </h2>
                <p>
                  Finding a reliable{" "}
                  <strong>airline customer service number</strong> can be
                  frustrating. Long hold times, confusing automated systems, and
                  unhelpful responses make travel planning stressful. That's why
                  thousands of travelers call <strong>{tfn}</strong> for quick,
                  professional assistance with all their airline-related needs.
                </p>
                <p>
                  Whether you need to book a last-minute flight, change your
                  travel dates, request a refund for a cancelled flight, or
                  simply get information about baggage policies, our experienced
                  travel specialists are here to help. We provide{" "}
                  <strong>independent travel assistance</strong> and can guide
                  you through the booking process for all major airlines.
                </p>
                <div className="cta-box">
                  <div className="cta-content">
                    <h3>Speak to a Travel Specialist Now</h3>
                    <p>
                      Skip the wait. Get immediate assistance with your airline
                      needs.
                    </p>
                  </div>
                  <a href={`tel:${tfnClean}`} className="cta-button">
                    <Phone size={20} />
                    {tfn}
                  </a>
                </div>
              </div>
              <div className="section-image">
                <img
                  src="https://images.unsplash.com/photo-1521727284390-39ca72a09ac2?w=600&q=80"
                  alt="Customer service representative helping traveler"
                />
              </div>
            </section>

            {/* Services Section */}
            <section className="content-section services-section">
              <h2>How We Can Help You Today</h2>
              <p className="section-intro">
                Our airline customer service team handles a wide range of
                travel-related requests. Call <strong>{tfn}</strong> for
                assistance with:
              </p>
              <div className="services-grid">
                {services.map((service, index) => (
                  <div key={index} className="service-card">
                    <div className="service-icon">{service.icon}</div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Airlines Section */}
            <section className="content-section airlines-section">
              <div className="section-image airlines-image">
                <img
                  src="https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=600&q=80"
                  alt="Multiple airplanes at airport terminal"
                />
              </div>
              <div className="section-content">
                <h2>We Assist with All Major Airlines</h2>
                <p>
                  Looking for a specific <strong>airline phone number</strong>?
                  Our travel specialists can help you with booking information,
                  flight status, and reservations for all major domestic and
                  international carriers. Call <strong>{tfn}</strong> for
                  assistance with:
                </p>
                <div className="airlines-grid">
                  {airlines.map((airline, index) => (
                    <div
                      key={index}
                      className="airline-tag"
                      style={{ borderColor: airline.color }}
                    >
                      <img
                        src={`https://images.kiwi.com/airlines/64/${airline.code}.png`}
                        alt={airline.name}
                        className="airline-logo"
                      />
                      <span>{airline.name}</span>
                    </div>
                  ))}
                </div>
                <p className="disclaimer-small">
                  * We are an independent travel service and not directly
                  affiliated with any airline. We provide general travel
                  assistance and booking guidance.
                </p>
              </div>
            </section>

            {/* Step by Step Section */}
            <section className="content-section steps-section">
              <h2>How to Get Help in 3 Simple Steps</h2>
              <div className="steps-grid">
                <div className="step-card">
                  <div className="step-number">1</div>
                  <div className="step-icon">
                    <Phone size={40} />
                  </div>
                  <h3>Call Our Helpline</h3>
                  <p>
                    Dial <strong>{tfn}</strong> to connect with our travel
                    specialists instantly. No long wait times or confusing
                    menus.
                  </p>
                </div>
                <div className="step-card">
                  <div className="step-number">2</div>
                  <div className="step-icon">
                    <MessageCircle size={40} />
                  </div>
                  <h3>Describe Your Needs</h3>
                  <p>
                    Tell us what you need help with – booking, changes,
                    cancellations, refunds, or flight information.
                  </p>
                </div>
                <div className="step-card">
                  <div className="step-number">3</div>
                  <div className="step-icon">
                    <CheckCircle size={40} />
                  </div>
                  <h3>Get It Resolved</h3>
                  <p>
                    Our experienced agents will guide you through the process
                    and help resolve your travel needs quickly.
                  </p>
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <section className="content-section benefits-section">
              <div className="benefits-content">
                <h2>Benefits of Calling {tfn}</h2>
                <div className="benefits-list">
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <Star size={24} />
                    </div>
                    <div className="benefit-text">
                      <h4>Expert Travel Specialists</h4>
                      <p>
                        Our team has years of experience helping travelers
                        navigate airline bookings and policies.
                      </p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <Clock size={24} />
                    </div>
                    <div className="benefit-text">
                      <h4>24/7 Availability</h4>
                      <p>
                        Travel emergencies don't wait for business hours.
                        Neither do we. Call anytime, day or night.
                      </p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <Globe size={24} />
                    </div>
                    <div className="benefit-text">
                      <h4>Multilingual Support</h4>
                      <p>
                        Get assistance in English and Spanish from our diverse
                        team of travel experts.
                      </p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <Shield size={24} />
                    </div>
                    <div className="benefit-text">
                      <h4>Secure & Confidential</h4>
                      <p>
                        Your personal and payment information is always
                        protected with industry-standard security.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="benefits-image">
                <img
                  src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80"
                  alt="Happy travelers at airport"
                />
                <div className="image-cta">
                  <a href={`tel:${tfnClean}`} className="floating-cta">
                    <Phone size={20} />
                    Call {tfn}
                  </a>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="content-section faq-section">
              <h2>Frequently Asked Questions About Airline Customer Service</h2>
              <div className="faq-grid">
                {faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Common Searches */}
            <section className="content-section searches-section">
              <h2>Common Airline Customer Service Searches</h2>
              <p>
                Travelers often search for these terms when looking for airline
                assistance. If you're looking for help with any of these, call{" "}
                <strong>{tfn}</strong>:
              </p>
              <div className="search-tags">
                <span className="search-tag">
                  airline customer service number
                </span>
                <span className="search-tag">airline phone number</span>
                <span className="search-tag">
                  flight booking customer service
                </span>
                <span className="search-tag">
                  airline reservations phone number
                </span>
                <span className="search-tag">airline support hotline</span>
                <span className="search-tag">flight cancellation helpline</span>
                <span className="search-tag">
                  airline refund customer service
                </span>
                <span className="search-tag">24/7 airline support</span>
                <span className="search-tag">airline baggage claim number</span>
                <span className="search-tag">flight change assistance</span>
                <span className="search-tag">travel agent phone number</span>
                <span className="search-tag">airline ticket help</span>
              </div>
            </section>

            {/* Disclaimer Section */}
            <section className="content-section disclaimer-section">
              <div className="disclaimer-box">
                <h3>Important Disclaimer</h3>
                <p>
                  <strong>
                    We are an independent travel assistance service.
                  </strong>{" "}
                  Fly Travel Deals is not the official customer service line for
                  any specific airline. We provide general travel guidance,
                  booking assistance, and support to help travelers make
                  informed decisions. For official airline-specific policies, we
                  recommend contacting the airline directly through their
                  official website.
                </p>
                <p>
                  Our goal is to help travelers navigate the often confusing
                  world of airline reservations and provide helpful, accurate
                  information to make your travel experience smoother.
                </p>
              </div>
            </section>
          </div>
        </main>

        {/* Final CTA Section */}
        <section className="final-cta-section">
          <div className="container">
            <div className="final-cta-content">
              <h2>Ready to Get Help with Your Travel Needs?</h2>
              <p>
                Don't spend hours searching for airline phone numbers or waiting
                on hold. Our travel specialists are standing by to assist you
                right now.
              </p>
              <a href={`tel:${tfnClean}`} className="final-cta-button">
                <Phone size={28} />
                <div className="cta-text">
                  <span className="cta-label">Call Toll-Free 24/7</span>
                  <span className="cta-number">{tfn}</span>
                </div>
              </a>
              <div className="final-features">
                <span>✓ No Wait Time</span>
                <span>✓ Live Agents</span>
                <span>✓ All Airlines</span>
                <span>✓ 24/7 Support</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AirlineCustomerServiceNumber;
