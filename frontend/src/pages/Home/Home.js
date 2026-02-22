import React, { useEffect, useState, useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { LazyImage } from '../../components';
import styles from './Home.module.css';
import homeData from '../../information/home.json';

// ============================================
// DYNAMIC IMAGE IMPORT
// ============================================

const importAllImages = () => {
  const images = {};
  try {
    const context = require.context('../../images/Me', false, /\.(png|jpe?g|svg|webp)$/);
    context.keys().forEach((key) => {
      const fileName = key.replace('./', '');
      images[fileName] = context(key);
    });
  } catch (error) {
    console.error('Error loading images from Me folder:', error);
  }
  return images;
};

// ============================================
// HOME COMPONENT
// ============================================

const Home = () => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const imageMap = useMemo(() => importAllImages(), []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.homeWrapper} data-theme={theme}>
      
      {/* Hero Section */}
      <section className={`${styles.hero} ${isVisible ? styles.visible : ''}`}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>{homeData.hero.welcomeMessage}</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              {homeData.hero.name}
            </h1>
            
            <p className={styles.heroSubtitle}>
              {homeData.hero.subtitle}
            </p>
            
            <div className={styles.heroStats}>
              {homeData.hero.stats.map((stat, index) => (
                <div key={index} className={styles.statItem}>
                  <span className={styles.statLabel}>{stat.label}</span>
                  <span className={styles.statValue}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className={styles.container}>

        {/* Journey Section */}
        <section className={styles.journeySection}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelNumber}>01</span>
            <span className={styles.labelText}>{homeData.backstory.sectionLabel}</span>
          </div>
          
          <div className={styles.journeyGrid}>
            <div className={styles.journeyContent}>
              <h2 className={styles.sectionTitle}>{homeData.backstory.title}</h2>
              <p className={styles.journeyText}>{homeData.backstory.description}</p>
              
              <div className={styles.featureList}>
                {homeData.backstory.features.map((feature, index) => (
                  <div key={index} className={styles.featureItem}>
                    <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.journeyQuote}>
              <blockquote className={styles.quote}>
                <svg className={styles.quoteIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                </svg>
                <p>{homeData.backstory.quote}</p>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Passions Section */}
        <section className={styles.passionsSection}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelNumber}>02</span>
            <span className={styles.labelText}>{homeData.passions.sectionLabel}</span>
          </div>
          <h2 className={styles.sectionTitle}>{homeData.passions.title}</h2>
          
          <div className={styles.passionsGrid}>
            {homeData.passions.items.map((passion, index) => (
              <div key={index} className={styles.passionCard}>
                <div className={styles.passionNumber}>{String(index + 1).padStart(2, '0')}</div>
                <h3 className={styles.passionTitle}>{passion.title}</h3>
                <p className={styles.passionText}>{passion.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Memories Section */}
        <section className={styles.memoriesSection}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelNumber}>03</span>
            <span className={styles.labelText}>{homeData.memories.sectionLabel}</span>
          </div>
          <h2 className={styles.sectionTitle}>{homeData.memories.title}</h2>
          <p className={styles.sectionSubtitle}>{homeData.memories.subtitle}</p>

          <div className={styles.memoriesGrid}>
            {homeData.memories.items.map((memory, index) => (
              <article
                key={memory.id}
                className={`${styles.memoryCard} ${isVisible ? styles.visible : ''}`}
                data-accent={memory.accent}
              >
                <div className={styles.memoryImageWrapper}>
                  <LazyImage
                    src={imageMap[memory.image]}
                    alt={memory.title}
                    className={styles.memoryImage}
                    threshold={0.01}
                    rootMargin="200px"
                    enableUnload={false}
                  />
                  <div className={styles.memoryImageOverlay}></div>
                  <span className={styles.memoryBadge}>{memory.date}</span>
                </div>
                
                <div className={styles.memoryContent}>
                  <h3 className={styles.memoryTitle}>{memory.title}</h3>
                  <p className={styles.memoryDescription}>{memory.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className={styles.valuesSection}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelNumber}>04</span>
            <span className={styles.labelText}>{homeData.values.sectionLabel}</span>
          </div>
          <h2 className={styles.sectionTitle}>{homeData.values.title}</h2>
          
          <div className={styles.valuesList}>
            {homeData.values.items.map((value, index) => (
              <div key={index} className={styles.valueItem}>
                <div className={styles.valueNumber}>{value.number}</div>
                <div className={styles.valueContent}>
                  <h3 className={styles.valueTitle}>{value.title}</h3>
                  <p className={styles.valueDescription}>{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Call to Action */}
        <section className={styles.footerSection}>
          <div className={styles.footerCard}>
            <h2 className={styles.footerTitle}>{homeData.footer.title}</h2>
            <p className={styles.footerMessage}>{homeData.footer.message}</p>
            <div className={styles.footerDivider}></div>
            <p className={styles.footerMeta}>{homeData.footer.meta}</p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;