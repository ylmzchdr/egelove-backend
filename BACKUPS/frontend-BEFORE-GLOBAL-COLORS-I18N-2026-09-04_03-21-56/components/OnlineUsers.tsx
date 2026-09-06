'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n-context';

export default function OnlineUsers() {
  const { t } = useI18n();
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchOnlineUsers = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          'https://senveben-backend.onrender.com';

        const token = localStorage.getItem('accessToken');

        const response = await fetch(`${apiUrl}/users/online`, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        });

        if (!response.ok) {
          console.error(
            'Çevrimiçi kullanıcılar API hatası:',
            response.status,
          );

          if (mounted) {
            setUsers([]);
          }

          return;
        }

        const data = await response.json();

        if (mounted) {
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error(
          'Çevrimiçi kullanıcılar çekilirken hata oluştu:',
          error,
        );

        if (mounted) {
          setUsers([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchOnlineUsers();

    const interval = setInterval(fetchOnlineUsers, 60000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-[#D987A8] backdrop-blur-md border border-[#C95F88]/60 rounded-2xl p-6 mb-6 text-center text-xs text-slate-400">
        Yükleniyor...
      </div>
    );
  }

  /*
   * Backend gerçekten online kullanıcı döndürmüyorsa
   * kesinlikle sahte kullanıcı göstermiyoruz.
   */
  if (users.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-[#D987A8] backdrop-blur-md border border-[#C95F88]/60 rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>

          <h3 className="text-[#4A2835] font-semibold text-xs md:text-sm tracking-wide">
            {t.dashboard.onlineUsersTitle}
          </h3>
        </div>

        <span
          onClick={() => {
            localStorage.setItem('forceOnlineFilter', 'true');
            router.push('/search');
          }}
          className="text-[11px] text-[#B5165D] hover:text-[#8F124A] font-medium cursor-pointer transition-colors duration-200"
        >
          {t.dashboard.viewAllCities}
        </span>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {users.map((user) => {
          const mainPhoto =
            user.photos?.find((p: any) => p.isMain) ||
            user.photos?.[0];

          const avatarUrl =
            mainPhoto?.url ||
            user.profilePhoto ||
            user.profileImage ||
            user.avatar ||
            '/default-avatar.png';

          const userName =
            user.name ||
            user.username ||
            'Üye';

          const city =
            typeof user.city === 'string'
              ? user.city
              : user.city?.name || '';

          return (
            <div
              key={user.id}
              onClick={() => router.push(`/profile/${user.id}`)}
              className="flex flex-col items-center gap-1 min-w-[65px] cursor-pointer group"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#EC4899] via-[#DB2777] to-[#F472B6] group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={avatarUrl}
                    alt={userName}
                    className="w-full h-full object-cover rounded-full border-2 border-[#F6C1D5]"
                  />
                </div>

                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#F6C1D5] rounded-full" />
              </div>

              <span className="text-xs text-[#4A2835] font-semibold max-w-[65px] truncate text-center mt-1 group-hover:text-[#2D1721] capitalize">
                {userName}
              </span>

              <span className="text-[10px] text-[#754456] truncate max-w-[65px] group-hover:text-[#B5165D] transition-colors">
                {city}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}