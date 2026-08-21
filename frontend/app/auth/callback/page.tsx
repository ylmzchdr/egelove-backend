"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleLogin = async () => {
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
        const res = await fetch(
          "https://egelove-backend.onrender.com/users/me",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (res.ok) {
          const user = await res.json();

          console.log("GOOGLE USER:", user);

          localStorage.setItem(
            "user",
            JSON.stringify(user)
          );
        } else {
          console.error("Kullanıcı bilgisi alınamadı");
        }

      } catch (error) {
        console.error("USER FETCH HATA:", error);
      }


      window.dispatchEvent(
        new Event("auth-changed")
      );

      router.replace("/dashboard");
    };


    handleLogin();

  }, [searchParams, router]);


  return (
    <div
      style={{
        padding: "50px",
        textAlign: "center",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Giriş işlemi onaylanıyor...</h2>
      <p>
        Lütfen bekleyin, panele yönlendiriliyorsunuz.
      </p>
    </div>
  );
}


export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            color:"#fff",
            textAlign:"center",
            padding:"50px"
          }}
        >
          Yükleniyor...
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}