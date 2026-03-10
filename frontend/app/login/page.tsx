import React from "react";
import LoginForm from "@/components/login/LoginForm";
import { Database } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | AI Database Analyzer",
  description: "Securely sign in to your AI Database Analyzer account.",
};

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-6 bg-bg-light overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-10 blur-sm scale-105">
        <img 
          src="/login_bg_abstract_1773107026083.png" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-text-active/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-text-active/10 rounded-full blur-[150px]" />
      
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: "radial-gradient(#2772CE 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="p-3 bg-text-active rounded-2xl shadow-xl shadow-text-active/20">
            <Database className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-black text-text-primary tracking-tight">AI Analyzer</span>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Footer info */}
        <p className="mt-12 text-sm text-text-secondary/60 animate-in fade-in duration-1000 delay-500">
          &copy; {new Date().getFullYear()} AI Database Analyzer. All rights reserved.
        </p>
      </div>
    </main>
  );
}
