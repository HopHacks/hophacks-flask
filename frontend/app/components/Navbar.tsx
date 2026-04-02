"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-300 z-50 py-4 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Hamburger Menu - Shown left on mobile */}
        <button 
          className="md:hidden flex flex-col space-y-1.5 focus:outline-none"
          onClick={() => setIsOpen(true)}
        >
          <div className="w-6 h-0.5 bg-black"></div>
          <div className="w-6 h-0.5 bg-black"></div>
          <div className="w-6 h-0.5 bg-black"></div>
        </button>

        {/* Logo - Hidden on mobile */}
        <div className="hidden md:flex w-16 h-8 bg-gray-200 border border-gray-400 items-center justify-center">
          <span className="text-gray-500 text-xs">Logo</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="#about" className="text-black text-sm font-medium">
            About
          </Link>
          <Link href="#tracks" className="text-black text-sm font-medium">
            Tracks
          </Link>
          <Link href="#sponsors" className="text-black text-sm font-medium">
            Sponsors
          </Link>
          <Link href="#faq" className="text-black text-sm font-medium">
            FAQ
          </Link>
        </div>
      </div>

      {/* Mobile Side Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 transition-opacity md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Mobile Side Menu Slider */}
      <div className={`fixed top-0 left-0 w-64 h-full bg-white border-r border-gray-300 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col p-6 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-end mb-8">
          <button onClick={() => setIsOpen(false)} className="text-black text-3xl leading-none font-medium focus:outline-none">
            &times;
          </button>
        </div>
        <div className="flex flex-col space-y-6">
          <Link href="#about" onClick={() => setIsOpen(false)} className="text-black text-xl font-bold border-b border-gray-100 pb-2">About</Link>
          <Link href="#tracks" onClick={() => setIsOpen(false)} className="text-black text-xl font-bold border-b border-gray-100 pb-2">Tracks</Link>
          <Link href="#sponsors" onClick={() => setIsOpen(false)} className="text-black text-xl font-bold border-b border-gray-100 pb-2">Sponsors</Link>
          <Link href="#faq" onClick={() => setIsOpen(false)} className="text-black text-xl font-bold border-b border-gray-100 pb-2">FAQ</Link>
        </div>
      </div>
    </nav>
  );
}
