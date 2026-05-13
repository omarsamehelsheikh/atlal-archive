import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

const FONT = `'Edition Numerical Unlicensed'`;

interface Artist {
  _id: string;
  Full_Name: string;
  Cloudinary_Image1: string;
  Birth_Year?: string;
  Current_City?: string;
  Email?: string;
  Bio_In_English?: string;
  Bio_In_Arabic?: string;
  Undergraduate_Degree?: string;
  Artistic_Practices?: string;
  Artist_Code?: string;
  Fields?: string;
}

interface Artwork {
  _id: string;
  Title: string;
  Cloudinary_Image1: string;
}

/* ── Purple corner bracket SVG overlay ── */
const CornerBrackets: React.FC<{ size?: number }> = ({ size = 18 }) => {
  const s = size;
  const stroke = "#8B5CF6";
  const sw = 2;
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 10,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* top-left */}
      <polyline
        points={`${s},0 0,0 0,${s}`}
        fill="none"
        stroke={stroke}
        strokeWidth={sw}
      />
      {/* top-right */}
      <polyline
        points={`calc(100% - ${s}),0 100%,0 100%,${s}`}
        fill="none"
        stroke={stroke}
        strokeWidth={sw}
        style={{ transform: "none" }}
      />
      {/* bottom-left */}
      <polyline
        points={`0,calc(100% - ${s}) 0,100% ${s},100%`}
        fill="none"
        stroke={stroke}
        strokeWidth={sw}
      />
      {/* bottom-right */}
      <polyline
        points={`calc(100% - ${s}),100% 100%,100% 100%,calc(100% - ${s})`}
        fill="none"
        stroke={stroke}
        strokeWidth={sw}
      />
    </svg>
  );
};

/* Use absolute pixel corners instead — SVG % in polyline points doesn't work */
const BracketOverlay: React.FC = () => {
  const c = "#8B5CF6";
  const len = 22;
  const sw = 2.5;
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 10,
        overflow: "visible",
      }}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* top-left */}
      <line
        x1={len}
        y1={0}
        x2={0}
        y2={0}
        stroke={c}
        strokeWidth={sw}
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={0}
        y1={0}
        x2={0}
        y2={len}
        stroke={c}
        strokeWidth={sw}
        vectorEffect="non-scaling-stroke"
      />
      {/* top-right */}
      <line
        x1="100%"
        y1={0}
        x2="100%"
        y2={len}
        stroke={c}
        strokeWidth={sw}
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={`calc(100% - ${len}px)`}
        y1={0}
        x2="100%"
        y2={0}
        stroke={c}
        strokeWidth={sw}
        vectorEffect="non-scaling-stroke"
      />
      {/* bottom-left */}
      <line
        x1={0}
        y1={`calc(100% - ${len}px)`}
        x2={0}
        y2="100%"
        stroke={c}
        strokeWidth={sw}
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={0}
        y1="100%"
        x2={len}
        y2="100%"
        stroke={c}
        strokeWidth={sw}
        vectorEffect="non-scaling-stroke"
      />
      {/* bottom-right */}
      <line
        x1="100%"
        y1={`calc(100% - ${len}px)`}
        x2="100%"
        y2="100%"
        stroke={c}
        strokeWidth={sw}
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={`calc(100% - ${len}px)`}
        y1="100%"
        x2="100%"
        y2="100%"
        stroke={c}
        strokeWidth={sw}
        vectorEffect="non-scaling-stroke"
      />
      {/* mid-left */}
      <line
        x1={0}
        y1="50%"
        x2={len / 2}
        y2="50%"
        stroke={c}
        strokeWidth={sw}
        vectorEffect="non-scaling-stroke"
      />
      {/* mid-right */}
      <line
        x1="100%"
        y1="50%"
        x2={`calc(100% - ${len / 2}px)`}
        y2="50%"
        stroke={c}
        strokeWidth={sw}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

/* ── Info row ── */
const InfoRow: React.FC<{ label: string; value: string; isBio?: boolean }> = ({
  label,
  value,
  isBio,
}) => (
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
        textTransform: "uppercase",
        color: "#4A4A4A",
        whiteSpace: "pre-wrap",
      }}
    >
      {value}
    </div>
  </div>
);

/* ── Main ── */
const ArtistProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const isArabic = language === "AR";
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`http://54.174.102.52:5000/api/artists/${id}`),
      axios.get(`http://54.174.102.52:5000/api/artworks?artist=${id}`),
    ])
      .then(([artistRes, artRes]) => {
        setArtist(artistRes.data.data);
        setArtworks(artRes.data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
              }}
            >
              ATLAL_AR03_{artist.Full_Name.replace(/\s+/g, "_").toUpperCase()}
              _IMAGE_1.JPG
            </span>
          </div>

          {/* ARTIST NAME HEADER */}
          <div
            style={{
              background: "#000",
              padding: "14px 20px 18px",
              borderBottom: "1px solid #777",
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: "38px",
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: "2px",
                lineHeight: 1.1,
              }}
            >
              <span style={{ color: "#8B5CF6" }}>&gt;AR20</span>
              {artist.Full_Name.toUpperCase()}
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
              <div style={valueStyle}>{artist.Current_City || "—"}</div>
            </div>
          </div>

          <InfoRow
            label={isArabic ? "المجال:" : "FIELDS:"}
            value={artist.Fields || artist.Undergraduate_Degree || "—"}
          />

          <InfoRow
            label={isArabic ? "الممارسات الفنية:" : "ARTISTIC PRACTICES:"}
            value={
              artist.Artistic_Practices ||
              "SCULPTURE, INSTALLATION ART, ARCHITECTURAL MODELLING,\nMEDIA MIXED MEDIA, SOUND"
            }
          />

          <InfoRow
            label={isArabic ? "الدرجة العلمية:" : "DEGREE:"}
            value={artist.Undergraduate_Degree || "—"}
          />

          <InfoRow
            label={isArabic ? "السيرة الذاتية:" : "BIOGRAPGHY:"}
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
                color: "#8B5CF6",
                textDecoration: "underline",
                marginTop: "6px",
                cursor: "pointer",
              }}
            >
              {artist.Email || "—"}
            </div>
          </div>
        </div>

        {/* ── RIGHT: PHOTO ── */}
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
            <BracketOverlay />
          </div>
        </div>
      </div>

      {/* ── APPEARANCES IN PUBLICATIONS ── */}
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
      color: '#8B5CF6',
      textTransform: 'uppercase',
      letterSpacing: '3px',
      textAlign: 'center',
      marginBottom: '40px',
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
      <div key={n}>
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
  fontFamily: `'Edition Numerical Unlicensed', 'Courier New', Courier, monospace`,
  fontSize: "14px",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  textDecoration: "underline",
  color: "#000",
  marginBottom: "6px",
};

const valueStyle: React.CSSProperties = {
  fontFamily: `'Edition Numerical Unlicensed', 'Courier New', Courier, monospace`,
  fontSize: "12px",
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  color: "#4A4A4A",
};

export default ArtistProfile;