"use client";

import React, {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type User = {
  id: string;
  name?: string;
  surname?: string;
  avatar?: string | null;
  birthDate?: string;
  city?: {
    name?: string;
  };
  district?: {
    name?: string;
  };
};

type Message = {
  id: string;
  content: string;
  senderId: string;
  createdAt?: string;
  sender?: {
    id: string;
    name?: string;
    avatar?: string | null;
  };
};

type Conversation = {
  id: string;
  user1Id: string;
  user2Id: string;
  user1?: User;
  user2?: User;
  messages?: Message[];
  reads?: Array<{
    userId: string;
    lastReadAt?: string | null;
  }>;
  _count?: {
    messages?: number;
  };
  updatedAt?: string;
};

type FilterType = "all" | "received" | "sent";

export default function MessagesPage() {
  const router = useRouter();

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const [messageText, setMessageText] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const [error, setError] = useState("");

  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://egelove-backend.onrender.com";

  /* =========================================================
     KARŞI TARAFI BUL
  ========================================================= */

  const getOtherUser = (
    conversation: Conversation | null,
  ): User | null => {
    if (!conversation) return null;

    if (
      currentUserId &&
      String(conversation.user1Id) === String(currentUserId)
    ) {
      return conversation.user2 || null;
    }

    if (
      currentUserId &&
      String(conversation.user2Id) === String(currentUserId)
    ) {
      return conversation.user1 || null;
    }

    return conversation.user2 || conversation.user1 || null;
  };

  /* =========================================================
     İSİM
  ========================================================= */

  const getUserName = (user?: User | null) => {
    if (!user) return "Kullanıcı";

    const fullName =
      `${user.name || ""} ${user.surname || ""}`.trim();

    return fullName || "Kullanıcı";
  };

  /* =========================================================
     AVATAR
  ========================================================= */

  const getAvatar = (user?: User | null) => {
    if (!user?.avatar) return null;

    if (user.avatar.startsWith("http")) {
      return user.avatar;
    }

    const cleanPath = user.avatar.startsWith("/")
      ? user.avatar
      : `/${user.avatar}`;

    return `${API_URL}${cleanPath}`;
  };

  /* =========================================================
     TARİH
  ========================================================= */

  const formatTime = (date?: string) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date?: string) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  /* =========================================================
     KONUŞMALARI YÜKLE
  ========================================================= */

  const loadConversations = async (
    targetUserId?: string | null,
  ) => {
    try {
      setLoading(true);
      setError("");

      const me: any = await api.users.me();

      const myId =
        me?.id ??
        me?.user?.id ??
        me?.data?.id ??
        null;

      if (!myId) {
        router.push("/");
        return;
      }

      const myIdString = String(myId);

      setCurrentUserId(myIdString);

      const data = await api.conversations.list();

      const list: Conversation[] = Array.isArray(data)
        ? data
        : [];

      setConversations(list);

      /* =====================================================
         URL'DEN GELEN KULLANICI
      ===================================================== */

      if (targetUserId) {
        let conversation = list.find(
          (item) =>
            String(item.user1Id) === String(targetUserId) ||
            String(item.user2Id) === String(targetUserId),
        );

        /* Konuşma yoksa oluştur */
        if (!conversation) {
          conversation = await api.conversations.create(
            String(targetUserId),
          );

          if (conversation) {
            const refreshed =
              await api.conversations.list();

            const refreshedList: Conversation[] =
              Array.isArray(refreshed)
                ? refreshed
                : [];

            setConversations(refreshedList);

            conversation =
              refreshedList.find(
                (item) =>
                  String(item.user1Id) ===
                    String(targetUserId) ||
                  String(item.user2Id) ===
                    String(targetUserId),
              ) || conversation;
          }
        }

        if (conversation) {
          await openConversation(conversation);
        }

        /* URL'deki userId'yi temizle */
        window.history.replaceState(
          {},
          "",
          window.location.pathname,
        );
      }
    } catch (err) {
      console.error(
        "Mesaj konuşmaları yüklenemedi:",
        err,
      );

      setError(
        "Mesajlar yüklenirken bir sorun oluştu.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     KONUŞMA AÇ
  ========================================================= */

  const openConversation = async (
    conversation: Conversation,
  ) => {
    setSelectedConversation(conversation);
    setLoadingMessages(true);
    setError("");
    setMessages([]);

    try {
      const data =
        await api.conversations.messages(
          conversation.id,
        );

      const messageList: Message[] =
        Array.isArray(data) ? data : [];

      setMessages(messageList);
    } catch (err) {
      console.error(
        "Sohbet mesajları alınamadı:",
        err,
      );

      setError(
        "Bu konuşmadaki mesajlar yüklenemedi.",
      );

      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  /* =========================================================
     SAYFA İLK AÇILDIĞINDA
  ========================================================= */

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search,
    );

    const targetUserId =
      params.get("userId");

    loadConversations(targetUserId);
  }, []);

  /* =========================================================
     MESAJLARIN ALTINA KAYDIR
  ========================================================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* =========================================================
     MESAJ GÖNDER
  ========================================================= */

  const sendMessage = async () => {
    if (!selectedConversation) {
      return;
    }

    const content = messageText.trim();

    if (!content) {
      return;
    }

    if (sendingMessage) {
      return;
    }

    try {
      setSendingMessage(true);
      setError("");

      const token =
        localStorage.getItem("accessToken");

      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch(
        `${API_URL}/conversations/${selectedConversation.id}/messages`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            content,
          }),
        },
      );

      const data = await response.json().catch(
        () => null,
      );

      if (!response.ok) {
        const serverMessage =
          data?.message ||
          data?.error ||
          "Mesaj gönderilemedi.";

        throw new Error(
          Array.isArray(serverMessage)
            ? serverMessage.join(", ")
            : String(serverMessage),
        );
      }

      const newMessage =
        data as Message;

      setMessages((previous) => [
        ...previous,
        newMessage,
      ]);

      setMessageText("");

      /* Konuşma listesindeki son mesajı güncelle */
      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id ===
          selectedConversation.id
            ? {
                ...conversation,
                messages: [newMessage],
                updatedAt:
                  newMessage.createdAt ||
                  conversation.updatedAt,
                _count: {
                  messages:
                    (conversation._count
                      ?.messages || 0) + 1,
                },
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
      setSendingMessage(false);
    }
  };

  /* =========================================================
     ENTER İLE GÖNDER
  ========================================================= */

  const handleMessageKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      sendMessage();
    }
  };

  /* =========================================================
     FİLTRELENMİŞ KONUŞMALAR
  ========================================================= */

  const filteredConversations =
    useMemo(() => {
      const search =
        searchText.trim().toLocaleLowerCase(
          "tr-TR",
        );

      return conversations.filter(
        (conversation) => {
          const otherUser =
            getOtherUser(conversation);

          const name = getUserName(
            otherUser,
          ).toLocaleLowerCase("tr-TR");

          const lastMessage =
            conversation.messages?.[0];

          const lastText =
            lastMessage?.content
              ?.toLocaleLowerCase("tr-TR") || "";

          const matchesSearch =
            !search ||
            name.includes(search) ||
            lastText.includes(search);

          if (!matchesSearch) {
            return false;
          }

          if (filter === "all") {
            return true;
          }

          if (!lastMessage) {
            return false;
          }

          const isSent =
            currentUserId &&
            String(lastMessage.senderId) ===
              String(currentUserId);

          if (filter === "sent") {
            return Boolean(isSent);
          }

          if (filter === "received") {
            return !isSent;
          }

          return true;
        },
      );
    }, [
      conversations,
      searchText,
      filter,
      currentUserId,
    ]);

  /* =========================================================
     SEÇİLİ KULLANICI
  ========================================================= */

  const selectedUser =
    getOtherUser(selectedConversation);

  /* =========================================================
     KAMERA
  ========================================================= */

  const bagimsizKameraAc = () => {
    const width = 450;
    const height = 650;

    const left = Math.max(
      0,
      (window.screen.width - width) / 2,
    );

    const top = Math.max(
      0,
      (window.screen.height - height) / 2,
    );

    window.open(
      "/canavar-video",
      "EgeloveLivePopup",
      `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no,status=no,location=no,toolbar=no,menubar=no`,
    );
  };

  /* =========================================================
     YÜKLENİYOR
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121420] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />

          <p className="text-slate-400">
            Mesajlar yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     SAYFA
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#121420] text-white flex flex-col">
      {/* =====================================================
          ÜST NAVİGASYON
      ===================================================== */}

      <header className="w-full bg-[#1a1d30] border-b border-white/10 px-4 sm:px-6 py-4 sm:py-5 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col items-start gap-3">
          <a
            href="/dashboard"
            className="
              inline-flex
              items-center
              gap-2
              bg-purple-600
              hover:bg-purple-500
              text-white
              px-5
              sm:px-6
              py-3
              rounded-2xl
              text-sm
              sm:text-base
              font-black
              tracking-wide
              transition-all
              shadow-lg
              shadow-purple-500/20
              border
              border-purple-400/30
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
          </a>

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

      {/* =====================================================
          ANA İÇERİK
      ===================================================== */}

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
              SOL — KONUŞMALAR
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
              min-h-[500px]
              md:h-[600px]
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
                    setFilter("all")
                  }
                  className={`
                    px-4
                    py-3
                    rounded-2xl
                    text-sm
                    font-semibold
                    transition
                    ${
                      filter === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }
                  `}
                >
                  Tümü
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFilter("received")
                  }
                  className={`
                    px-4
                    py-3
                    rounded-2xl
                    text-sm
                    font-semibold
                    transition
                    ${
                      filter === "received"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }
                  `}
                >
                  Gelen
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFilter("sent")
                  }
                  className={`
                    px-4
                    py-3
                    rounded-2xl
                    text-sm
                    font-semibold
                    transition
                    ${
                      filter === "sent"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }
                  `}
                >
                  Giden
                </button>
              </div>

              {/* ARAMA */}

              <input
                type="text"
                value={searchText}
                onChange={(event) =>
                  setSearchText(
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
                mt-5
                overflow-y-auto
                pr-1
                space-y-2
              "
            >
              {filteredConversations.length ===
              0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-3">
                      💬
                    </div>

                    <p className="text-sm sm:text-base text-slate-500">
                      Henüz mesajın yok
                    </p>
                  </div>
                </div>
              ) : (
                filteredConversations.map(
                  (conversation) => {
                    const otherUser =
                      getOtherUser(
                        conversation,
                      );

                    const avatar =
                      getAvatar(otherUser);

                    const lastMessage =
                      conversation.messages?.[0];

                    const isSelected =
                      selectedConversation?.id ===
                      conversation.id;

                    return (
                      <button
                        type="button"
                        key={conversation.id}
                        onClick={() =>
                          openConversation(
                            conversation,
                          )
                        }
                        className={`
                          w-full
                          text-left
                          rounded-2xl
                          p-3
                          border
                          transition-all
                          ${
                            isSelected
                              ? "bg-purple-600/20 border-purple-500/50"
                              : "bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          {/* AVATAR */}

                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 shrink-0 flex items-center justify-center">
                            {avatar ? (
                              <img
                                src={avatar}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-lg font-black">
                                {getUserName(
                                  otherUser,
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>

                          {/* BİLGİ */}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-white truncate">
                                {getUserName(
                                  otherUser,
                                )}
                              </span>

                              <span className="text-[10px] text-slate-500 shrink-0">
                                {formatTime(
                                  lastMessage?.createdAt ||
                                    conversation.updatedAt,
                                )}
                              </span>
                            </div>

                            <p className="text-xs text-slate-400 truncate mt-1">
                              {lastMessage?.content ||
                                "Henüz mesaj yok"}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  },
                )
              )}
            </div>
          </section>

          {/* =================================================
              SAĞ — SOHBET
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
              min-h-[600px]
              md:h-[600px]
              flex
              flex-col
            "
          >
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="text-5xl mb-4">
                    💬
                  </div>

                  <p className="text-base sm:text-lg text-slate-400 font-semibold">
                    Sohbet başlatmak için bir
                    konuşma seç
                  </p>

                  <p className="text-sm text-slate-600 mt-2">
                    Soldaki konuşmalardan birini
                    seçebilirsin.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* =========================================
                    SOHBET BAŞLIĞI
                ========================================= */}

                <div
                  className="
                    shrink-0
                    px-5
                    sm:px-6
                    py-4
                    border-b
                    border-white/10
                    bg-black/20
                  "
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                      {getAvatar(
                        selectedUser,
                      ) ? (
                        <img
                          src={
                            getAvatar(
                              selectedUser,
                            ) || ""
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-black">
                          {getUserName(
                            selectedUser,
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h2 className="font-bold text-lg truncate">
                        {getUserName(
                          selectedUser,
                        )}
                      </h2>

                      <p className="text-xs text-emerald-400">
                        EgeLove üyesi
                      </p>
                    </div>
                  </div>
                </div>

                {/* =========================================
                    HATA
                ========================================= */}

                {error && (
                  <div className="mx-5 mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {/* =========================================
                    MESAJLAR
                ========================================= */}

                <div
                  className="
                    flex-1
                    overflow-y-auto
                    px-4
                    sm:px-6
                    py-5
                    space-y-3
                  "
                >
                  {loadingMessages ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto mb-3 h-8 w-8 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />

                        <p className="text-sm text-slate-500">
                          Mesajlar yükleniyor...
                        </p>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-3">
                          👋
                        </div>

                        <p className="text-slate-400 font-semibold">
                          Henüz mesaj yok
                        </p>

                        <p className="text-sm text-slate-600 mt-2">
                          İlk mesajı sen gönder!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map(
                        (message) => {
                          const isMine =
                            currentUserId &&
                            String(
                              message.senderId,
                            ) ===
                              String(
                                currentUserId,
                              );

                          return (
                            <div
                              key={message.id}
                              className={`
                                flex
                                ${
                                  isMine
                                    ? "justify-end"
                                    : "justify-start"
                                }
                              `}
                            >
                              <div
                                className={`
                                  max-w-[78%]
                                  sm:max-w-[70%]
                                  rounded-2xl
                                  px-4
                                  py-3
                                  shadow-lg
                                  ${
                                    isMine
                                      ? "bg-gradient-to-r from-purple-600 to-blue-500 rounded-br-md"
                                      : "bg-slate-800 border border-white/10 rounded-bl-md"
                                  }
                                `}
                              >
                                <p className="text-sm leading-6 whitespace-pre-wrap break-words">
                                  {
                                    message.content
                                  }
                                </p>

                                <div
                                  className={`
                                    mt-1
                                    text-[10px]
                                    ${
                                      isMine
                                        ? "text-white/60 text-right"
                                        : "text-slate-500"
                                    }
                                  `}
                                >
                                  {formatDate(
                                    message.createdAt,
                                  )}{" "}
                                  {formatTime(
                                    message.createdAt,
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        },
                      )}

                      <div
                        ref={messagesEndRef}
                      />
                    </>
                  )}
                </div>

                {/* =========================================
                    MESAJ YAZMA ALANI
                ========================================= */}

                <div
                  className="
                    shrink-0
                    border-t
                    border-white/10
                    bg-black/20
                    p-4
                    sm:p-5
                  "
                >
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      sendMessage();
                    }}
                    className="
                      flex
                      items-end
                      gap-3
                    "
                  >
                    <textarea
                      value={messageText}
                      onChange={(event) =>
                        setMessageText(
                          event.target.value,
                        )
                      }
                      onKeyDown={
                        handleMessageKeyDown
                      }
                      disabled={sendingMessage}
                      placeholder="Mesajını yaz..."
                      rows={2}
                      className="
                        flex-1
                        min-h-[56px]
                        max-h-32
                        resize-none
                        rounded-2xl
                        bg-slate-950
                        border
                        border-white/15
                        px-4
                        py-3
                        text-sm
                        text-white
                        placeholder:text-slate-600
                        focus:outline-none
                        focus:border-purple-500
                        transition
                        disabled:opacity-50
                      "
                    />

                    <button
                      type="submit"
                      disabled={
                        sendingMessage ||
                        !messageText.trim()
                      }
                      className="
                        h-14
                        px-5
                        sm:px-6
                        rounded-2xl
                        bg-gradient-to-r
                        from-purple-600
                        to-blue-500
                        hover:from-purple-500
                        hover:to-blue-400
                        text-white
                        font-bold
                        text-sm
                        transition-all
                        shadow-lg
                        shadow-purple-500/20
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                        shrink-0
                      "
                    >
                      {sendingMessage
                        ? "..."
                        : "GÖNDER"}
                    </button>
                  </form>

                  <p className="text-[10px] text-slate-600 mt-2">
                    Enter gönderir · Shift + Enter
                    yeni satır
                  </p>
                </div>
              </>
            )}
          </section>
        </div>

        {/* =================================================
            CANLI GÖRÜNTÜLÜ SOHBET
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
            🛰️ CANLI GÖRÜNTÜLÜ SOHBET ODALARI
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
            Güvenli görüntülü sohbet odalarına
            geçerek yeni insanlarla canlı olarak
            tanışabilirsin.
          </p>

          <div className="max-w-md mx-auto">
            <button
              type="button"
              onClick={bagimsizKameraAc}
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
              🚀 GÖRÜNTÜLÜ KONUŞMAYI BAŞLAT
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}