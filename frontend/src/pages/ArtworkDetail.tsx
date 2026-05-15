import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api"; // Updated import
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

interface Artwork {
  _id: string;

  Title: string;

  Artist?: string;

  Description_In_English?: string;

  Description_In_Arabic?: string;

  Year?: string;

  Year_Created?: string;

  Themes?: string[];

  Tags?: string[];

  Type?: string;

  Location?: string;

  Collection?: string;

  Cloudinary_Image1: string;
  Cloudinary_Images?: string[]; // Synced array

  Cloudinary_Image2?: string;

  Cloudinary_Image3?: string;

  Cloudinary_Image4?: string;

  Cloudinary_Image5?: string;

  Cloudinary_Image6?: string;
}

const ArtworkDetail: React.FC = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const { language } = useLanguage();

  const [artwork, setArtwork] = useState<Artwork | null>(null);

  const [relatedArtworks, setRelatedArtworks] = useState<Artwork[]>([]);

  const [selectedImage, setSelectedImage] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/artworks/${id}`)
      .then(async (res: any) => {
        const artworkData = res.data.data;
        setArtwork(artworkData);

        // Priority: Use the array from sync, fallback to Image1
        const initialImg =
          artworkData.Cloudinary_Images?.[0] || artworkData.Cloudinary_Image1;
        setSelectedImage(initialImg);

        const allArtworksRes: any = await API.get("/artworks");
        const allArtworks = allArtworksRes.data.data || [];
        const related = allArtworks
          .filter(
            (a: any) =>
              a.Artist === artworkData.Artist && a._id !== artworkData._id,
          )
          .slice(0, 2);
        setRelatedArtworks(related);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading || !artwork)
    return (
      <div style={{ padding: 200, textAlign: "center" }}>LOADING...</div>
    );

  // Group all images found
  const images = [
    ...(artwork.Cloudinary_Images || []),
    artwork.Cloudinary_Image1,
    artwork.Cloudinary_Image2,
    artwork.Cloudinary_Image3,
    artwork.Cloudinary_Image4,
    artwork.Cloudinary_Image5,
    artwork.Cloudinary_Image6,
  ].filter(Boolean);

  // Remove duplicates
  const uniqueImages = Array.from(new Set(images)) as string[];

  const currentIndex = uniqueImages.findIndex((img) => img === selectedImage);

  const handlePrev = () => {
    if (currentIndex > 0) setSelectedImage(uniqueImages[currentIndex - 1]);
  };

  const handleNext = () => {
    if (currentIndex < uniqueImages.length - 1)
      setSelectedImage(uniqueImages[currentIndex + 1]);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#ECECEC",
        color: "#000",
        overflowX: "hidden",
        fontFamily: '"TWK Lausanne"',
      }}
    >
      <Navbar />

      <div
        style={{
          marginTop: 82,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderTop: "1px solid #777",
        }}
      >
        {/* LEFT SIDE */}
        <div
          style={{
            borderRight: "1px solid #777",
          }}
        >
          {/* TITLE */}
          <div
            style={{
              borderBottom: "1px solid #777",
              padding: "10px 18px",
              background: "#000",
            }}
          >
            <div
              style={{
                fontSize: 52,
                color: "#fff",
                fontFamily: '"Edition Numerical Unlicensed1"',
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              {artwork.Title}
            </div>

            <div
              onClick={async () => {
                try {
                  const res: any = await API.get("/artists");
                  const artists = res.data.data || res.data || [];
                  const matchedArtist = artists.find(
                    (a: any) =>
                      a.Full_Name?.trim() === artwork.Artist?.trim(),
                  );
                  if (matchedArtist) {
                    navigate("/search", {
                      state: { selectedArtist: matchedArtist },
                    });
                  }
                } catch (err) {
                  console.error("Navigation error:", err);
                }
              }}
              style={{
                color: "#8B5CF6",
                marginTop: 10,
                fontSize: 22,
                cursor: "pointer",
                textDecoration: "underline",
                fontFamily: '"TWK Lausanne"',
                fontWeight: 300,
              }}
            >
              {artwork.Artist}
            </div>
          </div>

          {/* YEAR + LOCATION */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              borderBottom: "1px solid #777",
            }}
          >
            <div
              style={{
                padding: "14px 18px",
              }}
            >
              <div
                style={{
                  color: "#000",
                  fontFamily: '"Edition Numerical Unlicensed1"',
                  fontSize: "22px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "30.5px",
                  textDecorationLine: "underline",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                YEAR:
              </div>

              <div
                style={{
                  opacity: 0.7,
                  fontFamily: "Edition Numerical Unlicensed2",
                }}
              >
                {artwork.Year || artwork.Year_Created}
              </div>
            </div>

            <div
              style={{
                padding: "14px 18px",
              }}
            >
              <div
                style={{
                  color: "#000",
                  fontFamily: '"Edition Numerical Unlicensed1"',
                  fontSize: "22px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "30.5px",
                  textDecorationLine: "underline",
                  textDecorationStyle: "solid",
                  textDecorationSkipInk: "auto",
                  textDecorationThickness: "auto",
                  textUnderlineOffset: "auto",
                  textUnderlinePosition: "from-font",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                LOCATION:
              </div>

              <div
                style={{
                  opacity: 0.7,
                  fontFamily: "Edition Numerical Unlicensed2",
                }}
              >
                {artwork.Location || "—"}
              </div>
            </div>
          </div>

          <InfoSection title="TYPE:" content={artwork.Type || "—"} />

          <InfoSection
            title="THEMES:"
            content={artwork.Themes ? artwork.Themes.join(", ") : "NO THEMES"}
          />

          <InfoSection
            title="TAGS:"
            content={artwork.Tags ? artwork.Tags.join(", ") : "NO TAGS"}
          />

          <InfoSection
            title="DESCRIPTION:"
            content={
              language === "ENG"
                ? artwork.Description_In_English || "—"
                : artwork.Description_In_Arabic || "—"
            }
          />

          <InfoSection
            title="COLLECTION:"
            content={artwork.Collection || "—"}
          />

          {/* RELATED */}
          <div
            style={{
              padding: "24px 18px",
              borderBottom: "1px solid #777",
              color: "#8B5CF6",
              fontSize: 52,
              fontFamily: "Edition Numerical Unlicensed1",
            }}
          >
            RELATED ITEMS
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            {relatedArtworks.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/artwork/${item._id}`)}
                style={{
                  padding: 28,
                  cursor: "pointer",
                  borderRight: "1px solid #777",
                }}
              >
                <img
                  src={item.Cloudinary_Image1}
                  style={{
                    width: "100%",
                    height: 300,
                    objectFit: "cover",
                    border: "1px solid #777",
                  }}
                />

                <div
                  style={{
                    textAlign: "center",
                    marginTop: 18,
                    fontFamily: '"TWK Lausanne"',
                  }}
                >
                  <div
                    style={{
                      fontSize: 32,
                      fontFamily: '"Edition Numerical Unlicensed1"',
                    }}
                  >
                    {item.Title}
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      opacity: 0.7,
                    }}
                  >
                    {item.Year}
                  </div>

                  <div
                    style={{
                      marginTop: 6,
                      opacity: 0.7,
                    }}
                  >
                    {item.Artist}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderBottom: "1px solid #777",
            padding: "32px 30px",
          }}
        >
          {/* MAIN IMAGE with corner bracket dots */}
          <div style={{ position: "relative", alignSelf: "center" }}>
            {/* Corner bracket dots — purple squares at each corner */}
            {[
              { top: -5, left: -5 },
              { top: -5, right: -5 },
              { bottom: -5, left: -5 },
              { bottom: -5, right: -5 },
            ].map((pos, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 10,
                  height: 10,
                  background: "#8B5CF6",
                  zIndex: 5,
                  ...pos,
                }}
              />
            ))}

            {/* Main image container */}
            <div
              style={{
                width: "467px",
                height: "544px",
                border: "1px solid #777",
                background: "#F5F5F5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={selectedImage}
                style={{
                  width: "92%",
                  height: "92%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          </div>

          {/* COUNTER ROW + NAV BUTTONS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "467px",
              alignSelf: "center",
              marginTop: 12,
            }}
          >
            {/* Image counter */}
            <div
              style={{
                fontFamily: "Edition Numerical Unlicensed2",
                fontSize: "18px",
                color: "#000",
              }}
            >
              {currentIndex + 1}/{uniqueImages.length}
            </div>

            {/* Zoom + Download + Prev/Next nav buttons */}
            <div style={{ display: "flex", gap: 0 }}>
              {/* Zoom */}
              <div
                onClick={() => window.open(selectedImage, "_blank")}
                title="Zoom"
                style={{
                  width: 32,
                  height: 32,
                  background: "#000",
                  color: "#8B5CF6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: 16,
                  border: "1px solid #000",
                  userSelect: "none",
                }}
              >
                ↗
              </div>

              {/* Download */}
              <div
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = selectedImage;
                  link.download = artwork.Title || "artwork";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                title="Download"
                style={{
                  width: 32,
                  height: 32,
                  background: "#000",
                  color: "#8B5CF6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: 16,
                  border: "1px solid #000",
                  userSelect: "none",
                  marginLeft: 2,
                }}
              >
                ↓
              </div>

              {/* Prev */}
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                style={{
                  width: 32,
                  height: 32,
                  background: currentIndex === 0 ? "#555" : "#000",
                  color: "#fff",
                  border: "none",
                  cursor: currentIndex === 0 ? "default" : "pointer",
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 6,
                }}
              >
                ‹
              </button>

              {/* Next */}
              <button
                onClick={handleNext}
                disabled={currentIndex === uniqueImages.length - 1}
                style={{
                  width: 32,
                  height: 32,
                  background:
                    currentIndex === uniqueImages.length - 1 ? "#555" : "#000",
                  color: "#fff",
                  border: "none",
                  cursor:
                    currentIndex === uniqueImages.length - 1
                      ? "default"
                      : "pointer",
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 2,
                }}
              >
                ›
              </button>
            </div>
          </div>

          {/* THUMBNAILS */}
          {uniqueImages.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "16px",
                width: "467px",
                alignSelf: "center",
                overflowX: "auto",
                boxSizing: "border-box",
              }}
            >
              {uniqueImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: "82px",
                    height: "82px",
                    flexShrink: 0,
                    objectFit: "cover",
                    cursor: "pointer",
                    border:
                      selectedImage === img
                        ? "2px solid #8B5CF6"
                        : "1px solid #777",
                    background: "#FFF",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoSection = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <div
      style={{
        borderBottom: "1px solid #777",
        padding: "10px 18px",
      }}
    >
      <div
        style={{
          color: "#000",
          fontFamily: '"Edition Numerical Unlicensed1"',
          fontSize: "22px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "30.5px",
          textDecorationLine: "underline",
          textDecorationStyle: "solid",
          textDecorationSkipInk: "auto",
          textDecorationThickness: "auto",
          textUnderlineOffset: "auto",
          textUnderlinePosition: "from-font",
          textTransform: "uppercase",
          marginBottom: "10px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: "#4A4A4A",
          fontFamily: '"TWK Lausanne"',
          fontSize: "12px",
          fontWeight: 400,
          lineHeight: "15px",
          letterSpacing: "1.2px",
          textTransform: "uppercase",
          whiteSpace: "pre-wrap",
          imageRendering: "pixelated",
          WebkitFontSmoothing: "none",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "geometricPrecision",
          wordBreak: "break-word",
        }}
      >
        {content}
      </div>
    </div>
  );
};

export default ArtworkDetail;