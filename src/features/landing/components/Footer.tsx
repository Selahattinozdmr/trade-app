import React from "react";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa6";
import { COMPANY_INFO } from "@/lib/constants";

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <Link
      href={href}
      className="text-base hover:text-orange-500 transition-colors"
    >
      {children}
    </Link>
  );
}

interface FooterSectionProps {
  children: React.ReactNode;
  className?: string;
}

function FooterSection({ children, className = "" }: FooterSectionProps) {
  return <div className={className}>{children}</div>;
}

export default function Footer() {
  const footerLinks = [
    { href: "/privacy", label: "Gizlilik" },
    { href: "/terms", label: "Kullanım Şartları" },
  ];

  return (
    <footer className="py-12 flex flex-col md:flex-row justify-around items-center border-t border-gray-200 gap-4 md:gap-0">
      <FooterSection className="flex flex-row gap-2 items-center">
        <FaInstagram
          className="text-3xl text-orange-500"
          aria-label="Instagram"
        />
        <p className="text-lg font-medium">
          © {COMPANY_INFO.year} {COMPANY_INFO.name}
        </p>
      </FooterSection>

      <FooterSection className="flex flex-row gap-4">
        {footerLinks.map((link) => (
          <FooterLink key={link.href} href={link.href}>
            {link.label}
          </FooterLink>
        ))}
      </FooterSection>

      <FooterSection>
        <span className="text-base text-gray-600">{COMPANY_INFO.email}</span>
      </FooterSection>
    </footer>
  );
}
