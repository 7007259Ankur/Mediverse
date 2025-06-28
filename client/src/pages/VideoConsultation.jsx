// src/pages/VideoConsultation.jsx
import { useState, useEffect } from 'react';
import { Video, Phone, Shield, User, Monitor, Smartphone } from 'lucide-react';
import styles from './VideoConsultation.module.css';

export default function VideoConsultation() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Video className="w-8 h-8" />,
      title: "Real-Time Video",
      description: "High-quality, low-latency video consultations with adaptive bitrate for all connection types."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "End-to-End Encrypted",
      description: "Military-grade encryption ensures your consultations remain completely private and secure."
    },
    {
      icon: <User className="w-8 h-8" />,
      title: "No Downloads Needed",
      description: "Works directly in your browser - no apps to install on any device."
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Cross-Platform",
      description: "Join consultations from any device - desktop, tablet, or smartphone."
    }
  ];

  const benefits = [
    {
      icon: <Monitor className="w-6 h-6" />,
      text: "Eliminates travel time and costs for patients"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      text: "Enables remote care for rural and mobility-challenged patients"
    },
    {
      icon: <Video className="w-6 h-6" />,
      text: "Reduces no-show rates with convenient virtual appointments"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      text: "HIPAA-compliant platform ensures patient privacy"
    }
  ];

  return (
    <div className={styles.videoConsultationContainer}>
      {/* Hero Section */}
      <section className={`${styles.heroSection} ${isVisible ? styles.fadeIn : ''}`}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Virtual <span className={styles.gradient}>Doctor Visits</span> Made Simple
          </h1>
          <p className={styles.heroDescription}>
            Connect with healthcare providers through secure, high-quality video consultations
            from the comfort of your home. No special equipment needed - just your browser.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>WebRTC</div>
              <div className={styles.statLabel}>Technology</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>256-bit</div>
              <div className={styles.statLabel}>Encryption</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>0</div>
              <div className={styles.statLabel}>Downloads</div>
            </div>
          </div>
        </div>
        <div className={`${styles.heroImage} ${isVisible ? styles.slideInRight : ''}`}>
          <div className={styles.videoCallIllustration}>
            <div className={styles.videoScreen}>
              <div className={styles.doctorVideo}></div>
              <div className={styles.patientVideo}></div>
            </div>
            <div className={styles.callControls}>
              <div className={styles.controlButton}></div>
              <div className={styles.controlButton}></div>
              <div className={styles.controlButton}></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How Video Consultations Work</h2>
        <div className={styles.steps}>
          <div className={`${styles.step} ${isVisible ? styles.slideUp : ''}`}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3>Patient Initiates Call</h3>
              <p>
                The patient clicks "Start Video Call" in their portal, generating a unique, 
                encrypted Room ID for the session.
              </p>
            </div>
          </div>
          <div className={`${styles.step} ${isVisible ? styles.slideUp : ''}`} style={{ animationDelay: "0.1s" }}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3>Doctor Joins Session</h3>
              <p>
                The healthcare provider enters the same Room ID from their dashboard to 
                establish a secure peer-to-peer connection.
              </p>
            </div>
          </div>
          <div className={`${styles.step} ${isVisible ? styles.slideUp : ''}`} style={{ animationDelay: "0.2s" }}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3>Real-Time Consultation</h3>
              <p>
                Both parties can see, hear, and speak to each other through their browser 
                with no additional software required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Secure Video Consultation Features</h2>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`${styles.featureCard} ${isVisible ? styles.rotateIn : ''}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className={styles.featureIcon}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.benefitsContent}>
          <h2 className={styles.sectionTitle}>Breaking Down Barriers to Care</h2>
          <p className={styles.sectionDescription}>
            Our WebRTC-based video consultation platform addresses critical challenges in 
            healthcare accessibility:
          </p>
          <div className={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className={`${styles.benefitItem} ${isVisible ? styles.fadeIn : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.benefitIcon}>
                  {benefit.icon}
                </div>
                <p>{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={`${styles.techIllustration} ${isVisible ? styles.slideInRight : ''}`}>
          <div className={styles.techStack}>
            <div className={styles.techItem}>WebRTC</div>
            <div className={styles.techItem}>STUN/TURN</div>
            <div className={styles.techItem}>AES-256</div>
            <div className={styles.techItem}>Peer-to-Peer</div>
          </div>
          <div className={styles.connectionLines}></div>
        </div>
      </section>

      {/* Technology Section */}
      <section className={styles.technologySection}>
        <h2 className={styles.sectionTitle}>Built on Cutting-Edge Technology</h2>
        <div className={styles.techDetails}>
          <div className={`${styles.techDetail} ${isVisible ? styles.fadeIn : ''}`}>
            <h3>WebRTC Framework</h3>
            <p>
              Our platform leverages the Web Real-Time Communication API for direct browser-to-browser 
              communication without plugins, ensuring high performance and compatibility.
            </p>
          </div>
          <div className={`${styles.techDetail} ${isVisible ? styles.fadeIn : ''}`} style={{ animationDelay: "0.2s" }}>
            <h3>Secure Signaling</h3>
            <p>
              Session initiation uses encrypted signaling over WebSockets to establish peer connections 
              without exposing sensitive data.
            </p>
          </div>
          <div className={`${styles.techDetail} ${isVisible ? styles.fadeIn : ''}`} style={{ animationDelay: "0.4s" }}>
            <h3>Adaptive Streaming</h3>
            <p>
              Automatic quality adjustment ensures smooth video even with fluctuating network conditions, 
              critical for users in areas with variable internet speeds.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}