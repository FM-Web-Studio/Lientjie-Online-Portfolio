import React, { useState } from "react";
import { Home, User, Briefcase, Mail, FileText, Info, Settings } from 'lucide-react';
import styles from "./NavigationBar.module.css";

const NavigationBar = ({ 
  links, 
  onNavigate,
  activeTab = null,
  className = ""
}) => {
  const [hoveredLink, setHoveredLink] = useState(null);

  // Icons mapping
  const ICONS = [Home, User, Briefcase, Mail, FileText, Info, Settings];

  const handleLinkClick = (link, index) => {
    if (link.onClick) link.onClick();
    if (link.to) onNavigate(link.to, index);
  };

  const isActive = (link, index) => {
    if (activeTab !== null) {
      return activeTab === index || activeTab === link.to;
    }
    return false;
  };

  return (
    <nav className={`${styles.navbar} ${className}`}>
      <div className={styles.navContent}>
        <div className={styles.glassContainer}>
          <ul className={styles.linkList}>
            {links && links.slice(0, 7).map((link, index) => {
              const Icon = ICONS[index] || Home;
              const isHovered = hoveredLink === index;
              const active = isActive(link, index);
              
              return (
                <li key={`nav-${index}`} className={styles.linkItem}>
                  <button
                    className={`${styles.link} ${isHovered ? styles.linkHovered : ''} ${active ? styles.linkActive : ''}`}
                    onClick={() => handleLinkClick(link, index)}
                    onMouseEnter={() => setHoveredLink(index)}
                    onMouseLeave={() => setHoveredLink(null)}
                    aria-current={active ? 'page' : undefined}
                  >
                    <div className={styles.iconWrapper}>
                      <Icon size={18} strokeWidth={2.5} />
                    </div>
                    <span className={styles.linkLabel}>{link.label}</span>
                    <div className={styles.activeIndicator}></div>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className={styles.liquidEffect}></div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;