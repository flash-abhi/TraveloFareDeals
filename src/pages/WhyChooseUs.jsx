import React from "react";
import { ShieldCheck, DollarSign, Headphones, Globe, Clock, ThumbsUp } from "lucide-react";
import "./WhyChooseUs.css";

function WhyChooseUs() {
  const features = [
    {
      icon: <DollarSign size={40} />,
      title: "Best Price Guarantee",
      desc: "We offer unbeatable prices on flights, hotels, and packages with no hidden charges."
    },
    {
      icon: <ShieldCheck size={40} />,
      title: "Secure Booking",
      desc: "Your data and payments are protected with advanced encryption and security systems."
    },
    {
      icon: <Headphones size={40} />,
      title: "24/7 Support",
      desc: "Our travel experts are available anytime to assist you before and during your trip."
    },
    {
      icon: <Globe size={40} />,
      title: "Global Coverage",
      desc: "Access to 500+ destinations worldwide with exclusive travel deals."
    },
    {
      icon: <Clock size={40} />,
      title: "Fast & Easy Booking",
      desc: "Book your trips in minutes with our smooth and user-friendly platform."
    },
    {
      icon: <ThumbsUp size={40} />,
      title: "Trusted by Millions",
      desc: "Join millions of happy travelers who trust Travelofare for their journeys."
    }
  ];

  return (
    <div className="why-page">
      {/* HERO */}
      <div className="why-hero">
        <div className="container">
          <h1>Why Choose Travelofare</h1>
          <p>Your smart choice for affordable and hassle-free travel</p>
        </div>
      </div>

      <div className="container">
        {/* FEATURES */}
        <section className="why-section">
          <div className="why-grid">
            {features.map((item, index) => (
              <div className="why-card" key={index}>
                <div className="icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="why-cta">
          <h2>Ready to Explore the World?</h2>
          <p>Book your next trip with Travelofare and save big today.</p>
          <button>Start Booking</button>
        </section>
      </div>
    </div>
  );
}

export default WhyChooseUs;