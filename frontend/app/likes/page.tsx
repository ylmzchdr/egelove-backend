"use client";

import { useState, useEffect } from "react";
import { Heart, ThumbsUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";
import ProfileCard from "@/components/ProfileCard";
import { api } from "@/lib/api";

function getUserIdFromToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || null;
  } catch { return null; }
}

function calcAge(birthDate: string): number {
  const bd = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - bd.getFullYear();
  const m = today.getMonth() - bd.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
  return age;
}

export default function LikesPage() {
  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [matches, setMatches] = useState<any[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const uid = getUserIdFromToken();
    setMyId(uid);
    if (!uid) { setLoading(false); return; }
    try {
      const data = await api.matches.list();
      setMatches(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleLike = async (userId: string) => {
    try { await api.matches.like(userId); load(); } catch (e) { console.error(e); }
  };

  const received = matches.filter((m) => m.receiverId === myId);
  const sent = matches.filter((m) => m.senderId === myId);

  const otherUser = (match: any) => match.senderId === myId ? match.receiver : match.sender;

  return (
    <div className="min-h-screen bg-pink-950 text-white">
      <Header onOpenLogin={() => setAuthTab("login")} onOpenRegister={() => setAuthTab("register")} />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-3xl font-bold mb-2">Beğeniler</h1>
          <p className="text-white/50 mb-8">Seni beğenenler ve beğendiklerin</p>

          <div className="flex gap-4 mb-8 border-b border-white/10">
            <button
              onClick={() => setTab("received")}
              className={`pb-3 text-sm font-medium relative ${tab === "received" ? "text-pink-300" : "text-white/50 hover:text-white"}`}
            >
              <Heart className="w-4 h-4 inline mr-1" /> Seni Beğenenler ({received.length})
              {tab === "received" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 rounded-full" />}
            </button>
            <button
              onClick={() => setTab("sent")}
              className={`pb-3 text-sm font-medium relative ${tab === "sent" ? "text-pink-300" : "text-white/50 hover:text-white"}`}
            >
              <ThumbsUp className="w-4 h-4 inline mr-1" /> Beğendiklerin ({sent.length})
              {tab === "sent" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 rounded-full" />}
            </button>
          </div>

          {loading && (
            <div className="text-center py-20 text-white/40">
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
            </div>
          )}

          {!loading && !myId && (
            <div className="text-center py-20 text-white/40">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Giriş yapmalısın</p>
            </div>
          )}

          {!loading && myId && tab === "received" && received.length === 0 && (
            <div className="text-center py-20 text-white/40">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Henüz kimse seni beğenmedi</p>
              <p className="text-sm">Profilini düzenleyip daha fazla kişiye görün!</p>
            </div>
          )}

          {!loading && myId && tab === "sent" && sent.length === 0 && (
            <div className="text-center py-20 text-white/40">
              <ThumbsUp className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Henüz kimseyi beğenmedin</p>
              <p className="text-sm">Keşfet sayfasından üyeleri beğenmeye başla!</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(tab === "received" ? received : sent).map((match) => {
              const other = otherUser(match);
              return (
                <div key={match.id}>
                  <ProfileCard
                    id={other.id}
                    name={`${other.name}${other.surname ? " " + other.surname : ""}`}
                    age={other.birthDate ? calcAge(other.birthDate) : undefined}
                    city={other.city?.name}
                    district={other.district?.name}
                    bio={other.bio}
                    verified={other.isVerified}
                  />
                  {tab === "received" && !match.isMutual && (
                    <Button
                      className="w-full mt-2 bg-pink-600 hover:bg-pink-700 text-xs h-8"
                      onClick={() => handleLike(other.id)}
                    >
                      <Heart className="w-3 h-3 mr-1" /> Karşılık Ver
                    </Button>
                  )}
                  {tab === "received" && match.isMutual && (
                    <Button
                      className="w-full mt-2 bg-green-600 hover:bg-green-700 text-xs h-8"
                      onClick={() => window.location.href = "/messages"}
                    >
                      Mesaj Gönder
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
      <AuthDialog activeTab={authTab} onClose={() => setAuthTab(null)} />
    </div>
  );
}