import type { NavigationItem, Statistic } from "@/types";

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    href: "#about",
    label: "Hakkımızda",
  },
  {
    href: "#categories",
    label: "Kategoriler",
  },
  {
    href: "#how",
    label: "Nasıl Çalışır?",
  },
] as const;

export const STATISTICS: Statistic[] = [
  {
    id: "active-users",
    value: "1000+",
    label: "Aktif Kullanıcı",
  },
  {
    id: "successful-trades",
    value: "500+",
    label: "Başarılı Takas",
  },
] as const;

export const COMPANY_INFO = {
  name: "Takas Go",
  email: "info@takasgo.com",
  year: new Date().getFullYear(),
} as const;
