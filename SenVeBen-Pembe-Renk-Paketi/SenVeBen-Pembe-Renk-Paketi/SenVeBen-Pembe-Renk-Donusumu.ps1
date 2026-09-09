$ErrorActionPreference = 'Stop'

$root = Get-Location
$targets = @(
  'frontend/app/page.tsx',
  'frontend/components/Header.tsx',
  'frontend/components/HeroSection.tsx',
  'frontend/components/FeaturesSection.tsx',
  'frontend/components/ContactSection.tsx',
  'frontend/components/Footer.tsx'
)

$replacements = [ordered]@{
  'text-\[#FFC000\]' = 'text-pink-600'
  'text-cyan-50' = 'text-pink-50'
  'text-cyan-100' = 'text-pink-100'
  'text-cyan-200' = 'text-pink-200'
  'text-cyan-300' = 'text-pink-300'
  'text-cyan-400' = 'text-pink-500'
  'text-cyan-500' = 'text-pink-600'
  'text-cyan-600' = 'text-pink-700'
  'bg-cyan-50' = 'bg-pink-50'
  'bg-cyan-100' = 'bg-pink-100'
  'bg-cyan-200' = 'bg-pink-200'
  'bg-cyan-300' = 'bg-pink-300'
  'bg-cyan-300/10' = 'bg-pink-500/10'
  'bg-cyan-300/15' = 'bg-pink-500/15'
  'bg-cyan-400/10' = 'bg-pink-500/10'
  'bg-cyan-500' = 'bg-pink-600'
  'border-cyan-300' = 'border-pink-300'
  'border-cyan-300/25' = 'border-[#F6BA48]/25'
  'border-cyan-300/50' = 'border-[#F6BA48]/50'
  'from-cyan-300' = 'from-pink-300'
  'via-cyan-300' = 'via-pink-300'
  'to-cyan-300' = 'to-pink-300'
  'hover:bg-cyan-200' = 'hover:bg-pink-200'
  'hover:bg-cyan-300' = 'hover:bg-[#F6BA48]'
  'data-\[state=checked\]:border-cyan-300' = 'data-[state=checked]:border-pink-300'
  'data-\[state=checked\]:bg-cyan-300' = 'data-[state=checked]:bg-pink-300'
  'bg-sky-400' = 'bg-pink-500'
  'text-sky-300' = 'text-pink-500'
  'text-sky-400' = 'text-pink-600'
  'border-sky-300' = 'border-pink-300'
  'bg-indigo-500' = 'bg-pink-600'
  'text-indigo-400' = 'text-pink-600'
  'border-indigo-400' = 'border-pink-300'
  'bg-violet-600' = 'bg-pink-600'
  'text-violet-400' = 'text-pink-600'
  'border-violet-400' = 'border-pink-300'
  'to-violet-600' = 'to-pink-600'
  'from-violet-600' = 'from-pink-600'
  'via-violet-500' = 'via-pink-500'
  'bg-fuchsia-600' = 'bg-pink-600'
  'text-fuchsia-400' = 'text-pink-600'
  'border-fuchsia-400' = 'border-pink-300'
  'to-fuchsia-600' = 'to-pink-600'
  'from-fuchsia-600' = 'from-pink-600'
}

foreach ($rel in $targets) {
  $path = Join-Path $root $rel
  if (-not (Test-Path $path)) {
    Write-Host "ATLANDI (dosya yok): $rel" -ForegroundColor Yellow
    continue
  }

  $backup = "$path.senveben-color-backup"
  if (-not (Test-Path $backup)) {
    Copy-Item $path $backup
  }

  $text = Get-Content $path -Raw -Encoding UTF8
  $before = $text
  foreach ($pair in $replacements.GetEnumerator()) {
    $text = [regex]::Replace($text, $pair.Key, $pair.Value)
  }

  if ($text -ne $before) {
    Set-Content $path $text -Encoding UTF8
    Write-Host "DEGISTI: $rel" -ForegroundColor Green
  } else {
    Write-Host "RENK TOKENI YOK: $rel" -ForegroundColor DarkGray
  }
}

Write-Host "`nSenVeBen pembe renk donusumu tamamlandi." -ForegroundColor Magenta
Write-Host "Duzen, spacing, component yapisi, API ve routing degistirilmedi." -ForegroundColor White
Write-Host "Build kontrolu: npm run build" -ForegroundColor Cyan
