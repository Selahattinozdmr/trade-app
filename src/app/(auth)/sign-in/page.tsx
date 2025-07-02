import AuthForm from "@/components/auth/AuthForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş Yap - Takas App",
  description: "Takas App hesabınıza giriş yapın",
};

export default function SignInPage() {
  return <AuthForm type="sign-in" />;
}
