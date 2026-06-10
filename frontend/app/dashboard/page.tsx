"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Search, MessageCircle, Gamepad2, Users, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import AuthDialog from "@/components/AuthDialog";
import { useI18n } from "@/lib/i18n-context";

const cards = [
  { key: "discover", href: "/#discover", icon: Heart, color: "from-pink-500 to-rose-600" },
  { key: "find", href: "/search", icon: Search, color: "from-purple-500 to-indigo-600" },
  { key: "messages", href: "/messages", icon: MessageCircle, color: "from-blue-500 to-cyan-600" },
  { key: "loveGame", href: "#", icon: Gamepad2, color: "from-amber-500 to-orange-600" },
  { key: "friends", href: "/likes", icon: Users, color: "from-emerald-500 to-teal-600" },
];

export default function DashboardPage() {
  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    setToken(localStorage.getItem("accessToken"));
    setLoading(false);
  }, []);

  const d = t.dashboard;

  return (
    <div className="min-h-screen bg-pink-950 text-white">
      <Header onOpenLogin={() => setAuthTab("login")} onOpenRegister={() => setAuthTab("register")} />
      <section className="py-12">
        <div className="mx-auto max-w-2xl px-4">
          <div className="text-center mb-10">
            <Heart className="w-12 h-12 text-pink-400 mx-auto mb-3" />
            <h1 className="text-3xl font-bold">egelove</h1>
            <p className="text-white/50 mt-1">{t.nav.discover} & {d.find}</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-white/40" /></div>
          ) : !token ? (
            <div className="text-center py-20 text-white/40">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg mb-2">Giriş yapmalısın</p>
              <button
                onClick={() => setAuthTab("login")}
                className="text-pink-400 hover:text-pink-300 underline"
              >
                Giriş Yap
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cards.map((card) => {
                const Icon = card.icon;
                const label =
                  card.key === "discover" ? t.nav.discover
                  : card.key === "find" ? d.find
                  : card.key === "messages" ? t.nav.messages
                  : card.key === "loveGame" ? d.loveGame
                  : d.friends;
                const desc =
                  card.key === "discover" ? t.discover.subtitle
                  : card.key === "find" ? d.findDesc
                  : card.key === "messages" ? "Son mesajlarına göz at"
                  : card.key === "loveGame" ? d.loveGameDesc
                  : d.friendsDesc;
                return (
                  <Link
                    key={card.key}
                    href={card.href}
                    className={`group relative overflow-hidden rounded-2xl bg-gradient-to-r ${card.color} p-6 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]`}
                  >
                    <div className="flex items-center gap-5">
                      <div className="bg-white/20 rounded-xl p-3">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold">{label}</h2>
                        <p className="text-white/80 text-sm mt-0.5">{desc}</p>
                      </div>
                      <div className="text-white/40 group-hover:text-white/70 transition">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <AuthDialog activeTab={authTab} onClose={() => setAuthTab(null)} />
    </div>
  );
}