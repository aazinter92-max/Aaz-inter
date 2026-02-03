import { Mail, MessageCircle, BookOpen, Stethoscope, Heart, Activity } from 'lucide-react';
import './Blog.css';

const Blog = () => {
  const articles = [
    {
      id: 1,
      title: "Importance of Reliable Medical Equipment in Hospitals",
      content: "Reliable medical equipment plays a critical role in patient safety and treatment outcomes. From diagnostic machines to life-support systems, hospitals depend on high-quality devices to deliver accurate and timely care. Choosing certified and well-maintained equipment reduces downtime and ensures smooth hospital operations.",
      icon: <Stethoscope size={24} />
    },
    {
      id: 2,
      title: "Understanding the Role of Ventilators in Critical Care",
      content: "Ventilators are essential life-support devices used in ICUs and emergency units to assist patients with breathing difficulties. Modern ventilators provide precise control, monitoring, and safety features that help medical staff manage critical respiratory conditions effectively.",
      icon: <Activity size={24} />
    },
    {
      id: 3,
      title: "Orthopedic Implants: Advancing Patient Mobility",
      content: "Orthopedic implants have transformed the treatment of bone and joint disorders. With advancements in materials and design, modern implants offer improved durability, compatibility, and faster recovery, helping patients regain mobility and quality of life.",
      icon: <BookOpen size={24} />
    },
    {
      id: 4,
      title: "Cardiac Angiography Equipment: Enhancing Heart Care",
      content: "Cardiac angiography systems enable doctors to diagnose and treat heart conditions with accuracy. High-quality imaging equipment is essential for detecting blockages, planning procedures, and ensuring successful cardiac interventions.",
      icon: <Heart size={24} />
    },
    {
      id: 5,
      title: "Why Medical Equipment Maintenance Matters",
      content: "Regular maintenance and timely repair of medical equipment are crucial for patient safety and cost efficiency. Preventive maintenance reduces equipment failure, extends lifespan, and ensures compliance with healthcare standards.",
      icon: <Stethoscope size={24} />
    }
  ];

  return (
    <div className="blog-page">
      <div className="container">
        {/* Header */}
        <div className="blog-header">
          <div className="blog-icon">🩺</div>
          <h1>Blog</h1>
          <p className="blog-subtitle">Insights & Updates from AAZ International Enterprises Pvt. Ltd.</p>
          <p className="blog-intro">
            Welcome to the official blog of AAZ International Enterprises Pvt. Ltd., where we share insights, 
            updates, and knowledge related to medical equipment, hospital technology, and healthcare solutions. 
            Our goal is to help hospitals, clinics, and healthcare professionals stay informed about modern 
            medical devices and best practices.
          </p>
        </div>

        {/* Latest Articles */}
        <section className="articles-section">
          <h2 className="section-title">📝 Latest Articles</h2>
          <div className="articles-grid">
            {articles.map((article, index) => (
              <div key={article.id} className="article-card">
                <div className="article-number">{index + 1}</div>
                <div className="article-icon">{article.icon}</div>
                <h3>{article.title}</h3>
                <p>{article.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Global Supply Section */}
        <section className="supply-section">
          <h2>🌍 Global Medical Equipment Supply & Import-Export</h2>
          <p>
            AAZ International Enterprises Pvt. Ltd. specializes in sourcing and supplying medical equipment worldwide. 
            With strong connections in international markets, we ensure quality products, smooth logistics, and reliable 
            delivery for hospitals and healthcare providers.
          </p>
        </section>

        {/* Contact Section */}
        <section className="blog-contact-section">
          <h2>📞 Stay Connected</h2>
          <p>For inquiries, product information, or professional consultation, feel free to contact us:</p>
          <div className="contact-cards">
            <div className="contact-card">
              <Mail size={32} />
              <h3>Email</h3>
              <a href="mailto:aazint808@gmail.com">aazint808@gmail.com</a>
            </div>
            <div className="contact-card">
              <MessageCircle size={32} />
              <h3>WhatsApp</h3>
              <a href="https://wa.me/923453450644" target="_blank" rel="noopener noreferrer">
                +92 345 3450644
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blog;
