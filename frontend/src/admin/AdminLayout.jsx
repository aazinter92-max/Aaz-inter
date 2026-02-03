import Sidebar from './components/Layout/Sidebar';
import { Outlet } from 'react-router-dom';
import Header from './components/Layout/Header';
import './Admin.css'; // Import the design system

const AdminLayout = () => {
  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-main">
        <Header />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
