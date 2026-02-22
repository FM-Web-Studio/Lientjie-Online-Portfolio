import React, { useEffect, useState } from 'react';
import styles from './Bio.module.css';
import bioData from '../../information/bio.json';
import profile from './Profile.jpg';

const Bio = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(bioData.personal.birthDate);

  return (
    <div className={styles.bioWrapper}>
      
      {/* Hero Section */}
      <section className={`${styles.hero} ${isVisible ? styles.visible : ''}`}>
        <div className={styles.heroContainer}>
          <div className={styles.heroGrid}>
            
            {/* Profile Image */}
            <div className={styles.profileContainer}>
              <div className={styles.profileImageWrapper}>
                <img src={profile} alt={bioData.fullName} className={styles.profileImage} />
                <div className={styles.profileBorder}></div>
              </div>
            </div>

            {/* Hero Content */}
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>
                <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>About Me</span>
              </div>
              
              <h1 className={styles.heroTitle}>{bioData.fullName}</h1>
              <p className={styles.heroSubtitle}>{bioData.professional.headline}</p>
              <p className={styles.heroDescription}>{bioData.summary}</p>

              <div className={styles.heroMeta}>
                <div className={styles.metaItem}>
                  <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{bioData.personal.location}</span>
                </div>
                <div className={styles.metaItem}>
                  <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{age} years old</span>
                </div>
                <div className={styles.metaItem}>
                  <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>{bioData.personal.languages.join(', ')}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.container}>

        {/* Education Section */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelNumber}>01</span>
            <span className={styles.labelText}>Education</span>
          </div>
          <h2 className={styles.sectionTitle}>Academic Journey</h2>

          <div className={styles.timeline}>
            {bioData.education.map((edu, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineLine}></div>
                <div className={styles.timelineMarker}></div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <h3 className={styles.timelineTitle}>{edu.degree || edu.level}</h3>
                    <span className={styles.timelineDate}>
                      {edu.startYear ? `${edu.startYear} - ${edu.expectedGraduation || edu.yearCompleted}` : edu.yearCompleted}
                    </span>
                  </div>
                  <p className={styles.timelineInstitution}>{edu.institution || ''}</p>
                  {edu.status && (
                    <span className={styles.statusBadge}>{edu.status}</span>
                  )}
                  {edu.description && (
                    <p className={styles.timelineDescription}>{edu.description}</p>
                  )}
                  {edu.subjects && (
                    <div className={styles.tags}>
                      {edu.subjects.slice(0, 4).map((subject, i) => (
                        <span key={i} className={styles.tag}>{subject}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelNumber}>02</span>
            <span className={styles.labelText}>Experience</span>
          </div>
          <h2 className={styles.sectionTitle}>Professional Experience</h2>

          <div className={styles.experienceGrid}>
            {bioData.professional_experience.map((exp, index) => (
              <div key={index} className={styles.expCard}>
                <div className={styles.expHeader}>
                  <h3 className={styles.expTitle}>{exp.title}</h3>
                  <span className={styles.expYear}>{exp.year || exp.years}</span>
                </div>
                <p className={styles.expCompany}>{exp.company}</p>
                {exp.responsibilities && (
                  <ul className={styles.expList}>
                    {exp.responsibilities.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
                {exp.skills && (
                  <div className={styles.tags}>
                    {exp.skills.map((skill, i) => (
                      <span key={i} className={styles.tag}>{skill}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelNumber}>03</span>
            <span className={styles.labelText}>Skills & Expertise</span>
          </div>
          <h2 className={styles.sectionTitle}>Technical Proficiency</h2>

          <div className={styles.skillsGrid}>
            {Object.entries(bioData.skills).map(([category, skillsList]) => (
              <div key={category} className={styles.skillCategory}>
                <h3 className={styles.categoryTitle}>
                  {category.replace('_', ' ').split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </h3>
                <div className={styles.skillsList}>
                  {skillsList.map((skill, index) => (
                    <div key={index} className={styles.skillItem}>
                      <div className={styles.skillHeader}>
                        <span className={styles.skillName}>{skill.name}</span>
                        <span className={styles.skillLevel}>{skill.level}%</span>
                      </div>
                      <div className={styles.skillBar}>
                        <div 
                          className={styles.skillProgress}
                          style={{ 
                            width: isVisible ? `${skill.level}%` : '0%',
                            transitionDelay: `${index * 0.05}s`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements Section */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelNumber}>04</span>
            <span className={styles.labelText}>Achievements</span>
          </div>
          <h2 className={styles.sectionTitle}>Notable Accomplishments</h2>

          <div className={styles.achievementsGrid}>
            {bioData.personal.achievements.map((achievement, index) => (
              <div key={index} className={styles.achievementCard}>
                <svg className={styles.achievementIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <p className={styles.achievementText}>{achievement}</p>
              </div>
            ))}
          </div>

          <div className={styles.hobbiesSection}>
            <h3 className={styles.hobbiesTitle}>Interests & Hobbies</h3>
            <div className={styles.tags}>
              {bioData.personal.hobbies.map((hobby, index) => (
                <span key={index} className={styles.tag}>{hobby}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className={styles.footerSection}>
          <div className={styles.footerCard}>
            <p className={styles.footerText}>
              Continuously learning, designing, and creating spaces that inspire.
            </p>
            <div className={styles.footerMeta}>
              <span>{bioData.professional.fieldOfStudy}</span>
              <span>·</span>
              <span>{bioData.personal.nationality}</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Bio;
