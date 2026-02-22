import React, { useEffect, useState } from 'react';
import styles from './Contact.module.css';
import contactData from '../../information/contact.json';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const activeSocial = contactData.social.filter(platform => platform.url && platform.url.trim() !== '');

  return (
    <div className={styles.contactWrapper}>
      
      {/* Hero Section */}
      <section className={`${styles.hero} ${isVisible ? styles.visible : ''}`}>
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Get In Touch</span>
          </div>
          
          <h1 className={styles.heroTitle}>Let's Connect</h1>
          <p className={styles.heroSubtitle}>{contactData.description}</p>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.container}>

        {/* Contact Information */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelNumber}>01</span>
            <span className={styles.labelText}>Contact Details</span>
          </div>
          <h2 className={styles.sectionTitle}>How to Reach Me</h2>

          <div className={styles.contactGrid}>
            <a href={`mailto:${contactData.email}`} className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>Email</span>
                <span className={styles.contactValue}>{contactData.email}</span>
              </div>
            </a>

            <a href={`tel:${contactData.phone}`} className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>Phone</span>
                <span className={styles.contactValue}>{contactData.phone}</span>
              </div>
            </a>

            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>Location</span>
                <span className={styles.contactValue}>{contactData.location.displayText}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media */}
        {activeSocial.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionLabel}>
              <span className={styles.labelNumber}>02</span>
              <span className={styles.labelText}>Social Media</span>
            </div>
            <h2 className={styles.sectionTitle}>Connect on Social Media</h2>

            <div className={styles.socialGrid}>
              {activeSocial.map((platform, index) => (
                <a
                  key={index}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.socialCard} ${platform.isPrimary ? styles.primarySocial : ''}`}
                  title={platform.description}
                >
                  <div className={styles.socialIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                  <div className={styles.socialInfo}>
                    <span className={styles.socialPlatform}>{platform.platform}</span>
                    <span className={styles.socialUsername}>{platform.username}</span>
                    {platform.description && (
                      <span className={styles.socialDescription}>{platform.description}</span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Availability */}
        <section className={styles.section}>
          <div className={styles.availabilityCard}>
            <svg className={styles.availabilityIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <h3 className={styles.availabilityTitle}>Availability</h3>
            <p className={styles.availabilityText}>{contactData.availability}</p>
            <p className={styles.availabilityNote}>{contactData.responseTime}</p>
          </div>
        </section>

        {/* Services Note */}
        {contactData.services && contactData.services.note && (
          <section className={styles.footerSection}>
            <div className={styles.footerCard}>
              <h3 className={styles.footerTitle}>Ready to Get Started?</h3>
              <p className={styles.footerMessage}>{contactData.services.note}</p>
              <div className={styles.footerDivider}></div>
              <p className={styles.footerMeta}>
                Looking forward to hearing from you!
              </p>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default Contact;
