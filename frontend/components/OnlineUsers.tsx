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
      <div className="mb-6 w-full rounded-2xl border border-[#F6BA48]/10 bg-[#310D0C]/40 p-6 text-center text-xs text-[#B5A093] backdrop-blur-md">
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
    <div className="mb-6 w-full rounded-2xl border border-[#F6BA48]/10 bg-gradient-to-r from-[#310D0C]/70 via-[#512510]/55 to-[#310D0C]/70 p-4 shadow-[0_12px_35px_rgba(49,13,12,0.22)] backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3FB36E] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#3FB36E]" />
          </span>

          <h3 className="text-xs font-medium tracking-wide text-[#F8D290] md:text-sm">
            {t.dashboard.onlineUsersTitle}
          </h3>
        </div>

        <span
          onClick={() => {
            localStorage.setItem('forceOnlineFilter', 'true');
            router.push('/search');
          }}
          className="cursor-pointer text-[11px] font-semibold text-[#F6BA48] transition-colors duration-200 hover:text-[#F8D290]"
        >
          Tümünü Gör
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
              className="group flex min-w-[65px] cursor-pointer flex-col items-center gap-1"
            >
              <div className="relative">
                <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-[#7E4114] via-[#EF912C] to-[#F6BA48] p-[2px] transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={avatarUrl}
                    alt={userName}
                    className="h-full w-full rounded-full border-2 border-[#310D0C] object-cover"
                  />
                </div>

                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#310D0C] bg-[#3FB36E]" />
              </div>

              <span className="mt-1 max-w-[65px] truncate text-center text-xs font-medium capitalize text-[#F8D290] transition-colors group-hover:text-white">
                {userName}
              </span>

              <span className="max-w-[65px] truncate text-[10px] text-[#9F7C61] transition-colors group-hover:text-[#F6BA48]">
                {city}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}