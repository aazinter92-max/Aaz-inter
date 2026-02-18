import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Package, CheckCircle, XCircle, Clock, Loader, Truck, ShoppingCart } from 'lucide-react';
import { useSocket } from '../../../context/SocketContext';
import { api } from '../../../config/api';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState({
    pending: [],
    processing: [],
    completed: [],
    all: []
  });
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    pending: 0,
    processing: 0,
    completed: 0,
    all: 0
  });
  const { socket } = useSocket();

  useEffect(() => {
    fetchAllOrders();

    if (socket) {
      const refreshOrders = () => {
        console.log('📦 Real-time update: Refreshing order management...');
        fetchAllOrders();
      };

      socket.on('newOrder', refreshOrders);
      socket.on('orderStatusUpdate', refreshOrders);
      socket.on('paymentApproved', refreshOrders);
      socket.on('paymentRejected', refreshOrders);

      return () => {
        socket.off('newOrder', refreshOrders);
        socket.off('orderStatusUpdate', refreshOrders);
        socket.off('paymentApproved', refreshOrders);
        socket.off('paymentRejected', refreshOrders);
      };
    }
  }, [socket]);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) return;

      const response = await fetch(api('/api/orders'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch orders');

      const allOrders = await response.json();
      const ordersArray = Array.isArray(allOrders) ? allOrders : [];

      // Task-Oriented Filtering Logic
      const pending = ordersArray.filter(o => 
        ['pending', 'created', 'payment_pending'].includes(o.orderStatus?.toLowerCase())
      );
      
      const processing = ordersArray.filter(o => 
        ['processing', 'shipped'].includes(o.orderStatus?.toLowerCase())
      );
      
      const completed = ordersArray.filter(o => 
        ['delivered', 'completed', 'approved', 'paid'].includes(o.orderStatus?.toLowerCase())
      );

      setOrders({
        pending,
        processing,
        completed,
        all: ordersArray
      });

      setCounts({
        pending: pending.length,
        processing: processing.length,
        completed: completed.length,
        all: ordersArray.length
      });

    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', label: 'Pending', icon: Clock },
      processing: { class: 'status-processing', label: 'Processing', icon: Loader },
      shipped: { class: 'status-shipped', label: 'Shipped', icon: Truck },
      delivered: { class: 'status-delivered', label: 'Delivered', icon: CheckCircle },
      cancelled: { class: 'status-cancelled', label: 'Cancelled', icon: XCircle },
      approved: { class: 'status-approved', label: 'Approved', icon: CheckCircle },
      paid: { class: 'status-approved', label: 'Paid', icon: CheckCircle }
    };
    
    const normalizedStatus = status?.toLowerCase() || 'pending';
    const config = statusConfig[normalizedStatus] || statusConfig.pending;
    const Icon = config.icon || Clock;
    
    return (
      <span className={`status-badge status-${normalizedStatus}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus) => {
    const statusConfig = {
      pending: { class: 'payment-pending', label: 'Pending' },
      approved: { class: 'payment-approved', label: 'Approved' },
      rejected: { class: 'payment-rejected', label: 'Rejected' },
      paid: { class: 'payment-paid', label: 'Paid' },
      failed: { class: 'payment-failed', label: 'Failed' }
    };
    
    const normalizedStatus = paymentStatus?.toLowerCase() || 'pending';
    const config = statusConfig[normalizedStatus] || statusConfig.pending;
    
    return (
      <span className={`payment-badge ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const [activeTab, setActiveTab] = useState('pending');

  const renderOrderTable = (orderList, status) => {
    if (loading) {
      return (
        <div className="loading-state">
          <Loader className="spinner" size={48} />
          <p>Loading {status} orders...</p>
        </div>
      );
    }

    if (orderList.length === 0) {
      return (
        <div className="empty-state">
          <Package size={64} className="empty-icon" />
          <h3>No {status} orders</h3>
          <p>There are currently no orders with {status} status.</p>
        </div>
      );
    }

    return (
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment Method</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderList.map((order) => (
              <tr key={order._id}>
                <td className="order-id">
                  {order.orderNumber || `#${order._id.substring(20, 24)}`}
                </td>
                <td>
                  <div className="customer-info">
                    <strong>{order.customerName}</strong>
                    <small>{order.email}</small>
                  </div>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="amount">PKR {order.totalAmount.toLocaleString()}</td>
                <td>
                  <span className="payment-method">
                    {order.paymentMethod === 'bank' ? 'Bank Transfer' : 'Cash on Delivery'}
                  </span>
                </td>
                <td>{getPaymentBadge(order.paymentStatus)}</td>
                <td>{getStatusBadge(order.orderStatus)}</td>
                <td>
                  <Link 
                    to={`/admin/orders/${order._id}`} 
                    className="admin-btn btn-secondary btn-icon-only"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="order-management-page">
      <div className="page-header">
        <h1 className="page-title">Order Management</h1>
        <p className="page-subtitle">Standardize your workflow by processing orders through these stages</p>
      </div>

      {/* Status Tabs */}
      <div className="status-tabs">
        <button
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <Clock size={18} />
          <span>Pending Approval</span>
          {counts.pending > 0 && (
            <span className="tab-badge" style={{ background: '#f59e0b' }}>{counts.pending}</span>
          )}
        </button>
        <button
          className={`tab-button ${activeTab === 'processing' ? 'active' : ''}`}
          onClick={() => setActiveTab('processing')}
        >
          <Package size={18} />
          <span>To Dispatch</span>
          {counts.processing > 0 && (
            <span className="tab-badge" style={{ background: '#3b82f6' }}>{counts.processing}</span>
          )}
        </button>
        <button
          className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          <CheckCircle size={18} />
          <span>Completed</span>
          <span className="tab-badge" style={{ background: '#10b981' }}>{counts.completed}</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <ShoppingCart size={18} />
          <span>All Orders</span>
          <span className="tab-badge" style={{ background: '#64748b' }}>{counts.all}</span>
        </button>
      </div>

      {/* Order Content */}
      <div className="tab-content">
        {activeTab === 'pending' && renderOrderTable(orders.pending, 'pending')}
        {activeTab === 'processing' && renderOrderTable(orders.processing, 'to dispatch')}
        {activeTab === 'completed' && renderOrderTable(orders.completed, 'completed')}
        {activeTab === 'all' && renderOrderTable(orders.all, 'all')}
      </div>
    </div>
  );
};

export default OrderManagement;
