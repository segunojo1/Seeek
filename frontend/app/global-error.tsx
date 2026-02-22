"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "sans-serif",
            background: "#1F1F1F",
            color: "#fff",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Something went wrong
          </h2>
          <button
            onClick={() => reset()}
            style={{
              padding: "0.5rem 1.5rem",
              borderRadius: "0.5rem",
              background: "#E89E28",
              color: "#000",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
