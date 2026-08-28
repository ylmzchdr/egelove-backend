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
     YENİ MESAJLAR UI — NEON / PREMIUM
     ======================================================= */

  const activeName = getUserName(activeUser);
  const activeImage = getProfileImage(activeUser);
  const activeCity = safeString(activeUser?.city) || "Türkiye";

  const goDashboard = () => {
    window.location.href = "/dashboard";
  };

  const goPremium = () => {
    window.location.href = "/premium";
  };

  const openVideo = () => {
    if (!isPremium) {
      goPremium();
      return;
    }

    const width = 450;
    const height = 650;
    const left = Math.max(0, (window.screen.width - width) / 2);
    const top = Math.max(0, (window.screen.height - height) / 2);

    window.open(
      "/canavar-video",
      "EgeloveLivePopup",
      `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no,status=no,location=no,toolbar=no,menubar=no`,
    );
  };

  const avatar = (user: User | null | undefined, size = "h-12 w-12") => {
    const image = getProfileImage(user);
    const name = getUserName(user);

    if (image) {
      return (
        <img
          src={image}
          alt={name}
          className={`${size} shrink-0 rounded-full object-cover ring-1 ring-white/20`}
        />
      );
    }

    return (
      <div
        className={`${size} shrink-0 rounded-full bg-gradient-to-br from-fuchsia-500 via-violet-500 to-blue-500 flex items-center justify-center font-black text-white ring-1 ring-white/20`}
      >
        {name.slice(0, 1).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white overflow-x-hidden">
      {/* ÜST NAV */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020817]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-[1450px] items-center gap-6 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={goDashboard}
            className="mr-auto flex items-center gap-2 text-xl font-black tracking-tight sm:text-2xl"
          >
            <span className="text-3xl text-pink-500">♥</span>
            <span>egelove</span>
          </button>

          <nav className="hidden items-center gap-8 lg:flex">
            <button type="button" onClick={goDashboard} className="font-semibold text-white/90 hover:text-white">Ana Sayfa</button>
            <button type="button" onClick={() => (window.location.href = "/profile")} className="font-semibold text-white/90 hover:text-white">Benim Sayfam</button>
            <button type="button" onClick={() => (window.location.href = "/likes")} className="font-semibold text-white/90 hover:text-white">Beğeniler</button>
            <button type="button" className="relative font-semibold text-pink-400 after:absolute after:-bottom-6 after:left-0 after:right-0 after:h-0.5 after:bg-pink-500">Mesajlar</button>
            <button type="button" onClick={goPremium} className="font-semibold text-white/90 hover:text-white">Premium 👑</button>
          </nav>

          <div className="hidden items-center gap-1 sm:flex">
            {(["TR", "EN", "RU", "AR"] as const).map((lang, index) => (
              <button
                key={lang}
                type="button"
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${index === 0 ? "border-purple-500 bg-purple-600 text-white shadow-lg shadow-purple-500/30" : "border-white/10 bg-black/20 text-white/80 hover:bg-white/10"}`}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="hidden rounded-xl border border-[#ffc000]/50 bg-[#ffc000] px-5 py-3 font-black text-black shadow-lg shadow-yellow-500/10 sm:block"
          >
            Hoş geldin
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              window.location.href = "/";
            }}
            className="rounded-xl bg-white px-4 py-3 font-bold text-black hover:bg-white/90"
          >
            Çıkış
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1450px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <button
          type="button"
          onClick={goDashboard}
          className="mb-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-5 py-3 font-black shadow-lg shadow-purple-600/30 transition hover:scale-[1.01]"
        >
          <span className="text-xl">←</span>
          ANA SAYFAYA GERİ DÖN
        </button>

        {/* PREMIUM VIDEO HERO */}
        <section className="relative overflow-hidden rounded-[28px] border border-fuchsia-500/60 bg-[radial-gradient(circle_at_15%_55%,rgba(168,85,247,.30),transparent_30%),radial-gradient(circle_at_92%_55%,rgba(37,99,235,.28),transparent_34%),linear-gradient(110deg,#18052b,#080d2b_55%,#06164a)] p-4 shadow-2xl shadow-purple-950/40 sm:p-6 lg:p-7">
          <div className="pointer-events-none absolute -left-20 top-10 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative grid items-center gap-7 lg:grid-cols-[330px_1fr_330px]">
            <div className="hidden min-h-[210px] items-center justify-center lg:flex">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 via-purple-500 to-blue-600 shadow-[0_0_70px_rgba(168,85,247,.65)]">
                <div className="absolute inset-4 rounded-full border border-white/30" />
                <span className="relative text-7xl text-white drop-shadow-lg">▣</span>
                <span className="absolute -left-10 top-6 text-2xl text-pink-400">♥</span>
                <span className="absolute -right-9 top-16 text-2xl text-purple-400">♥</span>
                <span className="absolute -left-4 bottom-2 text-lg text-fuchsia-300">✦</span>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-black leading-tight sm:text-3xl lg:text-[34px]">
                BİREBİR CANLI <span className="bg-gradient-to-r from-fuchsia-400 to-pink-500 bg-clip-text text-transparent">GÖRÜNTÜLÜ GÖRÜŞME</span>
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
                Beğenip eşleştiğin kişilerle birebir canlı görüntülü konuş.
                <br className="hidden sm:block" />
                Yeni insanları sadece mesajlaşarak değil, yüz yüze tanımanın keyfini yaşa.
              </p>

              <div className="mx-auto mt-7 grid max-w-2xl grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
                {[
                  ["♙", "Güvenli", "Görüşmeler", "text-emerald-400"],
                  ["♣", "Gerçek", "Kişiler", "text-purple-400"],
                  ["ϟ", "Anında", "Bağlantı", "text-yellow-400"],
                  ["♥", "Daha Yakın", "Bağlar", "text-pink-400"],
                ].map(([icon, title, sub, color]) => (
                  <div key={title} className="px-2 py-2 sm:px-4">
                    <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-current text-xl ${color}`}>{icon}</div>
                    <div className="font-semibold text-white">{title}</div>
                    <div className="text-sm text-white/80">{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-purple-500/40 bg-[#0a1233]/70 p-4 shadow-xl backdrop-blur-xl sm:p-5">
              <div className="mx-auto -mt-8 mb-4 w-fit rounded-full border border-[#ffc000]/50 bg-[#130d28] px-4 py-2 text-sm font-black text-[#ffc000]">👑 PREMIUM ÖZELLİĞİ</div>
              <ul className="space-y-3 text-sm sm:text-base">
                {[
                  "Sınırsız görüntülü görüşme",
                  "Okundu bilgisi",
                  "Profilini öne çıkar",
                  "Reklamsız kullanım",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-black">✓</span>{item}</li>
                ))}
              </ul>
              <button type="button" onClick={goPremium} className="mt-5 w-full rounded-full bg-gradient-to-r from-[#ffc000] to-[#ffb000] px-5 py-3 font-black text-black shadow-lg shadow-yellow-500/20 transition hover:scale-[1.01]">👑 PREMIUM'A GEÇ</button>
              <p className="mt-2 text-center text-xs text-white/50">Bu özellik Premium üyelikle kullanılabilir.</p>
            </div>
          </div>
        </section>

        {/* MESAJLAR + AKTİF SOHBET */}
        <section className="mt-5 grid gap-5 lg:grid-cols-[420px_1fr]">
          {/* SOL PANEL */}
          <aside className="flex min-h-[650px] flex-col overflow-hidden rounded-[26px] border border-purple-500/30 bg-[#050c20]/85 shadow-2xl shadow-black/20">
            <div className="border-b border-white/10 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black">Mesajlar</h2>
                <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 text-2xl font-light shadow-lg shadow-purple-500/30">+</button>
              </div>

              <div className="mt-5 grid grid-cols-4 gap-2">
                {[
                  ["all", "Tümü"],
                  ["incoming", "Yeni"],
                  ["outgoing", "Çevrimiçi"],
                  ["all", "Favoriler"],
                ].map(([value, label], index) => (
                  <button
                    key={`${value}-${label}`}
                    type="button"
                    onClick={() => setMessageFilter(value as any)}
                    className={`rounded-full border px-2 py-2.5 text-xs font-bold sm:text-sm ${index === 0 && messageFilter === "all" ? "border-purple-500 bg-gradient-to-r from-purple-600 to-fuchsia-500" : "border-white/10 bg-white/[0.02] text-white/75 hover:bg-white/10"}`}
                  >
                    {label}{label === "Yeni" ? <span className="ml-1 text-pink-500">●</span> : label === "Çevrimiçi" ? <span className="ml-1 text-emerald-400">●</span> : ""}
                  </button>
                ))}
              </div>

              <div className="relative mt-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">⌕</span>
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Ara..."
                  className="h-12 w-full rounded-2xl border border-white/15 bg-black/35 pl-11 pr-4 text-white outline-none transition focus:border-purple-500"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {loadingConversations ? (
                <div className="flex h-64 items-center justify-center text-white/50">Mesajlar yükleniyor...</div>
              ) : filteredConversations.length ? (
                filteredConversations.map((conversation) => {
                  const user = conversation.participant ?? conversation.user ?? null;
                  const isActive = String(selectedConversationId) === String(conversation.id);
                  const last = conversation.lastMessage?.content || "Henüz mesaj yok";
                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => openConversation(conversation)}
                      className={`flex w-full items-center gap-3 border-b border-white/[0.06] px-4 py-3 text-left transition ${isActive ? "bg-gradient-to-r from-purple-700/70 via-fuchsia-700/40 to-transparent ring-1 ring-inset ring-fuchsia-500" : "hover:bg-white/[0.05]"}`}
                    >
                      {avatar(user, "h-12 w-12")}
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate font-black">{getUserName(user)}</span>
                          <span className="text-xs text-white/45">{conversation.updatedAt ? formatTime(conversation.updatedAt) : ""}</span>
                        </span>
                        <span className="mt-1 flex items-center gap-1 truncate text-sm text-white/55">
                          <span className="text-yellow-400">▮</span>{last}
                        </span>
                      </span>
                      {conversation.unreadCount ? <span className="rounded-full bg-pink-500 px-2 py-0.5 text-xs font-black">{conversation.unreadCount}</span> : null}
                    </button>
                  );
                })
              ) : (
                <div className="flex h-64 flex-col items-center justify-center px-6 text-center text-white/50">
                  <div className="mb-3 text-5xl">💬</div>
                  <p className="font-bold">Henüz mesaj yok</p>
                  <p className="mt-2 text-sm">Beğendiğin kişilerle eşleştiğinde burada konuşmalarını göreceksin.</p>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 px-5 py-3 text-center text-sm text-white/60">
              <span className="text-pink-500">♥</span> Toplam {filteredConversations.length || conversations.length} konuşma
            </div>
          </aside>

          {/* SAĞ SOHBET */}
          <section className="flex min-h-[650px] flex-col overflow-hidden rounded-[26px] border border-purple-500/30 bg-[#050b20]/85 shadow-2xl shadow-black/20">
            {activeConversation ? (
              <>
                <div className="flex flex-wrap items-center gap-3 border-b border-white/10 p-4 sm:p-5">
                  {avatar(activeUser, "h-14 w-14")}
                  <div className="mr-auto min-w-[170px]">
                    <h2 className="text-xl font-black sm:text-2xl">{activeName}</h2>
                    <p className="text-sm text-white/65">{activeUser?.city ? `24 • ${activeCity}` : activeCity}</p>
                  </div>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-bold text-emerald-400">● Çevrimiçi</span>
                  <button type="button" className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 text-2xl text-pink-400 hover:bg-white/10 sm:flex">♡</button>
                  <button type="button" className="px-1 text-xl text-white/60">⋮</button>
                  <button type="button" onClick={openVideo} className="rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-5 py-3 text-sm font-black shadow-lg shadow-purple-600/30 transition hover:scale-[1.01] sm:text-base">👑 Premium ile Görüntülü Görüş</button>
                </div>

                <div className="relative flex-1 overflow-y-auto bg-[radial-gradient(circle_at_60%_50%,rgba(79,70,229,.10),transparent_35%)] p-5 sm:p-8">
                  <div className="mb-7 flex items-center gap-4 text-xs text-white/35"><span className="h-px flex-1 bg-white/10" />Bugün<span className="h-px flex-1 bg-white/10" /></div>

                  {loadingMessages ? (
                    <div className="flex h-56 items-center justify-center text-white/45">Mesajlar yükleniyor...</div>
                  ) : messages.length ? (
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const mine = !!message.isMine;
                        return (
                          <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[78%] rounded-[20px] px-5 py-3 ${mine ? "bg-gradient-to-br from-purple-600 to-fuchsia-600 shadow-lg shadow-purple-900/20" : "bg-[#17254b]"}`}>
                              <div className="text-base leading-6">{message.content}</div>
                              <div className="mt-1 text-right text-[11px] text-white/45">{message.createdAt ? formatTime(message.createdAt) : ""}{mine ? "  ✓✓" : ""}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex h-56 items-center justify-center text-white/40">Bu konuşmada henüz mesaj yok.</div>
                  )}
                </div>

                {error && <div className="border-t border-red-500/20 bg-red-500/10 px-5 py-3 text-sm text-red-300">{error}</div>}

                <form onSubmit={handleSend} className="border-t border-white/10 bg-[#080e25] p-4 sm:p-5">
                  <div className="flex items-end gap-3">
                    <button type="button" className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-2xl sm:flex">☺</button>
                    <textarea
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          if (draft.trim() && !sending) event.currentTarget.form?.requestSubmit();
                        }
                      }}
                      placeholder="Mesajını yaz..."
                      rows={2}
                      disabled={sending}
                      className="min-h-[58px] flex-1 resize-none rounded-2xl border border-white/15 bg-black/35 px-4 py-3 text-white outline-none transition focus:border-purple-500"
                    />
                    <button type="submit" disabled={sending || !draft.trim()} className="h-14 shrink-0 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-6 font-black shadow-lg shadow-purple-700/20 disabled:cursor-not-allowed disabled:opacity-40">{sending ? "..." : "➤ GÖNDER"}</button>
                  </div>
                  <p className="mt-2 pl-1 text-[10px] text-white/35">Enter ile gönder • Shift + Enter ile yeni satır</p>
                </form>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-8 text-center">
                <div className="max-w-md">
                  <div className="mb-5 text-6xl">💬</div>
                  <h2 className="text-2xl font-black">Sohbet başlat</h2>
                  <p className="mt-3 text-white/50">Sol taraftan bir konuşma seç. Eşleştiğin kişiyle mesajlaşmaya hemen başlayabilirsin.</p>
                </div>
              </div>
            )}
          </section>
        </section>

        {/* ALT PREMIUM CTA */}
        <section className="mt-5 overflow-hidden rounded-[26px] border border-purple-500/50 bg-[radial-gradient(circle_at_12%_50%,rgba(168,85,247,.32),transparent_30%),linear-gradient(100deg,#17062d,#081129_55%,#071b49)] p-5 shadow-2xl sm:p-7">
          <div className="grid items-center gap-6 lg:grid-cols-[260px_1fr_1fr_270px]">
            <div className="hidden items-center justify-center lg:flex">
              <div className="relative flex h-40 w-48 items-end justify-center rounded-[30px] bg-gradient-to-t from-purple-950/80 to-transparent">
                <div className="absolute bottom-2 h-16 w-40 rounded-full bg-gradient-to-r from-purple-700 to-blue-600 shadow-[0_0_45px_rgba(139,92,246,.65)]" />
                <div className="relative mb-10 text-7xl drop-shadow-[0_0_20px_rgba(255,192,0,.55)]">👑</div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-black leading-tight">Bu ve daha fazlası için</h2>
              <h3 className="mt-1 text-4xl font-black text-transparent bg-gradient-to-r from-fuchsia-400 to-pink-500 bg-clip-text">Premium’a geç!</h3>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/65">Canlı görüntülü görüşme, okundu bilgisi, profilini öne çıkarma, reklamsız kullanım ve daha birçok avantaj seni bekliyor.</p>
            </div>
            <ul className="space-y-3 text-base text-white/85">
              {["Sınırsız görüntülü görüşme", "Okundu bilgisi", "Profilini öne çıkar", "Reklamsız kullanım", "Özel filtreler ve daha fazlası"].map((item) => (
                <li key={item} className="flex items-center gap-3"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-black">✓</span>{item}</li>
              ))}
            </ul>
            <div>
              <button type="button" onClick={goPremium} className="w-full rounded-full bg-gradient-to-r from-[#ffc000] to-[#ffb000] px-5 py-4 text-lg font-black text-black shadow-xl shadow-yellow-500/20 transition hover:scale-[1.01]">👑 PREMIUM’A GEÇ</button>
              <p className="mt-4 text-center text-sm text-white/55">♡ Güvenli ve hızlı ödeme</p>
            </div>
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
        <div className="flex min-h-screen items-center justify-center bg-[#020817] text-white">
          <div className="font-semibold text-white/50">Mesajlar yükleniyor...</div>
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
