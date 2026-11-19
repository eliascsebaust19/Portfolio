import React from "react";

export type TypographyProps = {
  opacity: number;
  tracking: number;
  y: number;
  blur: number;
  shine: number;
  accent: number;
  top: number;
};

/** ELIAS AHMAD in metallic silver with a tracking-in reveal, plus a small crimson light accent. */
export const Typography: React.FC<TypographyProps> = ({
  opacity,
  tracking,
  y,
  blur,
  shine,
  accent,
  top,
}) => (
  <>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        textAlign: "center",
        fontFamily: "Montserrat, 'Plus Jakarta Sans', system-ui, sans-serif",
        fontWeight: 500,
        fontSize: 42,
        letterSpacing: `${tracking}em`,
        paddingLeft: `${tracking}em`,
        opacity,
        transform: `translateY(${y}px)`,
        filter: `blur(${blur}px)`,
        backgroundImage:
          "linear-gradient(100deg, #6c7077 0%, #eef1f5 22%, #9aa0a8 38%, #f6f8fb 52%, #858b93 68%, #dfe3e8 84%, #6c7077 100%)",
        backgroundSize: "300% 100%",
        backgroundPosition: `${shine}% 0`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
        whiteSpace: "nowrap",
      }}
    >
      ELIAS AHMAD
    </div>
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: top + 78,
        width: 150,
        height: 2,
        marginLeft: -75,
        transform: `scaleX(${accent})`,
        opacity: accent,
        background:
          "linear-gradient(90deg, rgba(155,16,32,0) 0%, #8f0f1f 25%, #c4162a 50%, #8f0f1f 75%, rgba(155,16,32,0) 100%)",
        boxShadow: `0 0 14px rgba(160,14,30,${0.45 * accent})`,
      }}
    />
  </>
);
