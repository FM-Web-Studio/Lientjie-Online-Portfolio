import React, { useEffect, useState, useMemo } from 'react';
import { Heart, Home, Sprout, Clock } from 'lucide-react';
import { LazyImage } from '../../components';

// ============================================
// IMPORTS - STYLING & DATA
// ============================================

import styles from './PetSitting.module.css';
import petcareData from '../../information/petcare.json';

// ============================================
// DYNAMIC IMAGE IMPORT
// ============================================

const importAllImages = () => {
  const images = [];
  try {
    const context = require.context('../../images/Pet & House Care', false, /\.(png|jpe?g|svg|webp)$/);
    context.keys().forEach((key) => {
      images.push({
        src: context(key),
        name: key.replace('./', '')
      });
    });
  } catch (error) {
    console.error('Error loading images from Pet & House Care folder:', error);
  }
  return images;
};

// ============================================
// ICON MAPPER
// ============================================

const getIcon = (iconName, size = 24) => {
  const icons = {
    heart: <Heart size={size} />,
    home: <Home size={size} />,
    sprout: <Sprout size={size} />,
    clock: <Clock size={size} />
  };
  return icons[iconName] || <Heart size={size} />;
};

// ============================================
// PET SITTING COMPONENT
// ============================================

const PetSitting = () => {
  // ----------------------------------------
  // State
  // ----------------------------------------
  
  const [isVisible, setIsVisible] = useState(false);
  const images = useMemo(() => importAllImages(), []);

  // ----------------------------------------
  // Effects
  // ----------------------------------------
  
  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  
  return (
    <div className={styles.petSittingWrapper}>
      
      {/* Decorative Background */}
      <div className={styles.backgroundDecor} aria-hidden="true">
        <div className={styles.decorCircle} style={{ top: '10%', left: '5%' }}></div>
        <div className={styles.decorCircle} style={{ top: '60%', right: '10%' }}></div>
        <div className={styles.decorCircle} style={{ bottom: '20%', left: '15%' }}></div>
      </div>
      
      <div className={styles.container}>
        
        {/* Hero Section */}
        <header className={`${styles.hero} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.heroContent}>
            <div className={styles.welcomeBadge}>
              <Heart className={styles.badgeIcon} size={18} />
              <span>{petcareData.hero.badge}</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              {petcareData.hero.title}
            </h1>
            
            <p className={styles.heroSubtitle}>
              {petcareData.hero.subtitle}
            </p>
          </div>
        </header>

        {/* Services Section */}
        <section className={`${styles.servicesSection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionLabel}>
              <span className={styles.labelNumber}>01</span>
              <span className={styles.labelText}>{petcareData.services.sectionLabel}</span>
            </div>
            <h2 className={styles.sectionTitle}>{petcareData.services.title}</h2>
          </div>
          
          <div className={styles.servicesGrid}>
            {petcareData.services.items.map((service, index) => (
              <div key={index} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  {getIcon(service.icon)}
                </div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery Section */}
        {images.length > 0 && (
          <section className={styles.gallerySection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionLabel}>
                <span className={styles.labelNumber}>02</span>
                <span className={styles.labelText}>{petcareData.gallery.sectionLabel}</span>
              </div>
              <h2 className={styles.sectionTitle}>{petcareData.gallery.title}</h2>
              <p className={styles.sectionSubtitle}>
                {petcareData.gallery.subtitle}
              </p>
            </div>

            <div className={styles.galleryGrid}>
              {images.map((image, index) => (
                <article
                  key={index}
                  className={`${styles.galleryCard} ${isVisible ? styles.visible : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.cardImageWrapper}>
                    <LazyImage
                      src={image.src}
                      alt={`Pet sitting memory ${index + 1}`}
                      className={styles.cardImage}
                      threshold={0.01}
                      rootMargin="200px"
                      enableUnload={false}
                    />
                    <div className={styles.cardImageGradient}></div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Pricing Section */}
        <section className={styles.pricingSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionLabel}>
              <span className={styles.labelNumber}>03</span>
              <span className={styles.labelText}>{petcareData.pricing.sectionLabel}</span>
            </div>
            <h2 className={styles.sectionTitle}>{petcareData.pricing.title}</h2>
          </div>
          
          <div className={styles.pricingGrid}>
            {petcareData.pricing.items.map((item, index) => (
              <div key={index} className={styles.pricingCard}>
                <div className={styles.pricingHeader}>
                  <Clock className={styles.pricingIcon} size={20} />
                  <h3 className={styles.pricingDuration}>{item.duration}</h3>
                </div>
                <div className={styles.pricingPrice}>{item.price}</div>
                <p className={styles.pricingDescription}>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <footer className={styles.footer}>
          <div className={styles.footerCard}>
            <Heart className={styles.footerIcon} size={48} />
            <h2 className={styles.footerTitle}>{petcareData.footer.title}</h2>
            <p className={styles.footerText}>
              {petcareData.footer.message}
            </p>
          </div>
        </footer>
        
      </div>
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================

export default PetSitting;
