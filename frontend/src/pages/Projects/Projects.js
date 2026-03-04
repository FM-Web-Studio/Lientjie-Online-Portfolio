import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import styles from './Projects.module.css';
import projectsData from '../../information/projects.json';
import { LazyImage } from '../../components';

// Dynamically import images and videos from project folders
const importProjectMedia = (folderName) => {
  const media = [];
  
  try {
    const imageContext = require.context(
      '../../images/Projects',
      true,
      /\.(png|jpe?g|svg|webp)$/
    );
    
    imageContext.keys().forEach((key) => {
      const folderMatch = key.match(/^\.\/([^/]+)\//);
      if (folderMatch && folderMatch[1] === folderName) {
        media.push({
          type: 'image',
          src: imageContext(key),
          path: key,
          name: key.split('/').pop()
        });
      }
    });

    try {
      const videoContext = require.context(
        '../../images/Projects',
        true,
        /\.(mp4|webm|ogg|mov)$/
      );
      
      videoContext.keys().forEach((key) => {
        const folderMatch = key.match(/^\.\/([^/]+)\//);
        if (folderMatch && folderMatch[1] === folderName) {
          media.push({
            type: 'video',
            src: videoContext(key),
            path: key,
            name: key.split('/').pop()
          });
        }
      });
    } catch (error) {
      console.log(`No videos found in ${folderName}`);
    }
  } catch (error) {
    console.error(`Error loading media from ${folderName}:`, error);
  }
  
  return media;
};

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedMedia) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      // Add escape key handler
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setSelectedMedia(null);
        }
      };
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }, [selectedMedia]);

  const projects = useMemo(() => {
    return projectsData.projects.map(project => ({
      ...project,
      media: importProjectMedia(project.folder)
    }));
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;
    
    return projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  const handleMediaClick = (media, project) => {
    setSelectedMedia({ ...media, project });
  };

  const closeLightbox = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedMedia(null);
  };

  return (
    <div className={styles.projectsWrapper}>
      
      {/* Hero Section */}
      <section className={`${styles.hero} ${isVisible ? styles.visible : ''}`}>
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Portfolio</span>
          </div>
          <h1 className={styles.heroTitle}>Architecture Projects</h1>
          <p className={styles.heroSubtitle}>
            Exploring spatial design, form, and function through creative architectural solutions
          </p>

          {/* Search Bar */}
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className={styles.clearBtn}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Projects Container */}
      <div className={styles.container}>
        {filteredProjects.length === 0 ? (
          <div className={styles.emptyState}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <h3 className={styles.emptyTitle}>No projects found</h3>
            <p className={styles.emptyText}>Try adjusting your search terms</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <section key={project.id} className={styles.projectSection}>
              
              {/* Project Header */}
              <div className={styles.projectHeader}>
                <div className={styles.projectNumber}>{String(project.id).padStart(2, '0')}</div>
                <div className={styles.projectInfo}>
                  <h2 className={styles.projectTitle}>{project.name}</h2>
                  <div className={styles.projectMeta}>
                    <span className={styles.projectCategory}>{project.category}</span>
                    <span className={styles.projectYear}>{project.year}</span>
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <p className={styles.projectDescription}>{project.description}</p>

              {/* Project Media */}
              {project.media.length > 0 ? (
                <div className={styles.mediaGrid}>
                  {project.media.map((media, mediaIndex) => (
                    <div
                      key={mediaIndex}
                      className={styles.mediaItem}
                      onClick={() => handleMediaClick(media, project)}
                    >
                      {media.type === 'image' ? (
                        <>
                          <LazyImage 
                            src={media.src} 
                            alt={media.name}
                            className={styles.mediaImage}
                            threshold={0.01}
                            rootMargin="200px"
                            enableUnload={false}
                          />
                          <div className={styles.mediaOverlay}>
                            <svg className={styles.overlayIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                            <span className={styles.overlayText}>View Image</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <video src={media.src} className={styles.mediaVideo} />
                          <div className={styles.mediaOverlay}>
                            <svg className={styles.overlayIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            <span className={styles.overlayText}>Play Video</span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noMedia}>
                  <svg className={styles.noMediaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  <p className={styles.noMediaText}>No media files in this project</p>
                </div>
              )}
            </section>
          ))
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && ReactDOM.createPortal(
        <div className={styles.lightboxBackdrop} onClick={(e) => closeLightbox(e)}>
          <div className={styles.lightboxContainer} onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button 
              className={styles.lightboxCloseBtn} 
              onClick={(e) => closeLightbox(e)} 
              aria-label="Close"
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Media container */}
            <div className={styles.lightboxMediaWrapper}>
              {selectedMedia.type === 'image' ? (
                <img 
                  src={selectedMedia.src} 
                  alt={selectedMedia.name}
                  className={styles.lightboxMedia}
                />
              ) : (
                <video 
                  src={selectedMedia.src}
                  controls
                  autoPlay
                  className={styles.lightboxMedia}
                />
              )}
            </div>

            {/* Info bar */}
            <div className={styles.lightboxInfoBar}>
              <div className={styles.lightboxInfoContent}>
                <span className={styles.lightboxProjectName}>{selectedMedia.project.name}</span>
                <span className={styles.lightboxDivider}>•</span>
                <span className={styles.lightboxFileName}>{selectedMedia.name}</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Projects;
