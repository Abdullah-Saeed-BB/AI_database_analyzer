"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Explore Data", href: "/explore-data" },
    { name: "AI Analyzer", href: "/ai-analyzer", icon: "robot" },
  ];

  return (
    <header className="bg-bg-light border-b border-(--color-border) shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl  px-6 h-20 flex items-center justify-between">
        
        <div className="flex items-center gap-12">
          {/* Logo Section */}
          <Link 
            href="/" 
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <Image 
              src="/logo.png" 
              alt="AI DB Analyzer Logo" 
              width={32} 
              height={32} 
              className="object-contain"
            />
            <span className="font-bold text-xl tracking-tight text-text-primary">
              AI DB Analyzer
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 text-sm font-semibold py-2.5 px-5 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-blue-100 text-blue-600" // Google-style light blue box
                      : "text-text-secondary hover:bg-gray-50 hover:text-text-primary"
                  }`}
                >
                  {link.icon === "robot" && (
<svg 
                      className="w-5 h-5" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="10" rx="2" />
                      <circle cx="12" cy="5" r="2" />
                      <path d="M12 7v4" />
                      <line x1="8" y1="16" x2="8" y2="16" />
                      <line x1="16" y1="16" x2="16" y2="16" />
                    </svg>
                  )}
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center">
           {/* Add user settings or profile icons here if needed */}
        </div>

      </div>
    </header>
  );
}