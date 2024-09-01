import { useState, useEffect } from "react";
import { Spinner } from "../components/Spinner";

type FullScreenLoadingProps = {
  textDelayMs?: number;
};

export function FullScreenLoading({ textDelayMs }: FullScreenLoadingProps) {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (textDelayMs === undefined) return;

    const timer = setTimeout(() => {
      setShowText(true);
    }, textDelayMs);

    return () => clearTimeout(timer);
  }, [textDelayMs]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "10px",
        height: "80vh",
      }}
    >
      <Spinner />
      {showText && (
        <p style={{ marginTop: "10px" }}>너무 오래 지속되면 새로고침하세요</p>
      )}
    </div>
  );
}
