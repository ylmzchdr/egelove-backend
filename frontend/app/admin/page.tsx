"use client";

import { useState, useEffect } from "react";
import { Shield, Check, X, Users, Image, Activity, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";
import { api } from "@/lib/api";

interface AdminStats {
  totalUsers: number; pendingPhotos: number; totalMatches: number;
  premiumUsers: number; totalConversations: number;
}

interface PendingPhoto {
  id: string; url: string; userId: string; status: string;
  createdAt: string; user: { id: string; name: string; surname: string; email: string };
}

interface AdminUser {
  id: string; name: string; surname: string; email: string; phone?: string;
  gender: string; isPremiumCandidate: boolean; isActive: boolean;
  isVerified: boolean; isEmailVerified: boolean; createdAt: string;
  city?: { name: string };
}

export default function AdminPage() {
  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);
  const [panel, setPanel] = useState<"photos" | "users">("photos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [statsData, photosData, usersData] = await Promise.all([
        api.admin.stats(),
        api.admin.photos.pending(),
        api.admin.users(),
      ]);

      setStats(statsData);
      setPendingPhotos(photosData);
      setUsers(usersData);
    } catch (err: any) {
      console.error("ADMIN LOAD ERROR:", err);
      setError(err?.message || "Admin verileri yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleApprove = async (photoId: string) => {
    try {
      await api.admin.photos.approve(photoId);
      setPendingPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch {}
  };

  const handleReject = async (photoId: string) => {
    try {
      await api.admin.photos.reject(photoId);
      setPendingPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch {}
  };

  const handleToggleActive = async (userId: string) => {
    try {
      const result = await api.admin.toggleUserActive(userId);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, isActive: result.isActive } : u));
    } catch {}
  };

  const statCards = stats ? [
    { label: "Toplam Kullanıcı", value: stats.totalUsers, icon: Users, color: "text-[#F6BA48]" },
    { label: "Bekleyen Fotoğraf", value: stats.pendingPhotos, icon: Image, color: "text-[#EF912C]" },
    { label: "Premium Üye", value: stats.premiumUsers, icon: CreditCard, color: "text-[#F8D290]" },
    { label: "Eşleşme", value: stats.totalMatches, icon: Activity, color: "text-green-400" },
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#310D0C] via-[#512510] to-[#310D0C] text-white">
      <Header onOpenLogin={() => setAuthTab("login")} onOpenRegister={() => setAuthTab("register")} />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-8 h-8 text-[#F6BA48]" />
            <h1 className="text-3xl font-bold">Admin Paneli</h1>
          </div>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statCards.map((s) => (
                <Card key={s.label} className="bg-[#683312]/45 border-[#F6BA48]/15 p-4">
                  <div className="flex items-center gap-3">
                    <s.icon className={`w-8 h-8 ${s.color}`} />
                    <div>
                      <p className="text-2xl font-bold">{s.value}</p>
                      <p className="text-xs text-[#B5A093]">{s.label}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="flex gap-4 mb-8 border-b border-[#F6BA48]/15">
            <button onClick={() => setPanel("photos")} className={`pb-3 text-base font-medium ${panel === "photos" ? "text-[#F6BA48] border-b-2 border-[#F6BA48]" : "text-[#B5A093]"}`}>
              Fotoğraf Moderasyonu ({pendingPhotos.length})
            </button>
            <button onClick={() => setPanel("users")} className={`pb-3 text-base font-medium ${panel === "users" ? "text-[#F6BA48] border-b-2 border-[#F6BA48]" : "text-[#B5A093]"}`}>
              Kullanıcılar ({users.length})
            </button>
          </div>

          {error && (
            <Card className="mb-6 border-red-500/30 bg-red-500/10 p-4 text-red-200">
              {error}
            </Card>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#F6BA48]" />
            </div>
          ) : panel === "photos" ? (
            <div className="space-y-4">
              {pendingPhotos.length === 0 ? (
                <div className="text-center py-16 text-[#B5A093]">
                  <Check className="w-16 h-16 mx-auto mb-4 text-green-400" />
                  <p>Bekleyen fotoğraf yok</p>
                </div>
              ) : (
                pendingPhotos.map((photo) => (
                  <Card key={photo.id} className="bg-[#683312]/45 border-[#F6BA48]/15 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#B16323] to-[#F6BA48] flex items-center justify-center text-xl font-bold text-[#310D0C]">
                        {photo.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{photo.user.name} {photo.user.surname}</p>
                        <p className="text-xs text-[#B5A093]">{new Date(photo.createdAt).toLocaleDateString("tr-TR")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(photo.id)}>
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700" onClick={() => handleReject(photo.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div className="bg-[#512510]/65 border border-[#F6BA48]/15 rounded-xl overflow-hidden">
              <table className="w-full text-base">
                <thead>
                  <tr className="border-b border-[#F6BA48]/15 text-[#B5A093]">
                    <th className="text-left p-4">Kullanıcı</th>
                    <th className="text-left p-4">E-posta</th>
                    <th className="text-left p-4">Şehir</th>
                    <th className="text-left p-4">Kayıt</th>
                    <th className="text-left p-4">Durum</th>
                    <th className="text-left p-4">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-[#F6BA48]/10 hover:bg-[#683312]/35">
                      <td className="p-4">
                        <div>
                          <span className="font-medium">{u.name} {u.surname}</span>
                          {u.isPremiumCandidate && <span className="ml-2 text-[10px] bg-[#F6BA48]/15 text-[#F6BA48] px-1.5 py-0.5 rounded-full">PREMIUM</span>}
                        </div>
                      </td>
                      <td className="p-4 text-[#F8D290]/70">{u.email}</td>
                      <td className="p-4 text-[#F8D290]/70">{u.city?.name || "-"}</td>
                      <td className="p-4 text-[#F8D290]/70">{new Date(u.createdAt).toLocaleDateString("tr-TR")}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${u.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          {u.isActive ? "Aktif" : "Pasif"}
                        </span>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`border-[#F6BA48]/20 text-xs h-7 ${u.isActive ? "text-red-400" : "text-green-400"}`}
                          onClick={() => handleToggleActive(u.id)}
                        >
                          {u.isActive ? "Devre Dışı Bırak" : "Aktifleştir"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
      <Footer />
      <AuthDialog activeTab={authTab} onClose={() => setAuthTab(null)} />
    </div>
  );
}
