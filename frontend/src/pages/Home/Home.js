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
      
      {/* Decorative Background */}
      <div className={styles.backgroundDecor} aria-hidden="true">
        <div className={styles.decorCircle} style={{ top: '10%', left: '5%' }}></div>
        <div className={styles.decorCircle} style={{ top: '60%', right: '10%' }}></div>
        <div className={styles.decorCircle} style={{ bottom: '20%', left: '15%' }}></div>
      </div>
      
      {/* Main Container */}
      <div className={styles.container}>
        
        {/* Header Section */}
        <header className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.headerContent}>
            <div className={styles.statusBadge}>
              <span className={styles.statusDot}></span>
              <span>Living with Purpose</span>
            </div>
            
            <h1 className={styles.pageTitle}>
              Welcome to My World
            </h1>
            
            <p className={styles.pageSubtitle}>
              Where Architecture, Adventure, and Passion Converge
            </p>
          </div>
        </header>

        {/* Story Section */}
        <section className={`${styles.storySection} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.storyCard}>
            <div className={styles.storyHeader}>
              <div className={styles.storyIconWrapper}>
                <svg 
                  className={styles.storyIcon} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h2 className={styles.storyTitle}>{homeData.backstory.title}</h2>
            </div>
            
            <div className={styles.storyContent}>
              <p className={styles.storyText}>
                {homeData.backstory.description}
              </p>
            </div>
          </div>
        </section>

        {/* Memories Section */}
        <section className={styles.memoriesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Captured Moments</h2>
            <p className={styles.sectionSubtitle}>
              A visual journey through experiences that shaped who I am
            </p>
          </div>

          <div className={styles.memoriesGrid}>
            {homeData.memories.map((memory, index) => (
              <article
                key={memory.id}
                className={`${styles.memoryCard} ${styles.visible}`}
                data-accent={memory.accent}
              >
                <div className={styles.cardImageWrapper}>
                  <LazyImage
                    src={imageMap[memory.image]}
                    alt={memory.title}
                    className={styles.cardImage}
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

        {/* Footer Section */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p className={styles.footerText}>
              More adventures to come...
            </p>
            <div className={styles.footerDots}>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
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