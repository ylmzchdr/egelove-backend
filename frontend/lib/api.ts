const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://egelove-backend.onrender.com";

console.log("API_URL =", API_URL);

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token")
  );
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("refreshToken") ||
    localStorage.getItem("refresh_token")
  );
}

function clearTokens() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("accessToken");
  localStorage.removeItem("access_token");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("refresh_token");
}

/*
 * Aynı anda birden fazla istek 401 alırsa
 * sadece BİR refresh isteği gönderilir.
 *
 * Bu özellikle Mesajlar + Beğeniler gibi sayfalarda
 * refresh token yarışını engeller.
 */
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    console.log("🟡 Refresh token bulunamadı.");
    return null;
  }

  if (refreshPromise) {
    console.log("🔵 Devam eden refresh işlemi bekleniyor...");
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      console.log("🟠 ACCESS TOKEN YENİLENİYOR...");

      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          refreshToken,
        }),
      });

      if (!res.ok) {
        console.log("🔴 REFRESH BAŞARISIZ:", res.status);

        clearTokens();
        return null;
      }

      const data = await res.json();

      const newAccessToken =
        data?.accessToken ||
        data?.access_token ||
        data?.tokens?.accessToken ||
        data?.tokens?.access_token ||
        null;

      const newRefreshToken =
        data?.refreshToken ||
        data?.refresh_token ||
        data?.tokens?.refreshToken ||
        data?.tokens?.refresh_token ||
        null;

      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken);

        console.log("🟢 YENİ ACCESS TOKEN ALINDI");
      }

      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);

        console.log("🟢 YENİ REFRESH TOKEN ALINDI");
      }

      return newAccessToken;
    } catch (error) {
      console.error("🔴 REFRESH HATASI:", error);

      clearTokens();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function rawRequest(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...options.headers,
    },
  });
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let token = getAccessToken();

  console.log(
    `🌐 API İSTEĞİ: ${path}`,
    token ? "TOKEN VAR" : "TOKEN YOK",
  );

  let res = await rawRequest(path, options, token);

  /*
   * Access token geçersiz / süresi dolmuşsa
   * refresh işlemini yalnızca bir kez yap.
   */
  if (res.status === 401) {
    console.log(`🔴 401 ALINDI: ${path}`);

    const newToken = await refreshAccessToken();

    if (newToken) {
      console.log(`🟢 YENİ TOKEN İLE TEKRAR İSTEK: ${path}`);

      token = newToken;

      res = await rawRequest(path, options, token);
    } else {
      console.log("🔴 YENİ TOKEN ALINAMADI.");
    }
  }

  if (!res.ok) {
    let error: any = {
      message: "Bir hata oluştu",
    };

    try {
      error = await res.json();
    } catch {
      // JSON olmayan hata cevabı
    }

    const message =
      error?.message ||
      error?.error ||
      error?.detail ||
      `HTTP ${res.status}`;

    console.error(`❌ API HATASI ${res.status}:`, path, message);

    throw new Error(message);
  }

  return res.json();
}

export const api = {
  ai: {
    egematchMe: () =>
      request<{
        score: number;
        energy: number;
        interest: number;
        love: number;
        label: string;
        summary: string;
      }>("/ai/egematch/me"),

    egematchUser: (
      userId: string,
      lang: string = "TR",
    ) =>
      request<{
        score: number;
        energy: number;
        interest: number;
        love: number;
        label: string;
        summary: string;
        strengths?: string[];
        risks?: string[];
        suggestions?: string[];
        commonHobbies?: string[];
      }>(
        `/ai/egematch/${userId}?lang=${encodeURIComponent(lang)}`,
      ),
  },

  auth: {
    register: (data: any) =>
      request("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    login: (data: {
      emailOrPhone: string;
      password: string;
    }) =>
      request("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    refresh: (refreshToken: string) =>
      request("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({
          refreshToken,
        }),
      }),

    logout: () =>
      request("/auth/logout", {
        method: "POST",
      }),

    forgotPassword: (email: string) =>
      request("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
      }),

    resetPassword: (data: {
      email: string;
      code: string;
      newPassword: string;
    }) =>
      request("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  users: {
    me: () => request("/users/me"),

    update: (data: any) =>
      request("/users/me", {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    search: (data?: any) =>
      request<any>("/search", {
        method: "POST",
        body: JSON.stringify(data ?? {}),
      }),

    get: (id: string) =>
      request(`/users/${id}`),
  },

  matches: {
    like: (userId: string) =>
      request(`/matches/like/${userId}`, {
        method: "POST",
      }),

    unlike: (userId: string) =>
      request(`/matches/unlike/${userId}`, {
        method: "POST",
      }),

    list: () =>
      request<any[]>("/matches"),

    mutual: () =>
      request<any[]>("/matches/mutual"),
  },

  conversations: {
    create: (userId: string) =>
      request<any>("/conversations", {
        method: "POST",
        body: JSON.stringify({
          userId,
        }),
      }),

    list: () =>
      request<any[]>("/conversations"),

    messages: (id: string) =>
      request<any[]>(
        `/conversations/${id}/messages`,
      ),

    send: (id: string, content: string) =>
      request<any>(
        `/conversations/${id}/messages`,
        {
          method: "POST",
          body: JSON.stringify({
            content,
          }),
        },
      ),
  },

  translate: {
    text: (
      text: string,
      targetLang: string,
    ) =>
      request<{
        translatedText: string;
        sourceText: string;
        targetLang: string;
      }>("/translate", {
        method: "POST",
        body: JSON.stringify({
          text,
          targetLang,
        }),
      }),
  },

  photos: {
    upload: (url: string) =>
      request("/photos/upload", {
        method: "POST",
        body: JSON.stringify({
          url,
        }),
      }),

    list: () =>
      request("/photos"),

    approve: (id: string) =>
      request(`/photos/approve/${id}`, {
        method: "POST",
      }),

    reject: (
      id: string,
      reason?: string,
    ) =>
      request(`/photos/reject/${id}`, {
        method: "POST",
        body: JSON.stringify({
          reason,
        }),
      }),

    pending: () =>
      request<any[]>("/photos/pending"),
  },

  admin: {
    stats: () =>
      request<any>("/admin/stats"),

    users: () =>
      request<any[]>("/admin/users"),

    toggleUserActive: (id: string) =>
      request<any>(
        `/admin/users/${id}/toggle-active`,
        {
          method: "POST",
        },
      ),

    photos: {
      pending: () =>
        request<any[]>("/admin/photos/pending"),

      approve: (id: string) =>
        request(
          `/admin/photos/approve/${id}`,
          {
            method: "POST",
          },
        ),

      reject: (
        id: string,
        reason?: string,
      ) =>
        request(
          `/admin/photos/reject/${id}`,
          {
            method: "POST",
            body: JSON.stringify({
              reason,
            }),
          },
        ),
    },
  },

  cities: {
    list: () =>
      request<any[]>("/cities"),

    districts: (cityId: number) =>
      request<any[]>(
        `/cities/${cityId}/districts`,
      ),
  },
};