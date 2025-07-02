import Link from "next/link";
import { FaInstagram } from "react-icons/fa6";
export default function Footer() {
  return (
    <footer className="py-12 flex flex-col md:flex-row justify-around items-center border-t border-gray-200 gap-4 md:gap-0">
      <div className="flex flex-row gap-2 items-center">
        <FaInstagram className="text-3xl text-orange-500" />
        <p className="text-lg font-medium">© 2025 Takas Go</p>
      </div>
      <div className="flex flex-row gap-4">
        <Link
          href={""}
          className="text-base hover:text-orange-500 transition-colors"
        >
          Gizlilik
        </Link>
        <Link
          href={""}
          className="text-base hover:text-orange-500 transition-colors"
        >
          Kullanım Şartları
        </Link>
      </div>
      <div className="">
        <span className="text-base text-gray-600">info@takasgo.com</span>
      </div>
    </footer>
  );
}
