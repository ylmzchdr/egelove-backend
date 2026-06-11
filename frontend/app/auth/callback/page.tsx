'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');

  console.log('CALLBACK TOKEN:', accessToken);

  if (!accessToken) {
    router.replace('/');
    return;
  }

    localStorage.setItem('accessToken', accessToken);

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    alert('TOKEN YAZILDI');

   window.location.href = '/dashboard';
  }, [searchParams, router]);

  return (
    <div style={{ padding: '50px', textAlign: 'center', color: '#fff', fontFamily: 'sans-serif' }}>
      <h2>Giriş işlemi onaylanıyor...</h2>
      <p>Lütfen bekleyin, panele yönlendiriliyorsunuz.</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>Yükleniyor...</div>}>
      <CallbackContent />
    </Suspense>
  );
}