import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Package, 
  Mail, 
  Phone, 
  ArrowRight, 
  Upload, 
  Clock, 
  AlertCircle,
  MessageCircle,
  ArrowLeft,
  Building,
  CreditCard as CardIcon
} from 'lucide-react';
import { formatPrice } from '../data/products';
import { formatDate } from '../utils/helpers';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useAuth } from '../context/AuthContext';
import StripePayment from '../components/payment/StripePayment';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [orderData, setOrderData] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');

  useEffect(() => {
    if (location.state) {
      setOrderData(location.state);
      fetchWhatsAppLink(location.state.orderId);
    } else {
      const lastOrder = localStorage.getItem('lastOrder');
      if (lastOrder) {
        const parsed = JSON.parse(lastOrder);
        setOrderData(parsed);
        fetchWhatsAppLink(parsed.orderId);
      } else {
        navigate('/');
      }
    }
  }, [navigate, location]);

  const fetchWhatsAppLink = async (id) => {
    // WhatsApp link functionality removed as it's not needed for COD/Card payments
    // This function is kept for compatibility but does nothing
    return;
  };

  if (!orderData) return null;

  const isCardPayment = orderData.paymentMethod === 'card';

  return (
    <div className="order-confirmation-page">
      <div className="container">
        
        {/* PROGRESS TRACKER */}
        <div className="order-stepper">
          <div className="step-item completed">
            <div className="step-circle"><CheckCircle size={20} /></div>
            <span>Ordered</span>
          </div>
          <div className={`step-item ${isCardPayment && !uploadSuccess ? 'active' : 'completed'}`}>
            <div className="step-circle">{isCardPayment && !uploadSuccess ? <Clock size={20} /> : <CheckCircle size={20} />}</div>
            <span>Payment</span>
          </div>
          <div className="step-item">
            <div className="step-circle"><AlertCircle size={20} /></div>
            <span>Verification</span>
          </div>
          <div className="step-item">
            <div className="step-circle"><Package size={20} /></div>
            <span>Shipping</span>
          </div>
        </div>

        <div className="confirmation-grid">
          
          {/* LEFT COLUMN: ACTIONS */}
          <div className="confirmation-main">
            
            {/* SUCCESS BANNER */}
            <Card className="success-banner" padding="large">
              <CheckCircle size={48} className="text-success" />
              <h1>Order Placed!</h1>
              <p className="order-id">
                {orderData.orderNumber || `Order ID: #${orderData.orderId.slice(-8)}`}
              </p>
            </Card>

            {/* STRIPE CARD PAYMENT SECTION */}
            {isCardPayment && (
              <Card className="payment-action-card highlight-card" padding="large">
                <div className="card-header">
                  <div className={`status-badge ${orderData.paymentStatus === 'PAID' ? 'success' : 'warning'}`}>
                    {orderData.paymentStatus === 'PAID' ? 'Payment Verified' : 'Action Required'}
                  </div>
                  <h2>{orderData.paymentStatus === 'PAID' ? 'Payment Completed' : 'Pay via Credit/Debit Card'}</h2>
                </div>

                {orderData.paymentStatus === 'PAID' ? (
                  <div className="upload-success-msg">
                    <CheckCircle size={48} className="text-success" />
                    <h3>Payment Successful!</h3>
                    <p>Thank you for your payment. Your order is now being processed.</p>
                  </div>
                ) : (
                  <div className="stripe-container">
                    <p style={{ marginBottom: '1.5rem', color: '#4b5563' }}>
                      Please enter your card details below to complete your order.
                    </p>
                    <StripePayment 
                      order={orderData} 
                      onPaymentSuccess={() => {
                        setOrderData(prev => ({ ...prev, paymentStatus: 'PAID' }));
                        setUploadSuccess(true);
                      }} 
                    />
                  </div>
                )}
              </Card>
            )}

            {!isCardPayment && (
              <Card className="cod-info-card highlight-card" padding="large">
                <div className="card-header">
                  <div className="status-badge info">Cash on Delivery</div>
                  <h2>What's Next?</h2>
                </div>
                <div className="steps-list">
                  <div className="step-line">
                    <div className="dot">1</div>
                    <p>Our team will call you at <strong>{orderData.customer.phone}</strong> to confirm the order.</p>
                  </div>
                  <div className="step-line">
                    <div className="dot">2</div>
                    <p>Once confirmed, we will ship your medical supplies immediately.</p>
                  </div>
                  <div className="step-line">
                    <div className="dot">3</div>
                    <p>Pay cash when your order reaches your doorstep.</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="confirmation-sidebar">
            <Card className="order-summary-mini" padding="large">
              <h3>Order Summary</h3>
              <div className="summary-list">
                {orderData.items.map((item, index) => (
                  <div className="summary-item" key={item.id || item._id || index}>
                    <span>{item.name} x {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-divider"></div>
              <div className="summary-total">
                <span>Total Amount:</span>
                <strong>{formatPrice(orderData.total)}</strong>
              </div>
              
              <div className="delivery-info-mini">
                <h4><Package size={16} /> Delivery To:</h4>
                <p>{orderData.customer.name}</p>
                <p>{orderData.customer.address}, {orderData.customer.city}</p>
              </div>
            </Card>

            <div className="nav-buttons">
              <Button variant="ghost" fullWidth onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
              <Button variant="ghost" fullWidth onClick={() => navigate('/my-orders')}>
                Track All Orders
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
