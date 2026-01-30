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

  // Architecture-themed icons
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
        <ul className={styles.linkList}>
          {links && links.slice(0, 7).map((link, index) => {
            const Icon = ICONS[index] || Home;
            const isHovered = hoveredLink === index;
            const active = isActive(link, index);
            
            return (
              <li key={`nav-${index}`} className={styles.linkItem}>
                <div
                  className={`${styles.link} ${isHovered ? styles.linkHovered : ''} ${active ? styles.linkActive : ''}`}
                  onClick={() => handleLinkClick(link, index)}
                  onMouseEnter={() => setHoveredLink(index)}
                  onMouseLeave={() => setHoveredLink(null)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleLinkClick(link, index);
                    }
                  }}
                  data-index={index}
                  aria-current={active ? 'page' : undefined}
                >
                  <div className={styles.linkIcon}>
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <span className={styles.linkLabel}>{link.label}</span>
                  {/* Architectural line underline */}
                  <div className={styles.architectLine}></div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;