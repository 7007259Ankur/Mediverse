import React, { useState } from 'react';
import { FaShoppingCart, FaTimes, FaPlus, FaMinus, FaTrash, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import './Cart.css';

const Cart = ({ cartItems, setCartItems, isCartOpen, setIsCartOpen }) => {
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'address', 'payment', 'confirmation'
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

  // Cart functions
  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Calculation functions
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const calculateDiscount = () => {
    return (calculateSubtotal() * 0.1).toFixed(2);
  };

  const calculateTotal = () => {
    return (calculateSubtotal() - calculateDiscount()).toFixed(2);
  };

  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = () => {
    setCheckoutStep('address');
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setCheckoutStep('payment');
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setCheckoutStep('confirmation');
    // In a real app, you would process payment here
    console.log('Order submitted:', { ...formData, cartItems, total: calculateTotal() });
  };

  const completeOrder = () => {
    setCartItems([]);
    setIsCartOpen(false);
    setCheckoutStep('cart');
  };

  // Render functions for different steps
  const renderCart = () => (
    <>
      <div className="cart-header">
        <h2>My Cart ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</h2>
        <button className="close-cart" onClick={() => setIsCartOpen(false)}>
          <FaTimes />
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <FaShoppingCart />
          </div>
          <h3>Your cart is empty!</h3>
          <p>Looks like you haven't added anything to your cart yet</p>
          <button 
            className="continue-shopping-btn"
            onClick={() => setIsCartOpen(false)}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items-container">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image-container">
                  <img src={item.image} alt={item.name} className="item-image" />
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-price">${item.price.toFixed(2)}</div>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => decreaseQuantity(item.id)}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <button 
                  className="remove-item-btn"
                  onClick={() => removeItem(item.id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="price-details">
              <h3>Price Details</h3>
              <div className="price-row">
                <span>Price ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
                <span>${calculateSubtotal()}</span>
              </div>
              <div className="price-row">
                <span>Discount</span>
                <span className="discount">-${calculateDiscount()}</span>
              </div>
              <div className="price-row">
                <span>Delivery Charges</span>
                <span className="delivery-charge">FREE</span>
              </div>
              <div className="total-amount">
                <span>Total Amount</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>

            <div className="secured-payment">
              <img 
                src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/shield_b33c0c.svg" 
                alt="Secured Payment" 
              />
              <span>Safe and Secure Payments. Easy returns.</span>
            </div>
          </div>
        </>
      )}
    </>
  );

  const renderAddressForm = () => (
    <div className="checkout-step">
      <div className="step-header">
        <button className="back-button" onClick={() => setCheckoutStep('cart')}>
          <FaArrowLeft />
        </button>
        <h2>Delivery Address</h2>
      </div>
      
      <form onSubmit={handleAddressSubmit} className="address-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
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
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
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
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="continue-btn">
          Continue to Payment
        </button>
      </form>
    </div>
  );

  const renderPayment = () => (
    <div className="checkout-step">
      <div className="step-header">
        <button className="back-button" onClick={() => setCheckoutStep('address')}>
          <FaArrowLeft />
        </button>
        <h2>Payment Method</h2>
      </div>

      <form onSubmit={handlePaymentSubmit} className="payment-form">
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
          <div className="payment-details">
            <div className="form-group">
              <label>UPI ID</label>
              <input
                type="text"
                name="upiId"
                value={formData.upiId}
                onChange={handleInputChange}
                placeholder="yourname@upi"
                required
              />
            </div>
            <div className="upi-apps">
              <p>Pay using any UPI app:</p>
              <div className="apps-grid">
                {['Google Pay', 'Paytm', 'PhonePe', 'BHIM'].map(app => (
                  <div key={app} className="app-icon">
                    <img 
                      src={`https://logo.clearbit.com/${app.toLowerCase().replace(' ', '')}.com`} 
                      alt={app} 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/50';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="payment-details">
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
            <span>${calculateSubtotal()}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>FREE</span>
          </div>
          <div className="summary-total">
            <span>Total Amount</span>
            <span>${calculateTotal()}</span>
          </div>
        </div>

        <button type="submit" className="place-order-btn">
          Place Order
        </button>
      </form>
    </div>
  );

  const renderConfirmation = () => (
    <div className="confirmation-step">
      <div className="confirmation-content">
        <FaCheckCircle className="success-icon" />
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your purchase. Your order has been confirmed.</p>
        <div className="order-details">
          <h4>Order Summary</h4>
          <div className="detail-row">
            <span>Order ID:</span>
            <span>{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
          </div>
          <div className="detail-row">
            <span>Total Amount:</span>
            <span>${calculateTotal()}</span>
          </div>
          <div className="detail-row">
            <span>Payment Method:</span>
            <span>
              {paymentMethod === 'upi' ? 'UPI' : 
               paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
            </span>
          </div>
        </div>
        <button className="continue-btn" onClick={completeOrder}>
          Continue Shopping
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button 
        className="cart-icon-btn" 
        onClick={() => {
          setIsCartOpen(!isCartOpen);
          setCheckoutStep('cart');
        }}
      >
        <FaShoppingCart className="cart-icon" />
        {cartItems.length > 0 && (
          <span className="cart-count">
            {cartItems.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </button>

      {isCartOpen && (
        <div className="cart-overlay">
          <div className="cart-container">
            {checkoutStep === 'cart' && renderCart()}
            {checkoutStep === 'address' && renderAddressForm()}
            {checkoutStep === 'payment' && renderPayment()}
            {checkoutStep === 'confirmation' && renderConfirmation()}
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;