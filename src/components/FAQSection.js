import React, { useState } from 'react';
import './FAQSection.css';

const FAQSection = () => {
  const [activeIndexes, setActiveIndexes] = useState([0, 1, 2, 3, 4, 5]); // All FAQs open by default

  const faqs = [
    { 
      id: 1, 
      question: 'Lorem ipsum dolor sit amet consectetur.',
      answer: 'Lorem ipsum dolor sit amet consectetur. In sollicitudin sed auctor mattis quis eget integer non. Leo mauris orci massa in.'
    },
    { 
      id: 2, 
      question: 'Lorem ipsum dolor sit amet consectetur.',
      answer: 'Lorem ipsum dolor sit amet consectetur. In sollicitudin sed auctor mattis quis eget integer non. Leo mauris orci massa in.'
    },
    { 
      id: 3, 
      question: 'Lorem ipsum dolor sit amet consectetur.',
      answer: 'Lorem ipsum dolor sit amet consectetur. In sollicitudin sed auctor mattis quis eget integer non. Leo mauris orci massa in.'
    },
    { 
      id: 4, 
      question: 'Lorem ipsum dolor sit amet consectetur.',
      answer: 'Lorem ipsum dolor sit amet consectetur. In sollicitudin sed auctor mattis quis eget integer non. Leo mauris orci massa in.'
    },
    { 
      id: 5, 
      question: 'Lorem ipsum dolor sit amet consectetur.',
      answer: 'Lorem ipsum dolor sit amet consectetur. In sollicitudin sed auctor mattis quis eget integer non. Leo mauris orci massa in.'
    },
    { 
      id: 6, 
      question: 'Lorem ipsum dolor sit amet consectetur.',
      answer: 'Lorem ipsum dolor sit amet consectetur. In sollicitudin sed auctor mattis quis eget integer non. Leo mauris orci massa in.'
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

