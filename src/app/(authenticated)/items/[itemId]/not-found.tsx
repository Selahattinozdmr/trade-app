import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* 404 Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-5.657-2.343l-1.414 1.414L3.515 17.657A9.956 9.956 0 002 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 2.042-.612 3.94-1.657 5.515l-1.414-1.414z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            İlan Bulunamadı
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-8">
            Aradığınız ilan bulunamadı. İlan silinmiş olabilir veya yanlış bir
            bağlantıya tıklamış olabilirsiniz.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/home"
              className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Ana Sayfaya Dön
            </Link>

            <Link
              href="/items/my"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              İlanlarım
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
