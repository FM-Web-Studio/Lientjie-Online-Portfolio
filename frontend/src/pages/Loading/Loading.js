import React, { useEffect, useState } from 'react';
import styles from './Loading.module.css';
import quotesData from '../../information/quotes.json';

const Loading = ({ message = 'Preparing your architectural experience' }) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');
  const [currentQuote, setCurrentQuote] = useState(0);

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
        const next = prev + Math.random() * 10;
        return next >= 100 ? 100 : next;
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Rotate quotes every 6 seconds
  useEffect(() => {
    if (quotesData.length > 0) {
      const interval = setInterval(() => {
        setCurrentQuote((prev) => (prev + 1) % quotesData.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className={styles.loadingWrapper}>
      
      {/* Background decorative elements */}
      <div className={styles.background}>
        <div className={styles.orb} data-position="1"></div>
        <div className={styles.orb} data-position="2"></div>
        <div className={styles.orb} data-position="3"></div>
      </div>

      {/* Main loading content */}
      <div className={styles.loadingCard}>
        
        {/* Animated loader icon */}
        <div className={styles.loaderContainer}>
          <div className={styles.loader}>
            <div className={styles.loaderRing}></div>
            <div className={styles.loaderRing}></div>
            <div className={styles.loaderRing}></div>
            
            {/* Center icon */}
            <svg className={styles.loaderIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        </div>

        {/* Loading message */}
        <div className={styles.messageSection}>
          <h2 className={styles.message}>{message}{dots}</h2>
          <p className={styles.subMessage}>Building your workspace</p>
        </div>

        {/* Progress bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className={styles.progressPercent}>{Math.round(progress)}%</span>
        </div>

        {/* Quote display */}
        {quotesData.length > 0 && (
          <div className={styles.quoteSection}>
            <svg className={styles.quoteIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
            </svg>
            <p className={styles.quoteText}>
              {quotesData[currentQuote].quote}
            </p>
            <p className={styles.quoteAuthor}>
              — {quotesData[currentQuote].artist}
            </p>
          </div>
        )}
      </div>

      {/* Floating decorative accents */}
      <div className={styles.floatingAccents}>
        <div className={styles.accent} data-accent="1"></div>
        <div className={styles.accent} data-accent="2"></div>
        <div className={styles.accent} data-accent="3"></div>
        <div className={styles.accent} data-accent="4"></div>
        <div className={styles.accent} data-accent="5"></div>
        <div className={styles.accent} data-accent="6"></div>
      </div>
    </div>
  );
};

export default Loading;
