import styles from './Legal.module.css';

export default function HIPAACompliance() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>HIPAA Compliance</h1>
          <p>Our commitment to healthcare data security standards</p>
        </div>
      </section>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Our Compliance Status</h2>
          <p>While MediVerse is currently in prototype phase, we follow key principles inspired by the Health Insurance Portability and Accountability Act (HIPAA) to ensure the highest standards of data protection.</p>
          <div className={styles.statusBadge}>In Development - Targeting Full Compliance</div>
        </section>

        <section className={styles.section}>
          <h3>Current Security Measures</h3>
          <div className={styles.complianceFeatures}>
            <div className={styles.feature}>
              <h4>Data Encryption</h4>
              <p>All PHI (Protected Health Information) is encrypted using industry-standard protocols.</p>
            </div>
            <div className={styles.feature}>
              <h4>Access Controls</h4>
              <p>Strict role-based access ensures only authorized personnel can view sensitive data.</p>
            </div>
            <div className={styles.feature}>
              <h4>Audit Logs</h4>
              <p>Detailed logs track all access and modifications to patient records.</p>
            </div>
            <div className={styles.feature}>
              <h4>Business Associate Agreements</h4>
              <p>All third-party vendors handling PHI sign BAAs outlining their responsibilities.</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3>Roadmap to Full Compliance</h3>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.date}>Q3 2024</div>
              <div className={styles.milestone}>Complete risk assessment</div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.date}>Q4 2024</div>
              <div className={styles.milestone}>Implement all required physical safeguards</div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.date}>Q1 2025</div>
              <div className={styles.milestone}>Third-party security audit</div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.date}>Q2 2025</div>
              <div className={styles.milestone}>Full HIPAA compliance certification</div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3>Patient Rights Under HIPAA</h3>
          <p>When fully implemented, you will have rights to access your medical records, request amendments, and obtain an accounting of disclosures.</p>
        </section>
      </div>
    </div>
  );
}