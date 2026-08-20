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
  "Adana": ["Seyhan", "Ã‡ukurova", "YÃ¼reÄŸir", "SarÄ±Ã§am", "KaraisalÄ±", "Ceyhan", "Kozan", "Ä°mamoÄŸlu", "PozantÄ±", "Feke", "Tufanbeyli", "Saimbeyli", "AladaÄŸ", "KarataÅŸ", "YumurtalÄ±k"],
  "AdÄ±yaman": ["Merkez", "Besni", "Ã‡elikhan", "Gerger", "GÃ¶lbaÅŸÄ±", "KÃ¢hta", "Samsat", "Sincik", "Tut"],
  "Afyonkarahisar": ["Merkez", "BaÅŸmakÃ§Ä±", "Bayat", "Bolvadin", "Ã‡ay", "Ã‡obanlar", "DazkÄ±rÄ±", "Dinar", "EmirdaÄŸ", "Evciler", "Hocalar", "Ä°hsaniye", "Ä°scehisar", "KÄ±zÄ±lÃ¶ren", "SandÄ±klÄ±", "SincanlÄ±", "SultandaÄŸÄ±", "Åuhut"],
  "AÄŸrÄ±": ["Merkez", "Diyadin", "DoÄŸubayazÄ±t", "EleÅŸkirt", "Hamur", "Patnos", "TaÅŸlÄ±Ã§ay", "Tutak"],
  "Aksaray": ["Merkez", "AÄŸaÃ§Ã¶ren", "Eskil", "GÃ¼laÄŸaÃ§", "GÃ¼zelyurt", "OrtakÃ¶y", "SarÄ±yahÅŸi"],
  "Amasya": ["Merkez", "GÃ¶ynÃ¼cek", "GÃ¼mÃ¼ÅŸhacÄ±kÃ¶y", "HamamÃ¶zÃ¼", "Merzifon", "Suluova", "TaÅŸova"],
  "Ankara": ["Ã‡ankaya", "KeÃ§iÃ¶ren", "Mamak", "Etimesgut", "Sincan", "Yenimahalle", "Pursaklar", "AltÄ±ndaÄŸ", "GÃ¶lbaÅŸÄ±", "PolatlÄ±", "BeypazarÄ±", "ÅereflikoÃ§hisar", "ElmadaÄŸ", "NallÄ±han", "KÄ±zÄ±lcahamam", "Haymana", "Ã‡ubuk", "Akyurt", "Kalecik", "Bala", "GÃ¼dÃ¼l", "AyaÅŸ", "Evren", "Kazan"],
  "Antalya": ["MuratpaÅŸa", "KonyaaltÄ±", "Kepez", "Alanya", "Manavgat", "Serik", "Kemer", "KaÅŸ", "Finike", "Kumluca", "Demre", "ElmalÄ±", "GÃ¼ndoÄŸmuÅŸ", "Akseki", "Ä°bradÄ±", "DÃ¶ÅŸemealtÄ±", "Aksu"],
  "Ardahan": ["Merkez", "Ã‡Ä±ldÄ±r", "Damal", "GÃ¶le", "Hanak", "Posof"],
  "Artvin": ["Merkez", "ArdanuÃ§", "Arhavi", "BorÃ§ka", "Hopa", "Murgul", "ÅavÅŸat", "Yusufeli"],
  "AydÄ±n": ["Efeler", "KuÅŸadasÄ±", "SÃ¶ke", "Didim", "Nazilli", "Ã‡ine", "Germencik", "Ä°ncirliova", "KÃ¶ÅŸk", "Sultanhisar", "Yenipazar", "BozdoÄŸan", "Buharkent", "Karacasu", "Karpuzlu", "KoÃ§arlÄ±"],
  "BalÄ±kesir": ["AltÄ±eylÃ¼l", "Karesi", "Edremit", "BandÄ±rma", "GÃ¶nen", "AyvalÄ±k", "Burhaniye", "Erdek", "BigadiÃ§", "SÄ±ndÄ±rgÄ±", "Ä°vrindi", "Havran", "Susurluk", "Dursunbey", "Kepsut", "Balya", "Marmara", "GÃ¶meÃ§"],
  "BartÄ±n": ["Merkez", "Amasra", "KurucaÅŸile", "Ulus"],
  "Batman": ["Merkez", "BeÅŸiri", "GercÃ¼ÅŸ", "Hasankeyf", "Kozluk", "Sason"],
  "Bayburt": ["Merkez", "AydÄ±ntepe", "DemirÃ¶zÃ¼"],
  "Bilecik": ["Merkez", "BozÃ¼yÃ¼k", "GÃ¶lpazarÄ±", "Ä°nhisar", "Osmaneli", "Pazaryeri", "SÃ¶ÄŸÃ¼t", "Yenipazar"],
  "BingÃ¶l": ["Merkez", "AdaklÄ±", "GenÃ§", "KarlÄ±ova", "KiÄŸÄ±", "Solhan", "Yayladere", "Yedisu"],
  "Bitlis": ["Merkez", "Adilcevaz", "Ahlat", "GÃ¼roymak", "Hizan", "Mutki", "Tatvan"],
  "Bolu": ["Merkez", "DÃ¶rtdivan", "Gerede", "GÃ¶ynÃ¼k", "KÄ±brÄ±scÄ±k", "Mengen", "Mudurnu", "Seben", "YeniÃ§aÄŸa"],
  "Burdur": ["Merkez", "AÄŸlasun", "AltÄ±nyayla", "Bucak", "Ã‡avdÄ±r", "Ã‡eltikÃ§i", "GÃ¶lhisar", "KaramanlÄ±", "Kemer", "Tefenni", "YeÅŸilova"],
  "Bursa": ["Osmangazi", "YÄ±ldÄ±rÄ±m", "NilÃ¼fer", "Ä°negÃ¶l", "Gemlik", "Mudanya", "Orhangazi", "GÃ¼rsu", "Kestel", "Karacabey", "MustafakemalpaÅŸa", "BÃ¼yÃ¼korhan", "HarmancÄ±k", "Keles", "Orhaneli", "YeniÅŸehir", "Ä°znik"],
  "Ã‡anakkale": ["Merkez", "AyvacÄ±k", "BayramiÃ§", "Biga", "Bozcaada", "Ã‡an", "Eceabat", "Ezine", "Gelibolu", "GÃ¶kÃ§eada", "Lapseki", "Yenice"],
  "Ã‡ankÄ±rÄ±": ["Merkez", "Atkaracalar", "BayramÃ¶ren", "Ã‡erkeÅŸ", "Eldivan", "Ilgaz", "KÄ±zÄ±lÄ±rmak", "Korgun", "KurÅŸunlu", "Orta", "ÅabanÃ¶zÃ¼", "YapraklÄ±"],
  "Ã‡orum": ["Merkez", "Alaca", "Bayat", "BoÄŸazkale", "Dodurga", "Ä°skilip", "KargÄ±", "LaÃ§in", "MecitÃ¶zÃ¼", "OÄŸuzlar", "OrtakÃ¶y", "OsmancÄ±k", "Sungurlu", "UÄŸurludaÄŸ"],
  "Denizli": ["Merkezefendi", "Pamukkale", "Ã‡ivril", "Tavas", "AcÄ±payam", "Serinhisar", "BabadaÄŸ", "Bekilli", "Bozkurt", "Buldan", "Ã‡al", "Ã‡ameli", "GÃ¼ney", "Honaz", "Kale", "SaraykÃ¶y", "BeyaÄŸaÃ§"],
  "DiyarbakÄ±r": ["KayapÄ±nar", "BaÄŸlar", "YeniÅŸehir", "Sur", "Bismil", "Ergani", "Ã‡Ä±nar", "Ã‡ermik", "Silvan", "Lice", "Hani", "EÄŸil", "Dicle", "Kulp", "Hazro", "KocakÃ¶y"],
  "DÃ¼zce": ["Merkez", "AkÃ§akoca", "Cumayeri", "Ã‡ilimli", "GÃ¶lyaka", "GÃ¼mÃ¼ÅŸova", "KaynaÅŸlÄ±", "YÄ±ÄŸÄ±lca"],
  "Edirne": ["Merkez", "Enez", "Havsa", "Ä°psala", "KeÅŸan", "LalapaÅŸa", "MeriÃ§", "SÃ¼loÄŸlu", "UzunkÃ¶prÃ¼"],
  "ElazÄ±ÄŸ": ["Merkez", "AÄŸÄ±n", "Alacakaya", "ArÄ±cak", "Baskil", "KarakoÃ§an", "Keban", "KovancÄ±lar", "Maden", "Palu", "Sivrice"],
  "Erzincan": ["Merkez", "Ã‡ayÄ±rlÄ±", "Ä°liÃ§", "Kemah", "Kemaliye", "Otlukbeli", "Refahiye", "Tercan", "ÃœzÃ¼mlÃ¼"],
  "Erzurum": ["Yakutiye", "PalandÃ¶ken", "Aziziye", "Horasan", "Oltu", "Pasinler", "KÃ¶prÃ¼kÃ¶y", "Ä°spir", "Åenkaya", "Narman", "KaraÃ§oban", "HÄ±nÄ±s", "Tekman", "KarayazÄ±", "Ã‡at", "Tortum", "Uzundere", "Olur", "Pazaryolu"],
  "EskiÅŸehir": ["TepebaÅŸÄ±", "OdunpazarÄ±", "Sivrihisar", "Ã‡ifteler", "Seyitgazi", "Alpu", "MihalÄ±Ã§Ã§Ä±k", "Mahmudiye", "Ä°nÃ¶nÃ¼", "Beylikova", "GÃ¼nyÃ¼zÃ¼", "Han", "SarÄ±cakaya"],
  "Gaziantep": ["Åahinbey", "Åehitkamil", "OÄŸuzeli", "Nizip", "Ä°slahiye", "NurdaÄŸÄ±", "Araban", "Yavuzeli", "KarkamÄ±ÅŸ"],
  "Giresun": ["Merkez", "Alucra", "Bulancak", "Ã‡amoluk", "Ã‡anakÃ§Ä±", "Dereli", "DoÄŸankent", "Espiye", "Eynesil", "GÃ¶rele", "GÃ¼ce", "KeÅŸap", "Piraziz", "Åebinkarahisar", "Tirebolu", "YaÄŸlÄ±dere"],
  "GÃ¼mÃ¼ÅŸhane": ["Merkez", "Kelkit", "KÃ¶se", "KÃ¼rtÃ¼n", "Åiran", "Torul"],
  "Hakkari": ["Merkez", "Ã‡ukurca", "Derecik", "Åemdinli", "YÃ¼ksekova"],
  "Hatay": ["Antakya", "Ä°skenderun", "Defne", "DÃ¶rtyol", "KÄ±rÄ±khan", "ReyhanlÄ±", "SamandaÄŸ", "Arsuz", "Belen", "Hassa", "Erzin", "Payas", "Kumlu", "YayladaÄŸÄ±", "AltÄ±nÃ¶zÃ¼"],
  "IÄŸdÄ±r": ["Merkez", "AralÄ±k", "Karakoyunlu", "Tuzluca"],
  "Isparta": ["Merkez", "Aksu", "Atabey", "EÄŸirdir", "Gelendost", "GÃ¶nen", "KeÃ§iborlu", "Senirkent", "SÃ¼tÃ§Ã¼ler", "ÅarkikaraaÄŸaÃ§", "Uluborlu", "YalvaÃ§", "YeniÅŸarbademli"],
  "Ä°stanbul": ["KadÄ±kÃ¶y", "BeÅŸiktaÅŸ", "ÅiÅŸli", "Fatih", "ÃœskÃ¼dar", "Maltepe", "Pendik", "Kartal", "AtaÅŸehir", "BeylikdÃ¼zÃ¼", "Esenler", "BaÄŸcÄ±lar", "KÃ¼Ã§Ã¼kÃ§ekmece", "BÃ¼yÃ¼kÃ§ekmece", "SarÄ±yer", "Beykoz", "Ãœmraniye", "Ã‡ekmekÃ¶y", "Sancaktepe", "Sultanbeyli", "ArnavutkÃ¶y", "BaÅŸakÅŸehir", "AvcÄ±lar", "BakÄ±rkÃ¶y", "BayrampaÅŸa", "BeyoÄŸlu", "Ã‡atalca", "Esenyurt", "EyÃ¼psultan", "GaziosmanpaÅŸa", "GÃ¼ngÃ¶ren", "KaÄŸÄ±thane", "Silivri", "Sultangazi", "Tuzla", "Zeytinburnu", "Adalar", "Åile"],
  "Ä°zmir": ["KarÅŸÄ±yaka", "Bornova", "Konak", "Buca", "Ã‡iÄŸli", "BalÃ§ova", "NarlÄ±dere", "Gaziemir", "GÃ¼zelbahÃ§e", "Seferihisar", "Urla", "Ã‡eÅŸme", "Menderes", "TorbalÄ±", "KemalpaÅŸa", "Menemen", "AliaÄŸa", "FoÃ§a", "Dikili", "KÄ±nÄ±k", "Bergama", "Kiraz", "BeydaÄŸ", "Ã–demiÅŸ", "Tire", "BayÄ±ndÄ±r", "SelÃ§uk"],
  "KarabÃ¼k": ["Merkez", "Eflani", "Eskipazar", "OvacÄ±k", "Safranbolu", "Yenice"],
  "Karaman": ["Merkez", "AyrancÄ±", "BaÅŸyayla", "Ermenek", "KazÄ±mkarabekir", "SarÄ±veliler"],
  "Kars": ["Merkez", "Akyaka", "ArpaÃ§ay", "Digor", "KaÄŸÄ±zman", "SarÄ±kamÄ±ÅŸ", "Selim", "Susuz"],
  "Kastamonu": ["Merkez", "Abana", "AraÃ§", "Azdavay", "Bozkurt", "Cide", "Ã‡atalzeytin", "Daday", "Devrekani", "DoÄŸanyurt", "HanÃ¶nÃ¼", "Ä°hsangazi", "Ä°nebolu", "KÃ¼re", "PÄ±narbaÅŸÄ±", "Seydiler", "Åenpazar", "TaÅŸkÃ¶prÃ¼", "Tosya"],
  "Kayseri": ["Melikgazi", "Kocasinan", "Talas", "Develi", "YahyalÄ±", "BÃ¼nyan", "PÄ±narbaÅŸÄ±", "Tomarza", "SarÄ±z", "AkÄ±ÅŸla", "YeÅŸilhisar", "HacÄ±lar", "Ä°ncesu", "Ã–zvatan", "Felahiye", "SarÄ±oÄŸlan"],
  "KÄ±rÄ±kkale": ["Merkez", "BahÅŸÄ±lÄ±", "BalÄ±ÅŸeyh", "Ã‡elebi", "Delice", "KarakeÃ§ili", "Keskin", "Sulakyurt", "YahÅŸihan"],
  "KÄ±rklareli": ["Merkez", "Babaeski", "DemirkÃ¶y", "KofÃ§az", "LÃ¼leburgaz", "PehlivankÃ¶y", "PÄ±narhisar", "Vize"],
  "KÄ±rÅŸehir": ["Merkez", "AkÃ§akent", "AkpÄ±nar", "Boztepe", "Ã‡iÃ§ekdaÄŸÄ±", "Kaman", "Mucur"],
  "Kilis": ["Merkez", "Elbeyli", "Musabeyli", "Polateli"],
  "Kocaeli": ["Ä°zmit", "Gebze", "DarÄ±ca", "KÃ¶rfez", "GÃ¶lcÃ¼k", "Derince", "KandÄ±ra", "KaramÃ¼rsel", "BaÅŸiskele", "Ã‡ayÄ±rova", "DilovasÄ±", "Kartal"],
  "Konya": ["SelÃ§uklu", "Meram", "Karatay", "EreÄŸli", "AkÅŸehir", "BeyÅŸehir", "Cihanbeyli", "IlgÄ±n", "SeydiÅŸehir", "Kulu", "Ã‡umra", "Hadim", "DoÄŸanhisar", "AltÄ±nekin", "AkÃ¶ren", "AhÄ±rlÄ±", "BozkÄ±r", "Derbent", "Emirgazi", "GÃ¼neysÄ±nÄ±r", "HalkapÄ±nar", "HÃ¼yÃ¼k", "KadÄ±nhanÄ±", "SarayÃ¶nÃ¼", "TaÅŸkent", "TuzlukÃ§u", "YalÄ±hÃ¼yÃ¼k", "Yunak"],
  "KÃ¼tahya": ["Merkez", "AltÄ±ntaÅŸ", "Aslanapa", "Ã‡avdarhisar", "DomaniÃ§", "DumlupÄ±nar", "Emet", "Gediz", "HisarcÄ±k", "Pazarlar", "Åaphane", "Simav", "TavÅŸanlÄ±"],
  "Malatya": ["Battalgazi", "YeÅŸilyurt", "DoÄŸanÅŸehir", "AkÃ§adaÄŸ", "Darende", "Hekimhan", "PÃ¼tÃ¼rge", "YazÄ±han", "Arapgir", "Arguvan", "Kale", "Kuluncak"],
  "Manisa": ["Yunusemre", "Åehzadeler", "Turgutlu", "Akhisar", "Salihli", "Soma", "AlaÅŸehir", "Kula", "Demirci", "SaruhanlÄ±", "GÃ¶rdes", "KÄ±rkaÄŸaÃ§", "Selendi", "Ahmetli", "GÃ¶lmarmara", "KÃ¶prÃ¼baÅŸÄ±", "SarÄ±gÃ¶l"],
  "KahramanmaraÅŸ": ["DulkadiroÄŸlu", "OnikiÅŸubat", "AfÅŸin", "Elbistan", "PazarcÄ±k", "GÃ¶ksun", "AndÄ±rÄ±n", "Ã‡aÄŸlayancerit", "EkinÃ¶zÃ¼", "Nurhak", "TÃ¼rkoÄŸlu"],
  "Mardin": ["Artuklu", "KÄ±zÄ±ltepe", "Midyat", "Nusaybin", "Derik", "MazÄ±daÄŸÄ±", "DargeÃ§it", "Savur", "YeÅŸilli", "Ã–merli"],
  "Mersin": ["Akdeniz", "YeniÅŸehir", "Toroslar", "Mezitli", "Tarsus", "Erdemli", "Silifke", "Mut", "Anamur", "GÃ¼lnar", "BozyazÄ±", "AydÄ±ncÄ±k", "Ã‡amlÄ±yayla"],
  "MuÄŸla": ["MenteÅŸe", "Bodrum", "Fethiye", "Marmaris", "Milas", "Dalaman", "Ortaca", "KÃ¶yceÄŸiz", "DatÃ§a", "Ula", "KavaklÄ±dere", "Seydikemer"],
  "MuÅŸ": ["Merkez", "BulanÄ±k", "HaskÃ¶y", "Korkut", "Malazgirt", "Varto"],
  "NevÅŸehir": ["Merkez", "AcÄ±gÃ¶l", "Avanos", "Derinkuyu", "GÃ¼lÅŸehir", "HacÄ±bektaÅŸ", "KozaklÄ±", "ÃœrgÃ¼p"],
  "NiÄŸde": ["Merkez", "Altunhisar", "Bor", "Ã‡amardÄ±", "Ã‡iftlik", "UlukÄ±ÅŸla"],
  "Ordu": ["AltÄ±nordu", "Ãœnye", "Fatsa", "GÃ¶lkÃ¶y", "Kumru", "AkkuÅŸ", "AybastÄ±", "Ã‡amaÅŸ", "Ã‡atalpÄ±nar", "Ã‡aybaÅŸÄ±", "GÃ¼lyalÄ±", "GÃ¼rgentepe", "Ä°kizce", "KabadÃ¼z", "KabataÅŸ", "Korgan", "Mesudiye", "PerÅŸembe", "Ulubey"],
  "Osmaniye": ["Merkez", "BahÃ§e", "DÃ¼ziÃ§i", "Hasanbeyli", "Kadirli", "Sumbas", "Toprakkale"],
  "Rize": ["Merkez", "ArdeÅŸen", "Ã‡amlÄ±hemÅŸin", "Ã‡ayeli", "DerepazarÄ±", "FÄ±ndÄ±klÄ±", "GÃ¼neysu", "HemÅŸin", "Ä°kizdere", "Ä°yidere", "Kalkandere", "Pazar"],
  "Sakarya": ["AdapazarÄ±", "Serdivan", "AkyazÄ±", "Erenler", "Arifiye", "Hendek", "Karasu", "Geyve", "Sapanca", "Ferizli", "KarapÃ¼rÃ§ek", "Kocaali", "Kaynarca", "Pamukova", "SÃ¶ÄŸÃ¼tlÃ¼", "TaraklÄ±"],
  "Samsun": ["Atakum", "Ä°lkadÄ±m", "Canik", "TekkekÃ¶y", "Bafra", "Ã‡arÅŸamba", "Terme", "VezirkÃ¶prÃ¼", "Havza", "Kavak", "AlaÃ§am", "AsarcÄ±k", "AyvacÄ±k", "Ladik", "OndokuzmayÄ±s", "SalÄ±pazarÄ±", "Yakakent"],
  "Siirt": ["Merkez", "Baykan", "Eruh", "Kurtalan", "Pervari", "Åirvan", "Tillo"],
  "Sinop": ["Merkez", "AyancÄ±k", "Boyabat", "Dikmen", "DuraÄŸan", "Erfelek", "Gerze", "SaraydÃ¼zÃ¼", "TÃ¼rkeli"],
  "Sivas": ["Merkez", "AkÄ±ncÄ±lar", "AltÄ±nyayla", "DivriÄŸi", "DoÄŸanÅŸar", "Gemerek", "GÃ¶lova", "GÃ¼rÃ¼n", "Hafik", "Ä°mranlÄ±", "Kangal", "Koyulhisar", "SuÅŸehri", "ÅarkÄ±ÅŸla", "UlaÅŸ", "YÄ±ldÄ±zeli", "Zara"],
  "ÅanlÄ±urfa": ["EyyÃ¼biye", "Haliliye", "KarakÃ¶prÃ¼", "Siverek", "ViranÅŸehir", "SuruÃ§", "Birecik", "AkÃ§akale", "Harran", "CeylanpÄ±nar", "Bozova", "Hilvan"],
  "ÅÄ±rnak": ["Merkez", "BeytÃ¼ÅŸÅŸebap", "Cizre", "GÃ¼Ã§lÃ¼konak", "Ä°dil", "Silopi", "Uludere"],
  "TekirdaÄŸ": ["SÃ¼leymanpaÅŸa", "Ã‡orlu", "Ã‡erkezkÃ¶y", "KapaklÄ±", "Malkara", "Hayrabolu", "MuratlÄ±", "Saray", "ÅarkÃ¶y", "Ergene", "MarmaraereÄŸlisi"],
  "Tokat": ["Merkez", "Almus", "Artova", "BaÅŸÃ§iftlik", "Erbaa", "Niksar", "Pazar", "ReÅŸadiye", "Sulusaray", "Turhal", "YeÅŸilyurt", "Zile"],
  "Trabzon": ["Ortahisar", "AkÃ§aabat", "AraklÄ±", "Arsin", "BeÅŸikdÃ¼zÃ¼", "Ã‡arÅŸÄ±baÅŸÄ±", "Ã‡aykara", "DernekpazarÄ±", "DÃ¼zkÃ¶y", "Hayrat", "KÃ¶prÃ¼baÅŸÄ±", "MaÃ§ka", "Of", "SÃ¼rmene", "ÅalpazarÄ±", "Tonya", "VakfÄ±kebir", "Yomra"],
  "Tunceli": ["Merkez", "Ã‡emiÅŸgezek", "Hozat", "Mazgirt", "NazÄ±miye", "OvacÄ±k", "Pertek", "PÃ¼lÃ¼mÃ¼r"],
  "UÅŸak": ["Merkez", "Banaz", "EÅŸme", "KarahallÄ±", "SivaslÄ±", "Ulubey"],
  "Van": ["Ä°pekyolu", "TuÅŸba", "Edremit", "ErciÅŸ", "Ã‡aldÄ±ran", "BaÅŸkale", "Muradiye", "GÃ¼rpÄ±nar", "Ã‡atak", "GevaÅŸ", "Ã–zalp", "Saray"],
  "Yalova": ["Merkez", "AltÄ±nova", "Armutlu", "Ã‡iftlikkÃ¶y", "Ã‡Ä±narcÄ±k", "Termal"],
  "Yozgat": ["Merkez", "AkdaÄŸmadeni", "AydÄ±ncÄ±k", "BoÄŸazlÄ±yan", "Ã‡andÄ±r", "Ã‡ayÄ±ralan", "Ã‡ekerek", "KadÄ±ÅŸehri", "Saraykent", "SarÄ±kaya", "Sorgun", "Åefaatli", "YenifakÄ±lÄ±", "YerkÃ¶y"],
  "Zonguldak": ["Merkez", "AlaplÄ±", "Ã‡aycuma", "Devrek", "EreÄŸli", "GÃ¶kÃ§ebey", "Kdz.EreÄŸli"],
};

export default function AuthDialog({ activeTab, onClose }: AuthDialogProps) {
  const [tab, setTab] = useState<Tab>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { t } = useI18n();

  useEffect(() => { setTab(activeTab); }, [activeTab]);
    useEffect(() => {
    // ğŸš€ GOOGLE GÄ°RÄ°Å RENDER KÄ°LÄ°DÄ°NÄ° KIRAN 10 SANÄ°YELÄ°K CAN SÃœYÃœ Ã‡ARKÄ°
    const interval = setInterval(() => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        clearInterval(interval);
        window.location.href = "/dashboard";
      } else {
        // Token henÃ¼z gelmediyse veya backend uykudaysa yerel hafÄ±zayÄ± hareketlendir
        console.log("â˜… Egelove Render Trigger: 10 saniyelik hareket verildi.");
        localStorage.setItem("render_pulse", Date.now().toString());
      }
    }, 10000); // Tam 10 saniyede bir tetikler!

    return () => clearInterval(interval);
  }, []);


  const [loginData, setLoginData] = useState({ emailOrPhone: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    birthDate: "",
    gender: "",
    city: "",
    district: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.emailOrPhone || !loginData.password) { alert("LÃ¼tfen tÃ¼m alanlarÄ± doldurun"); return; }
    setLoading(true);
    try {
      const res: any = await api.auth.login(loginData);
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      setLoginData({ emailOrPhone: "", password: "" });
      onClose();
      window.location.href = "/profile";
    } catch (err: any) {
      alert(err.message || "GiriÅŸ baÅŸarÄ±sÄ±z");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      alert("LÃ¼tfen ÅŸartlarÄ± kabul edin");
      return;
    }

    if (
      !registerData.name ||
      !registerData.username ||
      !registerData.email ||
      !registerData.password
    ) {
      alert("LÃ¼tfen tÃ¼m alanlarÄ± doldurun");
      return;
    }

    setLoading(true);

    try {
      const res: any = await api.auth.register({
        name: registerData.name,
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        birthDate: registerData.birthDate || "2000-01-01",
        gender: registerData.gender || "OTHER",
        city: registerData.city || "",
        district: registerData.district || "",
        turnstileToken: "demo-token",
      });

      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);

      setRegisterData({
        name: "",
        username: "",
        email: "",
        password: "",
        birthDate: "",
        gender: "",
        city: "",
        district: "",
      });

      setAgreeTerms(false);
      onClose();
      window.location.href = "/dashboard";
    } catch (err: any) {
      alert(err.message || "KayÄ±t baÅŸarÄ±sÄ±z");
    } finally {
      setLoading(false);
    }
  };


const handleSocialLogin = () => {
  window.location.href =
    "https://egelove-backend.onrender.com/auth/login/google";
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

              
             <div className="flex justify-end mt-1 mb-3">
  <button
    type="button"
    onClick={() => {
      onClose();
      window.location.href = "/forgot-password";
    }}
    className="text-base text-pink-300 hover:text-pink-200 hover:underline transition-colors"
  >
    Åifremi Unuttum?
  </button>
</div>

<Button
  type="submit"
  disabled={loading}
  className="w-full bg-white text-pink-600 hover:bg-gray-100 font-bold"
>
  {loading ? "..." : t.auth.login}
</Button>

              {/* Ã‡izgi AyÄ±rÄ±cÄ± */}
              <div className="relative my-4 flex items-center justify-center w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <span className="relative bg-pink-900 px-2 text-xs text-white/60">veya</span>
              </div>

              {/* Google Butonu */}
              <button 
                type="button"
                                            onClick={handleSocialLogin}

              

                className="w-full h-10 flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 font-medium rounded-md text-base transition-colors duration-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.97 1 12 1 7.24 1 3.2 3.74 1.25 7.74l3.76 2.92C5.9 7.42 8.7 5.04 12 5.04z"/>
                  <path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.38-4.88 3.38-8.52z"/>
                  <path fill="#FBBC05" d="M5.01 10.66c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L1.25 3.22C.45 4.82 0 6.61 0 8.5s.45 3.68 1.25 5.28l3.76-2.92z"/>
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.66-2.84c-1.01.68-2.31 1.08-3.96 1.08-3.3 0-6.1-2.38-7.1-5.62L1.48 15.62C3.43 19.58 7.47 23 12 23z"/>
                </svg>
                Google ile Devam Et
              </button>

              <p className="text-center text-base text-white/60">
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
                <div>
                  <Label className="text-white">{t.auth.name}</Label>
                  <Input
                    placeholder={t.auth.name}
                    className="bg-pink-950/50 border-white/10 text-white placeholder:text-white/40"
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label className="text-white">KullanÄ±cÄ± AdÄ±</Label>
                  <Input
                    placeholder="KullanÄ±cÄ± AdÄ±"
                    className="bg-pink-950/50 border-white/10 text-white placeholder:text-white/40"
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <Input
                type="email"
                placeholder={t.auth.email}
                className="bg-pink-950/50 border-white/10 text-white placeholder:text-white/40"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
              />

              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t.auth.password}
                className="bg-pink-950/50 border-white/10 text-white placeholder:text-white/40"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
              />

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

              <div className="flex items-center gap-2 text-base">
                <Checkbox checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(!!checked)} />
                <span>{t.auth.terms}</span>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-white text-pink-600 hover:bg-gray-100 font-bold">
                {loading ? "..." : t.auth.register}
              </Button>
              <p className="text-center text-base text-white/60">
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

