import React from 'react';
import { PhoneCall } from 'lucide-react';
import { useContact } from '../context/ContactContext';
import './StickyCallButton.css';

function StickyCallButton() {
  const { contactSettings } = useContact();

  return (
    <a 
      href={`tel:${(contactSettings.tfn || '+1-888-859-0441').replace(/[^0-9+]/g, '')}`} 
      className="sticky-call-button"
      aria-label="Call to book"
       onclick="return gtag_report_call_conversion('tel:+18008899279');"
    >
      <div className="call-pulse"></div>
      <PhoneCall size={22} />
      <span className="call-text">
        <span className="call-label">Call to Book</span>
        <span className="call-number">{contactSettings.tfn || '+1-888-859-0441'}</span>
      </span>
    </a>
  );
}

export default StickyCallButton;
