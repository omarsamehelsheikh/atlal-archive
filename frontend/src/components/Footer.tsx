import React from "react";
import { useLanguage } from "../context/LanguageContext";

const Footer: React.FC = () => {
  const { language } = useLanguage();

  const isArabic =
    language === "AR";

  return (
    <footer
      style={{
        width: "100%",
        height: "146px",

        background: isArabic
          ? "#000"
          : "#fff",

        borderTop: isArabic
          ? "1px solid #222"
          : "1px solid #d9d9d9",

        display: "flex",

        justifyContent:
          "center",

        alignItems: "flex-end",

        paddingBottom: "28px",
      }}
    >
      <div
        style={{
          display: "flex",

          width: "1180px",
height: "58px",
justifyContent: "center",
alignItems: "flex-end",
gap: "170px",

          flexDirection:
            isArabic
              ? "row-reverse"
              : "row",
        }}
      >
        {/* LEFT */}
        <div
          style={{
            display: "flex",

            flexDirection:
              "column",

            alignItems:
              isArabic
                ? "flex-end"
                : "flex-start",

            gap: "6px",
          }}
        >
          <div
  style={{
    color: isArabic
      ? "#fff"
      : "#000",

    fontFamily:
      "OT Neue Montreal",

    fontSize: "10px",

    fontWeight: 400,

    letterSpacing:
      "0.12em",

    textTransform:
      "uppercase",

    opacity: 0.9,

    whiteSpace: "nowrap",
  }}
>
  © 2026 ATLAL COMPENDIUM
</div>

          <div
            style={{
              color: isArabic
                ? "#fff"
                : "#000",

              fontFamily:
                "OT Neue Montreal",

              fontSize: "10px",

              fontWeight: 400,

              letterSpacing:
                "0.12em",

              textTransform:
                "uppercase",

              opacity: 0.55,
            }}
          >
            ALL RIGHTS
            RESERVED
          </div>
        </div>

        {/* CENTER */}
        <div
          style={{
            display: "flex",

            flexDirection:
              "column",

            alignItems:
              "center",

            gap: "6px",
          }}
        >
          <div
            style={{
              color: isArabic
                ? "#fff"
                : "#000",

              fontFamily:
                "OT Neue Montreal",

              fontSize: "10px",

              fontWeight: 400,

              letterSpacing:
                "0.12em",

              textTransform:
                "uppercase",

              opacity: 0.55,
            }}
          >
            MAIL:
          </div>

          <a
            href="mailto:atlalcompendium@gmail.com"
            style={{
              color: isArabic
                ? "#fff"
                : "#000",

              textDecoration:
                "none",

              fontFamily:
                "OT Neue Montreal",

              fontSize: "10px",

              fontWeight: 400,

              letterSpacing:
                "0.12em",

              textTransform:
                "uppercase",

              opacity: 0.9,
            }}
          >
            ATLALCOMPENDIUM@GMAIL.COM
          </a>
        </div>

        {/* INSTAGRAM */}
        <div
          style={{
            display: "flex",

            flexDirection:
              "column",

            alignItems:
              "center",

            gap: "6px",
          }}
        >
          <div
            style={{
              color: isArabic
                ? "#fff"
                : "#000",

              fontFamily:
                "OT Neue Montreal",

              fontSize: "10px",

              fontWeight: 400,

              letterSpacing:
                "0.12em",

              textTransform:
                "uppercase",

              opacity: 0.55,
            }}
          >
            INSTAGRAM:
          </div>

          <a
            href="https://instagram.com/atlalcompendium"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: isArabic
                ? "#fff"
                : "#000",

              textDecoration:
                "none",

              fontFamily:
                "OT Neue Montreal",

              fontSize: "10px",

              fontWeight: 400,

              letterSpacing:
                "0.12em",

              textTransform:
                "uppercase",

              opacity: 0.9,
            }}
          >
            @ATLALCOMPENDIUM
          </a>
        </div>

        {/* RIGHT LOGO */}
        <div
          style={{
            width: "180px",

            display: "flex",

            justifyContent:
              "center",

            alignItems:
              "flex-end",
          }}
        >
          <img
            src="/calligraphy_logo.png"
            alt="Atlal"
            style={{
              width: "100%",

              objectFit:
                "contain",

              filter: isArabic
                ? "invert(1)"
                : "none",
            }}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;