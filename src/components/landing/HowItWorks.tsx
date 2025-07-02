import { FaRegUser } from "react-icons/fa";
import { FaHandshake } from "react-icons/fa";
const steps = [
  {
    icon: <FaRegUser className="text-6xl text-orange-500" />,
    label: "Üye Ol",
    background: "bg-orange-100",
  },
  {
    icon: (
      <svg
        className="w-16 h-16 text-orange-500"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
      </svg>
    ),
    label: "Takas İlanı Paylaş",
    background: "bg-orange-100",
  },
  {
    icon: <FaHandshake className="text-6xl text-orange-500" />,
    label: "Anlaş ve Takasını Tamamla",
    background: "bg-orange-100",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-16 text-gray-800">
          Nasıl Çalışır?
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 lg:gap-40">
          {steps.map((step, index) => (
            <div
              key={step.label}
              className="flex flex-col items-center relative"
            >
              <div
                className={`w-24 h-24 rounded-full ${step.background} flex items-center justify-center mb-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
              >
                {step.icon}
              </div>
              <p className="text-lg font-semibold text-gray-800 max-w-36 leading-tight">
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
