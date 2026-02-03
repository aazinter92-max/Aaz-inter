import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Truck, Stethoscope, Settings, Globe, CheckCircle, Box, Wrench } from 'lucide-react';
import './Services.css';

const Services = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="services-page">
      <div className="container">
        {/* Hero Section */}
        <div className="services-hero">
          <h1>Our Services</h1>
          <p>Comprehensive medical solutions for healthcare institutions worldwide. dedicated to quality, reliability, and precision.</p>
        </div>

        {/* Medical Equipment Supply */}
        <section id="equipment" className="services-section">
          <div className="section-content">
            <div className="section-text">
              <h2>
                <Stethoscope size={28} className="service-icon" />
                Medical Equipment Supply
              </h2>
              <p>
                We provide state-of-the-art medical equipment and implants tailored for modern hospitals and specialized clinics. Our inventory ensures that healthcare providers have access to the latest technology for superior patient care.
              </p>
              <ul className="service-features">
                <li><CheckCircle size={16} className="feature-icon" /> High-precision Hospital Equipment</li>
                <li><CheckCircle size={16} className="feature-icon" /> Orthopedic & Neuro Surgery Implants</li>
                <li><CheckCircle size={16} className="feature-icon" /> Cardiac Angiography Devices</li>
                <li><CheckCircle size={16} className="feature-icon" /> Patient Care & Monitoring Systems</li>
              </ul>
            </div>
            <div className="section-image">
              {/* Placeholder for visual interest - simplified for code */}
              <Stethoscope size={100} color="#e2e8f0" strokeWidth={1} />
            </div>
          </div>
        </section>

        {/* Import & Export Services */}
        <section id="import-export" className="services-section">
          <div className="section-content">
            <div className="section-image" style={{ order: 1 }}>
               {/* Mobile order allows text first via CSS if needed, but grid simplifies */}
               <Globe size={100} color="#e2e8f0" strokeWidth={1} />
            </div>
            <div className="section-text" style={{ order: 2 }}>
              <h2>
                <Globe size={28} className="service-icon" />
                Import & Export Services
              </h2>
              <p>
                Bridging the gap between global manufacturers and local healthcare providers. We handle the complex logistics of sourcing and delivering medical supplies across borders, with a strong focus on Gulf countries and Europe.
              </p>
              <ul className="service-features">
                <li><CheckCircle size={16} className="feature-icon" /> Worldwide Sourcing Network</li>
                <li><CheckCircle size={16} className="feature-icon" /> Customs & Regulatory Compliance Handling</li>
                <li><CheckCircle size={16} className="feature-icon" /> Efficient Global Logistics</li>
                <li><CheckCircle size={16} className="feature-icon" /> Partners in Major European & Gulf Markets</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Bulk Orders & Procurement */}
        <section id="bulk-orders" className="services-section">
          <div className="section-content">
            <div className="section-text">
              <h2>
                <Box size={28} className="service-icon" />
                Bulk Orders & Procurement
              </h2>
              <p>
                Streamlined procurement solutions for large-scale operations. We support hospitals, distributors, and government tenders with competitive bulk pricing and reliable supply chain management.
              </p>
              <ul className="service-features">
                <li><CheckCircle size={16} className="feature-icon" /> Dedicated Account Managers for Bulk Accounts</li>
                <li><CheckCircle size={16} className="feature-icon" /> Wholesale Pricing Models</li>
                <li><CheckCircle size={16} className="feature-icon" /> Schedule-based Delivery Systems</li>
                <li><CheckCircle size={16} className="feature-icon" /> Tender & Contract Supply fulfillment</li>
              </ul>
            </div>
            <div className="section-image">
              <Truck size={100} color="#e2e8f0" strokeWidth={1} />
            </div>
          </div>
        </section>

        {/* Maintenance & After-Sales Support */}
        <section id="support" className="services-section">
          <div className="section-content">
            <div className="section-image" style={{ order: 1 }}>
               <Wrench size={100} color="#e2e8f0" strokeWidth={1} />
            </div>
            <div className="section-text" style={{ order: 2 }}>
              <h2>
                <Settings size={28} className="service-icon" />
                Maintenance & After-Sales Support
              </h2>
              <p>
                Our relationship doesn't end at delivery. We provide comprehensive technical support and maintenance services to ensure your equipment operates at peak performance throughout its lifecycle.
              </p>
              <ul className="service-features">
                <li><CheckCircle size={16} className="feature-icon" /> 24/7 Technical Support Line</li>
                <li><CheckCircle size={16} className="feature-icon" /> On-site Repair & Maintenance</li>
                <li><CheckCircle size={16} className="feature-icon" /> Equipment Callibration Services</li>
                <li><CheckCircle size={16} className="feature-icon" /> Warranty Management & Parts Replacement</li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Services;
