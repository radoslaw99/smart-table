import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        <header className="navbar">
          <div className="nav-inner">
            <Link href="/" className="brand">
              <span
                style={{
                  display: "inline-flex",
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,.07)",
                  border: "1px solid rgba(255,255,255,.10)",
                }}
              >
                ST
              </span>
              <span>Smart Table</span>
              <span className="badge">demo</span>
            </Link>

            <nav className="nav-links">
              <Link className="link" href="/components">
                Table
              </Link>
              <Link className="link" href="/about">
                About
              </Link>
              <Link className="btn btn-primary" href="/login">
                Sign in
              </Link>
            </nav>
          </div>
        </header>

        <main className="container">{children}</main>

        <footer className="footer">
          Smart Table • built with Next.js
        </footer>
      </body>
    </html>
  );
}
