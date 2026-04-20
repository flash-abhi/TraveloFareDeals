import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plane,
  Calendar,
  Clock,
  MapPin,
  User,
  DollarSign,
  Check,
  AlertCircle,
  Download,
  MoreVertical,
  ChevronDown,
  Search,
  Filter,
  FileText,
  ArrowRight,
  CheckCircle2,
  Clock3,
  XCircle,
  Eye,
  Trash2,
  Printer,
  Mail,
  Phone as PhoneIcon,
  Home
} from 'lucide-react';
import './FlightOrders.css';

function FlightOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');

  // Fetch orders - Replace with actual API call
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      // Mock data - Replace with actual API call
      const mockOrders = [
        {
          id: 'TF-2024-001',
          referenceNumber: 'BK8X9K2L',
          bookingDate: '2024-04-10',
          departureDate: '2024-04-20',
          status: 'confirmed',
          totalAmount: 1250,
          passengers: 2,
          outboundFlight: {
            airline: 'American Airlines',
            airlineCode: 'AA',
            flightNumber: 'AA101',
            from: { code: 'JFK', name: 'New York' },
            to: { code: 'LAX', name: 'Los Angeles' },
            departure: '2024-04-20T08:00:00',
            arrival: '2024-04-20T11:30:00',
            duration: '5h 30m',
            price: 625
          },
          returnFlight: {
            airline: 'American Airlines',
            airlineCode: 'AA',
            flightNumber: 'AA202',
            from: { code: 'LAX', name: 'Los Angeles' },
            to: { code: 'JFK', name: 'New York' },
            departure: '2024-04-25T14:00:00',
            arrival: '2024-04-26T06:30:00',
            duration: '5h 30m',
            price: 625
          },
          passengerDetails: [
            { name: 'John Doe', type: 'adult', seatNumber: '12A' },
            { name: 'Jane Doe', type: 'adult', seatNumber: '12B' }
          ],
          contactEmail: 'john.doe@example.com',
          contactPhone: '+1-234-567-8900'
        },
        {
          id: 'TF-2024-002',
          referenceNumber: 'KL5M3P9Q',
          bookingDate: '2024-04-05',
          departureDate: '2024-04-18',
          status: 'completed',
          totalAmount: 890,
          passengers: 1,
          outboundFlight: {
            airline: 'United Airlines',
            airlineCode: 'UA',
            flightNumber: 'UA456',
            from: { code: 'ORD', name: 'Chicago' },
            to: { code: 'DFW', name: 'Dallas' },
            departure: '2024-04-18T09:15:00',
            arrival: '2024-04-18T11:45:00',
            duration: '2h 30m',
            price: 890
          },
          passengerDetails: [
            { name: 'Sarah Smith', type: 'adult', seatNumber: '5C' }
          ],
          contactEmail: 'sarah.smith@example.com',
          contactPhone: '+1-345-678-9001'
        },
        {
          id: 'TF-2024-003',
          referenceNumber: 'RT7S8T9U',
          bookingDate: '2024-03-28',
          departureDate: '2024-04-15',
          status: 'cancelled',
          totalAmount: 1550,
          passengers: 3,
          outboundFlight: {
            airline: 'Delta Airlines',
            airlineCode: 'DL',
            flightNumber: 'DL789',
            from: { code: 'ATL', name: 'Atlanta' },
            to: { code: 'MIA', name: 'Miami' },
            departure: '2024-04-15T10:00:00',
            arrival: '2024-04-15T12:30:00',
            duration: '2h 30m',
            price: 516.67
          },
          passengerDetails: [
            { name: 'Michael Johnson', type: 'adult', seatNumber: '14D' },
            { name: 'Emily Johnson', type: 'child', seatNumber: '14E' },
            { name: 'Lucas Johnson', type: 'infant', seatNumber: 'Infant' }
          ],
          contactEmail: 'michael.johnson@example.com',
          contactPhone: '+1-456-789-0012'
        }
      ];
      
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    };

    loadOrders();
  }, []);

  // Filter and sort orders
  useEffect(() => {
    let filtered = orders;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.outboundFlight.from.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.outboundFlight.to.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.totalAmount - a.totalAmount);
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.totalAmount - b.totalAmount);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, sortBy]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { color: 'blue', icon: CheckCircle2, label: 'Confirmed' },
      completed: { color: 'green', icon: Check, label: 'Completed' },
      cancelled: { color: 'red', icon: XCircle, label: 'Cancelled' },
      pending: { color: 'yellow', icon: Clock3, label: 'Pending' }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const handleViewDetails = (order) => {
    setExpandedOrder(expandedOrder?.id === order.id ? null : order);
  };

  const handleDownloadReceipt = (order) => {
    // Implement download logic
    alert(`Downloading receipt for ${order.referenceNumber}`);
  };

  const handleCancelOrder = (order) => {
    if (window.confirm(`Are you sure you want to cancel order ${order.referenceNumber}?`)) {
      // Implement cancel logic
      alert(`Order ${order.referenceNumber} has been cancelled`);
    }
  };

  if (loading) {
    return (
      <div className="flight-orders-page">
        <div className="orders-header">
          <div className="header-content">
            <h1>My Flight Orders</h1>
            <p>Manage and track your flight bookings</p>
          </div>
        </div>
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flight-orders-page">
      {/* Header */}
      <div className="orders-header">
        <div className="header-content">
          <h1>My Flight Orders</h1>
          <p>Manage and track your flight bookings</p>
        </div>
      </div>

      <div className="container">
        {/* Search and Filter Section */}
        <div className="search-filter-section">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by order ID, reference, or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label>Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="recent">Most Recent</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <Plane size={64} />
            <h2>No orders found</h2>
            <p>
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'You haven\'t booked any flights yet'}
            </p>
            <button
              onClick={() => navigate('/flights')}
              className="btn-primary"
            >
              <Plane size={18} />
              Search Flights
            </button>
          </div>
        ) : (
          <div className="orders-list">
            <div className="orders-summary">
              <p>{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found</p>
            </div>

            {filteredOrders.map((order) => {
              const StatusIcon = getStatusBadge(order.status).icon;
              const isExpanded = expandedOrder?.id === order.id;

              return (
                <div key={order.id} className={`order-card ${order.status}`}>
                  {/* Main Order Card */}
                  <div className="order-card-header">
                    <div className="order-status-badge">
                      <StatusIcon size={18} />
                      <span className={`status-label ${order.status}`}>
                        {getStatusBadge(order.status).label}
                      </span>
                    </div>

                    <div className="order-main-info">
                      <div className="order-id-section">
                        <span className="order-id">{order.id}</span>
                        <span className="order-ref">Ref: {order.referenceNumber}</span>
                      </div>

                      <div className="order-route">
                        <span className="airport-code">{order.outboundFlight.from.code}</span>
                        <ArrowRight size={16} className="route-arrow" />
                        <span className="airport-code">{order.outboundFlight.to.code}</span>
                      </div>

                      <div className="order-date-info">
                        <Calendar size={14} />
                        <span>{formatDate(order.departureDate)}</span>
                      </div>
                    </div>

                    <div className="order-price-section">
                      <div className="price-display">
                        <span className="price-label">Total</span>
                        <span className="price-amount">${order.totalAmount}</span>
                      </div>
                      <span className="passengers-count">
                        <User size={14} />
                        {order.passengers} {order.passengers === 1 ? 'Passenger' : 'Passengers'}
                      </span>
                    </div>

                    <button
                      className="expand-toggle"
                      onClick={() => handleViewDetails(order)}
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      <ChevronDown size={20} className={isExpanded ? 'open' : ''} />
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="order-card-details">
                      {/* Flight Details */}
                      <div className="details-section">
                        <h4>Outbound Flight</h4>
                        <div className="flight-details">
                          <div className="flight-info">
                            <p className="airline-name">{order.outboundFlight.airline}</p>
                            <p className="flight-number">{order.outboundFlight.flightNumber}</p>
                          </div>

                          <div className="flight-times">
                            <div className="time-group">
                              <span className="time">{formatTime(order.outboundFlight.departure)}</span>
                              <span className="airport">{order.outboundFlight.from.code}</span>
                            </div>
                            <div className="duration">
                              <Clock size={14} />
                              <span>{order.outboundFlight.duration}</span>
                            </div>
                            <div className="time-group">
                              <span className="time">{formatTime(order.outboundFlight.arrival)}</span>
                              <span className="airport">{order.outboundFlight.to.code}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Return Flight */}
                      {order.returnFlight && (
                        <div className="details-section">
                          <h4>Return Flight</h4>
                          <div className="flight-details">
                            <div className="flight-info">
                              <p className="airline-name">{order.returnFlight.airline}</p>
                              <p className="flight-number">{order.returnFlight.flightNumber}</p>
                            </div>

                            <div className="flight-times">
                              <div className="time-group">
                                <span className="time">{formatTime(order.returnFlight.departure)}</span>
                                <span className="airport">{order.returnFlight.from.code}</span>
                              </div>
                              <div className="duration">
                                <Clock size={14} />
                                <span>{order.returnFlight.duration}</span>
                              </div>
                              <div className="time-group">
                                <span className="time">{formatTime(order.returnFlight.arrival)}</span>
                                <span className="airport">{order.returnFlight.to.code}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Passengers */}
                      <div className="details-section">
                        <h4>Passengers</h4>
                        <div className="passengers-list">
                          {order.passengerDetails.map((passenger, idx) => (
                            <div key={idx} className="passenger-item">
                              <User size={16} />
                              <div>
                                <p className="passenger-name">{passenger.name}</p>
                                <p className="passenger-meta">
                                  {passenger.type.charAt(0).toUpperCase() + passenger.type.slice(1)}
                                  {passenger.seatNumber && passenger.seatNumber !== 'Infant' && (
                                    <> • Seat {passenger.seatNumber}</>
                                  )}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="details-section">
                        <h4>Contact Information</h4>
                        <div className="contact-info">
                          <div className="contact-item">
                            <Mail size={16} />
                            <span>{order.contactEmail}</span>
                          </div>
                          <div className="contact-item">
                            <PhoneIcon size={16} />
                            <span>{order.contactPhone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="details-section">
                        <h4>Booking Details</h4>
                        <div className="booking-details-grid">
                          <div className="detail-item">
                            <span className="detail-label">Booking Date</span>
                            <span className="detail-value">{formatDate(order.bookingDate)}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Departure Date</span>
                            <span className="detail-value">{formatDate(order.departureDate)}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Total Amount</span>
                            <span className="detail-value price">${order.totalAmount}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="order-actions">
                        <button
                          className="action-btn download"
                          onClick={() => handleDownloadReceipt(order)}
                        >
                          <Download size={18} />
                          <span>Download Receipt</span>
                        </button>
                        <button className="action-btn print">
                          <Printer size={18} />
                          <span>Print</span>
                        </button>
                        {order.status === 'confirmed' && (
                          <button
                            className="action-btn cancel"
                            onClick={() => handleCancelOrder(order)}
                          >
                            <XCircle size={18} />
                            <span>Cancel Flight</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Help Section */}
        <div className="help-section">
          <h3>Need Help?</h3>
          <p>If you have any questions about your bookings, please contact our support team</p>
          <button className="btn-secondary">
            <PhoneIcon size={18} />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}

export default FlightOrders;
