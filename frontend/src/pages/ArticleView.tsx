import React from "react";
import { BOOK_ID_LABELS_AR } from "./libraryData";

interface ArticleViewProps {
  selectedDisplay: {
    titleEn: string;
    title: string;
    book_id: string;
    cover: string;
    article?: {
      titleEn: string;
      titleAr: string;
      authorEn: string;
      authorAr: string;
      bodyEn: string;
      bodyAr: string;
    };
  };
  isArabic: boolean;
  onBack: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({
  selectedDisplay,
  isArabic,
  onBack,
}) => {
  const article = selectedDisplay.article;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: isArabic ? "#000" : "#fff",
        color: isArabic ? "#fff" : "#111",
        direction: isArabic ? "rtl" : "ltr",
        paddingTop: "40px",
        paddingBottom: "80px",
      }}
    >
      {/* Back Button Action Header Bar */}
      <div style={{ width: "100%", paddingInline: "40px", marginBottom: "20px" }}>
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: "none",
            color: isArabic ? "#fff" : "#111",
            fontSize: "14px",
            letterSpacing: "2px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {isArabic ? "العودة للمكتبة →" : "← BACK TO LIBRARY"}
        </button>
      </div>

      {/* ─── COMPOSITE BANNER (No Image, No Background) ─── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          padding: "80px 40px 60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          marginBottom: "60px",
          boxSizing: "border-box",
        }}
      >
        {/* CENTER ELEMENT: Purple Title & Author */}
        <div
          style={{
            zIndex: 10,
            width: "100%",
            marginBottom: "60px",
          }}
        >
          <h1
            style={{
              color: "#8A38F5",
              fontFamily: "TWK Lausanne",
              fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: 800,
              lineHeight: 1.05,
              textTransform: "uppercase",
              margin: 0,
              letterSpacing: "-1px",
            }}
          >
            {isArabic ? article?.titleAr : article?.titleEn}
          </h1>
          <p
            style={{
              marginTop: "20px",
              fontFamily: "TWK Lausanne",
              color: "#8A38F5",
              fontSize: "14px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {isArabic ? article?.authorAr : article?.authorEn}
          </p>
        </div>

        {/* BOTTOM LEFT CORNER ELEMENT: Book ID and Name in Purple */}
        <div
          style={{
            width: "100%",
            textAlign: isArabic ? "right" : "left",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "3px",
              color: "#8A38F5",
              fontWeight: 700,
              marginBottom: "4px",
              fontFamily: "TWK Lausanne",
            }}
          >
            {isArabic ? BOOK_ID_LABELS_AR[selectedDisplay.book_id] || selectedDisplay.book_id : selectedDisplay.book_id}
          </div>
          <div
            style={{
              fontSize: "20px",
              fontFamily: "TWK Lausanne",
              fontWeight: 400,
              color: "#8A38F5",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {selectedDisplay.title}
          </div>
        </div>
      </div>

      {/* ─── TEXT BLOCK ACROSS THE FULL PAGE WIDTH ─── */}
      <div
        style={{
          width: "100%",
          paddingInline: "40px",
          fontSize: "16px",
          lineHeight: 1.95,
          color: isArabic ? "#eee" : "#222",
          textAlign: isArabic ? "right" : "left",
        }}
      >
        {((isArabic ? article?.bodyAr : article?.bodyEn) || "")
          .split("\n\n")
          .filter(Boolean)
          .map((para, i) => (
            <p
              key={i}
              style={{
                fontFamily: "TWK Lausanne",
                marginBottom: "28px",
                whiteSpace: "pre-line",
                fontWeight: 400,
              }}
            >
              {para.trim()}
            </p>
          ))}
      </div>
    </div>
  );
};

export default ArticleView;