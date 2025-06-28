import styles from './Legal.module.css';

export default function PrivacyPolicy() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Privacy Policy</h1>
          <p>Your data security and privacy are our top priorities</p>
        </div>
      </section>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Data Protection Commitment</h2>
          <p>MediVerse is committed to protecting your personal and medical information. We implement industry-standard security measures to ensure your data remains confidential and secure.</p>
        </section>

        <section className={styles.section}>
          <h3>Information We Collect</h3>
          <ul>
            <li>Medical reports and diagnostic images you upload</li>
            <li>Consultation notes and doctor-patient interactions</li>
            <li>Basic account information (name, email, contact details)</li>
            <li>Usage data to improve our services</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h3>How We Protect Your Data</h3>
          <div className={styles.features}>
            <div className={styles.featureCard}>
              <div className={styles.icon}>🔒</div>
              <h4>End-to-End Encryption</h4>
              <p>All medical data is encrypted both in transit and at rest using AES-256 encryption.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.icon}>👁️</div>
              <h4>Strict Access Controls</h4>
              <p>Role-based access ensures only authorized personnel can view sensitive data.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.icon}>🚫</div>
              <h4>No Data Sharing</h4>
              <p>We do not share or sell your data to any third-party services.</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3>Your Rights</h3>
          <p>You have the right to access, correct, or delete your personal information at any time through your account settings or by contacting our support team.</p>
          <a href="/full-privacy-policy.pdf" className={styles.downloadLink}>Download Full Privacy Policy (PDF)</a>
        </section>
      </div>
    </div>
  );
}