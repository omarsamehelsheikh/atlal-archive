import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';

interface Artwork {
  _id: string;
  Title: string;
  Description_In_English?: string;
  Description_In_Arabic?: string;
  Year_Created?: string;
  Year_Finished?: string;
  Themes?: string[];
  Tags?: string[];
  Cloudinary_Image1: string;
  Cloudinary_Image2?: string;
}

const ArtworkDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch individual artwork data by ID
    axios.get(`http://54.174.102.52:5000/api/artworks/${id}`)
      .then(res => {
        setArtwork(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching artwork details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={styles.loader}>RETRIEVING ARTWORK...</div>;
  if (!artwork) return <div style={styles.loader}>ARTWORK NOT FOUND</div>;

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      
      <div style={{
        ...styles.contentContainer,
        flexDirection: language === 'ENG' ? 'row' as const : 'row-reverse' as const
      }}>
        {/* --- LEFT SIDE: TEXTUAL DATA --- */}
        <div style={{
            ...styles.leftColumn,
            textAlign: language === 'ENG' ? 'left' as const : 'right' as const
        }}>
          <h1 style={styles.title}>{artwork.Title}</h1>
          
          <p style={styles.description}>
            {language === 'ENG' ? artwork.Description_In_English : artwork.Description_In_Arabic}
          </p>
          
          <div style={{
              ...styles.metaRow,
              flexDirection: language === 'ENG' ? 'row' as const : 'row-reverse' as const
          }}>
            <div>
              <div style={styles.label}>YEAR CREATED:</div>
              <div style={styles.value}>{artwork.Year_Created || '2017'}</div>
            </div>
            <div>
              <div style={styles.label}>YEAR FINISHED:</div>
              <div style={styles.value}>{artwork.Year_Finished || '2017'}</div>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.label}>THEMES:</div>
            <div style={{
                ...styles.tagGroup,
                flexDirection: language === 'ENG' ? 'row' as const : 'row-reverse' as const
            }}>
              {artwork.Themes?.map(t => <span key={t} style={styles.themeTag}>{t}</span>)}
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.label}>TAGS:</div>
            <div style={styles.tagGrid}>
              {artwork.Tags?.map(t => <span key={t} style={styles.smallTag}>{t}</span>)}
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: VISUAL DATA --- */}
        <div style={styles.rightColumn}>
          <img src={artwork.Cloudinary_Image1} style={styles.mainImg} alt="Master View" />
          {artwork.Cloudinary_Image2 && (
            <img src={artwork.Cloudinary_Image2} style={styles.secondaryImg} alt="Detail View" />
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { 
    width: '100vw', 
    minHeight: '100vh', 
    background: '#ECECEC', 
    paddingTop: '110px', // Adjusted for global Navbar height
    overflowX: 'hidden' as const
  },
  contentContainer: { 
    display: 'flex', 
    width: '100%', 
    minHeight: 'calc(100vh - 110px)' 
  },
  leftColumn: { 
    width: '40%', 
    padding: '60px', 
    display: 'flex', 
    flexDirection: 'column' as const 
  },
  rightColumn: { 
    width: '60%', 
    padding: '40px', 
    display: 'flex', 
    flexDirection: 'column' as const, 
    gap: '30px', 
    background: '#F5F5F5' 
  },
  title: { 
    fontSize: '64px', 
    fontFamily: 'OT Neue Montreal', 
    fontWeight: '500', 
    marginBottom: '30px', 
    textTransform: 'uppercase' as const 
  },
  description: { 
    fontSize: '14px', 
    lineHeight: '1.6', 
    marginBottom: '40px', 
    fontFamily: 'TWK Lausanne', 
    fontWeight: '200' 
  },
  metaRow: { 
    display: 'flex', 
    gap: '60px', 
    marginBottom: '40px' 
  },
  label: { 
    fontSize: '12px', 
    fontWeight: '700' as const, 
    marginBottom: '8px', 
    fontFamily: 'OT Neue Montreal' 
  },
  value: { 
    fontSize: '14px', 
    fontFamily: 'TWK Lausanne' 
  },
  section: { 
    marginBottom: '35px' 
  },
  tagGroup: { 
    display: 'flex', 
    gap: '10px', 
    flexWrap: 'wrap' as const 
  },
  themeTag: { 
    background: 'black', 
    color: 'white', 
    padding: '8px 16px', 
    fontSize: '10px', 
    textTransform: 'uppercase' as const, 
    fontFamily: 'OT Neue Montreal' 
  },
  tagGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(3, 1fr)', 
    gap: '10px' 
  },
  smallTag: { 
    border: '1px solid black', 
    padding: '6px', 
    textAlign: 'center' as const, 
    fontSize: '10px', 
    textTransform: 'uppercase' as const, 
    fontFamily: 'TWK Lausanne' 
  },
  mainImg: { 
    width: '100%', 
    height: 'auto', 
    border: '1px solid #000', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)' 
  },
  secondaryImg: { 
    width: '100%', 
    height: 'auto', 
    border: '1px solid #000' 
  },
  loader: { 
    padding: '200px', 
    textAlign: 'center' as const, 
    fontFamily: 'OT Neue Montreal', 
    fontSize: '12px', 
    letterSpacing: '2px' 
  }
};

export default ArtworkDetail;