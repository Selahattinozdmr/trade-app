"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useSupabase } from "@/components/providers/SupabaseSessionProvider";
import { useRouter } from "next/navigation";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export function SettingsModal({
  isOpen,
  onClose,
  userEmail,
}: SettingsModalProps) {
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");

  // Form states
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Message states
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  // Clear form states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSuccessMessage("");
      setErrorMessage("");
      setShowEmailForm(false);
      setShowPasswordForm(false);
      setShowDeleteConfirm(false);
      setNewEmail("");
      setNewPassword("");
      setConfirmPassword("");
      setDeleteEmail("");
    }
  }, [isOpen]);

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [successMessage, errorMessage]);

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  // Email change functionality
  const handleEmailChange = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      setErrorMessage("Geçerli bir e-posta adresi giriniz");
      return;
    }

    if (newEmail === userEmail) {
      setErrorMessage("Yeni e-posta adresi mevcut adresinizle aynı olamaz");
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      // First check if we have a valid session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Oturum bulunamadı. Lütfen tekrar giriş yapın.");
      }

      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) throw error;

      setSuccessMessage(
        "E-posta güncelleme isteği gönderildi. Lütfen yeni e-posta adresinizi kontrol edin ve onaylayın."
      );
      setNewEmail("");
      setShowEmailForm(false);
    } catch (error: unknown) {
      console.error("Email update error:", error);
      if (error instanceof Error && error.message?.includes("session")) {
        setErrorMessage("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
      } else {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "E-posta güncellenirken hata oluştu"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Password change functionality
  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage("Yeni şifre en az 6 karakter olmalıdır");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Şifreler eşleşmiyor");
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      // Check if we have a valid session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Oturum bulunamadı. Lütfen tekrar giriş yapın.");
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setSuccessMessage("Şifre başarıyla güncellendi");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (error: unknown) {
      console.error("Password update error:", error);
      if (error instanceof Error && error.message?.includes("session")) {
        setErrorMessage("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
      } else {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Şifre güncellenirken hata oluştu"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Notification settings
  const handleEmailNotificationToggle = async () => {
    setIsLoading(true);
    clearMessages();

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          email_notifications: !emailNotifications,
        },
      });

      if (error) throw error;

      setEmailNotifications(!emailNotifications);
      setSuccessMessage(
        `E-posta bildirimleri ${!emailNotifications ? "açıldı" : "kapatıldı"}`
      );
    } catch (error: unknown) {
      console.error("Notification update error:", error);
      setErrorMessage("Bildirim ayarları güncellenirken hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  // Data export functionality
  const handleDataExport = async () => {
    setIsLoading(true);
    clearMessages();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Kullanıcı bulunamadı");

      // Get user's items
      const { data: items, error: itemsError } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user.id);

      if (itemsError) {
        console.error("Items fetch error:", itemsError);
      }

      // Prepare export data
      const exportData = {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          email_confirmed_at: user.email_confirmed_at,
          user_metadata: user.user_metadata,
        },
        items: items || [],
        export_date: new Date().toISOString(),
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user-data-${user.id}-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSuccessMessage("Veriler başarıyla indirildi");
    } catch (error: unknown) {
      console.error("Data export error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Veri indirme hatası"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out functionality
  const handleSignOut = async () => {
    setIsLoading(true);
    clearMessages();

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      router.push("/");
      onClose();
    } catch (error: unknown) {
      console.error("Sign out error:", error);
      setErrorMessage("Oturum kapatılırken hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  // Account deletion functionality
  const handleDeleteAccount = async () => {
    if (deleteEmail !== userEmail) {
      setErrorMessage("E-posta adresi eşleşmiyor");
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      // Note: Account deletion should be handled server-side for security
      setErrorMessage(
        "Hesap silme özelliği henüz aktif değil. Destek ekibiyle iletişime geçin."
      );
    } catch (error: unknown) {
      console.error("Delete account error:", error);
      setErrorMessage("Hesap silinirken hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ayarlar" size="lg">
      <div className="p-6 space-y-6">
        {/* Message Display */}
        {(successMessage || errorMessage) && (
          <div
            className={`p-4 rounded-lg ${
              successMessage
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm">{successMessage || errorMessage}</span>
              <button
                onClick={clearMessages}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Account Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Hesap Ayarları
          </h3>
          <div className="space-y-3">
            {/* Email Change */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-gray-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.92a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      E-posta Değiştir
                    </h4>
                    <p className="text-sm text-gray-500">Mevcut: {userEmail}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowEmailForm(!showEmailForm)}
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  {showEmailForm ? "İptal" : "Değiştir"}
                </Button>
              </div>

              {showEmailForm && (
                <div className="mt-4 space-y-3">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Yeni e-posta adresi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Button
                    onClick={handleEmailChange}
                    disabled={isLoading || !newEmail}
                    className="cursor-pointer"
                  >
                    {isLoading ? "Güncelleniyor..." : "E-posta Güncelle"}
                  </Button>
                </div>
              )}
            </div>

            {/* Password Change */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-gray-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Şifre Değiştir
                    </h4>
                    <p className="text-sm text-gray-500">
                      Hesabınızın güvenliği için şifrenizi güncelleyin
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  {showPasswordForm ? "İptal" : "Değiştir"}
                </Button>
              </div>

              {showPasswordForm && (
                <div className="mt-4 space-y-3">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Yeni şifre (en az 6 karakter)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Yeni şifre tekrar"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Button
                    onClick={handlePasswordChange}
                    disabled={isLoading || !newPassword || !confirmPassword}
                    className="cursor-pointer"
                  >
                    {isLoading ? "Güncelleniyor..." : "Şifre Güncelle"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Bildirim Ayarları
          </h3>
          <div className="space-y-3">
            {/* Email Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-gray-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.92a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    E-posta Bildirimleri
                  </h4>
                  <p className="text-sm text-gray-500">
                    Yeni takas teklifleri için bildirim alın
                  </p>
                </div>
              </div>
              <button
                onClick={handleEmailNotificationToggle}
                disabled={isLoading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer ${
                  emailNotifications ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Gizlilik</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-gray-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Veri İndirme
                  </h4>
                  <p className="text-sm text-gray-500">
                    Hesabınızla ilgili tüm verileri indirin
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDataExport}
                disabled={isLoading}
                className="cursor-pointer"
              >
                {isLoading ? "İndiriliyor..." : "İndir"}
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-red-900 mb-4">
            Tehlikeli Alan
          </h3>
          <div className="space-y-3">
            {/* Sign Out */}
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-3">
                <div className="text-red-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-900">
                    Oturumu Kapat
                  </h4>
                  <p className="text-sm text-red-700">
                    Tüm cihazlardan çıkış yapın
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSignOut}
                disabled={isLoading}
                className="border-red-300 text-red-700 hover:bg-red-100 cursor-pointer"
              >
                {isLoading ? "Çıkış..." : "Çıkış Yap"}
              </Button>
            </div>

            {/* Delete Account */}
            {!showDeleteConfirm ? (
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-3">
                  <div className="text-red-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-red-900">
                      Hesabı Sil
                    </h4>
                    <p className="text-sm text-red-700">
                      Hesabınızı kalıcı olarak silin
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="border-red-300 text-red-700 hover:bg-red-100 cursor-pointer"
                >
                  Hesabı Sil
                </Button>
              </div>
            ) : (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-red-900 mb-2">
                    Hesap Silme Onayı
                  </h4>
                  <p className="text-sm text-red-700 mb-3">
                    Bu işlem geri alınamaz. Devam etmek için e-posta adresinizi
                    yazın:
                  </p>
                  <input
                    type="email"
                    value={deleteEmail}
                    onChange={(e) => setDeleteEmail(e.target.value)}
                    placeholder={userEmail}
                    className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteEmail("");
                    }}
                    disabled={isLoading}
                    className="flex-1 cursor-pointer"
                  >
                    İptal
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleDeleteAccount}
                    disabled={isLoading || deleteEmail !== userEmail}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  >
                    {isLoading ? "Siliniyor..." : "Hesabı Sil"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
