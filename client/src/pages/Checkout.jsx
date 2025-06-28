import React, { useState } from 'react';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import './Checkout.css';

const Checkout = ({ cartItems, totalAmount, onBackToCart, onOrderSuccess }) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    upiId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // In a real app, you would process payment here
      console.log('Order submitted:', { ...formData, cartItems, totalAmount });
      onOrderSuccess();
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        {step > 1 && (
          <button className="back-button" onClick={() => setStep(step - 1)}>
            <FaArrowLeft /> Back
          </button>
        )}
        <h2>Checkout ({step}/2)</h2>
      </div>

      {step === 1 ? (
        <div className="address-form">
          <h3>Delivery Address</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="continue-btn">
              Continue to Payment
            </button>
          </form>
        </div>
      ) : (
        <div className="payment-section">
          <h3>Payment Method</h3>
          <div className="payment-methods">
            <div 
              className={`payment-option ${paymentMethod === 'upi' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('upi')}
            >
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'upi'} 
                onChange={() => {}} 
              />
              <label>UPI Payment</label>
            </div>
            <div 
              className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'card'} 
                onChange={() => {}} 
              />
              <label>Credit/Debit Card</label>
            </div>
            <div 
              className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('cod')}
            >
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'cod'} 
                onChange={() => {}} 
              />
              <label>Cash on Delivery</label>
            </div>
          </div>

          {paymentMethod === 'upi' && (
            <div className="upi-details">
              <div className="form-group">
                <label>UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="yourname@upi"
                  required
                />
              </div>
              <div className="upi-apps">
                <p>Pay using any UPI app:</p>
                <div className="apps-grid">
                  <div className="app-icon">
                    <img src="https://logos-download.com/wp-content/uploads/2021/01/Google_Pay_Logo.png" alt="Google Pay" />
                  </div>
                  <div className="app-icon">
                    <img src="https://logos-download.com/wp-content/uploads/2020/06/Paytm_Logo.png" alt="Paytm" />
                  </div>
                  <div className="app-icon">
                    <img src="https://logos-download.com/wp-content/uploads/2020/06/PhonePe_Logo.png" alt="PhonePe" />
                  </div>
                  <div className="app-icon">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/73/BHIM_Logo.png" alt="BHIM" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="card-details">
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Card Holder Name</label>
                <input
                  type="text"
                  placeholder="Name on card"
                  required
                />
              </div>
            </div>
          )}

          {paymentMethod === 'cod' && (
            <div className="cod-message">
              <p>Pay cash when your order is delivered.</p>
              <p className="note">Note: ₹50 extra charge for COD orders.</p>
            </div>
          )}

          <div className="order-summary">
            <h4>Order Summary</h4>
            <div className="summary-row">
              <span>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>FREE</span>
            </div>
            <div className="summary-total">
              <span>Total Amount</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <button 
            type="button" 
            className="place-order-btn"
            onClick={handleSubmit}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;