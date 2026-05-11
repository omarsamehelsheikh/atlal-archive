import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';

interface Artwork {
  _id: string;
  Cloudinary_Image1: string;
  Title: string;
  Section: string;
}

const Search: React.FC = () => {
  const [view, setView] = useState<'hero' | 'menu' | 'stack'>('hero');
  const [activeTag, setActiveTag] = useState('');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [stackIndex, setStackIndex] = useState(0);

  const categories = [
    "Archive & Documentation", "Migration & Movement", "Revolution & Resistance",
    "Language & Translation", "Exile & Displacement", "Landscape & Geography",
    "Memory & Nostalgia", "Borders & Territories", "Tradition & Heritage",
    "Home & Homeland", "Diaspora Communities", "Identity & Belonging",
    "War & Conflict", "Loss & Grief"
  ];

  // Fetch artworks for the selected category
  const handleTagClick = async (tag: string) => {
    setActiveTag(tag);
    try {
      const res = await axios.get(`http://54.174.102.52:5000/api/artworks?section=${tag}`);
      setArtworks(res.data.data || []);
      setStackIndex(0);
      setView('stack');
    } catch (err) {
      console.error("Search fetch error", err);
    }
  };

  const nextImage = () => {
    if (artworks.length > 0) {
      setStackIndex((prev) => (prev + 1) % artworks.length);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'white', overflow: 'hidden' }}>
      <Navbar />

      {/* --- LEFT SIDEBAR LABELS --- */}
      <div style={styles.sidebar}>
        <div style={styles.sideLink}>ALL</div>
        <div style={styles.sideLink}>ARTWORK</div>
        <div style={styles.sideLink}>ARTICLES</div>
      </div>

      <AnimatePresence mode="wait">
        {/* 1. INITIAL HERO VIEW */}
        {view === 'hero' && (
          <motion.div 
            key="hero"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={styles.centerContainer}
            onClick={() => setView('menu')}
          >
            <div style={styles.searchPrompt}>SEARCH...</div>
            <img src="/calligraphy_logo.png" style={styles.mainCalligraphy} alt="Atlal" />
          </motion.div>
        )}

        {/* 2. CATEGORY MENU VIEW */}
        {view === 'menu' && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={styles.centerContainer}
          >
            <div style={styles.searchHeader}>SEARCH...</div>
            <div style={styles.tagGrid}>
              {categories.map((cat) => (
                <button key={cat} style={styles.tagButton} onClick={() => handleTagClick(cat)}>
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* 3. IMAGE STACK VIEW */}
        {view === 'stack' && (
          <motion.div 
            key="stack"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={styles.stackWrapper}
            onClick={nextImage}
          >
            <div style={styles.activeTagLabel}>{activeTag}</div>
            
            <div style={styles.stackContainer}>
              {artworks.slice(0, 10).map((art, i) => {
                // Calculate position relative to current index for the "stacking" effect
                const offset = (i - stackIndex + artworks.length) % artworks.length;
                return (
                  <motion.div
                    key={art._id}
                    animate={{
                      scale: offset === 0 ? 1 : 0.8 - offset * 0.05,
                      y: offset * -40,
                      opacity: offset > 5 ? 0 : 1 - offset * 0.2,
                      zIndex: 100 - offset
                    }}
                    style={styles.stackItem}
                  >
                    <img src={art.Cloudinary_Image1} style={styles.stackImg} alt="" />
                  </motion.div>
                );
              })}
            </div>
            
            <button style={styles.closeSearch} onClick={() => setView('menu')}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sidebar: { position: 'absolute', left: '50px', top: '40%', zIndex: 10 },
  sideLink: { fontSize: '32px', fontFamily: 'OT Neue Montreal', fontWeight: '500', marginBottom: '10px', color: '#ccc', cursor: 'pointer' },
  centerContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' },
  searchPrompt: { fontSize: '24px', color: '#ccc', marginBottom: '20px', cursor: 'pointer' },
  mainCalligraphy: { width: '800px', cursor: 'pointer' },
  searchHeader: { fontSize: '64px', fontFamily: 'OT Neue Montreal', marginBottom: '40px' },
  tagGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', maxWidth: '1000px' },
  tagButton: { 
    background: 'black', color: 'white', border: 'none', padding: '15px 25px', 
    borderRadius: '30px', fontSize: '18px', cursor: 'pointer', fontFamily: 'OT Neue Montreal' 
  },
  stackWrapper: { width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' },
  stackContainer: { position: 'relative', width: '600px', height: '400px' },
  stackItem: { position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 },
  stackImg: { width: '100%', height: '100%', objectFit: 'cover', border: '1px solid #eee' },
  activeTagLabel: { position: 'absolute', left: '50px', bottom: '50px', background: 'white', padding: '10px', border: '1px solid black' },
  closeSearch: { position: 'absolute', top: '100px', right: '50px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }
};

export default Search;