import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [emailError, setEmailError] = useState('');

  const validateAndSubmit = (e) => {
    // Grab the email value from the form
    const email = e.target.email.value;
    
    // Regular expression to check if the email format is valid (e.g., name@domain.com)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      e.preventDefault(); // Stop the form from sending
      setEmailError("Hmm, that email doesn't look quite right. Please double-check it!");
    } else {
      // Clear the error and let the form submit naturally to FormSubmit.co
      setEmailError(''); 
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        
        {/* NEW: Giant 'GET IN TOUCH' Header */}
        <div className="get-in-touch">
          <div className="text-gray">GET IN</div>
          <div className="text-white">TOUCH</div>
        </div>

        {/* Top Content (Grid on Desktop, Stacked on Mobile) */}
        <div className="contact-content">
          
          {/* Left Side: Information */}
          <div className="contact-info">
            <h2 className="contact-heading">
              Whether you have a question, want to work together, or simply wish to say hello, I'm all ears.
            </h2>
            
            <div className="contact-details">
              <div className="detail-item">
                <span className="detail-label">Business Inquiries</span>
                <a href="mailto:contact@display.com" className="detail-value">joell@gmail.com</a>
              </div>
              {/* <div className="detail-item">
                <span className="detail-label">General</span>
                <a href="mailto:hello@display.com" className="detail-value">hello@display.com</a>
              </div> */}
              {/* <div className="detail-item">
                <span className="detail-label">LinkedIn</span>
                <a href="#" className="detail-value">display.official</a>
              </div> */}
              <div className="detail-item">
                <span className="detail-label">Phone number</span>
                <a href="tel:+310612345678" className="detail-value">+91 956 703 9711</a>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="contact-form-wrapper">
            {/* The action URL points to FormSubmit, sending data directly to your email */}
            <form 
              className="contact-form" 
              action="https://formsubmit.co/joellsiby@gmail.com" 
              method="POST"
              onSubmit={validateAndSubmit}
            >
              {/* Optional: Disables the FormSubmit Captcha for a smoother user experience */}
              <input type="hidden" name="_captcha" value="false" />
              
              <div className="form-row">
                <input type="text" name="name" placeholder="Name" required />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email" 
                  required 
                  onChange={() => setEmailError('')} // Clears error when they start typing again
                />
              </div>
              
              {/* Displays our helpful validation prompt if they make a typo */}
              {emailError && <div className="error-prompt">{emailError}</div>}

              <textarea name="message" placeholder="Message" rows="7" required></textarea>
              <button type="submit" className="submit-btn">Submit</button>
            </form>
          </div>

        </div>

        {/* Bottom Giant Typography */}
        <div className="huge-text-wrapper">
          <h1 className="huge-text">
            <span className="lets">let's</span>
            <span className="connect"> connect</span>
          </h1>
        </div>

      </div>
    </section>
  );
};

export default Contact;