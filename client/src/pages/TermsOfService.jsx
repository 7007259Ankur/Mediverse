import styles from './Legal.module.css';

export default function TermsOfService() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Terms of Service</h1>
          <p>Guidelines for using MediVerse's platform and services</p>
        </div>
      </section>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Acceptance of Terms</h2>
          <p>By accessing or using MediVerse, you agree to comply with these terms and all applicable laws and regulations.</p>
        </section>

        <section className={styles.section}>
          <h3>User Responsibilities</h3>
          <div className={styles.termsGrid}>
            <div className={styles.termCard}>
              <h4>Proper Use</h4>
              <p>Use AI tools only for preliminary analysis, not as a substitute for professional medical advice.</p>
            </div>
            <div className={styles.termCard}>
              <h4>Content Policy</h4>
              <p>Do not share fake, harmful, or misleading medical information.</p>
            </div>
            <div className={styles.termCard}>
              <h4>Professional Boundaries</h4>
              <p>Maintain appropriate doctor-patient relationships at all times.</p>
            </div>
            <div className={styles.termCard}>
              <h4>Account Security</h4>
              <p>You are responsible for maintaining the confidentiality of your login credentials.</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3>Prohibited Activities</h3>
          <ul className={styles.warningList}>
            <li>Reverse engineering or attempting to extract source code</li>
            <li>Using bots, scrapers, or other automated tools</li>
            <li>Impersonating medical professionals</li>
            <li>Uploading malicious software or viruses</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h3>Account Termination</h3>
          <p>We reserve the right to suspend or terminate accounts that violate these terms. Repeated violations may result in permanent bans.</p>
          <a href="/full-terms.pdf" className={styles.downloadLink}>Download Complete Terms of Service</a>
        </section>
      </div>
    </div>
  );
}