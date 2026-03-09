"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: null },
  { href: "/explore", label: "Explore Data", icon: null },
  {
    href: "/ai-analyzer",
    label: "AI Analyzer",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        style={{ width: "15px", height: "15px", display: "inline" }}
      >
        <path
          fillRule="evenodd"
          d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      style={{
        backgroundColor: "#F8F8F8",
        borderBottom: "1px solid #E6EAED",
        height: "64px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        padding: "0 32px",
        gap: "40px",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            backgroundColor: "#2772CE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="white"
            style={{ width: "18px", height: "18px" }}
          >
            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
          </svg>
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: "15px",
            color: "#1F2324",
            letterSpacing: "-0.02em",
          }}
        >
          DB Analyzer
        </span>
      </div>

      {/* Nav Links */}
      <nav style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}>
        {navLinks.map(({ href, label, icon }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#2772CE" : "#5A5E63",
                backgroundColor: isActive ? "#EFF4FC" : "transparent",
                textDecoration: "none",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#F0F2F4";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#1F2324";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#5A5E63";
                }
              }}
            >
              {label}
              {icon && (
                <span style={{ color: isActive ? "#2772CE" : "#F59E0B" }}>{icon}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
