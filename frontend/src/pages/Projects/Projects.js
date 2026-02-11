import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Building2, Search, X, Play, Image as ImageIcon, FolderOpen } from 'lucide-react';
import styles from './Projects.module.css';
import projectsData from '../../information/projects.json';
import { LazyImage } from '../../components';

// ============================================
// ARCHITECTURE PROJECTS COMPONENT
// ============================================

const Projects = () => {
  // ----------------------------------------
  // State Management
  // ----------------------------------------
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);

  // ----------------------------------------
  // Effects
  // ----------------------------------------
  
  // Trigger entrance animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedMedia) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMedia]);

  // ----------------------------------------
  // Media Loading Functions
  // ----------------------------------------
  
  // Dynamically import images and videos from project folders
  const importProjectMedia = (folderName) => {
    const media = [];
    
    try {
      // Import images
      const imageContext = require.context(
        '../../images/Projects',
        true,
        /\.(png|jpe?g|svg|webp)$/
      );
      
      imageContext.keys().forEach((key) => {
        const folderMatch = key.match(/^\.\/([^/]+)\//);
        if (folderMatch && folderMatch[1] === folderName) {
          const src = imageContext(key);
          
          // Load image to get dimensions
          const img = new Image();
          img.src = src;
          
          const mediaItem = {
            type: 'image',
            src: src,
            path: key,
            name: key.split('/').pop(),
            dimensions: { width: 1, height: 1 },
            aspectRatio: 1
          };
          
          // Update dimensions when image loads
          img.onload = () => {
            mediaItem.dimensions = {
              width: img.naturalWidth,
              height: img.naturalHeight
            };
            mediaItem.aspectRatio = img.naturalWidth / img.naturalHeight;
          };
          
          media.push(mediaItem);
        }
      });

      // Import videos
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
        // No videos in this project
        console.log(`No videos found in ${folderName}`);
      }
    } catch (error) {
      console.error(`Error loading media from ${folderName}:`, error);
    }
    
    return media;
  };

  // ----------------------------------------
  // Data Processing
  // ----------------------------------------
  
  // Build projects collection with media
  const projects = useMemo(() => {
    return projectsData.projects.map(project => ({
      ...project,
      media: importProjectMedia(project.folder)
    }));
  }, []);

  // Filter projects based on search
  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;
    
    return projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  // ----------------------------------------
  // Event Handlers
  // ----------------------------------------
  
  const handleMediaClick = (media, project) => {
    setSelectedMedia({ ...media, project });
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
  };

  // ----------------------------------------
  // Render
  // ----------------------------------------
  
  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <Building2 className={styles.heroIcon} size={64} />
        <h1 className={styles.heroTitle}>Architecture Portfolio</h1>
        <p className={styles.heroSubtitle}>
          Exploring the intersection of space, form, and function through thoughtful design
        </p>
      </section>

      {/* Search Bar */}
      <div className={styles.searchSection}>
        <div className={styles.searchBox}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search projects by name, category, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className={styles.clearBtn}>
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Projects Section */}
      <div className={styles.projectsContainer}>
        {filteredProjects.length === 0 ? (
          <div className={styles.emptyState}>
            <FolderOpen size={64} />
            <h3>No projects found</h3>
            <p>Try adjusting your search terms</p>
          </div>
        ) : (
          filteredProjects.map((project, index) => (
            <section
              key={project.id}
              id={`project-${project.id}`}
              className={styles.projectSection}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Project Header */}
              <div className={styles.projectHeader}>
                <div className={styles.projectNumber}>
                  {String(project.id).padStart(2, '0')}
                </div>
                <div className={styles.projectInfo}>
                  <h2 className={styles.projectTitle}>{project.name}</h2>
                  <div className={styles.projectMeta}>
                    <span className={styles.projectCategory}>{project.category}</span>
                    <span className={styles.projectYear}>{project.year}</span>
                  </div>
                  <p className={styles.projectDescription}>{project.description}</p>
                </div>
              </div>

              {/* Project Media Grid */}
              {project.media.length > 0 ? (
                <div className={styles.mediaGrid}>
                  {project.media.map((media, mediaIndex) => {
                    // Determine aspect ratio class
                    const aspectRatio = media.aspectRatio || 1;
                    
                    let sizeClass = styles.square;
                    if (aspectRatio > 1.3) sizeClass = styles.landscape;
                    else if (aspectRatio < 0.7) sizeClass = styles.portrait;
                    else if (aspectRatio > 1.6) sizeClass = styles.wideLandscape;
                    else if (aspectRatio < 0.5) sizeClass = styles.tallPortrait;
                    
                    return (
                    <div
                      key={`${project.id}-${mediaIndex}`}
                      className={`${styles.mediaItem} ${sizeClass}`}
                      onClick={() => handleMediaClick(media, project)}
                    >
                      {media.type === 'image' ? (
                        <div className={styles.mediaImageWrapper}>
                          <LazyImage 
                            src={media.src} 
                            alt={media.name}
                            threshold={0.01}
                            rootMargin="200px"
                            enableUnload={false}
                          />
                          <div className={styles.mediaOverlay}>
                            <ImageIcon size={32} />
                            <span>View Image</span>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.mediaVideoWrapper}>
                          <video src={media.src} />
                          <div className={styles.mediaOverlay}>
                            <Play size={48} />
                            <span>Play Video</span>
                          </div>
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.noMedia}>
                  <FolderOpen size={48} />
                  <p>No media files in this project yet</p>
                </div>
              )}
            </section>
          ))
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && ReactDOM.createPortal(
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.closeBtn} onClick={closeLightbox}>
            <X size={32} />
          </button>
          
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            {selectedMedia.type === 'image' ? (
              <LazyImage 
                src={selectedMedia.src} 
                alt={selectedMedia.name}
                className={styles.lightboxImage}
                threshold={0}
                rootMargin="0px"
                enableUnload={false}
              />
            ) : (
              <video 
                src={selectedMedia.src}
                controls
                autoPlay
                className={styles.lightboxVideo}
              />
            )}
            
            <div className={styles.lightboxInfo}>
              <h3>{selectedMedia.project.name}</h3>
              <p>{selectedMedia.name}</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================

export default Projects;
