import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Kendi backend adresinizi tırnaklar arasına güvenli bir şekilde ekledik
    const backendUrl = "https://" + "egelove-backend" + ".onrender" + ".com/api/auth/google";
    await fetch(backendUrl);
    
    return NextResponse.json({ status: 'ok', message: 'Sistem tetiklendi!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
