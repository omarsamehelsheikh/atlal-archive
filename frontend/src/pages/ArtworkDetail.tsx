import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";

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
    axios
      .get(`/api/artworks/${id}`)
      .then(async (res) => {
        const artworkData = res.data.data;

        artworkData.Themes = ["Memory", "Identity", "Archive"];

        artworkData.Tags = ["black and white", "portrait", "architecture"];

        setArtwork(artworkData);

        setSelectedImage(artworkData.Cloudinary_Image1);

        const allArtworksRes = await axios.get(
          "/api/artworks",
        );

        const allArtworks = allArtworksRes.data.data || [];

        const related = allArtworks
          .filter(
            (a: Artwork) =>
              a.Artist === artworkData.Artist && a._id !== artworkData._id,
          )
          .slice(0, 2);

        setRelatedArtworks(related);

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);

        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div
        style={{
          padding: 200,
          textAlign: "center",
          fontFamily: "Edition Numerical Unlicensed2",
        }}
      >
        LOADING...
      </div>
    );

  if (!artwork)
    return (
      <div
        style={{
          padding: 200,
          textAlign: "center",
          fontFamily: "Edition Numerical Unlicensed2",
        }}
      >
        NOT FOUND
      </div>
    );

  const images = [
    artwork.Cloudinary_Image1,
    artwork.Cloudinary_Image2,
    artwork.Cloudinary_Image3,
    artwork.Cloudinary_Image4,
    artwork.Cloudinary_Image5,
    artwork.Cloudinary_Image6,
  ].filter(Boolean);

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
                  const res = await axios.get(
                    "/api/artists",
                  );

                  const artists = res.data.data || [];

                  const matchedArtist = artists.find(
                    (a: any) => a.Full_Name?.trim() === artwork.Artist?.trim(),
                  );

                  if (matchedArtist) {
                    navigate("/search", {
                      state: {
                        selectedArtist: matchedArtist,
                      },
                    });
                  }
                } catch (err) {
                  console.error(err);
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
          }}
        >
          {/* IMAGE AREA */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "35px 30px 20px",
              minHeight: "760px",
            }}
          >
            {/* MAIN IMAGE */}
            <div
              style={{
                width: "467px",
                height: "544px",
                border: "1px solid #777",
                background: "#F5F5F5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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

            {/* IMAGE COUNT */}
            <div
              style={{
                marginTop: "12px",
                fontFamily: "Edition Numerical Unlicensed2",
                fontSize: "18px",
                color: "#000",
              }}
            >
              {images.findIndex((img) => img === selectedImage) + 1}/
              {images.length}
            </div>

            {/* ACTIONS */}
            <div
              style={{
                position: "absolute",
                right: "35px",
                bottom: "138px",
                display: "flex",
                gap: "6px",
              }}
            >
              {/* DOWNLOAD */}
              <div
                onClick={() => {
                  const link = document.createElement("a");

                  link.href = selectedImage;

                  link.download = artwork.Title || "artwork";

                  document.body.appendChild(link);

                  link.click();

                  document.body.removeChild(link);
                }}
                style={{
                  width: "22px",
                  height: "22px",
                  background: "#000",
                  color: "#8B5CF6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "14px",
                  border: "1px solid #000",
                }}
              >
                ↓
              </div>

              {/* ZOOM */}
              <div
                onClick={() => window.open(selectedImage, "_blank")}
                style={{
                  width: "22px",
                  height: "22px",
                  background: "#000",
                  color: "#8B5CF6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "14px",
                  border: "1px solid #000",
                }}
              >
                ↗
              </div>
            </div>

            {/* THUMBNAILS */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "26px",
                width: "100%",
                padding: "0 28px",
                overflowX: "auto",
                boxSizing: "border-box",
              }}
            >
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setSelectedImage(img as string)}
                  style={{
                    width: "82px",
                    height: "82px",
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
          </div>
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

    fontFamily:
      '"Edition Numerical Unlicensed1"',

    fontSize: "22px",

    fontStyle: "normal",

    fontWeight: 400,

    lineHeight: "30.5px",

    textDecorationLine:
      "underline",

    textDecorationStyle:
      "solid",

    textDecorationSkipInk:
      "auto",

    textDecorationThickness:
      "auto",

    textUnderlineOffset:
      "auto",

    textUnderlinePosition:
      "from-font",

    textTransform:
      "uppercase",

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
