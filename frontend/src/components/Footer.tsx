import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer style={styles.footerWrapper}>
      <div style={styles.container}>
        
        {/* --- LOGO / CALLIGRAPHY --- */}
        <div style={styles.logoGroup}>
          <img 
            style={styles.logoImg} 
            src="/calligraphy_logo.png" 
            alt="Atlal" 
          />
        </div>

        {/* --- EMAIL SECTION (Real Icon + Text) --- */}
        <div style={{
          ...styles.emailGroup,
          left: language === 'ENG' ? 100 : 'auto',
          right: language === 'AR' ? 100 : 'auto',
          flexDirection: language === 'ENG' ? 'row' : 'row-reverse'
        }}>
          {/* Real Mail Icon (SVG) */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          <span style={styles.emailText}>atlalcompendium@gmail.com</span>
        </div>

        {/* --- INSTAGRAM SECTION (Real Official Icon) --- */}
        <a 
          href="https://instagram.com/atlalcompendium" // Update with your real link
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            ...styles.socialLink,
            left: language === 'ENG' ? 324 : 'auto',
            right: language === 'AR' ? 324 : 'auto'
          }}
        >
          {/* Official Instagram SVG Path */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
          </svg>
        </a>

        {/* --- ARCHIVE TAG --- */}
        <div style={{
           ...styles.archiveTag,
           right: language === 'ENG' ? 50 : 'auto',
           left: language === 'AR' ? 50 : 'auto'
        }}>
           © ATLAL {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};

const styles: Record<string, React.CSSProperties> = {
  footerWrapper: {
    width: '100%',
    height: '146px',
    background: 'white',
    position: 'relative',
    borderTop: '1px solid #eee',
    marginTop: 'auto'
  },
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    maxWidth: '1440px',
    margin: '0 auto'
  },
  logoGroup: {
    width: '131.67px',
    height: '41.98px',
    left: '100px',
    top: '20px',
    position: 'absolute'
  },
  logoImg: { width: '100%', height: '100%', objectFit: 'contain' },
  emailGroup: {
    top: '80px',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  emailText: {
    color: 'black',
    fontSize: '11px',
    fontFamily: 'Inter',
    fontWeight: '500',
    letterSpacing: '0.55px'
  },
  socialLink: {
    width: '32px',
    height: '32px',
    top: '75px',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s'
  },
  archiveTag: {
    position: 'absolute',
    top: '86px',
    fontSize: '11px',
    fontWeight: 'bold',
    fontFamily: 'Inter',
    letterSpacing: '1px'
  }
};

export default Footer;