import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

const BOOK_AUTHORS = [
  "HANEEN FOUAD",
  "NANCY ASHRAF",
  "SOHAYLA HEGAZY",
  "FATEMA ELHEMALY",
  "FARAH WALEED",
  "OMAR HANNOURA",
  "MOHAMED ELKAHKY",
  "SALMA ABDELAZIM",
  "SALMA EMADELDIN",
  "SAMIA DAHER",
  "AMMAR SAKR",
  "ROLA AYMAN",
  "SALMA ELSAID",
];
const SUPERVISORS = ["DIMA TANNIR", "MAYAR ABDULLAH"];
const BOOK_AUTHORS_AR = [
  "حنين فؤاد",
  "نانسي أشرف",
  "سهيلة حجازي",
  "فاطمة الجمالي",
  "فرح وليد",
  "عمر هنورة",
  "محمد الكحكي",
  "سلمي عبدالعظيم",
  "سلمي عمادالدين",
  "سامية داهر",
  "عمار صقر",
  "رولا أيمن",
  "سلمي السيد",
];
const SUPERVISORS_AR = ["ديما طنير", "ميار عبدالله"];

const CARDS = [
  {
    id: "about",
    titleEN: "ABOUT ATLAL",
    titleAR: "حول أطلال",
    textEN:
      "Atlal is an open access interdisciplinary compendium of Arab & SWANA Artists in diaspora and their practices, encompassing print & digital publishing, a digital repository database, and virtual presence.",
    textAR:
      "أطلال هو مشروع مفتوح يضم الفنانين العرب وفناني جنوب غرب آسيا وشمال أفريقيا في المهجر وممارساتهم الفنية من خلال النشر الورقي الرقمي وقاعدة بيانات رقمية.",
    dark: false,
    // We store positions as raw values to manipulate them
    pos: { x: "4%", top: "150px" },
  },
  {
    id: "mission",
    titleEN: "MISSION",
    titleAR: "الرسالة",
    textEN:
      "Paving a pathway between Arab contemporary artists in diaspora, and Arab/SWANA audiences, in an aim to nurture healthy and critical conversations.",
    textAR:
      "خلق مساحة تربط الفنانين العرب المعاصرين في المهجر بالجمهور العربي وجمهور جنوب غرب آسيا وشمال أفريقيا لتعزيز الحوار النقدي الصحي.",
    dark: true,
    pos: { x: "35%", top: "500px" },
  },
  {
    id: "vision",
    titleEN: "VISION",
    titleAR: "الرؤية",
    textEN:
      "For Arab/SWANA audiences at large to be well acquainted with Arab/SWANA Artists in diaspora and their practices.",
    textAR:
      "أن يكون الجمهور العربي وجمهور جنوب غرب آسيا وشمال أفريقيا أكثر معرفة بالفنانين العرب في المهجر وممارساتهم الفنية.",
    dark: true,
    pos: { x: "6%", top: "900px" },
  },
  {
    id: "values",
    titleEN: "VALUES",
    titleAR: "القيم",
    textEN:
      "We engage in critical dialogue around SWANA and Arab identity, especially in the diaspora, fostering inclusive conversations in contemporary art. Our focus centers the artworks themselves, while a decolonial lens challenges Western frameworks and highlights the contributions of Arab and SWANA artists, particularly how diaspora experiences shape their work and its perception.",
    textAR:
      "نحن نخوض حوارًا نقديًا حول منطقة جنوب غرب آسيا وشمال إفريقيا (سوانا) والهوية العربية، لا سيما في أوساط الشتات، ونعمل على تشجيع الحوارات الشاملة في مجال الفن المعاصر. ينصب تركيزنا على الأعمال الفنية نفسها، في حين تتحدى المنظور الاستعماري الأطر الغربية وتسلط الضوء على إسهامات الفنانين العرب وفناني منطقة سوانا، ولا سيما الكيفية التي تشكل بها تجارب الشتات أعمالهم وتصورات الجمهور عنها.",
    dark: false,
    // Values was specifically on the right, so we handle it relatively
    pos: { x: "right 4%", top: "900px" },
  },
];

const About: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === "AR";

  const [isBookOpen, setIsBookOpen] = useState(false);
  const [bookPages, setBookPages] = useState<string[]>([]);
  const [isScrolledToCredits, setIsScrolledToCredits] = useState(false);

  const bgPath = "/image-background-for-about-page.png";

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      setIsScrolledToCredits(scrollY > windowHeight * 1.1);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    axios
      .get("/api/books")
      .then((res) => {
        const bookData = res.data.data?.[0] || res.data?.[0];
        const pages = [
          bookData?.Cloudinary_Image1,
          bookData?.Cloudinary_Image2,
          bookData?.Cloudinary_Image3,
        ].filter(Boolean);
        setBookPages(pages);
      })
      .catch((err) => console.error("Error loading book pages:", err));
  }, []);

  const currentAuthors = isArabic ? BOOK_AUTHORS_AR : BOOK_AUTHORS;
  const currentSupervisors = isArabic ? SUPERVISORS_AR : SUPERVISORS;

  const getScrollingBg = () => {
  return isArabic
    ? "#000000"
    : "#ffffff";
};
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: getScrollingBg(),
        transition: "background-color 0.8s ease",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <Navbar />

      {/* <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          backgroundImage: `url("${bgPath}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: isScrolledToCredits ? 0 : isArabic ? 0.08 : 0.15,
          transition: "opacity 0.6s ease",
          pointerEvents: "none",
        }}
      /> */}

      <AnimatePresence>
        {isBookOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.overlay}
          >
            <button
              onClick={() => setIsBookOpen(false)}
              style={styles.closeBtn}
            >
              CLOSE [X]
            </button>
            <div style={styles.pageScroll}>
              {bookPages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  style={styles.pageImg}
                  alt={`Page ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: "relative", zIndex: 1 }}>
        <section
          style={{ position: "relative", width: "100%", height: "1450px" }}
          onDoubleClick={() => setIsBookOpen(true)}
        >
          {CARDS.map((card) => {
            // Logic to flip position based on language
            const horizontalPos = card.pos.x.includes("right")
              ? {
                  [isArabic ? "left" : "right"]: card.pos.x.replace(
                    "right ",
                    "",
                  ),
                }
              : { [isArabic ? "right" : "left"]: card.pos.x };

            return (
              <div
                key={card.id}
                style={{
                  position: "absolute",
                  top: card.pos.top,
                  ...horizontalPos,
                  width: "380px",
                  height: "380px",
                  background: card.dark ? "#000" : "#fff",
                  border: card.dark ? "1px solid #6f2cff" : "1px solid #d7d7d7",
                  padding: "30px",
                  boxSizing: "border-box",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  cursor: "pointer",
                  direction: isArabic ? "rtl" : "ltr",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  transition: "left 0.6s ease, right 0.6s ease", // Smooth shift when language toggles
                }}
              >
                <h2
                  style={{
                    margin: 0,

                    marginBottom: 20,

                    color: card.dark ? "#FFF" : "var(--black, #000)",

                    fontFamily: '"Edition Numerical Unlicensed1"',

                    fontSize: "37px",

                    fontStyle: "normal",

                    fontWeight: 400,

                    lineHeight: "99px",

                    textTransform: "uppercase",
                  }}
                >
                  {isArabic ? card.titleAR : card.titleEN}
                </h2>
                <p
                  style={{
                    margin: 0,

                    color: card.dark ? "#FFF" : "var(--black, #000)",

                    fontFamily: "TWK Lausanne",

                    fontSize: "20px",

                    fontStyle: "normal",

                    fontWeight: 200,

                    lineHeight: "28px",
                  }}
                >
                  {isArabic ? card.textAR : card.textEN}
                </p>
              </div>
            );
          })}
        </section>

        <section style={{ paddingBottom: 120 }}>
          <div style={{ ...styles.headerBar, background: "#000000" }}>
            <h1 style={styles.headerTitle}>
              {isArabic ? "مؤلفو الكتب" : "BOOK AUTHORS"}
            </h1>
          </div>

          <div style={{ width: "86%", margin: "0 auto" }}>
            {currentAuthors.map((author, index) => (
              <div
                key={index}
                style={{
                  ...styles.listItem,
                  color: isArabic ? "#ffffff" : "#222222",
                  borderBottom: isArabic
                    ? "1px solid #333333"
                    : "1px solid #bcbcbc",
                }}
              >
                {author}
              </div>
            ))}
          </div>

          <div style={{ ...styles.headerBar, background: "#000000" }}>
            <h1 style={styles.headerTitle}>
              {isArabic ? "إشراف" : "SUPERVISED BY"}
            </h1>
          </div>

          <div style={{ width: "86%", margin: "0 auto" }}>
            {currentSupervisors.map((name, index) => (
              <div
                key={index}
                style={{
                  ...styles.listItem,
                  color: isArabic ? "#ffffff" : "#222222",
                  borderBottom: isArabic
                    ? "1px solid #333333"
                    : "1px solid #bcbcbc",
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  headerBar: { width: "100%", padding: "22px 0", marginTop: "40px" },
  headerTitle: {
    color: "var(--Accent-color, #8A38F5)",

    textAlign: "center",

    fontFamily: '"TWK Lausanne"',

    fontSize: "55px",

    fontStyle: "normal",

    fontWeight: 600,

    lineHeight: "99px",

    textTransform: "uppercase",

    margin: 0,
  },
 listItem: {
  color:
    'var(--black, #000)',

  textAlign:
    'center',

  fontFamily:
    '"Edition Numerical Unlicensed"',

  fontSize:
    '37px',

  fontStyle:
    'normal',

  fontWeight:
    400,

  lineHeight:
    '99px',

  textTransform:
    'uppercase',

  padding:
    '18px 0',

  transition:
    'color 0.6s ease',
},
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "#fff",
    zIndex: 10000,
    overflowY: "auto",
  },
  closeBtn: {
    position: "fixed",
    top: "30px",
    right: "30px",
    background: "none",
    border: "none",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    zIndex: 10001,
    color: "#000",
  },
  pageScroll: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "100px 0",
  },
  pageImg: {
    maxWidth: "70%",
    height: "auto",
    marginBottom: "50px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
};

export default About;
