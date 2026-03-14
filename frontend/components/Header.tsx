"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User2Icon, Loader2, Mail, Shield, User as UserIcon, LogOut } from "lucide-react";
import { authFetchClient } from "@/lib/api/authFetchClient";
import User from "@/types/user";

export function Header() {
  const pathname = usePathname();
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch user data on mount to handle role-based UI
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await authFetchClient("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Failed to fetch user data on mount", error);
      }
    }
    fetchUser();
  }, []);

  const handleProfileClick = async () => {
    if (!showProfile) {
      setShowProfile(true);
      // Only fetch if we don't have data already
      if (!userData) {
        setIsLoading(true);
        try {
          const res = await authFetchClient("/api/users/me");
          if (res.ok) {
            const data = await res.json();
            setUserData(data);
          }
        } catch (error) {
          console.error("Failed to fetch user data", error);
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      setShowProfile(false);
    }
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Explore Data", href: "/explore-data" },
    { name: "AI Analyzer", href: "/ai-analyzer", icon: "robot" },
    ...(userData?.role === "admin" ? [{ name: "Users", href: "/users" }] : []),
  ];

  return (
    <header className="bg-bg-light border-b border-(--color-border) shadow-sm sticky top-0 z-50">
      <div className="px-6 h-20 flex items-center justify-between">
        
        <div className="flex items-center gap-12">
          {/* Logo Section */}
          <Link 
            href="/" 
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <Image 
              src="/logo_simple.png" 
              alt="AI DB Analyzer Logo" 
              width={60} 
              height={60} 
              className="object-contain"
            />
            <span className="font-bold text-xl tracking-tight text-text-primary">
              AI Database Analyzer
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
                      className="w-6 h-6" 
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

        <div className="flex items-center pr-6 relative" ref={dropdownRef}>
            <button 
              onClick={handleProfileClick}
              className={`shadow-sm border p-3 rounded-full transition-all duration-300 cursor-pointer outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                showProfile 
                  ? "bg-blue-600 border-blue-600 text-white scale-110 shadow-lg shadow-blue-200" 
                  : "bg-gray-200 border-gray-200 text-text-secondary hover:bg-blue-100 hover:border-blue-100 hover:text-text-active"
              }`}
            >
              <User2Icon size={26}/>
            </button>

            {/* Infotip Box / Popover */}
            <div className={`absolute top-full right-6 mt-4 w-80 bg-white/95 backdrop-blur-xl border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden z-50 transition-all duration-300 origin-top-right ${
              showProfile 
                ? "opacity-100 scale-100 translate-y-0" 
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}>
                <div className="p-6">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md ring-4 ring-white">
                      {userData ? (
                        <span className="text-xl font-bold tracking-tight">
                          {userData.first_name[0]}{userData.last_name[0]}
                        </span>
                      ) : (
                        <UserIcon size={28} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-text-primary text-lg truncate leading-tight">
                        {isLoading ? (
                          <div className="h-5 w-32 bg-gray-200 animate-pulse rounded" />
                        ) : userData ? (
                          `${userData.first_name} ${userData.last_name}`
                        ) : (
                          "Profile"
                        )}
                      </h3>
                      <p className="text-sm text-text-secondary font-medium">
                        {isLoading ? (
                          <span className="h-4 w-24 bg-gray-100 animate-pulse rounded mt-1" />
                        ) : userData ? (
                          userData.role
                        ) : (
                          "Loading details..."
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Profile Content */}
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                      <span className="text-sm font-medium text-text-secondary animate-pulse">Syncing profile data...</span>
                    </div>
                  ) : userData ? (
                    <div className="space-y-4">
                      <div className="group flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-transparent transition-all hover:bg-white hover:border-gray-200 hover:shadow-sm">
                        <div className="p-2.5 bg-white rounded-lg shadow-sm group-hover:bg-blue-50 transition-colors">
                          <Mail size={18} className="text-blue-500" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] uppercase tracking-widest text-text-secondary font-bold opacity-70">Email Address</span>
                          <span className="text-sm font-semibold text-text-primary truncate">{userData.email}</span>
                        </div>
                      </div>

                      <div className="group flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-transparent transition-all hover:bg-white hover:border-gray-200 hover:shadow-sm">
                        <div className="p-2.5 bg-white rounded-lg shadow-sm group-hover:bg-indigo-50 transition-colors">
                          <Shield size={18} className="text-indigo-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-widest text-text-secondary font-bold opacity-70">Account Role</span>
                          <span className="text-sm font-semibold text-text-primary capitalize">{userData.role || "Member"}</span>
                        </div>
                      </div>

                      <div className="pt-4 mt-2 border-t border-gray-100">
                         <button 
                           onClick={() => {
                             // Simple logout: clear cookie and redirect
                             document.cookie = "jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                             window.location.href = "/login";
                           }}
                           className="w-full py-3 px-4 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 active:bg-red-100 transition-all flex items-center justify-center gap-2"
                         >
                           <LogOut size={18} />
                           Sign Out
                         </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 px-4 bg-red-50 rounded-2xl border border-red-100">
                       <p className="text-sm text-red-600 font-semibold mb-3">Unable to load profile</p>
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setUserData(null);
                           handleProfileClick();
                         }}
                         className="text-xs font-bold text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                       >
                         Retry Sync
                       </button>
                    </div>
                  )}
                </div>
            </div>
        </div>

      </div>
    </header>
  );
}
