// src/pages/About.jsx
import { useState, useEffect } from 'react';
import styles from './About.module.css';
import engineerImage from '../assets/engineer.png';
import doctorImage from '../assets/doctor.png';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      title: "Chief Medical Officer",
      image: doctorImage,
      bio: "Board-certified physician with 15 years of clinical experience in internal medicine and preventive care. Specializes in AI-assisted diagnostics and personalized medicine approaches.",
      credentials: ["MD, Johns Hopkins", "Board Certified Internal Medicine", "AI in Healthcare Certificate"],
      expertise: ["Clinical Diagnostics", "Preventive Medicine", "Healthcare AI", "Patient Care"]
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Chief Technology Officer",
      image: engineerImage,
      bio: "Healthcare technology specialist with expertise in AI systems, machine learning, and healthcare data analytics. Former lead engineer at top medical technology companies.",
      credentials: ["PhD Computer Science, MIT", "Healthcare Technology Expert", "AI/ML Specialist"],
      expertise: ["Machine Learning", "Healthcare Systems", "Data Analytics", "Medical AI"]
    }
  ];

  const stats = [
    { number: "10,000+", label: "Patients Helped" },
    { number: "95%", label: "Accuracy Rate" },
    { number: "24/7", label: "Support Available" },
    { number: "5+", label: "Years Experience" }
  ];

  return (
    <div className={styles.aboutContainer}>
      {/* Hero Section */}
      <section className={`${styles.heroSection} ${isVisible ? styles.fadeIn : ''}`}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Revolutionizing Healthcare Through
            <span className={styles.gradient}> AI Innovation</span>
          </h1>
          <p className={styles.heroDescription}>
            MediXpert combines cutting-edge artificial intelligence with medical expertise 
            to provide accurate health risk predictions and personalized care recommendations.
          </p>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.missionSection}>
        <div className={styles.missionContent}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <div className={styles.missionGrid}>
            <div className={styles.missionItem}>
              <div className={styles.missionIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Accurate Predictions</h3>
              <p>Leverage advanced AI algorithms to provide precise health risk assessments based on comprehensive data analysis.</p>
            </div>
            <div className={styles.missionItem}>
              <div className={styles.missionIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3>Personalized Care</h3>
              <p>Deliver tailored health recommendations and treatment plans customized to individual patient profiles and needs.</p>
            </div>
            <div className={styles.missionItem}>
              <div className={styles.missionIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3>Early Detection</h3>
              <p>Enable proactive healthcare through early identification of potential health risks and preventive interventions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.teamSection}>
        <div className={styles.teamContent}>
          <h2 className={styles.sectionTitle}>Meet Our Expert Team</h2>
          <p className={styles.sectionSubtitle}>
            Our leadership combines decades of medical expertise with cutting-edge technology innovation
          </p>
          
          <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <div 
                key={member.id} 
                className={`${styles.teamMember} ${isVisible ? styles.slideIn : ''}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={styles.memberCard}>
                  <div className={styles.memberImageContainer}>
                    <div 
                      className={styles.memberImage} 
                      style={{ backgroundImage: `url(${member.image})` }}
                    />
                    <div className={styles.memberOverlay}>
                      <div className={styles.socialLinks}>
                        <button className={styles.socialLink} aria-label="LinkedIn">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </button>
                        <button className={styles.socialLink} aria-label="Email">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.memberInfo}>
                    <h3 className={styles.memberName}>{member.name}</h3>
                    <p className={styles.memberTitle}>{member.title}</p>
                    <p className={styles.memberBio}>{member.bio}</p>
                    
                    <div className={styles.memberCredentials}>
                      <h4>Credentials</h4>
                      <ul>
                        {member.credentials.map((credential, idx) => (
                          <li key={idx}>{credential}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className={styles.memberExpertise}>
                      <h4>Expertise</h4>
                      <div className={styles.expertiseTags}>
                        {member.expertise.map((skill, idx) => (
                          <span key={idx} className={styles.expertiseTag}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.valuesSection}>
        <div className={styles.valuesContent}>
          <h2 className={styles.sectionTitle}>Our Core Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueItem}>
              <h3>Innovation</h3>
              <p>Continuously advancing healthcare technology to improve patient outcomes and medical practice efficiency.</p>
            </div>
            <div className={styles.valueItem}>
              <h3>Accuracy</h3>
              <p>Maintaining the highest standards of precision in our AI algorithms and medical assessments.</p>
            </div>
            <div className={styles.valueItem}>
              <h3>Privacy</h3>
              <p>Protecting patient data with enterprise-grade security and strict compliance with healthcare regulations.</p>
            </div>
            <div className={styles.valueItem}>
              <h3>Accessibility</h3>
              <p>Making advanced healthcare technology available and affordable for healthcare providers worldwide.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}