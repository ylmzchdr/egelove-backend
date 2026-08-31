'use client'; 
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from "@/lib/i18n-context";

export default function OnlineUsers() {
  const { t } = useI18n();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://onrender.com';
        const token = localStorage.getItem('token');

        // 🎯 KESİN ÇÖZÜM: api nesnesine uğramadan doğrudan ham fetch ile istek atıyoruz
        const response = await fetch(`${apiUrl}/user/online`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data || []);
        }
      } catch (error) {
        console.error("Çevrimiçi kullanıcılar çekilirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOnlineUsers();
    
    // Her 1 dakikada bir listeyi otomatik yenileyerek gerçek zamanlı tutar
    const interval = setInterval(fetchOnlineUsers, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-[#121420]/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 mb-6 text-center text-xs text-slate-400">
        Yükleniyor...
      </div>
    );
  }

  // Eğer o an sitede hiç aktif üye yoksa şeridi tamamen gizle
  if (users.length === 0) {
    return null; 
  }

  return (
    <div className="w-full bg-[#121420]/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <h3 className="text-white font-medium text-xs md:text-sm tracking-wide">
            {t.dashboard.onlineUsersTitle}
          </h3>
        </div>
        <span 
          onClick={() => router.push('/search')} 
          className="text-[11px] text-purple-400 hover:text-purple-300 font-medium cursor-pointer transition-colors duration-200"
        >
          Tüm İlleri Gör
        </span>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {users.map((user) => {
          const mainPhoto = user.photos?.find((p: any) => p.isMain) || user.photos?.[0];
          const avatarUrl = mainPhoto?.url || '/default-avatar.png'; 

          return (
            <div 
              key={user.id} 
              onClick={() => router.push(`/profile/${user.id}`)}
              className="flex flex-col items-center gap-1 min-w-[65px] cursor-pointer group"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-500 group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={avatarUrl} 
                    alt={user.name} 
                    className="w-full h-full object-cover rounded-full border-2 border-[#121420]" 
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#121420] rounded-full"></div>
              </div>
              <span className="text-xs text-slate-200 font-medium max-w-[65px] truncate text-center mt-1 group-hover:text-white capitalize">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-500 truncate max-w-[65px] group-hover:text-purple-400 transition-colors">
                {user.city?.name || 'Ege'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
