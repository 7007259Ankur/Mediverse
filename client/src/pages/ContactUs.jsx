import styles from './Legal.module.css';

export default function ContactUs() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Contact Us</h1>
          <p>Get in touch with our team for support, questions, or feedback</p>
        </div>
      </section>

      <div className={styles.contactContent}>
        <section className={styles.contactMethods}>
          <div className={styles.contactCard}>
            <div className={styles.contactIcon}>📧</div>
            <h3>Email Support</h3>
            <p>For general inquiries and support</p>
            <a href="mailto:support@mediverse.com" className={styles.contactLink}>support@mediverse.com</a>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.contactIcon}>📞</div>
            <h3>Phone Support</h3>
            <p>Available Monday-Friday, 9AM-6PM IST</p>
            <a href="tel:+919876543210" className={styles.contactLink}>+91-9876543210</a>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.contactIcon}>🏢</div>
            <h3>Corporate Office</h3>
            <p>MediVerse Innovations Pvt. Ltd.</p>
            <address className={styles.address}>
              Sector 62, Noida<br />
              Delhi NCR, India<br />
              PIN - 201309
            </address>
          </div>
        </section>

        <section className={styles.contactFormSection}>
          <h2>Send Us a Message</h2>
          <form className={styles.contactForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="subject">Subject</label>
              <select id="subject">
                <option>General Inquiry</option>
                <option>Technical Support</option>
                <option>Privacy Concern</option>
                <option>Partnership</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="5" required></textarea>
            </div>
            <button type="submit" className={styles.submitButton}>Send Message</button>
          </form>
        </section>
      </div>
    </div>
  );
}