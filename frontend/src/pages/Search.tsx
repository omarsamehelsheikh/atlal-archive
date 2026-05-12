import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";

interface Artwork {
  _id: string;
  Artwork_ID?: string;
  Artist_ID?: string;
  Artist_Name?: string;
  Title_In_English?: string;
  Title_In_Arabic?: string;
  Internal_Place_Holder_Title?: string;
  Series_ID?: string;
  Year_Created?: string;
  Year_Finished?: string;
  Medium?: string;
  Artwork_Dimensions?: string;
  Duration?: string;
  Artwork_Description_In_English?: string;
  Artwork_Description_In_Arabic?: string;
  Film_Image_Description_In_English?: string;
  Film_Image_Description_In_Arabic?: string;
  Film_Image_Resolution?: string;
  Film_Image_URL?: string;
  Film_Image_Source?: string;
  Cloudinary_Image_URL?: string;
  Section_ID?: string;
  Section_Title?: string;
  Book_ID?: string;
  Themes?: string[];
  Tags?: string[];
  Birth_Country?: string;
  Current_Country?: string;
}

interface Artist {
  _id: string;
  Artist_ID: string;
  Full_Name: string;
  Full_Name_In_Arabic?: string;
  Birth_Year?: string;
  Nationality?: string;
  Current_City?: string;
  Current_City_In_Arabic?: string;
  Fields?: string;
  Fields_In_Arabic?: string;
  Artistic_Practices?: string;
  Artistic_Practices_In_Arabic?: string;
  Undergraduate_Degree?: string;
  Undergraduate_Degree_In_Arabic?: string;
  Postgraduate_Degree?: string;
  Bio_In_English?: string;
  Bio_In_Arabic?: string;
  Cloudinary_Image1?: string;
  Cloudinary_Image2?: string;
  Cloudinary_Image3?: string;
  Email?: string;
  Website?: string;
  Instagram?: string;
  Diasporic_Vector?: string;
}

interface Book {
  _id: string;
  Book_ID?: string;
  Book_Title?: string;
  Title?: string;
  Title_In_Arabic?: string;
  Cloudinary_Image1?: string;
}

const SUGGESTED_TAGS = [
  "MONOCHROME",
  "BLACK AND WHITE",
  "ARCHITECTURE",
  "DARK TONES",
  "PEOPLE",
  "CITY",
  "DESERT",
  "OBJECTS",
  "RUINS",
  "NATURE",
  "VIBRANT",
];

const THEMES = [
  "Identity",
  "Migration",
  "Memory",
  "Conflict",
  "Architecture",
  "Landscape",
  "Diaspora",
  "Politics",
  "Nature",
  "Urbanism",
];

const MEDIUMS = [
  "Photography",
  "Video",
  "Film",
  "Installation",
  "Painting",
  "Mixed Media",
  "Digital Art",
  "Sculpture",
];

const COLORS = [
  "Monochrome",
  "Black and White",
  "Dark Tones",
  "Warm",
  "Cold",
  "Vibrant",
  "Neutral",
];

const COUNTRIES = [
  "Egypt",
  "Palestine",
  "Lebanon",
  "Syria",
  "Iraq",
  "Tunisia",
  "Saudi Arabia",
  "Morocco",
];

const YEARS = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];



const ARABIC_FILTER_LABELS: Record<string, string> = {
  "THEME:": "الموضوع:",
  "MEDIUM:": "الوسيط:",
  "TAGS:": "الوسوم:",
  "YEAR:": "السنة:", 
};

const ARABIC_THEMES: Record<string, string> = {
  Identity: "الهوية",
  Migration: "الهجرة",
  Memory: "الذاكرة",
  Conflict: "الصراع",
  Architecture: "العمارة",
  Landscape: "المناظر الطبيعية",
  Diaspora: "الشتات",
  Politics: "السياسة",
  Nature: "الطبيعة",
  Urbanism: "العمران",
};

const ARABIC_MEDIUMS: Record<string, string> = {
  Photography: "التصوير",
  Video: "فيديو",
  Film: "فيلم",
  Installation: "تركيب",
  Painting: "رسم",
  "Mixed Media": "وسائط متعددة",
  "Digital Art": "فن رقمي",
  Sculpture: "نحت",
};

const ARABIC_TAGS: Record<string, string> = {
  MONOCHROME: "أحادي اللون",
  "BLACK AND WHITE": "أبيض وأسود",
  ARCHITECTURE: "عمارة",
  "DARK TONES": "ألوان داكنة",
  PEOPLE: "أشخاص",
  CITY: "مدينة",
  DESERT: "صحراء",
  OBJECTS: "عناصر",
  RUINS: "أطلال",
  NATURE: "طبيعة",
  VIBRANT: "ألوان حية",
};

const FILTER_SECTIONS = [
  "SELECTED FILTERS:",
  "THEME:",
  "MEDIUM:",
  "TAGS:",
  "YEAR:",
];

const arabicArtistNames: Record<string, string> = {
  "Ali Al-Shehabi": "علي الشهابي",
  "Abdullah Miniawy": "عبدالله المنياوي",
  "Ahmed Umar": "أحمد عمر",
  "Basma Al-Sharif": "بسمة الشريف",
  "Emii Alari": "إيمي العري",
  "Fatma Charfi-M'Seddi": "فاطمة الشرفي المصدي",
  "Farah Al Qasimi": "فرح القاسمي",
  "Faisal Samra": "فيصل سمرة",
  "Hassan Hajjaj": "حسن حجاج",
  "Helen Zughaib": "هيلين زغيب",
  "Hicham Berrada": "هشام برادة",
  "Ishtar Yassin": "عشتار ياسين",
  "Ibrahim ahmed": "إبراهيم أحمد",
  "Jalal Toufic": "جلال توفيق",
  "Jayce Salloum": "جايس سلوم",
  "Jumana Manna": "جمانة مناع",
  "Joyce Joumaa": "جويس جومعة",
  "Khaled Barakeh": "خالد بركة",
  "Larissa Sansour": "لاريسا صنصور",
  "Mona Hatoum": "منى حاطوم",
  "Marwan Arsanios": "مروان أرسانيوس",
  "Michael(a) Dawood": "مايكل داوود",
  "Mohamad Hafez": "محمد حافظ",
  "Monira Al Qadiri": "منيرة القادري",
  "Manal Al Dowayan": "منال الضويان",
  "Nadia Ayari": "نادية العياري",
  "Nada Harib": "ندى حارب",
  "Najla said": "نجلاء سعيد",
  "Osama Esid": "أسامة السيد",
  "PhotoHussein (Hussein Nassereddine)": "فوتو حسين (حسين ناصر الدين)",
  "Rita Kabalan": "ريتا كبالان",
  "Rachid Koraïchi": "رشيد قريشي",
  "Salah Elmur": "صلاح المر",
  "Saba Innab": "صبا عناب",
  "Stéphanie Saade": "ستيفاني سعادة",
  "Samia Halaby": "سمية حلبي",
  "Sakir Khader": "ساكر خضر",
  "Sama Alshaibi": "سما الشيبي",
  "Susan Hefuna": "سوزان حفونة",
  "Sophia Al Maria": "صوفيا الماريا",
  "Samer Mohdad": "سامر مهداوي",
  "Sara Kontar": "سارة قنطار",
  "Tarek Al Ghoussein": "طارق الغصين",
  "Tewa Barnosa": "تيوا بارنوسا",
  "Taysir Batniji": "تيسير بطنيجي",
  "Walid Raad": "وليد رعد",
  "Wafaa Bilal": "وفاء بلال",
  "Youssef Nabil": "يوسف نبيل",
  "Yto Barrada": "إيتو برادة",
  "Zineb Sedira": "زينب سديرة",
};

// ── Artwork Detail Page ──────────────────────────────────────────────────────
const ArtworkDetail: React.FC<{
  artwork: Artwork;
  allArtworks: Artwork[];
  artists: Artist[];
  setSelectedArtist: (artist: Artist) => void;
  setSelectedArtwork: (artwork: Artwork | null) => void;
  onBack: () => void;
  isArabic: boolean;
}> = ({
  artwork,
  allArtworks,
  artists,
  setSelectedArtist,
  setSelectedArtwork,
  onBack,
  isArabic,
}) => {
  const [activeImg, setActiveImg] = useState(0);
  const navigate = useNavigate();

  const routerLocation = useLocation();

  // Collect all images for this artwork (just Cloudinary for now, extendable)
  const images = [artwork.Cloudinary_Image_URL, artwork.Film_Image_URL].filter(
    Boolean,
  ) as string[];

  if (images.length === 0) images.push("/placeholder.png");

  // Related: same artist or same section
  const related = allArtworks
    .filter(
      (a) =>
        a._id !== artwork._id &&
        (a.Artist_Name === artwork.Artist_Name ||
          a.Section_ID === artwork.Section_ID),
    )
    .slice(0, 4);

  const themes = Array.isArray(artwork.Themes)
    ? artwork.Themes
    : typeof artwork.Themes === "string"
      ? (artwork.Themes as string).split(",").map((t) => t.trim())
      : [];

  const tags = Array.isArray(artwork.Tags)
    ? artwork.Tags
    : typeof artwork.Tags === "string"
      ? (artwork.Tags as string).split(",").map((t) => t.trim())
      : [];

  const CornerDots = ({ color = "#7B3FF2" }: { color?: string }) => (
    <>
      {[
        { top: -4, left: -4 },
        { top: -4, right: -4 },
        { bottom: -4, left: -4 },
        { bottom: -4, right: -4 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "8px",
            height: "8px",
            background: color,
            zIndex: 5,
            ...pos,
          }}
        />
      ))}
    </>
  );

  const rowStyle: React.CSSProperties = {
    borderBottom: "1px solid #222",
    padding: "10px 0",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    textDecoration: "underline",
    letterSpacing: "0.08em",
    marginBottom: 4,
    fontFamily: "monospace",
  };
  const valueStyle: React.CSSProperties = {
    fontSize: 11,
    fontFamily: "monospace",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    lineHeight: 1.6,
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "#fff",
        color: "#111",
        direction: isArabic ? "rtl" : "ltr",
      }}
    >
      <Navbar />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "535px 1fr",
          minHeight: "calc(100vh - 70px)",
          marginTop: 70,
          borderTop: "1px solid #222",
        }}
      >
        {/* ── LEFT PANEL ── */}
        <div
          style={{
            borderRight: "1px solid #222",
            padding: "0",
            overflowY: "auto",
          }}
        >
          {/* Title block */}
          <div
            style={{
              background: "#000",
              color: "#fff",
              padding: "18px 20px",
              borderBottom: "1px solid #222",
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                fontFamily: "monospace",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                lineHeight: 1.1,
              }}
            >
              {isArabic
                ? artwork.Title_In_Arabic || artwork.Title_In_English
                : artwork.Title_In_English}
            </div>
          </div>

          {/* Artist + ID row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "10px 20px",
              borderBottom: "1px solid #222",
              fontFamily: "monospace",
              fontSize: 12,
            }}
          >
            <span
              style={{
                color: "#7B3FF2",
                textDecoration: "underline",
                letterSpacing: "0.08em",
                cursor: "pointer",
              }}
            >
              {artwork.Artwork_ID ? `>AR${artwork.Artwork_ID}` : ">AR"}
            </span>
            <span
              onClick={() => {
                const foundArtist = artists.find(
                  (artist) => artist.Full_Name === artwork.Artist_Name,
                );

                if (foundArtist) {
                  setSelectedArtist(foundArtist);

                  setSelectedArtwork(null);
                }
              }}
              style={{
                textDecoration: "underline",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                color: "#7B3FF2",
              }}
            >
              {isArabic
                ? arabicArtistNames[(artwork.Artist_Name || "").trim()] ||
                  artwork.Artist_Name
                : artwork.Artist_Name}
            </span>
          </div>

          {/* Year + Location */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              borderBottom: "1px solid #222",
            }}
          >
            <div
              style={{ padding: "10px 20px", borderRight: "1px solid #222" }}
            >
              <div style={labelStyle}>{isArabic ? "السنة:" : "YEAR:"}</div>
              <div style={valueStyle}>{artwork.Year_Created || "—"}</div>
            </div>
            <div style={{ padding: "10px 20px" }}>
              <div style={labelStyle}>{isArabic ? "الموقع:" : "LOCATION:"}</div>
              <div style={valueStyle}>
                {artwork.Birth_Country || artwork.Current_Country || "—"}
              </div>
            </div>
          </div>

          {/* Type / Medium */}
          <div style={{ padding: "10px 20px", borderBottom: "1px solid #222" }}>
            <div style={labelStyle}>{isArabic ? "النوع:" : "TYPE:"}</div>
            <div style={valueStyle}>{artwork.Medium || "—"}</div>
          </div>

          {/* Themes */}
          {themes.length > 0 && (
            <div
              style={{ padding: "10px 20px", borderBottom: "1px solid #222" }}
            >
              <div style={labelStyle}>{isArabic ? "المواضيع:" : "THEMES:"}</div>
              <div style={valueStyle}>{themes.join(", ")}</div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div
              style={{ padding: "10px 20px", borderBottom: "1px solid #222" }}
            >
              <div style={labelStyle}>{isArabic ? "الوسوم:" : "TAGS:"}</div>
              <div style={valueStyle}>{tags.join(", ")}</div>
            </div>
          )}

          {/* Description */}
          <div style={{ padding: "10px 20px", borderBottom: "1px solid #222" }}>
            <div style={labelStyle}>{isArabic ? "الوصف:" : "DESCRIPTION:"}</div>
            <div
              style={{
                ...valueStyle,
                textTransform: "none",
                lineHeight: 1.8,
                fontSize: 11,
              }}
            >
              {isArabic
                ? artwork.Artwork_Description_In_Arabic ||
                  artwork.Artwork_Description_In_English
                : artwork.Artwork_Description_In_English || "—"}
            </div>
          </div>

          {/* Dimensions */}
          {artwork.Artwork_Dimensions && (
            <div
              style={{ padding: "10px 20px", borderBottom: "1px solid #222" }}
            >
              <div style={labelStyle}>
                {isArabic ? "الأبعاد:" : "DIMENSIONS:"}
              </div>
              <div style={valueStyle}>{artwork.Artwork_Dimensions}</div>
            </div>
          )}

          {/* Collection / Series */}
          {(artwork.Series_ID || artwork.Section_Title) && (
            <div
              style={{ padding: "10px 20px", borderBottom: "1px solid #222" }}
            >
              <div style={labelStyle}>
                {isArabic ? "المجموعة:" : "COLLECTION:"}
              </div>
              <div style={valueStyle}>
                {artwork.Section_Title || artwork.Series_ID}
              </div>
            </div>
          )}

          {/* Related Items */}
          {related.length > 0 && (
            <div style={{ padding: "20px" }}>
              <div
                style={{
                  fontSize: 28,
                  color: "#7B3FF2",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  marginBottom: 16,
                  letterSpacing: "0.04em",
                }}
              >
                {isArabic ? "عناصر ذات صلة" : "RELATED ITEMS"}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 12,
                }}
              >
                {related.map((rel) => (
                  <div
                    key={rel._id}
                    style={{
                      border: "1px solid #ddd",
                      padding: 12,
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <CornerDots />
                    <div
                      style={{
                        aspectRatio: "4/3",
                        overflow: "hidden",
                        background: "#eee",
                        marginBottom: 10,
                      }}
                    >
                      <img
                        src={rel.Cloudinary_Image_URL}
                        alt={rel.Title_In_English}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: 11,
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{ fontWeight: 600, textTransform: "uppercase" }}
                      >
                        {isArabic
                          ? rel.Title_In_Arabic || rel.Title_In_English
                          : rel.Title_In_English}
                      </div>
                      {rel.Year_Created && (
                        <div style={{ opacity: 0.6 }}>{rel.Year_Created}</div>
                      )}
                      {rel.Artist_Name && (
                        <div
                          style={{ opacity: 0.6, textTransform: "uppercase" }}
                        >
                          {isArabic
                            ? arabicArtistNames[rel.Artist_Name.trim()] ||
                              rel.Artist_Name
                            : rel.Artist_Name}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              borderTop: "1px solid #222",
              padding: "24px 20px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              fontFamily: "monospace",
              opacity: 0.5,
              letterSpacing: "0.06em",
            }}
          ></div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "32px",
            gap: 16,
          }}
        >
          {/* Main image */}
          <div style={{ position: "relative", flex: 1 }}>
            <CornerDots />
            <div
              style={{
                width: "100%",
                height: "520px",
                overflow: "hidden",
                border: "1px solid #222",
              }}
            >
              <img
                src={images[activeImg]}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                  background: "#f5f5f5",
                }}
              />
            </div>

            {/* Counter + nav */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 12,
                fontFamily: "monospace",
                fontSize: 12,
              }}
            >
              <span style={{ opacity: 0.5 }}>
                {activeImg + 1}/{images.length}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setActiveImg((p) => Math.max(0, p - 1))}
                  disabled={activeImg === 0}
                  style={{
                    width: 32,
                    height: 32,
                    background: activeImg === 0 ? "#eee" : "#111",
                    color: activeImg === 0 ? "#999" : "#fff",
                    border: "none",
                    cursor: activeImg === 0 ? "default" : "pointer",
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setActiveImg((p) => Math.min(images.length - 1, p + 1))
                  }
                  disabled={activeImg === images.length - 1}
                  style={{
                    width: 32,
                    height: 32,
                    background:
                      activeImg === images.length - 1 ? "#eee" : "#111",
                    color: activeImg === images.length - 1 ? "#999" : "#fff",
                    border: "none",
                    cursor:
                      activeImg === images.length - 1 ? "default" : "pointer",
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: 8,
                overflowX: "auto",
                paddingBottom: 4,
              }}
            >
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    width: 90,
                    height: 65,
                    flexShrink: 0,
                    cursor: "pointer",
                    border:
                      i === activeImg ? "2px solid #7B3FF2" : "1px solid #ddd",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Search Component ────────────────────────────────────────────────────
const Search: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === "AR";

  const bgColor = isArabic ? "#000000" : "#ECECEC";
  const textColor = isArabic ? "#F5F5F5" : "#111111";
  const borderColor = isArabic ? "#2A2A2A" : "#8f8f8f";
  const accentColor = isArabic ? "#A970FF" : "#7B3FF2";
  const cardBg = isArabic ? "#111111" : "#f7f7f7";
  const cardBorder = isArabic ? "#333333" : "#8f8f8f";
  const filterBg = isArabic ? "#111111" : "#f3f2ef";
  const filterBorder = isArabic ? "#333333" : "#7c7c7c";
  const suggestedColor = isArabic ? "#888888" : "#666666";

  const [query, setQuery] = useState("");
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(
    (useLocation as any).state?.selectedArtist || null,
  );
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"alphabetical" | "chronological">(
    "alphabetical",
  );

  const hasValidImage = (url?: string) =>
    url &&
    typeof url === "string" &&
    url.trim() !== "" &&
    url !== "null" &&
    url !== "undefined";

  const getArtistImage = (artist: any) => {
    if (hasValidImage(artist.Cloudinary_Image1))
      return artist.Cloudinary_Image1;
    if (hasValidImage(artist.Cloudinary_Image2))
      return artist.Cloudinary_Image2;
    if (hasValidImage(artist.Cloudinary_Image3))
      return artist.Cloudinary_Image3;
    return "";
  };

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    setSelectedArtist(null);
    setSelectedArtwork(null);
    const q = searchQuery.toLowerCase().trim();

    try {
      const [artworkRes, artistRes, bookRes] = await Promise.all([
        axios
          .get("http://54.174.102.52:5000/api/artworks")
          .catch(() => ({ data: { data: [] } })),
        axios
          .get("http://54.174.102.52:5000/api/artists")
          .catch(() => ({ data: { data: [] } })),
        axios
          .get("http://54.174.102.52:5000/api/books")
          .catch(() => ({ data: { data: [] } })),
      ]);

      const allArtists = artistRes.data.data || artistRes.data || [];
      const filteredArtists = allArtists.filter((artist: any) =>
        Object.values(artist).some(
          (val) => typeof val === "string" && val.toLowerCase().includes(q),
        ),
      );

      const allArtworks = artworkRes.data.data || artworkRes.data || [];
      let filteredArtworks = allArtworks.filter((art: any) =>
        Object.values(art).some(
          (val) => typeof val === "string" && val.toLowerCase().includes(q),
        ),
      );
      if (sortBy === "alphabetical") {
        filteredArtworks.sort((a: Artwork, b: Artwork) =>
          (a.Title_In_English || "").localeCompare(b.Title_In_English || ""),
        );
      } else {
        filteredArtworks.sort(
          (a: Artwork, b: Artwork) =>
            Number(a.Year_Created || 0) - Number(b.Year_Created || 0),
        );
      }

      const allBooks = bookRes.data.data || bookRes.data || [];
      const filteredBooks = allBooks.filter((book: any) =>
        Object.values(book).some(
          (val) => typeof val === "string" && val.toLowerCase().includes(q),
        ),
      );

      setArtists(filteredArtists);
      setArtworks(filteredArtworks);
      setBooks(filteredBooks);
    } catch (err) {
      console.error("Search error", err);
      setArtists([]);
      setArtworks([]);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    handleSearch(tag);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch(query);
  };
  const totalResults = artworks.length + artists.length + books.length;

  const CornerDots = () => (
    <>
      {[
        { top: -4, left: -4 },
        { top: -4, right: -4 },
        { bottom: -4, left: -4 },
        { bottom: -4, right: -4 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "8px",
            height: "8px",
            background: accentColor,
            zIndex: 5,
            ...pos,
          }}
        />
      ))}
    </>
  );

  // ── Artwork detail view ──
  if (selectedArtwork) {
    return (
      <ArtworkDetail
        artwork={selectedArtwork}
        allArtworks={artworks}
        artists={artists}
        setSelectedArtist={setSelectedArtist}
        setSelectedArtwork={setSelectedArtwork}
        onBack={() => setSelectedArtwork(null)}
        isArabic={isArabic}
      />
    );
  }

  // ── Artist detail view ──
  if (selectedArtist) {
    return (
      <div
        style={{
          background: bgColor,
          color: textColor,
          minHeight: "100vh",
          direction: isArabic ? "rtl" : "ltr",
        }}
      >
        <div
          style={{
            paddingInline: 40,
            paddingTop: 20,
            paddingBottom: 20,
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <Navbar />
        </div>
        <button
          onClick={() => setSelectedArtist(null)}
          style={{
            position: "fixed",
            top: 115,
            left: isArabic ? "auto" : 22,
            right: isArabic ? 22 : "auto",
            border: "none",
            background: isArabic ? "rgba(0,0,0,0.75)" : "transparent",
            color: isArabic ? "#FFFFFF" : "#000000",
            fontSize: isArabic ? 36 : 52,
            lineHeight: 1,
            width: isArabic ? 52 : "auto",
            height: isArabic ? 52 : "auto",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 999999,
            backdropFilter: isArabic ? "blur(6px)" : "none",
          }}
        >
          {isArabic ? "›" : "‹"}
        </button>

        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderTop: `1px solid ${borderColor}`,
            marginTop: 35,
          }}
        >
          <div
            style={{
              borderRight: !isArabic ? `1px solid ${borderColor}` : "none",
              borderLeft: isArabic ? `1px solid ${borderColor}` : "none",
              padding: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ border: `1px solid ${borderColor}`, padding: 16 }}>
              <img
                src={getArtistImage(selectedArtist)}
                alt=""
                style={{
                  width: 430,
                  height: 560,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </div>
          <div>
            <div
              style={{
                height: 28,
                borderBottom: `1px solid ${borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingInline: 12,
                color: accentColor,
                fontSize: 11,
                fontFamily: "TWK Lausanne",
              }}
            >
              <span>
                JPG.\
                {(isArabic
                  ? arabicArtistNames[selectedArtist.Full_Name?.trim()] ||
                    selectedArtist.Full_Name
                  : selectedArtist.Full_Name
                )
                  ?.replace(/\s/g, "_")
                  .toUpperCase()}
                _IMAGE.AR
              </span>
              <span>{isArabic ? "أطلال" : ""}</span>
            </div>
            <div
              style={{
                borderBottom: `1px solid ${borderColor}`,
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 24,
                background: isArabic ? "#000" : "#fff",
                color: isArabic ? "#fff" : "#000",
              }}
            >
              <div
                style={{
                  fontSize: 34,
                  fontFamily: "OT Neue Montreal",
                  textTransform: isArabic ? "none" : "uppercase",
                }}
              >
                {isArabic
                  ? arabicArtistNames[selectedArtist.Full_Name?.trim()] ||
                    selectedArtist.Full_Name
                  : selectedArtist.Full_Name}
              </div>
            </div>
            {[
              [
                isArabic ? "سنة الميلاد:" : "YEAR OF BIRTH:",
                selectedArtist.Birth_Year,
              ],
              [
                isArabic ? "مكان الإقامة:" : "BASED IN:",
                isArabic
                  ? selectedArtist.Current_City_In_Arabic ||
                    selectedArtist.Current_City
                  : selectedArtist.Current_City,
              ],
              [
                isArabic ? "المجالات:" : "FIELDS:",
                isArabic
                  ? selectedArtist.Fields_In_Arabic || selectedArtist.Fields
                  : selectedArtist.Fields,
              ],
              [
                isArabic ? "الممارسات الفنية:" : "ARTISTIC PRACTICES:",
                isArabic
                  ? selectedArtist.Artistic_Practices_In_Arabic ||
                    selectedArtist.Artistic_Practices
                  : selectedArtist.Artistic_Practices,
              ],
              [
                isArabic ? "الشهادة:" : "DEGREE:",
                isArabic
                  ? selectedArtist.Undergraduate_Degree_In_Arabic ||
                    selectedArtist.Undergraduate_Degree
                  : selectedArtist.Undergraduate_Degree,
              ],
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  borderBottom: `1px solid ${borderColor}`,
                  padding: "16px 18px",
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    marginBottom: 10,
                    fontFamily: "OT Neue Montreal",
                  }}
                >
                  {item[0]}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    lineHeight: 2,
                    opacity: 0.85,
                    fontFamily: "TWK Lausanne",
                  }}
                >
                  {item[1] || "—"}
                </div>
              </div>
            ))}
            <div
              style={{
                borderBottom: `1px solid ${borderColor}`,
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  marginBottom: 12,
                  fontFamily: "OT Neue Montreal",
                }}
              >
                {isArabic ? "سيرة ذاتية" : "BIOGRAPHY:"}
              </div>
              <div
                style={{
                  fontSize: 12,
                  lineHeight: 2,
                  opacity: 0.85,
                  fontFamily: "TWK Lausanne",
                }}
              >
                {isArabic
                  ? selectedArtist.Bio_In_Arabic ||
                    selectedArtist.Bio_In_English
                  : selectedArtist.Bio_In_English}
              </div>
            </div>
            <div style={{ padding: "16px 18px" }}>
              <div
                style={{
                  fontSize: 16,
                  marginBottom: 12,
                  fontFamily: "OT Neue Montreal",
                }}
              >
                {isArabic ? "تواصل" : "CONTACT INFO:"}
              </div>
              <a
                href={`mailto:${selectedArtist.Email}`}
                style={{
                  color: accentColor,
                  textDecoration: "none",
                  fontSize: 14,
                  fontFamily: "TWK Lausanne",
                }}
              >
                {selectedArtist.Email || "—"}
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: `1px solid ${borderColor}`,
            borderBottom: `1px solid ${borderColor}`,
            textAlign: "center",
            padding: "40px 0",
          }}
        >
          <h1
            style={{
              fontSize: 72,
              color: accentColor,
              fontFamily: "OT Neue Montreal",
              margin: 0,
            }}
          >
            {isArabic ? "الظهور في المنشورات" : "APPEARANCES IN PUBLICATIONS"}
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "60px 80px",
          }}
        >
          {[
            { image: "/book1.png", title: isArabic ? "كتاب ١." : "BOOK 01" },
            { image: "/book1.png", title: isArabic ? "كتاب ٢." : "BOOK 02" },
            { image: "/book3.png", title: isArabic ? "كتاب ٣." : "BOOK 03" },
          ].map((book, index) => (
            <div key={index} style={{ textAlign: "center" }}>
              <img
                src={book.image}
                alt=""
                style={{ width: 150, marginBottom: 20 }}
              />
              <div
                style={{
                  fontSize: 18,
                  textDecoration: "underline",
                  fontFamily: "TWK Lausanne",
                }}
              >
                {book.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Search Results View ──
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: bgColor,
        overflowX: "hidden",
        fontFamily: "monospace",
        color: textColor,
        direction: isArabic ? "rtl" : "ltr",
      }}
    >
      <Navbar />

      <div
        style={{
          paddingTop: "120px",
          paddingLeft: "18px",
          paddingRight: "18px",
        }}
      >
        <div
          style={{
            position: "relative",
            border: `1px solid ${accentColor}`,
            height: "38px",
            display: "flex",
            alignItems: "center",
            background: "transparent",
          }}
        >
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isArabic
                ? "ابحث عن فنان، عمل فني، موضوع، لون..."
                : "Search Artist, Artwork, Theme, Color..."
            }
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              paddingLeft: "12px",
              paddingRight: "55px",
              fontSize: "22px",
              color: accentColor,
              fontFamily: "monospace",
              letterSpacing: "0.02em",
            }}
          />
          <button
            onClick={() => handleSearch(query)}
            style={{
              position: "absolute",
              right: "12px",
              background: "none",
              border: "none",
              color: accentColor,
              fontSize: "28px",
              cursor: "pointer",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            ⌕
          </button>
        </div>

        <div
          style={{
            marginTop: "6px",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "5px",
            fontSize: "10px",
            letterSpacing: "0.08em",
            color: suggestedColor,
          }}
        >
          <span style={{ opacity: 0.7 }}>
            {isArabic ? "مقترح:" : "SUGGESTED:"}
          </span>
          {SUGGESTED_TAGS.map((tag, i) => (
            <span
              key={tag}
              onClick={() => handleTagClick(tag)}
              style={{
                cursor: "pointer",
                textTransform: "uppercase",
                color: suggestedColor,
              }}
            >
              {tag}
              {i !== SUGGESTED_TAGS.length - 1 ? "," : ""}
            </span>
          ))}
          <div
            style={{
              marginLeft: isArabic ? "0" : "auto",
              marginRight: isArabic ? "auto" : "0",
              display: "flex",
              gap: "18px",
            }}
          >
            <span
              onClick={() => setShowFilters(true)}
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                color: textColor,
              }}
            >
              {isArabic ? "ترتيب حسب" : "SORT BY"}
            </span>
            <span
              onClick={() => setShowFilters(true)}
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                color: textColor,
              }}
            >
              {isArabic ? "تصفية" : "FILTER"}{" "}
              {hasSearched && totalResults > 0
                ? String(totalResults).padStart(2, "0")
                : ""}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: "26px 18px 60px" }}>
        {isLoading ? (
          <div
            style={{
              paddingTop: "120px",
              textAlign: "center",
              fontSize: "12px",
              letterSpacing: "0.1em",
              color: textColor,
            }}
          >
            {isArabic ? "جارٍ البحث..." : "SEARCHING..."}
          </div>
        ) : hasSearched && totalResults === 0 ? (
          <div
            style={{
              paddingTop: "120px",
              textAlign: "center",
              fontSize: "12px",
              letterSpacing: "0.1em",
              color: textColor,
            }}
          >
            {isArabic ? "لا توجد نتائج" : "NO RESULTS FOUND"}
          </div>
        ) : (
          <>
            {/* Artists */}
            {artists.length > 0 && (
              <div style={{ marginBottom: "48px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.12em",
                    opacity: 0.5,
                    marginBottom: "16px",
                    textTransform: "uppercase",
                    color: textColor,
                  }}
                >
                  {isArabic ? "فنانون" : "ARTISTS"} —{" "}
                  {String(artists.length).padStart(2, "0")}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "22px",
                  }}
                >
                  {artists.map((artist) => (
                    <div
                      key={artist._id}
                      onClick={() => setSelectedArtist(artist)}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        style={{
                          position: "relative",
                          border: `1px solid ${cardBorder}`,
                          background: cardBg,
                          padding: "18px",
                        }}
                      >
                        <CornerDots />
                        <div
                          style={{
                            width: "100%",
                            aspectRatio: "3/4",
                            overflow: "hidden",
                            background: isArabic ? "#222" : "#ddd",
                          }}
                        >
                          {getArtistImage(artist) ? (
                            <img
                              src={getArtistImage(artist)}
                              alt={artist.Full_Name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "11px",
                                opacity: 0.4,
                                color: textColor,
                              }}
                            >
                              {isArabic ? "لا توجد صورة" : "NO IMAGE"}
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            textAlign: "center",
                            paddingTop: "14px",
                            textTransform: "uppercase",
                            fontSize: "11px",
                            lineHeight: 1.5,
                            letterSpacing: "0.08em",
                            color: textColor,
                          }}
                        >
                          <div style={{ fontWeight: 700 }}>
                            {isArabic
                              ? arabicArtistNames[artist.Full_Name?.trim()] ||
                                artist.Full_Name
                              : artist.Full_Name}
                          </div>
                          {artist.Nationality && (
                            <div style={{ opacity: 0.6 }}>
                              {artist.Nationality}
                            </div>
                          )}
                          {artist.Birth_Year && (
                            <div style={{ opacity: 0.6 }}>
                              B. {artist.Birth_Year}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Books */}
            {books.length > 0 && (
              <div style={{ marginBottom: "48px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.12em",
                    opacity: 0.5,
                    marginBottom: "16px",
                    textTransform: "uppercase",
                    color: textColor,
                  }}
                >
                  {isArabic ? "كتب" : "BOOKS"} —{" "}
                  {String(books.length).padStart(2, "0")}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "22px",
                  }}
                >
                  {books.map((book) => (
                    <div key={book._id}>
                      <div
                        style={{
                          position: "relative",
                          border: `1px solid ${cardBorder}`,
                          background: cardBg,
                          padding: "18px",
                        }}
                      >
                        <CornerDots />
                        <div
                          style={{
                            width: "100%",
                            aspectRatio: "3/4",
                            overflow: "hidden",
                            background: isArabic ? "#222" : "#ddd",
                          }}
                        >
                          {book.Cloudinary_Image1 ? (
                            <img
                              src={book.Cloudinary_Image1}
                              alt={book.Book_Title || book.Title}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "11px",
                                opacity: 0.4,
                                color: textColor,
                              }}
                            >
                              {isArabic ? "لا توجد صورة" : "NO IMAGE"}
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            textAlign: "center",
                            paddingTop: "14px",
                            textTransform: "uppercase",
                            fontSize: "11px",
                            lineHeight: 1.5,
                            letterSpacing: "0.08em",
                            color: textColor,
                          }}
                        >
                          <div style={{ fontWeight: 700 }}>
                            {isArabic
                              ? book.Title_In_Arabic ||
                                book.Book_Title ||
                                book.Title
                              : book.Book_Title || book.Title}
                          </div>
                          {book.Book_ID && (
                            <div style={{ opacity: 0.6 }}>{book.Book_ID}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Artworks */}
            {artworks.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.12em",
                    opacity: 0.5,
                    marginBottom: "16px",
                    textTransform: "uppercase",
                    color: textColor,
                  }}
                >
                  {isArabic ? "أعمال فنية" : "ARTWORKS"} —{" "}
                  {String(artworks.length).padStart(2, "0")}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "22px",
                  }}
                >
                  {artworks.map((art) => (
                    <div
                      key={art._id}
                      onClick={() => setSelectedArtwork(art)}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        style={{
                          position: "relative",
                          border: `1px solid ${cardBorder}`,
                          background: cardBg,
                          padding: "18px",
                        }}
                      >
                        <CornerDots />
                        <div
                          style={{
                            width: "100%",
                            aspectRatio: "1/1",
                            overflow: "hidden",
                            background: isArabic ? "#222" : "#ddd",
                          }}
                        >
                          <img
                            src={art.Cloudinary_Image_URL}
                            alt={art.Title_In_English}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            textAlign: "center",
                            paddingTop: "14px",
                            textTransform: "uppercase",
                            fontSize: "11px",
                            lineHeight: 1.5,
                            letterSpacing: "0.08em",
                            color: textColor,
                          }}
                        >
                          <div>
                            {isArabic
                              ? art.Title_In_Arabic || art.Title_In_English
                              : art.Title_In_English}
                          </div>
                          {art.Year_Created && (
                            <div style={{ opacity: 0.7 }}>
                              {art.Year_Created}
                            </div>
                          )}
                          {art.Artist_Name && (
                            <div style={{ opacity: 0.7 }}>
                              {isArabic
                                ? arabicArtistNames[
                                    (art.Artist_Name || "").trim()
                                  ] || art.Artist_Name
                                : art.Artist_Name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              top: "90px",
              maxHeight: "88vh",
              overflowY: "auto",
              paddingBottom: "20px",
              right: isArabic ? "auto" : "18px",
              left: isArabic ? "18px" : "auto",
              width: "440px",
              background: filterBg,
              border: `1px solid ${filterBorder}`,
              zIndex: 9999,
              color: textColor,
            }}
          >
            {[
              { top: -4, left: -4 },
              { top: -4, right: -4 },
              { bottom: -4, left: -4 },
              { bottom: -4, right: -4 },
            ].map((pos, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: "8px",
                  height: "8px",
                  background: accentColor,
                  zIndex: 5,
                  ...pos,
                }}
              />
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 18px",
                borderBottom: `1px solid ${filterBorder}`,
              }}
            >
              <div style={{ fontSize: "30px", lineHeight: 1 }}>
                {isArabic ? "كل الفلاتر" : "All Filters"}
              </div>
              <button
                onClick={() => setShowFilters(false)}
                style={{
                  width: "52px",
                  height: "52px",
                  background: "#000",
                  color: "#fff",
                  border: "none",
                  fontSize: "28px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${filterBorder}`,
                fontSize: "12px",
                color: textColor,
              }}
            >
              <div
                style={{ marginBottom: "12px", textDecoration: "underline" }}
              >
                {isArabic ? "ترتيب حسب:" : "SORT BY:"}
              </div>
              <div style={{ display: "flex", gap: "30px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    color: textColor,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={sortBy === "alphabetical"}
                    onChange={() => {
                      setSortBy("alphabetical");
                      if (query) handleSearch(query);
                    }}
                  />
                  {isArabic ? "أبجدي" : "ALPHABETICAL"}
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    color: textColor,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={sortBy === "chronological"}
                    onChange={() => {
                      setSortBy("chronological");
                      if (query) handleSearch(query);
                    }}
                  />
                  {isArabic ? "زمني" : "CHRONOLOGICALLY"}
                </label>
              </div>
            </div>

            {FILTER_SECTIONS.map((section) => {
              const filterItems =
                section === "THEME:"
                  ? THEMES
                  : section === "MEDIUM:"
                    ? MEDIUMS
                    : section === "COUNTRY:"
                      ? COUNTRIES
                      : section === "COLOR:"
                        ? COLORS
                        : section === "YEAR:"
                          ? YEARS
                          : section === "TAGS:"
                            ? SUGGESTED_TAGS
                            : [];

              return (
                <div
                  key={section}
                  style={{ borderBottom: `1px solid ${filterBorder}` }}
                >
                  <div
                    onClick={() =>
                      setExpandedFilter(
                        expandedFilter === section ? null : section,
                      )
                    }
                    style={{
                      padding: "18px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "16px",
                      textDecoration: "underline",
                      cursor: "pointer",
                      color: textColor,
                    }}
                  >
                    {isArabic
                      ? ARABIC_FILTER_LABELS[section] || section
                      : section}
                    <span style={{ fontSize: "34px", lineHeight: 0.7 }}>
                      {expandedFilter === section ? "↑" : "↓"}
                    </span>
                  </div>

                  {expandedFilter === section && (
                    <div
                      style={{
                        padding: "0 18px 18px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      {filterItems.map((item) => (
                        <div
                          key={item}
                          onClick={() => {
                            setQuery(item);
                            setSelectedFilters([item]);
                            handleSearch(item);
                          }}
                          style={{
                            cursor: "pointer",
                            padding: "10px 12px",
                            border: `1px solid ${filterBorder}`,
                            background: selectedFilters.includes(item)
                              ? accentColor
                              : "transparent",
                            color: selectedFilters.includes(item)
                              ? "#fff"
                              : textColor,
                            fontSize: "12px",
                            textTransform: "uppercase",
                          }}
                        >
                          {isArabic
                            ? ARABIC_THEMES[item] ||
                              ARABIC_MEDIUMS[item] ||
                              ARABIC_TAGS[item] ||
                              item
                            : item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div
              style={{
                padding: "18px",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
              }}
            >
              <button
                onClick={() => {
                  setArtworks([]);
                  setArtists([]);
                  setBooks([]);
                  setHasSearched(false);
                  setQuery("");
                  setShowFilters(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontFamily: "monospace",
                  color: textColor,
                }}
              >
                {isArabic ? "مسح الفلاتر" : "CLEAR FILTERS"}
              </button>
              <button
                onClick={() => setShowFilters(false)}
                style={{
                  background: "none",
                  border: "none",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontFamily: "monospace",
                  color: textColor,
                }}
              >
                {isArabic ? "عرض النتائج" : "VIEW RESULTS"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;
