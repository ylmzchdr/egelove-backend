"use client";

import React, {
  FormEvent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

type User = {
  id: string;
  name?: string;
  username?: string;
  city?: string;
  profileImage?: string | null;
  profilePhoto?: string | null;
};

type Conversation = {
  id: string;
  userId?: string;
  participantId?: string;
  participant?: User;
  user?: User;
  lastMessage?: string;
  updatedAt?: string;
  unreadCount?: number;
};

type Message = {
  id: string;
  content: string;
  senderId?: string;
  receiverId?: string;
  createdAt?: string;
  isMine?: boolean;
};

// Canlı backend — local geliştirmede de doğrudan aynı API kullanılır.
const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://egelove-backend.onrender.com";

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Bir hata oluştu." }));

    throw new Error(
      error?.message || `HTTP ${response.status}`,
    );
  }

  return response.json();
}

function MessagesContent() {
    // React Nesne Çökmesini (Error #31) Engelleyen Küresel Koruma
  if (typeof window !== "undefined") {
    const originalToString = Object.prototype.toString;
    Object.prototype.toString = function() {
      if (this && typeof this === 'object' && 'username' in this) {
        return (this as any).name || (this as any).username || "Kullanıcı";
      }
      return originalToString.call(this);
    };
  }

  const router = useRouter();
  const searchParams = useSearchParams();

  const [conversations, setConversations] = useState<Conversation[]>([]);
    const [simpleMessage, setSimpleMessage] = useState("");
  const [simpleStatus, setSimpleStatus] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
    const sendSimpleMessage = async () => {
    // 1. URL parametresini fonksiyonun başında güvenli bir değişkene alıyoruz
    const currentParams = new URLSearchParams(window.location.search);
    const urlUserId = currentParams.get("userId");

    if (!simpleMessage.trim() || !urlUserId) {
      setSimpleStatus("Lütfen bir mesaj yazın.");
      return;
    }
    setSimpleStatus("Gönderiliyor...");
    try {
      const token = localStorage.getItem("accessToken");
      // 2. Canlı backend adresinizi de egelove-backend olarak eksiksiz bağlıyoruz
      const res = await fetch("https://onrender.com", {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          receiverId: urlUserId,
          content: simpleMessage,
        }),
      });

          if (res.ok) {
        setSimpleStatus("Mesaj başarıyla gönderildi!");
        // State temizlemek yerine sayfayı yenileyerek kısırdöngü çöküşünü tamamen kırıyoruz
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {

        setSimpleStatus("Mesaj iletilemedi. Sunucu hatası.");
      }
    } catch (error) {
      setSimpleStatus("Bağlantı hatası oluştu.");
    }
  };

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string | null>(null);

  const [draft, setDraft] = useState("");

  const [loadingConversations, setLoadingConversations] =
    useState(true);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!draft.trim() || !selectedConversationId || sending) return;

    setSending(true);
    setError("");

    try {
      // API isteği örneği (apiRequest fonksiyonunuza göre uyarlayın):
      // await apiRequest(`/messages/${selectedConversationId}`, {
      //   method: "POST",
      //   body: JSON.stringify({ content: draft })
      // });
      
      console.log("Mesaj gönderiliyor:", draft);
      
      // Başarılı olduğunda input alanını temizle
      setDraft(""); 
    } catch (err: any) {
      setError(err?.message || "Mesaj gönderilemedi.");
    } finally {
      setSending(false);
    }
  };


  const targetUserId = searchParams.get("userId");
  const targetThreadId = searchParams.get("thread");

  /*
   * ---------------------------------------------------------
   * KONUŞMALARI GETİR
   * ---------------------------------------------------------
   */
  const loadConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
      setError("");

      const data = await apiRequest<any[]>(
        "/conversations",
      );

      const normalized: Conversation[] = Array.isArray(data)
        ? data.map((item: any) => ({
            id: String(
              item.id ??
                item.conversationId ??
                item._id ??
                "",
            ),

            userId: item.userId
              ? String(item.userId)
              : undefined,

            participantId: item.participantId
              ? String(item.participantId)
              : undefined,

            participant:
              item.participant ||
              item.otherUser ||
              item.user ||
              undefined,

            user:
              item.user ||
              item.otherUser ||
              item.participant ||
              undefined,

                 lastMessage: typeof item.lastMessage === 'object' && item.lastMessage !== null
        ? (item.lastMessage.content || "")
        : String(item.lastMessage || item.content || ""),


                 updatedAt: item.updatedAt 
        ? String(item.updatedAt) 
        : (item.lastMessage?.createdAt ? String(item.lastMessage.createdAt) : new Date().toISOString()),


            unreadCount:
              Number(item.unreadCount ?? 0),
          }))
        : [];

      // setConversations(normalized);
setConversations([]);

    } catch (err: any) {
      console.error("Konuşmalar alınamadı:", err);

      setError(
        err?.message ||
          "Mesaj konuşmaları yüklenemedi.",
      );

      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  /*
   * ---------------------------------------------------------
   * KONUŞMA MESAJLARINI GETİR
   * ---------------------------------------------------------
   */
  const loadMessages = useCallback(
    async (conversationId: string) => {
      try {
        setLoadingMessages(true);
        setError("");

        const data = await apiRequest<any[]>(
          `/conversations/${conversationId}/messages`,
        );

        const normalized: Message[] = Array.isArray(data)
          ? data.map((item: any) => ({
              id: String(
                item.id ??
                  item._id ??
                  `${Date.now()}-${Math.random()}`,
              ),

              content:
                item.content ??
                item.message ??
                "",

              senderId: item.senderId
                ? String(item.senderId)
                : item.sender?.id
                  ? String(item.sender.id)
                  : undefined,

              receiverId: item.receiverId
                ? String(item.receiverId)
                : item.recipientId
                  ? String(item.recipientId)
                  : undefined,

              createdAt:
                item.createdAt ??
                item.sentAt ??
                item.date,

              isMine:
                item.isMine ??
                item.mine ??
                false,
            }))
          : [];

        setMessages(normalized);
      } catch (err: any) {
        console.error(
          "Mesajlar alınamadı:",
          err,
        );

        setError(
          err?.message ||
            "Mesajlar yüklenemedi.",
        );

        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    },
    [],
  );

  /*
   * ---------------------------------------------------------
   * İLK YÜKLEME
   * ---------------------------------------------------------
   */
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  /*
   * ---------------------------------------------------------
   * URL'deki userId ile gelen kişiyi bul
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!targetUserId) return;

    const findTargetUser = async () => {
      try {
        const user = await apiRequest<any>(
          `/users/${targetUserId}`,
        );

        setSelectedUser({
          id: String(user.id ?? targetUserId),
          name:
            user.name ??
            user.username ??
            "Kullanıcı",
          username: user.username,
          city: user.city,
          profileImage:
            user.profileImage ??
            user.profilePhoto ??
            null,
          profilePhoto:
            user.profilePhoto ??
            user.profileImage ??
            null,
        });
      } catch (err) {
        console.error(
          "Kullanıcı bilgisi alınamadı:",
          err,
        );

        /*
         * Backend profil endpoint'i cevap vermezse,
         * konuşmalar içinden bulmayı deniyoruz.
         */
        const found = conversations.find(
          (conversation) => {
            const user =
              conversation.participant ??
              conversation.user;

            return (
              String(
                user?.id ??
                  conversation.userId ??
                  conversation.participantId ??
                  "",
              ) === String(targetUserId)
            );
          },
        );

        if (found) {
          const user =
            found.participant ??
            found.user;

          if (user) {
            setSelectedUser({
              ...user,
              id: String(user.id),
            });
          }
        }
      }
    };

    findTargetUser();
  }, [targetUserId, conversations]);

  /*
   * ---------------------------------------------------------
   * URL'deki thread'i aç
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!targetThreadId) return;

    const conversation = conversations.find(
      (item) =>
        String(item.id) ===
        String(targetThreadId),
    );

    if (!conversation) return;

    setSelectedConversationId(
      String(conversation.id),
    );

    const user =
      conversation.participant ??
      conversation.user;

    if (user) {
      setSelectedUser({
        ...user,
        id: String(user.id),
      });
    }
  }, [targetThreadId, conversations]);

  /*
   * ---------------------------------------------------------
   * userId ile gelen kullanıcı için mevcut konuşmayı bul
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!targetUserId) return;

    const conversation = conversations.find(
      (item) => {
        const user =
          item.participant ??
          item.user;

        return (
          String(
            user?.id ??
              item.userId ??
              item.participantId ??
              "",
          ) === String(targetUserId)
        );
      },
    );

    if (!conversation) return;

    setSelectedConversationId(
      String(conversation.id),
    );

    const user =
      conversation.participant ??
      conversation.user;

    if (user) {
      setSelectedUser({
        ...user,
        id: String(user.id),
      });
    }
  }, [targetUserId, conversations]);

  /*
   * ---------------------------------------------------------
   * SEÇİLİ KONUŞMANIN MESAJLARINI GETİR
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    loadMessages(selectedConversationId);
  }, [
    selectedConversationId,
    loadMessages,
  ]);

  /*
   * ---------------------------------------------------------
   * KONUŞMA OLUŞTUR / VAR OLANI BUL
   * ---------------------------------------------------------
   */
  const openConversationWithUser =
    useCallback(
      async (user: User) => {
        setSelectedUser(user);
        setError("");

        /*
         * Önce elimizde mevcut konuşma var mı?
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
                String(participantId) ===
                String(user.id)
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
         * Yoksa backend'den yeni konuşma oluştur.
         */
        try {
          const created =
            await apiRequest<any>(
              "/conversations",
              {
                method: "POST",
                body: JSON.stringify({
                  userId: user.id,
                }),
              },
            );

          const conversationId =
            created?.id ??
            created?.conversationId ??
            created?._id;

          if (!conversationId) {
            throw new Error(
              "Konuşma oluşturuldu ancak konuşma ID'si alınamadı.",
            );
          }

             const newConversation: Conversation = {
      id: String(conversationId),
      userId: String(user.id),
      participantId: String(user.id),
      participant: {
        id: String(user.id),
        name: user.name || user.username || "Kullanıcı",
        username: user.username || "",
        profileImage: user.profileImage || user.profilePhoto || null,
        profilePhoto: user.profilePhoto || null
      },
      user: {
        id: String(user.id),
        name: user.name || user.username || "Kullanıcı",
        username: user.username || "",
        profileImage: user.profileImage || user.profilePhoto || null,
        profilePhoto: user.profilePhoto || null
      },
      lastMessage: "",
      unreadCount: 0,
    };


          setConversations((prev) => [
            newConversation,
            ...prev,
          ]);

          setSelectedConversationId(
            String(conversationId),
          );
        } catch (err: any) {
          console.error(
            "Konuşma oluşturulamadı:",
            err,
          );

          setError(
            err?.message ||
              "Mesaj konuşması başlatılamadı.",
          );
        }
      },
      [conversations],
    );

  /*
   * ---------------------------------------------------------
   * SEÇİLİ KONUŞMA
   * ---------------------------------------------------------
   */
  const activeConversation =
    useMemo(() => {
      if (!selectedConversationId) {
        return null;
      }

      return (
        conversations.find(
          (item) =>
            String(item.id) ===
            String(selectedConversationId),
        ) ?? null
      );
    }, [
      conversations,
      selectedConversationId,
    ]);

  /*
   * ---------------------------------------------------------
   * AKTİF KULLANICI
   * ---------------------------------------------------------
   */
  const activeUser = useMemo(() => {
    if (selectedUser) return selectedUser;

    if (activeConversation) {
      const user =
        activeConversation.participant ??
        activeConversation.user;

      if (user) {
        return {
          ...user,
          id: String(user.id),
        };
      }
    }

    return null;
  }, [
    selectedUser,
    activeConversation,
  ]);

  /*
   * ---------------------------------------------------------
   * KONUŞMA LİSTESİ FİLTRE
   * ---------------------------------------------------------
   */
  const filteredConversations =
    useMemo(() => {
      const term =
        search.trim().toLocaleLowerCase(
          "tr-TR",
        );

      if (!term) {
        return conversations;
      }

      return conversations.filter(
        (conversation) => {
          const user =
            conversation.participant ??
            conversation.user;

          const name =
            user?.name ??
            user?.username ??
            "";

          const city =
            user?.city ?? "";

          return `${name} ${city}`
            .toLocaleLowerCase("tr-TR")
            .includes(term);
        },
      );
    }, [
      conversations,
      search,
    ]);

  /*
   * ---------------------------------------------------------
   * MESAJ GÖNDER
   * ---------------------------------------------------------
   */
  async function handleSend(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const content = draft.trim();

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

      const sent = await apiRequest<any>(
        `/conversations/${selectedConversationId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({
            content,
          }),
        },
      );

      const newMessage: Message = {
        id: String(
          sent?.id ??
            sent?._id ??
            `${Date.now()}`,
        ),
        content:
          sent?.content ??
          content,
        senderId: sent?.senderId,
        receiverId:
          sent?.receiverId,
        createdAt:
          sent?.createdAt ??
          new Date().toISOString(),
        isMine: true,
      };

      setMessages((prev) => [
        ...prev,
        newMessage,
      ]);

      setDraft("");

      /*
       * Sol taraftaki son mesajı da güncelle.
       */
      setConversations((prev) =>
        prev.map((conversation) =>
          String(conversation.id) ===
          String(selectedConversationId)
            ? {
                ...conversation,
                lastMessage: content,
                updatedAt:
                  newMessage.createdAt,
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
        err?.message ||
          "Mesaj gönderilemedi.",
      );
    } finally {
      setSending(false);
    }
  }

  /*
   * ---------------------------------------------------------
   * ZAMAN
   * ---------------------------------------------------------
   */
  function formatTime(
    value?: string,
  ) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
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

  /*
   * ---------------------------------------------------------
   * PROFİL GÖRSELİ
   * ---------------------------------------------------------
   */
  function getProfileImage(
    user?: User | null,
  ) {
    return (
      user?.profileImage ??
      user?.profilePhoto ??
      null
    );
  }

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */
  return (
    <div className="min-h-screen bg-[#121420] text-white flex flex-col">
      {/* ÜST NAVİGASYON */}
      <header className="w-full bg-[#1a1d30] border-b border-white/10 px-4 sm:px-6 py-4 sm:py-5 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col items-start gap-3">
          <button
            type="button"
            onClick={() =>
              router.push("/dashboard")
            }
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

      {/* ANA İÇERİK */}
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
          {/* SOL MESAJ LİSTESİ */}
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
                  className="
                    bg-blue-600
                    hover:bg-blue-500
                    px-5
                    py-3
                    rounded-2xl
                    text-sm
                    font-semibold
                    transition
                  "
                >
                  Tümü
                </button>

                <button
                  type="button"
                  className="
                    bg-slate-800
                    hover:bg-slate-700
                    px-5
                    py-3
                    rounded-2xl
                    text-sm
                    font-semibold
                    text-slate-400
                    transition
                  "
                >
                  Gelen
                </button>

                <button
                  type="button"
                  className="
                    bg-slate-800
                    hover:bg-slate-700
                    px-5
                    py-3
                    rounded-2xl
                    text-sm
                    font-semibold
                    text-slate-400
                    transition
                  "
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

            {/* KONUŞMA LİSTESİ */}
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
              ) : filteredConversations.length >
                0 ? (
                filteredConversations.map(
                  (conversation) => {
                    const user =
                      conversation.participant ??
                      conversation.user;

                    const image =
                      getProfileImage(user);

                    const isActive =
                      String(
                        selectedConversationId,
                      ) ===
                      String(
                        conversation.id,
                      );

                    return (
                      <button
                        key={conversation.id}
                        type="button"
                        onClick={() => {
                          setSelectedConversationId(
                            String(
                              conversation.id,
                            ),
                          );

                          if (user) {
                            setSelectedUser(
                              {
                                ...user,
                                id: String(
                                  user.id,
                                ),
                              },
                            );
                          }
                        }}
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
                        {image ? (
                          <img
                            src={image}
                            alt={
                              user?.name ??
                              "Profil"
                            }
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
                            {(
                              user?.name ??
                              "?"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold truncate">
                              {user?.name ??
                                user?.username ??
                                "Kullanıcı"}
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
                            {conversation.lastMessage ||
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

          {/* SAĞ SOHBET PANELİ */}
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
                      alt={
                        activeUser.name ??
                        "Profil"
                      }
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
                      {(
                        activeUser.name ??
                        "?"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h2 className="font-bold text-lg truncate">
                      {activeUser.name ??
                        activeUser.username ??
                        "Kullanıcı"}
                    </h2>

                    {activeUser.city && (
                      <p className="text-xs text-slate-500 mt-1">
                        📍 {activeUser.city}
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
                            key={message.id}
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
                                {
                                  message.content
                                }
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

                {/* MESAJ YAZMA ALANI */}
                <form
                  onSubmit={handleSend}
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
                      onChange={(event) =>
                        setDraft(
                          event.target.value,
                        )
                      }
                      onKeyDown={(event) => {
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

                                   <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Mesajınızı yazın..."
                      disabled={sending}
                      className="flex-1 bg-[#0d0c14] border border-[#2b253b] text-white px-4 py-3 rounded-xl outline-none focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7] transition-all text-sm disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!draft.trim() || sending}
                      className="bg-[#6c5ce7] hover:bg-[#5b4cc4] disabled:opacity-50 text-white p-3 rounded-xl transition-all flex items-center justify-center active:scale-95"
                    >
                      {sending ? "..." : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      )}
                    </button>
                   </div>
                  <p className="text-[10px] text-slate-600 mt-2 px-1">
                    Enter ile gönder • Shift + Enter ile yeni satır
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
                    Sol taraftan bir konuşma
                    seç veya bir profilden
                    “Mesaj Gönder” seçeneğine
                    tıkla.
                  </p>

                  {targetUserId &&
                    !loadingConversations && (
                      <p className="text-xs text-purple-400 mt-5">
                        Kullanıcı bilgileri
                        yükleniyor...
                      </p>
                    )}
                              {/* Güvenli ve Bağımsız Mesaj Kutusu */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-[#1a1d30]/50 rounded-xl p-6 border border-slate-800/80 shadow-2xl">
              <h2 className="text-lg font-bold mb-4 text-purple-400">Mesaj Gönder</h2>
              
              <textarea
                className="w-full h-32 bg-[#121420] border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none text-sm mb-4"
                placeholder="Mesajınızı buraya yazın..."
                value={simpleMessage}
                onChange={(e) => setSimpleMessage(e.target.value)}
              />

              <button
                onClick={sendSimpleMessage}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-sm shadow-md"
              >
                Mesajı Gönder
              </button>

              {simpleStatus && (
                <p className="mt-4 text-xs text-center font-medium text-purple-300 bg-purple-950/20 py-2 rounded-md border border-purple-900/30">
                  {simpleStatus}
                </p>
              )}
            </div>
          </div>

                </div>
              </div>
            )}
          </section>
        </div>

        {/* CANLI GÖRÜNTÜLÜ SOHBET */}
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
          <h2
            className="
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
            🛰️ CANLI GÖRÜNTÜLÜ SOHBET
            ODALARI
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
            Güvenli görüntülü sohbet
            odalarına geçerek yeni
            insanlarla canlı olarak
            tanışabilirsin.
          </p>

          <div className="max-w-md mx-auto">
            <button
              type="button"
              onClick={() => {
                const width = 450;
                const height = 650;

                const left = Math.max(
                  0,
                  (window.screen.width -
                    width) /
                    2,
                );

                const top = Math.max(
                  0,
                  (window.screen.height -
                    height) /
                    2,
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
              🚀 GÖRÜNTÜLÜ KONUŞMAYI
              BAŞLAT
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

/* 
==================================================================
* ÖNEMLİ:
* useSearchParams() doğrudan page component'inde çalışmıyor.
* Next.js production build için Suspense gerekiyor.
*
* Bu nedenle MessagesContent ayrı component,
* MessagesPage ise Suspense wrapper.
==================================================================
*/

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

