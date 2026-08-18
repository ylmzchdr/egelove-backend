'use client'; 
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface OnlineUser {
  id: string;
  name: string;
  avatar: string;
  city: string;
}

export default function OnlineUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sizin NestJS backend yapınızdaki mevcut arama/keşfet API'sini akıllıca tetikliyoruz
    const fetchRealOnlineUsers = async () => {
      try {
        // NestJS backend mimarinizdeki canlı veya arama endpoint'ine göre burayı saniyede besler
        const response = await fetch('https://egelove.tr'); 
        if (response.ok) {
          const data = await response.json();
          // Eğer backend array dönüyorsa direkt bağlarız
          setUsers(Array.isArray(data) ? data : data.users || []);
        }
      } catch (error) {
        console.error('Canlı veriler çekilirken hata oluştu ortak:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealOnlineUsers();
    
    // Her 1 dakikada bir arka planda sessizce yenile, yeni girenler listeye aksın!
    const interval = setInterval(fetchRealOnlineUsers, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#121420]/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <h3 className="text-white font-medium text-xs md:text-sm tracking-wide">
            81 İLDEN CANLI ÇEVRİMİÇİ ÜYELER
          </h3>
        </div>
        <span 
          onClick={() => router.push('/search')} 
          className="text-[11px] text-purple-400 hover:text-purple-300 font-medium cursor-pointer transition-colors duration-200"
        >
          Tüm İlleri Gör
        </span>
      </div>

      {loading ? (
        /* Yüklenirken şık iskelet (skeleton) animasyonu gösterir */
        <div className="flex gap-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-14 h-14 bg-white/5 rounded-full min-w-[56px]"></div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <p className="text-xs text-slate-500 px-1">Şu an aktif üye bulunamadı ortak.</p>
      ) : (
        <div className="flex items-center gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {users.map((user) => (
            <div 
              key={user.id} 
              onClick={() => {
                // Tıklanan kişi Sabrina ise kendi profiline, başkasıysa dış profile saniyede uçurur
                if (user.name?.toLowerCase() === 'sabrina') {
                  router.push('/profile');
                } else {
                  router.push(`/profile/${user.id}`);
                }
              }}
              className="flex flex-col items-center gap-1 min-w-[65px] cursor-pointer group"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-500 group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={user.avatar || '/sabrina.jpg'} 
                    alt={user.name} 
                    className="w-full h-full object-cover rounded-full border-2 border-[#121420]" 
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#121420] rounded-full"></div>
              </div>
              <span className="text-xs text-slate-200 font-medium max-w-[65px] truncate text-center mt-1 group-hover:text-white">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-500 truncate max-w-[65px] group-hover:text-purple-400 transition-colors">
                {user.city}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
