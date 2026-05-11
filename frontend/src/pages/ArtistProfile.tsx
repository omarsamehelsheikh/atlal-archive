import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';

interface Artist {
  _id: string;
  Full_Name: string;
  Cloudinary_Image1: string; // Background portrait
  Birth_Year?: string;
  Current_City?: string;
  Email?: string;
  Bio_In_English?: string;
  Bio_In_Arabic?: string;
  Undergraduate_Degree?: string;
  Artistic_Practices?: string;
}

interface Artwork {
  _id: string;
  Title: string;
  Cloudinary_Image1: string;
}

const ArtistProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtist = axios.get(`http://54.174.102.52:5000/api/artists/${id}`);
    const fetchArtworks = axios.get(`http://54.174.102.52:5000/api/artworks?artist=${id}`);

    Promise.all([fetchArtist, fetchArtworks])
      .then(([artistRes, artRes]) => {
        setArtist(artistRes.data.data);
        setArtworks(artRes.data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading || !artist) return <div style={{padding: '100px', textAlign: 'center'}}>LOADING...</div>;

  return (
    <div style={styles.outerContainer}>
      <Navbar />

      {/* --- BACKGROUND PORTRAIT --- */}
      <img src={artist.Cloudinary_Image1} style={styles.bgImage} alt="" />

      {/* --- SCATTERED ARTWORKS (Mapped to your exact Design Coordinates) --- */}
      {artworks.map((art, i) => {
        const pos = scatteredPositions[i % scatteredPositions.length];
        return (
          <div key={art._id} style={{ ...styles.scatteredItem, left: pos.x, top: pos.y }}>
            <img src={art.Cloudinary_Image1} style={styles.scatteredImg} alt={art.Title} />
            <div style={styles.scatteredLabel}>{art.Title}</div>
          </div>
        );
      })}

      {/* --- CENTRAL INFO SHEET --- */}
      <div style={styles.infoSheet}>
        <div style={styles.nameTitle}>{artist.Full_Name}</div>

        <div style={{...styles.label, left: 272, top: 64}}>CONTACT INFO:</div>
        <div style={{...styles.value, left: 247, top: 92}}>{artist.Email}</div>

        <div style={{...styles.label, left: 23, top: 130}}>YEAR OF BIRTH:</div>
        <div style={{...styles.value, left: 23, top: 160}}>{artist.Birth_Year}</div>

        <div style={{...styles.label, left: 573, top: 130}}>BASED IN:</div>
        <div style={{...styles.value, left: 519, top: 160}}>{artist.Current_City}</div>

        <div style={{...styles.label, left: 23, top: 179}}>BIOGRAPHY:</div>
        <div style={styles.bioText}>
          {language === 'ENG' ? artist.Bio_In_English : artist.Bio_In_Arabic}
        </div>

        <div style={{...styles.label, left: 555, top: 179}}>PORTFOLIO:</div>
        <div style={styles.portfolioList}>
           {artworks.slice(0, 8).map(a => <div key={a._id}>{a.Title}</div>)}
        </div>

        <div style={{...styles.label, left: 23, top: 341}}>ARTISTIC PRACTICES:</div>
        <div style={styles.practiceText}>
          {artist.Artistic_Practices || "Sculpture\nInstallation Art\nMixed Media"}
        </div>

        <div style={{...styles.label, left: 591, top: 356}}>FIELDS:</div>
        <div style={{...styles.value, left: 524, top: 381, textAlign: 'right'}}>{artist.Undergraduate_Degree}</div>

        <div style={{...styles.label, left: 201, top: 444, width: '100%', textAlign: 'center'}}>APPEARANCES IN PUBLICATIONS:</div>
        <div style={styles.pubRow}>
            {/* Visual placeholders for publications from design */}
            {[1,2,3,4,5,6].map(n => <img key={n} src="https://placehold.co/75x104" style={styles.pubImg} alt=""/>)}
        </div>
      </div>
    </div>
  );
};

// --- DATA COORDINATES FROM YOUR DESIGN SNIPPET ---
const scatteredPositions = [
  { x: 31.91, y: 523.31 }, { x: 154.19, y: 470.88 }, { x: 141.56, y: 346.08 },
  { x: 184, y: 176.40 }, { x: 94.28, y: 622.03 }, { x: 21.36, y: 361.85 },
  { x: 1307.06, y: 466.15 }, { x: 1307.06, y: 638.26 }, { x: 47.86, y: 773.62 },
  { x: 647.06, y: 765.63 }, { x: 15.13, y: 223.52 }, { x: 1230.06, y: 158.87 }
];

const styles: Record<string, React.CSSProperties> = {
  outerContainer: { width: '100%', height: '100vh', position: 'relative', background: '#ECECEC', overflow: 'hidden' },
  bgImage: { width: '1437px', height: '958px', left: 0, top: '-17px', position: 'absolute', mixBlendMode: 'multiply', opacity: 0.7 },
  infoSheet: { 
    width: '665.26px', height: '606.84px', left: '387.37px', top: '123.08px', 
    position: 'absolute', opacity: 0.85, background: 'white', overflow: 'hidden' 
  },
  nameTitle: { 
    width: '100%', top: '7.43px', position: 'absolute', textAlign: 'center', 
    fontSize: '45.73px', fontFamily: 'OT Neue Montreal', fontWeight: '500', textTransform: 'uppercase' 
  },
  label: { position: 'absolute', color: 'black', fontSize: '18px', fontFamily: 'OT Neue Montreal', fontWeight: '600' },
  value: { position: 'absolute', color: 'black', fontSize: '10px', fontFamily: 'TWK Lausanne', fontWeight: '200', textTransform: 'uppercase' },
  bioText: { 
    left: '23.22px', top: '207.72px', position: 'absolute', color: 'black', fontSize: '11px', 
    fontFamily: 'TWK Lausanne', fontWeight: '200', width: '450px', lineHeight: '1.4' 
  },
  practiceText: { 
    left: '23.22px', top: '366.95px', position: 'absolute', color: 'black', fontSize: '12px', 
    fontFamily: 'TWK Lausanne', fontWeight: '250', whiteSpace: 'pre-line' 
  },
  portfolioList: { 
    position: 'absolute', right: '23px', top: '204px', textAlign: 'right', 
    fontSize: '10px', fontFamily: 'TWK Lausanne', fontWeight: '200' 
  },
  pubRow: { position: 'absolute', bottom: '25px', width: '100%', display: 'flex', justifyContent: 'center', gap: '10px' },
  pubImg: { width: '75px', height: '104px' },
  scatteredItem: { position: 'absolute', zIndex: 5 },
  scatteredImg: { width: '103.77px', height: '62.73px', border: '1px solid black' },
  scatteredLabel: { fontSize: '13px', fontFamily: 'TWK Lausanne', fontWeight: '200', textTransform: 'uppercase', marginTop: '5px' }
};

export default ArtistProfile;