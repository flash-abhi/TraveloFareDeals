import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import io from 'socket.io-client';
import { SOCKET_URL } from './config/api';
import { ContactProvider } from './context/ContactContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import FloatingCallBanner from "./components/FloatingCallBanner";
import StickyCallButton from './components/StickyCallButton';
import HomeNew from './pages/HomeNew';
import Flights from './pages/Flights';
import Booking from './pages/Booking';
import FlightOrder from './pages/FlightOrder';
import FlightOrders from "./pages/FlightOrders";
import FlightResults from "./pages/FlightResults";
import BookingConfirmation from "./pages/BookingConfirmation";
import Hotels from "./pages/Hotels";
import HotelResults from "./pages/HotelResults";
import HotelDetails from "./pages/HotelDetails";
import AirlinesDirectory from "./pages/AirlinesDirectory";
import AirlinePage from "./pages/AirlinePage";
import AirlineSupport from "./pages/AirlineSupport";
import AirlineCustomerServiceNumber from "./pages/AirlineCustomerServiceNumber";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import BlogPost from "./pages/BlogPost";
import Blog from "./pages/Blog";
// import AirlineLogos from './components/AirlineLogos';
import "./App.css";
import AirlinesNew from './pages/AirlinesNew';
import AirlinePageNew from './pages/AirlinePageNew';
import WhyChooseUs from './pages/WhyChooseUs';

let socket = null;

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    // Connect to WebSocket for visitor tracking (only for non-admin pages)
    if (!isAdminRoute && !socket) {
      socket = io(SOCKET_URL);
      console.log("🔌 Connected to visitor tracking");
    }

    // Track page view
    if (!isAdminRoute && socket) {
      socket.emit("pageView", { page: location.pathname });
    }

    // Cleanup on unmount (app close)
    return () => {
      if (socket && isAdminRoute) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [location.pathname, isAdminRoute]);

  return (
    <div className="App">
      <Helmet>
        <title>
          TraveloFare - Cheap Flights & Travel Deals | #1 Travel Platform
        </title>
        <link rel="icon" href="/favicon.png" type="image/*" />
      </Helmet>
      <ScrollToTop />
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<HomeNew />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/flight-results" element={<FlightResults />} />
        <Route path="/flight-order" element={<FlightOrder />} />
        <Route path="/flight-orders" element={<FlightOrders />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotel-results" element={<HotelResults />} />
        <Route path="/hotel-details" element={<HotelDetails />} />
        <Route path="/airlines" element={<AirlinesNew />} />
        <Route path="/airlines/:airlineSlug" element={<AirlinePageNew  />} />
        <Route path="/airline-customer-service" element={<AirlineSupport />} />
        <Route
          path="/airline-customer-service-number"
          element={<AirlineCustomerServiceNumber />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path='why-choose-us' element={<WhyChooseUs />} />
      </Routes>
      {!isAdminRoute && <StickyCallButton />}
      {!isAdminRoute && <FloatingCallBanner />}
      {/* {!isAdminRoute && <AirlineLogos />} */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ContactProvider>
        <AppContent />
      </ContactProvider>
    </Router>
  );
}

export default App;


// linear-gradient(135deg, #4169e1 0%, #9a2121 100%);