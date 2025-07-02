import AuthForm from "@/components/auth/AuthForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kayıt Ol - Takas App",
  description: "Takas App hesabınızı oluşturun",
};

export default function SignUpPage() {
  return <AuthForm type="sign-up" />;
}
