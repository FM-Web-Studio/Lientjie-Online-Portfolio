import React, { useEffect, useState, useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { LazyImage } from '../../components';

// ============================================
// IMPORTS - STYLING
// ============================================

import styles from './Home.module.css';

// ============================================
// IMPORTS - DATA
// ============================================

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
  // ----------------------------------------
  // Hooks & State
  // ----------------------------------------
  
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  
  const imageMap = useMemo(() => importAllImages(), []);

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
    <div className={styles.homeWrapper} data-theme={theme}>
      
      {/* Decorative Background Elements */}
      <div className={styles.backgroundDecor} aria-hidden="true">
        <div className={styles.decorCircle} style={{ top: '10%', left: '5%' }}></div>
        <div className={styles.decorCircle} style={{ top: '60%', right: '10%' }}></div>
        <div className={styles.decorCircle} style={{ bottom: '20%', left: '15%' }}></div>
      </div>
      
      {/* Architectural Grid Overlay */}
      <div className={styles.gridOverlay} aria-hidden="true"></div>
      
      {/* Main Container */}
      <div className={styles.container}>
        
        {/* Hero Header Section */}
        <header className={`${styles.hero} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.heroContent}>
            <div className={styles.welcomeBadge}>
              <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
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
                  <div className={styles.statIcon}>
                    {index === 0 && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      </svg>
                    )}
                    {index === 1 && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    )}
                    {index === 2 && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
                      </svg>
                    )}
                  </div>
                  <div className={styles.statContent}>
                    <div className={styles.statLabel}>{stat.label}</div>
                    <div className={styles.statValue}>{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* My Story Section */}
        <section className={`${styles.storySection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.storyGrid}>
            <div className={styles.storyContent}>
              <div className={styles.sectionLabel}>
                <span className={styles.labelNumber}>01</span>
                <span className={styles.labelText}>{homeData.backstory.sectionLabel}</span>
              </div>
              
              <h2 className={styles.storyTitle}>{homeData.backstory.title}</h2>
              
              <p className={styles.storyText}>
                {homeData.backstory.description}
              </p>
              
              <div className={styles.storyFeatures}>
                {homeData.backstory.features.map((feature, index) => (
                  <div key={index} className={styles.featureItem}>
                    <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {index === 0 && (
                        <>
                          <path d="M12 2L2 7l10 5 10-5-10-5z" />
                          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                        </>
                      )}
                      {index === 2 && (
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      )}
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.storyVisual}>
              <div className={styles.visualCard}>
                <svg className={styles.visualIcon} viewBox="0 0 200 200" fill="none">
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: 'var(--accent-1)', stopOpacity: 0.8}} />
                      <stop offset="100%" style={{stopColor: 'var(--accent-2)', stopOpacity: 0.8}} />
                    </linearGradient>
                  </defs>
                  
                  {/* Building outline */}
                  <rect x="60" y="80" width="80" height="100" fill="url(#grad1)" opacity="0.2" />
                  <rect x="60" y="80" width="80" height="100" stroke="url(#grad1)" strokeWidth="2" fill="none" />
                  
                  {/* Windows */}
                  <rect x="70" y="90" width="15" height="15" fill="url(#grad1)" />
                  <rect x="90" y="90" width="15" height="15" fill="url(#grad1)" />
                  <rect x="110" y="90" width="15" height="15" fill="url(#grad1)" />
                  <rect x="70" y="110" width="15" height="15" fill="url(#grad1)" />
                  <rect x="90" y="110" width="15" height="15" fill="url(#grad1)" />
                  <rect x="110" y="110" width="15" height="15" fill="url(#grad1)" />
                  <rect x="70" y="130" width="15" height="15" fill="url(#grad1)" />
                  <rect x="90" y="130" width="15" height="15" fill="url(#grad1)" />
                  <rect x="110" y="130" width="15" height="15" fill="url(#grad1)" />
                  
                  {/* Roof */}
                  <path d="M 50 80 L 100 50 L 150 80 Z" stroke="url(#grad1)" strokeWidth="2" fill="url(#grad1)" opacity="0.3" />
                  
                  {/* Foundation line */}
                  <line x1="40" y1="180" x2="160" y2="180" stroke="url(#grad1)" strokeWidth="3" />
                </svg>
                
                <div className={styles.visualQuote}>
                  {homeData.backstory.quote}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Passions Grid Section */}
        <section className={styles.passionsSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionLabel}>
              <span className={styles.labelNumber}>02</span>
              <span className={styles.labelText}>{homeData.passions.sectionLabel}</span>
            </div>
            <h2 className={styles.sectionTitle}>{homeData.passions.title}</h2>
          </div>
          
          <div className={styles.passionsGrid}>
            {homeData.passions.items.map((passion, index) => (
              <div key={index} className={styles.passionCard}>
                <div className={styles.passionIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {index === 0 && (
                      <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    )}
                    {index === 1 && (
                      <>
                        <circle cx="12" cy="8" r="1.5"/>
                        <path d="M12 9.5v3M14.5 14.5L12 12.5l-2.5 2M8.5 17.5l1-1.5M15.5 17.5l-1-1.5M12 18v3" />
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                        <line x1="16" y1="8" x2="2" y2="22" />
                        <line x1="17.5" y1="15" x2="9" y2="15" />
                      </>
                    )}
                    {index === 3 && (
                      <>
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </>
                    )}
                  </svg>
                </div>
                <h3 className={styles.passionTitle}>{passion.title}</h3>
                <p className={styles.passionText}>{passion.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Memories Section */}
        <section className={styles.memoriesSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionLabel}>
              <span className={styles.labelNumber}>03</span>
              <span className={styles.labelText}>{homeData.memories.sectionLabel}</span>
            </div>
            <h2 className={styles.sectionTitle}>{homeData.memories.title}</h2>
            <p className={styles.sectionSubtitle}>
              {homeData.memories.subtitle}
            </p>
          </div>

          <div className={styles.memoriesGrid}>
            {homeData.memories.items.map((memory, index) => (
              <article
                key={memory.id}
                className={`${styles.memoryCard} ${isVisible ? styles.visible : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
                data-accent={memory.accent}
              >
                <div className={styles.cardImageWrapper}>
                  <LazyImage
                    src={imageMap[memory.image]}
                    alt={memory.title}
                    className={styles.cardImage}
                    threshold={0.01}
                    rootMargin="200px"
                    enableUnload={false}
                  />
                  <div className={styles.cardImageGradient}></div>
                  <span className={styles.cardBadge}>{memory.date}</span>
                </div>
                
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{memory.title}</h3>
                  <p className={styles.cardDescription}>{memory.description}</p>
                </div>
                
                <div className={styles.cardFooter}>
                  <div className={styles.accentLine}></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className={styles.valuesSection}>
          <div className={styles.valuesContent}>
            <div className={styles.sectionLabel}>
              <span className={styles.labelNumber}>04</span>
              <span className={styles.labelText}>{homeData.values.sectionLabel}</span>
            </div>
            <h2 className={styles.valuesTitle}>{homeData.values.title}</h2>
            
            <div className={styles.valuesList}>
              {homeData.values.items.map((value, index) => (
                <div key={index} className={styles.valueItem}>
                  <div className={styles.valueNumber}>{value.number}</div>
                  <div className={styles.valueContent}>
                    <h3 className={styles.valueTitle}>{value.title}</h3>
                    <p className={styles.valueText}>{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Call to Action */}
        <footer className={styles.footer}>
          <div className={styles.footerCard}>
            <h2 className={styles.footerTitle}>{homeData.footer.title}</h2>
            <p className={styles.footerText}>
              {homeData.footer.message}
            </p>
            <div className={styles.footerDivider}></div>
            <div className={styles.footerMeta}>
              <span>{homeData.footer.meta}</span>
              <div className={styles.footerDots}>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
              </div>
            </div>
          </div>
        </footer>
        
      </div>
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================

export default Home;