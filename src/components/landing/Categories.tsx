import { FaLaptop } from "react-icons/fa";
import { FaTshirt } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa6";
import { GiBroadsword } from "react-icons/gi";
import { IoIosColorPalette } from "react-icons/io";
const categories = [
  {
    icon: <FaLaptop className="text-6xl text-orange-500" />,
    label: "Elektronik",
  },
  {
    icon: <FaTshirt className="text-6xl text-orange-500" />,
    label: "Kıyafet",
  },
  {
    icon: <FaBookOpen className="text-6xl text-orange-500" />,
    label: "Kitap",
  },
  {
    icon: <GiBroadsword className="text-6xl text-orange-500" />,
    label: "Hizmet",
  },
  {
    icon: <IoIosColorPalette className="text-6xl text-orange-500" />,
    label: "El Sanatları",
  },
];

export default function Categories() {
  return (
    <section id="categories" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-16 text-gray-800">
          Popüler Kategoriler
        </h2>
        <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
          {categories.map((category) => (
            <div
              key={category.label}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div
                className={`w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 group-hover:scale-110`}
              >
                <div>{category.icon}</div>
              </div>
              <p className="font-semibold text-gray-800 text-lg">
                {category.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
