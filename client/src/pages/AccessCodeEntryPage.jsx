import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

function AccessCodeEntryPage() {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for access code in URL
  const urlAccessCode = searchParams.get('accessCode') || '';

  useEffect(() => {
    if (urlAccessCode) {
      setAccessCode(urlAccessCode);
    }
  }, [urlAccessCode]);

  const handleVerify = async () => {
    // Clear previous messages
    setError('');
    setSuccess('');
    
    // Basic validation
    if (!accessCode || accessCode.length !== 4) {
      setError('Please enter a valid 4-digit code');
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        'https://razorpay-backend-nzif.onrender.com/api/verify-access-code',
        { accessCode },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      if (data.success) {
        localStorage.setItem('accessCode', accessCode);
        setSuccess('Access granted! Redirecting...');
        setTimeout(() => navigate('/predict'), 1500);
      } else {
        setError(data.message || 'Invalid code. Please check your payment confirmation email.');
      }
    } catch (err) {
      let errorMessage = 'Network error. Please check your connection.';
      
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data.message || 'Verification failed';
      } else if (err.request) {
        // Request was made but no response
        errorMessage = 'Server not responding. Please try again later.';
      }
      
      setError(errorMessage);
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.backgroundPattern}></div>
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.headerSection}>
          <div style={styles.iconContainer}>
            <span style={styles.lockIcon}>🔐</span>
          </div>
          <h2 style={styles.heading}>Enter Access Code to Proceed</h2>
          <p style={styles.subtitle}>Please enter your 4-digit access code to continue</p>
        </div>

        {/* Input Section */}
        <div style={styles.inputSection}>
          <div style={styles.inputContainer}>
            <input
              type="text"
              placeholder="Enter 4-digit Access Code"
              value={accessCode || urlAccessCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                if (value.length <= 4) {
                  setAccessCode(value);
                  setError('');
                  setSuccess('');
                }
              }}
              style={{
                ...styles.input,
                borderColor: error ? '#ef4444' : success ? '#22c55e' : '#e5e7eb',
                backgroundColor: loading ? '#f9fafb' : '#ffffff'
              }}
              maxLength={4}
              disabled={loading}
            />
            <div style={styles.inputIndicator}>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.dot,
                    backgroundColor: i < (accessCode || urlAccessCode).length ? '#3b82f6' : '#e5e7eb'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div style={styles.errorMessage}>
              <span style={styles.errorIcon}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={styles.successMessage}>
              <span style={styles.successIcon}>✅</span>
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* Button Section */}
        <button 
          onClick={handleVerify} 
          style={{
            ...styles.button,
            backgroundColor: loading ? '#9ca3af' : '#3b82f6',
            cursor: loading ? 'not-allowed' : 'pointer',
            transform: loading ? 'none' : 'translateY(0)',
          }}
          disabled={loading}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#2563eb';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#3b82f6';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }
          }}
        >
          {loading ? (
            <div style={styles.buttonContent}>
              <div style={styles.spinner}></div>
              <span>Verifying...</span>
            </div>
          ) : (
            <div style={styles.buttonContent}>
              <span>Verify & Continue</span>
              <span style={styles.arrow}>→</span>
            </div>
          )}
        </button>

        {/* Footer Section */}
        <div style={styles.footerSection}>
          <p style={styles.footerText}>
            Don't have an Access Code?{' '}
            <a 
              href="https://voluble-strudel-67099c.netlify.app/" 
              style={styles.link}
              onMouseEnter={(e) => {
                e.target.style.color = '#1d4ed8';
                e.target.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#3b82f6';
                e.target.style.textDecoration = 'none';
              }}
            >
              Complete Payment
            </a>{' '}
            to get one.
          </p>
          
          <div style={styles.securityBadge}>
            <span style={styles.shieldIcon}>🛡️</span>
            <span style={styles.securityText}>Secure & Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                      radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
    pointerEvents: 'none',
  },
  container: {
    maxWidth: '420px',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px 32px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  iconContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    borderRadius: '50%',
    marginBottom: '24px',
    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
  },
  lockIcon: {
    fontSize: '36px',
    filter: 'brightness(0) invert(1)',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: '0',
    lineHeight: '1.5',
  },
  inputSection: {
    marginBottom: '32px',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: '16px',
  },
  input: {
    width: '100%',
    padding: '16px 20px',
    fontSize: '20px',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: '8px',
    border: '2px solid #e5e7eb',
    borderRadius: '16px',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'monospace',
    boxSizing: 'border-box',
  },
  inputIndicator: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '12px',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    color: '#dc2626',
    fontSize: '14px',
    fontWeight: '500',
  },
  errorIcon: {
    fontSize: '16px',
  },
  successMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '12px',
    color: '#166534',
    fontSize: '14px',
    fontWeight: '500',
  },
  successIcon: {
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '16px 24px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    marginBottom: '24px',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  arrow: {
    fontSize: '18px',
    transition: 'transform 0.3s ease',
  },
  footerSection: {
    textAlign: 'center',
  },
  footerText: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px',
    margin: '0 0 16px 0',
    lineHeight: '1.5',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  securityBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '20px',
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500',
  },
  shieldIcon: {
    fontSize: '14px',
  },
  securityText: {
    fontSize: '12px',
  },
};

// Add keyframe animation for spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default AccessCodeEntryPage;