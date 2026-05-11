import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';

const Library: React.FC = () => {
  const { language } = useLanguage();
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('http://54.174.102.52:5000/api/books')
      .then(res => {
        const rawData = res.data.data || [];
        
        // --- DEBUG LOG: Check this in your browser console (F12) ---
        console.log("BACKEND DATA RECEIVED:", rawData[0]);

        // Mapping every possible naming convention to ensure data displays
        const normalizedBooks = rawData.map((b: any) => ({
          _id: b._id,
          title: b.Title || b.title || b.Book_Title || "Untitled Issue",
          cover: b.Cloudinary_Image1 || b.coverImage || b.imageUrl || b.Image || b.cover,
          issue: b.Issue_Number || b.issueNumber || b.issue || "—",
          pages: b.Pages || b.pages || b.bookPages || [],
          descEn: b.Description_In_English || b.description_en || "",
          descAr: b.Description_In_Arabic || b.description_ar || ""
        }));
        setBooks(normalizedBooks);
      })
      .catch(err => console.error("Library Load Error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedBook]);

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingBottom: '100px' }}>
      <Navbar />
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loader" style={styles.loader}>RETRIEVING ARCHIVE...</motion.div>
        ) : !selectedBook ? (
          /* --- GRID VIEW --- */
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            style={styles.gridContainer}
          >
            {books.map((book, i) => (
              <motion.div 
                key={book._id}
                whileHover={{ y: -15 }}
                onClick={() => setSelectedBook(book)}
                style={{ ...styles.bookCard, marginTop: i === 0 ? '0' : '60px' }}
              >
                <div style={styles.imgWrapper}>
                    {book.cover ? (
                        <img src={book.cover} alt={book.title} style={styles.coverImg} />
                    ) : (
                        <div style={{ color: '#ccc' }}>NO IMAGE FOUND</div>
                    )}
                </div>
                <div style={styles.bookMeta}>ISSUE #{book.issue}</div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* --- EDITORIAL VIEW --- */
          <motion.div 
            key="detail"
            initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            style={styles.detailView}
          >
            <div style={{...styles.header, flexDirection: language === 'ENG' ? 'row' : 'row-reverse'}}>
               <div style={styles.headerTitleGroup}>
                  <span style={styles.issueTag}>ISSUE #{selectedBook.issue}</span>
                  <h1 style={{...styles.detailTitle, fontFamily: language === 'ENG' ? 'OT Neue Montreal' : '29L TIdris'}}>
                    {selectedBook.title}
                  </h1>
               </div>
               <button onClick={() => setSelectedBook(null)} style={styles.backBtn}>
                 {language === 'ENG' ? '✕ CLOSE' : '✕ إغلاق'}
               </button>
            </div>

            {selectedBook.pages && selectedBook.pages.length > 0 ? (
              <div style={{...styles.magazineWrapper, flexDirection: language === 'ENG' ? 'row' : 'row-reverse'}}>
                <div style={styles.pageSide}>
                   <img src={selectedBook.pages[currentPage]} style={styles.pageImg} alt="Page L" />
                </div>
                <div style={styles.pageSide}>
                   <img src={selectedBook.pages[currentPage + 1] || selectedBook.pages[0]} style={styles.pageImg} alt="Page R" />
                </div>
                
                <div style={styles.navArrows}>
                  <button style={styles.arrow} onClick={() => setCurrentPage(Math.max(0, currentPage - 2))}>
                    {language === 'ENG' ? '←' : '→'}
                  </button>
                  <button style={styles.arrow} onClick={() => setCurrentPage(Math.min(selectedBook.pages.length - 2, currentPage + 2))}>
                    {language === 'ENG' ? '→' : '←'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={styles.errorMsg}>Pages not yet digitised for this issue.</div>
            )}

            <div style={{
                ...styles.descriptionArea, 
                textAlign: language === 'ENG' ? 'left' : 'right' as any,
                fontFamily: language === 'ENG' ? 'OT Neue Montreal' : '29L TIdris'
            }}>
               <p>{language === 'ENG' ? selectedBook.descEn : selectedBook.descAr}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  loader: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontSize: '12px', letterSpacing: '2px' },
  gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '60px', padding: '150px 80px', maxWidth: '1200px', margin: '0 auto' },
  bookCard: { cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  imgWrapper: { width: '320px', height: '460px', background: '#f5f5f5', border: '1px solid #eee', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  coverImg: { width: '100%', height: '100%', objectFit: 'contain' },
  bookMeta: { marginTop: '15px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' },
  detailView: { padding: '120px 50px', maxWidth: '1440px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' },
  headerTitleGroup: { display: 'flex', alignItems: 'center', gap: '20px' },
  issueTag: { background: '#000', color: '#fff', padding: '5px 12px', fontSize: '12px', fontWeight: 'bold' },
  detailTitle: { fontSize: '42px', fontWeight: '500', textTransform: 'uppercase' },
  backBtn: { background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  magazineWrapper: { display: 'flex', position: 'relative', background: '#f9f9f9', padding: '60px 40px', gap: '15px', justifyContent: 'center', borderRadius: '4px' },
  pageSide: { width: '48%', height: '75vh', background: 'white', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' },
  pageImg: { width: '100%', height: '100%', objectFit: 'contain' },
  navArrows: { position: 'absolute', width: '105%', display: 'flex', justifyContent: 'space-between', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' },
  arrow: { pointerEvents: 'all', background: 'white', border: '1px solid #ddd', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px' },
  descriptionArea: { marginTop: '60px', fontSize: '20px', maxWidth: '900px', lineHeight: '1.6', color: '#1a1a1a' },
  errorMsg: { textAlign: 'center', padding: '100px', color: '#999', fontSize: '14px' }
};

export default Library;