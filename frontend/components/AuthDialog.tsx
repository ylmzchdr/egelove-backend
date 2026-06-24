"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { api } from "@/lib/api";

type Tab = "login" | "register" | null;
type AuthDialogProps = { activeTab: Tab; onClose: () => void };

const allCities: Record<string, string[]> = {
  "Adana": ["Seyhan", "Çukurova", "Yüreğir", "Sarıçam", "Karaisalı", "Ceyhan", "Kozan", "İmamoğlu", "Pozantı", "Feke", "Tufanbeyli", "Saimbeyli", "Aladağ", "Karataş", "Yumurtalık"],
  "Adıyaman": ["Merkez", "Besni", "Çelikhan", "Gerger", "Gölbaşı", "Kâhta", "Samsat", "Sincik", "Tut"],
  "Afyonkarahisar": ["Merkez", "Başmakçı", "Bayat", "Bolvadin", "Çay", "Çobanlar", "Dazkırı", "Dinar", "Emirdağ", "Evciler", "Hocalar", "İhsaniye", "İscehisar", "Kızılören", "Sandıklı", "Sincanlı", "Sultandağı", "Şuhut"],
  "Ağrı": ["Merkez", "Diyadin", "Doğubayazıt", "Eleşkirt", "Hamur", "Patnos", "Taşlıçay", "Tutak"],
  "Aksaray": ["Merkez", "Ağaçören", "Eskil", "Gülağaç", "Güzelyurt", "Ortaköy", "Sarıyahşi"],
  "Amasya": ["Merkez", "Göynücek", "Gümüşhacıköy", "Hamamözü", "Merzifon", "Suluova", "Taşova"],
  "Ankara": ["Çankaya", "Keçiören", "Mamak", "Etimesgut", "Sincan", "Yenimahalle", "Pursaklar", "Altındağ", "Gölbaşı", "Polatlı", "Beypazarı", "Şereflikoçhisar", "Elmadağ", "Nallıhan", "Kızılcahamam", "Haymana", "Çubuk", "Akyurt", "Kalecik", "Bala", "Güdül", "Ayaş", "Evren", "Kazan"],
  "Antalya": ["Muratpaşa", "Konyaaltı", "Kepez", "Alanya", "Manavgat", "Serik", "Kemer", "Kaş", "Finike", "Kumluca", "Demre", "Elmalı", "Gündoğmuş", "Akseki", "İbradı", "Döşemealtı", "Aksu"],
  "Ardahan": ["Merkez", "Çıldır", "Damal", "Göle", "Hanak", "Posof"],
  "Artvin": ["Merkez", "Ardanuç", "Arhavi", "Borçka", "Hopa", "Murgul", "Şavşat", "Yusufeli"],
  "Aydın": ["Efeler", "Kuşadası", "Söke", "Didim", "Nazilli", "Çine", "Germencik", "İncirliova", "Köşk", "Sultanhisar", "Yenipazar", "Bozdoğan", "Buharkent", "Karacasu", "Karpuzlu", "Koçarlı"],
  "Balıkesir": ["Altıeylül", "Karesi", "Edremit", "Bandırma", "Gönen", "Ayvalık", "Burhaniye", "Erdek", "Bigadiç", "Sındırgı", "İvrindi", "Havran", "Susurluk", "Dursunbey", "Kepsut", "Balya", "Marmara", "Gömeç"],
  "Bartın": ["Merkez", "Amasra", "Kurucaşile", "Ulus"],
  "Batman": ["Merkez", "Beşiri", "Gercüş", "Hasankeyf", "Kozluk", "Sason"],
  "Bayburt": ["Merkez", "Aydıntepe", "Demirözü"],
  "Bilecik": ["Merkez", "Bozüyük", "Gölpazarı", "İnhisar", "Osmaneli", "Pazaryeri", "Söğüt", "Yenipazar"],
  "Bingöl": ["Merkez", "Adaklı", "Genç", "Karlıova", "Kiğı", "Solhan", "Yayladere", "Yedisu"],
  "Bitlis": ["Merkez", "Adilcevaz", "Ahlat", "Güroymak", "Hizan", "Mutki", "Tatvan"],
  "Bolu": ["Merkez", "Dörtdivan", "Gerede", "Göynük", "Kıbrıscık", "Mengen", "Mudurnu", "Seben", "Yeniçağa"],
  "Burdur": ["Merkez", "Ağlasun", "Altınyayla", "Bucak", "Çavdır", "Çeltikçi", "Gölhisar", "Karamanlı", "Kemer", "Tefenni", "Yeşilova"],
  "Bursa": ["Osmangazi", "Yıldırım", "Nilüfer", "İnegöl", "Gemlik", "Mudanya", "Orhangazi", "Gürsu", "Kestel", "Karacabey", "Mustafakemalpaşa", "Büyükorhan", "Harmancık", "Keles", "Orhaneli", "Yenişehir", "İznik"],
  "Çanakkale": ["Merkez", "Ayvacık", "Bayramiç", "Biga", "Bozcaada", "Çan", "Eceabat", "Ezine", "Gelibolu", "Gökçeada", "Lapseki", "Yenice"],
  "Çankırı": ["Merkez", "Atkaracalar", "Bayramören", "Çerkeş", "Eldivan", "Ilgaz", "Kızılırmak", "Korgun", "Kurşunlu", "Orta", "Şabanözü", "Yapraklı"],
  "Çorum": ["Merkez", "Alaca", "Bayat", "Boğazkale", "Dodurga", "İskilip", "Kargı", "Laçin", "Mecitözü", "Oğuzlar", "Ortaköy", "Osmancık", "Sungurlu", "Uğurludağ"],
  "Denizli": ["Merkezefendi", "Pamukkale", "Çivril", "Tavas", "Acıpayam", "Serinhisar", "Babadağ", "Bekilli", "Bozkurt", "Buldan", "Çal", "Çameli", "Güney", "Honaz", "Kale", "Sarayköy", "Beyağaç"],
  "Diyarbakır": ["Kayapınar", "Bağlar", "Yenişehir", "Sur", "Bismil", "Ergani", "Çınar", "Çermik", "Silvan", "Lice", "Hani", "Eğil", "Dicle", "Kulp", "Hazro", "Kocaköy"],
  "Düzce": ["Merkez", "Akçakoca", "Cumayeri", "Çilimli", "Gölyaka", "Gümüşova", "Kaynaşlı", "Yığılca"],
  "Edirne": ["Merkez", "Enez", "Havsa", "İpsala", "Keşan", "Lalapaşa", "Meriç", "Süloğlu", "Uzunköprü"],
  "Elazığ": ["Merkez", "Ağın", "Alacakaya", "Arıcak", "Baskil", "Karakoçan", "Keban", "Kovancılar", "Maden", "Palu", "Sivrice"],
  "Erzincan": ["Merkez", "Çayırlı", "İliç", "Kemah", "Kemaliye", "Otlukbeli", "Refahiye", "Tercan", "Üzümlü"],
  "Erzurum": ["Yakutiye", "Palandöken", "Aziziye", "Horasan", "Oltu", "Pasinler", "Köprüköy", "İspir", "Şenkaya", "Narman", "Karaçoban", "Hınıs", "Tekman", "Karayazı", "Çat", "Tortum", "Uzundere", "Olur", "Pazaryolu"],
  "Eskişehir": ["Tepebaşı", "Odunpazarı", "Sivrihisar", "Çifteler", "Seyitgazi", "Alpu", "Mihalıççık", "Mahmudiye", "İnönü", "Beylikova", "Günyüzü", "Han", "Sarıcakaya"],
  "Gaziantep": ["Şahinbey", "Şehitkamil", "Oğuzeli", "Nizip", "İslahiye", "Nurdağı", "Araban", "Yavuzeli", "Karkamış"],
  "Giresun": ["Merkez", "Alucra", "Bulancak", "Çamoluk", "Çanakçı", "Dereli", "Doğankent", "Espiye", "Eynesil", "Görele", "Güce", "Keşap", "Piraziz", "Şebinkarahisar", "Tirebolu", "Yağlıdere"],
  "Gümüşhane": ["Merkez", "Kelkit", "Köse", "Kürtün", "Şiran", "Torul"],
  "Hakkari": ["Merkez", "Çukurca", "Derecik", "Şemdinli", "Yüksekova"],
  "Hatay": ["Antakya", "İskenderun", "Defne", "Dörtyol", "Kırıkhan", "Reyhanlı", "Samandağ", "Arsuz", "Belen", "Hassa", "Erzin", "Payas", "Kumlu", "Yayladağı", "Altınözü"],
  "Iğdır": ["Merkez", "Aralık", "Karakoyunlu", "Tuzluca"],
  "Isparta": ["Merkez", "Aksu", "Atabey", "Eğirdir", "Gelendost", "Gönen", "Keçiborlu", "Senirkent", "Sütçüler", "Şarkikaraağaç", "Uluborlu", "Yalvaç", "Yenişarbademli"],
  "İstanbul": ["Kadıköy", "Beşiktaş", "Şişli", "Fatih", "Üsküdar", "Maltepe", "Pendik", "Kartal", "Ataşehir", "Beylikdüzü", "Esenler", "Bağcılar", "Küçükçekmece", "Büyükçekmece", "Sarıyer", "Beykoz", "Ümraniye", "Çekmeköy", "Sancaktepe", "Sultanbeyli", "Arnavutköy", "Başakşehir", "Avcılar", "Bakırköy", "Bayrampaşa", "Beyoğlu", "Çatalca", "Esenyurt", "Eyüpsultan", "Gaziosmanpaşa", "Güngören", "Kağıthane", "Silivri", "Sultangazi", "Tuzla", "Zeytinburnu", "Adalar", "Şile"],
  "İzmir": ["Karşıyaka", "Bornova", "Konak", "Buca", "Çiğli", "Balçova", "Narlıdere", "Gaziemir", "Güzelbahçe", "Seferihisar", "Urla", "Çeşme", "Menderes", "Torbalı", "Kemalpaşa", "Menemen", "Aliağa", "Foça", "Dikili", "Kınık", "Bergama", "Kiraz", "Beydağ", "Ödemiş", "Tire", "Bayındır", "Selçuk"],
  "Karabük": ["Merkez", "Eflani", "Eskipazar", "Ovacık", "Safranbolu", "Yenice"],
  "Karaman": ["Merkez", "Ayrancı", "Başyayla", "Ermenek", "Kazımkarabekir", "Sarıveliler"],
  "Kars": ["Merkez", "Akyaka", "Arpaçay", "Digor", "Kağızman", "Sarıkamış", "Selim", "Susuz"],
  "Kastamonu": ["Merkez", "Abana", "Araç", "Azdavay", "Bozkurt", "Cide", "Çatalzeytin", "Daday", "Devrekani", "Doğanyurt", "Hanönü", "İhsangazi", "İnebolu", "Küre", "Pınarbaşı", "Seydiler", "Şenpazar", "Taşköprü", "Tosya"],
  "Kayseri": ["Melikgazi", "Kocasinan", "Talas", "Develi", "Yahyalı", "Bünyan", "Pınarbaşı", "Tomarza", "Sarız", "Akışla", "Yeşilhisar", "Hacılar", "İncesu", "Özvatan", "Felahiye", "Sarıoğlan"],
  "Kırıkkale": ["Merkez", "Bahşılı", "Balışeyh", "Çelebi", "Delice", "Karakeçili", "Keskin", "Sulakyurt", "Yahşihan"],
  "Kırklareli": ["Merkez", "Babaeski", "Demirköy", "Kofçaz", "Lüleburgaz", "Pehlivanköy", "Pınarhisar", "Vize"],
  "Kırşehir": ["Merkez", "Akçakent", "Akpınar", "Boztepe", "Çiçekdağı", "Kaman", "Mucur"],
  "Kilis": ["Merkez", "Elbeyli", "Musabeyli", "Polateli"],
  "Kocaeli": ["İzmit", "Gebze", "Darıca", "Körfez", "Gölcük", "Derince", "Kandıra", "Karamürsel", "Başiskele", "Çayırova", "Dilovası", "Kartal"],
  "Konya": ["Selçuklu", "Meram", "Karatay", "Ereğli", "Akşehir", "Beyşehir", "Cihanbeyli", "Ilgın", "Seydişehir", "Kulu", "Çumra", "Hadim", "Doğanhisar", "Altınekin", "Akören", "Ahırlı", "Bozkır", "Derbent", "Emirgazi", "Güneysınır", "Halkapınar", "Hüyük", "Kadınhanı", "Sarayönü", "Taşkent", "Tuzlukçu", "Yalıhüyük", "Yunak"],
  "Kütahya": ["Merkez", "Altıntaş", "Aslanapa", "Çavdarhisar", "Domaniç", "Dumlupınar", "Emet", "Gediz", "Hisarcık", "Pazarlar", "Şaphane", "Simav", "Tavşanlı"],
  "Malatya": ["Battalgazi", "Yeşilyurt", "Doğanşehir", "Akçadağ", "Darende", "Hekimhan", "Pütürge", "Yazıhan", "Arapgir", "Arguvan", "Kale", "Kuluncak"],
  "Manisa": ["Yunusemre", "Şehzadeler", "Turgutlu", "Akhisar", "Salihli", "Soma", "Alaşehir", "Kula", "Demirci", "Saruhanlı", "Gördes", "Kırkağaç", "Selendi", "Ahmetli", "Gölmarmara", "Köprübaşı", "Sarıgöl"],
  "Kahramanmaraş": ["Dulkadiroğlu", "Onikişubat", "Afşin", "Elbistan", "Pazarcık", "Göksun", "Andırın", "Çağlayancerit", "Ekinözü", "Nurhak", "Türkoğlu"],
  "Mardin": ["Artuklu", "Kızıltepe", "Midyat", "Nusaybin", "Derik", "Mazıdağı", "Dargeçit", "Savur", "Yeşilli", "Ömerli"],
  "Mersin": ["Akdeniz", "Yenişehir", "Toroslar", "Mezitli", "Tarsus", "Erdemli", "Silifke", "Mut", "Anamur", "Gülnar", "Bozyazı", "Aydıncık", "Çamlıyayla"],
  "Muğla": ["Menteşe", "Bodrum", "Fethiye", "Marmaris", "Milas", "Dalaman", "Ortaca", "Köyceğiz", "Datça", "Ula", "Kavaklıdere", "Seydikemer"],
  "Muş": ["Merkez", "Bulanık", "Hasköy", "Korkut", "Malazgirt", "Varto"],
  "Nevşehir": ["Merkez", "Acıgöl", "Avanos", "Derinkuyu", "Gülşehir", "Hacıbektaş", "Kozaklı", "Ürgüp"],
  "Niğde": ["Merkez", "Altunhisar", "Bor", "Çamardı", "Çiftlik", "Ulukışla"],
  "Ordu": ["Altınordu", "Ünye", "Fatsa", "Gölköy", "Kumru", "Akkuş", "Aybastı", "Çamaş", "Çatalpınar", "Çaybaşı", "Gülyalı", "Gürgentepe", "İkizce", "Kabadüz", "Kabataş", "Korgan", "Mesudiye", "Perşembe", "Ulubey"],
  "Osmaniye": ["Merkez", "Bahçe", "Düziçi", "Hasanbeyli", "Kadirli", "Sumbas", "Toprakkale"],
  "Rize": ["Merkez", "Ardeşen", "Çamlıhemşin", "Çayeli", "Derepazarı", "Fındıklı", "Güneysu", "Hemşin", "İkizdere", "İyidere", "Kalkandere", "Pazar"],
  "Sakarya": ["Adapazarı", "Serdivan", "Akyazı", "Erenler", "Arifiye", "Hendek", "Karasu", "Geyve", "Sapanca", "Ferizli", "Karapürçek", "Kocaali", "Kaynarca", "Pamukova", "Söğütlü", "Taraklı"],
  "Samsun": ["Atakum", "İlkadım", "Canik", "Tekkeköy", "Bafra", "Çarşamba", "Terme", "Vezirköprü", "Havza", "Kavak", "Alaçam", "Asarcık", "Ayvacık", "Ladik", "Ondokuzmayıs", "Salıpazarı", "Yakakent"],
  "Siirt": ["Merkez", "Baykan", "Eruh", "Kurtalan", "Pervari", "Şirvan", "Tillo"],
  "Sinop": ["Merkez", "Ayancık", "Boyabat", "Dikmen", "Durağan", "Erfelek", "Gerze", "Saraydüzü", "Türkeli"],
  "Sivas": ["Merkez", "Akıncılar", "Altınyayla", "Divriği", "Doğanşar", "Gemerek", "Gölova", "Gürün", "Hafik", "İmranlı", "Kangal", "Koyulhisar", "Suşehri", "Şarkışla", "Ulaş", "Yıldızeli", "Zara"],
  "Şanlıurfa": ["Eyyübiye", "Haliliye", "Karaköprü", "Siverek", "Viranşehir", "Suruç", "Birecik", "Akçakale", "Harran", "Ceylanpınar", "Bozova", "Hilvan"],
  "Şırnak": ["Merkez", "Beytüşşebap", "Cizre", "Güçlükonak", "İdil", "Silopi", "Uludere"],
  "Tekirdağ": ["Süleymanpaşa", "Çorlu", "Çerkezköy", "Kapaklı", "Malkara", "Hayrabolu", "Muratlı", "Saray", "Şarköy", "Ergene", "Marmaraereğlisi"],
  "Tokat": ["Merkez", "Almus", "Artova", "Başçiftlik", "Erbaa", "Niksar", "Pazar", "Reşadiye", "Sulusaray", "Turhal", "Yeşilyurt", "Zile"],
  "Trabzon": ["Ortahisar", "Akçaabat", "Araklı", "Arsin", "Beşikdüzü", "Çarşıbaşı", "Çaykara", "Dernekpazarı", "Düzköy", "Hayrat", "Köprübaşı", "Maçka", "Of", "Sürmene", "Şalpazarı", "Tonya", "Vakfıkebir", "Yomra"],
  "Tunceli": ["Merkez", "Çemişgezek", "Hozat", "Mazgirt", "Nazımiye", "Ovacık", "Pertek", "Pülümür"],
  "Uşak": ["Merkez", "Banaz", "Eşme", "Karahallı", "Sivaslı", "Ulubey"],
  "Van": ["İpekyolu", "Tuşba", "Edremit", "Erciş", "Çaldıran", "Başkale", "Muradiye", "Gürpınar", "Çatak", "Gevaş", "Özalp", "Saray"],
  "Yalova": ["Merkez", "Altınova", "Armutlu", "Çiftlikköy", "Çınarcık", "Termal"],
  "Yozgat": ["Merkez", "Akdağmadeni", "Aydıncık", "Boğazlıyan", "Çandır", "Çayıralan", "Çekerek", "Kadışehri", "Saraykent", "Sarıkaya", "Sorgun", "Şefaatli", "Yenifakılı", "Yerköy"],
  "Zonguldak": ["Merkez", "Alaplı", "Çaycuma", "Devrek", "Ereğli", "Gökçebey", "Kdz.Ereğli"],
};

export default function AuthDialog({ activeTab, onClose }: AuthDialogProps) {
  const [tab, setTab] = useState<Tab>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { t } = useI18n();

  useEffect(() => { setTab(activeTab); }, [activeTab]);

  const [loginData, setLoginData] = useState({ emailOrPhone: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "", surname: "", email: "", phone: "", password: "", birthDate: "", gender: "", city: "", district: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.emailOrPhone || !loginData.password) { alert("Lütfen tüm alanları doldurun"); return; }
    setLoading(true);
    try {
      const res: any = await api.auth.login(loginData);
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      setLoginData({ emailOrPhone: "", password: "" });
      onClose();
      window.location.href = "/profile";
    } catch (err: any) {
      alert(err.message || "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) { alert("Lütfen şartları kabul edin"); return; }
    if (!registerData.name || !registerData.surname || !registerData.email || !registerData.phone || !registerData.password || !registerData.birthDate || !registerData.gender) {
      alert("Lütfen tüm alanları doldurun"); return;
    }
    setLoading(true);
    try {
      const res: any = await api.auth.register({
        ...registerData,
        turnstileToken: "demo-token",
      });
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      setRegisterData({ name: "", surname: "", email: "", phone: "", password: "", birthDate: "", gender: "", city: "", district: "" });
      setAgreeTerms(false);
      onClose();
window.location.href = "/dashboard";
    } catch (err: any) {
      alert(err.message || "Kayıt başarısız");
    } finally {
      setLoading(false);
    }
  };


const handleSocialLogin = () => {
  window.location.href =
    "https://egelove-backend.onrender.com/auth/google";
};


return (
    <Dialog open={tab !== null} onOpenChange={(open) => { if (!open) { onClose(); setTab(null); } }}>
      <DialogContent className="max-w-md bg-pink-900 text-white border-white/10">
        {tab === "login" && (
          <div>
            <DialogHeader><DialogTitle className="text-white text-xl">{t.auth.login}</DialogTitle></DialogHeader>
            <form onSubmit={handleLogin} className="space-y-4 mt-4 text-gray-200">
              <div>
                <Label className="text-white">{t.auth.emailOrPhone}</Label>
                <Input placeholder={t.auth.emailOrPhone} className="bg-pink-950/50 border-white/10 text-white placeholder:text-white/40"
                  value={loginData.emailOrPhone} onChange={(e) => setLoginData({ ...loginData, emailOrPhone: e.target.value })} />
              </div>
              <div>
                <Label className="text-white">{t.auth.password}</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder={t.auth.password}
                    className="bg-pink-950/50 border-white/10 text-white placeholder:text-white/40"
                    value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-white text-pink-600 hover:bg-gray-100 font-bold">
                {loading ? "..." : t.auth.login}
              </Button>

              {/* Çizgi Ayırıcı */}
              <div className="relative my-4 flex items-center justify-center w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <span className="relative bg-pink-900 px-2 text-xs text-white/60">veya</span>
              </div>

              {/* Google Butonu */}
              <button 
                type="button"
                onClick={() => window.location.href = "https://egelove-backend.onrender.com/auth/google"}
                className="w-full h-10 flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 font-medium rounded-md text-sm transition-colors duration-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.97 1 12 1 7.24 1 3.2 3.74 1.25 7.74l3.76 2.92C5.9 7.42 8.7 5.04 12 5.04z"/>
                  <path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.38-4.88 3.38-8.52z"/>
                  <path fill="#FBBC05" d="M5.01 10.66c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L1.25 3.22C.45 4.82 0 6.61 0 8.5s.45 3.68 1.25 5.28l3.76-2.92z"/>
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.66-2.84c-1.01.68-2.31 1.08-3.96 1.08-3.3 0-6.1-2.38-7.1-5.62L1.48 15.62C3.43 19.58 7.47 23 12 23z"/>
                </svg>
                Google ile Devam Et
              </button>

              <p className="text-center text-sm text-white/60">
                {t.auth.noAccount}{" "}
                <button type="button" className="text-pink-300 underline" onClick={() => setTab("register")}>{t.auth.register}</button>
              </p>
            </form>
          </div>
        )}


        {tab === "register" && (
          <div>
            <DialogHeader>
              <DialogTitle className="text-white text-xl">{t.auth.register}</DialogTitle>
              <Button type="button" onClick={handleSocialLogin}
                className="w-full mt-4 bg-white text-gray-900 hover:bg-gray-100 font-bold">{t.auth.google}</Button>
            </DialogHeader>

            <form onSubmit={handleRegister} className="space-y-4 mt-4 text-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-white">{t.auth.name}</Label>
                  <Input placeholder={t.auth.name} className="bg-pink-950/50 border-white/10 text-white placeholder:text-white/40"
                    value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} /></div>
                <div><Label className="text-white">{t.auth.surname}</Label>
                  <Input placeholder={t.auth.surname} className="bg-pink-950/50 border-white/10 text-white placeholder:text-white/40"
                    value={registerData.surname} onChange={(e) => setRegisterData({ ...registerData, surname: e.target.value })} /></div>
              </div>
              <Input type="email" placeholder={t.auth.email} className="bg-pink-950/50 border-white/10 text-white placeholder:text-white/40"
                value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} />
              <Input placeholder={t.auth.phone} className="bg-pink-950/50 border-white/10 text-white placeholder:text-white/40"
                value={registerData.phone} onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })} />
              <Input type="password" placeholder={t.auth.password} className="bg-pink-950/50 border-white/10 text-white placeholder:text-white/40"
                value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} />

              <div className="grid grid-cols-2 gap-4">
                <Input type="date" className="bg-pink-950/50 border-white/10 text-white"
                  value={registerData.birthDate} onChange={(e) => setRegisterData({ ...registerData, birthDate: e.target.value })} />
                <Select value={registerData.gender} onValueChange={(value) => setRegisterData({ ...registerData, gender: value })}>
                  <SelectTrigger className="bg-pink-950/50 border-white/10 text-white">
                    <SelectValue placeholder={t.auth.gender} />
                  </SelectTrigger>
                 <SelectContent>
  <SelectItem value="FEMALE">{t.auth.female}</SelectItem>
  <SelectItem value="MALE">{t.auth.male}</SelectItem>
  <SelectItem value="OTHER">{t.auth.other}</SelectItem>
</SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select value={registerData.city} onValueChange={(value) => setRegisterData({ ...registerData, city: value, district: "" })}>
                  <SelectTrigger className="bg-pink-950/50 border-white/10 text-white">
                    <SelectValue placeholder={t.auth.selectCity} />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {Object.keys(allCities).map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={registerData.district} disabled={!registerData.city}
                  onValueChange={(value) => setRegisterData({ ...registerData, district: value })}>
                  <SelectTrigger className="bg-pink-950/50 border-white/10 text-white">
                    <SelectValue placeholder={t.auth.selectDistrict} />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {(allCities[registerData.city] || []).map((district) => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Checkbox checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(!!checked)} />
                <span>{t.auth.terms}</span>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-white text-pink-600 hover:bg-gray-100 font-bold">
                {loading ? "..." : t.auth.register}
              </Button>
              <p className="text-center text-sm text-white/60">
                {t.auth.hasAccount}{" "}
                <button type="button" className="text-pink-300 underline" onClick={() => setTab("login")}>{t.auth.login}</button>
              </p>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
