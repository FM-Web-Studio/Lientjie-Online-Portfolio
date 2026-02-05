import React, { useEffect, useState } from 'react';
import styles from './Bio.module.css';
import bioData from '../../information/bio.json';
import profile from './Profile.jpg';

const Bio = () => {
  const [skillsVisible, setSkillsVisible] = useState(false);

  useEffect(() => {
    // Trigger skills animation after component mounts
    const timer = setTimeout(() => setSkillsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Calculate age from birthdate
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
      {/* Blueprint grid overlay */}
      <div className={styles.blueprintOverlay} />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {/* Left Column - Profile Card */}
          <aside className={styles.profileCard}>
            <div className={styles.imageSection}>
              <img
                src={profile}
                alt={bioData.fullName}
                className={styles.profileImage}
              />
              <div className={styles.imageOverlay} />
            </div>

            <div className={styles.profileInfo}>
              <span className={styles.architectLabel}>
                {bioData.professional.fieldOfStudy}
              </span>
              
              <h1 className={styles.name}>{bioData.fullName}</h1>
              <p className={styles.title}>{bioData.professional.headline}</p>

              <div className={styles.divider} />

              <div className={styles.detailsGrid}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Location</span>
                  <span className={styles.detailValue}>
                    {bioData.personal.location}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Age</span>
                  <span className={styles.detailValue}>{age} years</span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Languages</span>
                  <span className={styles.detailValue}>
                    {bioData.personal.languages.join(', ')}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>License</span>
                  <span className={styles.detailValue}>
                    {bioData.personal.drivingLicense}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Nationality</span>
                  <span className={styles.detailValue}>
                    {bioData.personal.nationality}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column - Main Content */}
          <main className={styles.mainContent}>
            {/* About Section */}
            <section className={styles.section}>
              <header className={styles.sectionHeader}>
                <div className={styles.sectionNumber}>01 — About</div>
                <h2 className={styles.sectionTitle}>Professional Summary</h2>
              </header>
              <div className={styles.sectionContent}>
                <p className={styles.summary}>{bioData.summary}</p>
              </div>
            </section>

            {/* Education Section */}
            <section className={styles.section}>
              <header className={styles.sectionHeader}>
                <div className={styles.sectionNumber}>02 — Education</div>
                <h2 className={styles.sectionTitle}>Academic Background</h2>
              </header>
              <div className={styles.sectionContent}>
                <div className={styles.timeline}>
                  {bioData.education.map((edu, index) => (
                    <article key={index} className={styles.timelineItem}>
                      <div className={styles.itemHeader}>
                        <div className={styles.itemTitleRow}>
                          <h3 className={styles.itemTitle}>{edu.degree || edu.level}</h3>
                          <span className={styles.itemDate}>
                            {edu.startYear 
                              ? `${edu.startYear} — ${edu.expectedGraduation || edu.yearCompleted || 'Present'}`
                              : edu.yearCompleted}
                          </span>
                        </div>
                        <p className={styles.itemSubtitle}>
                          {edu.institution || edu.school}
                          {edu.campus && ` • ${edu.campus}`}
                        </p>
                        {edu.status && (
                          <span className={styles.statusBadge}>{edu.status}</span>
                        )}
                      </div>

                      {edu.notes && (
                        <p className={styles.itemDescription}>{edu.notes}</p>
                      )}

                      {edu.relevantCoursework && (
                        <>
                          <h4 className={styles.subsectionTitle}>Coursework</h4>
                          <ul className={styles.itemList}>
                            {edu.relevantCoursework.map((course, i) => (
                              <li key={i}>{course}</li>
                            ))}
                          </ul>
                        </>
                      )}

                      {edu.subjects && (
                        <>
                          <h4 className={styles.subsectionTitle}>Subjects</h4>
                          <div className={styles.tagsGrid}>
                            {edu.subjects.map((subject, i) => (
                              <span key={i} className={styles.tag}>
                                {subject}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* Experience Section */}
            <section className={styles.section}>
              <header className={styles.sectionHeader}>
                <div className={styles.sectionNumber}>03 — Experience</div>
                <h2 className={styles.sectionTitle}>Professional & Volunteer Work</h2>
              </header>
              <div className={styles.sectionContent}>
                <div className={styles.timeline}>
                  {/* Professional Experience */}
                  {bioData.professional_experience.map((exp, index) => (
                    <article key={`prof-${index}`} className={styles.timelineItem}>
                      <div className={styles.itemHeader}>
                        <div className={styles.itemTitleRow}>
                          <h3 className={styles.itemTitle}>{exp.title}</h3>
                          <span className={styles.itemDate}>
                            {exp.startDate} — {exp.endDate || 'Present'}
                          </span>
                        </div>
                        <p className={styles.itemSubtitle}>
                          {exp.company}
                          {exp.location && ` • ${exp.location}`}
                        </p>
                      </div>

                      {exp.description && (
                        <p className={styles.itemDescription}>{exp.description}</p>
                      )}

                      {exp.responsibilities && (
                        <>
                          <h4 className={styles.subsectionTitle}>Key Responsibilities</h4>
                          <ul className={styles.itemList}>
                            {exp.responsibilities.map((resp, i) => (
                              <li key={i}>{resp}</li>
                            ))}
                          </ul>
                        </>
                      )}

                      {exp.achievements && (
                        <>
                          <h4 className={styles.subsectionTitle}>Achievements</h4>
                          <ul className={styles.itemList}>
                            {exp.achievements.map((achievement, i) => (
                              <li key={i}>{achievement}</li>
                            ))}
                          </ul>
                        </>
                      )}

                      {exp.skills_gained && (
                        <>
                          <h4 className={styles.subsectionTitle}>Skills Developed</h4>
                          <div className={styles.tagsGrid}>
                            {exp.skills_gained.map((skill, i) => (
                              <span key={i} className={styles.tag}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </article>
                  ))}

                  {/* Volunteer Experience */}
                  {bioData.volunteer_experience && bioData.volunteer_experience.map((exp, index) => (
                    <article key={`vol-${index}`} className={styles.timelineItem}>
                      <div className={styles.itemHeader}>
                        <div className={styles.itemTitleRow}>
                          <h3 className={styles.itemTitle}>{exp.title}</h3>
                          <span className={styles.itemDate}>
                            {exp.startDate} — {exp.endDate || 'Present'}
                          </span>
                        </div>
                        <p className={styles.itemSubtitle}>
                          {exp.organization}
                          {exp.location && ` • ${exp.location}`}
                        </p>
                        <span className={styles.statusBadge}>Volunteer</span>
                      </div>

                      {exp.description && (
                        <p className={styles.itemDescription}>{exp.description}</p>
                      )}

                      {exp.responsibilities && (
                        <>
                          <h4 className={styles.subsectionTitle}>Responsibilities</h4>
                          <ul className={styles.itemList}>
                            {exp.responsibilities.map((resp, i) => (
                              <li key={i}>{resp}</li>
                            ))}
                          </ul>
                        </>
                      )}

                      {exp.skills_gained && (
                        <>
                          <h4 className={styles.subsectionTitle}>Skills Developed</h4>
                          <div className={styles.tagsGrid}>
                            {exp.skills_gained.map((skill, i) => (
                              <span key={i} className={styles.tag}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* Skills Section */}
            <section className={styles.section}>
              <header className={styles.sectionHeader}>
                <div className={styles.sectionNumber}>04 — Expertise</div>
                <h2 className={styles.sectionTitle}>Skills & Competencies</h2>
              </header>
              <div className={styles.sectionContent}>
                <div className={styles.skillsGrid}>
                  {Object.entries(bioData.skills).map(([category, skillsList]) => (
                    <div key={category} className={styles.skillCategory}>
                      <h3 className={styles.categoryTitle}>
                        {category.replace('_', ' ')}
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
                                className={styles.skillFill}
                                style={{
                                  width: skillsVisible ? `${skill.level}%` : '0%'
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Achievements Section */}
            <section className={styles.section}>
              <header className={styles.sectionHeader}>
                <div className={styles.sectionNumber}>05 — Recognition</div>
                <h2 className={styles.sectionTitle}>Achievements & Awards</h2>
              </header>
              <div className={styles.sectionContent}>
                <div className={styles.achievementsGrid}>
                  {bioData.personal.achievements.map((achievement, index) => (
                    <div key={index} className={styles.achievementCard}>
                      <p>{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Interests & Hobbies */}
            <section className={styles.section}>
              <header className={styles.sectionHeader}>
                <div className={styles.sectionNumber}>06 — Beyond Work</div>
                <h2 className={styles.sectionTitle}>Interests & Passions</h2>
              </header>
              <div className={styles.sectionContent}>
                <h4 className={styles.subsectionTitle}>Interests</h4>
                <div className={styles.tagsGrid}>
                  {bioData.interests.map((interest, index) => (
                    <span key={index} className={styles.tag}>
                      {interest}
                    </span>
                  ))}
                </div>

                <h4 className={styles.subsectionTitle} style={{ marginTop: '2rem' }}>
                  Hobbies
                </h4>
                <div className={styles.tagsGrid}>
                  {bioData.personal.hobbies.map((hobby, index) => (
                    <span key={index} className={styles.tag}>
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </main>
        </div>
      </section>
    </div>
  );
};

export default Bio;