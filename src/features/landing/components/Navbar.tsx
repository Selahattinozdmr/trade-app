"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useMobileMenu } from "@/hooks/useMobileMenu";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useSupabase } from "@/components/providers/SupabaseSessionProvider";
import { NAVIGATION_ITEMS, COMPANY_INFO } from "@/lib/constants";
import { cn } from "@/utils/common";
import type { NavigationItem } from "@/types";
import type { User } from "@supabase/supabase-js";

interface NavLinkProps {
  item: NavigationItem;
  onClick?: () => void;
  className?: string;
}

function NavLink({ item, onClick, className }: NavLinkProps) {
  const linkProps = {
    href: item.href,
    className: cn(
      "text-gray-700 hover:text-orange-500 transition-colors",
      className
    ),
    ...(onClick && { onClick }),
  };

  return <Link {...linkProps}>{item.label}</Link>;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

function MobileMenu({ isOpen, onClose, user }: MobileMenuProps) {
  return (
    <>
      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Navigation Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="text-orange-500 text-2xl font-bold">
            {COMPANY_INFO.name}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
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
          {NAVIGATION_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              onClick={onClose}
              className="block text-lg py-2"
            />
          ))}
          {user ? (
            <Link
              href="/home"
              className="block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors text-center font-medium mt-8"
              onClick={onClose}
            >
              Ana Sayfa
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors text-center font-medium mt-8"
              onClick={onClose}
            >
              Giriş / Üye Ol
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}

export default function Navbar() {
  const mobileMenu = useMobileMenu();
  const { supabase } = useSupabase();
  const [user, setUser] = useState<User | null>(null);

  // Check for authenticated user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Lock scroll when mobile menu is open
  useScrollLock(mobileMenu.isOpen);

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between">
        <Link href="/" className="text-orange-500 text-4xl font-bold">
          {COMPANY_INFO.name}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-lg font-medium items-center">
          {NAVIGATION_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
          {user ? (
            <Link
              href="/home"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Ana Sayfa
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Giriş / Üye Ol
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={mobileMenu.toggle}
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenu.isOpen ? (
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

      <MobileMenu
        isOpen={mobileMenu.isOpen}
        onClose={mobileMenu.close}
        user={user}
      />
    </header>
  );
}
