import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const openSearch = () => {
    navigate("/search");
  };

  const isHome = location.pathname === "/";

  const toggleLanguage = (lang: "ENG" | "AR") => {
    setLanguage(lang);
    setShowDropdown(false);
  };

  return (
    <nav
      style={{
        ...styles.navWrapper,

        height: isHome ? "110px" : "82px",

        background: language === "AR" ? "#000" : "#fff",

        borderBottom: isHome
          ? "none"
          : language === "AR"
            ? "1px solid #333"
            : "1px solid #000",
      }}
    >
      {/* ================= HOME NAVBAR ================= */}
      {isHome ? (
        <div
          style={{
            ...styles.container,
            flexDirection: language === "ENG" ? "row" : "row-reverse",
          }}
        >
          {/* SEARCH + LANGUAGE */}
          <div
            style={{
              ...styles.group,
              gap: "20px",
            }}
          >
            {/* SEARCH */}
            <div
              onClick={openSearch}
              style={{
                ...styles.searchButton,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  ...styles.searchBg,

                  background: language === "AR" ? "#111" : "#D9D9D9",

                  border: language === "AR" ? "1px solid #333" : "none",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    fill="none"
                    stroke={language === "AR" ? "#FFFFFF" : "#8A38F5"}
                    strokeWidth="2"
                  />

                  <line
                    x1="16.2"
                    y1="16.2"
                    x2="22"
                    y2="22"
                    stroke={language === "AR" ? "#FFFFFF" : "#8A38F5"}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>

                <span
                  style={{
                    ...styles.searchText,

                    color: language === "AR" ? "#fff" : "#000",

                    fontFamily: "TWK Lausanne",
                  }}
                >
                  {language === "ENG" ? "SEARCH" : "بحث"}
                </span>
              </div>
            </div>

            {/* LANGUAGE */}
            // ... rest of imports

            {/* LANGUAGE */}
            <div
              style={{
                position: "relative",
              }}
            >
              <div
                style={{
                  ...styles.langToggle,
                  background: language === "AR" ? "#111" : "#fff",
                  border:
                    language === "AR" ? "1px solid #555" : "1px solid #000",
                  color: language === "AR" ? "#fff" : "#000",
                  justifyContent: "center", // Centering text since icon is gone
                }}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span
                  style={{
                    fontFamily: "TWK Lausanne",
                    fontSize: "18px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: language === "AR" ? "#fff" : "#000",
                  }}
                >
                  {language === "ENG" ? "ENG" : "AR"}
                </span>

                {/* REMOVED: arrowIcon div was here */}
              </div>

              {showDropdown && (
                <div
                  style={{
                    ...styles.dropdown,
                    background: language === "AR" ? "#111" : "#fff",
                    border:
                      language === "AR" ? "1px solid #444" : "1px solid #ddd",
                  }}
                >
                  <div
                    style={{
                      ...styles.dropdownItem,
                      color: language === "AR" ? "#fff" : "#000",
                      background:
                        language === "ENG" ? "#8A38F5" : "transparent",
                      fontFamily: "TWK Lausanne",
                      fontWeight: 600,
                    }}
                    onClick={() => toggleLanguage("ENG")}
                  >
                    ENG
                  </div>

                  <div
                    style={{
                      ...styles.dropdownItem,
                      color: language === "AR" ? "#fff" : "#000",
                      background: language === "AR" ? "#8A38F5" : "transparent",
                      fontFamily: "TWK Lausanne",
                      fontWeight: 600,
                    }}
                    onClick={() => toggleLanguage("AR")}
                  >
                    AR
                  </div>
                </div>
              )}
            </div>
            </div>


          {/* LOGO */}
          <div style={styles.centerLogo}>
            <Link to="/">
              <img
                src="/calligraphy_logo.png"
                alt="Atlal"
                style={{
                  width: "193.32px",
                  height: "61.63px",

                  filter:
                    language === "AR" ? "brightness(0) invert(1)" : "none",
                }}
              />
            </Link>
          </div>

          {/* LINKS */}
          <div
            style={{
              ...styles.group,
              gap: "30px",
            }}
          >
            <Link
              to="/library"
              style={{
                ...styles.navLink,

                color: language === "AR" ? "#fff" : "#000",
              }}
            >
              {language === "ENG" ? "LIBRARY" : "منشورات"}
            </Link>

            <Link
              to="/manifesto"
              style={{
                ...styles.navLink,

                color: language === "AR" ? "#fff" : "#000",
              }}
            >
              {language === "ENG" ? "MANIFESTO" : "بيان"}
            </Link>

            <Link
              to="/about"
              style={{
                ...styles.navLink,

                color: language === "AR" ? "#fff" : "#000",
              }}
            >
              {language === "ENG" ? "ABOUT" : "عن اطلال"}
            </Link>
          </div>
        </div>
      ) : (
        /* ================= INNER NAVBAR ================= */

        <div
          style={{
            ...styles.innerNavbarContainer,

            background: language === "AR" ? "#000" : "#fff",
          }}
        >
          {/* LEFT */}
          <div style={styles.leftSection}>
            <button
              onClick={() => navigate(-1)}
              style={{
                ...styles.backButton,

                color: language === "AR" ? "#fff" : "#000",
              }}
            >
              ←
            </button>

            <Link to="/">
              <img
                src="/calligraphy_logo.png"
                alt="Atlal"
                style={{
                  ...styles.innerLogo,

                  filter:
                    language === "AR" ? "brightness(0) invert(1)" : "none",
                }}
              />
            </Link>
          </div>

          {/* CENTER */}
          <div style={styles.centerLinks}>
            <Link
              to="/library"
              style={{
                ...styles.innerNavLink,

                color: language === "AR" ? "#fff" : "#000",
              }}
            >
              {language === "ENG" ? "LIBRARY" : "منشورات"}
            </Link>

            <Link
              to="/manifesto"
              style={{
                ...styles.innerNavLink,

                color: language === "AR" ? "#fff" : "#000",
              }}
            >
              {language === "ENG" ? "MANIFESTO" : "بيان"}
            </Link>

            <Link
              to="/about"
              style={{
                ...styles.innerNavLink,

                color: language === "AR" ? "#fff" : "#000",
              }}
            >
              {language === "ENG" ? "ABOUT" : "عن أطلال"}
            </Link>
          </div>

          {/* RIGHT */}
          <Link
            to="/search"
            style={{
              textDecoration: "none",
            }}
          >
            <div
              style={{
                ...styles.innerSearchBg,

                background: language === "AR" ? "#111" : "#D9D9D9",

                border: language === "AR" ? "1px solid #333" : "none",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke={language === "AR" ? "#FFFFFF" : "#8A38F5"}
                  strokeWidth="2"
                />

                <line
                  x1="16.2"
                  y1="16.2"
                  x2="22"
                  y2="22"
                  stroke={language === "AR" ? "#FFFFFF" : "#8A38F5"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <span
                style={{
                  ...styles.innerSearchText,

                  color: language === "AR" ? "#fff" : "#5C5C5C",
                }}
              >
                {language === "ENG" ? "SEARCH" : "بحث"}
              </span>
            </div>
          </Link>
        </div>
      )}
    </nav>
  );
};

const styles: Record<string, React.CSSProperties> = {
  navWrapper: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
  },

  container: {
    width: "100%",
    padding: "0 50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },

  group: {
    display: "flex",
    alignItems: "center",
  },

  searchButton: {
    textDecoration: "none",
  },

  searchBg: {
    width: "191px",
    height: "39px",
    borderRadius: "40px",
    display: "flex",
    alignItems: "center",
    padding: "0 15px",
    gap: "10px",
    position: "relative",
  },

  searchIcon: {
    width: "18.5px",
    height: "18.99px",
    borderRadius: "50%",
  },

  searchText: {
    fontSize: "20px",
    opacity: 0.7,
    fontWeight: "500",
  },

  langToggle: {
    width: "94px",
    height: "39px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
  },

  arrowIcon: {
    width: "10px",
    height: "5px",
    borderTop: "none",
    borderLeft: "none",
    transform: "rotate(45deg)",
  },

  centerLogo: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
  },

  navLink: {
    textDecoration: "none",
    fontSize: "24px",
    fontWeight: "500",
    fontFamily: "TWK Lausanne",
  },

  dropdown: {
    position: "absolute",
    top: "45px",
    left: 0,
    borderRadius: "8px",
    overflow: "hidden",
    width: "120px",
  },

  dropdownItem: {
    padding: "10px",
    fontSize: "14px",
    cursor: "pointer",
    textAlign: "center",
  },

  innerNavbarContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    position: "relative",
  },

  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  backButton: {
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: "34px",
    fontWeight: 300,
    display: "flex",
    alignItems: "center",
    padding: 0,
    lineHeight: 1,
  },

  innerLogo: {
    width: "160px",
    objectFit: "contain",
  },

  centerLinks: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: "46px",
  },

 innerNavLink: {
  textDecoration: "none",

  fontFamily: "TWK Lausanne",

  fontWeight: 500,

  fontSize: "24px",

  lineHeight: "100%",

  letterSpacing: "0%",

  textAlign: "center",

  textTransform: "uppercase",
},

  innerSearchBg: {
    width: "166px", 
    height: "32px",
    borderRadius: "40px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0 16px",
  },

  innerSearchIcon: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
  },

  innerSearchText: {
    fontFamily: "TWK Lausanne",
    fontSize: "16px",
    fontWeight: 400,
    textTransform: "uppercase",
  },
};

export default Navbar;