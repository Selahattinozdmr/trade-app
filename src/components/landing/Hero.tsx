export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-orange-100 via-orange-50 to-orange-200 min-h-screen overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-32 h-32 bg-orange-300 rounded-full opacity-20"></div>
        <div className="absolute top-40 right-40 w-16 h-16 bg-orange-400 rounded-full opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-orange-200 rounded-full opacity-25"></div>
        {/* World map background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 800 400" fill="none">
            <path
              d="M200 150 Q250 120 300 150 Q350 180 400 150 Q450 120 500 150"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M150 200 Q200 170 250 200 Q300 230 350 200 Q400 170 450 200"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="250" cy="180" r="8" fill="currentColor" />
            <circle cx="350" cy="190" r="6" fill="currentColor" />
            <circle cx="450" cy="170" r="7" fill="currentColor" />
          </svg>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-32 flex flex-col-reverse lg:flex-row items-center justify-between min-h-screen">
        <div className="flex-1 lg:pr-12">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Her Şey
            <br />
            <span className="text-orange-500">Takaslanabilir!</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Eşyadan hizmete, yetenekten zamana…
            <br />
            yepyeni bir takas dünyasına hoş geldin!
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            Hemen Keşfet
          </button>
        </div>

        <div className="flex-1 flex justify-center lg:justify-end mb-16 lg:mb-0">
          <div className="relative">
            {/* Character illustrations */}
            <div className="flex items-center space-x-8">
              {/* Left character */}
              <div className="relative">
                <div className="w-32 h-40 bg-orange-500 rounded-t-full relative">
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-700 rounded-full"></div>
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-orange-400 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-6 bg-white rounded"></div>
                  </div>
                </div>
                <div className="w-32 h-24 bg-orange-600 rounded-b-lg"></div>
              </div>

              {/* Globe in the middle */}
              <div className="relative z-10">
                <div className="w-40 h-40 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-24 h-24 text-orange-600"
                      fill="currentColor"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M20 50 Q35 30 50 50 Q65 70 80 50"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M50 20 Q30 35 50 50 Q70 65 50 80"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <circle cx="35" cy="35" r="3" fill="currentColor" />
                      <circle cx="65" cy="35" r="2" fill="currentColor" />
                      <circle cx="35" cy="65" r="2" fill="currentColor" />
                      <circle cx="65" cy="65" r="3" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Right character */}
              <div className="relative">
                <div className="w-32 h-40 bg-orange-500 rounded-t-full relative">
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-700 rounded-full"></div>
                  <div className="absolute top-8 right-2 w-20 h-4 bg-orange-700 rounded-full transform rotate-12"></div>
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-orange-400 rounded-lg flex items-center justify-center">
                    <div className="w-2 h-8 bg-orange-700 rounded"></div>
                  </div>
                </div>
                <div className="w-32 h-24 bg-orange-600 rounded-b-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
