import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import { sendWhatsAppMessage, whatsappMessages, isValidEmail } from '../utils/helpers';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  const handleWhatsAppClick = () => {
    sendWhatsAppMessage(whatsappMessages.generalInquiry());
  };

  const contactInfo = [
    {
      icon: <MapPin size={24} />,
      title: 'Location',
      content: 'Karachi, Pakistan',
    },
    {
      icon: <Phone size={24} />,
      title: 'Phone',
      content: '+92 345 3450644',
      link: 'tel:+923453450644',
    },
    {
      icon: <Mail size={24} />,
      title: 'Email',
      content: 'aazint808@gmail.com',
      link: 'mailto:aazint808@gmail.com',
    },
    {
      icon: <Clock size={24} />,
      title: 'Business Hours',
      content: 'Mon - Sat: 9:00 AM - 6:00 PM',
    },
  ];

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">
            Get in touch with our team for any inquiries or support
          </p>
        </div>

        <div className="contact-layout">
          {/* Contact Form */}
          <div className="contact-form-section">
            <Card padding="large">
              <h2 className="form-title">Send us a Message</h2>

              {submitSuccess && (
                <div className="success-message">
                  <p>✓ Thank you! Your message has been sent successfully.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                  error={errors.name}
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                  error={errors.email}
                />
                <Input
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What is this regarding?"
                  required
                  error={errors.subject}
                />
                <div className="input-wrapper">
                  <label htmlFor="message" className="input-label">
                    Message<span className="input-required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your inquiry..."
                    required
                    rows="6"
                    className={`textarea-field ${errors.message ? 'input-error' : ''}`}
                  />
                  {errors.message && <span className="input-error-message">{errors.message}</span>}
                </div>

                <Button type="submit" variant="primary" size="large" fullWidth loading={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>

              <div className="form-divider">
                <span>or</span>
              </div>

              <Button
                variant="secondary"
                size="large"
                fullWidth
                icon={<MessageCircle size={20} />}
                onClick={handleWhatsAppClick}
              >
                Contact via WhatsApp
              </Button>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="contact-info-section">
            <Card padding="large" className="contact-info-card">
              <h2 className="info-title">Get in Touch</h2>
              <p className="info-description">
                Our team is here to help you with all your medical equipment needs. Reach out to us
                through any of the following channels.
              </p>

              <div className="contact-details">
                {contactInfo.map((info, index) => (
                  <div key={index} className="contact-detail-item">
                    <div className="detail-icon">{info.icon}</div>
                    <div className="detail-content">
                      <h4>{info.title}</h4>
                      {info.link ? (
                        <a href={info.link}>{info.content}</a>
                      ) : (
                        <p>{info.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card padding="large" className="business-info-card">
              <h3>Why Choose AAZ International?</h3>
              <ul>
                <li>✓ Certified medical equipment</li>
                <li>✓ Worldwide shipping & delivery</li>
                <li>✓ Professional maintenance services</li>
                <li>✓ Competitive pricing</li>
                <li>✓ 24/7 customer support</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
