// src/pages/HealthRecords.jsx
import { useState, useEffect } from 'react';
import { FileText, Shield, Cloud, Users, Upload, Eye, PlusCircle, MapPin } from 'lucide-react';
import './HealthRecordsAbout.css'; // Link to the CSS file

export default function HealthRecordsAbout() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Easy Upload",
      description: "Patients can upload medical reports in PDF format - blood tests, prescriptions, X-rays, and diagnostic documents with just a few clicks."
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud Storage",
      description: "All records are safely stored using MongoDB Atlas, ensuring scalability, reliability, and 99.9% uptime for your critical health data."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Doctor Dashboard",
      description: "Healthcare providers get comprehensive access to patient lists, all uploaded reports, and the ability to add clinical notes directly."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & HIPAA Compliant",
      description: "Bank-level encryption and strict privacy controls ensure your sensitive medical information remains protected at all times."
    }
  ];

  const benefits = [
    {
      icon: <FileText className="w-6 h-6" />,
      text: "Eliminates paper trail and reduces chances of lost data"
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      text: "Centralized system for maintaining long-term health history"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      text: "Especially valuable for rural patients without consistent access to physical records"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      text: "Real-time access to complete medical history for better treatment decisions"
    }
  ];

  return (
    <div className="health-records-about">
      {/* Hero Section */}
      <section className={`hero-section ${isVisible ? 'fade-in' : ''}`}>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <FileText className="w-4 h-4 mr-2" />
              Digital Health Records
            </div>
            <h1 className="hero-title">
              Your Health Records,
              <br />
              <span className="hero-gradient">Digitally Transformed</span>
            </h1>
            <p className="hero-description">
              At the core of MediVerse platform, our digital health records system revolutionizes 
              how patients and doctors manage, store, and access critical medical information.
            </p>
          </div>
          
          {/* Floating Elements */}
          <div className="floating-card-container">
            <div className={`floating-card ${isVisible ? 'animate-in' : ''}`}>
              <div className="card-header">
                <div className="card-icon">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="card-title">Blood Test Report</h3>
                  <p className="card-subtitle">March 15, 2025</p>
                </div>
              </div>
              <div className="card-content">
                <div className="content-line"></div>
                <div className="content-line"></div>
                <div className="content-line"></div>
              </div>
              <div className="card-footer">
                <span className="status-badge">Normal Range</span>
                <span className="provider-name">Dr. Sarah Johnson</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">Comprehensive Digital Health Management</h2>
            <p className="section-description">
              From upload to analysis, our platform handles every aspect of your health records 
              with precision and care.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`feature-card ${isVisible ? 'animate-in' : ''}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="how-it-works-container">
          <div className="section-header">
            <h2 className="section-title">How MediVerse Health Records Work</h2>
            <p className="section-description">
              A streamlined process designed for both patients and healthcare providers
            </p>
          </div>

          <div className="steps-grid">
            <div className={`step-card ${isVisible ? 'animate-in' : ''}`}>
              <div className="step-icon">
                <Upload className="w-10 h-10" />
              </div>
              <h3 className="step-title">1. Upload Records</h3>
              <p className="step-description">
                Patients easily upload their medical reports, test results, prescriptions, 
                and diagnostic documents in PDF format through our secure platform.
              </p>
            </div>

            <div className={`step-card ${isVisible ? 'animate-in' : ''}`}>
              <div className="step-icon">
                <Cloud className="w-10 h-10" />
              </div>
              <h3 className="step-title">2. Secure Storage</h3>
              <p className="step-description">
                All documents are automatically encrypted and stored in MongoDB Atlas cloud, 
                ensuring scalability, security, and instant accessibility.
              </p>
            </div>

            <div className={`step-card ${isVisible ? 'animate-in' : ''}`}>
              <div className="step-icon">
                <PlusCircle className="w-10 h-10" />
              </div>
              <h3 className="step-title">3. Doctor Analysis</h3>
              <p className="step-description">
                Healthcare providers access patient dashboards to review records, 
                add clinical notes, and provide treatment suggestions directly in the system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-container">
          <div className={`benefits-content ${isVisible ? 'animate-in' : ''}`}>
            <h2 className="benefits-title">Transforming Healthcare Accessibility</h2>
            <p className="benefits-description">
              Our digital health records system addresses critical challenges in healthcare 
              management, particularly for underserved communities and rural populations.
            </p>
            
            <div className="benefits-list">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className={`benefit-item ${isVisible ? 'animate-in' : ''}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="benefit-icon">
                    {benefit.icon}
                  </div>
                  <p className="benefit-text">
                    {benefit.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className={`dashboard-preview ${isVisible ? 'animate-in' : ''}`}>
            <div className="dashboard-card">
              <div className="dashboard-header">
                <h3 className="dashboard-title">Patient Dashboard</h3>
                <div className="window-controls">
                  <div className="window-control"></div>
                  <div className="window-control"></div>
                  <div className="window-control"></div>
                </div>
              </div>
              
              <div className="dashboard-records">
                <div className="record-item">
                  <FileText className="record-icon" />
                  <div className="record-info">
                    <p className="record-name">Complete Blood Count</p>
                    <p className="record-meta">Lab Results • March 15, 2025</p>
                  </div>
                  <span className="record-status">Normal</span>
                </div>
                
                <div className="record-item">
                  <FileText className="record-icon" />
                  <div className="record-info">
                    <p className="record-name">Chest X-Ray Report</p>
                    <p className="record-meta">Imaging • March 10, 2025</p>
                  </div>
                  <span className="record-status">Clear</span>
                </div>
                
                <div className="record-item">
                  <FileText className="record-icon" />
                  <div className="record-info">
                    <p className="record-name">Prescription</p>
                    <p className="record-meta">Medication • March 8, 2025</p>
                  </div>
                  <span className="record-status">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Digitize Your Health Records?</h2>
          <p className="cta-description">
            Join thousands of patients and healthcare providers who trust MediVerse 
            for secure, accessible, and comprehensive health record management.
          </p>
          <div className="cta-buttons">
            <button className="cta-button primary">Get Started Today</button>
            <button className="cta-button secondary">Learn More</button>
          </div>
        </div>
      </section>
    </div>
  );
}