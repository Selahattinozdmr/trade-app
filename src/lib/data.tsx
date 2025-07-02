import {
  FaLaptop,
  FaTshirt,
  FaBookOpen,
  FaRegUser,
  FaHandshake,
} from "react-icons/fa";
import { GiBroadsword } from "react-icons/gi";
import { IoIosColorPalette } from "react-icons/io";
import type { Category, Step } from "@/types";

export const getCategories = (): Category[] => [
  {
    id: "electronics",
    icon: <FaLaptop className="text-6xl text-orange-500" />,
    label: "Elektronik",
    slug: "elektronik",
  },
  {
    id: "clothing",
    icon: <FaTshirt className="text-6xl text-orange-500" />,
    label: "Kıyafet",
    slug: "kiyafet",
  },
  {
    id: "books",
    icon: <FaBookOpen className="text-6xl text-orange-500" />,
    label: "Kitap",
    slug: "kitap",
  },
  {
    id: "services",
    icon: <GiBroadsword className="text-6xl text-orange-500" />,
    label: "Hizmet",
    slug: "hizmet",
  },
  {
    id: "crafts",
    icon: <IoIosColorPalette className="text-6xl text-orange-500" />,
    label: "El Sanatları",
    slug: "el-sanatlari",
  },
];

export const getHowItWorksSteps = (): Step[] => [
  {
    id: "register",
    icon: <FaRegUser className="text-6xl text-orange-500" />,
    label: "Üye Ol",
    background: "bg-orange-100",
  },
  {
    id: "create-listing",
    icon: (
      <svg
        className="w-16 h-16 text-orange-500"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
      </svg>
    ),
    label: "Takas İlanı Paylaş",
    background: "bg-orange-100",
  },
  {
    id: "complete-trade",
    icon: <FaHandshake className="text-6xl text-orange-500" />,
    label: "Anlaş ve Takasını Tamamla",
    background: "bg-orange-100",
  },
];
