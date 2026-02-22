import React, { useEffect, useState, useMemo } from 'react';
import { LazyImage } from '../../components';
import styles from './PetSitting.module.css';
import petcareData from '../../information/petcare.json';

// Dynamic image import
const importAllImages = () => {
  const images = [];
  try {
    const context = require.context('../../images/Pet & House Care', false, /\.(png|jpe?g|svg|webp)$/);
    context.keys().forEach((key) => {
      const src = context(key);
      const img = new Image();
      img.src = src;
      
      const imageItem = {
        src: src,
        name: key.replace('./', ''),
        dimensions: { width: 1, height: 1 },
        aspectRatio: 1
      };
      
      img.onload = () => {
        imageItem.dimensions = {
          width: img.naturalWidth,
          height: img.naturalHeight
        };
        imageItem.aspectRatio = img.naturalWidth / img.naturalHeight;
      };
      
      images.push(imageItem);
    });
  } catch (error) {
    console.error('Error loading images:', error);
  }
  return images;
};

const PetSitting = () => {
  const [isVisible, setIsVisible] = useState(false);
  const images = useMemo(() => importAllImages(), []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.petSittingWrapper}>
      
      {/* Hero Section */}
      <section className={`${styles.hero} ${isVisible ? styles.visible : ''}`}>
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>{petcareData.hero.badge}</span>
          </div>
          
          <h1 className={styles.heroTitle}>{petcareData.hero.title}</h1>
          <p className={styles.heroSubtitle}>{petcareData.hero.subtitle}</p>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.container}>

        {/* Services Section */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelNumber}>01</span>
            <span className={styles.labelText}>{petcareData.services.sectionLabel}</span>
          </div>
          <h2 className={styles.sectionTitle}>{petcareData.services.title}</h2>

          <div className={styles.servicesGrid}>
            {petcareData.services.items.map((service, index) => (
              <div key={index} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  {service.icon === 'heart' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  )}
                  {service.icon === 'home' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  )}
                  {service.icon === 'sprout' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 20h10M12 20v-8M6 10c0-1.12.14-2.2.4-3.22C8.16 4.89 10.48 3.5 12 3.5s3.84 1.39 5.6 3.28c.26 1.02.4 2.1.4 3.22 0 1.93-.78 3.68-2.05 4.95L12 19.5l-3.95-4.55A6.96 6.96 0 0 1 6 10z" />
                    </svg>
                  )}
                </div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelNumber}>02</span>
            <span className={styles.labelText}>{petcareData.pricing.sectionLabel}</span>
          </div>
          <h2 className={styles.sectionTitle}>{petcareData.pricing.title}</h2>

          <div className={styles.pricingGrid}>
            {petcareData.pricing.items.map((item, index) => (
              <div key={index} className={styles.pricingCard}>
                <div className={styles.pricingHeader}>
                  <svg className={styles.pricingIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <h3 className={styles.pricingDuration}>{item.duration}</h3>
                </div>
                <div className={styles.pricingPrice}>{item.price}</div>
                <p className={styles.pricingDescription}>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery Section */}
        {images.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionLabel}>
              <span className={styles.labelNumber}>03</span>
              <span className={styles.labelText}>{petcareData.gallery.sectionLabel}</span>
            </div>
            <h2 className={styles.sectionTitle}>{petcareData.gallery.title}</h2>
            <p className={styles.sectionSubtitle}>{petcareData.gallery.subtitle}</p>

            <div className={styles.galleryGrid}>
              {images.map((image, index) => (
                <div key={index} className={styles.galleryItem}>
                  <LazyImage
                    src={image.src}
                    alt={image.name}
                    className={styles.galleryImage}
                    threshold={0.01}
                    rootMargin="200px"
                    enableUnload={false}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer Call to Action */}
        <section className={styles.footerSection}>
          <div className={styles.footerCard}>
            <h2 className={styles.footerTitle}>{petcareData.footer.title}</h2>
            <p className={styles.footerMessage}>{petcareData.footer.message}</p>
            <div className={styles.footerDivider}></div>
            <p className={styles.footerMeta}>Helderkruin, Roodepoort</p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PetSitting;
