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

// Categories for filtering
export const CATEGORIES = [
  { value: "elektronik", label: "Elektronik" },
  { value: "kiyafet", label: "Kıyafet" },
  { value: "kitap", label: "Kitap" },
  { value: "hizmet", label: "Hizmet" },
  { value: "el-sanatlari", label: "El Sanatları" },
  { value: "spor", label: "Spor" },
  { value: "muzik", label: "Müzik" },
  { value: "ev-esyalari", label: "Ev Eşyaları" },
] as const;

// Popular cities for filtering
export const CITIES = [
  { value: "istanbul", label: "İstanbul" },
  { value: "ankara", label: "Ankara" },
  { value: "izmir", label: "İzmir" },
  { value: "bursa", label: "Bursa" },
  { value: "antalya", label: "Antalya" },
  { value: "adana", label: "Adana" },
  { value: "konya", label: "Konya" },
  { value: "gaziantep", label: "Gaziantep" },
] as const;

export const COMPANY_INFO = {
  name: "Takas Go",
  email: "info@takasgo.com",
  year: new Date().getFullYear(),
} as const;
