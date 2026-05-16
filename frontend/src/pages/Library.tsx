import React, { useState, useRef, useEffect } from "react";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";
import ArticleView from "./ArticleView";
import { Document, Page, pdfjs } from "react-pdf";
import {
  BOOK_DESCRIPTIONS,
  BOOK_DESCRIPTIONS_AR,
  BOOK_ARTICLES,
  BOOK_ID_LABELS_AR,
  RANDOM_DIMENSIONS,
  RANDOM_PAGES,
  RANDOM_DESIGNERS,
} from "./libraryData";

/* ─── Floating Info Card ─────────────────────────────────────── */
interface InfoCardProps {
  book: any;
  isArabic: boolean;
  onReadMore: () => void;
  onClose: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({ book, isArabic, onReadMore, onClose }) => {
  const description = isArabic
    ? BOOK_DESCRIPTIONS_AR[book.titleEn]
    : BOOK_DESCRIPTIONS[book.titleEn];
  const title = isArabic ? book.titleAr : book.titleEn;
  const bookId = isArabic
    ? BOOK_ID_LABELS_AR[book.book_id] || book.book_id
    : book.book_id;

  const cardW = 300;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 8 }}
      transition={{ duration: 0.18 }}
      style={{
        position: "fixed",
        top: 130,
        right: 24,
        width: cardW,
        zIndex: 99999,
        background: isArabic ? "#111" : "#fff",
        border: isArabic ? "1px solid #333" : "1px solid #e0e0e0",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        borderRadius: 2,
        padding: "20px",
        pointerEvents: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 700, textDecoration: "underline", fontFamily: "TWK Lausanne", color: isArabic ? "#fff" : "#000" }}>
          {bookId}
        </span>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: isArabic ? "#aaa" : "#666", lineHeight: 1, padding: 0 }}
        >
          ×
        </button>
      </div>

      <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "TWK Lausanne", color: "#7B2FBE", marginBottom: 10, lineHeight: 1.2 }}>
        {title}
      </div>

      <img
        src={book.cover}
        alt="cover"
        onError={(e) => { (e.target as HTMLImageElement).src = "/book1.png"; }}
        style={{ width: "100%", height: 110, objectFit: "cover", marginBottom: 10 }}
      />

      <p style={{ fontSize: 11, color: isArabic ? "#bbb" : "#444", fontFamily: "TWK Lausanne", lineHeight: 1.6, margin: 0, marginBottom: 12,
        display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {description}
      </p>

      <div style={{ textAlign: isArabic ? "left" : "right" }}>
        <button
          onClick={onReadMore}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "TWK Lausanne", fontSize: 11, fontWeight: 700,
            textDecoration: "underline", color: isArabic ? "#fff" : "#000" }}
        >
          {isArabic ? "← إقرأ المزيد" : "READ MORE →"}
        </button>
      </div>
    </motion.div>
  );
};

/* ─── Spread Detail Card (same style as InfoCard, overlaid) ─── */
interface SpreadCardProps {
  book: any;
  spreadUrl: string;
  spreadIndex: number;
  isArabic: boolean;
  x: number;
  y: number;
  onReadMore: () => void;
  onClose: () => void;
}

const SpreadCard: React.FC<SpreadCardProps> = ({ book, spreadUrl, isArabic, x, y, onReadMore, onClose }) => {
  const description = isArabic ? BOOK_DESCRIPTIONS_AR[book.titleEn] : BOOK_DESCRIPTIONS[book.titleEn];
  const title = isArabic ? book.titleAr : book.titleEn;
  const bookId = isArabic ? BOOK_ID_LABELS_AR[book.book_id] || book.book_id : book.book_id;

  const cardW = 300;
  const cardH = 400;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const left = Math.min(x + 12, vw - cardW - 16);
  const top = Math.min(y + 12, vh - cardH - 16);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 8 }}
      transition={{ duration: 0.18 }}
      style={{
        position: "fixed",
        left,
        top,
        width: cardW,
        zIndex: 99999,
        background: isArabic ? "#111" : "#fff",
        border: isArabic ? "1px solid #333" : "1px solid #e0e0e0",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        borderRadius: 2,
        padding: "20px",
        pointerEvents: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 700, textDecoration: "underline", fontFamily: "TWK Lausanne", color: isArabic ? "#fff" : "#000" }}>
          {bookId}
        </span>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: isArabic ? "#aaa" : "#666", lineHeight: 1, padding: 0 }}
        >
          ×
        </button>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "TWK Lausanne", color: "#7B2FBE", marginBottom: 10, lineHeight: 1.2 }}>
        {title}
      </div>

     <img
  src={spreadUrl}
  alt="spread"
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    const match = target.src.match(/spread(\d+)\.jpg$/);
    if (match && !target.src.includes("/spread")) {
      target.src = `/spread${match[1]}.jpg`;
    }
  }}
  style={{ width: "100%", height: 130, objectFit: "cover", marginBottom: 10 }}
/>

      <p style={{ fontSize: 11, color: isArabic ? "#bbb" : "#444", fontFamily: "TWK Lausanne", lineHeight: 1.6, margin: 0, marginBottom: 8,
        display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {description}
      </p>

      <div style={{ fontSize: 11, lineHeight: 1.8, fontFamily: "TWK Lausanne", color: isArabic ? "#888" : "#666", marginBottom: 12 }}>
        <div>{isArabic ? "الحجم:" : "Size:"} {book.dimensions}</div>
        <div>{isArabic ? "الصفحات:" : "Pages:"} {book.pageCount}</div>
      </div>

      <div style={{ textAlign: isArabic ? "left" : "right" }}>
        <button
          onClick={onReadMore}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "TWK Lausanne", fontSize: 11, fontWeight: 700,
            textDecoration: "underline", color: isArabic ? "#fff" : "#000" }}
        >
          {isArabic ? "← إقرأ المزيد" : "READ MORE →"}
        </button>
      </div>
    </motion.div>
  );
};

/* ─── Spreads Page ───────────────────────────────────────────── */
interface SpreadsPageProps {
  book: any;
  isArabic: boolean;
  onBack: () => void;
  onReadMore: () => void;
}

const SpreadsPage: React.FC<SpreadsPageProps> = ({ book, isArabic, onBack, onReadMore }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverCard, setHoverCard] = useState<{ index: number; x: number; y: number } | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const title = isArabic ? book.titleAr : book.titleEn;
  const bookId = isArabic ? BOOK_ID_LABELS_AR[book.book_id] || book.book_id : book.book_id;

  const handleSpreadMouseEnter = (e: React.MouseEvent, index: number) => {
    setHoveredIndex(index);
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setHoverCard({ index, x: e.clientX, y: e.clientY });
    }, 180);
  };

  const handleSpreadMouseLeave = () => {
    setHoveredIndex(null);
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setHoverCard(null), 200);
  };

  // Click on spread goes straight to article
  const handleSpreadClick = () => {
    setHoverCard(null);
    onReadMore();
  };

  // Layout: index 0 centered, 1-2 side by side, 3-4 side by side, 5-6 side by side, 7 centered
  const spreadRows: number[][] = [
    [0],
    [1, 2],
    [3, 4],
    [5, 6],
    [7],
  ];

  return (
    <div style={{ background: isArabic ? "#000" : "#fff", minHeight: "100vh", paddingTop: 110 }}>
      {/* Header */}
      <div style={{ padding: "20px 60px 40px", direction: isArabic ? "rtl" : "ltr", borderBottom: isArabic ? "1px solid #222" : "1px solid #e0e0e0" }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "TWK Lausanne", fontSize: 11, fontWeight: 700,
            color: isArabic ? "#fff" : "#000", textDecoration: "underline", marginBottom: 16, display: "block" }}
        >
          {isArabic ? "→ العودة للمكتبة" : "← BACK TO LIBRARY"}
        </button>
        <div style={{ fontSize: 11, fontWeight: 700, textDecoration: "underline", fontFamily: "TWK Lausanne", color: isArabic ? "#fff" : "#000", marginBottom: 4 }}>
          {bookId}
        </div>
        <h1 style={{ fontFamily: "TWK Lausanne", fontSize: 48, fontWeight: 700, color: "#7B2FBE", margin: 0 }}>
          {title}
        </h1>
      </div>

      {/* Spreads layout */}
      <div style={{ padding: "48px 60px 60px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        {spreadRows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 24,
              width: "100%",
            }}
          >
            {row.map((spreadIndex) => {
              const url = book.spreads[spreadIndex];
              if (!url) return null;
              return (
                <div
                  key={spreadIndex}
                  style={{ position: "relative", cursor: "pointer", flexShrink: 0 }}
                  onMouseEnter={(e) => handleSpreadMouseEnter(e, spreadIndex)}
                  onMouseLeave={handleSpreadMouseLeave}
                  onClick={handleSpreadClick}
                >
                  <img
  src={url}
  alt={`spread ${spreadIndex + 1}`}
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    const match = target.src.match(/spread(\d+)\.jpg$/);
    if (match && !target.src.includes("/spread")) {
      target.src = `/spread${match[1]}.jpg`;
    }
  }}
  style={{ width: 420, height: 300, objectFit: "cover", display: "block" }}
/>
                  {/* Blue border on hover */}
                  {hoveredIndex === spreadIndex && (
                    <div style={{
                      position: "absolute", inset: 0,
                      border: "2px solid #2563EB",
                      pointerEvents: "none",
                    }} />
                  )}
                  {/* Blue badge on hover */}
                  {hoveredIndex === spreadIndex && (
                    <div style={{
                      position: "absolute", bottom: 10, right: 10,
                      width: 40, height: 28,
                      background: "#2563EB", borderRadius: 2,
                      pointerEvents: "none",
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Spread hover card overlay */}
      <AnimatePresence>
        {hoverCard !== null && (
          <div
            onMouseEnter={() => { if (hoverTimeout.current) clearTimeout(hoverTimeout.current); }}
            onMouseLeave={() => { hoverTimeout.current = setTimeout(() => setHoverCard(null), 150); }}
          >
            <SpreadCard
              book={book}
              spreadUrl={book.spreads[hoverCard.index]}
              spreadIndex={hoverCard.index}
              isArabic={isArabic}
              x={hoverCard.x}
              y={hoverCard.y}
              onReadMore={() => { setHoverCard(null); onReadMore(); }}
              onClose={() => setHoverCard(null)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Main Library Component ─────────────────────────────────── */
const Library: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === "AR";
  const location = useLocation();
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"list" | "spreads" | "article">("list");

  // Hover card state — no x/y needed, card is fixed to corner
  const [hoverCard, setHoverCard] = useState<{ book: any } | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    API.get("/books")
      .then((res: any) => {
        const rawData = res.data.data || res.data || [];
        const normalized = rawData
          .filter((_: any, i: number) => i !== 7)
          .map((b: any, i: number) => {
            const rawTitle = b.Book_Title || b.Title || "Untitled";
            const bookIndex = Number((b.Book_ID || "").replace(/\D/g, "")) || i + 1;
            const isFirstBook = i === 0 || rawTitle === "Diasporic Journeys";
          const bookNum = i + 1;
const spreads = Array.from({ length: 8 }, (_, idx) => `/book${bookNum}-spread${idx + 1}.jpg`);
            return {
              _id: b._id,
              book_id: (b.Book_ID || `BOOK${String(bookIndex).padStart(2, "0")}`).replace(/\s/g, ""),
              titleEn: rawTitle,
              titleAr: b.Title_In_Arabic || rawTitle,
              cover: `/book${i + 1}.png`,
              dimensions: isFirstBook ? "13.8x19.3x.9 cm" : RANDOM_DIMENSIONS[i % RANDOM_DIMENSIONS.length],
              pageCount: isFirstBook ? "306 pages" : RANDOM_PAGES[i % RANDOM_PAGES.length],
              designers: isFirstBook ? "Nancy Ashraf, Sohayla Hegazy, Fatema Elhemaly" : RANDOM_DESIGNERS[i % RANDOM_DESIGNERS.length],
              spreads,
            };
          });
        setBooks(normalized);
        if (normalized.length > 0) setSelectedBook(normalized[0]);
      })
      .finally(() => setIsLoading(false));
  }, []);
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const targetBook = params.get("book");

  if (targetBook && books.length > 0) {
    const foundBook = books.find(
  (b) =>
    b.book_id?.replace(/\s/g, "").toUpperCase() ===
    targetBook?.replace(/\s/g, "").toUpperCase()
);

    if (foundBook) {
      setSelectedBook(foundBook);
      setView("spreads");
    }
  }
}, [location.search, books]);
  



  const selectedDisplay = selectedBook
    ? {
        ...selectedBook,
        title: isArabic ? selectedBook.titleAr : selectedBook.titleEn,
        description: isArabic ? BOOK_DESCRIPTIONS_AR[selectedBook.titleEn] : BOOK_DESCRIPTIONS[selectedBook.titleEn],
        article: BOOK_ARTICLES[selectedBook.titleEn],
      }
    : null;

  const handleRowMouseEnter = (_e: React.MouseEvent, book: any) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setHoverCard({ book });
    }, 180);
  };

  const handleRowMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setHoverCard(null), 200);
  };

  if (isLoading)
    return (
      <div style={styles.loader}>
        {isArabic ? "جارٍ استرداد الأرشيف..." : "RETRIEVING ARCHIVE..."}
      </div>
    );

  return (
    <div style={{ background: isArabic ? "#000" : "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, position: "relative" }}>
        {view === "article" && selectedDisplay ? (
          <ArticleView
            selectedDisplay={selectedDisplay}
            isArabic={isArabic}
            onBack={() => setView("spreads")}
          />
        ) : view === "spreads" && selectedBook ? (
          <SpreadsPage
            book={selectedBook}
            isArabic={isArabic}
            onBack={() => setView("list")}
            onReadMore={() => setView("article")}
          />
        ) : (
          /* ── LIBRARY LIST VIEW ── */
          <div
            style={{
              marginTop: "110px",
              minHeight: "calc(100vh - 110px)",
            }}
          >
            {/* Full-width book list */}
            <div
              style={{
                ...styles.leftPanel,
                width: "100%",
                borderRight: "none",
                borderLeft: "none",
              }}
            >
              {books.map((book) => (
                <div
                  key={book._id}
                  onClick={() => { setSelectedBook(book); setView("spreads"); }}
                  onMouseEnter={(e) => { setSelectedBook(book); handleRowMouseEnter(e, book); }}
                  onMouseLeave={handleRowMouseLeave}
                  style={{
                    ...styles.bookRow,
                    borderBottom: isArabic ? "1px solid #222" : "1px solid #e0e0e0",
                    background: selectedBook?._id === book._id ? "#7B2FBE" : "transparent",
                    cursor: "pointer",
                    direction: isArabic ? "rtl" : "ltr",
                  }}
                >
                  <div style={{ ...styles.bookIdLabel, color: isArabic ? "#fff" : "#000" }}>
                    {isArabic ? BOOK_ID_LABELS_AR[book.book_id] || book.book_id : book.book_id}
                  </div>
                  <div
                    style={{
                      ...styles.bookTitle,
                      color: selectedBook?._id === book._id ? "#fff" : isArabic ? "#fff" : "#000",
                    }}
                  >
                    {isArabic ? book.titleAr : book.titleEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Hover info card — fixed to top-right corner */}
      <AnimatePresence>
        {hoverCard && view === "list" && (
          <div
            onMouseEnter={() => { if (hoverTimeout.current) clearTimeout(hoverTimeout.current); }}
            onMouseLeave={() => { hoverTimeout.current = setTimeout(() => setHoverCard(null), 150); }}
          >
            <InfoCard
              book={hoverCard.book}
              isArabic={isArabic}
              onReadMore={() => { setHoverCard(null); setView("spreads"); }}
              onClose={() => setHoverCard(null)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  loader: {
    fontFamily: "TWK Lausanne",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "12px",
  },
  leftPanel: { overflowY: "auto" },
  bookRow: { padding: "24px 40px" },
  bookIdLabel: {
    fontSize: 11,
    fontWeight: 600,
    textDecoration: "underline",
    fontFamily: "TWK Lausanne",
  },
  detailIdLabel: {
    fontSize: 11,
    fontWeight: 600,
    textDecoration: "underline",
    fontFamily: "TWK Lausanne",
  },
  bookTitle: {
    fontFamily: "TWK Lausanne",
    fontSize: "80px",
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "100px",
    textTransform: "capitalize",
  },
  rightPanel: { width: "45%", padding: "40px", overflowY: "auto" },
  detailTitle: {
    fontSize: 42,
    fontWeight: 700,
    marginBottom: 12,
    fontFamily: "TWK Lausanne",
  },
  coverImg: { width: 120, height: 160, objectFit: "cover", margin: "20px 0" },
  readMoreBtn: {
    fontFamily: "TWK Lausanne",
    background: "none",
    border: "none",
    fontWeight: 700,
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default Library;