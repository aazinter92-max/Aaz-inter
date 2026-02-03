import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/products';
import { isValidEmail, isValidPhone } from '../utils/helpers';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { CreditCard, Banknote, Package, ShieldCheck, AlertCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import './Checkout.css';

const CheckoutContent = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [stripeError, setStripeError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isSuccess && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate, isSuccess]);

  if (cartItems.length === 0) {
    return null;
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';

    // No additional validation needed for COD or Bank Transfer
    // Payment proof will be uploaded after order creation

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setStripeError(null);

    try {
      // 1. Create Order first
      const orderData = {
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        paymentMethod,
        totalAmount: getCartTotal(),
        products: cartItems.map(item => ({
          product: item._id || item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const orderResponse = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user && user.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify(orderData)
      });

      const orderResult = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderResult.message || 'Failed to place order');
      }

      const orderId = orderResult._id;

      // 2. If Card Payment, handle Stripe
      if (paymentMethod === 'card') {
        if (!stripe || !elements) {
          throw new Error('Stripe is not initialized. Please try again.');
        }

        // a. Create Payment Intent
        const intentResponse = await fetch('http://localhost:5000/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId })
        });
        const { clientSecret, message: intentMsg } = await intentResponse.json();

        if (!clientSecret) {
          throw new Error(intentMsg || 'Failed to initialize payment');
        }

        // b. Confirm Card Payment
        const paymentResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            },
          },
        });

        if (paymentResult.error) {
          throw new Error(paymentResult.error.message);
        }

        // c. Confirm on backend
        await fetch('http://localhost:5000/api/stripe/confirm-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId: paymentResult.paymentIntent.id })
        });
      }

      // 3. Success - Redirect to Confirmation
      setIsSuccess(true);
      clearCart();
      
      const confirmationState = { 
        orderId,
        orderNumber: orderResult.orderNumber,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city
        },
        items: cartItems,
        total: getCartTotal(),
        paymentMethod,
        paymentStatus: paymentMethod === 'card' ? 'PAID' : 'PENDING',
        date: new Date().toISOString()
      };

      localStorage.setItem('lastOrder', JSON.stringify(confirmationState));
      navigate('/order-confirmation', { state: confirmationState });

    } catch (error) {
      console.error('Checkout error:', error);
      setStripeError(error.message);
      alert(error.message || 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-layout">
          {/* Checkout Form */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form" autoComplete="on">
              {/* Customer Information */}
              <Card className="form-section" padding="large">
                <h2 className="form-section-title">Customer Information</h2>
                <div className="form-grid">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    error={errors.name}
                    autoComplete="name"
                  />
                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+92 300 1234567"
                    required
                    error={errors.phone}
                    autoComplete="tel"
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                    error={errors.email}
                    className="form-grid-full"
                    autoComplete="email"
                  />
                  <Input
                    label="Delivery Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street address, building, floor"
                    required
                    error={errors.address}
                    className="form-grid-full"
                    autoComplete="street-address"
                  />
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g., Karachi, Lahore"
                    required
                    error={errors.city}
                    autoComplete="address-level2"
                  />
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="form-section" padding="large">
                <h2 className="form-section-title">Payment Method</h2>
                <div className="payment-methods">
                  <label className={`payment-option ${paymentMethod === 'cod' ? 'payment-option-active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <Banknote size={24} />
                    <span>Cash on Delivery</span>
                  </label>
                  <label className={`payment-option ${paymentMethod === 'card' ? 'payment-option-active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <CreditCard size={24} />
                    <div className="payment-option-content">
                      <span>Credit / Debit Card</span>
                      <div className="accepted-cards">
                        <div className="card-logo visa">VISA</div>
                        <div className="card-logo mastercard">MC</div>
                        <div className="card-logo unionpay">UP</div>
                        <div className="card-logo jazzcash">JC</div>
                        <div className="card-logo easypaisa">EP</div>
                      </div>
                    </div>
                  </label>
                </div>

                {paymentMethod === 'card' && (
                  <div className="stripe-checkout-section animate-fade-in">
                    <div className="card-input-container">
                      <div className="stripe-elements-grid">
                        <div className="element-group">
                          <label className="element-label">Card Number</label>
                          <div className="stripe-element-wrapper">
                            <CardNumberElement options={cardElementOptions} />
                          </div>
                        </div>
                        
                        <div className="elements-row">
                          <div className="element-group">
                            <label className="element-label">Expiry Date</label>
                            <div className="stripe-element-wrapper">
                              <CardExpiryElement options={cardElementOptions} />
                            </div>
                          </div>
                          <div className="element-group">
                            <label className="element-label">CVC</label>
                            <div className="stripe-element-wrapper">
                              <CardCvcElement options={cardElementOptions} />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {stripeError && (
                        <div className="payment-error-msg">
                          <AlertCircle size={16} />
                          {stripeError}
                        </div>
                      )}

                      <div className="payment-security-tip">
                        <ShieldCheck size={16} className="security-icon" />
                        <span>Your payment information is encrypted and secure.</span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                loading={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary-wrapper">
            <Card className="checkout-summary" padding="large">
              <h2 className="summary-title">
                <Package size={24} />
                Order Summary
              </h2>

              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item._id || item.id} className="summary-item">
                    <div className="summary-item-info">
                      <span className="summary-item-name">{item.name}</span>
                      <span className="summary-item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="summary-item-price">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total Amount</span>
                <span className="summary-total-value">{formatPrice(getCartTotal())}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  const [publishableKey, setPublishableKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const stripePromise = useMemo(() => {
    return publishableKey ? loadStripe(publishableKey) : null;
  }, [publishableKey]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stripe/config');
        const { publishableKey } = await response.json();
        setPublishableKey(publishableKey);
      } catch (err) {
        console.error('Failed to load Stripe config:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  if (isLoading) {
    return (
      <div className="checkout-page">
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <div className="loader" style={{ margin: '0 auto 20px' }}></div>
          <p>Initializing Secure Checkout...</p>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return <CheckoutContent />; // Fallback to COD only
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutContent />
    </Elements>
  );
};

export default Checkout;
