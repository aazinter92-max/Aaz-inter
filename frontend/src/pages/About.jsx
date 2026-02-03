import { Shield, Globe, Award, Users } from 'lucide-react';
import Card from '../components/common/Card';
import './About.css';

const About = () => {
  const values = [
    {
      icon: <Shield size={32} />,
      title: 'Quality Assurance',
      description: 'All products meet international healthcare standards and certifications',
    },
    {
      icon: <Globe size={32} />,
      title: 'Global Reach',
      description: 'Serving healthcare facilities across Gulf countries, Europe, and beyond',
    },
    {
      icon: <Award size={32} />,
      title: 'Excellence',
      description: 'Committed to delivering the highest quality medical equipment and services',
    },
    {
      icon: <Users size={32} />,
      title: 'Customer Focus',
      description: 'Dedicated support and personalized solutions for every client',
    },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1 className="about-title">About AAZ International</h1>
          <p className="about-subtitle">
            Your Trusted Partner in Healthcare Solutions
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="about-content">
        <div className="container">
          <Card className="about-card" padding="large">
            <h2>Who We Are</h2>
            <p>
              <strong>AAZ International Enterprises Pvt. Ltd.</strong> is a leading healthcare solutions
              provider based in Karachi, Pakistan. We specialize in supplying high-quality medical
              equipment, orthopedic implants, cardiac angiography systems, neurosurgical devices,
              and patient care equipment to hospitals, clinics, and healthcare facilities worldwide.
            </p>
            <p>
              With years of experience in the medical equipment industry, we have established
              ourselves as a trusted partner for healthcare providers seeking reliable, certified,
              and cost-effective medical solutions.
            </p>
          </Card>

          <Card className="about-card" padding="large">
            <h2>Our Mission</h2>
            <p>
              To provide healthcare facilities with access to world-class medical equipment and
              implants that enhance patient care and improve healthcare outcomes. We are committed
              to quality, reliability, and customer satisfaction in everything we do.
            </p>
          </Card>

          <Card className="about-card" padding="large">
            <h2>What We Offer</h2>
            <div className="offerings-grid">
              <div className="offering-item">
                <h4>Hospital Medical Equipment</h4>
                <p>Complete range of hospital beds, surgical tables, patient monitors, and ICU equipment</p>
              </div>
              <div className="offering-item">
                <h4>Orthopedic Implants</h4>
                <p>Premium quality hip, knee, and spinal implants for surgical excellence</p>
              </div>
              <div className="offering-item">
                <h4>Cardiac Angiography</h4>
                <p>Advanced stents, catheters, and interventional cardiology devices</p>
              </div>
              <div className="offering-item">
                <h4>Neuro Surgery Implants</h4>
                <p>Specialized cranial fixation systems and neurosurgical instruments</p>
              </div>
              <div className="offering-item">
                <h4>Patient Care Devices</h4>
                <p>Essential monitoring and care equipment for patient comfort and safety</p>
              </div>
              <div className="offering-item">
                <h4>Maintenance & Repair</h4>
                <p>Professional maintenance and repair services for medical equipment</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-grid">
            {/* CEO Card */}
            <Card className="team-card ceo-card" padding="large" hover>
              <div className="team-member-icon">
                <Users size={48} />
              </div>
              <div className="team-member-info">
                <h3>Mr. Faisal</h3>
                <span className="member-role">CEO, AAZ International</span>
                <p>Visionary leader driving AAZ International towards global healthcare excellence. With decades of industry experience, Mr. Faisal ensures that every product reaching a patient meets the highest medical standards.</p>
              </div>
            </Card>

            {/* Developers Grid */}
            <div className="dev-team-row">
              <Card className="team-card dev-card" padding="large" hover>
                <div className="team-member-icon mini">
                  <Shield size={32} />
                </div>
                <div className="team-member-info">
                  <h3>Badshah Jan</h3>
                  <span className="member-role">Lead Developer</span>
                  <p>Full-stack developer specializing in building robust healthcare platforms and real-time systems that connect providers with quality equipment.</p>
                </div>
              </Card>

              <Card className="team-card dev-card" padding="large" hover>
                <div className="team-member-icon mini">
                  <Shield size={32} />
                </div>
                <div className="team-member-info">
                  <h3>Hafiz Abrar Iqbal</h3>
                  <span className="member-role">Senior Software Engineer</span>
                  <p>Expert developer focused on user experience and scalable system architecture, ensuring a seamless digital experience for all our global clients.</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <Card key={index} className="value-card" padding="large" hover>
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <Card className="cta-card" padding="large">
            <h2>Partner with Us</h2>
            <p>
              Ready to enhance your healthcare facility with quality medical equipment? Get in touch
              with our team today to discuss your requirements.
            </p>
            <div className="cta-contacts">
              <a href="tel:+923453450644" className="cta-contact-item">
                📞 +92 345 3450644
              </a>
              <a href="mailto:aazint808@gmail.com" className="cta-contact-item">
                ✉️ aazint808@gmail.com
              </a>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;
