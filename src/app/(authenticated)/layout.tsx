import type { RootLayoutProps } from "@/types/app";

export default function AuthenticatedLayout({ children }: RootLayoutProps) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
