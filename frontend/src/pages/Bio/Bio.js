import React, { useEffect, useState } from 'react';
import styles from './Bio.module.css';
import bioData from '../../information/bio.json';
import profile from './Profile.jpg';

const Bio = () => {
  const [skillsVisible, setSkillsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSkillsVisible(true), 500);
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
    <div className={styles.bioContainer}>
      <div className={styles.blueprintOverlay} />
      
      {/* Floating decorative icons */}
      <div className={styles.floatingIcons}>
        <svg className={`${styles.floatingIcon} ${styles.icon1}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M8 10v11M12 10v11M16 10v11M20 10v11" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        
        <svg className={`${styles.floatingIcon} ${styles.icon2}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        
        <svg className={`${styles.floatingIcon} ${styles.icon3}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="8" r="1.5"/><path d="M12 9.5v3M14.5 14.5L12 12.5l-2.5 2M8.5 17.5l1-1.5M15.5 17.5l-1-1.5M12 18v3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        
        <svg className={`${styles.floatingIcon} ${styles.icon4}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeWidth="1.5"/>
          <path d="M12 6v6l4 2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        
        <svg className={`${styles.floatingIcon} ${styles.icon5}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeWidth="1.5"/>
          <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className={styles.hero}>
        <div className={styles.heroContent}>
          {/* Compact Profile Sidebar */}
          <aside className={styles.profileSidebar}>
            <div className={styles.profileImageWrapper}>
              <img src={profile} alt={bioData.fullName} className={styles.profileImage} />
              <div className={styles.imageGradient} />
            </div>
            
            <div className={styles.profileDetails}>
              <div className={styles.badge}>{bioData.professional.fieldOfStudy}</div>
              <h1 className={styles.name}>{bioData.fullName}</h1>
              <p className={styles.subtitle}>{bioData.professional.headline}</p>
              
              <div className={styles.quickInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Age</span>
                  <span className={styles.infoValue}>{age}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Location</span>
                  <span className={styles.infoValue}>Roodepoort, ZA</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Languages</span>
                  <span className={styles.infoValue}>Afrikaans, English</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - More Compact */}
          <main className={styles.mainContent}>
            {/* Summary & Education Combined */}
            <div className={styles.compactSection}>
              <div className={styles.sectionLabel}>01 / About & Education</div>
              <h2 className={styles.sectionHeading}>Background</h2>
              
              <p className={styles.summaryText}>{bioData.summary}</p>
              
              <div className={styles.educationCompact}>
                {bioData.education.map((edu, index) => (
                  <div key={index} className={styles.eduItem}>
                    <div className={styles.eduHeader}>
                      <h3 className={styles.eduTitle}>{edu.degree || edu.level}</h3>
                      <span className={styles.eduDate}>
                        {edu.startYear ? `${edu.startYear}-${edu.expectedGraduation || edu.yearCompleted}` : edu.yearCompleted}
                      </span>
                    </div>
                    <p className={styles.eduInstitution}>{edu.institution || edu.school}</p>
                    {edu.status && <span className={styles.statusPill}>{edu.status}</span>}
                    {edu.subjects && (
                      <div className={styles.tagsList}>
                        {edu.subjects.map((subject, i) => (
                          <span key={i} className={styles.miniTag}>{subject}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Grid */}
            <div className={styles.compactSection}>
              <div className={styles.sectionLabel}>02 / Experience</div>
              <h2 className={styles.sectionHeading}>Professional Journey</h2>
              
              <div className={styles.experienceGrid}>
                {bioData.professional_experience.map((exp, index) => (
                  <div key={index} className={styles.expCard}>
                    <div className={styles.expHeader}>
                      <h3 className={styles.expTitle}>{exp.title}</h3>
                      <span className={styles.expYear}>{exp.year || exp.years}</span>
                    </div>
                    <p className={styles.expCompany}>{exp.company}</p>
                    
                    {exp.responsibilities && (
                      <ul className={styles.compactList}>
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    )}
                    
                    {exp.achievements && (
                      <ul className={styles.compactList}>
                        {exp.achievements.map((ach, i) => (
                          <li key={i}>{ach}</li>
                        ))}
                      </ul>
                    )}
                    
                    {exp.skills && (
                      <div className={styles.tagsList}>
                        {exp.skills.map((skill, i) => (
                          <span key={i} className={styles.miniTag}>{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {bioData.volunteer_experience?.map((exp, index) => (
                  <div key={`vol-${index}`} className={styles.expCard}>
                    <div className={styles.expHeader}>
                      <h3 className={styles.expTitle}>{exp.title}</h3>
                      <span className={styles.expYear}>{exp.years}</span>
                    </div>
                    <p className={styles.expCompany}>{exp.organization} • Volunteer</p>
                    
                    {exp.responsibilities && (
                      <ul className={styles.compactList}>
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Compact Grid */}
            <div className={styles.compactSection}>
              <div className={styles.sectionLabel}>03 / Skills</div>
              <h2 className={styles.sectionHeading}>Expertise</h2>
              
              <div className={styles.skillsCompact}>
                {Object.entries(bioData.skills).map(([category, skillsList]) => (
                  <div key={category} className={styles.skillGroup}>
                    <h3 className={styles.skillGroupTitle}>
                      {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h3>
                    <div className={styles.skillItems}>
                      {skillsList.map((skill, index) => (
                        <div key={index} className={styles.skillRow}>
                          <div className={styles.skillInfo}>
                            <span className={styles.skillName}>{skill.name}</span>
                            <span className={styles.skillPercent}>{skill.level}%</span>
                          </div>
                          <div className={styles.skillBarWrapper}>
                            <div 
                              className={styles.skillBarFill}
                              style={{ width: skillsVisible ? `${skill.level}%` : '0%' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements & Interests Combined */}
            <div className={styles.twoColumnSection}>
              <div className={styles.leftColumn}>
                <div className={styles.sectionLabel}>04 / Recognition</div>
                <h2 className={styles.sectionHeading}>Achievements</h2>
                <ul className={styles.achievementList}>
                  {bioData.personal.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
              
              <div className={styles.rightColumn}>
                <div className={styles.sectionLabel}>05 / Passions</div>
                <h2 className={styles.sectionHeading}>Beyond Work</h2>
                
                <div className={styles.interestsBlock}>
                  <h4 className={styles.microHeading}>Interests</h4>
                  <div className={styles.tagsList}>
                    {bioData.interests.map((interest, index) => (
                      <span key={index} className={styles.miniTag}>{interest}</span>
                    ))}
                  </div>
                </div>
                
                <div className={styles.interestsBlock}>
                  <h4 className={styles.microHeading}>Hobbies</h4>
                  <div className={styles.tagsList}>
                    {bioData.personal.hobbies.map((hobby, index) => (
                      <span key={index} className={styles.miniTag}>{hobby}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Bio;