import React from 'react';
import {
  Mail, Phone, MapPin, ExternalLink, Heart, CheckCircle, AlertCircle
} from 'lucide-react';

// ============================================
// IMPORTS - DATA & STYLES
// ============================================

import styles from './Contact.module.css';
import contactData from '../../information/contact.json';

// ============================================
// CONTACT COMPONENT
// ============================================
// Modern, responsive contact page for pet sitting services

function Contact() {
  // ----------------------------------------
  // Data Processing
  // ----------------------------------------
  
  const activeSocial = contactData.social.filter(platform => platform.url && platform.url.trim() !== '');

  // ----------------------------------------
  // Render
  // ----------------------------------------
  
  return (
    <div className={styles.contactContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.mainTitle}>Get in Touch</h1>
          <p className={styles.tagline}>{contactData.tagline}</p>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          
          {/* Services Section */}
          {contactData.services && (
            <section className={styles.servicesSection}>
              <h2 className={styles.sectionTitle}>
                <Heart className={styles.titleIcon} />
                {contactData.services.title}
              </h2>
              
              <div className={styles.servicesGrid}>
                {contactData.services.items.map((service, index) => (
                  <div 
                    key={index} 
                    className={`${styles.serviceCard} ${service.required ? styles.serviceRequired : ''}`}
                  >
                    <div className={styles.serviceHeader}>
                      <h3 className={styles.serviceName}>{service.name}</h3>
                      {service.required && (
                        <span className={styles.requiredBadge}>
                          <AlertCircle size={14} />
                          Required
                        </span>
                      )}
                    </div>
                    <p className={styles.servicePrice}>{service.price}</p>
                    <p className={styles.serviceDescription}>{service.description}</p>
                  </div>
                ))}
              </div>
              
              {contactData.services.note && (
                <div className={styles.serviceNote}>
                  <CheckCircle size={18} />
                  <p>{contactData.services.note}</p>
                </div>
              )}
            </section>
          )}

          {/* Contact Information */}
          <section className={styles.contactSection}>
            <h2 className={styles.sectionTitle}>Get in Touch</h2>
            
            <div className={styles.contactGrid}>
              <a href={`mailto:${contactData.email}`} className={styles.contactCard}>
                <div className={styles.iconWrapper}>
                  <Mail size={20} />
                </div>
                <div className={styles.contactInfo}>
                  <span className={styles.contactLabel}>Email</span>
                  <span className={styles.contactValue}>{contactData.email}</span>
                </div>
              </a>

              <a href={`tel:${contactData.phone}`} className={styles.contactCard}>
                <div className={styles.iconWrapper}>
                  <Phone size={20} />
                </div>
                <div className={styles.contactInfo}>
                  <span className={styles.contactLabel}>Phone</span>
                  <span className={styles.contactValue}>{contactData.phone}</span>
                </div>
              </a>

              <div className={styles.contactCard}>
                <div className={styles.iconWrapper}>
                  <MapPin size={20} />
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
            <section className={styles.socialSection}>
              <h2 className={styles.sectionTitle}>Connect With Me</h2>
              
              <div className={styles.socialGrid}>
                {activeSocial.map((platform, index) => (
                  <a
                    key={index}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.socialButton} ${platform.isPrimary ? styles.primarySocial : ''}`}
                    title={platform.description}
                  >
                    <div className={styles.socialIcon}>
                      <ExternalLink size={20} />
                    </div>
                    <div className={styles.socialInfo}>
                      <span className={styles.socialPlatform}>{platform.platform}</span>
                      <span className={styles.socialUsername}>{platform.username}</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Availability */}
          <section className={styles.availabilitySection}>
            <div className={styles.availabilityCard}>
              <h3 className={styles.availabilityTitle}>Availability</h3>
              <p className={styles.availabilityText}>{contactData.availability}</p>
              <p className={styles.availabilityNote}>{contactData.responseTime}</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

// ============================================
// EXPORTS
// ============================================

export default Contact;