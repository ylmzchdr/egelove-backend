const API_URL = "/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ message: "Bir hata oluştu" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    register: (data: any) =>
      request("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    login: (data: { emailOrPhone: string; password: string }) =>
      request("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    refresh: (refreshToken: string) =>
      request("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }),

    logout: () =>
      request("/auth/logout", {
        method: "POST",
      }),
  },

  users: {
    me: () => request("/users/me"),

    update: (data: any) =>
      request("/users/me", {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    search: (params?: Record<string, string>) => {
      const query = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<any[]>(`/users/search/filter${query}`);
    },

    get: (id: string) => request(`/users/${id}`),
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

    list: () => request<any[]>("/matches"),

    mutual: () => request<any[]>("/matches/mutual"),
  },

  conversations: {
    create: (userId: string) =>
      request<any>("/conversations", {
        method: "POST",
        body: JSON.stringify({ userId }),
      }),

    list: () => request<any[]>("/conversations"),

    messages: (id: string) => request<any[]>(`/conversations/${id}/messages`),

    send: (id: string, content: string) =>
      request<any>(`/conversations/${id}/messages`, {
        method: "POST",
        body: JSON.stringify({ content }),
      }),
  },

  translate: {
    text: (text: string, targetLang: string) =>
      request<{ translatedText: string; sourceText: string; targetLang: string }>(
        "/translate",
        {
          method: "POST",
          body: JSON.stringify({ text, targetLang }),
        },
      ),
  },

  photos: {
    upload: (url: string) =>
      request("/photos/upload", {
        method: "POST",
        body: JSON.stringify({ url }),
      }),

    list: () => request("/photos"),

    approve: (id: string) =>
      request(`/photos/approve/${id}`, {
        method: "POST",
      }),

    reject: (id: string, reason?: string) =>
      request(`/photos/reject/${id}`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      }),

    pending: () => request<any[]>("/photos/pending"),
  },

  admin: {
    stats: () => request<any>("/admin/stats"),

    users: () => request<any[]>("/admin/users"),

    toggleUserActive: (id: string) =>
      request<any>(`/admin/users/${id}/toggle-active`, {
        method: "POST",
      }),

    photos: {
      pending: () => request<any[]>("/admin/photos/pending"),

      approve: (id: string) =>
        request(`/admin/photos/approve/${id}`, {
          method: "POST",
        }),

      reject: (id: string, reason?: string) =>
        request(`/admin/photos/reject/${id}`, {
          method: "POST",
          body: JSON.stringify({ reason }),
        }),
    },
  },

  cities: {
    list: () => request<any[]>("/cities"),

    districts: (cityId: number) =>
      request<any[]>(`/cities/${cityId}/districts`),
  },
};