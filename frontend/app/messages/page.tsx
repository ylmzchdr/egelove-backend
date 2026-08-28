"use client";
import React, {
  FormEvent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
/* =========================================================
   TİPLER
   ========================================================= */
type User = {
  id: string;
  name?: string;
  username?: string;
  city?: string;
  profileImage?: string | null;
  profilePhoto?: string | null;
};
type Message = {
  id: string;
  content: string;
  senderId?: string;
  receiverId?: string;
  createdAt?: string;
  isMine?: boolean;
};
type Conversation = {
  id: string;
  userId?: string;
  participantId?: string;
  participant?: User | null;
  user?: User | null;
  lastMessage?: Message | null;
  updatedAt?: string;
  unreadCount?: number;
};
/* =========================================================
   API
   ========================================================= */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://egelove-backend.onrender.com";
/* =========================================================
   TOKEN
   ========================================================= */
function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("accessToken");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("refreshToken");
}

function saveTokens(data: any) {
  if (typeof window === "undefined") {
    return;
  }

  if (data?.accessToken) {
    localStorage.setItem(
      "accessToken",
      String(data.accessToken),
    );
  }

  if (data?.refreshToken) {
    localStorage.setItem(
      "refreshToken",
      String(data.refreshToken),
    );
  }
}

/* =========================================================
   JWT'DEN KULLANICI ID
   ========================================================= */

function getCurrentUserId(): string | null {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  try {
    const parts = token.split(".");

    if (parts.length < 2) {
      return null;
    }

    const payload = parts[1];

    const normalized = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded =
      normalized +
      "=".repeat(
        (4 - (normalized.length % 4)) % 4,
      );

    const decoded = decodeURIComponent(
      atob(padded)
        .split("")
        .map(
          (char) =>
            "%" +
            ("00" +
              char.charCodeAt(0).toString(16)
            ).slice(-2),
        )
        .join(""),
    );

    const data = JSON.parse(decoded);

    if (data?.sub !== undefined) {
      return String(data.sub);
    }

    if (data?.id !== undefined) {
      return String(data.id);
    }

    if (data?.userId !== undefined) {
      return String(data.userId);
    }

    return null;
  } catch {
    return null;
  }
}

/* =========================================================
   GÜVENLİ STRING
   ========================================================= */

function safeString(
  value: unknown,
): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return "";
}

/* =========================================================
   KULLANICI NORMALİZASYONU
   ========================================================= */

function normalizeUser(
  raw: any,
): User | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const rawId =
    raw.id ??
    raw._id ??
    raw.userId;

  if (
    rawId === undefined ||
    rawId === null ||
    String(rawId).trim() === ""
  ) {
    return null;
  }

  let name = "";

  if (typeof raw.name === "string") {
    name = raw.name.trim();
  } else if (
    raw.name &&
    typeof raw.name === "object"
  ) {
    name =
      safeString(raw.name.name) ||
      safeString(raw.name.Name) ||
      safeString(raw.name.username);
  }

  if (!name) {
    name = safeString(raw.username);
  }

  return {
    id: String(rawId),
    name: name || "Kullanıcı",
    username:
      safeString(raw.username) || undefined,
    city:
      safeString(raw.city) || undefined,
    profileImage:
      safeString(raw.profileImage) ||
      safeString(raw.avatar) ||
      null,
    profilePhoto:
      safeString(raw.profilePhoto) ||
      safeString(raw.avatar) ||
      null,
  };
}

/* =========================================================
   MESAJ NORMALİZASYONU
   ========================================================= */

function normalizeMessage(
  raw: any,
  fallbackId: string,
): Message | null {
  if (
    raw === null ||
    raw === undefined ||
    raw === ""
  ) {
    return null;
  }

  /*
   * Backend bazı durumlarda son mesajı
   * doğrudan string gönderebilir.
   */
  if (typeof raw === "string") {
    return {
      id: fallbackId,
      content: raw,
    };
  }

  if (
    typeof raw !== "object"
  ) {
    return null;
  }

  const id = String(
    raw.id ??
      raw._id ??
      fallbackId,
  );

  const content = safeString(
    raw.content ??
      raw.message ??
      raw.text,
  );

  const senderId =
    raw.senderId ??
    raw.sender?.id ??
    raw.sender?._id ??
    raw.fromUserId ??
    raw.from?.id ??
    raw.from?._id;

  const receiverId =
    raw.receiverId ??
    raw.recipientId ??
    raw.receiver?.id ??
    raw.receiver?._id ??
    raw.toUserId ??
    raw.to?.id ??
    raw.to?._id;

  const createdAt =
    raw.createdAt ??
    raw.sentAt ??
    raw.created_at ??
    raw.date ??
    raw.timestamp;

  let isMine: boolean | undefined;

  if (typeof raw.isMine === "boolean") {
    isMine = raw.isMine;
  } else if (
    typeof raw.mine === "boolean"
  ) {
    isMine = raw.mine;
  }

  return {
    id,
    content,
    senderId:
      senderId !== undefined &&
      senderId !== null
        ? String(senderId)
        : undefined,
    receiverId:
      receiverId !== undefined &&
      receiverId !== null
        ? String(receiverId)
        : undefined,
    createdAt:
      createdAt !== undefined &&
      createdAt !== null
        ? String(createdAt)
        : undefined,
    isMine,
  };
}

/* =========================================================
   API REQUEST
   ========================================================= */

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const makeRequest = async (
    token: string | null,
  ) => {
    return fetch(
      `${API_URL}${path}`,
      {
        ...options,
        headers: {
          "Content-Type":
            "application/json",

          ...(token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : {}),

          ...(options.headers || {}),
        },
      },
    );
  };

  let token = getAccessToken();

  let response =
    await makeRequest(token);

  /*
   * Access token süresi bittiyse
   * refresh token ile yenile.
   */
  if (response.status === 401) {
    const refreshToken =
      getRefreshToken();

    if (!refreshToken) {
      throw new Error(
        "Oturum bulunamadı. Lütfen tekrar giriş yapın.",
      );
    }

    const refreshResponse =
      await fetch(
        `${API_URL}/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            refreshToken,
          }),
        },
      );

    if (!refreshResponse.ok) {
      localStorage.removeItem(
        "accessToken",
      );

      localStorage.removeItem(
        "refreshToken",
      );

      throw new Error(
        "Oturum süresi dolmuş. Lütfen tekrar giriş yapın.",
      );
    }

    const refreshData =
      await refreshResponse.json();

    saveTokens(refreshData);

    token =
      refreshData?.accessToken ??
      null;

    response =
      await makeRequest(token);
  }

  if (!response.ok) {
    const error =
      await response
        .json()
        .catch(() => null);

    throw new Error(
      safeString(error?.message) ||
        safeString(error?.error) ||
        `HTTP ${response.status}`,
    );
  }

  return response.json();
}

/* =========================================================
   ANA MESAJ İÇERİĞİ
   ========================================================= */

function MessagesContent() {
  const searchParams =
    useSearchParams();

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [
    selectedConversationId,
    setSelectedConversationId,
  ] = useState<string | null>(null);

  const [draft, setDraft] =
    useState("");

  const [
    loadingConversations,
    setLoadingConversations,
  ] = useState(true);

  const [
    loadingMessages,
    setLoadingMessages,
  ] = useState(false);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");
    const [isPremium, setIsPremium] = useState(false);

  const [search, setSearch] =
    useState("");

  const [
    messageFilter,
    setMessageFilter,
  ] = useState<
    "all" | "incoming" | "outgoing"
  >("all");

  const targetUserId =
    searchParams.get("userId");

  const targetThreadId =
    searchParams.get("thread");

  /* =======================================================
     KULLANICI ADI
     ======================================================= */

  const getUserName = useCallback(
    (
      user?: User | null,
    ): string => {
      if (!user) {
        return "Kullanıcı";
      }

      const name =
        safeString(user.name);

      if (name) {
        return name;
      }

      const username =
        safeString(user.username);

      if (username) {
        return username;
      }

      return "Kullanıcı";
    },
    [],
  );

  /* =======================================================
     PROFİL FOTOĞRAFI
     ======================================================= */

  const getProfileImage =
    useCallback(
      (
        user?: User | null,
      ): string | null => {
        if (!user) {
          return null;
        }

        return (
          safeString(
            user.profileImage,
          ) ||
          safeString(
            user.profilePhoto,
          ) ||
          null
        );
      },
      [],
    );

  /* =======================================================
     KONUŞMA NORMALİZASYONU
     ======================================================= */

  const normalizeConversation =
    useCallback(
      (
        raw: any,
        index: number,
      ): Conversation | null => {
        if (!raw || typeof raw !== "object") {
          return null;
        }

        const idValue =
          raw.id ??
          raw.conversationId ??
          raw._id ??
          raw.threadId;

        if (
          idValue === undefined ||
          idValue === null ||
          String(idValue).trim() === ""
        ) {
          return null;
        }

        /* Backend user1/user2 biçimi + eski API biçimleri */
        const currentUserId = getCurrentUserId();
        const rawUser1 = raw.user1 ?? raw.userA ?? null;
        const rawUser2 = raw.user2 ?? raw.userB ?? null;

        let participantRaw =
          raw.participant ??
          raw.otherUser ??
          raw.user ??
          raw.receiver ??
          raw.recipient ??
          null;

        if (!participantRaw && (rawUser1 || rawUser2)) {
          const user1Id = rawUser1?.id ?? rawUser1?._id ?? rawUser1?.userId;
          const user2Id = rawUser2?.id ?? rawUser2?._id ?? rawUser2?.userId;

          if (currentUserId) {
            if (String(user1Id) === String(currentUserId)) {
              participantRaw = rawUser2;
            } else if (String(user2Id) === String(currentUserId)) {
              participantRaw = rawUser1;
            }
          }

          participantRaw = participantRaw ?? rawUser2 ?? rawUser1 ?? null;
        }

        const participant = normalizeUser(participantRaw);

        const userId =
          raw.userId ??
          raw.participantId ??
          participant?.id ??
          participantRaw?.id ??
          participantRaw?._id ??
          participantRaw?.userId;

        const lastRaw =
          raw.lastMessage ??
          raw.latestMessage ??
          raw.last_message ??
          (Array.isArray(raw.messages) ? raw.messages[0] : null) ??
          null;

        const lastMessage = normalizeMessage(
          lastRaw,
          `${String(idValue)}-last-${index}`,
        );

        return {
          id: String(idValue),
          userId:
            userId !== undefined &&
            userId !== null &&
            String(userId).trim() !== ""
              ? String(userId)
              : undefined,
          participantId:
            participant?.id ??
            (userId !== undefined && userId !== null
              ? String(userId)
              : undefined),
          participant,
          user: participant,
          lastMessage,
          updatedAt:
            safeString(raw.updatedAt) ||
            lastMessage?.createdAt ||
            undefined,
          unreadCount: Number(
            raw.unreadCount ??
              raw.unread ??
              0,
          ),
        };
      },
      [],
    );

  /* =======================================================
     KONUŞMALARI GETİR
     ======================================================= */

  const loadConversations =
    useCallback(async () => {
      try {
        setLoadingConversations(true);
        setError("");

        const data =
          await apiRequest<any>(
            "/conversations",
          );

        let list: any[] = [];

        if (Array.isArray(data)) {
          list = data;
        } else if (
          Array.isArray(
            data?.conversations,
          )
        ) {
          list =
            data.conversations;
        } else if (
          Array.isArray(data?.items)
        ) {
          list = data.items;
        } else if (
          Array.isArray(data?.data)
        ) {
          list = data.data;
        }

        const normalized =
          list
            .map(
              (
                item,
                index,
              ) =>
                normalizeConversation(
                  item,
                  index,
                ),
            )
            .filter(
              (
                item,
              ): item is Conversation =>
                item !== null,
            );

        setConversations(
          normalized,
        );
      } catch (err: any) {
        console.error(
          "Konuşmalar alınamadı:",
          err,
        );

        setError(
          safeString(err?.message) ||
            safeString(err?.error) ||
            "Mesaj konuşmaları yüklenemedi.",
        );

        setConversations([]);
      } finally {
        setLoadingConversations(
          false,
        );
      }
    }, [
      normalizeConversation,
    ]);

  /* =======================================================
     MESAJLARI GETİR
     ======================================================= */

  const loadMessages =
    useCallback(
      async (
        conversationId: string,
      ) => {
        try {
          setLoadingMessages(true);
          setError("");

          const data =
            await apiRequest<any>(
              `/conversations/${conversationId}/messages`,
            );

          let list: any[] = [];

          if (Array.isArray(data)) {
            list = data;
          } else if (
            Array.isArray(
              data?.messages,
            )
          ) {
            list = data.messages;
          } else if (
            Array.isArray(data?.items)
          ) {
            list = data.items;
          } else if (
            Array.isArray(data?.data)
          ) {
            list = data.data;
          }

          const currentUserId =
            getCurrentUserId();

          const normalized =
            list
              .map(
                (
                  item,
                  index,
                ) =>
                  normalizeMessage(
                    item,
                    `${conversationId}-${index}`,
                  ),
              )
              .filter(
                (
                  item,
                ): item is Message =>
                  item !== null,
              )
              .map(
                (message) => {
                  if (
                    typeof message.isMine ===
                    "boolean"
                  ) {
                    return message;
                  }

                  if (
                    currentUserId &&
                    message.senderId
                  ) {
                    return {
                      ...message,
                      isMine:
                        String(
                          message.senderId,
                        ) ===
                        String(
                          currentUserId,
                        ),
                    };
                  }

                  return {
                    ...message,
                    isMine: false,
                  };
                },
              );

          setMessages(
            normalized,
          );
        } catch (err: any) {
          console.error(
            "Mesajlar alınamadı:",
            err,
          );

          setError(
            safeString(err?.message) ||
              safeString(err?.error) ||
              "Mesajlar yüklenemedi.",
          );

          setMessages([]);
        } finally {
          setLoadingMessages(
            false,
          );
        }
      },
      [],
    );

  /* =======================================================
     İLK YÜKLEME
     ======================================================= */

  useEffect(() => {
    loadConversations();
  }, [
    loadConversations,
  ]);

  /* =======================================================
     PREMIUM DURUMU
     ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadPremiumStatus = async () => {
      try {
        const me = await apiRequest<any>(
          "/users/me",
        );

        if (cancelled) return;

        const premiumExpiresAt =
          me?.premiumExpiresAt;

        const premium =
          !!premiumExpiresAt &&
          new Date(
            premiumExpiresAt,
          ).getTime() > Date.now();

        setIsPremium(premium);
      } catch (err) {
        console.error(
          "Premium durumu alınamadı:",
          err,
        );

        if (!cancelled) {
          setIsPremium(false);
        }
      }
    };

    loadPremiumStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     AKTİF KONUŞMA
     ======================================================= */

  const activeConversation =
    useMemo(() => {
      if (
        !selectedConversationId
      ) {
        return null;
      }

      return (
        conversations.find(
          (conversation) =>
            String(
              conversation.id,
            ) ===
            String(
              selectedConversationId,
            ),
        ) ?? null
      );
    }, [
      conversations,
      selectedConversationId,
    ]);

  /* =======================================================
     AKTİF KULLANICI
     ======================================================= */

  const activeUser =
    useMemo(() => {
      const user =
        selectedUser ??
        activeConversation?.participant ??
        activeConversation?.user ??
        null;

      return user
        ? normalizeUser(user)
        : null;
    }, [
      selectedUser,
      activeConversation,
    ]);

  /* =======================================================
     KONUŞMA LİSTESİ FİLTRE
     ======================================================= */

  const filteredConversations =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLocaleLowerCase(
            "tr-TR",
          );

      const currentUserId =
        getCurrentUserId();

      return conversations.filter(
        (conversation) => {
          const user =
            conversation.participant ??
            conversation.user;

          const name =
            getUserName(user);

          const city =
            safeString(
              user?.city,
            );

          const matchesSearch =
            !term ||
            `${name} ${city}`
              .toLocaleLowerCase(
                "tr-TR",
              )
              .includes(term);

          if (!matchesSearch) {
            return false;
          }

          /*
           * TÜMÜ
           */
          if (
            messageFilter === "all"
          ) {
            return true;
          }

          /*
           * Son mesaj yoksa gelen/giden
           * filtresinde gösterme.
           */
          const lastMessage =
            conversation.lastMessage;

          if (!lastMessage) {
            return false;
          }

          /*
           * Önce backend'in isMine bilgisini kullan.
           */
          let isMine =
            lastMessage.isMine;

          /*
           * isMine yoksa senderId üzerinden
           * kendimiz hesapla.
           */
          if (
            typeof isMine !==
            "boolean"
          ) {
            if (
              currentUserId &&
              lastMessage.senderId
            ) {
              isMine =
                String(
                  lastMessage.senderId,
                ) ===
                String(
                  currentUserId,
                );
            } else if (
              currentUserId &&
              lastMessage.receiverId
            ) {
              isMine =
                String(
                  lastMessage.receiverId,
                ) !==
                String(
                  currentUserId,
                );
            } else {
              isMine = false;
            }
          }

          if (
            messageFilter ===
            "outgoing"
          ) {
            return isMine;
          }

          return !isMine;
        },
      );
    }, [
      conversations,
      search,
      messageFilter,
      getUserName,
    ]);

  /* =======================================================
     KONUŞMA AÇ
     ======================================================= */

  const openConversation =
    useCallback(
      async (
        conversation: Conversation,
      ) => {
        const user =
          conversation.participant ??
          conversation.user ??
          null;

        if (user) {
          const normalizedUser =
            normalizeUser(user);

          if (normalizedUser) {
            setSelectedUser(
              normalizedUser,
            );
          }
        }

        setError("");

        setSelectedConversationId(
          String(
            conversation.id,
          ),
        );
      },
      [],
    );

  /* =======================================================
     PROFİLDEN KONUŞMA AÇ / OLUŞTUR
     ======================================================= */

  const openConversationWithUser =
    useCallback(
      async (
        user: User,
      ) => {
        const normalizedUser =
          normalizeUser(user);

        if (!normalizedUser) {
          setError(
            "Kullanıcı bilgisi bulunamadı.",
          );
          return;
        }

        setSelectedUser(
          normalizedUser,
        );

        setError("");

        /*
         * Önce mevcut konuşmayı bul.
         */
        const existing =
          conversations.find(
            (conversation) => {
              const participant =
                conversation.participant ??
                conversation.user;

              const participantId =
                participant?.id ??
                conversation.userId ??
                conversation.participantId;

              return (
                participantId !==
                  undefined &&
                String(
                  participantId,
                ) ===
                  String(
                    normalizedUser.id,
                  )
              );
            },
          );

        if (existing) {
          setSelectedConversationId(
            String(existing.id),
          );
          return;
        }

        /*
         * Mevcut konuşma yoksa oluştur.
         */
        try {
          const created =
            await apiRequest<any>(
              "/conversations",
              {
                method: "POST",
                body: JSON.stringify({
                  userId:
                    normalizedUser.id,
                }),
              },
            );

          const conversationId =
            created?.id ??
            created?.conversationId ??
            created?._id ??
            created?.threadId;

          if (
            conversationId ===
              undefined ||
            conversationId === null
          ) {
            /*
             * Bazı backend'ler POST sonrası
             * doğrudan konuşmayı döndürüyor olabilir.
             */
            const fallback =
              normalizeConversation(
                created,
                0,
              );

            if (fallback) {
              setConversations(
                (previous) => {
                  const exists =
                    previous.some(
                      (item) =>
                        String(
                          item.id,
                        ) ===
                        String(
                          fallback.id,
                        ),
                    );

                  return exists
                    ? previous
                    : [
                        fallback,
                        ...previous,
                      ];
                },
              );

              setSelectedConversationId(
                String(
                  fallback.id,
                ),
              );

              return;
            }

            throw new Error(
              "Konuşma oluşturuldu ancak konuşma ID'si alınamadı.",
            );
          }

          const newConversation: Conversation =
            {
              id: String(
                conversationId,
              ),
              userId:
                normalizedUser.id,
              participantId:
                normalizedUser.id,
              participant:
                normalizedUser,
              user:
                normalizedUser,
              lastMessage:
                null,
              unreadCount: 0,
            };

          setConversations(
            (previous) => {
              const exists =
                previous.some(
                  (item) =>
                    String(
                      item.id,
                    ) ===
                    String(
                      conversationId,
                    ),
                );

              if (exists) {
                return previous;
              }

              return [
                newConversation,
                ...previous,
              ];
            },
          );

          setSelectedConversationId(
            String(
              conversationId,
            ),
          );
        } catch (err: any) {
          console.error(
            "Konuşma oluşturulamadı:",
            err,
          );

          setError(
            safeString(err?.message) ||
              safeString(err?.error) ||
              "Mesaj konuşması başlatılamadı.",
          );
        }
      },
      [conversations],
    );

  /* =======================================================
     URL'DEKİ THREAD
     ======================================================= */

  useEffect(() => {
    if (!targetThreadId) {
      return;
    }

    const conversation =
      conversations.find(
        (item) =>
          String(item.id) ===
          String(
            targetThreadId,
          ),
      );

    if (!conversation) {
      return;
    }

    setSelectedConversationId(
      String(conversation.id),
    );

    const user =
      conversation.participant ??
      conversation.user;

    const normalizedUser =
      normalizeUser(user);

    if (normalizedUser) {
      setSelectedUser(
        normalizedUser,
      );
    }
  }, [
    targetThreadId,
    conversations,
  ]);

  /* =======================================================
     URL'DEKİ USER ID
     ======================================================= */

  useEffect(() => {
    if (!targetUserId) {
      return;
    }

    let cancelled = false;

    const openTargetUser =
      async () => {
        /*
         * Önce mevcut konuşmalarda ara.
         */
        const existing =
          conversations.find(
            (conversation) => {
              const user =
                conversation.participant ??
                conversation.user;

              const id =
                user?.id ??
                conversation.userId ??
                conversation.participantId;

              return (
                id !== undefined &&
                String(id) ===
                  String(
                    targetUserId,
                  )
              );
            },
          );

        if (existing) {
          if (cancelled) {
            return;
          }

          const user =
            existing.participant ??
            existing.user;

          const normalizedUser =
            normalizeUser(user);

          if (normalizedUser) {
            setSelectedUser(
              normalizedUser,
            );
          } else {
            setSelectedUser({
              id: String(
                targetUserId,
              ),
              name: "Kullanıcı",
            });
          }

          setSelectedConversationId(
            String(existing.id),
          );

          return;
        }

        /*
         * Mevcut konuşma yoksa önce kullanıcıyı getir.
         */
        try {
          let targetUser: User = {
            id: String(
              targetUserId,
            ),
            name: "Kullanıcı",
          };

          try {
            const user =
              await apiRequest<any>(
                `/users/${targetUserId}`,
              );

            const normalized =
              normalizeUser({
                ...user,
                id:
                  user?.id ??
                  user?._id ??
                  targetUserId,
              });

            if (normalized) {
              targetUser =
                normalized;
            }
          } catch {
            /*
             * Kullanıcı endpoint'i başarısız
             * olsa bile userId elimizde.
             */
          }

          if (cancelled) {
            return;
          }

          setSelectedUser(
            targetUser,
          );

          /*
           * Konuşmayı oluştur.
           */
          const created =
            await apiRequest<any>(
              "/conversations",
              {
                method: "POST",
                body: JSON.stringify({
                  userId:
                    targetUser.id,
                }),
              },
            );

          if (cancelled) {
            return;
          }

          const conversationId =
            created?.id ??
            created?.conversationId ??
            created?._id ??
            created?.threadId;

          if (
            conversationId ===
              undefined ||
            conversationId === null
          ) {
            const fallback =
              normalizeConversation(
                created,
                0,
              );

            if (!fallback) {
              throw new Error(
                "Konuşma oluşturuldu ancak konuşma ID'si alınamadı.",
              );
            }

            setConversations(
              (previous) => [
                fallback,
                ...previous.filter(
                  (item) =>
                    String(
                      item.id,
                    ) !==
                    String(
                      fallback.id,
                    ),
                ),
              ],
            );

            setSelectedConversationId(
              String(
                fallback.id,
              ),
            );

            return;
          }

          const newConversation: Conversation =
            {
              id: String(
                conversationId,
              ),
              userId:
                targetUser.id,
              participantId:
                targetUser.id,
              participant:
                targetUser,
              user:
                targetUser,
              lastMessage:
                null,
              unreadCount: 0,
            };

          setConversations(
            (previous) => {
              const exists =
                previous.some(
                  (item) =>
                    String(
                      item.id,
                    ) ===
                    String(
                      conversationId,
                    ),
                );

              return exists
                ? previous
                : [
                    newConversation,
                    ...previous,
                  ];
            },
          );

          setSelectedConversationId(
            String(
              conversationId,
            ),
          );
        } catch (err: any) {
          if (cancelled) {
            return;
          }

          console.error(
            "Mesaj konuşması başlatılamadı:",
            err,
          );

          setError(
            safeString(err?.message) ||
              safeString(err?.error) ||
              "Mesaj konuşması başlatılamadı.",
          );
        }
      };

    openTargetUser();

    return () => {
      cancelled = true;
    };
  }, [
    targetUserId,
    conversations,
  ]);

  /* =======================================================
     SEÇİLİ KONUŞMANIN MESAJLARI
     ======================================================= */

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    loadMessages(
      selectedConversationId,
    );
  }, [
    selectedConversationId,
    loadMessages,
  ]);

  /* =======================================================
     MESAJ GÖNDER
     ======================================================= */

  async function handleSend(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const content =
      draft.trim();

    if (
      !content ||
      !selectedConversationId ||
      sending
    ) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const sent =
        await apiRequest<any>(
          `/conversations/${selectedConversationId}/messages`,
          {
            method: "POST",
            body: JSON.stringify({
              content,
            }),
          },
        );

      const currentUserId =
        getCurrentUserId();

      const newMessage: Message =
        normalizeMessage(
          sent,
          `${Date.now()}`,
        ) ?? {
          id: `${Date.now()}`,
          content,
        };

      const finalMessage: Message =
        {
          ...newMessage,
          content:
            newMessage.content ||
            content,
          isMine:
            typeof newMessage.isMine ===
            "boolean"
              ? newMessage.isMine
              : true,
          senderId:
            newMessage.senderId ??
            currentUserId ??
            undefined,
          createdAt:
            newMessage.createdAt ??
            new Date().toISOString(),
        };

      setMessages(
        (previous) => [
          ...previous,
          finalMessage,
        ],
      );

      setDraft("");

      /*
       * Sol taraftaki son mesajı güncelle.
       */
      setConversations(
        (previous) =>
          previous.map(
            (conversation) =>
              String(
                conversation.id,
              ) ===
              String(
                selectedConversationId,
              )
                ? {
                    ...conversation,
                    lastMessage:
                      finalMessage,
                    updatedAt:
                      finalMessage.createdAt,
                  }
                : conversation,
          ),
      );
    } catch (err: any) {
      console.error(
        "Mesaj gönderilemedi:",
        err,
      );

      setError(
        safeString(err?.message) ||
          safeString(err?.error) ||
          "Mesaj gönderilemedi.",
      );
    } finally {
      setSending(false);
    }
  }

  /* =======================================================
     ZAMAN
     ======================================================= */

  function formatTime(
    value?: string,
  ): string {
    if (!value) {
      return "";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return "";
    }

    return date.toLocaleTimeString(
      "tr-TR",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  }

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div className="min-h-screen bg-[#121420] text-white flex flex-col">

      {/* =================================================
          ÜST NAVİGASYON
          ================================================= */}

      <header className="w-full bg-[#1a1d30] border-b border-white/10 px-4 sm:px-6 py-4 sm:py-5 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col items-start gap-3">

          <button
            type="button"
            onClick={() => {
              window.location.href =
                "/dashboard";
            }}
            className="
              inline-flex items-center
              gap-2
              bg-purple-600
              hover:bg-purple-500
              text-white
              px-5 sm:px-6
              py-3
              rounded-2xl
              text-sm sm:text-base
              font-black
              tracking-wide
              transition-all
              shadow-lg
              shadow-purple-500/20
              border border-purple-400/30
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-5 h-5 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7M3 12h18"
              />
            </svg>

            <span>
              ANA SAYFAYA GERİ DÖN
            </span>
          </button>

          <span
            className="
              text-[10px]
              sm:text-xs
              font-bold
              text-slate-500
              tracking-[0.25em]
              font-mono
              pl-1
            "
          >
            EGELOVE GÜVENLİ ODASI
          </span>

        </div>
      </header>

      {/* =================================================
          ANA
          ================================================= */}

      <main
        className="
          flex-1
          px-4
          sm:px-6
          py-5
          sm:py-6
        "
      >

        <div
          className="
            max-w-6xl
            mx-auto
            grid
            grid-cols-1
            md:grid-cols-3
            gap-5
            sm:gap-6
          "
        >

          {/* =================================================
              SOL MESAJ LİSTESİ
              ================================================= */}

          <section
            className="
              md:col-span-1
              bg-slate-900/60
              backdrop-blur-xl
              border
              border-white/20
              rounded-[28px]
              p-5
              sm:p-6
              min-h-[430px]
              sm:min-h-[470px]
              md:h-[620px]
              flex
              flex-col
            "
          >

            <div>

              <h1
                className="
                  text-2xl
                  sm:text-3xl
                  font-bold
                  tracking-wide
                  text-purple-400
                  mb-5
                "
              >
                Mesajlar
              </h1>

              {/* FİLTRELER */}

              <div className="flex gap-2 mb-5">

                <button
                  type="button"
                  onClick={() =>
                    setMessageFilter(
                      "all",
                    )
                  }
                  className={`
                    px-5
                    py-3
                    rounded-2xl
                    text-sm
                    font-semibold
                    transition
                    ${
                      messageFilter ===
                      "all"
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-400"
                    }
                  `}
                >
                  Tümü
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMessageFilter(
                      "incoming",
                    )
                  }
                  className={`
                    px-5
                    py-3
                    rounded-2xl
                    text-sm
                    font-semibold
                    transition
                    ${
                      messageFilter ===
                      "incoming"
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-400"
                    }
                  `}
                >
                  Gelen
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMessageFilter(
                      "outgoing",
                    )
                  }
                  className={`
                    px-5
                    py-3
                    rounded-2xl
                    text-sm
                    font-semibold
                    transition
                    ${
                      messageFilter ===
                      "outgoing"
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-400"
                    }
                  `}
                >
                  Giden
                </button>

              </div>

              {/* ARAMA */}

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Ara..."
                className="
                  w-full
                  h-14
                  bg-black/40
                  border
                  border-white/20
                  rounded-2xl
                  px-5
                  text-base
                  text-white
                  placeholder:text-slate-500
                  focus:outline-none
                  focus:border-purple-500
                  transition
                "
              />

            </div>

            {/* KONUŞMALAR */}

            <div
              className="
                flex-1
                overflow-y-auto
                mt-5
                space-y-3
                pr-1
              "
            >

              {loadingConversations ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-500">
                    Mesajlar yükleniyor...
                  </p>
                </div>
              ) : filteredConversations.length > 0 ? (

                filteredConversations.map(
                  (conversation) => {
                    const user =
                      conversation.participant ??
                      conversation.user ??
                      null;

                    const image =
                      getProfileImage(
                        user,
                      );

                    const isActive =
                      String(
                        selectedConversationId,
                      ) ===
                      String(
                        conversation.id,
                      );

                    return (
                      <button
                        key={
                          conversation.id
                        }
                        type="button"
                        onClick={() =>
                          openConversation(
                            conversation,
                          )
                        }
                        className={`
                          w-full
                          flex
                          items-center
                          gap-3
                          p-3
                          rounded-2xl
                          border
                          text-left
                          transition
                          ${
                            isActive
                              ? "bg-purple-600/20 border-purple-500/60"
                              : "bg-black/20 border-white/10 hover:bg-white/5"
                          }
                        `}
                      >

                        {/* FOTOĞRAF */}

                        {image ? (
                          <img
                            src={image}
                            alt={getUserName(
                              user,
                            )}
                            className="
                              w-12
                              h-12
                              rounded-full
                              object-cover
                              shrink-0
                            "
                          />
                        ) : (
                          <div
                            className="
                              w-12
                              h-12
                              rounded-full
                              shrink-0
                              bg-gradient-to-br
                              from-purple-500
                              to-pink-500
                              flex
                              items-center
                              justify-center
                              font-bold
                            "
                          >
                            {getUserName(
                              user,
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        {/* BİLGİ */}

                        <div className="min-w-0 flex-1">

                          <div className="flex items-center justify-between gap-2">

                            <p className="font-semibold truncate">
                              {getUserName(
                                user,
                              )}
                            </p>

                            {conversation.updatedAt && (
                              <span className="text-[10px] text-slate-500 shrink-0">
                                {formatTime(
                                  conversation.updatedAt,
                                )}
                              </span>
                            )}

                          </div>

                          <p className="text-xs text-slate-500 truncate mt-1">
                            {conversation.lastMessage?.content ||
                              "Henüz mesaj yok"}
                          </p>

                        </div>

                      </button>
                    );
                  },
                )

              ) : (

                <div className="h-full flex items-center justify-center">
                  <p className="text-sm text-slate-500 text-center">
                    Henüz mesajın yok
                  </p>
                </div>

              )}

            </div>

          </section>

          {/* =================================================
              SAĞ SOHBET PANELİ
              ================================================= */}

          <section
            className="
              md:col-span-2
              bg-slate-900/60
              backdrop-blur-xl
              border
              border-white/20
              rounded-[28px]
              overflow-hidden
              min-h-[520px]
              md:h-[620px]
              flex
              flex-col
            "
          >

            {activeUser ? (
              <>

                {/* SOHBET ÜST BAR */}

                <div
                  className="
                    shrink-0
                    px-5
                    sm:px-6
                    py-4
                    border-b
                    border-white/10
                    bg-[#1a1d30]/80
                    flex
                    items-center
                    gap-3
                  "
                >

                  {getProfileImage(
                    activeUser,
                  ) ? (
                    <img
                      src={
                        getProfileImage(
                          activeUser,
                        ) as string
                      }
                      alt={getUserName(
                        activeUser,
                      )}
                      className="
                        w-12
                        h-12
                        rounded-full
                        object-cover
                      "
                    />
                  ) : (
                    <div
                      className="
                        w-12
                        h-12
                        rounded-full
                        bg-gradient-to-br
                        from-purple-500
                        to-pink-500
                        flex
                        items-center
                        justify-center
                        font-bold
                        text-lg
                      "
                    >
                      {getUserName(
                        activeUser,
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">

                    <h2 className="font-bold text-lg truncate">
                      {getUserName(
                        activeUser,
                      )}
                    </h2>

                    {activeUser.city && (
                      <p className="text-xs text-slate-500 mt-1">
                        📍{" "}
                        {safeString(
                          activeUser.city,
                        )}
                      </p>
                    )}

                  </div>

                </div>

                {/* MESAJLAR */}

                <div
                  className="
                    flex-1
                    overflow-y-auto
                    p-5
                    sm:p-6
                    space-y-3
                  "
                >

                  {loadingMessages ? (

                    <div className="h-full flex items-center justify-center">
                      <p className="text-slate-500">
                        Mesajlar yükleniyor...
                      </p>
                    </div>

                  ) : messages.length > 0 ? (

                    messages.map(
                      (message) => {
                        const mine =
                          Boolean(
                            message.isMine,
                          );

                        return (
                          <div
                            key={
                              message.id
                            }
                            className={`
                              flex
                              ${
                                mine
                                  ? "justify-end"
                                  : "justify-start"
                              }
                            `}
                          >

                            <div
                              className={`
                                max-w-[80%]
                                sm:max-w-[70%]
                                rounded-2xl
                                px-4
                                py-3
                                ${
                                  mine
                                    ? "bg-purple-600 text-white rounded-br-md"
                                    : "bg-slate-800 text-slate-200 rounded-bl-md"
                                }
                              `}
                            >

                              <p className="text-sm whitespace-pre-wrap break-words">
                                {safeString(
                                  message.content,
                                )}
                              </p>

                              {message.createdAt && (
                                <p
                                  className={`
                                    text-[10px]
                                    mt-1
                                    ${
                                      mine
                                        ? "text-white/60"
                                        : "text-slate-500"
                                    }
                                  `}
                                >
                                  {formatTime(
                                    message.createdAt,
                                  )}
                                </p>
                              )}

                            </div>

                          </div>
                        );
                      },
                    )

                  ) : (

                    <div className="h-full flex flex-col items-center justify-center text-center">

                      <div className="text-5xl mb-4">
                        💬
                      </div>

                      <p className="text-slate-400 font-semibold">
                        Henüz mesaj yok
                      </p>

                      <p className="text-sm text-slate-600 mt-2">
                        İlk mesajı sen gönder.
                      </p>

                    </div>

                  )}

                </div>

                {/* HATA */}

                {error && (
                  <div className="px-5">
                    <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {error}
                    </div>
                  </div>
                )}

                {/* MESAJ YAZMA */}

                <form
                  onSubmit={
                    handleSend
                  }
                  className="
                    shrink-0
                    p-4
                    sm:p-5
                    border-t
                    border-white/10
                    bg-[#1a1d30]/80
                  "
                >

                  <div className="flex items-end gap-3">

                    <textarea
                      value={draft}
                      onChange={(
                        event,
                      ) =>
                        setDraft(
                          event.target
                            .value,
                        )
                      }
                      onKeyDown={(
                        event,
                      ) => {
                        if (
                          event.key ===
                            "Enter" &&
                          !event.shiftKey
                        ) {
                          event.preventDefault();

                          if (
                            draft.trim() &&
                            !sending
                          ) {
                            event.currentTarget.form?.requestSubmit();
                          }
                        }
                      }}
                      placeholder="Mesajını yaz..."
                      rows={2}
                      disabled={sending}
                      className="
                        flex-1
                        min-h-[56px]
                        max-h-[130px]
                        resize-none
                        bg-black/40
                        border
                        border-white/20
                        rounded-2xl
                        px-4
                        py-3
                        text-white
                        placeholder:text-slate-500
                        focus:outline-none
                        focus:border-purple-500
                        transition
                      "
                    />

                    <button
                      type="submit"
                      disabled={
                        sending ||
                        !draft.trim()
                      }
                      className="
                        shrink-0
                        h-14
                        px-5
                        sm:px-6
                        rounded-2xl
                        bg-purple-600
                        hover:bg-purple-500
                        disabled:bg-slate-700
                        disabled:text-slate-500
                        text-white
                        font-bold
                        transition
                        disabled:cursor-not-allowed
                      "
                    >
                      {sending
                        ? "..."
                        : "GÖNDER"}
                    </button>

                  </div>

                  <p className="text-[10px] text-slate-600 mt-2 px-1">
                    Enter ile gönder •
                    Shift + Enter ile yeni satır
                  </p>

                </form>

              </>

            ) : (

              /* SEÇİLİ KULLANICI YOK */

              <div className="flex-1 flex items-center justify-center p-6">

                <div className="text-center max-w-md">

                  <div className="text-6xl mb-5">
                    💬
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-300">
                    Sohbet başlat
                  </h2>

                  <p className="text-sm sm:text-base text-slate-500 mt-3">
                    Sol taraftan bir konuşma seç veya bir profilden “Mesaj Gönder” seçeneğine tıkla.
                  </p>

                  {targetUserId &&
                    !loadingConversations && (
                      <p className="text-xs text-purple-400 mt-5">
                        Kullanıcı bilgileri yükleniyor...
                      </p>
                    )}

                </div>

              </div>

            )}

          </section>

        </div>

        {/* =================================================
            PREMIUM + BİREBİR CANLI GÖRÜŞME
            ================================================= */}

        <section
          className="
            max-w-3xl
            mx-auto
            mt-5
            sm:mt-6
            bg-gradient-to-b
            from-purple-900/20
            to-pink-900/10
            backdrop-blur-xl
            border
            border-purple-500/30
            rounded-[28px]
            px-5
            py-6
            sm:p-7
            text-center
            shadow-2xl
          "
        >

          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFC000]/30 bg-[#FFC000]/10 px-4 py-1.5 text-xs font-bold text-[#FFC000]">
            👑 PREMIUM ÖZELLİĞİ
          </div>

          <h2
            className="
              mt-4
              text-lg
              sm:text-2xl
              font-bold
              tracking-wide
              text-transparent
              bg-clip-text
              bg-gradient-to-r
              from-purple-400
              to-pink-400
              leading-snug
            "
          >
            🎥 BEĞENİP EŞLEŞTİĞİN KİŞİYLE
            <span className="block">
              BİREBİR CANLI GÖRÜŞ
            </span>
          </h2>

          <p
            className="
              text-sm
              sm:text-base
              leading-6
              text-slate-400
              mt-3
              mb-5
              max-w-2xl
              mx-auto
            "
          >
            Eşleştiğin kişiyle birebir canlı
            görüntülü konuş. Bu özellik Premium
            üyelerimize özeldir.
          </p>

          {!isPremium && (
            <div className="mb-5 rounded-2xl border border-[#FFC000]/20 bg-[#FFC000]/5 px-4 py-3 text-sm text-white/80">
              <span className="font-bold text-[#FFC000]">
                👑 Premium'a geç
              </span>{" "}
              ve eşleştiğin kişilerle birebir canlı
              görüntülü görüşmenin keyfini çıkar.
            </div>
          )}

          <div className="max-w-md mx-auto">

            <button
              type="button"
              onClick={() => {
                if (!isPremium) {
                  window.location.href = "/premium";
                  return;
                }

                const width = 450;
                const height = 650;

                const left =
                  Math.max(
                    0,
                    (
                      window.screen
                        .width -
                      width
                    ) / 2,
                  );

                const top =
                  Math.max(
                    0,
                    (
                      window.screen
                        .height -
                      height
                    ) / 2,
                  );

                window.open(
                  "/canavar-video",
                  "EgeloveLivePopup",
                  `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no,status=no,location=no,toolbar=no,menubar=no`,
                );
              }}
              className="
                w-full
                bg-gradient-to-r
                from-purple-600
                to-blue-500
                hover:from-purple-500
                hover:to-blue-400
                text-white
                font-bold
                py-4
                px-6
                rounded-2xl
                text-sm
                tracking-wide
                transition-all
                shadow-lg
                active:scale-[0.98]
              "
            >
              {isPremium ? (
                <>
                  🚀 GÖRÜNTÜLÜ KONUŞMAYI
                  BAŞLAT
                </>
              ) : (
                <>
                  👑 PREMIUM'A GEÇ
                </>
              )}
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

/* =========================================================
   NEXT.JS SUSPENSE
   ========================================================= */

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#121420] text-white flex items-center justify-center">
          <div className="text-slate-400 font-semibold">
            Mesajlar yükleniyor...
          </div>
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
