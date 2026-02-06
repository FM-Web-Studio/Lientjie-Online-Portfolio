import React, { useEffect, useState, useRef } from 'react';
import styles from './Bio.module.css';
import bioData from '../../information/bio.json';
import profile from './Profile.jpg';

const Bio = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const observerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    document.querySelectorAll('[data-observe]').forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
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
      {/* Animated background elements */}
      <div className={styles.backgroundShapes}>
        <div className={styles.shape1} style={{ transform: `translateY(${scrollY * 0.3}px)` }} />
        <div className={styles.shape2} style={{ transform: `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.05}deg)` }} />
        <div className={styles.shape3} style={{ transform: `translateY(${scrollY * 0.15}px)` }} />
        <div className={styles.organicBlob1} />
        <div className={styles.organicBlob2} />
      </div>

      {/* Hero Section - Full viewport with striking intro */}
      <section className={styles.heroSection}>
        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <div className={styles.eyebrow}>Architecture · Dance · Design</div>
            <h1 className={styles.heroTitle}>
              <span className={styles.titleLine}>Lientjie Meiring</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Aspiring architect blending spatial creativity with the fluidity of dance,
              crafting spaces that move and breathe.
            </p>
            <div className={styles.heroMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Based in</span>
                <span className={styles.metaValue}>Roodepoort, SA</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Currently</span>
                <span className={styles.metaValue}>3rd Year B.Arch Student</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Age</span>
                <span className={styles.metaValue}>{age}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.heroImageContainer}>
            <div className={styles.imageFrame}>
              <img src={profile} alt={bioData.fullName} className={styles.heroImage} />
              <div className={styles.imageOverlay} />
            </div>
            <div className={styles.floatingAccent1} />
            <div className={styles.floatingAccent2} />
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <div className={styles.scrollLine} />
          <span className={styles.scrollText}>Scroll to explore</span>
        </div>
      </section>

      {/* Journey Section - Education & Experience Flow */}
      <section 
        id="journey" 
        data-observe 
        className={`${styles.journeySection} ${isVisible.journey ? styles.visible : ''}`}
      >
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNumber}>01</span>
          <h2 className={styles.sectionTitle}>The Journey</h2>
        </div>

        <div className={styles.journeyFlow}>
          {/* Education */}
          <div className={styles.journeyBlock}>
            <h3 className={styles.blockTitle}>Education</h3>
            <div className={styles.timeline}>
              {bioData.education.map((edu, index) => (
                <div key={index} className={styles.timelineItem}>
                  <div className={styles.timelineMarker} />
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <h4 className={styles.timelineTitle}>{edu.degree || edu.level}</h4>
                      <span className={styles.timelineDate}>
                        {edu.startYear ? `${edu.startYear}–${edu.expectedGraduation || edu.yearCompleted}` : edu.yearCompleted}
                      </span>
                    </div>
                    <p className={styles.timelineInstitution}>{edu.institution || 'High School'}</p>
                    {edu.status && (
                      <span className={styles.statusBadge}>{edu.status}</span>
                    )}
                    {edu.subjects && (
                      <div className={styles.subjectTags}>
                        {edu.subjects.map((subject, i) => (
                          <span key={i} className={styles.tag}>{subject}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className={styles.journeyBlock}>
            <h3 className={styles.blockTitle}>Experience</h3>
            <div className={styles.experienceCards}>
              {bioData.professional_experience.map((exp, index) => (
                <div key={index} className={styles.expCard}>
                  <div className={styles.expCardHeader}>
                    <div>
                      <h4 className={styles.expTitle}>{exp.title}</h4>
                      <p className={styles.expCompany}>{exp.company}</p>
                    </div>
                    <span className={styles.expYear}>{exp.year || exp.years}</span>
                  </div>
                  {exp.responsibilities && (
                    <ul className={styles.expList}>
                      {exp.responsibilities.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {exp.achievements && (
                    <ul className={styles.expList}>
                      {exp.achievements.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {exp.skills && (
                    <div className={styles.skillTags}>
                      {exp.skills.map((skill, i) => (
                        <span key={i} className={styles.tag}>{skill}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {bioData.volunteer_experience?.map((exp, index) => (
                <div key={`vol-${index}`} className={styles.expCard}>
                  <div className={styles.expCardHeader}>
                    <div>
                      <h4 className={styles.expTitle}>{exp.title}</h4>
                      <p className={styles.expCompany}>{exp.organization} · Volunteer</p>
                    </div>
                    <span className={styles.expYear}>{exp.years}</span>
                  </div>
                  {exp.responsibilities && (
                    <ul className={styles.expList}>
                      {exp.responsibilities.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section - Visual showcase */}
      <section 
        id="skills" 
        data-observe 
        className={`${styles.skillsSection} ${isVisible.skills ? styles.visible : ''}`}
      >
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNumber}>02</span>
          <h2 className={styles.sectionTitle}>Expertise & Skills</h2>
        </div>

        <div className={styles.skillsGrid}>
          {Object.entries(bioData.skills).map(([category, skillsList]) => (
            <div key={category} className={styles.skillCategory}>
              <h3 className={styles.categoryTitle}>
                {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                          width: isVisible.skills ? `${skill.level}%` : '0%',
                          transitionDelay: `${index * 0.05}s`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Passions Section - Dancing & Achievements */}
      <section 
        id="passions" 
        data-observe 
        className={`${styles.passionsSection} ${isVisible.passions ? styles.visible : ''}`}
      >
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNumber}>03</span>
          <h2 className={styles.sectionTitle}>Passions & Achievements</h2>
        </div>

        <div className={styles.passionsGrid}>
          <div className={styles.passionCard}>
            <div className={styles.passionIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" strokeWidth="1.5"/>
                <path d="M12 6v6l4 2" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className={styles.passionTitle}>Dance</h3>
            <p className={styles.passionDescription}>
              Over a decade of professional dance training in Spanish and ballet styles,
              bringing rhythm and movement to spatial design.
            </p>
            <div className={styles.achievementsList}>
              {bioData.personal.achievements.map((achievement, index) => (
                <div key={index} className={styles.achievement}>
                  <span className={styles.achievementIcon}>★</span>
                  <span>{achievement}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.passionCard}>
            <div className={styles.passionIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="1.5"/>
                <path d="M9 22V12h6v10" strokeWidth="1.5"/>
              </svg>
            </div>
            <h3 className={styles.passionTitle}>Architecture</h3>
            <p className={styles.passionDescription}>
              Passionate about sustainable design and creating spaces that harmonize
              with both human needs and natural environments.
            </p>
            <div className={styles.interestTags}>
              {bioData.interests.map((interest, index) => (
                <span key={index} className={styles.interestTag}>{interest}</span>
              ))}
            </div>
          </div>

          <div className={styles.passionCard}>
            <div className={styles.passionIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" strokeWidth="1.5"/>
                <path d="M16 8L2 22M17.5 15H9" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className={styles.passionTitle}>Creative Life</h3>
            <p className={styles.passionDescription}>
              Beyond the studio, exploring the world through photography, hiking,
              and creative expression in all its forms.
            </p>
            <div className={styles.interestTags}>
              {bioData.personal.hobbies.map((hobby, index) => (
                <span key={index} className={styles.interestTag}>{hobby}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            Lientjie Meiring · {bioData.professional.headline}
          </p>
          <p className={styles.footerMeta}>
            {bioData.personal.location} · {bioData.personal.languages.join(' · ')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Bio;