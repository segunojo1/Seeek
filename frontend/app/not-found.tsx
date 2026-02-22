"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1F1F1F] text-white font-sans">
      <h1 className="text-6xl font-bold text-[#E89E28] mb-4">404</h1>
      <p className="text-lg text-[#A3A3A3] mb-8">Page not found</p>
      <Link
        href="/"
        className="px-6 py-2 bg-[#E89E28] text-black rounded-lg font-medium hover:bg-[#d48d1f] transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
