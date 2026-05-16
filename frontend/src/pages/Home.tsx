import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

type SortOption = "random" | "alphabetical";

// ─── ArtistFrame Component ────────────────────────────────────────────────────
const ArtistFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        style={{
          border: "2px solid #8B5CF6",
          display: "inline-block",
          position: "relative",
          padding: "4px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ─── 2D Galaxy Canvas ─────────────────────────────────────────────────────────
interface GalaxyNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  img: HTMLImageElement | null;
  imgUrl: string;
  artist: any;
  size: number;
}

interface Galaxy2DProps {
  artists: any[];
  bgColor: string;
  onHover: (artist: any | null) => void;
  onClick: (artist: any) => void;
  mousePos: { x: number; y: number };
}

const Galaxy2D: React.FC<Galaxy2DProps> = ({ artists, bgColor, onHover, onClick, mousePos }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<GalaxyNode[]>([]);
  const animRef = useRef<number>(0);
  const hoveredRef = useRef<GalaxyNode | null>(null);

  // Build nodes + start animation together
  useEffect(() => {
    if (!artists.length) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const W = canvas.width;
    const H = canvas.height;
    const NODE_SIZE = 55; // bigger so they're clearly visible

    // Build nodes immediately — images load async but we draw placeholders right away
    nodesRef.current = artists.map((artist) => {
      const imgUrl =
        artist.Cloudinary_Image1 ||
        artist.Cloudinary_Image2 ||
        artist.Cloudinary_Image3 ||
        "";

      const img = new Image();
      img.crossOrigin = "anonymous";
      if (imgUrl) img.src = imgUrl;

      return {
        id: artist._id,
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        img,
        imgUrl,
        artist,
        size: NODE_SIZE,
      };
    });

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      // Fill background every frame (critical — without this canvas is blank)
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);

      const scrollY = window.scrollY;

      nodesRef.current.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // wrap in world-space (full document height)
        if (node.x < -node.size) node.x = W + node.size;
        if (node.x > W + node.size) node.x = -node.size;
        if (node.y < -node.size) node.y = H + node.size;
        if (node.y > H + node.size) node.y = -node.size;

        // convert world Y → screen Y
        const screenY = node.y - scrollY;

        // skip if off-screen
        if (screenY + node.size < 0 || screenY - node.size > H) return;

        const isHovered = hoveredRef.current?.id === node.id;
        const s = isHovered ? node.size * 1.3 : node.size;

        if (node.img && node.img.complete && node.img.naturalWidth > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(node.x - s, screenY - s, s * 2, s * 2);
          ctx.clip();
          ctx.drawImage(node.img, node.x - s, screenY - s, s * 2, s * 2);
          ctx.restore();
          ctx.strokeStyle = isHovered ? "#8B5CF6" : "rgba(139,92,246,0.3)";
          ctx.lineWidth = isHovered ? 2 : 1;
          ctx.strokeRect(node.x - s, screenY - s, s * 2, s * 2);
        } else {
          ctx.fillStyle = isHovered ? "#8B5CF6" : bgColor === "#000000" ? "#222" : "#ddd";
          ctx.fillRect(node.x - s, screenY - s, s * 2, s * 2);
          ctx.strokeStyle = "#8B5CF6";
          ctx.lineWidth = 1;
          ctx.strokeRect(node.x - s, screenY - s, s * 2, s * 2);
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [artists, bgColor]);

  const cursorRef = useRef<string>("default");

  const hitTest = (clientX: number, clientY: number): GalaxyNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top + window.scrollY;
    for (const node of nodesRef.current) {
      const dx = mx - node.x;
      const dy = my - node.y;
      if (Math.abs(dx) <= node.size && Math.abs(dy) <= node.size) return node;
    }
    return null;
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const found = hitTest(e.clientX, e.clientY);
      hoveredRef.current = found;
      onHover(found ? found.artist : null);
      const newCursor = found ? "pointer" : "default";
      if (cursorRef.current !== newCursor) {
        cursorRef.current = newCursor;
        if (canvasRef.current) canvasRef.current.style.cursor = newCursor;
      }
    },
    [onHover]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const found = hitTest(e.clientX, e.clientY);
      if (found) onClick(found.artist);
    },
    [onClick]
  );

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", cursor: "default" }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    />
  );
};
// ─────────────────────────────────────────────────────────────────────────────

const Home: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === "AR";
  const navigate = useNavigate();

  const [artists, setArtists] = useState<any[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<any | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortOption>("random");
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // COLORS
  const bgColor = isArabic ? "#000000" : "#FFFFFF";
  const textColor = isArabic ? "#F5F5F5" : "#111111";
  const borderColor = isArabic ? "#2A2A2A" : "#111111";
  const cardBg = isArabic ? "#111111" : "#FFFFFF";
  const accentColor = isArabic ? "#A970FF" : "#7B3FF2";

  // ARABIC ARTIST NAMES
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
    "Nasa4Nasa (Noura Seif Hassanein/ Salma Abdel Salam)":
      "ناسا فور ناسا (نورا سيف حسانين / سلمي عبدالسلام)",
    "Yasmine Nasser Diaz": "ياسمين ناصر دياز",
    "Joana & Khalil": "جوانا و خليل",
    "Jannane Al-Ani": "جنان الأني ",
    "Faraj Suleiman/Majd Kayyal": "فراج سليمان / مجد كيال",
    "Akram Zaatari": "أكرم زعتري",
    "Ghada Amer": "غادة عامر",
    "Kader Attia": "قادر عطيه",
    "Lara Baladi": "لارا بلدي",
    "Yazan Khalili": "يزن خليلي",
    "Tanya Habjouqa": "تانيا هبجوكة ",
    "Rania Stephan": "رانيا ستيفان",
    "Marwa Arsanios": "مروة أرسانيوس",
    "Emily jacir": "إيملي جاسير",
    "Amira Al-Sharif": "أميرة الشريف",
     



  };

  // IMAGE VALIDATION
  const hasValidImage = (url?: string) => {
    return (
      url &&
      typeof url === "string" &&
      url.trim() !== "" &&
      url !== "null" &&
      url !== "undefined"
    );
  };

  // FETCH ARTISTS
  useEffect(() => {
    API.get("/artists")
      .then((res: any) => {
        const artistsData = res.data.data || res.data || [];
        const filteredArtists = artistsData.filter((artist: any) => {
          const hasImage =
            (artist.Cloudinary_Images && artist.Cloudinary_Images.length > 0) ||
            hasValidImage(artist.Cloudinary_Image1) ||
            hasValidImage(artist.Cloudinary_Image2) ||
            hasValidImage(artist.Cloudinary_Image3);
          const isSimoneFattal =
            artist.Full_Name?.toLowerCase().trim() === "simone fattal";
          return hasImage && !isSimoneFattal;
        });
        setArtists(filteredArtists);
      })
      .catch((err: any) => console.error("Home load error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // GROUPING
  const alphabeticalArtists = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    artists.forEach((artist) => {
      const artistName = isArabic
        ? arabicArtistNames[artist.Full_Name?.trim()] || artist.Full_Name
        : artist.Full_Name;
      const firstLetter = artistName?.charAt(0).toUpperCase() || "#";
      if (!grouped[firstLetter]) grouped[firstLetter] = [];
      grouped[firstLetter].push(artist);
    });
    return grouped;
  }, [artists, isArabic]);

  // GET IMAGE
  const getArtistImage = (artist: any) => {
    if (hasValidImage(artist.Cloudinary_Image1)) return artist.Cloudinary_Image1;
    if (hasValidImage(artist.Cloudinary_Image2)) return artist.Cloudinary_Image2;
    if (hasValidImage(artist.Cloudinary_Image3)) return artist.Cloudinary_Image3;
    return "";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: bgColor,
        color: textColor,
        direction: isArabic ? "rtl" : "ltr",
        overflowX: "hidden",
      }}
      onMouseMove={handleMouseMove}
    >
      {/* NAVBAR */}
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 0,
          width: "100%",
          zIndex: 99999,
          paddingInline: 40,
        }}
      >
        <Navbar />
      </div>

      {/* SORT */}
      {!selectedArtist && (
        <div
          style={{
            position: "fixed",
            top: 135,
            right: isArabic ? "auto" : 40,
            left: isArabic ? 40 : "auto",
            zIndex: 999999,
          }}
        >
          <button
            onClick={() => setSortOpen(!sortOpen)}
            style={{
              border: `1px solid ${borderColor}`,
              borderRadius: 30,
              padding: "7px 18px",
              background: bgColor,
              color: textColor,
              fontSize: 11,
              fontFamily: "TWK Lausanne",
              cursor: "pointer",
            }}
          >
            {isArabic ? "ترتيب" : "SORT BY"}
          </button>

          {sortOpen && (
            <div
              style={{
                marginTop: 10,
                background: cardBg,
                border: `1px solid ${borderColor}`,
                minWidth: 180,
              }}
            >
              <button
                onClick={() => { setSortMode("alphabetical"); setSortOpen(false); }}
                style={{
                  ...sortBtn,
                  background: cardBg,
                  color: textColor,
                  borderBottom: `1px solid ${borderColor}`,
                }}
              >
                {isArabic ? "أبجدي" : "ALPHABETICAL"}
              </button>
              <button
                onClick={() => { setSortMode("random"); setSortOpen(false); }}
                style={{ ...sortBtn, background: cardBg, color: textColor }}
              >
                {isArabic ? "عشوائي" : "RANDOM GRID"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── 2D GALAXY (replaces ForceGraph3D) ── */}
      {!selectedArtist && sortMode === "random" && (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          {/* Hover label */}
          {hoveredNode && (
            <div
              style={{
                position: "fixed",
                zIndex: 10000,
                pointerEvents: "none",
                left: mousePos.x + 20,
                top: mousePos.y + 20,
                background: isArabic
                  ? "rgba(15,15,15,0.97)"
                  : "rgba(255,255,255,0.97)",
                color: textColor,
                border: `1px solid ${borderColor}`,
                padding: "14px 20px",
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  fontFamily: '"Edition Numerical Unlicensed1"',
                  textTransform: isArabic ? "none" : "uppercase",
                  lineHeight: 1,
                }}
              >
                {isArabic
                  ? arabicArtistNames[hoveredNode.Full_Name?.trim()] || hoveredNode.Full_Name
                  : hoveredNode.Full_Name}
              </div>
            </div>
          )}

          {!isLoading && (
            <Galaxy2D
              artists={artists}
              bgColor={bgColor}
              onHover={setHoveredNode}
              onClick={setSelectedArtist}
              mousePos={mousePos}
            />
          )}
        </div>
      )}

      {/* ALPHABETICAL */}
      {!selectedArtist && sortMode === "alphabetical" && (
        <div
          style={{
            paddingTop: 170,
            paddingInline: 40,
            paddingBottom: 120,
            background: bgColor,
            color: textColor,
            height: "100vh",
          }}
        >
          <div style={{ width: "100%", textAlign: "center", marginBottom: 100 }}>
            <h1
              style={{
                fontSize: 82,
                fontFamily: "OT Neue Montreal",
                color: accentColor,
                margin: 0,
                fontWeight: 700,
              }}
            >
              {isArabic ? "الفنانون" : "ARTISTS"}
            </h1>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "120px 60px",
            }}
          >
            {Object.entries(alphabeticalArtists)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([letter, artists]) => (
                <div key={letter}>
                  <div
                    style={{
                      fontSize: 90,
                      fontWeight: 700,
                      marginBottom: 20,
                      fontFamily: "OT Neue Montreal",
                      lineHeight: 1,
                      color: accentColor,
                    }}
                  >
                    {letter}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {artists.map((artist: any) => (
                      <div
                        key={artist._id}
                        onClick={() => setSelectedArtist(artist)}
                        style={{
                          cursor: "pointer",
                          fontSize: 12,
                          fontFamily: '"Edition Numerical Unlicensed1"',
                          opacity: 0.75,
                        }}
                      >
                        {isArabic
                          ? arabicArtistNames[artist.Full_Name?.trim()] || artist.Full_Name
                          : artist.Full_Name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* DETAILS */}
      {selectedArtist && (
        <div style={{ background: bgColor, color: textColor, minHeight: "100vh" }}>
          {/* TOP NAV */}
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

          {/* BACK */}
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
              paddingBottom: isArabic ? 2 : 0,
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

          ٍ{/* MAIN */}
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: isArabic ? "1fr 1fr" : "1fr 1fr",
              borderTop: `1px solid ${borderColor}`,
              marginTop: 35,
            }}
          >
            {/* LEFT IMAGE */}
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
              <ArtistFrame>
                <img
                  src={getArtistImage(selectedArtist)}
                  alt=""
                  style={{ width: 430, height: 560, objectFit: "cover", display: "block" }}
                />
              </ArtistFrame>
            </div>

            {/* RIGHT CONTENT */}
            <div>
              {/* FILE HEADER */}
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
                    ? arabicArtistNames[selectedArtist.Full_Name?.trim()] || selectedArtist.Full_Name
                    : selectedArtist.Full_Name
                  )?.replace(/\s/g, "_").toUpperCase()}
                  _IMAGE.AR
                </span>
                <span>{isArabic ? "أطلال" : ""}</span>
              </div>

              {/* TITLE */}
              <div
                style={{
                  borderBottom: `1px solid ${borderColor}`,
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 12,
                  background: isArabic ? "#000" : "#fff",
                  color: isArabic ? "#fff" : "#000",
                }}
              >
                <span
                  style={{
                    color: "#8B5CF6",
                    fontSize: 42,
                    fontFamily: '"Edition Numerical Unlicensed"',
                    fontWeight: 400,
                    lineHeight: 1,
                  }}
                >
                  {isArabic ? "٢٠>" : ">AR20"}
                </span>
                <span
                  style={{
                    fontSize: 42,
                    fontFamily: '"Edition Numerical Unlicensed"',
                    fontWeight: 400,
                    textTransform: isArabic ? "none" : "uppercase",
                    lineHeight: 1,
                  }}
                >
                  {isArabic
                    ? arabicArtistNames[selectedArtist.Full_Name?.trim()] || selectedArtist.Full_Name
                    : selectedArtist.Full_Name}
                </span>
              </div>

              {/* ROWS */}
              {[
                [isArabic ? "سنة الميلاد:" : "YEAR OF BIRTH:", selectedArtist.Birth_Year],
                [
                  isArabic ? "مكان الإقامة:" : "BASED IN:",
                  isArabic
                    ? selectedArtist.Current_City_In_Arabic || selectedArtist.Current_City
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
                    ? selectedArtist.Artistic_Practices_In_Arabic || selectedArtist.Artistic_Practices
                    : selectedArtist.Artistic_Practices,
                ],
                [
                  isArabic ? "الشهادة:" : "DEGREE:",
                  isArabic
                    ? selectedArtist.Undergraduate_Degree_In_Arabic || selectedArtist.Undergraduate_Degree
                    : selectedArtist.Undergraduate_Degree,
                ],
              ].map((item, index) => (
                <div key={index} style={{ borderBottom: `1px solid ${borderColor}`, padding: "16px 18px" }}>
                  <div
                    style={{
                      fontSize: 16,
                      marginBottom: 10,
                      fontFamily: "Edition Numerical Unlicensed1",
                      fontWeight: 300,
                      textDecoration: "underline",
                    }}
                  >
                    {item[0]}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      lineHeight: 2,
                      opacity: 0.85,
                      fontFamily: '"Edition Numerical Unlicensed1"',
                    }}
                  >
                    {item[1] || "—"}
                  </div>
                </div>
              ))}

              {/* BIO */}
              <div style={{ borderBottom: `1px solid ${borderColor}`, padding: "16px 18px" }}>
                <div
                  style={{
                    fontSize: 16,
                    marginBottom: 12,
                    fontFamily: "Edition Numerical Unlicensed1",
                    fontWeight: 300,
                    textDecoration: "underline",
                  }}
                >
                  {isArabic ? "سيرة ذاتية" : "BIOGRAPHY:"}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    lineHeight: 2,
                    opacity: 0.85,
                    fontFamily: '"Edition Numerical Unlicensed1"',
                  }}
                >
                  {isArabic
                    ? selectedArtist.Bio_In_Arabic || selectedArtist.Bio_In_English
                    : selectedArtist.Bio_In_English}
                </div>
              </div>

              {/* CONTACT */}
              <div style={{ padding: "16px 18px" }}>
                <div
                  style={{
                    fontSize: 16,
                    marginBottom: 12,
                    fontFamily: "Edition Numerical Unlicensed1",
                    fontWeight: 300,
                    textDecoration: "underline",
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

          {/* PUBLICATIONS */}
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
                fontFamily: "Edition Numerical Unlicensed1",
                margin: 0,
              }}
            >
              {isArabic ? "الظهور في المنشورات" : "APPEARANCES IN PUBLICATIONS"}
            </h1>
          </div>

          {/* BOOKS */}
          <div style={{ display: "flex", justifyContent: "space-around", padding: "60px 80px" }}>
            {[
              { image: "/book1.png", title: isArabic ? "كتاب ١." : "BOOK 01", id: "BOOK01" },
              { image: "/book2.png", title: isArabic ? "كتاب ٢." : "BOOK 02", id: "BOOK02" },
              { image: "/book3.png", title: isArabic ? "كتاب ٣." : "BOOK 03", id: "BOOK03" },
            ].map((book, index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <img
                  src={book.image}
                  alt=""
                  onClick={() => navigate(`/library?book=${book.id}`)}
                  style={{ width: 150, marginBottom: 20, cursor: "pointer" }}
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
      )}
    </div>
  );
};

const sortBtn: React.CSSProperties = {
  width: "100%",
  padding: "14px 18px",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  fontSize: 11,
  fontFamily: "TWK Lausanne",
};

export default Home;
