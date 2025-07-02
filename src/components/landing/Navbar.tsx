"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-transparent ">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between">
        <Link href={"/"} className="text-orange-500 text-4xl font-bold">
          Takas Go
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-lg  font-medium items-center">
          <Link
            href="#about"
            className="text-gray-700 hover:text-orange-500 transition-colors"
          >
            Hakkımızda
          </Link>
          <Link
            href="#categories"
            className="text-gray-700 hover:text-orange-500 transition-colors"
          >
            Kategoriler
          </Link>
          <Link
            href="#how"
            className="text-gray-700 hover:text-orange-500 transition-colors"
          >
            Nasıl Çalışır?
          </Link>
          <Link
            href="/login"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Giriş / Üye Ol
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="text-orange-500 text-2xl font-bold">Takas Go</div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-6 space-y-6">
          <Link
            href="#about"
            className="block text-lg text-gray-700 hover:text-orange-500 transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Hakkımızda
          </Link>
          <Link
            href="#categories"
            className="block text-lg text-gray-700 hover:text-orange-500 transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Kategoriler
          </Link>
          <Link
            href="#how"
            className="block text-lg text-gray-700 hover:text-orange-500 transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Nasıl Çalışır?
          </Link>
          <Link
            href="/login"
            className="block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors text-center font-medium mt-8"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Giriş / Üye Ol
          </Link>
        </nav>
      </div>
    </header>
  );
}
