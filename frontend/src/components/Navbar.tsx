import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Navbar: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleLanguage = (lang: 'ENG' | 'AR') => {
    setLanguage(lang);
    setShowDropdown(false);
  };

  return (
    <nav style={styles.navWrapper}>
      {/* CONTAINER DYNAMICS: 
          English: Search & Lang (Left), Logo (Center), Links (Right)
          Arabic: Links (Left), Logo (Center), Search & Lang (Right)
      */}
      <div style={{
        ...styles.container,
        flexDirection: language === 'ENG' ? 'row' : 'row-reverse'
      }}>
        
        {/* --- SEARCH & LANGUAGE GROUP --- */}
        <div style={{ ...styles.group, gap: '20px' }}>
          {/* Search Button */}
          <Link to="/search" style={styles.searchButton}>
            <div style={styles.searchBg}>
               <div style={styles.searchIcon} />
               <span style={{
                 ...styles.searchText,
                 fontFamily: language === 'ENG' ? 'PP Neue Montreal' : 'Softcore TRIAL'
               }}>
                 {language === 'ENG' ? 'SEARCH' : 'بحث'}
               </span>
            </div>
          </Link>

          {/* Language Toggle */}
          <div style={{ position: 'relative' }}>
            <div 
              style={styles.langToggle} 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span style={{ 
                fontFamily: language === 'ENG' ? 'PP Neue Montreal' : 'Softcore TRIAL' 
              }}>
                {language === 'ENG' ? 'ENG' : 'العربية'}
              </span>
              <div style={styles.arrowIcon} />
            </div>

            {showDropdown && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownItem} onClick={() => toggleLanguage('ENG')}>ENGLISH</div>
                <div style={styles.dropdownItem} onClick={() => toggleLanguage('AR')}>العربية</div>
              </div>
            )}
          </div>
        </div>

        {/* --- CENTER LOGO --- */}
        <div style={styles.centerLogo}>
          <Link to="/">
            <img 
              src="/calligraphy_logo.png" 
              alt="Atlal" 
              style={{ width: '193.32px', height: '61.63px' }} 
            />
          </Link>
        </div>

        {/* --- NAVIGATION LINKS --- */}
        <div style={{ ...styles.group, gap: '30px' }}>
          <Link to="/library" style={{...styles.navLink, fontFamily: language === 'ENG' ? 'PP Neue Montreal' : 'Softcore TRIAL'}}>
            {language === 'ENG' ? 'LIBRARY' : 'منشورات'}
          </Link>
          <Link to="/manifesto" style={{...styles.navLink, fontFamily: language === 'ENG' ? 'PP Neue Montreal' : 'Softcore TRIAL'}}>
            {language === 'ENG' ? 'MANIFESTO' : 'بيان'}
          </Link>
          <Link to="/about" style={{...styles.navLink, fontFamily: language === 'ENG' ? 'PP Neue Montreal' : 'Softcore TRIAL'}}>
            {language === 'ENG' ? 'ABOUT' : 'عن اطلال'}
          </Link>
        </div>
      </div>
    </nav>
  );
};

const styles: Record<string, React.CSSProperties> = {
  navWrapper: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '110px',
    background: 'white', zIndex: 2000, display: 'flex', alignItems: 'center'
  },
  container: {
    width: '100%', padding: '0 50px', display: 'flex', alignItems: 'center', 
    justifyContent: 'space-between', position: 'relative'
  },
  group: { display: 'flex', alignItems: 'center' },
  searchButton: { textDecoration: 'none' },
  searchBg: {
    width: '191px', height: '39px', background: '#D9D9D9', borderRadius: '40px',
    display: 'flex', alignItems: 'center', padding: '0 15px', gap: '10px', position: 'relative'
  },
  searchIcon: { width: '18.5px', height: '18.99px', border: '2px solid #1E1E1E' },
  searchText: { fontSize: '20px', color: 'black', opacity: 0.7, fontWeight: '500' },
  langToggle: {
    width: '94px', height: '39px', background: '#D9D9D9', borderRadius: '20px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
    fontSize: '20px', color: 'black', fontWeight: '500'
  },
  arrowIcon: { width: '10px', height: '5px', border: '1.5px solid black', borderTop: 'none', borderLeft: 'none', transform: 'rotate(45deg)' },
  centerLogo: { position: 'absolute', left: '50%', transform: 'translateX(-50%)' },
  navLink: { textDecoration: 'none', color: 'black', fontSize: '24px', fontWeight: '500' },
  dropdown: { position: 'absolute', top: '45px', left: 0, background: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', width: '120px' },
  dropdownItem: { padding: '10px', fontSize: '14px', cursor: 'pointer', textAlign: 'center', borderBottom: '1px solid #eee' }
};

export default Navbar;