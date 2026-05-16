import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api"; 
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

const FONT = `'Edition Numerical Unlicensed'`;
const ACCENT = "#8B5CF6";

interface Artist {
  _id: string;
  Full_Name: string;
  Cloudinary_Image1: string;
  Cloudinary_Images?: string[]; 
  Birth_Year?: string;
  Current_City?: string;
  Email?: string;
  Bio_In_English?: string;
  Bio_In_Arabic?: string;
  Undergraduate_Degree?: string;
  Artistic_Practices?: string;
  Artist_Code?: string;
  Fields?: string;
  Full_Name_In_Arabic?: string;
Current_City_In_Arabic?: string;
Undergraduate_Degree_In_Arabic?: string;
Artistic_Practices_In_Arabic?: string;
Fields_In_Arabic?: string;
}

interface Artwork {
  _id: string;
  Title: string;
  Cloudinary_Image1: string;
}

/* ── ADJUSTMENT 1: Custom Purple Frame with Corner/Mid Points ── */
const ArtistFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pointSize = 8;
  const pointStyle: React.CSSProperties = {
    position: 'absolute',
    width: `${pointSize}px`,
    height: `${pointSize}px`,
    background: ACCENT,
    zIndex: 10,
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        border: `2px solid ${ACCENT}`,
        padding: '12px',
        boxSizing: 'border-box',
      }}
    >
      {/* Corner Points */}
      <div style={{ ...pointStyle, top: -4, left: -4 }} />
      <div style={{ ...pointStyle, top: -4, right: -4 }} />
      <div style={{ ...pointStyle, bottom: -4, left: -4 }} />
      <div style={{ ...pointStyle, bottom: -4, right: -4 }} />

      {/* Mid-Side Points */}
      <div style={{ ...pointStyle, top: -4, left: '50%', transform: 'translateX(-50%)' }} />
      <div style={{ ...pointStyle, bottom: -4, left: '50%', transform: 'translateX(-50%)' }} />
      <div style={{ ...pointStyle, top: '50%', left: -4, transform: 'translateY(-50%)' }} />
      <div style={{ ...pointStyle, top: '50%', right: -4, transform: 'translateY(-50%)' }} />

      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

/* ── Info row with weight 300 ── */
const InfoRow: React.FC<{
  label: string;
  value: string;
  isBio?: boolean;
  isArabic?: boolean;
}> = ({ label, value, isBio, isArabic }) => (
  <div
    style={{
      borderBottom: "1px solid #777",
      padding: "14px 20px",
    }}
  >
    <div
      style={{
        fontFamily: FONT,
        fontSize: "14px",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        textDecoration: "underline",
        color: "#000",
        marginBottom: "8px",
        fontWeight: 300, 
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: FONT,
        fontSize: "12px",
        letterSpacing: "1.2px",
        lineHeight: isBio ? "20px" : "18px",
        textTransform: isArabic ? "none" : "uppercase",
        color: "#4A4A4A",
        whiteSpace: "pre-wrap",
      }}
    >
      {value}
    </div>
  </div>
);

/* ── Main Artist Profile Component ── */
const ArtistProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isArabic = language === "AR";
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/artists/${id}`)
      .then((res: any) => {
        setArtist(res.data.data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading || !artist) {
    return (
      <div style={{ padding: "200px", textAlign: "center", fontFamily: FONT }}>
        LOADING...
      </div>
    );
  }

  const bio = isArabic
    ? artist.Bio_In_Arabic || artist.Bio_In_English || "—"
    : artist.Bio_In_English || "—";

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#ECECEC",
        overflowX: "hidden",
        fontFamily: FONT,
        direction: isArabic ? "rtl" : "ltr",
      }}
    >
      <Navbar />

      {/* ── MAIN TWO-COLUMN LAYOUT ── */}
      <div
        style={{
          marginTop: "82px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderTop: "1px solid #777",
          minHeight: "calc(100vh - 82px)",
        }}
      >
        {/* ── LEFT: INFO ── */}
        <div style={{ borderRight: "1px solid #777" }}>
          {/* FILE NAME BAR */}
          <div
            style={{
              background: "#000",
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              borderBottom: "1px solid #555",
            }}
          >
            <span style={{ color: "#fff", fontSize: "16px", lineHeight: 1 }}>
              ✕
            </span>
            <span
              style={{
                fontFamily: FONT,
                fontSize: "11px",
                letterSpacing: "1.5px",
                color: "#fff",
                textTransform: "uppercase",
                opacity: 0.85,
                fontWeight: 300,
              }}
            >
              ATLAL_AR03_{
  (isArabic
    ? artist.Full_Name_In_Arabic || artist.Full_Name
    : artist.Full_Name
  )
    .replace(/\s+/g, "_")
    .toUpperCase()
}
              _IMAGE_1.JPG
            </span>
          </div>

          {/* ADJUSTMENT 2: Header Left Aligned - RAW TEXT (No Black Box) */}
          <div
            style={{
              padding: "30px 20px",
              borderBottom: "1px solid #777",
              textAlign: "left", 
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: "42px",
                color: "#000",
                textTransform: "uppercase",
                letterSpacing: "2px",
                lineHeight: 1.1,
                fontWeight: 400,
              }}
            >
              <span style={{ color: ACCENT }}>&gt;AR20</span>
              {" "}
{isArabic
  ? artist.Full_Name_In_Arabic || artist.Full_Name
  : artist.Full_Name.toUpperCase()}
            </div>
          </div>

          {/* YEAR OF BIRTH + BASED IN */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              borderBottom: "1px solid #777",
            }}
          >
            <div
              style={{ padding: "14px 20px", borderRight: "1px solid #777" }}
            >
              <div style={labelStyle}>
                {isArabic ? "سنة الميلاد:" : "YEAR OF BIRTH:"}
              </div>
              <div style={valueStyle}>{artist.Birth_Year || "—"}</div>
            </div>
            <div style={{ padding: "14px 20px" }}>
              <div style={labelStyle}>
                {isArabic ? "الإقامة:" : "BASED IN:"}
              </div>
              <div style={valueStyle}>
  {isArabic
    ? artist.Current_City_In_Arabic ||
      artist.Current_City ||
      "—"
    : artist.Current_City || "—"}
</div>
            </div>
          </div>

          <InfoRow
          isArabic={isArabic}
            label={isArabic ? "المجال:" : "FIELDS:"}
            value={
  isArabic
    ? artist.Fields_In_Arabic || artist.Fields || "—"
    : artist.Fields || "—"
}
          />

          <InfoRow
          isArabic={isArabic}
            label={isArabic ? "الممارسات الفنية:" : "ARTISTIC PRACTICES:"}
            value={
  isArabic
    ? artist.Artistic_Practices_In_Arabic ||
      artist.Artistic_Practices ||
      "—"
    : artist.Artistic_Practices || "—"
}
          />

          <InfoRow
          isArabic={isArabic}
            label={isArabic ? "الدرجة العلمية:" : "DEGREE:"}
           value={
  isArabic
    ? artist.Undergraduate_Degree_In_Arabic ||
      artist.Undergraduate_Degree ||
      "—"
    : artist.Undergraduate_Degree || "—"
}
          />

          <InfoRow
          isArabic={isArabic}
            label={isArabic ? "السيرة الذاتية:" : "BIOGRAPHY:"}
            value={bio}
            isBio
          />

          {/* CONTACT INFO */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #777" }}>
            <div style={labelStyle}>
              {isArabic ? "البريد الإلكتروني:" : "CONTACT INFO:"}
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: "12px",
                letterSpacing: "1.2px",
                color: ACCENT,
                textDecoration: "underline",
                marginTop: "6px",
                cursor: "pointer",
              }}
            >
              {artist.Email || "—"}
            </div>
          </div>
        </div>

        {/* ── RIGHT: PHOTO WITH PURPLE FRAME ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 50px",
            background: "#ECECEC",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "500px",
              aspectRatio: "4/5",
            }}
          >
            <ArtistFrame>
              <img
                src={artist.Cloudinary_Image1}
                alt={artist.Full_Name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  border: "1px solid #aaa",
                }}
              />
            </ArtistFrame>
          </div>
        </div>
      </div>

      {/* ── APPEARANCES IN PUBLICATIONS ── */}
      <div
        style={{
          borderTop: '1px solid #777',
          padding: '50px 60px',
          background: '#ECECEC',
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: '36px',
            color: ACCENT,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            textAlign: 'center',
            marginBottom: '40px',
            fontWeight: 300,
          }}
        >
          {isArabic ? 'الظهور في المنشورات' : 'APPEARANCES IN PUBLICATIONS'}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
  key={n}
  onClick={() => navigate(`/library?book=BOOK0${n}`)}
  style={{
    cursor: "pointer",
    transition: "transform 0.25s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-6px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0px)";
  }}
>
              <img
                src={`/book${n}.png`}
                alt=""
                style={{
                  width: '90px',
                  height: '130px',
                  objectFit: 'cover',
                  border: '1px solid #999',
                  display: 'block',
                  pointerEvents: 'none',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: "14px",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  textDecoration: "underline",
  color: "#000",
  marginBottom: "6px",
  fontWeight: 300,
};

const valueStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: "12px",
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  color: "#4A4A4A",
};

export default ArtistProfile;