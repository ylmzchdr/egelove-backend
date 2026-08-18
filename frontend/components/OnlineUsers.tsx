'use client'; 
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const MOCK_ONLINE_USERS = [
  { 
    id: 'sabrina-real-main-profile', 
    name: 'sabrina', 
    avatar: '/sabrina.jpg', // Public klasöründeki bisikletli sahil resminiz
    city: 'Muğla' 
  },
  { id: 'user-can', name: 'Can', avatar: 'https://unsplash.com', city: 'Muğla' },
  { id: 'user-merve', name: 'Merve', avatar: 'https://unsplash.com', city: 'Aydın' },
  { id: 'user-deniz', name: 'Deniz', avatar: 'https://unsplash.com', city: 'Antalya' },
  { id: 'user-elif', name: 'Elif', avatar: 'https://unsplash.com', city: 'İstanbul' },
  { id: 'user-burak', name: 'Burak', avatar: 'https://unsplash.com', city: 'Ankara' },
  { id: 'user-zeynep', name: 'Zeynep', avatar: 'https://unsplash.com', city: 'Diyarbakır' },
  { id: 'user-hakan', name: 'Hakan', avatar: 'https://unsplash.com', city: 'Trabzon' },
];

export default function OnlineUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUsers(MOCK_ONLINE_USERS);
    setLoading(false);
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

      <div className="flex items-center gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {users.map((user) => (
          <div 
            key={user.id} 
            onClick={() => {
              // İŞTE SİHİRLİ DOKUNUŞ: Büyük arama sayfasını hiç yormuyoruz!
              // Tıklayınca doğrudan senin o açık olan kahveli, %87 uyumlu asıl profil linkine uçuruyoruz!
              if (user.id === 'sabrina-real-main-profile') {
                router.push('/profile'); 
              } else {
                router.push(`/search?user=${user.id}`);
              }
            }}
            className="flex flex-col items-center gap-1 min-w-[65px] cursor-pointer group"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-500 group-hover:scale-105 transition-transform duration-300">
                <img 
                  src={user.avatar} 
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
    </div>
  );
}
