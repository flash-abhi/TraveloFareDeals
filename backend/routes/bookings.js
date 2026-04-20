const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const bookingEmailService = require('../services/bookingEmailService');

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const { userId, bookingType, status } = req.query;
    
    let query = {};
    if (userId) query.user = userId;
    if (bookingType) query.bookingType = bookingType;
    if (status) query.bookingStatus = status;
    
    const bookings = await Booking.find(query)
      .populate('user', 'firstName lastName email')
      .populate('flight')
      .populate('hotel')
      .populate('package')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('flight')
      .populate('hotel')
      .populate('package');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
});

// Get booking by reference
router.get('/reference/:ref', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingReference: req.params.ref })
      .populate('user', 'firstName lastName email phone')
      .populate('flight')
      .populate('hotel')
      .populate('package');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
});

// Generate unique booking reference
function generateBookingReference() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'FLT-';
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

// Create new booking
router.post('/', async (req, res) => {
  try {
    const { flight, outboundFlight, returnFlight, passengers, contact, payment, selectedSeats, totalPrice, searchParams, bookingType } = req.body;

    // Validate required fields - either flight (one-way) or outboundFlight (roundtrip)
    if ((!flight && !outboundFlight) || !passengers || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking information'
      });
    }

    // Calculate final amount
    const taxesAndFees = totalPrice * 0.15;
    const seatCharges = (selectedSeats?.length || 0) * 15;
    const finalAmount = totalPrice + taxesAndFees + seatCharges;

    // Generate booking reference
    const bookingReference = generateBookingReference();

    // Create booking object properly mapped to schema
    const bookingData = {
      bookingType: bookingType || 'flight',
      bookingReference,
      passengers: {
        adults: passengers.filter(p => p.type === 'adult').length || 1,
        children: passengers.filter(p => p.type === 'child').length || 0,
        infants: passengers.filter(p => p.type === 'infant').length || 0
      },
      passengerDetails: passengers.map(p => ({
        firstName: p.firstName,
        lastName: p.lastName,
        dateOfBirth: p.dob,
        passportNumber: p.passport,
        type: p.type || 'adult'
      })),
      contactInfo: {
        email: contact.email,
        phone: contact.phone
      },
      totalPrice: finalAmount,
      bookingStatus: 'confirmed',
      paymentStatus: 'completed',
      // Store flight details as embedded document if flight is not a MongoDB ObjectId
      flightDetails: flight || outboundFlight,
      returnFlightDetails: returnFlight,
      selectedSeats,
      searchParams
    };

    // Try to save with Mongoose model
    try {
      const booking = new Booking(bookingData);
      await booking.save();
      
      // Prepare response data with reference number for email
      const responseData = {
        ...bookingData,
        referenceNumber: booking.bookingReference,
        _id: booking._id
      };
      
      // Send confirmation email
      bookingEmailService.sendBookingConfirmation(responseData)
        .then(result => {
          if (result.sent) {
            console.log(`✅ Booking confirmation email sent for ${booking.bookingReference}`);
          } else {
            console.log(`⚠️ Could not send confirmation email: ${result.reason || result.error}`);
          }
        })
        .catch(err => console.error('Email error:', err));
      
      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: responseData
      });
    } catch (modelError) {
      console.error('Booking save error:', modelError);
      res.status(400).json({
        success: false,
        message: 'Error saving booking',
        error: modelError.message
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
});

// Update booking
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
});

// Cancel booking
router.put('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { bookingStatus: 'cancelled' },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
});

// Resend booking confirmation email
router.post('/:id/resend-email', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Prepare email data from booking - map all field name variations
    const emailData = {
      referenceNumber: booking.bookingReference,
      contactInfo: booking.contactInfo,
      contact: booking.contact,
      passengers: booking.passengerDetails || booking.passengers || [],
      outboundFlight: booking.outboundFlight || booking.flightDetails,
      returnFlight: booking.returnFlightDetails,
      totalPrice: booking.totalPrice || booking.pricing?.totalPrice,
      finalAmount: booking.pricing?.totalPrice || booking.totalPrice,
      selectedSeats: booking.seatSelections || booking.selectedSeats || [],
      searchParams: {
        date: booking.searchParams?.departDate || booking.flightDetails?.departure?.date,
        returnDate: booking.searchParams?.returnDate || booking.returnFlightDetails?.departure?.date
      },
      taxesAndFees: booking.pricing?.taxesAndFees || 0,
      bookingDate: booking.createdAt
    };

    const result = await bookingEmailService.sendBookingConfirmation(emailData);

    if (result.sent) {
      res.json({
        success: true,
        message: 'Confirmation email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to send email',
        reason: result.reason || result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending email',
      error: error.message
    });
  }
});

module.exports = router;
