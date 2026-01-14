import React, { useState } from 'react';
import './FAQSection.css';

const FAQSection = () => {
  const [activeIndexes, setActiveIndexes] = useState([]); // All FAQs closed by default

  const faqs = [
    { 
      id: 1, 
      question: 'What documents do I need to rent a car?',
      answer: 'You will need a valid driver\'s license, a credit card in your name for the security deposit, and proof of insurance. For international renters, an International Driving Permit may be required along with your home country license.'
    },
    { 
      id: 2, 
      question: 'What is the minimum age to rent a car?',
      answer: 'The minimum age requirement is 21 years old. Drivers between 21-24 may be subject to a young driver surcharge. Some vehicle categories may have higher age requirements.'
    },
    { 
      id: 3, 
      question: 'Is insurance included in the rental price?',
      answer: 'Yes, comprehensive insurance coverage is included in all our rental packages. This covers collision damage, theft, and third-party liability. Additional coverage options are available for purchase.'
    },
    { 
      id: 4, 
      question: 'Can I cancel or modify my reservation?',
      answer: 'Yes, you can cancel or modify your reservation free of charge up to 24 hours before your pickup time. Cancellations made within 24 hours may be subject to a fee depending on your rental package.'
    },
    { 
      id: 5, 
      question: 'Do you offer home delivery service?',
      answer: 'Yes, we offer convenient home delivery and pickup services for an additional fee. This service is available in most areas and can be arranged during the booking process.'
    },
    { 
      id: 6, 
      question: 'What happens if the car breaks down during my rental?',
      answer: 'All our vehicles are regularly maintained and inspected. In the rare event of a breakdown, we provide 24/7 roadside assistance. Our support team will arrange for a replacement vehicle or repair service immediately.'
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndexes(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <h2 className="section-title">FAQS</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isActive = activeIndexes.includes(index);
            return (
              <div key={faq.id} className={`faq-item ${isActive ? 'active' : ''}`}>
                <div 
                  className={`faq-header ${isActive ? 'active' : ''}`}
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="faq-question">{faq.question}</span>
                  <span className="faq-icon">{isActive ? '—' : '+'}</span>
                </div>
                {isActive && faq.answer && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

