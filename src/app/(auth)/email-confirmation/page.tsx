import Link from "next/link";

export default function EmailConfirmationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          E-posta Doğrulama Gerekli
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Hesabınızı etkinleştirmek için e-posta adresinize gönderilen doğrulama
          linkine tıklayın.
        </p>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-2">
            Yapmanız gerekenler:
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• E-posta kutunuzu kontrol edin</li>
            <li>• Spam klasörünü de kontrol etmeyi unutmayın</li>
            <li>• Doğrulama linkine tıklayın</li>
            <li>• Ardından giriş yapabilirsiniz</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/sign-in"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 inline-block"
          >
            Giriş Sayfasına Dön
          </Link>

          <Link
            href="/"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 inline-block"
          >
            Ana Sayfaya Git
          </Link>
        </div>

        {/* Help */}
        <p className="text-sm text-gray-500 mt-6">
          E-posta almadınız mı? Spam klasörünü kontrol edin veya{" "}
          <Link
            href="/sign-up"
            className="text-orange-600 hover:text-orange-700"
          >
            tekrar deneyin
          </Link>
        </p>
      </div>
    </div>
  );
}
