import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { Home, ArrowLeft } from 'lucide-react';
import quotesData from '../../information/quotes.json';

// ============================================
// IMPORTS - STYLING
// ============================================

import styles from './NotFound.module.css';

// ============================================
// NOT FOUND COMPONENT
// ============================================
// 404 error page with navigation options
// and rotating architectural quotes

const NotFound = () => {
  // ----------------------------------------
  // Hooks & State
  // ----------------------------------------
  
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);

  // ----------------------------------------
  // Effects
  // ----------------------------------------
  // Trigger entrance animation
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Rotate quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteVisible(false);
      
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % quotesData.length);
        setQuoteVisible(true);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  
  return (
    <div className={styles.container} data-theme={theme}>
      {/* Background Gradient Orbs */}
      <div className={styles.backgroundOrbs} aria-hidden="true">
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className={styles.orb3}></div>
      </div>

      {/* Main Content */}
      <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
        <div className={styles.glassContainer}>
          
          {/* 404 Number */}
          <div className={styles.errorNumber}>
            <span className={styles.number}>4</span>
            <span className={`${styles.number} ${styles.middle}`}>0</span>
            <span className={styles.number}>4</span>
          </div>

          {/* Title & Message */}
          <h1 className={styles.title}>Page Not Found</h1>
          <p className={styles.message}>
            The structure you're looking for seems to have been demolished.
            Let's navigate you back to solid ground.
          </p>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button 
              onClick={() => navigate('/')} 
              className={styles.btnPrimary}
            >
              <Home size={20} />
              <span>Go Home</span>
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className={styles.btnSecondary}
            >
              <ArrowLeft size={20} />
              <span>Go Back</span>
            </button>
          </div>

          {/* Quote Block */}
          <div className={styles.quoteSection}>
            <div className={`${styles.quoteContainer} ${quoteVisible ? styles.quoteVisible : ''}`}>
              <div className={styles.quoteIcon}>"</div>
              <blockquote className={styles.quote}>
                {quotesData[currentQuote].quote}
              </blockquote>
              <cite className={styles.author}>— {quotesData[currentQuote].artist}</cite>
            </div>
            
            {/* Quote navigation dots */}
            <div className={styles.quoteDots}>
              {quotesData.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentQuote ? styles.dotActive : ''}`}
                  onClick={() => {
                    setQuoteVisible(false);
                    setTimeout(() => {
                      setCurrentQuote(index);
                      setQuoteVisible(true);
                    }, 300);
                  }}
                  aria-label={`Go to quote ${index + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className={styles.floatingShapes} aria-hidden="true">
        <div className={styles.shape} data-shape="1"></div>
        <div className={styles.shape} data-shape="2"></div>
        <div className={styles.shape} data-shape="3"></div>
      </div>
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================

export default NotFound;