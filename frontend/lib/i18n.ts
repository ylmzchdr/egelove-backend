export type Lang = "TR" | "EN" | "RU" | "AR";

const tr = {
  nav: { home: "Ana Sayfa", discover: "Keşfet", likes: "Beğeniler", messages: "Mesajlar", premium: "Premium", dashboard: "Panel" },
  dashboard: { find: "Birini Bul", friends: "Arkadaşlar", loveGame: "Aşk Oyunu", findDesc: "Aradığın kriterlere uygun üyeleri bul", friendsDesc: "Eşleştiğin üyelerle sohbet et", loveGameDesc: "Eğlenceli sorularla yeni insanlarla tanış" },
  auth: { login: "Giriş Yap", register: "Üye Ol", logout: "Çıkış Yap", emailOrPhone: "E-posta veya Telefon Numarası", password: "Şifre", name: "Ad", surname: "Soyad", email: "E-posta", phone: "Telefon", birthDate: "Doğum Tarihi", gender: "Cinsiyet", city: "İl", district: "İlçe", noAccount: "Hesabınız yok mu?", hasAccount: "Zaten hesabınız var mı?", terms: "Üyelik şartlarını kabul ediyorum", google: "Google ile Devam Et", female: "Kadın", male: "Erkek", other: "Diğer", selectCity: "İl seçin", selectDistrict: "İlçe seçin", selectCityFirst: "Önce il seçin" },
  hero: { title: "Mutlu Birlikteliklerin Başlangıcı", subtitle: "Türkiye'nin en köklü evlilik sitesi egelove ile gerçek aşkı bulun", cta: "Hemen Üye Ol" },
  discover: { title: "Türkiye'den Üyeleri Keşfet", subtitle: "Şehrindeki yeni insanlarla tanış" },
  profile: { like: "Beğen", viewProfile: "Profili Gör", verified: "Onaylı" },
  contact: { title: "İletişim", subtitle: "Sorularınız ve destek için bize ulaşın.", email: "destek@egelove.com", phone: "0850 300 00 00", location: "İzmir, Türkiye" },
  footer: { copyright: "Tüm Hakları Saklıdır." },
  premium: { title: "Premium Üyelik", monthly: "Aylık", quarterly: "3 Aylık", semiAnnual: "6 Aylık", annual: "Yıllık", select: "Satın Al" },
  city: "Şehir",
  features: { title: "Neden egelove?", members: "Geniş Üye Tabanı", membersDesc: "Ayda 90 bin yeni kayıt ile en geniş evlilik sitesi.", secure: "Güvenli Platform", secureDesc: "Tüm verileriniz şifrelenmiş ve güvenli sunucularda saklanır.", mobile: "Mobil Uygulama", mobileDesc: "Her an her yerden hesabınıza erişin.", experience: "15 Yıllık Tecrübe", experienceDesc: "Binlerce mutlu çiftin hikayesi bizimle başladı." },
};

const en: typeof tr = {
  nav: { home: "Home", discover: "Discover", likes: "Likes", messages: "Messages", premium: "Premium", dashboard: "Dashboard" },
  dashboard: { find: "Find Someone", friends: "Friends", loveGame: "Love Game", findDesc: "Find members matching your criteria", friendsDesc: "Chat with your matches", loveGameDesc: "Meet new people with fun questions" },
  auth: { login: "Login", register: "Sign Up", logout: "Logout", emailOrPhone: "Email or Phone Number", password: "Password", name: "Name", surname: "Surname", email: "Email", phone: "Phone", birthDate: "Birth Date", gender: "Gender", city: "City", district: "District", noAccount: "Don't have an account?", hasAccount: "Already have an account?", terms: "I accept the terms of membership", google: "Continue with Google", female: "Female", male: "Male", other: "Other", selectCity: "Select city", selectDistrict: "Select district", selectCityFirst: "Select city first" },
  hero: { title: "The Beginning of Happy Relationships", subtitle: "Find true love with egelove, Turkey's most established marriage site", cta: "Sign Up Now" },
  discover: { title: "Discover Members from Turkey", subtitle: "Meet new people in your city" },
  profile: { like: "Like", viewProfile: "View Profile", verified: "Verified" },
  contact: { title: "Contact", subtitle: "Contact us for questions and support.", email: "support@egelove.com", phone: "+90 850 300 00 00", location: "Izmir, Turkey" },
  footer: { copyright: "All Rights Reserved." },
  premium: { title: "Premium Membership", monthly: "Monthly", quarterly: "3 Months", semiAnnual: "6 Months", annual: "Annual", select: "Buy Now" },
  city: "City",
  features: { title: "Why egelove?", members: "Large Member Base", membersDesc: "The largest marriage site with 90k new registrations per month.", secure: "Secure Platform", secureDesc: "All your data is encrypted and stored on secure servers.", mobile: "Mobile App", mobileDesc: "Access your account anytime, anywhere.", experience: "15 Years Experience", experienceDesc: "Thousands of happy couples' stories started with us." },
};

const ru: typeof tr = {
  nav: { home: "Главная", discover: "Открыть", likes: "Нравится", messages: "Сообщения", premium: "Премиум", dashboard: "Панель" },
  dashboard: { find: "Найти кого-то", friends: "Друзья", loveGame: "Игра любви", findDesc: "Найдите участников по вашим критериям", friendsDesc: "Общайтесь с совпадениями", loveGameDesc: "Знакомьтесь с помощью вопросов" },
  auth: { login: "Войти", register: "Регистрация", logout: "Выйти", emailOrPhone: "Email или телефон", password: "Пароль", name: "Имя", surname: "Фамилия", email: "Email", phone: "Телефон", birthDate: "Дата рождения", gender: "Пол", city: "Город", district: "Район", noAccount: "Нет аккаунта?", hasAccount: "Уже есть аккаунт?", terms: "Я принимаю условия", google: "Продолжить с Google", female: "Женщина", male: "Мужчина", other: "Другое", selectCity: "Выберите город", selectDistrict: "Выберите район", selectCityFirst: "Сначала выберите город" },
  hero: { title: "Начало счастливых отношений", subtitle: "Найдите настоящую любовь с egelove", cta: "Зарегистрироваться" },
  discover: { title: "Найдите участников из Турции", subtitle: "Знакомьтесь с новыми людьми" },
  profile: { like: "Нравится", viewProfile: "Профиль", verified: "Проверено" },
  contact: { title: "Контакты", subtitle: "Свяжитесь с нами", email: "support@egelove.com", phone: "+90 850 300 00 00", location: "Измир, Турция" },
  footer: { copyright: "Все права защищены." },
  premium: { title: "Премиум", monthly: "Ежемесячный", quarterly: "3 месяца", semiAnnual: "6 месяцев", annual: "Годовой", select: "Купить" },
  city: "Город",
  features: { title: "Почему egelove?", members: "Большая база", membersDesc: "90k новых регистраций в месяц.", secure: "Безопасность", secureDesc: "Ваши данные зашифрованы.", mobile: "Мобильное приложение", mobileDesc: "Доступ в любое время.", experience: "15 лет опыта", experienceDesc: "Тысячи счастливых пар." },
};

const ar: typeof tr = {
  nav: { home: "الرئيسية", discover: "اكتشف", likes: "الإعجابات", messages: "الرسائل", premium: "بريميوم", dashboard: "لوحة التحكم" },
  dashboard: { find: "ابحث عن شخص", friends: "الأصدقاء", loveGame: "لعبة الحب", findDesc: "ابحث عن الأعضاء المطابقين لمعاييرك", friendsDesc: "تحدث مع المتطابقين", loveGameDesc: "تعرف على أشخاص جدد بأسئلة ممتعة" },
  auth: { login: "تسجيل الدخول", register: "اشتراك", logout: "تسجيل الخروج", emailOrPhone: "البريد الإلكتروني أو الهاتف", password: "كلمة المرور", name: "الاسم", surname: "اللقب", email: "البريد الإلكتروني", phone: "الهاتف", birthDate: "تاريخ الميلاد", gender: "الجنس", city: "المدينة", district: "المنطقة", noAccount: "ليس لديك حساب؟", hasAccount: "لديك حساب بالفعل؟", terms: "أوافق على الشروط", google: "المتابعة عبر Google", female: "أنثى", male: "ذكر", other: "آخر", selectCity: "اختر مدينة", selectDistrict: "اختر منطقة", selectCityFirst: "اختر المدينة أولاً" },
  hero: { title: "بداية العلاقات السعيدة", subtitle: "ابحث عن الحب الحقيقي مع egelove", cta: "اشترك الآن" },
  discover: { title: "اكتشف الأعضاء من تركيا", subtitle: "تعرف على أشخاص جدد في مدينتك" },
  profile: { like: "إعجاب", viewProfile: "الملف الشخصي", verified: "موثق" },
  contact: { title: "اتصل بنا", subtitle: "اتصل بنا للأسئلة والدعم", email: "support@egelove.com", phone: "+90 850 300 00 00", location: "إزمير، تركيا" },
  footer: { copyright: "جميع الحقوق محفوظة." },
  premium: { title: "عضوية بريميوم", monthly: "شهري", quarterly: "3 أشهر", semiAnnual: "6 أشهر", annual: "سنوي", select: "اشتر الآن" },
  city: "المدينة",
  features: { title: "لماذا egelove؟", members: "قاعدة أعضاء كبيرة", membersDesc: "أكبر موقع زواج مع 90 ألف تسجيل شهرياً.", secure: "منصة آمنة", secureDesc: "جميع بياناتك مشفرة.", mobile: "تطبيق جوال", mobileDesc: "الوصول إلى حسابك في أي وقت.", experience: "15 عاماً من الخبرة", experienceDesc: "آلاف القصص السعيدة بدأت معنا." },
};

export const translations: Record<Lang, typeof tr> = { TR: tr, EN: en, RU: ru, AR: ar };
