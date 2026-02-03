import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Award, BookOpen, HelpCircle } from "lucide-react";
import "./Resources.css";

const Resources = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="resources-page">
      <div className="container">
        {/* Hero Section */}
        <div className="resources-hero">
          <h1>Client Resources</h1>
          <p>
            Access essential documents, guides, and information to support your
            medical equipment needs.
          </p>
        </div>

        <div className="resources-grid">
          {/* Certifications & Compliance */}
          <section id="certifications" className="resource-section">
            <div className="resource-header">
              <h2>
                <Award className="service-icon" /> Certifications & Compliance
              </h2>
              <p>
                We adhere to strict international quality standards and
                regulatory requirements.
              </p>
            </div>
            <div className="catalog-grid">
              {[
                "ISO 13485:2016 Certified",
                "CE Mark Compliance",
                "FDA Registration",
                "Import/Export Licenses",
              ].map((item, index) => (
                <div key={index} className="catalog-item">
                  <Award size={32} className="catalog-icon" />
                  <h3>{item}</h3>
                  <span className="download-link">Verified</span>
                </div>
              ))}
            </div>
          </section>

          {/* User Guides */}
          <section id="guides" className="resource-section">
            <div className="resource-header">
              <h2>
                <BookOpen className="service-icon" /> User Guides
              </h2>
              <p>
                Operational manuals and safety guidelines for our major
                equipment lines.
              </p>
            </div>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>
                  <BookOpen size={18} /> Sterilization Protocols for Implants
                </h3>
                <p>
                  Standard operating procedures for pre-operative sterilization
                  of orthopedic and neuro implants.
                </p>
              </div>
              <div className="faq-item">
                <h3>
                  <BookOpen size={18} /> Equipment Safety Checks
                </h3>
                <p>
                  Daily and weekly maintenance checklists for ensuring equipment
                  longevity and safety.
                </p>
              </div>
              <div className="faq-item">
                <h3>
                  <BookOpen size={18} /> Handling Sensitive Electronic Devices
                </h3>
                <p>
                  Guidelines for storage and usage of sensitive cardiac
                  monitoring systems.
                </p>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section id="faq" className="resource-section">
            <div className="resource-header">
              <h2>
                <HelpCircle className="service-icon" /> Frequently Asked
                Questions
              </h2>
              <p>
                Common questions from hospital procurement teams and medical
                professionals.
              </p>
            </div>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>
                  <HelpCircle size={18} /> What are your typical delivery
                  timelines?
                </h3>
                <p>
                  Domestic orders are typically delivered within 3-5 business
                  days. International shipments vary by location but usually
                  range from 2-4 weeks.
                </p>
              </div>
              <div className="faq-item">
                <h3>
                  <HelpCircle size={18} /> Do you offer installation services?
                </h3>
                <p>
                  Yes, for major equipment, our technical team provides on-site
                  installation and initial staff training as part of the service
                  package.
                </p>
              </div>
              <div className="faq-item">
                <h3>
                  <HelpCircle size={18} /> How do I place a bulk order?
                </h3>
                <p>
                  Bulk orders can be initiated through our 'Bulk Orders' service
                  section or by contacting our sales team directly for a custom
                  quotation.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Resources;
