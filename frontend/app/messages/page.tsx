"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Search, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n-context";
import { useSearchParams } from "next/navigation";

function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try { return JSON.parse(atob(token.split(".")[1])).sub; } catch { return null; }
}

function calcAge(bd: string) {
  const b = new Date(bd), t = new Date();
  let a = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
  return a;
}

function formatTime(d: string) {
  const date = new Date(d);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "şimdi";
  if (mins < 60) return `${mins} dk`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} saat`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün`;
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

function MessagesContent() {
  const searchParams = useSearchParams();
const targetUserId = searchParams.get("userId");
  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [msgText, setMsgText] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "received" | "sent">("all");
  const [translations, setTranslations] = useState<Record<string, string>>({});
const [translatingId, setTranslatingId] = useState<string | null>(null);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const { lang } = useI18n();

  const loadConversations = async () => {
    const uid = getUserId();
    setMyId(uid);
    if (!uid) { setLoadingList(false); return; }
    try {
      const data = await api.conversations.list();
setConversations(data);

if (targetUserId) {
  const existing = data.find((c: any) => {
    return c.user1Id === targetUserId || c.user2Id === targetUserId;
  });

  if (existing) {
    loadMessages(existing.id);
  } else {
    const created = await api.conversations.create(targetUserId);
    setConversations((prev) => [created, ...prev]);
    loadMessages(created.id);
  }
}
if (targetUserId) {
  const existing = data.find((c: any) => {
    return c.user1Id === targetUserId || c.user2Id === targetUserId;
  });

  if (existing) {
    loadMessages(existing.id);
  } else if (api.conversations.create) {
    const created = await api.conversations.create(targetUserId);
    setConversations((prev) => [created, ...prev]);
    loadMessages(created.id);
  }
}
    } catch (e) { console.error(e); }
    setLoadingList(false);
  };

  useEffect(() => { loadConversations(); }, []);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async (convId: string) => {
    setLoadingMessages(true);
    setActiveConv(convId);
    try {
      const data = await api.conversations.messages(convId);
      setMessages(data);
    } catch (e) { console.error(e); }
    setLoadingMessages(false);
  };

 const sendMessage = async () => {
  if (!msgText.trim() || !activeConv) return;

  const text = msgText.trim();
  setMsgText("");

  try {
    const saved = await api.conversations.send(activeConv, text);

    setMessages((prev) => [...prev, saved]);

    await loadMessages(activeConv);
    await loadConversations();
  } catch (e: any) {
    console.error(e);
    setMsgText(text);
    alert(e?.message || "Mesaj gönderilemedi");
  }
};
  const translateMessage = async (messageId: string, content: string) => {
  if (!messageId || !content) return;

  try {
    setTranslatingId(messageId);

    const targetLang =
      lang === "TR"
        ? "TR"
        : lang === "EN"
        ? "EN"
        : lang === "RU"
        ? "RU"
        : lang === "AR"
        ? "AR"
        : "TR";

    const res = await api.translate.text(content, targetLang);

    setTranslations((prev) => ({
      ...prev,
      [messageId]: res.translatedText,
    }));
  } catch (e) {
    console.error(e);
  } finally {
    setTranslatingId(null);
  }
};

  const otherUser = (conv: any) => conv.user1Id === myId ? conv.user2 : conv.user1;

  const unreadCount = (conv: any): number => {
    if (!myId) return 0;
    if (conv._count?.messages === 0) return 0;
    const lastMsg = conv.messages?.[0];
    if (!lastMsg || lastMsg.senderId === myId) return 0;
    const myRead = conv.reads?.find((r: any) => r.userId === myId);
    if (!myRead) return 1;
    return 0;
  };

  const filtered = Array.isArray(conversations)
  ? conversations.filter((c) => {
      const other = otherUser(c);
      const name = `${other?.name || ""} ${other?.surname || ""}`.toLowerCase();

      if (!name.includes(search.toLowerCase())) return false;

      const lastMsg = c.messages?.[0];

      if (tab === "received") return lastMsg && lastMsg.senderId !== myId;
      if (tab === "sent") return lastMsg && lastMsg.senderId === myId;

      return true;
    })
  : [];

 return (
  <div className="min-h-screen bg-pink-950 text-white">
    <Header onOpenLogin={() => setAuthTab("login")} onOpenRegister={() => setAuthTab("register")} />
    <section className="py-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex gap-4 h-[calc(100vh-200px)]">
          <div className={`${activeConv ? "hidden md:flex" : "flex"} w-full md:w-96 shrink-0 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex-col`}>
            <div className="p-4 border-b border-white/10">
              <h2 className="text-xl font-bold mb-3">
                {lang === "TR" ? "Mesajlar" : lang === "EN" ? "Messages" : lang === "RU" ? "Сообщения" : "الرسائل"}
              </h2>

              <div className="flex gap-1 mb-3 bg-pink-950/50 rounded-lg p-1">
                {([
                  ["all", lang === "TR" ? "Tümü" : lang === "EN" ? "All" : lang === "RU" ? "Все" : "الكل"],
                  ["received", lang === "TR" ? "Gelen" : lang === "EN" ? "Received" : lang === "RU" ? "Входящие" : "الواردة"],
                  ["sent", lang === "TR" ? "Giden" : lang === "EN" ? "Sent" : lang === "RU" ? "Отправленные" : "المرسلة"],
                ] as const).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${
                      tab === key ? "bg-pink-600 text-white" : "text-white/50 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  className="bg-pink-950/50 border-white/10 text-white pl-10"
                  placeholder={lang === "TR" ? "Ara..." : lang === "EN" ? "Search..." : lang === "RU" ? "Поиск..." : "بحث..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {loadingList && (
                  <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-white/40" /></div>
                )}
                {!loadingList && !myId && (
                  <div className="text-center py-12 text-white/40">
  <p>
    {lang === "TR"
      ? "Giriş yapmalısın"
      : lang === "EN"
      ? "You must log in"
      : lang === "RU"
      ? "Необходимо войти"
      : "يجب تسجيل الدخول"}
  </p>
</div>
                )}
                {!loadingList && myId && filtered.length === 0 && (
                  <div className="text-center py-12 text-white/40"><p>
  {tab === "received"
    ? lang === "TR" ? "Gelen mesajın yok" : lang === "EN" ? "No received messages" : lang === "RU" ? "Нет входящих сообщений" : "لا توجد رسائل واردة"
    : tab === "sent"
    ? lang === "TR" ? "Giden mesajın yok" : lang === "EN" ? "No sent messages" : lang === "RU" ? "Нет отправленных сообщений" : "لا توجد رسائل مرسلة"
    : lang === "TR" ? "Henüz mesajın yok" : lang === "EN" ? "No messages yet" : lang === "RU" ? "Сообщений пока нет" : "لا توجد رسائل بعد"}
</p></div>
                )}
                {filtered.map((conv) => {
                  const other = otherUser(conv);
                  const lastMsg = conv.messages?.[0];
                  const unread = unreadCount(conv);
                  return (
                    <button
                      key={conv.id}
                      onClick={() => loadMessages(conv.id)}
                      className={`w-full p-4 flex items-center gap-3 border-b border-white/5 hover:bg-white/5 transition text-left ${
                        activeConv === conv.id ? "bg-pink-900/40" : ""
                      }`}
                    >
                      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-lg font-bold shrink-0">
                        {(other.name?.[0] || "?").toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{other.name}{other.surname ? " " + other.surname : ""}{other.birthDate ? ", " + calcAge(other.birthDate) : ""}</span>
                          <span className="text-xs text-white/40">{lastMsg ? formatTime(lastMsg.createdAt) : ""}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {lastMsg ? (
                            <p className="text-xs text-white/40 mt-0.5 truncate flex-1">
                              {lastMsg.senderId === myId ? "Sen: " : ""}{lastMsg.content}
                            </p>
                          ) : (
                            <p className="text-xs text-white/30 mt-0.5">Henüz mesaj yok</p>
                          )}
                          {unread > 0 && (
                            <span className="bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0">{unread}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`${activeConv ? "flex" : "hidden md:flex"} flex-1 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex-col`}>
              {activeConv ? (
                <>
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
  <div className="flex items-center gap-3">
    <button
      onClick={() => setActiveConv("")}
      className="md:hidden text-white text-2xl"
    >
      ←
    </button>

    {(() => {
      const conv = conversations.find(c => c.id === activeConv);
      const other = conv ? otherUser(conv) : null;
      const name = other
        ? `${other.name || ""}${other.surname ? " " + other.surname : ""}`
        : "";

      return (
        <>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-sm font-bold">
            {(other?.name?.[0] || "?").toUpperCase()}
          </div>

          <div>
            <span className="font-semibold">{name}</span>
          </div>
        </>
      );
    })()}
  </div>
</div>
                  
                 

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loadingMessages && (
                      <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-white/40" /></div>
                    )}
                    {!loadingMessages && messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.senderId === myId ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl ${
                          msg.senderId === myId ? "bg-pink-600 rounded-br-md" : "bg-white/10 rounded-bl-md"
                        }`}>
                          <p className="text-sm">{msg.content}</p>

{translations[msg.id] && (
  <div className="mt-2 border-t border-white/10 pt-2 text-xs text-cyan-200">
    {translations[msg.id]}
  </div>
)}

<div className="mt-1 flex items-center justify-between gap-3">
  <button
    type="button"
    onClick={() => translateMessage(msg.id, msg.content)}
    disabled={translatingId === msg.id}
    className="text-[10px] text-cyan-300 hover:text-cyan-200 disabled:opacity-50"
  >
    {translatingId === msg.id ? "Çevriliyor..." : "🌐 Çevir"}
  </button>

  <span className="text-[10px] text-white/40">
    {formatTime(msg.createdAt)}
  </span>
</div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEnd} />
                  </div>

                  <div className="p-3 border-t border-white/10 bg-pink-950 sticky bottom-0">
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                      <Input
                        className="bg-pink-950/50 border-white/10 text-white"
                        placeholder="Mesaj yaz..."
                        value={msgText}
                        onChange={(e) => setMsgText(e.target.value)}
                      />
                      <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-white/40">
                  <p>
  {lang === "TR"
    ? "Sohbet başlatmak için bir konuşma seç"
    : lang === "EN"
    ? "Select a conversation to start chatting"
    : lang === "RU"
    ? "Выберите диалог для начала общения"
    : "اختر محادثة لبدء الدردشة"}
</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <AuthDialog activeTab={authTab} onClose={() => setAuthTab(null)} />
    </div>
  );
}
export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-pink-950 text-white" />}>
      <MessagesContent />
    </Suspense>
  );
}