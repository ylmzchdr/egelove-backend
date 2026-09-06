"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const saveUser = async () => {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");

      if (!accessToken) {
        router.replace("/");
        return;
      }

      localStorage.setItem("accessToken", accessToken);

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      try {
        const user = await api.users.me();

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        window.dispatchEvent(new Event("auth-changed"));

        console.log("Google kullanıcı kaydedildi:", user);

     } catch (error) {
  console.error(
    "GOOGLE ME HATASI:",
    error
  );
}

      router.replace("/dashboard");
    };

    saveUser();

  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-[#08324a] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          Giriş tamamlanıyor...
        </h1>
        <p className="mt-2 text-white/70">
          Lütfen bekleyin.
        </p>
      </div>
    </main>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#08324a] text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              Giriş tamamlanıyor...
            </h1>
            <p className="mt-2 text-white/70">
              Lütfen bekleyin.
            </p>
          </div>
        </main>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}