import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';
import quotesData from '../../information/quotes.json';

const NotFound = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);

  // Trigger entrance animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Rotate quotes every 8 seconds
  useEffect(() => {
    if (quotesData.length > 0) {
      const interval = setInterval(() => {
        setCurrentQuote((prev) => (prev + 1) % quotesData.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className={styles.notFoundWrapper}>
      
      {/* Background decorative elements */}
      <div className={styles.background}>
        <div className={styles.orb} data-position="1"></div>
        <div className={styles.orb} data-position="2"></div>
        <div className={styles.orb} data-position="3"></div>
      </div>

      {/* Main content */}
      <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
        
        {/* 404 Error display */}
        <div className={styles.errorSection}>
          <div className={styles.errorNumber}>
            <span className={styles.digit}>4</span>
            <div className={styles.digitMiddle}>
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M50 10 L50 90 M10 50 L90 50" />
                <circle cx="50" cy="50" r="35" />
                <path d="M35 35 L65 65 M65 35 L35 65" opacity="0.3" />
              </svg>
            </div>
            <span className={styles.digit}>4</span>
          </div>
          
          <h1 className={styles.errorTitle}>Page Not Found</h1>
          <p className={styles.errorMessage}>
            The blueprint you're looking for seems to have been misplaced. 
            Let's navigate you back to familiar ground.
          </p>
        </div>

        {/* Action buttons */}
        <div className={styles.actions}>
          <button 
            onClick={() => navigate('/')} 
            className={styles.btnPrimary}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Return Home</span>
          </button>
          
          <button 
            onClick={() => navigate(-1)} 
            className={styles.btnSecondary}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Go Back</span>
          </button>
        </div>

        {/* Quote section */}
        {quotesData.length > 0 && (
          <div className={styles.quoteSection}>
            <svg className={styles.quoteIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
            </svg>
            
            <blockquote className={styles.quote}>
              {quotesData[currentQuote].quote}
            </blockquote>
            
            <cite className={styles.author}>
              — {quotesData[currentQuote].artist}
            </cite>
            
            {/* Quote navigation dots */}
            <div className={styles.quoteDots}>
              {quotesData.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentQuote ? styles.dotActive : ''}`}
                  onClick={() => setCurrentQuote(index)}
                  aria-label={`View quote ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating decorative shapes */}
      <div className={styles.floatingShapes}>
        <div className={styles.shape} data-shape="1"></div>
        <div className={styles.shape} data-shape="2"></div>
        <div className={styles.shape} data-shape="3"></div>
        <div className={styles.shape} data-shape="4"></div>
        <div className={styles.shape} data-shape="5"></div>
      </div>
    </div>
  );
};

export default NotFound;
