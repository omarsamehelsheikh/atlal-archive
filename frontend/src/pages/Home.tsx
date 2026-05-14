import React, { useState, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import API from "../services/api"; // 1. FIXED IMPORT
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

type SortOption = "random" | "alphabetical";

const Home: React.FC = () => {
  const { language } = useLanguage();

  const isArabic = language === "AR";

  const [artists, setArtists] = useState<any[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<any | null>(null);

  const [sortOpen, setSortOpen] = useState(false);

  const [sortMode, setSortMode] = useState<SortOption>("random");

  const [hoveredNode, setHoveredNode] = useState<any | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const animationRef = useRef<number>();

  const [time, setTime] = useState(0);

  useEffect(() => {
    const animate = () => {
      setTime(Date.now() * 0.001);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

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
    "Faraj Suleiman/ Majd Kayyal": "فراج سليمان / مجد كيال",
    "Akram Zaatari": "أكرم زعتري",
    "Ghada Amer": "غادة عامر",
    "Kader Attia": "قادر عطيه",
    "Lara Baladi": "لارا بلدي",
    "Yazan Khalili": "يزن خليلي",
    "Tanya Habjouqa": "تانيا هبجوكة ",
    "Rania Stephan": "رانيا ستيفان",
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
    // 1. Switched to centralized API instance
    API.get("/artists")
      .then((res: any) => { // Added :any type
        // 2. Support for both .data.data and .data response structures
        const artistsData = res.data.data || res.data || [];

        const filteredArtists = artistsData.filter((artist: any) => {
          // 3. Updated check to include the new Cloudinary_Images array
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

      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }

      grouped[firstLetter].push(artist);
    });

    return grouped;
  }, [artists, isArabic]);

  // IMAGE SIZES

  const getRandomSize = (index: number) => {
    const variations = [
      { width: 95, height: 130 },
      { width: 115, height: 150 },
      { width: 85, height: 85 },
      { width: 80, height: 105 },
      { width: 130, height: 170 },
      { width: 100, height: 130 },
    ];

    return variations[index % variations.length];
  };

  // POSITIONS

  // REPLACE your current generateScatteredPosition with this:
const generateScatteredPosition = (index: number) => {
  // Galaxy constants
  const angleIncrement = index * 0.5; // Controls the "spiral" tightness
  const radiusScaling = 45; // Controls how far apart the stars are
  
  // Create a spiral distribution
  const radius = Math.sqrt(index) * radiusScaling;
  const angle = index * 137.5; // The "Golden Angle" for perfect distribution

  // Center of the screen (approximate)
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2.5;

  return {
    left: centerX + radius * Math.cos((angle * Math.PI) / 180),
    top: centerY + radius * Math.sin((angle * Math.PI) / 180),
  };
};
  // GET IMAGE

  const getArtistImage = (artist: any) => {
    if (hasValidImage(artist.Cloudinary_Image1)) {
      return artist.Cloudinary_Image1;
    }

    if (hasValidImage(artist.Cloudinary_Image2)) {
      return artist.Cloudinary_Image2;
    }

    if (hasValidImage(artist.Cloudinary_Image3)) {
      return artist.Cloudinary_Image3;
    }

    return "";
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
                onClick={() => {
                  setSortMode("alphabetical");

                  setSortOpen(false);
                }}
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
                onClick={() => {
                  setSortMode("random");

                  setSortOpen(false);
                }}
                style={{
                  ...sortBtn,
                  background: cardBg,
                  color: textColor,
                }}
              >
                {isArabic ? "عشوائي" : "RANDOM GRID"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* RANDOM */}

     {!selectedArtist && sortMode === "random" && (
        <div
          style={{
            width: "100%",
            height: "100vh", // Galaxy fills the screen
            position: "relative",
            overflow: "hidden", // Prevents scrollbars during floating
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            {!isLoading &&
              artists.map((artist, index) => {
                const size = getRandomSize(index);
                const position = generateScatteredPosition(index);

                return (
                  <div
                    key={artist._id || index}
                    onClick={() => setSelectedArtist(artist)}
                    onMouseEnter={() => setHoveredNode(artist)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{
                      position: "absolute",
                      // 1. Center coordinates from the spiral math
                      left: position.left,
                      top: position.top,
                      width: size.width,
                      height: size.height,
                      cursor: "pointer",
                      // 2. Make sure hovered item is always on top
                      zIndex: hoveredNode?._id === artist._id ? 9999 : index,
                      transition: "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
                      // 3. GALAXY MOTION (Circular drift + scale)
                      transform: `
                        translate(
                          ${Math.cos(time * 0.3 + index) * 25}px, 
                          ${Math.sin(time * 0.4 + index) * 25}px
                        )
                        scale(${hoveredNode?._id === artist._id ? 1.2 : 1})
                      `,
                    }}
                  >
                    <img
                      src={getArtistImage(artist)}
                      alt={artist.Full_Name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        boxShadow:
                          hoveredNode?._id === artist._id
                            ? `0 0 35px ${accentColor}`
                            : "0 0 15px rgba(255,255,255,0.08)",
                        transition: "0.5s ease",
                        filter:
                          hoveredNode?._id === artist._id
                            ? "brightness(1.12)"
                            : "brightness(0.92)",
                      }}
                    />
                  </div>
                );
              })}
          </div>
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
            // REPLACE Line 274:
height: "100vh",
          }}
        >
          <div
            style={{
              width: "100%",
              textAlign: "center",
              marginBottom: 100,
            }}
          >
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

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
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
                          ? arabicArtistNames[artist.Full_Name?.trim()] ||
                            artist.Full_Name
                          : artist.Full_Name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* HOVER */}

      {hoveredNode && !selectedArtist && (
  <div
    style={{
      position: "fixed",
      bottom: 30,
      left: isArabic ? "auto" : 30,
      right: isArabic ? 30 : "auto",

      background: isArabic
        ? "rgba(15,15,15,0.97)"
        : "rgba(255,255,255,0.97)",

      color: textColor,

      border: `1px solid ${borderColor}`,

      padding: "18px 22px",

      zIndex: 999999,
    }}
  >
    <div
      style={{
        fontSize: 20,

        fontWeight: 600,

        fontFamily: '"Edition Numerical Unlicensed1"',

        textTransform: isArabic
          ? "none"
          : "uppercase",
      }}
    >
      {isArabic
        ? arabicArtistNames[
            hoveredNode.Full_Name?.trim()
          ] || hoveredNode.Full_Name
        : hoveredNode.Full_Name}
    </div>
  </div>
)}

      {/* DETAILS */}

      {/* DETAILS */}

      {selectedArtist && (
        <div
          style={{
            background: bgColor,
            color: textColor,
            minHeight: "100vh",
          }}
        >
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
              <div
                style={{
                  border: `1px solid ${borderColor}`,
                  padding: 16,
                }}
              >
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

              {/* TITLE */}

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
                {/* <div
                  style={{
                    fontSize: 58,
                    lineHeight: 1,
                    color: accentColor,
                    fontFamily: "OT Neue Montreal",
                  }}
                >
                  {isArabic ? "٢٠" : ">AR20"}
                </div> */}
                <div
                  style={{
                    fontSize: 34,
                    fontFamily: '"Edition Numerical Unlicensed"',
                    fontWeight: 900,
                    backgroundColor: isArabic ? "#FFFFFF" : "#000000",
                    color: isArabic ? "#000000" : "#FFFFFF",
                    textTransform: isArabic ? "none" : "uppercase",
                    padding: "8px 14px",
                    display: "inline-block",
                  }}
                >
                  {isArabic
                    ? arabicArtistNames[selectedArtist.Full_Name?.trim()] ||
                      selectedArtist.Full_Name
                    : selectedArtist.Full_Name}
                </div>
              </div>

              {/* ROWS */}

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
                      fontFamily: "Edition Numerical Unlicensed1",
                      fontWeight: 700,
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
                    fontFamily: "Edition Numerical Unlicensed1",
                    fontWeight: 700,
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
                    ? selectedArtist.Bio_In_Arabic ||
                      selectedArtist.Bio_In_English
                    : selectedArtist.Bio_In_English}
                </div>
              </div>

              {/* CONTACT */}

              <div
                style={{
                  padding: "16px 18px",
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    marginBottom: 12,
                    fontFamily: "Edition Numerical Unlicensed1",
                    fontWeight: 700,
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "60px 80px",
            }}
          >
            {[
              {
                image: "/book1.png",
                title: isArabic ? "كتاب ١." : "BOOK 01",
              },

              {
                image: "/book1.png",
                title: isArabic ? "كتاب ٢." : "BOOK 02",
              },

              {
                image: "/book3.png",
                title: isArabic ? "كتاب ٣." : "BOOK 03",
              },
            ].map((book, index) => (
              <div
                key={index}
                style={{
                  textAlign: "center",
                }}
              >
                <img
                  src={book.image}
                  alt=""
                  style={{
                    width: 150,
                    marginBottom: 20,
                  }}
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