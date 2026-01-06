import React, { useState } from 'react';
import './ContactUsPage.css';
import Header from './Header';
import Footer from './Footer';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset status message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      content: 'info@kingorides.com',
      link: 'mailto:info@kingorides.com'
    },
    {
      icon: '📞',
      title: 'Phone',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: '📍',
      title: 'Address',
      content: '123 Car Rental Street, City, State 12345',
      link: null
    },
    {
      icon: '🕒',
      title: 'Business Hours',
      content: 'Mon - Fri: 9:00 AM - 6:00 PM\nSat - Sun: 10:00 AM - 4:00 PM',
      link: null
    }
  ];

  return (
    <div className="contact-page">
      <Header />
      <div className="contact-container">
        <div className="contact-header">
          <h1 className="contact-title">CONTACT US</h1>
          <p className="contact-subtitle">
            Have questions? We're here to help! Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info-section">
            <h2 className="section-heading">GET IN TOUCH</h2>
            <p className="section-description">
              Our friendly team is ready to assist you with any questions about our rental packages, vehicles, or services.
            </p>

            <div className="contact-info-grid">
              {contactInfo.map((info, index) => (
                <div key={index} className="contact-info-card">
                  <div className="info-icon">{info.icon}</div>
                  <h3 className="info-card-title">{info.title}</h3>
                  {info.link ? (
                    <a href={info.link} className="info-content-link">
                      {info.content.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < info.content.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </a>
                  ) : (
                    <p className="info-content">
                      {info.content.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < info.content.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="contact-form-section">
            <h2 className="section-heading">SEND US A MESSAGE</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>

              {submitStatus === 'success' && (
                <div className="form-success">
                  ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
                </div>
              )}

              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUsPage;
