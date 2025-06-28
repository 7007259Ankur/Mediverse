// src/pages/Press.jsx
import styles from './Press.module.css';
import mediaKit from '../assets/media-kit.png'; // Add your media kit file
import pressImage1 from '../assets/press1.png'; // Add press coverage images
import pressImage2 from '../assets/press2.png';
import pressImage3 from '../assets/press3.png';

export default function Press() {
  const pressCoverage = [
    {
      id: 1,
      title: "Student Innovation Forum Spotlight",
      source: "Campus Tech Review",
      date: "March 2024",
      excerpt: "MediVerse's AI-powered diagnostic tools were highlighted as one of the top 10 student innovations transforming healthcare accessibility.",
      image: pressImage1,
      link: "#"
    },
    {
      id: 2,
      title: "Healthcare Hackathon Winners",
      source: "Digital Health Magazine",
      date: "January 2024",
      excerpt: "The team took first place at the Global Health Hackathon for their low-bandwidth telemedicine solution for rural clinics.",
      image: pressImage2,
      link: "#"
    },
    {
      id: 3,
      title: "Youth-Led Health Tech Revolution",
      source: "Future of Medicine Blog",
      date: "November 2023",
      excerpt: "How a group of students built an AI platform that's already improving diagnosis accuracy in 5 developing countries.",
      image: pressImage3,
      link: "#"
    }
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>MediVerse in the Press</h1>
          <p>Recognized for innovation in healthcare accessibility and youth-led technology solutions</p>
        </div>
      </section>

      {/* Press Coverage */}
      <section className={styles.coverage}>
        <div className={styles.sectionHeader}>
          <h2>Featured Coverage</h2>
          <p>Our journey from prototype to impact</p>
        </div>
        
        <div className={styles.articlesGrid}>
          {pressCoverage.map((item) => (
            <article key={item.id} className={styles.articleCard}>
              <div className={styles.articleImage} style={{ backgroundImage: `url(${item.image})` }} />
              <div className={styles.articleContent}>
                <div className={styles.articleMeta}>
                  <span className={styles.source}>{item.source}</span>
                  <span className={styles.date}>{item.date}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
                <a href={item.link} className={styles.readMore}>Read more →</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Media Resources */}
      <section className={styles.mediaResources}>
        <div className={styles.resourcesContent}>
          <div className={styles.resourcesText}>
            <h2>Media Resources</h2>
            <p>Download our press kit for logos, product images, executive bios, and company facts</p>
            <div className={styles.downloadButtons}>
              <a href={mediaKit} download className={styles.downloadButton}>
                Download Media Kit (ZIP)
              </a>
              <a href="mailto:press@mediverse.com" className={styles.contactButton}>
                Contact Press Team
              </a>
            </div>
          </div>
          <div className={styles.brandAssets}>
            <div className={styles.brandCard}>
              <div className={styles.colorSwatches}>
                <div className={styles.swatchPrimary}></div>
                <div className={styles.swatchSecondary}></div>
                <div className={styles.swatchAccent}></div>
              </div>
              <p>Brand Colors</p>
            </div>
            <div className={styles.brandCard}>
              <div className={styles.logoPreview}></div>
              <p>Logo Usage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Press Contact */}
      <section className={styles.pressContact}>
        <h2>For Media Inquiries</h2>
        <p>Our communications team is available to arrange interviews, provide commentary, or discuss partnership opportunities.</p>
        <div className={styles.contactInfo}>
          <div className={styles.contactMethod}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <a href="mailto:press@mediverse.com">press@mediverse.com</a>
          </div>
          <div className={styles.contactMethod}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22 16.92V19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V16.92" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 5V3C8 2.46957 8.21071 1.96086 8.58579 1.58579C8.96086 1.21071 9.46957 1 10 1H14C14.5304 1 15.0391 1.21071 15.4142 1.58579C15.7893 1.96086 16 2.46957 16 3V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 16.92C20.8529 15.7767 19.4269 14.9712 17.874 14.5894C16.3211 14.2076 14.7046 14.2639 13.179 14.753C11.6534 15.2421 10.2772 16.1472 9.19378 17.3777C8.11035 18.6082 7.35946 20.118 7.02 21.74" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 16.92C3.1471 15.7767 4.57308 14.9712 6.12597 14.5894C7.67886 14.2076 9.29536 14.2639 10.821 14.753C12.3466 15.2421 13.7228 16.1472 14.8062 17.3777C15.8897 18.6082 16.6405 20.118 16.98 21.74" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <a href="tel:+11234567890">+1 (123) 456-7890</a>
          </div>
        </div>
      </section>
    </div>
  );
}