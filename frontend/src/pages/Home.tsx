import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import ForceGraph3D, { ForceGraphMethods } from 'react-force-graph-3d';
import axios from 'axios';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';

const textureCache: { [key: string]: THREE.Texture } = {};
const loader = new THREE.TextureLoader();

const Home: React.FC = () => {
  const { language } = useLanguage();
  const [artists, setArtists] = useState<any[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<any | null>(null);
  const [artistArtworks, setArtistArtworks] = useState<any[]>([]);
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const fgRef = useRef<ForceGraphMethods>();

  useEffect(() => {
    axios.get('http://54.174.102.52:5000/api/artists')
      .then(res => setArtists(res.data.data || []))
      .catch(err => console.error("Archive connection error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedArtist) {
      const artistId = selectedArtist._id || selectedArtist.id;
      axios.get(`http://54.174.102.52:5000/api/artworks?artist=${artistId}`)
        .then(res => setArtistArtworks(res.data.data || []))
        .catch(() => setArtistArtworks([]));
    }
  }, [selectedArtist]);

  // HIGH-QUALITY IMAGE NODES
  const getNodeObject = useCallback((node: any) => {
    const imgUrl = node.Cloudinary_Image1 || 'https://placehold.co/200';
    
    if (!textureCache[imgUrl]) {
      const tex = loader.load(imgUrl);
      tex.minFilter = THREE.LinearFilter; // Improves visual quality
      textureCache[imgUrl] = tex;
    }

    const material = new THREE.SpriteMaterial({ 
      map: textureCache[imgUrl],
      color: 0xffffff
    });
    
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(40, 40, 1); 
    return sprite;
  }, []);

  const graphData = useMemo(() => ({ nodes: artists, links: [] }), [artists]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      style={{ width: '100vw', height: '100vh', background: '#FFFFFF', overflow: 'hidden' }}
      onMouseMove={handleMouseMove}
    >
      <Navbar />

      {/* --- EXPANDED HOVER LABEL SYSTEM --- */}
      {hoveredNode && !selectedArtist && (
        <div style={{
          ...styles.hoverLabel,
          left: mousePos.x + 20,
          top: mousePos.y + 20
        }}>
          <div style={styles.hoverName}>{hoveredNode.Full_Name || hoveredNode.name}</div>
          
          <div style={styles.hoverDetailRow}>
            <span style={styles.hoverLabelKey}>BORN:</span>
            <span style={styles.hoverLabelVal}>{hoveredNode.Birth_Year || '—'}</span>
          </div>

          <div style={styles.hoverDetailRow}>
            <span style={styles.hoverLabelKey}>BASED:</span>
            <span style={styles.hoverLabelVal}>{hoveredNode.Current_City || '—'}</span>
          </div>

          <div style={styles.hoverDetailRow}>
            <span style={styles.hoverLabelKey}>PRACTICE:</span>
            <span style={styles.hoverLabelVal}>
                {hoveredNode.Artistic_Practices?.split('\n')[0] || 'Visual Arts'}
            </span>
          </div>
        </div>
      )}

      <div style={{ display: selectedArtist ? 'none' : 'block' }}>
        {!isLoading && (
          <ForceGraph3D
            ref={fgRef}
            graphData={graphData}
            backgroundColor="#FFFFFF"
            showNavInfo={false}
            nodeThreeObject={getNodeObject}
            enableNodeDrag={false} 
            onNodeHover={(node) => setHoveredNode(node)}
            onNodeClick={(node: any) => setSelectedArtist(node)}
          />
        )}
      </div>

      {selectedArtist && (
        <div style={styles.overlay} onClick={() => setSelectedArtist(null)}>
          <img src={selectedArtist.Cloudinary_Image1} style={styles.bgImage} alt="" />

          {artistArtworks.map((art, i) => {
            const pos = scatteredPositions[i % scatteredPositions.length];
            return (
              <Link 
                key={art._id} 
                to={`/artwork/${art._id}`} 
                style={{ ...styles.scatteredItem, left: pos.x, top: pos.y, textDecoration: 'none' }}
                onClick={(e) => e.stopPropagation()} 
              >
                <img 
                   src={art.Cloudinary_Image1 || art.imageUrl} 
                   style={styles.scatteredImg} 
                   alt={art.Title || art.title} 
                />
                <div style={styles.scatteredLabel}>{art.Title || art.title}</div>
              </Link>
            );
          })}

          <div style={styles.infoSheet} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setSelectedArtist(null)}>✕</button>
            <div style={styles.nameHeader}>{selectedArtist.Full_Name || selectedArtist.name}</div>
            
            <div style={{...styles.label, left: 272, top: 64}}>CONTACT INFO:</div>
            <div style={{...styles.value, left: 247, top: 92}}>{selectedArtist.Email || 'atlalcompendium@gmail.com'}</div>
            
            <div style={{...styles.label, left: 23, top: 130}}>YEAR OF BIRTH:</div>
            <div style={{...styles.value, left: 23, top: 160}}>{selectedArtist.Birth_Year || '—'}</div>
            
            <div style={{...styles.label, left: 573, top: 130}}>BASED IN:</div>
            <div style={{...styles.value, left: 519, top: 160}}>{selectedArtist.Current_City || '—'}</div>
            
            <div style={{...styles.label, left: 23, top: 179}}>BIOGRAPHY:</div>
            <div style={styles.bioBox}>
              {language === 'ENG' ? (selectedArtist.Bio_In_English || selectedArtist.biography) : (selectedArtist.Bio_In_Arabic || selectedArtist.biography)}
            </div>
            
            <div style={{...styles.label, left: 555, top: 179}}>PORTFOLIO:</div>
            <div style={styles.portfolioSideList}>
               {artistArtworks.slice(0, 8).map(a => <div key={a._id}>{a.Title || a.title}</div>)}
            </div>
            
            <div style={{...styles.label, left: 23, top: 341}}>ARTISTIC PRACTICES:</div>
            <div style={styles.practiceText}>{selectedArtist.Artistic_Practices || "Mixed Media"}</div>
            
            <div style={{...styles.label, left: 591, top: 356}}>FIELDS:</div>
            <div style={{...styles.value, left: 524, top: 381, textAlign: 'right' as const}}>{selectedArtist.Undergraduate_Degree || 'Fine Arts'}</div>
            
            <div style={{...styles.label, left: 201, top: 444, width: '100%', textAlign: 'center' as const}}>APPEARANCES IN PUBLICATIONS:</div>
            <div style={styles.pubRow}>
               {[1, 2, 3, 4, 5].map(n => <img key={n} src="https://placehold.co/75x104" style={styles.pubThumb} alt=""/>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const scatteredPositions = [
  { x: 31.91, y: 523.31 }, { x: 154.19, y: 470.88 }, { x: 141.56, y: 346.08 },
  { x: 1307.06, y: 466.15 }, { x: 1307.06, y: 638.26 }, { x: 15.13, y: 223.52 },
  { x: 1230.06, y: 158.87 }, { x: 1036.76, y: 739.90 }, { x: 826.92, y: 745.90 }
];

const styles = {
  hoverLabel: {
    position: 'fixed' as const, zIndex: 10000, pointerEvents: 'none' as const,
    background: 'rgba(0,0,0,0.9)', color: 'white', padding: '15px', borderRadius: '2px',
    display: 'flex', flexDirection: 'column' as const, gap: '8px', minWidth: '200px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)'
  },
  hoverName: { fontSize: '18px', fontWeight: 'bold' as any, fontFamily: 'OT Neue Montreal', textTransform: 'uppercase' as const, borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '5px', marginBottom: '5px' },
  hoverDetailRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  hoverLabelKey: { fontSize: '9px', fontWeight: 'bold' as any, opacity: 0.6, fontFamily: 'OT Neue Montreal' },
  hoverLabelVal: { fontSize: '11px', fontFamily: 'TWK Lausanne', textAlign: 'right' as const },
  overlay: { position: 'fixed' as const, top: 0, left: 0, width: '100vw', height: '100vh', background: '#ECECEC', zIndex: 9999, overflow: 'hidden' },
  bgImage: { width: '1437px', height: '958px', left: 0, top: '-17px', position: 'absolute' as const, mixBlendMode: 'multiply' as const, opacity: 0.7, zIndex: 1 },
  infoSheet: { width: '665.26px', height: '606.84px', left: '50%', top: '55%', transform: 'translate(-50%, -50%)', position: 'absolute' as const, opacity: 0.85, background: 'white', zIndex: 10, overflow: 'hidden' },
  nameHeader: { width: '100%', top: '7.43px', position: 'absolute' as const, textAlign: 'center' as const, fontSize: '45.73px', fontFamily: 'OT Neue Montreal', fontWeight: '500', textTransform: 'uppercase' as const },
  label: { position: 'absolute' as const, fontSize: '16px', fontWeight: '600' as any, fontFamily: 'OT Neue Montreal', color: 'black' },
  value: { position: 'absolute' as const, fontSize: '10px', fontFamily: 'TWK Lausanne', fontWeight: '200' as any, textTransform: 'uppercase' as const },
  bioBox: { position: 'absolute' as const, left: '23.22px', top: '207.72px', width: '450px', height: '130px', fontSize: '11px', fontFamily: 'TWK Lausanne', lineHeight: '1.4', overflowY: 'auto' as const },
  practiceText: { position: 'absolute' as const, left: '23.22px', top: '366.95px', fontSize: '12px', fontFamily: 'TWK Lausanne', whiteSpace: 'pre-line' as const },
  portfolioSideList: { position: 'absolute' as const, right: '23px', top: '204px', textAlign: 'right' as const, fontSize: '10px', fontFamily: 'TWK Lausanne', fontWeight: '200' as any },
  pubRow: { position: 'absolute' as const, bottom: '25px', width: '100%', display: 'flex', justifyContent: 'center' as const, gap: '10px' },
  pubThumb: { width: '65px', height: '90px', border: '1px solid #ddd' },
  scatteredItem: { position: 'absolute' as const, zIndex: 100, display: 'flex', flexDirection: 'column' as const, alignItems: 'center' }, 
  scatteredImg: { width: '103.77px', height: '62.73px', border: '1px solid black', objectFit: 'cover' as const },
  scatteredLabel: { fontSize: '13px', fontFamily: 'TWK Lausanne', textTransform: 'uppercase' as const, marginTop: '5px', color: 'black' },
  closeBtn: { position: 'absolute' as const, right: '20px', top: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', zIndex: 100 }
};

export default Home;