import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import healthRecordsImg from '../assets/healthRecord.png';
import consultationsImg from '../assets/consult.png';
import predictionsImg from '../assets/prediction.png';
import pharmacyImg from '../assets/Store.png'; // Add your pharmacy service image

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Check for saved theme preference or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else if (prefersDark) {
      setDarkMode(true);
    }
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNavigationClick = (path) => (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(path);
    }, 2000);
  };

  return (
    <div className={`${styles.fullScreenContainer} ${darkMode ? styles.darkMode : ''}`}>
      {/* Dark Mode Toggle */}
      <button 
        className={styles.darkModeToggle}
        onClick={toggleDarkMode}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>








    <div className={styles.fullScreenContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.trustBadge}>
            <span>🛡️ HIPAA Compliant & Secure</span>
          </div>
          
          <h1 className={styles.heroTitle}>
            Revolutionizing <span>Healthcare</span> Through Technology
          </h1>
          <p className={styles.heroSubtitle}>
            Your complete digital health companion for seamless medical records,
            teleconsultations, and personalized care powered by cutting-edge AI.
          </p>

          <div className={styles.ctaButtons}>
            <div className={styles.primaryButton} onClick={handleNavigationClick('/login')} style={{cursor: 'pointer'}}>
              Get Started Free
              <span className={styles.buttonIcon}>→</span>
            </div>
            <div className={styles.secondaryButton} onClick={handleNavigationClick('/shop')} style={{cursor: 'pointer'}}>
              <span className={styles.playIcon}>🛒</span>
              Shop Now
            </div>
          </div>

          {/* Stats Section */}
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>50K+</div>
              <div className={styles.statLabel}>Active Patients</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>1.2M+</div>
              <div className={styles.statLabel}>Health Records</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>500+</div>
              <div className={styles.statLabel}>Healthcare Providers</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>99.9%</div>
              <div className={styles.statLabel}>Uptime</div>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className={styles.heroVisual}>
          <div className={styles.dashboardMockup}>
            <div className={styles.mockupHeader}>
              <div className={styles.mockupIcon}>❤️</div>
              <div className={styles.mockupTitle}>
                <h3>Health Monitoring</h3>
                <p>Real-time vitals tracking</p>
              </div>
            </div>
            
            <div className={styles.mockupChart}>
              <div className={styles.vitalSign}>
                <div className={styles.vitalValue}>98.7°F</div>
                <div className={styles.vitalStatus}>Normal Range</div>
              </div>
            </div>
            
            <div className={styles.mockupStats}>
              <div className={styles.miniStat}>
                <div className={styles.miniValue}>120/80</div>
                <div className={styles.miniLabel}>Blood Pressure</div>
              </div>
              <div className={styles.miniStat}>
                <div className={styles.miniValue}>72 BPM</div>
                <div className={styles.miniLabel}>Heart Rate</div>
              </div>
              <div className={styles.miniStat}>
                <div className={styles.miniValue}>98%</div>
                <div className={styles.miniLabel}>SpO2</div>
              </div>
            </div>
          </div>
          
          <div className={styles.floatingElement1}>🧠</div>
          <div className={styles.floatingElement2}>👥</div>
        </div>
      </section>


<section className={styles.featuresSection}>
  <div className={styles.featuresContainer}>
    <h2 className={styles.sectionTitle}>Our Comprehensive Services</h2>
    <p className={styles.sectionSubtitle}>
      Experience the future of healthcare with our integrated platform designed for patients and providers.
    </p>

    <div className={styles.featureGrid}>
      <div className={styles.featureCard} onClick={handleNavigationClick('/records')}>
        <img src={healthRecordsImg} alt="Digital Health Records" className={styles.cardImage} />
        <div className={styles.cardOverlay}>
          <h3>Digital Health Records</h3>
          <p>Securely store and access all your medical documents in one unified platform with military-grade encryption.</p>
          <div className={styles.featureLink}>
            <span>Learn More →</span>
          </div>
        </div>
      </div>

      <div className={styles.featureCard} onClick={handleNavigationClick('/video')}>
        <img src={consultationsImg} alt="Virtual Consultations" className={styles.cardImage} />
        <div className={styles.cardOverlay}>
          <h3>Virtual Consultations</h3>
          <p>Connect with top specialists remotely through our HIPAA-compliant platform with HD video and secure messaging.</p>
          <div className={styles.featureLink}>
            <span>Learn More →</span>
          </div>
        </div>
      </div>

      <div className={styles.featureCard} onClick={handleNavigationClick('/access')}>
        <img src={predictionsImg} alt="AI Health Predictions" className={styles.cardImage} />
        <div className={styles.cardOverlay}>
          <h3>AI Health Predictions</h3>
          <p>Harness the power of artificial intelligence to deliver accurate, real-time health predictions and personalized insights.</p>
          <div className={styles.featureLink}>
            <span>Enter Access Code →</span>
          </div>
        </div>
      </div>

      {/* New Shop Now Card */}
      <div className={styles.featureCard} onClick={handleNavigationClick('/shop')}>
        <img src={pharmacyImg} alt="Online Pharmacy" className={styles.cardImage} />
        <div className={styles.cardOverlay}>
          <h3>Online Pharmacy</h3>
          <p>Get your prescribed medications delivered to your doorstep with free shipping and automated refill reminders.</p>
          <div className={styles.featureLink}>
            <span>Shop Now →</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    
      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.sectionTitle}>Trusted by Healthcare Professionals</h2>
          <p className={styles.sectionSubtitle}>
            See what doctors and patients are saying about HealthVerse
          </p>
          
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialRating}>
                <span>⭐⭐⭐⭐⭐</span>
              </div>
              <p className={styles.testimonialText}>
                "HealthVerse has transformed how I manage patient records. The AI predictions are remarkably accurate."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>SJ</div>
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>Dr. Sarah Johnson</div>
                  <div className={styles.authorRole}>Cardiologist</div>
                </div>
              </div>
            </div>
            
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialRating}>
                <span>⭐⭐⭐⭐⭐</span>
              </div>
              <p className={styles.testimonialText}>
                "The virtual consultations saved me hours of travel time. Excellent platform!"
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>MC</div>
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>Michael Chen</div>
                  <div className={styles.authorRole}>Patient</div>
                </div>
              </div>
            </div>
            
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialRating}>
                <span>⭐⭐⭐⭐⭐</span>
              </div>
              <p className={styles.testimonialText}>
                "The unified health records system has streamlined our entire practice workflow."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>ER</div>
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>Dr. Emily Rodriguez</div>
                  <div className={styles.authorRole}>General Practitioner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of patients and healthcare providers who trust HealthVerse for their digital health needs.
          </p>
          <div className={styles.ctaButtons}>
            <div className={styles.primaryButton} onClick={handleNavigationClick('/access')} style={{cursor: 'pointer'}}>
              Subscription Plans
            </div>
            <div className={styles.secondaryButton} onClick={handleNavigationClick('/about')} style={{cursor: 'pointer'}}>
              About Us
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>HealthVerse</div>
            <p className={styles.footerDescription}>
              Revolutionizing healthcare through innovative technology and compassionate care.
            </p>
          </div>
          
          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>Services</h3>
            <div className={styles.footerLinks}>
              <div onClick={handleNavigationClick('/records')} style={{cursor: 'pointer'}}>Health Records</div>
              <div onClick={handleNavigationClick('/video')} style={{cursor: 'pointer'}}>Telemedicine/Live Care</div>
              <div onClick={handleNavigationClick('/ai')} style={{cursor: 'pointer'}}>AI Predictions</div>
              <div onClick={handleNavigationClick('/conv')} style={{cursor: 'pointer'}}>ElevenAI</div>
            </div>
          </div>
          
          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>Company</h3>
            <div className={styles.footerLinks}>
              <div onClick={handleNavigationClick('/about')} style={{cursor: 'pointer'}}>About Us</div>
              <div onClick={handleNavigationClick('/careers')} style={{cursor: 'pointer'}}>Careers</div>
              <div onClick={handleNavigationClick('/press')} style={{cursor: 'pointer'}}>Press</div>
              <div onClick={handleNavigationClick('/blog')} style={{cursor: 'pointer'}}>Blog</div>
            </div>
          </div>
          
          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>Legal</h3>
            <div className={styles.footerLinks}>
              <div onClick={handleNavigationClick('/privacy')} style={{cursor: 'pointer'}}>Privacy Policy</div>
              <div onClick={handleNavigationClick('/terms')} style={{cursor: 'pointer'}}>Terms of Service</div>
              <div onClick={handleNavigationClick('/hipaa')} style={{cursor: 'pointer'}}>HIPAA Compliance</div>
              <div onClick={handleNavigationClick('/contact')} style={{cursor: 'pointer'}}>Contact Us</div>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            © {new Date().getFullYear()} HealthVerse. All rights reserved.
          </div>
          <div className={styles.footerBottomLinks}>
            <div onClick={handleNavigationClick('/privacy')} style={{cursor: 'pointer'}}>Privacy</div>
            <div onClick={handleNavigationClick('/terms')} style={{cursor: 'pointer'}}>Terms</div>
            <div onClick={handleNavigationClick('/contact')} style={{cursor: 'pointer'}}>Support</div>
          </div>
        </div>
      </footer>

      {/* Loading Overlay */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
    </div>
  );
}