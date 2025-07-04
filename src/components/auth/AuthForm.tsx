"use client";

import { useState } from "react";
import { useSupabase } from "@/components/providers/SupabaseSessionProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AuthType = "sign-in" | "sign-up";

interface Props {
  type: AuthType;
}

export default function AuthForm({ type }: Props) {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validation for sign-up
    if (type === "sign-up") {
      if (password !== confirmPassword) {
        setError("Şifreler eşleşmiyor");
        setLoading(false);
        return;
      }

      if (!displayName.trim()) {
        setError("Görünür isim gereklidir");
        setLoading(false);
        return;
      }

      if (!phone.trim()) {
        setError("Telefon numarası gereklidir");
        setLoading(false);
        return;
      }

      // Phone validation (Turkish format)
      const phoneRegex = /^(\+90|0)?[1-9]\d{9}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
        setError("Geçerli bir telefon numarası girin");
        setLoading(false);
        return;
      }
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      setLoading(false);
      return;
    }

    try {
      if (type === "sign-in") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(getErrorMessage(error.message));
        } else if (data.user) {
          router.push("/home");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              display_name: displayName.trim(),
              phone: phone.trim(),
            },
          },
        });

        if (error) {
          setError(getErrorMessage(error.message));
        } else if (data.user) {
          // Redirect to email confirmation page
          router.push("/email-confirmation");
        }
      }
    } catch (err) {
      setError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(getErrorMessage(error.message));
      }
    } catch (err) {
      setError("Google ile giriş yaparken bir hata oluştu.");
      console.error("Google auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (message: string): string => {
    const errorMap: Record<string, string> = {
      "Invalid login credentials": "Geçersiz giriş bilgileri",
      "Email not confirmed": "E-posta adresinizi doğrulayın",
      "User already registered": "Bu e-posta adresi zaten kayıtlı",
      "Password should be at least 6 characters":
        "Şifre en az 6 karakter olmalıdır",
      "Signup requires a valid password": "Geçerli bir şifre gereklidir",
      "Unable to validate email address: invalid format":
        "Geçersiz e-posta formatı",
      "Email address not authorized": "E-posta adresi yetkili değil",
    };

    return errorMap[message] || message;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 mb-8"
          >
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Takas Go</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            {type === "sign-in" ? "Hesabınıza Giriş Yapın" : "Hesap Oluşturun"}
          </h2>
          <p className="mt-2 text-gray-600">
            {type === "sign-in"
              ? "Takas dünyasına geri dönün"
              : "Takas dünyasına katılın"}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                E-posta
              </label>
              <input
                id="email"
                type="email"
                placeholder="E-posta adresinizi girin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              />
            </div>

            {/* Display Name (Sign Up Only) */}
            {type === "sign-up" && (
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Görünür İsim
                </label>
                <input
                  id="displayName"
                  type="text"
                  placeholder="Görünür isminizi girin"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                />
              </div>
            )}

            {/* Phone Number (Sign Up Only) */}
            {type === "sign-up" && (
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Telefon Numarası
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="0505 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                />
              </div>
            )}

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Şifre
              </label>
              <input
                id="password"
                type="password"
                placeholder="Şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              />
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {type === "sign-up" && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Şifre Tekrarı
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Şifrenizi tekrar girin"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                />
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-600 text-sm">{message}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  İşleniyor...
                </span>
              ) : type === "sign-in" ? (
                "Giriş Yap"
              ) : (
                "Hesap Oluştur"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">veya</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center cursor-pointer"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285f4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34a853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#fbbc05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#ea4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {type === "sign-in"
              ? "Google ile Giriş Yap"
              : "Google ile Kayıt Ol"}
          </button>

          {/* Toggle Auth Type */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {type === "sign-in"
                ? "Hesabınız yok mu? "
                : "Zaten hesabınız var mı? "}
              <Link
                href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                className="text-orange-600 hover:text-orange-700 font-semibold"
              >
                {type === "sign-in" ? "Kayıt Ol" : "Giriş Yap"}
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Devam ederek Hizmet Şartlarımızı ve Gizlilik Politikamızı kabul
            etmiş olursunuz
          </p>
        </div>
      </div>
    </div>
  );
}
