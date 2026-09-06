# SenVeBen — Pembe + Beyaz Renk Dönüşüm Paketi

Bu paket **sayfa düzenini değiştirmeden yalnızca renkleri** SenVeBen pembe + beyaz marka diline taşımak için hazırlanmıştır.

## Kullanım

1. Bu klasörü senveben projesinin kök dizinine kopyalayın.
2. PowerShell'i proje kökünde açın.
3. Şunu çalıştırın:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\SenVeBen-Pembe-Renk-Donusumu.ps1
```

Script önce değiştireceği dosyaların `.senveben-color-backup` yedeğini oluşturur; ardından yalnızca renk tokenlarını değiştirir.

> **Önemli:** Layout, spacing, grid, component yapısı, metinler, API adresleri ve routing değiştirilmez.

## Marka paleti

- Primary: `#E91E63`
- Primary dark: `#C2185B`
- Primary light: `#FCE4EC`
- White: `#FFFFFF`
- Soft background: `#FFF7FA`
- Text: `#2D1721`

## Kontrol

Script sonunda değiştirdiği dosyaları ve renk değişim sayılarını listeler. Sonrasında:

```powershell
npm run build
```

ile build kontrolü yapılabilir.
