import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

type EgeMatchLang = "TR" | "EN" | "RU" | "AR";

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateMyEgeMatch(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        city: true,
        district: true,
        photos: true,
      },
    });

    if (!user) throw new NotFoundException("Kullanıcı bulunamadı");

    const u: any = user;

    let score = 35;
    let energy = 40;
    let interest = 35;
    let love = 35;

    const strengths: string[] = [];
    const risks: string[] = [];

    const photos = u.photos || [];
    const approvedPhotos = photos.filter((p: any) => p.status === "APPROVED");

    if (approvedPhotos.length >= 1) {
      score += 12;
      energy += 10;
      strengths.push("Profil fotoğrafı mevcut");
    } else {
      risks.push("Profil fotoğrafı eksik");
    }

    if (approvedPhotos.length >= 3) {
      score += 8;
      interest += 8;
      strengths.push("Birden fazla fotoğraf güven hissini artırıyor");
    }

    if (u.bio || u.aboutMe) {
      score += 12;
      interest += 12;
      strengths.push("Kendini anlatan profil metni var");
    } else {
      risks.push("Hakkımda alanı zayıf");
    }

    if (u.lookingFor) {
      score += 10;
      love += 12;
      strengths.push("İlişki beklentisi daha net görünüyor");
    } else {
      risks.push("Aradığı kişi bilgisi eksik");
    }

    if (u.city) score += 5;
    if (u.district) score += 4;
    if (u.birthDate) score += 5;
    if (u.occupation) score += 5;
    if (u.education) score += 4;
    if (u.income) score += 3;
    if (u.height) score += 3;
    if (u.eyeColor) score += 2;
    if (u.hairColor) score += 2;
    if (u.children) score += 3;

    const hobbies = this.toArray(u.hobbies);

    if (hobbies.length > 0) {
      score += 8;
      interest += 10;
      strengths.push("Ortak ilgi alanı üretmeye uygun hobiler var");
    } else {
      risks.push("Hobiler alanı boş");
    }

    if (u.isVerified || u.isEmailVerified) {
      score += 6;
      energy += 5;
      strengths.push("Doğrulanmış profil güveni artırıyor");
    }

    score = this.clamp(score);
    energy = this.clamp(energy + Math.round(score * 0.15));
    interest = this.clamp(interest + Math.round(score * 0.12));
    love = this.clamp(love + Math.round(score * 0.14));

    return {
      score,
      energy,
      interest,
      love,
      label: this.getLabel(score),
      summary: this.createSummary(score),
      strengths: strengths.slice(0, 4),
      risks: risks.slice(0, 4),
      suggestions: this.createSuggestions(risks),
    };
  }

  async calculateUserToUserEgeMatch(
    myUserId: string,
    targetUserId: string,
    lang: EgeMatchLang | string = "TR",
  ) {
    const safeLang = this.normalizeLang(lang);
    if (myUserId === targetUserId) {
      const myResult = await this.calculateMyEgeMatch(myUserId);

      return {
        ...myResult,
        summary: this.t(safeLang, "selfSummary"),
        strengths: [this.t(safeLang, "selfStrength")],
        risks: [],
        suggestions: [this.t(safeLang, "selfSuggestion")],
      };
    }

    const [me, target] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: myUserId },
        include: { city: true, district: true, photos: true },
      }),
      this.prisma.user.findUnique({
        where: { id: targetUserId },
        include: { city: true, district: true, photos: true },
      }),
    ]);

    if (!me) throw new NotFoundException("Kullanıcı bulunamadı");
    if (!target) throw new NotFoundException("Karşı profil bulunamadı");

    const a: any = me;
    const b: any = target;

    let score = 30;
    let energy = 35;
    let interest = 35;
    let love = 35;

    const strengths: string[] = [];
    const risks: string[] = [];
    const suggestions: string[] = [];

    const ageA = this.getAge(a.birthDate);
    const ageB = this.getAge(b.birthDate);

    if (ageA && ageB) {
      const diff = Math.abs(ageA - ageB);

      if (diff <= 5) {
        score += 15;
        love += 12;
        strengths.push("Yaş uyumu güçlü görünüyor");
      } else if (diff <= 10) {
        score += 8;
        love += 6;
        strengths.push("Yaş farkı yönetilebilir seviyede");
      } else {
        score -= 5;
        risks.push("Yaş farkı bazı beklenti farklılıkları oluşturabilir");
      }
    }

    if (a.city?.id && b.city?.id && a.city.id === b.city.id) {
      score += 12;
      energy += 10;
      strengths.push("Aynı şehirde olmak tanışmayı kolaylaştırır");
    } else if (a.city?.name && b.city?.name) {
      score += 4;
      risks.push("Farklı şehirlerde olmak görüşme sıklığını etkileyebilir");
    }

    if (a.district?.id && b.district?.id && a.district.id === b.district.id) {
      score += 6;
      energy += 5;
      strengths.push("Aynı ilçede olmak yakınlık avantajı sağlar");
    }

    const hobbiesA = this.toArray(a.hobbies);
    const hobbiesB = this.toArray(b.hobbies);

    const commonHobbies = hobbiesA.filter((h) =>
      hobbiesB.some((x) => x.toLowerCase() === h.toLowerCase()),
    );

    if (commonHobbies.length >= 3) {
      score += 16;
      interest += 16;
      strengths.push("Ortak hobiler güçlü sohbet potansiyeli yaratıyor");
    } else if (commonHobbies.length >= 1) {
      score += 9;
      interest += 10;
      strengths.push("Ortak ilgi alanları var");
    } else if (hobbiesA.length > 0 && hobbiesB.length > 0) {
      score += 3;
      risks.push("Ortak hobi az görünüyor");
    } else {
      risks.push("Hobi bilgileri eksik olduğu için ortak ilgi analizi zayıf");
    }

    if (a.education && b.education && a.education === b.education) {
      score += 6;
      interest += 5;
      strengths.push("Eğitim seviyesi benzer");
    }

    if (a.children && b.children && a.children === b.children) {
      score += 8;
      love += 8;
      strengths.push("Çocuk konusundaki beklentiler uyumlu görünüyor");
    }

    if (a.lookingFor && b.lookingFor) {
      score += 10;
      love += 10;
      strengths.push("İki profil de ilişki beklentisini belirtmiş");
    } else {
      risks.push("İlişki beklentisi alanı iki tarafta da net olmayabilir");
    }

    if ((a.bio || a.aboutMe) && (b.bio || b.aboutMe)) {
      score += 8;
      interest += 7;
      strengths.push("İki profil de kendini anlatıyor");
    } else {
      risks.push("Profil açıklaması eksikliği ilk izlenimi zayıflatabilir");
    }

    const targetPhotos = (b.photos || []).filter(
      (p: any) => p.status === "APPROVED",
    );

    if (targetPhotos.length >= 3) {
      score += 6;
      energy += 6;
      strengths.push("Karşı profil fotoğraflarla daha güvenilir görünüyor");
    } else if (targetPhotos.length === 0) {
      risks.push("Karşı profilde onaylı fotoğraf görünmüyor");
    }

    score = this.clamp(score);
    energy = this.clamp(energy + Math.round(score * 0.12));
    interest = this.clamp(interest + Math.round(score * 0.14));
    love = this.clamp(love + Math.round(score * 0.15));

    if (commonHobbies.length > 0) {
      suggestions.push(
        `İlk mesajda ${commonHobbies[0]} konusundan sohbet başlatılabilir.`,
      );
    } else {
      suggestions.push("İlk mesajda profilindeki şehir veya ilgi alanları sorulabilir.");
    }

    if (a.city?.id && b.city?.id && a.city.id === b.city.id) {
      suggestions.push("Aynı şehir avantajı kullanılarak kısa bir kahve buluşması önerilebilir.");
    } else {
      suggestions.push("Farklı şehir varsa önce rahat bir sohbet temposu kurulmalı.");
    }

    return {
      score,
      energy,
      interest,
      love,
      label: this.getLabel(score, safeLang),
      summary: this.createUserToUserSummary(score, b, safeLang),
      strengths: strengths.slice(0, 5).map((item) => this.translateText(item, safeLang)),
      risks: risks.slice(0, 5).map((item) => this.translateText(item, safeLang)),
      suggestions: suggestions.slice(0, 4).map((item) =>
        this.translateText(item, safeLang),
      ),
      commonHobbies,
    };
  }

  private clamp(value: number) {
    return Math.max(0, Math.min(99, value));
  }

  private getLabel(score: number, lang: EgeMatchLang = "TR") {
    if (score >= 90) return this.t(lang, "labelPerfect");
    if (score >= 75) return this.t(lang, "labelHigh");
    if (score >= 55) return this.t(lang, "labelMedium");
    return this.t(lang, "labelImprove");
  }

  private createSummary(score: number) {
    if (score >= 90) {
      return "Profilin çok güçlü görünüyor. EgeMatch AI, bu profilin yüksek ilgi çekme ve güçlü eşleşme potansiyeline sahip olduğunu düşünüyor.";
    }

    if (score >= 75) {
      return "Profilin iyi seviyede. Birkaç alanı daha doldurursan EgeMatch AI uyum puanın daha da yükselebilir.";
    }

    if (score >= 55) {
      return "Profilin temel olarak hazır, fakat daha fazla fotoğraf, hobi ve ilişki beklentisi eklemek eşleşme kaliteni artırabilir.";
    }

    return "Profilin henüz zayıf görünüyor. Fotoğraf, hakkımda ve aradığım kişi alanlarını doldurman EgeMatch AI puanını ciddi şekilde yükseltir.";
  }

  private createUserToUserSummary(score: number, target: any, lang: EgeMatchLang = "TR") {
    const targetName =
      target.name && target.name.trim() ? target.name.trim() : "bu profil";

    if (score >= 90) {
      return this.t(lang, "summary90", { name: targetName });
    }

    if (score >= 75) {
      return this.t(lang, "summary75", { name: targetName });
    }

    if (score >= 55) {
      return this.t(lang, "summary55", { name: targetName });
    }

    return this.t(lang, "summaryLow", { name: targetName });
  }

  private createSuggestions(risks: string[]) {
    const suggestions: string[] = [];

    if (risks.some((r) => r.includes("fotoğraf"))) {
      suggestions.push("En az 3 net profil fotoğrafı ekle.");
    }

    if (risks.some((r) => r.includes("Hakkımda"))) {
      suggestions.push("Hakkımda alanına kısa ama samimi bir açıklama yaz.");
    }

    if (risks.some((r) => r.includes("Aradığı"))) {
      suggestions.push("Nasıl biriyle tanışmak istediğini netleştir.");
    }

    if (risks.some((r) => r.includes("Hobiler"))) {
      suggestions.push("Hobilerini ekle; AI ortak ilgi alanlarını buradan çıkarır.");
    }

    if (suggestions.length === 0) {
      suggestions.push("Profilin güçlü. Daha detaylı analiz için premium AI raporu eklenebilir.");
    }

    return suggestions;
  }


  private normalizeLang(lang?: string): EgeMatchLang {
    const upper = String(lang || "TR").toUpperCase();

    if (upper === "EN" || upper === "RU" || upper === "AR") {
      return upper;
    }

    return "TR";
  }

  private t(
    lang: EgeMatchLang,
    key: string,
    vars: Record<string, string> = {},
  ) {
    const dictionary: Record<EgeMatchLang, Record<string, string>> = {
      TR: {
        selfSummary:
          "Bu senin kendi profilin. EgeMatch AI, kendi profil doluluğunu ve eşleşme potansiyelini analiz ediyor.",
        selfStrength: "Kendi profil analizi",
        selfSuggestion: "Daha iyi eşleşmeler için profilini güncel tut.",
        labelPerfect: "Mükemmel Uyum",
        labelHigh: "Yüksek Uyum",
        labelMedium: "Orta Uyum",
        labelImprove: "Geliştirilebilir Uyum",
        summary90:
          "{name} ile uyum çok güçlü görünüyor. EgeMatch AI, ortak beklentiler ve profil sinyallerine göre bu eşleşmenin yüksek potansiyel taşıdığını düşünüyor.",
        summary75:
          "{name} ile uyum iyi seviyede. Ortak ilgi alanları ve profil bilgileri sohbet başlatmak için yeterli sinyal veriyor.",
        summary55:
          "{name} ile orta seviyede uyum var. Daha fazla sohbet ve ortak ilgi alanı keşfi bu eşleşmeyi güçlendirebilir.",
        summaryLow:
          "{name} ile uyum şu an düşük görünüyor. Profil bilgileri eksik olabilir veya beklentiler yeterince örtüşmüyor olabilir.",
      },
      EN: {
        selfSummary:
          "This is your own profile. EgeMatch AI is analyzing your profile completeness and matching potential.",
        selfStrength: "Own profile analysis",
        selfSuggestion: "Keep your profile updated for better matches.",
        labelPerfect: "Perfect Match",
        labelHigh: "High Match",
        labelMedium: "Medium Match",
        labelImprove: "Could Improve",
        summary90:
          "Compatibility with {name} looks very strong. Based on shared expectations and profile signals, EgeMatch AI sees high potential in this match.",
        summary75:
          "Compatibility with {name} is at a good level. Shared interests and profile details provide enough signals to start a conversation.",
        summary55:
          "Compatibility with {name} is moderate. More conversation and discovering shared interests could strengthen this match.",
        summaryLow:
          "Compatibility with {name} currently looks low. Profile details may be missing or expectations may not overlap enough.",
      },
      RU: {
        selfSummary:
          "Это ваш собственный профиль. EgeMatch AI анализирует заполненность профиля и потенциал совпадений.",
        selfStrength: "Анализ собственного профиля",
        selfSuggestion: "Обновляйте профиль, чтобы получать более подходящие совпадения.",
        labelPerfect: "Идеальная совместимость",
        labelHigh: "Высокая совместимость",
        labelMedium: "Средняя совместимость",
        labelImprove: "Можно улучшить",
        summary90:
          "Совместимость с {name} выглядит очень сильной. По общим ожиданиям и сигналам профиля EgeMatch AI видит высокий потенциал этой пары.",
        summary75:
          "Совместимость с {name} на хорошем уровне. Общие интересы и данные профиля дают достаточно сигналов, чтобы начать общение.",
        summary55:
          "Совместимость с {name} на среднем уровне. Больше общения и поиск общих интересов могут усилить это совпадение.",
        summaryLow:
          "Совместимость с {name} сейчас выглядит низкой. Возможно, в профиле не хватает данных или ожидания недостаточно совпадают.",
      },
      AR: {
        selfSummary:
          "هذا ملفك الشخصي. يقوم EgeMatch AI بتحليل اكتمال ملفك وإمكانات التوافق.",
        selfStrength: "تحليل الملف الشخصي",
        selfSuggestion: "حافظ على تحديث ملفك للحصول على توافقات أفضل.",
        labelPerfect: "توافق ممتاز",
        labelHigh: "توافق عالٍ",
        labelMedium: "توافق متوسط",
        labelImprove: "قابل للتحسين",
        summary90:
          "يبدو التوافق مع {name} قوياً جداً. بناءً على التوقعات المشتركة وإشارات الملف، يرى EgeMatch AI أن هذا التوافق يحمل إمكانات عالية.",
        summary75:
          "التوافق مع {name} جيد. الاهتمامات المشتركة ومعلومات الملف تعطي إشارات كافية لبدء محادثة.",
        summary55:
          "التوافق مع {name} متوسط. المزيد من الحديث واكتشاف الاهتمامات المشتركة قد يقوي هذا التوافق.",
        summaryLow:
          "يبدو التوافق مع {name} منخفضاً حالياً. قد تكون معلومات الملف ناقصة أو أن التوقعات لا تتقاطع بما يكفي.",
      },
    };

    const text = dictionary[lang]?.[key] || dictionary.TR[key] || key;

    return Object.entries(vars).reduce(
      (result, [varKey, value]) =>
        result.replace(new RegExp(`{${varKey}}`, "g"), value),
      text,
    );
  }

  private translateText(text: string, lang: EgeMatchLang) {
    if (lang === "TR") return text;

    const exact: Record<string, Record<Exclude<EgeMatchLang, "TR">, string>> = {
      "Yaş uyumu güçlü görünüyor": {
        EN: "Age compatibility looks strong",
        RU: "Возрастная совместимость выглядит сильной",
        AR: "يبدو توافق العمر قوياً",
      },
      "Yaş farkı yönetilebilir seviyede": {
        EN: "The age difference looks manageable",
        RU: "Разница в возрасте выглядит приемлемой",
        AR: "يبدو فرق العمر قابلاً للتعامل معه",
      },
      "Yaş farkı bazı beklenti farklılıkları oluşturabilir": {
        EN: "The age difference may create some expectation differences",
        RU: "Разница в возрасте может создать различия в ожиданиях",
        AR: "قد يسبب فرق العمر بعض الاختلافات في التوقعات",
      },
      "Aynı şehirde olmak tanışmayı kolaylaştırır": {
        EN: "Being in the same city makes meeting easier",
        RU: "Один город облегчает знакомство",
        AR: "الوجود في نفس المدينة يسهل التعارف",
      },
      "Farklı şehirlerde olmak görüşme sıklığını etkileyebilir": {
        EN: "Being in different cities may affect how often you can meet",
        RU: "Разные города могут влиять на частоту встреч",
        AR: "الوجود في مدن مختلفة قد يؤثر على تكرار اللقاءات",
      },
      "Aynı ilçede olmak yakınlık avantajı sağlar": {
        EN: "Being in the same district gives a closeness advantage",
        RU: "Один район даёт преимущество близости",
        AR: "الوجود في نفس المنطقة يعطي ميزة القرب",
      },
      "Ortak hobiler güçlü sohbet potansiyeli yaratıyor": {
        EN: "Shared hobbies create strong conversation potential",
        RU: "Общие хобби создают хороший потенциал для общения",
        AR: "الهوايات المشتركة تخلق فرصة قوية للحوار",
      },
      "Ortak ilgi alanları var": {
        EN: "There are shared interests",
        RU: "Есть общие интересы",
        AR: "هناك اهتمامات مشتركة",
      },
      "Ortak hobi az görünüyor": {
        EN: "There seem to be few shared hobbies",
        RU: "Похоже, общих хобби мало",
        AR: "يبدو أن الهوايات المشتركة قليلة",
      },
      "Hobi bilgileri eksik olduğu için ortak ilgi analizi zayıf": {
        EN: "Shared interest analysis is weak because hobby information is missing",
        RU: "Анализ общих интересов слабый, потому что не хватает информации о хобби",
        AR: "تحليل الاهتمامات المشتركة ضعيف بسبب نقص معلومات الهوايات",
      },
      "Eğitim seviyesi benzer": {
        EN: "Education levels are similar",
        RU: "Уровень образования похож",
        AR: "مستوى التعليم متشابه",
      },
      "Çocuk konusundaki beklentiler uyumlu görünüyor": {
        EN: "Expectations about children look compatible",
        RU: "Ожидания по поводу детей выглядят совместимыми",
        AR: "تبدو التوقعات حول الأطفال متوافقة",
      },
      "İki profil de ilişki beklentisini belirtmiş": {
        EN: "Both profiles have stated relationship expectations",
        RU: "Оба профиля указали ожидания от отношений",
        AR: "كلا الملفين أوضحا توقعات العلاقة",
      },
      "İlişki beklentisi alanı iki tarafta da net olmayabilir": {
        EN: "Relationship expectations may not be clear on both sides",
        RU: "Ожидания от отношений могут быть неясны у обеих сторон",
        AR: "قد لا تكون توقعات العلاقة واضحة لدى الطرفين",
      },
      "İki profil de kendini anlatıyor": {
        EN: "Both profiles describe themselves",
        RU: "Оба профиля рассказывают о себе",
        AR: "كلا الملفين يصفان نفسيهما",
      },
      "Profil açıklaması eksikliği ilk izlenimi zayıflatabilir": {
        EN: "Missing profile descriptions may weaken the first impression",
        RU: "Отсутствие описания профиля может ослабить первое впечатление",
        AR: "نقص وصف الملف قد يضعف الانطباع الأول",
      },
      "Karşı profil fotoğraflarla daha güvenilir görünüyor": {
        EN: "The other profile looks more trustworthy with photos",
        RU: "Профиль собеседника выглядит надёжнее благодаря фотографиям",
        AR: "يبدو الملف الآخر أكثر موثوقية بفضل الصور",
      },
      "Karşı profilde onaylı fotoğraf görünmüyor": {
        EN: "The other profile does not seem to have approved photos",
        RU: "В другом профиле не видно одобренных фотографий",
        AR: "لا تظهر صور معتمدة في الملف الآخر",
      },
      "İlk mesajda profilindeki şehir veya ilgi alanları sorulabilir.": {
        EN: "In the first message, you can ask about their city or interests.",
        RU: "В первом сообщении можно спросить о городе или интересах.",
        AR: "في الرسالة الأولى، يمكنك السؤال عن المدينة أو الاهتمامات.",
      },
      "Aynı şehir avantajı kullanılarak kısa bir kahve buluşması önerilebilir.": {
        EN: "You can use the same-city advantage and suggest a short coffee meetup.",
        RU: "Можно использовать преимущество одного города и предложить короткую встречу за кофе.",
        AR: "يمكن استغلال ميزة نفس المدينة واقتراح لقاء قصير على القهوة.",
      },
      "Farklı şehir varsa önce rahat bir sohbet temposu kurulmalı.": {
        EN: "If you are in different cities, first build a comfortable conversation rhythm.",
        RU: "Если вы в разных городах, сначала стоит выстроить комфортный темп общения.",
        AR: "إذا كنتما في مدن مختلفة، فمن الأفضل أولاً بناء وتيرة مريحة للمحادثة.",
      },
    };

    const dynamicCommonHobby = text.match(
      /^İlk mesajda (.+) konusundan sohbet başlatılabilir\.$/,
    );

    if (dynamicCommonHobby) {
      const hobby = dynamicCommonHobby[1];

      const dynamicMap: Record<Exclude<EgeMatchLang, "TR">, string> = {
        EN: `You can start the first message by talking about ${hobby}.`,
        RU: `Первое сообщение можно начать с темы «${hobby}».`,
        AR: `يمكنك بدء الرسالة الأولى بالحديث عن ${hobby}.`,
      };

      return dynamicMap[lang];
    }

    return exact[text]?.[lang] || text;
  }

  private getAge(birthDate?: Date | string | null) {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    if (Number.isNaN(birth.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  private toArray(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.map(String).map((x) => x.trim()).filter(Boolean);
    }

    if (typeof value === "string" && value.trim()) {
      return value
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    }

    return [];
  }
}