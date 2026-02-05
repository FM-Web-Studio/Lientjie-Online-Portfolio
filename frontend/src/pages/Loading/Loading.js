import React, { useEffect, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Building2, Ruler, Compass } from 'lucide-react';
import quotesData from '../../information/quotes.json';

// ============================================
// IMPORTS - STYLING
// ============================================

import styles from './Loading.module.css';

// ============================================
// LOADING COMPONENT
// ============================================
// Animated loading screen with progress bar,
// architectural elements, and rotating quotes

const Loading = ({ message = 'Drafting your architectural experience' }) => {
  // ----------------------------------------
  // Hooks & State
  // ----------------------------------------
  
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');
  const [currentQuote, setCurrentQuote] = useState(0);

  // ----------------------------------------
  // Effects
  // ----------------------------------------
  // Animated dots for loading message
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 8;
        return next >= 100 ? 100 : next;
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Rotate quotes every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotesData.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  
  return (
    <div className={styles.container} data-theme={theme}>
      {/* Gradient orbs background */}
      <div className={styles.orbsBackground}>
        <div className={styles.orb} data-position="top-left"></div>
        <div className={styles.orb} data-position="bottom-right"></div>
        <div className={styles.orb} data-position="center"></div>
      </div>

      {/* Main loading card */}
      <div className={styles.loadingCard}>
        {/* Architectural loader */}
        <div className={styles.loaderWrapper}>
          <div className={styles.architecturalLoader}>
            {/* Blueprint grid background */}
            <div className={styles.blueprintGrid}></div>
            
            {/* Rotating architectural tools */}
            <div className={styles.toolsContainer}>
              <div className={styles.tool} data-tool="1">
                <Building2 size={28} strokeWidth={1.5} />
              </div>
              <div className={styles.tool} data-tool="2">
                <Ruler size={24} strokeWidth={1.5} />
              </div>
              <div className={styles.tool} data-tool="3">
                <Compass size={24} strokeWidth={1.5} />
              </div>
            </div>
            
            {/* Center pulse */}
            <div className={styles.centerPulse}></div>
          </div>
        </div>

        {/* Message text */}
        <div className={styles.messageSection}>
          <h2 className={styles.message}>{message}{dots}</h2>
          <p className={styles.subMessage}>Preparing your workspace</p>
        </div>

        {/* Progress bar */}
        <div className={styles.progressWrapper}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            >
              <div className={styles.progressGlow}></div>
            </div>
          </div>
          <div className={styles.progressInfo}>
            <span className={styles.progressPercent}>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Quote Section - ALWAYS VISIBLE */}
        <div className={styles.quoteSection}>
          <p className={styles.quoteText}>
            "{quotesData[currentQuote].quote}"
          </p>
          <p className={styles.quoteAuthor}>
            — {quotesData[currentQuote].artist}
          </p>
        </div>

        {/* Decorative blueprint lines */}
        <div className={styles.blueprintLines}>
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={styles.blueprintLine}
              style={{
                left: `${20 + i * 20}%`,
                animationDelay: `${i * 0.4}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Floating geometric accents */}
      <div className={styles.floatingAccents}>
        <div className={styles.accent} data-accent="1"></div>
        <div className={styles.accent} data-accent="2"></div>
        <div className={styles.accent} data-accent="3"></div>
        <div className={styles.accent} data-accent="4"></div>
      </div>
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================

export default Loading;