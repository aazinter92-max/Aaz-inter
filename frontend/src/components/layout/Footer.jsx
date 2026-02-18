import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { sendWhatsAppMessage, whatsappMessages } from '../../utils/helpers';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    sendWhatsAppMessage(whatsappMessages.generalInquiry());
  };

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Categories', path: '/products' },
    { name: 'Contact', path: '/contact' },
  ];

  const categories = [
    { name: 'Hospital Equipment', path: '/products?category=hospital-equipment' },
    { name: 'Orthopedic Implants', path: '/products?category=orthopedic-implants' },
    { name: 'Cardiac Angiography', path: '/products?category=cardiac-angiography' },
    { name: 'Neuro Surgery', path: '/products?category=neuro-surgery' },
    { name: 'Patient Care Devices', path: '/products?category=patient-care' },
  ];

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-section">
              <div className="footer-logo">
                <div className="footer-logo-icon">AAZ</div>
                <div className="footer-logo-text">
                  <span className="footer-logo-name">AAZ International</span>
                  <span className="footer-logo-tagline">Healthcare Solutions</span>
                </div>
              </div>
              <p className="footer-description">
                AAZ International Enterprises Pvt. Ltd. is a leading healthcare solutions provider
                specializing in hospital medical equipment, orthopedic implants, cardiac
                angiography, and patient care devices.
              </p>
              <button className="footer-whatsapp-btn" onClick={handleWhatsAppClick}>
                <MessageCircle size={20} />
                <span>Contact on WhatsApp</span>
              </button>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product Categories */}
            <div className="footer-section">
              <h3 className="footer-title">Product Categories</h3>
              <ul className="footer-links">
                {categories.map((category) => (
                  <li key={category.path}>
                    <Link to={category.path} className="footer-link">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h3 className="footer-title">Contact Us</h3>
              <div className="footer-contact">
                <div className="footer-contact-item">
                  <MapPin size={18} />
                  <span>Karachi, Pakistan</span>
                </div>
                <a href="tel:+923453450644" className="footer-contact-item">
                  <Phone size={18} />
                  <span>+92 345 3450644</span>
                </a>
                <a href="mailto:aazint808@gmail.com" className="footer-contact-item">
                  <Mail size={18} />
                  <span>aazint808@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {currentYear} AAZ International Enterprises Pvt. Ltd. All rights reserved.
            </p>
            <p className="footer-tagline">
              Professional Healthcare Solutions | Worldwide Import & Export
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
