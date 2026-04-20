import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import AirportAutocomplete from './AirportAutocomplete';
import './SearchWidget.css';

function SearchWidget() {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("roundtrip");
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    passengers: { adults: 1, children: 0, infants: 0 },
    cabinClass: "economy",
  });
  const [showPassengers, setShowPassengers] = useState(false);

  const handleSearch = () => {
    if (!searchData.from || !searchData.to) {
      alert("Please select departure and destination cities");
      return;
    }
    if (!searchData.departDate) {
      alert("Please select departure date");
      return;
    }
    if (tripType === "roundtrip" && !searchData.returnDate) {
      alert("Please select return date");
      return;
    }
    navigate("/flight-results", {
      state: {
        searchParams: {
          from: searchData.from,
          to: searchData.to,
          departDate: searchData.departDate,
          returnDate: searchData.returnDate,
          tripType,
          passengers: searchData.passengers,
          cabinClass: searchData.cabinClass,
        },
      },
    });
  };

  const updatePassengers = (type, value) => {
    setSearchData((prev) => ({
      ...prev,
      passengers: { ...prev.passengers, [type]: Math.max(0, value) },
    }));
  };

  const totalTravelers =
    searchData.passengers.adults +
    searchData.passengers.children +
    searchData.passengers.infants;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="search-widget-container">
      <div className="search-widget-header">
        <div className="trip-type-selector">
          <button
            className={`trip-btn ${tripType === "oneway" ? "active" : ""}`}
            onClick={() => setTripType("oneway")}
          >
            One Way
          </button>
          <button
            className={`trip-btn ${tripType === "roundtrip" ? "active" : ""}`}
            onClick={() => setTripType("roundtrip")}
          >
            Round Trip
          </button>
        </div>
        <div className="hassle-free-badge">
          👍 <span>Hassle-Free Bookings</span>
        </div>
      </div>

      <div className="search-widget-body">
        <div className="search-fields-wrapper">
          {/* From Field */}
          <div className="search-field-group">
            <label className="field-label">From</label>
            <AirportAutocomplete
              value={searchData.from}
              onChange={(value) =>
                setSearchData({ ...searchData, from: value })
              }
              placeholder="Select city"
              className="search-input"
            />
          </div>

          {/* To Field */}
          <div className="search-field-group">
            <label className="field-label">To</label>
            <AirportAutocomplete
              value={searchData.to}
              onChange={(value) =>
                setSearchData({ ...searchData, to: value })
              }
              placeholder="Select city"
              className="search-input"
            />
          </div>

          {/* Departure Date */}
          <div className="search-field-group">
            <label className="field-label">Departure</label>
            <input
              type="date"
              value={searchData.departDate}
              onChange={(e) =>
                setSearchData({
                  ...searchData,
                  departDate: e.target.value,
                })
              }
              min={new Date().toISOString().split("T")[0]}
              className="search-input date-input"
            />
            {searchData.departDate && (
              <span className="date-display">{formatDate(searchData.departDate)}</span>
            )}
          </div>

          {/* Return Date */}
          {tripType === "roundtrip" && (
            <div className="search-field-group">
              <label className="field-label">Return</label>
              <input
                type="date"
                value={searchData.returnDate}
                onChange={(e) =>
                  setSearchData({
                    ...searchData,
                    returnDate: e.target.value,
                  })
                }
                min={
                  searchData.departDate ||
                  new Date().toISOString().split("T")[0]
                }
                className="search-input date-input"
              />
              {searchData.returnDate && (
                <span className="date-display">{formatDate(searchData.returnDate)}</span>
              )}
            </div>
          )}

          {/* Travelers & Class */}
          <div className="search-field-group travelers-dropdown-wrapper">
            <label className="field-label">Travellers & Class</label>
            <div
              className="travelers-trigger"
              onClick={() => setShowPassengers(!showPassengers)}
            >
              <span className="travelers-text">
                {totalTravelers} Traveller{totalTravelers > 1 ? "s" : ""}, {searchData.cabinClass}
              </span>
            </div>
            {showPassengers && (
              <div className="travelers-dropdown-modal">
                <div className="travelers-dropdown-content">
                  {[
                    { label: "Adults", key: "adults", sub: "12+ years" },
                    { label: "Children", key: "children", sub: "2-11 years" },
                    { label: "Infants", key: "infants", sub: "Under 2" },
                  ].map((p) => (
                    <div key={p.key} className="traveler-row">
                      <div>
                        <span className="traveler-label">{p.label}</span>
                        <span className="traveler-sub">{p.sub}</span>
                      </div>
                      <div className="counter">
                        <button
                          onClick={() =>
                            updatePassengers(
                              p.key,
                              searchData.passengers[p.key] - 1
                            )
                          }
                          className="counter-btn"
                        >
                          −
                        </button>
                        <span className="counter-value">
                          {searchData.passengers[p.key]}
                        </span>
                        <button
                          onClick={() =>
                            updatePassengers(
                              p.key,
                              searchData.passengers[p.key] + 1
                            )
                          }
                          className="counter-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="cabin-class-selector">
                    <label>Cabin Class</label>
                    <select
                      value={searchData.cabinClass}
                      onChange={(e) =>
                        setSearchData({
                          ...searchData,
                          cabinClass: e.target.value,
                        })
                      }
                      className="cabin-select"
                    >
                      <option value="economy">Economy</option>
                      <option value="premium_economy">Premium Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First Class</option>
                    </select>
                  </div>

                  <button
                    className="done-btn"
                    onClick={() => setShowPassengers(false)}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            className="search-button"
            onClick={handleSearch}
          >
            Search <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchWidget;
