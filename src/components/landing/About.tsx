export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">
            Hakkımızda
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center font-semibold">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Takas Go, sürdürülebilirlik ve paylaşımı merkeze alan bir topluluk
              platformudur. Faydalı olanı değerlendir, ihtiyacını takasla,
              çevrene katkıda bulun.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Eşyalarınızı, hizmetlerinizi, yeteneklerinizi ve zamanınızı
              başkalarıyla takas ederek hem ekonomik hem de çevresel faydalar
              sağlayın.
            </p>
            <div className="flex justify-around pt-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">Güvenli Takas</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">Çevre Dostu</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Takas Go, sürdürülebilirlik ve paylaşımı merkeze alan bir topluluk
              platformudur. İkinci el ekonomisini destekleyerek tüketimi
              azaltmayı hedefler.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Binlerce kullanıcımızla birlikte, daha sürdürülebilir bir gelecek
              için adım atın. Her takas, hem cebinizi hem de gezegenimizi korur.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  1000+
                </div>
                <div className="text-sm text-gray-600">Aktif Kullanıcı</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  500+
                </div>
                <div className="text-sm text-gray-600">Başarılı Takas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
