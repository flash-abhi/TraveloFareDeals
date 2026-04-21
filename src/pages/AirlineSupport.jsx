import React from "react";
import { Helmet } from "react-helmet";
import { useContact } from '../context/ContactContext';

const AirlineSupport = () => {
  const { contactSettings } = useContact();
  const tfn = contactSettings.tfn || "+1-888-859-0441";
  const tfnClean = tfn.replace(/[^0-9+]/g, '');
  return (
    <>
      <Helmet>
        <title>Airline Customer Service | Call {tfn}</title>
        <meta
          name="description"
          content={`Get reliable general airline assistance, flight information, and travel support. Call our helpline at ${tfn} for quick help.`}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "TraveloFare Support",
            url: "https://travelofaredeals.com/",
            contactPoint: [
              {
                "@type": "ContactPoint",
                telephone: tfn,
                contactType: "customer support",
                availableLanguage: ["English"],
              },
            ],
          })}
        </script>
      </Helmet>

      <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
        <h1>Airline Customer Service & General Travel Assistance</h1>
        <p>
          For quick, reliable airline-related assistance, call our general
          support helpline at <strong>{tfn}</strong>. We provide helpful
          guidance for travelers looking for flight information, booking
          support, travel updates, and general airline-related queries.
        </p>

        <a
          href={`tel:${tfnClean}`}
          style={{
            display: "inline-block",
            background: "#0078ff",
            color: "#fff",
            padding: "14px 22px",
            borderRadius: "6px",
            marginTop: "20px",
            textDecoration: "none",
            fontSize: "18px",
          }}
        >
          📞 Call Now: {tfn}
        </a>

        <h2 style={{ marginTop: "40px" }}>What We Help With</h2>
        <ul>
          <li>General airline information & travel assistance</li>
          <li>Flight timing queries (arrival/departure basics)</li>
          <li>Reservation guidance and booking support</li>
          <li>Fare details & travel planning information</li>
          <li>Guidance on changes, cancellations, and updates</li>
        </ul>

        <h2 style={{ marginTop: "40px" }}>Why Travelers Call {tfn}</h2>
        <p>
          Travelers often need quick assistance when searching for airline
          customer service numbers or flight support. Instead of navigating
          multiple websites, our helpline offers quick and convenient general
          travel assistance.
        </p>

        <h2 style={{ marginTop: "40px" }}>We Are Not an Airline</h2>
        <p>
          We provide <strong>general travel assistance only</strong>. We do not
          claim to be an official support line for any specific airline. Our
          team provides independent guidance to help travelers understand
          options and make informed decisions.
        </p>

        <h2 style={{ marginTop: "40px" }}>Common Searches We Help With</h2>
        <ul>
          <li>airline customer service number</li>
          <li>airline phone number</li>
          <li>airline contact support</li>
          <li>general flight assistance</li>
          <li>travel support helpline</li>
        </ul>

        <h2 style={{ marginTop: "40px" }}>Call Airline Assistance Helpline</h2>
        <p>
          If you need quick general airline information or travel support, our
          dedicated help team is available. Call <strong>{tfn}</strong> for
          immediate assistance.
        </p>

        <a
          href={`tel:${tfnClean}`}
          style={{
            display: "inline-block",
            background: "#0078ff",
            color: "#fff",
            padding: "14px 22px",
            borderRadius: "6px",
            marginTop: "20px",
            textDecoration: "none",
            fontSize: "18px",
          }}
        >
          📞 Call {tfn}
        </a>
      </div>
    </>
  );
};

export default AirlineSupport;
