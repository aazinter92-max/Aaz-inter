import { useState, useEffect } from 'react';
import { Mail, User, Phone, MessageSquare, Trash2, CheckCircle, Clock, Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const Complaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, pending, resolved, in-progress

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(api('/api/complaints'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setComplaints(data);
      } else {
        setError(data.message || 'Failed to fetch complaints');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(api(`/api/complaints/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        setComplaints(complaints.map(c => c._id === id ? { ...c, status } : c));
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(api(`/api/complaints/${id}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setComplaints(complaints.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error('Delete complaint error:', err);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || c.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) return (
    <div className="admin-loader-container">
      <Loader2 className="spinner" size={40} />
      <p>Syncing Support Inquiries...</p>
    </div>
  );

  return (
    <div className="admin-page-container">
      {/* Header Section */}
      <div className="admin-page-header">
        <div className="header-main">
          <h1 className="page-title">Support & Complaints</h1>
          <p className="section-subtitle">Manage customer inquiries and technical support tickets.</p>
        </div>
        
        <div className="complaint-summary-pills">
          <div className="summary-pill pending">
            <span className="label">Open</span>
            <span className="count">{complaints.filter(c => c.status === 'pending').length}</span>
          </div>
          <div className="summary-pill in-progress">
            <span className="label">In Progress</span>
            <span className="count">{complaints.filter(c => c.status === 'in-progress').length}</span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="admin-control-bar">
        <div className="search-box-modern">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email or subject..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group-modern">
          <Filter size={16} className="filter-icon" />
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setActiveFilter('in-progress')}
          >
            In Progress
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'resolved' ? 'active' : ''}`}
            onClick={() => setActiveFilter('resolved')}
          >
            Resolved
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-error-alert">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Content Grid */}
      <div className="complaints-grid-modern">
        {filteredComplaints.length === 0 ? (
          <div className="admin-empty-state-modern">
            <div className="empty-icon-wrapper">
              <MessageSquare size={64} />
            </div>
            <h3>No inquiries found</h3>
            <p>{searchTerm ? 'No results match your search criteria.' : 'Your support inbox is currently empty.'}</p>
          </div>
        ) : (
          filteredComplaints.map((complaint) => (
            <div key={complaint._id} className={`support-card-premium ${complaint.status}`}>
              <div className="card-top">
                <div className={`status-indicator ${complaint.status}`}>
                  {complaint.status.replace('-', ' ')}
                </div>
                <span className="date-tag">{new Date(complaint.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="card-main">
                <div className="user-profile-mini">
                  <div className="avatar-letter">{complaint.name.charAt(0)}</div>
                  <div className="user-details">
                    <h4>{complaint.name}</h4>
                    <p>{complaint.email}</p>
                  </div>
                </div>

                <div className="inquiry-content">
                  <h5 className="subject-line">{complaint.subject}</h5>
                  <p className="message-snippet">{complaint.message}</p>
                </div>
              </div>

              <div className="card-footer-modern">
                <div className="contact-links">
                  {complaint.phone && (
                    <a href={`tel:${complaint.phone}`} className="contact-action" title="Call Customer">
                      <Phone size={16} />
                    </a>
                  )}
                  <a href={`mailto:${complaint.email}`} className="contact-action" title="Reply via Email">
                    <Mail size={16} />
                  </a>
                </div>

                <div className="processing-actions">
                  {complaint.status !== 'resolved' && (
                    <select 
                      value={complaint.status} 
                      onChange={(e) => handleUpdateStatus(complaint._id, e.target.value)}
                      className="status-dropdown"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  )}
                  
                  <button 
                    className="delete-action"
                    onClick={() => handleDelete(complaint._id)}
                    title="Delete permanently"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Complaints;
