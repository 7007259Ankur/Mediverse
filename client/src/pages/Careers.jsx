// src/pages/Careers.jsx
import { useState } from 'react';
import styles from './Careers.module.css';
import heroImage from '../assets/careers-hero.png'; // Add your own hero image
import teamImage from '../assets/team.png'; // Add team image

export default function Careers() {
  const [activeCategory, setActiveCategory] = useState('All');

  const jobCategories = [
    'All',
    'Engineering',
    'Medical',
    'Design',
    'Operations',
    'Data Science'
  ];

  const jobOpenings = [
    {
      id: 1,
      title: "Frontend Engineer",
      category: "Engineering",
      type: "Full-time",
      location: "Remote",
      description: "Build intuitive interfaces that make healthcare accessible to everyone."
    },
    {
      id: 2,
      title: "Medical AI Specialist",
      category: "Medical",
      type: "Full-time",
      location: "Hybrid (NY/SF)",
      description: "Develop AI models that assist doctors in rural areas."
    },
    {
      id: 3,
      title: "UX Designer",
      category: "Design",
      type: "Contract",
      location: "Remote",
      description: "Create accessible designs for diverse populations."
    },
    {
      id: 4,
      title: "Data Scientist",
      category: "Data Science",
      type: "Full-time",
      location: "Remote",
      description: "Analyze healthcare patterns to improve our algorithms."
    }
  ];

  const filteredJobs = activeCategory === 'All' 
    ? jobOpenings 
    : jobOpenings.filter(job => job.category === activeCategory);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroImage} style={{ backgroundImage: `url(${heroImage})` }} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span>Work that matters.</span>
            <span>People who care.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Join us in revolutionizing healthcare for underserved communities.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className={styles.intro}>
        <div className={styles.introContent}>
          <h2>At MediVerse, we don't just accept difference — we celebrate it</h2>
          <p>
            We're building a diverse team of thinkers and doers to create technology that 
            makes quality healthcare accessible to everyone, everywhere.
          </p>
        </div>
        <div className={styles.introImage} style={{ backgroundImage: `url(${teamImage})` }} />
      </section>

      {/* Job Categories */}
      <section className={styles.categories}>
        <div className={styles.categoriesContainer}>
          <h2>Open Positions</h2>
          <div className={styles.categoryFilters}>
            {jobCategories.map(category => (
              <button
                key={category}
                className={`${styles.categoryButton} ${activeCategory === category ? styles.active : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className={styles.listings}>
        <div className={styles.listingsContainer}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.jobInfo}>
                  <h3>{job.title}</h3>
                  <div className={styles.jobMeta}>
                    <span>{job.type}</span>
                    <span>{job.location}</span>
                  </div>
                  <p>{job.description}</p>
                </div>
                <button className={styles.applyButton}>
                  Apply
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div className={styles.noJobs}>
              <p>No current openings in this category.</p>
              <p>Check back soon or <a href="mailto:careers@mediverse.com">send us your resume</a>.</p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <h2>Why MediVerse?</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🏥</div>
            <h3>Healthcare</h3>
            <p>Comprehensive medical, dental, and vision coverage from day one.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🌎</div>
            <h3>Remote First</h3>
            <p>Work from anywhere with flexible hours to suit your lifestyle.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>📈</div>
            <h3>Growth</h3>
            <p>$3,000 annual learning budget for courses, books, and conferences.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>❤️</div>
            <h3>Impact</h3>
            <p>Your work will directly improve healthcare access for millions.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2>Don't see the perfect role?</h2>
        <p>We're always looking for talented people. Send us your resume.</p>
        <a href="mailto:careers@mediverse.com" className={styles.ctaButton}>
          Submit Resume
        </a>
      </section>
    </div>
  );
}