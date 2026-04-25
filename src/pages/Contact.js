import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { useContact } from '../context/ContactContext';
import './Contact.css';

function Contact() {
  const { contactSettings } = useContact();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We're here to help you plan your perfect trip</p>
        </div>
      </div>

      <div className="container">
        <div className="contact-content">
          <div className="contact-info-section">
            <h2>Get in Touch</h2>
            <p className="contact-intro">
              Have questions? Need assistance with your booking? Our dedicated team is available 24/7 
              to help you with all your travel needs.
            </p>

            <div className="contact-cards">
              <div className="contact-card">
                <div className="card-icon">
                  <Phone size={32} />
                </div>
                <h3>Call Us</h3>
                <p className="card-description">Speak with our travel experts</p>
                <a href={`tel:${contactSettings.tfn.replace(/[^0-9+]/g, '')}`}  onclick="return gtag_report_call_conversion('tel:+18008899279');" className="contact-link-main">
                  {contactSettings.tfn}
                </a>
                <p className="card-availability">{contactSettings.workingHours || 'Available 24/7'}</p>
              </div>

              <div className="contact-card">
                <div className="card-icon">
                  <Mail size={32} />
                </div>
                <h3>Email Us</h3>
                <p className="card-description">Send us your questions</p>
                <a href={`mailto:${contactSettings.email}`}  onclick="return gtag_report_call_conversion('tel:+18008899279');" className="contact-link-main">
                  {contactSettings.email}
                </a>
                <p className="card-availability">Response within 2-4 hours</p>
              </div>

              <div className="contact-card">
                <div className="card-icon">
                  <MapPin size={32} />
                </div>
                <h3>Visit Us</h3>
                <p className="card-description">Our office location</p>
                <address className="contact-address">
                  C 177(A) IND AREA
                  SECTOR 74,<br />
                  
                  Mohali, Punjab 160074, India<br />
        
                </address>
              </div>

              <div className="contact-card">
                <div className="card-icon">
                  <Clock size={32} />
                </div>
                <h3>Business Hours</h3>
                <p className="card-description">We're always available</p>
                <p className="contact-link-main">24/7/365</p>
                <p className="card-availability">Even on holidays!</p>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <div className="form-header">
              <MessageCircle size={40} />
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we'll respond as soon as possible</p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="booking">Booking Assistance</option>
                    <option value="cancellation">Cancellation/Refund</option>
                    <option value="change">Change Booking</option>
                    <option value="payment">Payment Issue</option>
                    <option value="complaint">Complaint</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership Opportunity</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button type="submit" className="submit-button">
                <Send size={20} />
                Send Message
              </button>
            </form>
          </div>

          

          <div className="emergency-contact">
            <h3>Need Immediate Assistance?</h3>
            <p>If you're experiencing a travel emergency or need urgent help, please call us immediately:</p>
            <a  onclick="return gtag_report_call_conversion('tel:+18008899279');" href={`tel:${contactSettings.tfn.replace(/[^0-9+]/g, '')}`} className="emergency-button">
              <Phone size={24} />
              Call {contactSettings.tfn} Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
