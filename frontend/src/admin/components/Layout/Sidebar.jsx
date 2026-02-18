import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Tags,
  CheckCircle,
  X,
  MessageSquare,
} from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuth";
import { useSocket } from "../../../context/SocketContext";
import { api } from '../../../config/api';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useAdminAuth();
  const { socket } = useSocket();
  const [pendingOrders, setPendingOrders] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [pendingComplaints, setPendingComplaints] = useState(0);

  const isActive = (path) => location.pathname.startsWith(path);

  useEffect(() => {
    fetchPendingCount();
    fetchPendingPayments();
    fetchPendingComplaints();

    if (socket) {
      const handleNewOrder = () => setPendingOrders((prev) => prev + 1);
      const handleStatusUpdate = () => fetchPendingCount();
      const handlePaymentProofUploaded = () => fetchPendingPayments();

      socket.on("newOrder", handleNewOrder);
      socket.on("orderStatusUpdate", handleStatusUpdate);
      socket.on("paymentProofUploaded", handlePaymentProofUploaded);

      return () => {
        socket.off("newOrder", handleNewOrder);
        socket.off("orderStatusUpdate", handleStatusUpdate);
        socket.off("paymentProofUploaded", handlePaymentProofUploaded);
      };
    }
  }, [socket]);

  const fetchPendingCount = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(api("/api/orders"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        const count = data.filter(
          (o) =>
            o.orderStatus === "CREATED" || o.orderStatus === "PAYMENT_PENDING",
        ).length;
        setPendingOrders(count);
      }
    } catch (err) {
      console.error("Error fetching sidebar counts:", err);
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(api("/api/payments/pending"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPendingPayments(data.count || 0);
    } catch (err) {
      console.error("Error fetching pending payments:", err);
    }
  };

  const fetchPendingComplaints = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(api("/api/complaints"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setPendingComplaints(data.filter(c => c.status === 'pending').length);
      }
    } catch (err) {
      console.error("Error fetching pending complaints:", err);
    }
  };

  const menuGroups = [
    {
      title: "Overview",
      items: [
        { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
      ]
    },
    {
      title: "Store Management",
      items: [
        { name: "Products", path: "/admin/products", icon: <Package size={20} /> },
        { name: "Categories", path: "/admin/categories", icon: <Tags size={20} /> },
        { name: "Customers", path: "/admin/customers", icon: <Users size={20} /> },
      ]
    },
    {
      title: "Operations",
      items: [
        { name: "Orders", path: "/admin/orders", icon: <ShoppingCart size={20} />, badge: pendingOrders },
        { name: "Verify Payments", path: "/admin/payment-verification", icon: <CheckCircle size={20} />, badge: pendingPayments },
        { name: "Complaints", path: "/admin/complaints", icon: <MessageSquare size={20} />, badge: pendingComplaints },
      ]
    }
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="admin-sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div className="admin-logo-badge">AZ</div>
          <span className="admin-panel-text">Admin Panel</span>
        </div>
        <button onClick={onClose} className="mobile-close-btn">
          <X size={24} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: '2rem' }}>
        <nav className="admin-nav">
          {menuGroups.map((group, gIdx) => (
            <div key={group.title} style={{ marginBottom: gIdx !== menuGroups.length - 1 ? '1.5rem' : 0 }}>
              <div
                className="text-muted"
                style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  padding: "0.5rem 1.5rem",
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  opacity: 0.8
                }}
              >
                {group.title}
              </div>
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`admin-nav-item ${isActive(item.path) ? "active" : ""}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span className="admin-nav-icon">{item.icon}</span>
                    <span style={{ fontSize: '0.9rem' }}>{item.name}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="nav-badge-new">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <div className="admin-sidebar-footer">
        <button onClick={logout} className="logout-btn">
          <LogOut size={18} />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
