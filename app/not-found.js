import Link from "next/link";

export default function NotFound() {
  return (
    <section
      className="container"
      style={{ padding: "60px 0 80px", textAlign: "center" }}
    >
      <h1
        style={{
          fontWeight: 800,
          fontSize: "clamp(26px,5vw,44px)",
          margin: 0,
        }}
      >
        Oops—page not found
      </h1>
      <p style={{ color: "#6b7280", marginTop: 8 }}>
        The page you’re looking for doesn’t exist or moved.
      </p>
      <div style={{ marginTop: 16 }}>
        <Link href="/" className="btn btn-primary">
          Back Home
        </Link>
      </div>
    </section>
  );
}
