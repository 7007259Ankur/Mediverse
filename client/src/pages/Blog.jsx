// src/pages/Blog.jsx
import styles from './Blog.module.css';
import blogImage1 from '../assets/blog1.png'; // Add blog post images
import blogImage2 from '../assets/blog2.png';
import blogImage3 from '../assets/blog3.png';

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of AI in Diagnostics",
      category: "Technology",
      date: "May 2024",
      excerpt: "Exploring how our AI models are achieving 95% accuracy in preliminary diagnoses and what this means for rural healthcare.",
      image: blogImage1,
      link: "#"
    },
    {
      id: 2,
      title: "Overcoming Rural Healthcare Challenges",
      category: "Case Study",
      date: "April 2024",
      excerpt: "How MediVerse's telemedicine solution is making an impact in remote villages across Maharashtra and Odisha.",
      image: blogImage2,
      link: "#"
    },
    {
      id: 3,
      title: "Platform Update: Version 2.3 Released",
      category: "Updates",
      date: "March 2024",
      excerpt: "New features include multilingual support and improved symptom checker with 30% faster processing times.",
      image: blogImage3,
      link: "#"
    }
  ];

  const categories = [
    { name: "Telemedicine", count: 12 },
    { name: "AI Diagnostics", count: 8 },
    { name: "Rural Healthcare", count: 15 },
    { name: "Case Studies", count: 7 },
    { name: "Platform Updates", count: 5 }
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>MediVerse Blog</h1>
          <p>Insights on telemedicine, AI diagnostics, and our journey to transform healthcare accessibility</p>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Blog Posts */}
        <section className={styles.blogPosts}>
          <div className={styles.sectionHeader}>
            <h2>Latest Articles</h2>
            <p>Stay updated with our thoughts and developments</p>
          </div>
          
          <div className={styles.postsGrid}>
            {blogPosts.map((post) => (
              <article key={post.id} className={styles.postCard}>
                <div className={styles.postImage} style={{ backgroundImage: `url(${post.image})` }} />
                <div className={styles.postContent}>
                  <div className={styles.postMeta}>
                    <span className={styles.category}>{post.category}</span>
                    <span className={styles.date}>{post.date}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <a href={post.link} className={styles.readMore}>Continue reading →</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h3>Categories</h3>
            <ul className={styles.categoryList}>
              {categories.map((category, index) => (
                <li key={index}>
                  <a href="#">{category.name} <span>({category.count})</span></a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.sidebarSection}>
            <h3>Subscribe</h3>
            <p>Get the latest posts delivered to your inbox</p>
            <form className={styles.subscribeForm}>
              <input type="email" placeholder="Your email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>

          <div className={styles.sidebarSection}>
            <h3>Visit Our Blog</h3>
            <p>For more articles and updates, visit our full blog</p>
            <a href="https://blog.mediverse.com" className={styles.externalLink} target="_blank" rel="noopener noreferrer">
              blog.mediverse.com →
            </a>
          </div>
        </aside>
      </div>

      {/* Newsletter CTA */}
      <section className={styles.newsletter}>
        <div className={styles.newsletterContent}>
          <h2>Stay Informed</h2>
          <p>Join our monthly newsletter for platform updates, healthcare insights, and community stories</p>
          <form className={styles.newsletterForm}>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}