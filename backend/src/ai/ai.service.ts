import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

type EgeMatchLang = "TR" | "EN" | "RU" | "AR";

type DictKey =
  | "userNotFound"
  | "targetNotFound"
  | "selfSummary"
  | "selfStrength"
  | "selfSuggestion"
  | "labelPerfect"
  | "labelHigh"
  | "labelMedium"
  | "labelImprove"
  | "mySummary90"
  | "mySummary75"
  | "mySummary55"
  | "mySummaryLow"
  | "summary90"
  | "summary75"
  | "summary55"
  | "summaryLow"
  | "profilePhotoExists"
  | "profilePhotoMissing"
  | "multiplePhotosTrust"
  | "profileTextExists"
  | "aboutWeak"
  | "lookingForClear"
  | "lookingForMissing"
  | "hobbiesUseful"
  | "hobbiesEmpty"
  | "verifiedTrust"
  | "ageStrong"
  | "ageManageable"
  | "ageRisk"
  | "sameCity"
  | "differentCity"
  | "sameDistrict"
  | "commonHobbiesStrong"
  | "commonInterests"
  | "fewCommonHobbies"
  | "hobbyAnalysisWeak"
  | "educationSimilar"
  | "childrenCompatible"
  | "bothLookingFor"
  | "lookingForUnclear"
  | "bothDescribe"
  | "descriptionMissing"
  | "targetPhotosTrust"
  | "targetNoApprovedPhotos"
  | "askAboutCityOrInterests"
  | "sameCityCoffee"
  | "differentCityChat"
  | "addThreePhotos"
  | "writeAboutMe"
  | "clarifyLookingFor"
  | "addHobbies"
  | "profileStrongPremium"
  | "commonHobbyMessage";

const DICTIONARY: Record<EgeMatchLang, Record<DictKey, string>> = {
  TR: {
    userNotFound: "Kullanıcı bulunamadı",
    targetNotFound: "Karşı profil bulunamadı",
    selfSummary:
      "Bu senin kendi profilin. EgeMatch AI, kendi profil doluluğunu ve eşleşme potansiyelini analiz ediyor.",
    selfStrength: "Kendi profil analizi",
    selfSuggestion: "Daha iyi eşleşmeler için profilini güncel tut.",
    labelPerfect: "Mükemmel Uyum",
    labelHigh: "Yüksek Uyum",
    labelMedium: "Orta Uyum",
    labelImprove: "Geliştirilebilir Uyum",
    mySummary90:
      "Profilin çok güçlü görünüyor. EgeMatch AI, bu profilin yüksek ilgi çekme ve güçlü eşleşme potansiyeline sahip olduğunu düşünüyor.",
    mySummary75:
      "Profilin iyi seviyede. Birkaç alanı daha doldurursan EgeMatch AI uyum puanın daha da yükselebilir.",
    mySummary55:
      "Profilin temel olarak hazır, fakat daha fazla fotoğraf, hobi ve ilişki beklentisi eklemek eşleşme kaliteni artırabilir.",
    mySummaryLow:
      "Profilin henüz zayıf görünüyor. Fotoğraf, hakkımda ve aradığım kişi alanlarını doldurman EgeMatch AI puanını ciddi şekilde yükseltir.",
    summary90:
      "{name} ile uyum çok güçlü görünüyor. EgeMatch AI, ortak beklentiler ve profil sinyallerine göre bu eşleşmenin yüksek potansiyel taşıdığını düşünüyor.",
    summary75:
      "{name} ile uyum iyi seviyede. Ortak ilgi alanları ve profil bilgileri sohbet başlatmak için yeterli sinyal veriyor.",
    summary55:
      "{name} ile orta seviyede uyum var. Daha fazla sohbet ve ortak ilgi alanı keşfi bu eşleşmeyi güçlendirebilir.",
    summaryLow:
      "{name} ile uyum şu an düşük görünüyor. Profil bilgileri eksik olabilir veya beklentiler yeterince örtüşmüyor olabilir.",
    profilePhotoExists: "Profil fotoğrafı mevcut",
    profilePhotoMissing: "Profil fotoğrafı eksik",
    multiplePhotosTrust: "Birden fazla fotoğraf güven hissini artırıyor",
    profileTextExists: "Kendini anlatan profil metni var",
    aboutWeak: "Hakkımda alanı zayıf",
    lookingForClear: "İlişki beklentisi daha net görünüyor",
    lookingForMissing: "Aradığı kişi bilgisi eksik",
    hobbiesUseful: "Ortak ilgi alanı üretmeye uygun hobiler var",
    hobbiesEmpty: "Hobiler alanı boş",
    verifiedTrust: "Doğrulanmış profil güveni artırıyor",
    ageStrong: "Yaş uyumu güçlü görünüyor",
    ageManageable: "Yaş farkı yönetilebilir seviyede",
    ageRisk: "Yaş farkı bazı beklenti farklılıkları oluşturabilir",
    sameCity: "Aynı şehirde olmak tanışmayı kolaylaştırır",
    differentCity: "Farklı şehirlerde olmak görüşme sıklığını etkileyebilir",
    sameDistrict: "Aynı ilçede olmak yakınlık avantajı sağlar",
    commonHobbiesStrong: "Ortak hobiler güçlü sohbet potansiyeli yaratıyor",
    commonInterests: "Ortak ilgi alanları var",
    fewCommonHobbies: "Ortak hobi az görünüyor",
    hobbyAnalysisWeak: "Hobi bilgileri eksik olduğu için ortak ilgi analizi zayıf",
    educationSimilar: "Eğitim seviyesi benzer",
    childrenCompatible: "Çocuk konusundaki beklentiler uyumlu görünüyor",
    bothLookingFor: "İki profil de ilişki beklentisini belirtmiş",
    lookingForUnclear: "İlişki beklentisi alanı iki tarafta da net olmayabilir",
    bothDescribe: "İki profil de kendini anlatıyor",
    descriptionMissing: "Profil açıklaması eksikliği ilk izlenimi zayıflatabilir",
    targetPhotosTrust: "Karşı profil fotoğraflarla daha güvenilir görünüyor",
    targetNoApprovedPhotos: "Karşı profilde onaylı fotoğraf görünmüyor",
    askAboutCityOrInterests: "İlk mesajda profilindeki şehir veya ilgi alanları sorulabilir.",
    sameCityCoffee: "Aynı şehir avantajı kullanılarak kısa bir kahve buluşması önerilebilir.",
    differentCityChat: "Farklı şehir varsa önce rahat bir sohbet temposu kurulmalı.",
    addThreePhotos: "En az 3 net profil fotoğrafı ekle.",
    writeAboutMe: "Hakkımda alanına kısa ama samimi bir açıklama yaz.",
    clarifyLookingFor: "Nasıl biriyle tanışmak istediğini netleştir.",
    addHobbies: "Hobilerini ekle; AI ortak ilgi alanlarını buradan çıkarır.",
    profileStrongPremium: "Profilin güçlü. Daha detaylı analiz için premium AI raporu eklenebilir.",
    commonHobbyMessage: "İlk mesajda {hobby} konusundan sohbet başlatılabilir.",
  },
  EN: {
    userNotFound: "User not found",
    targetNotFound: "Target profile not found",
    selfSummary:
      "This is your own profile. EgeMatch AI is analyzing your profile completeness and matching potential.",
    selfStrength: "Own profile analysis",
    selfSuggestion: "Keep your profile updated for better matches.",
    labelPerfect: "Perfect Match",
    labelHigh: "High Match",
    labelMedium: "Medium Match",
    labelImprove: "Could Improve",
    mySummary90:
      "Your profile looks very strong. EgeMatch AI thinks this profile has high attention and strong matching potential.",
    mySummary75:
      "Your profile is at a good level. Filling in a few more fields could raise your EgeMatch AI score even more.",
    mySummary55:
      "Your profile is basically ready, but adding more photos, hobbies and relationship expectations can improve match quality.",
    mySummaryLow:
      "Your profile still looks weak. Adding photos, an about section and what you are looking for can seriously raise your EgeMatch AI score.",
    summary90:
      "Compatibility with {name} looks very strong. Based on shared expectations and profile signals, EgeMatch AI sees high potential in this match.",
    summary75:
      "Compatibility with {name} is at a good level. Shared interests and profile details provide enough signals to start a conversation.",
    summary55:
      "Compatibility with {name} is moderate. More conversation and discovering shared interests could strengthen this match.",
    summaryLow:
      "Compatibility with {name} currently looks low. Profile details may be missing or expectations may not overlap enough.",
    profilePhotoExists: "Profile photo is available",
    profilePhotoMissing: "Profile photo is missing",
    multiplePhotosTrust: "Multiple photos increase trust",
    profileTextExists: "The profile has a self-description",
    aboutWeak: "The about section is weak",
    lookingForClear: "Relationship expectations look clearer",
    lookingForMissing: "Looking-for information is missing",
    hobbiesUseful: "There are hobbies suitable for finding shared interests",
    hobbiesEmpty: "The hobbies field is empty",
    verifiedTrust: "Verified profile status increases trust",
    ageStrong: "Age compatibility looks strong",
    ageManageable: "The age difference looks manageable",
    ageRisk: "The age difference may create some expectation differences",
    sameCity: "Being in the same city makes meeting easier",
    differentCity: "Being in different cities may affect how often you can meet",
    sameDistrict: "Being in the same district gives a closeness advantage",
    commonHobbiesStrong: "Shared hobbies create strong conversation potential",
    commonInterests: "There are shared interests",
    fewCommonHobbies: "There seem to be few shared hobbies",
    hobbyAnalysisWeak: "Shared interest analysis is weak because hobby information is missing",
    educationSimilar: "Education levels are similar",
    childrenCompatible: "Expectations about children look compatible",
    bothLookingFor: "Both profiles have stated relationship expectations",
    lookingForUnclear: "Relationship expectations may not be clear on both sides",
    bothDescribe: "Both profiles describe themselves",
    descriptionMissing: "Missing profile descriptions may weaken the first impression",
    targetPhotosTrust: "The other profile looks more trustworthy with photos",
    targetNoApprovedPhotos: "The other profile does not seem to have approved photos",
    askAboutCityOrInterests: "In the first message, you can ask about their city or interests.",
    sameCityCoffee: "You can use the same-city advantage and suggest a short coffee meetup.",
    differentCityChat: "If you are in different cities, first build a comfortable conversation rhythm.",
    addThreePhotos: "Add at least 3 clear profile photos.",
    writeAboutMe: "Write a short but sincere about-me description.",
    clarifyLookingFor: "Clarify what kind of person you want to meet.",
    addHobbies: "Add your hobbies; AI uses them to find shared interests.",
    profileStrongPremium: "Your profile is strong. A premium AI report can be added for deeper analysis.",
    commonHobbyMessage: "You can start the first message by talking about {hobby}.",
  },
  RU: {
    userNotFound: "Пользователь не найден",
    targetNotFound: "Профиль собеседника не найден",
    selfSummary:
      "Это ваш собственный профиль. EgeMatch AI анализирует заполненность профиля и потенциал совпадений.",
    selfStrength: "Анализ собственного профиля",
    selfSuggestion: "Обновляйте профиль, чтобы получать более подходящие совпадения.",
    labelPerfect: "Идеальная совместимость",
    labelHigh: "Высокая совместимость",
    labelMedium: "Средняя совместимость",
    labelImprove: "Можно улучшить",
    mySummary90:
      "Ваш профиль выглядит очень сильным. EgeMatch AI считает, что он имеет высокий потенциал внимания и совпадений.",
    mySummary75:
      "Ваш профиль на хорошем уровне. Если заполнить ещё несколько полей, оценка EgeMatch AI может стать выше.",
    mySummary55:
      "Ваш профиль в целом готов, но больше фотографий, хобби и ожиданий от отношений улучшат качество совпадений.",
    mySummaryLow:
      "Ваш профиль пока выглядит слабым. Фотографии, раздел о себе и описание желаемого партнёра могут заметно повысить оценку EgeMatch AI.",
    summary90:
      "Совместимость с {name} выглядит очень сильной. По общим ожиданиям и сигналам профиля EgeMatch AI видит высокий потенциал этой пары.",
    summary75:
      "Совместимость с {name} на хорошем уровне. Общие интересы и данные профиля дают достаточно сигналов, чтобы начать общение.",
    summary55:
      "Совместимость с {name} на среднем уровне. Больше общения и поиск общих интересов могут усилить это совпадение.",
    summaryLow:
      "Совместимость с {name} сейчас выглядит низкой. Возможно, в профиле не хватает данных или ожидания недостаточно совпадают.",
    profilePhotoExists: "Фото профиля есть",
    profilePhotoMissing: "Фото профиля отсутствует",
    multiplePhotosTrust: "Несколько фотографий повышают доверие",
    profileTextExists: "В профиле есть описание о себе",
    aboutWeak: "Раздел о себе слабый",
    lookingForClear: "Ожидания от отношений выглядят более ясными",
    lookingForMissing: "Информация о том, кого ищет пользователь, отсутствует",
    hobbiesUseful: "Есть хобби, подходящие для поиска общих интересов",
    hobbiesEmpty: "Поле хобби пустое",
    verifiedTrust: "Подтверждённый профиль повышает доверие",
    ageStrong: "Возрастная совместимость выглядит сильной",
    ageManageable: "Разница в возрасте выглядит приемлемой",
    ageRisk: "Разница в возрасте может создать различия в ожиданиях",
    sameCity: "Один город облегчает знакомство",
    differentCity: "Разные города могут влиять на частоту встреч",
    sameDistrict: "Один район даёт преимущество близости",
    commonHobbiesStrong: "Общие хобби создают хороший потенциал для общения",
    commonInterests: "Есть общие интересы",
    fewCommonHobbies: "Похоже, общих хобби мало",
    hobbyAnalysisWeak: "Анализ общих интересов слабый, потому что не хватает информации о хобби",
    educationSimilar: "Уровень образования похож",
    childrenCompatible: "Ожидания по поводу детей выглядят совместимыми",
    bothLookingFor: "Оба профиля указали ожидания от отношений",
    lookingForUnclear: "Ожидания от отношений могут быть неясны у обеих сторон",
    bothDescribe: "Оба профиля рассказывают о себе",
    descriptionMissing: "Отсутствие описания профиля может ослабить первое впечатление",
    targetPhotosTrust: "Профиль собеседника выглядит надёжнее благодаря фотографиям",
    targetNoApprovedPhotos: "В другом профиле не видно одобренных фотографий",
    askAboutCityOrInterests: "В первом сообщении можно спросить о городе или интересах.",
    sameCityCoffee: "Можно использовать преимущество одного города и предложить короткую встречу за кофе.",
    differentCityChat: "Если вы в разных городах, сначала стоит выстроить комфортный темп общения.",
    addThreePhotos: "Добавьте как минимум 3 чёткие фотографии профиля.",
    writeAboutMe: "Напишите короткое, но искреннее описание о себе.",
    clarifyLookingFor: "Уточните, с каким человеком хотите познакомиться.",
    addHobbies: "Добавьте свои хобби; AI использует их для поиска общих интересов.",
    profileStrongPremium: "Ваш профиль сильный. Для более детального анализа можно добавить премиум AI-отчёт.",
    commonHobbyMessage: "Первое сообщение можно начать с темы «{hobby}».",
  },
  AR: {
    userNotFound: "لم يتم العثور على المستخدم",
    targetNotFound: "لم يتم العثور على الملف الآخر",
    selfSummary:
      "هذا ملفك الشخصي. يقوم EgeMatch AI بتحليل اكتمال ملفك وإمكانات التوافق.",
    selfStrength: "تحليل الملف الشخصي",
    selfSuggestion: "حافظ على تحديث ملفك للحصول على توافقات أفضل.",
    labelPerfect: "توافق ممتاز",
    labelHigh: "توافق عالٍ",
    labelMedium: "توافق متوسط",
    labelImprove: "قابل للتحسين",
    mySummary90:
      "يبدو ملفك قوياً جداً. يرى EgeMatch AI أن هذا الملف لديه قدرة عالية على جذب الاهتمام وتحقيق توافق جيد.",
    mySummary75:
      "ملفك في مستوى جيد. ملء بعض الحقول الإضافية قد يرفع درجة EgeMatch AI أكثر.",
    mySummary55:
      "ملفك جاهز بشكل أساسي، لكن إضافة المزيد من الصور والهوايات وتوقعات العلاقة يمكن أن يحسن جودة التوافق.",
    mySummaryLow:
      "ملفك لا يزال ضعيفاً. إضافة الصور ونبذة عنك وما تبحث عنه يمكن أن يرفع درجة EgeMatch AI بشكل واضح.",
    summary90:
      "يبدو التوافق مع {name} قوياً جداً. بناءً على التوقعات المشتركة وإشارات الملف، يرى EgeMatch AI أن هذا التوافق يحمل إمكانات عالية.",
    summary75:
      "التوافق مع {name} جيد. الاهتمامات المشتركة ومعلومات الملف تعطي إشارات كافية لبدء محادثة.",
    summary55:
      "التوافق مع {name} متوسط. المزيد من الحديث واكتشاف الاهتمامات المشتركة قد يقوي هذا التوافق.",
    summaryLow:
      "يبدو التوافق مع {name} منخفضاً حالياً. قد تكون معلومات الملف ناقصة أو أن التوقعات لا تتقاطع بما يكفي.",
    profilePhotoExists: "توجد صورة للملف الشخصي",
    profilePhotoMissing: "صورة الملف الشخصي غير موجودة",
    multiplePhotosTrust: "وجود عدة صور يزيد الثقة",
    profileTextExists: "يوجد وصف شخصي في الملف",
    aboutWeak: "قسم النبذة ضعيف",
    lookingForClear: "توقعات العلاقة تبدو أوضح",
    lookingForMissing: "معلومات الشخص المطلوب غير موجودة",
    hobbiesUseful: "توجد هوايات مناسبة لاستخراج الاهتمامات المشتركة",
    hobbiesEmpty: "حقل الهوايات فارغ",
    verifiedTrust: "الملف الموثق يزيد الثقة",
    ageStrong: "يبدو توافق العمر قوياً",
    ageManageable: "يبدو فرق العمر قابلاً للتعامل معه",
    ageRisk: "قد يسبب فرق العمر بعض الاختلافات في التوقعات",
    sameCity: "الوجود في نفس المدينة يسهل التعارف",
    differentCity: "الوجود في مدن مختلفة قد يؤثر على تكرار اللقاءات",
    sameDistrict: "الوجود في نفس المنطقة يعطي ميزة القرب",
    commonHobbiesStrong: "الهوايات المشتركة تخلق فرصة قوية للحوار",
    commonInterests: "هناك اهتمامات مشتركة",
    fewCommonHobbies: "يبدو أن الهوايات المشتركة قليلة",
    hobbyAnalysisWeak: "تحليل الاهتمامات المشتركة ضعيف بسبب نقص معلومات الهوايات",
    educationSimilar: "مستوى التعليم متشابه",
    childrenCompatible: "تبدو التوقعات حول الأطفال متوافقة",
    bothLookingFor: "كلا الملفين أوضحا توقعات العلاقة",
    lookingForUnclear: "قد لا تكون توقعات العلاقة واضحة لدى الطرفين",
    bothDescribe: "كلا الملفين يصفان نفسيهما",
    descriptionMissing: "نقص وصف الملف قد يضعف الانطباع الأول",
    targetPhotosTrust: "يبدو الملف الآخر أكثر موثوقية بفضل الصور",
    targetNoApprovedPhotos: "لا تظهر صور معتمدة في الملف الآخر",
    askAboutCityOrInterests: "في الرسالة الأولى، يمكنك السؤال عن المدينة أو الاهتمامات.",
    sameCityCoffee: "يمكن استغلال ميزة نفس المدينة واقتراح لقاء قصير على القهوة.",
    differentCityChat: "إذا كنتما في مدن مختلفة، فمن الأفضل أولاً بناء وتيرة مريحة للمحادثة.",
    addThreePhotos: "أضف 3 صور واضحة على الأقل للملف الشخصي.",
    writeAboutMe: "اكتب نبذة قصيرة وصادقة عنك.",
    clarifyLookingFor: "وضح نوع الشخص الذي ترغب في التعرف عليه.",
    addHobbies: "أضف هواياتك؛ يستخدمها الذكاء الاصطناعي لاستخراج الاهتمامات المشتركة.",
    profileStrongPremium: "ملفك قوي. يمكن إضافة تقرير AI مميز لتحليل أعمق.",
    commonHobbyMessage: "يمكنك بدء الرسالة الأولى بالحديث عن {hobby}.",
  },
};

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateMyEgeMatch(userId: string, lang: EgeMatchLang | string = "TR") {
    const safeLang = this.normalizeLang(lang);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        city: true,
        district: true,
        photos: true,
      },
    });

    if (!user) throw new NotFoundException(this.t(safeLang, "userNotFound"));

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
      strengths.push(this.t(safeLang, "profilePhotoExists"));
    } else {
      risks.push(this.t(safeLang, "profilePhotoMissing"));
    }

    if (approvedPhotos.length >= 3) {
      score += 8;
      interest += 8;
      strengths.push(this.t(safeLang, "multiplePhotosTrust"));
    }

    if (u.bio || u.aboutMe) {
      score += 12;
      interest += 12;
      strengths.push(this.t(safeLang, "profileTextExists"));
    } else {
      risks.push(this.t(safeLang, "aboutWeak"));
    }

    if (u.lookingFor) {
      score += 10;
      love += 12;
      strengths.push(this.t(safeLang, "lookingForClear"));
    } else {
      risks.push(this.t(safeLang, "lookingForMissing"));
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
      strengths.push(this.t(safeLang, "hobbiesUseful"));
    } else {
      risks.push(this.t(safeLang, "hobbiesEmpty"));
    }

    if (u.isVerified || u.isEmailVerified) {
      score += 6;
      energy += 5;
      strengths.push(this.t(safeLang, "verifiedTrust"));
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
      label: this.getLabel(score, safeLang),
      summary: this.createSummary(score, safeLang),
      strengths: strengths.slice(0, 4),
      risks: risks.slice(0, 4),
      suggestions: this.createSuggestions(risks, safeLang),
    };
  }

  async calculateUserToUserEgeMatch(
    myUserId: string,
    targetUserId: string,
    lang: EgeMatchLang | string = "TR",
  ) {
    const safeLang = this.normalizeLang(lang);

    if (myUserId === targetUserId) {
      const myResult = await this.calculateMyEgeMatch(myUserId, safeLang);

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

    if (!me) throw new NotFoundException(this.t(safeLang, "userNotFound"));
    if (!target) throw new NotFoundException(this.t(safeLang, "targetNotFound"));

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
        strengths.push(this.t(safeLang, "ageStrong"));
      } else if (diff <= 10) {
        score += 8;
        love += 6;
        strengths.push(this.t(safeLang, "ageManageable"));
      } else {
        score -= 5;
        risks.push(this.t(safeLang, "ageRisk"));
      }
    }

    if (a.city?.id && b.city?.id && a.city.id === b.city.id) {
      score += 12;
      energy += 10;
      strengths.push(this.t(safeLang, "sameCity"));
    } else if (a.city?.name && b.city?.name) {
      score += 4;
      risks.push(this.t(safeLang, "differentCity"));
    }

    if (a.district?.id && b.district?.id && a.district.id === b.district.id) {
      score += 6;
      energy += 5;
      strengths.push(this.t(safeLang, "sameDistrict"));
    }

    const hobbiesA = this.toArray(a.hobbies);
    const hobbiesB = this.toArray(b.hobbies);

    const commonHobbies = hobbiesA.filter((h) =>
      hobbiesB.some((x) => x.toLowerCase() === h.toLowerCase()),
    );

    if (commonHobbies.length >= 3) {
      score += 16;
      interest += 16;
      strengths.push(this.t(safeLang, "commonHobbiesStrong"));
    } else if (commonHobbies.length >= 1) {
      score += 9;
      interest += 10;
      strengths.push(this.t(safeLang, "commonInterests"));
    } else if (hobbiesA.length > 0 && hobbiesB.length > 0) {
      score += 3;
      risks.push(this.t(safeLang, "fewCommonHobbies"));
    } else {
      risks.push(this.t(safeLang, "hobbyAnalysisWeak"));
    }

    if (a.education && b.education && a.education === b.education) {
      score += 6;
      interest += 5;
      strengths.push(this.t(safeLang, "educationSimilar"));
    }

    if (a.children && b.children && a.children === b.children) {
      score += 8;
      love += 8;
      strengths.push(this.t(safeLang, "childrenCompatible"));
    }

    if (a.lookingFor && b.lookingFor) {
      score += 10;
      love += 10;
      strengths.push(this.t(safeLang, "bothLookingFor"));
    } else {
      risks.push(this.t(safeLang, "lookingForUnclear"));
    }

    if ((a.bio || a.aboutMe) && (b.bio || b.aboutMe)) {
      score += 8;
      interest += 7;
      strengths.push(this.t(safeLang, "bothDescribe"));
    } else {
      risks.push(this.t(safeLang, "descriptionMissing"));
    }

    const targetPhotos = (b.photos || []).filter(
      (p: any) => p.status === "APPROVED",
    );

    if (targetPhotos.length >= 3) {
      score += 6;
      energy += 6;
      strengths.push(this.t(safeLang, "targetPhotosTrust"));
    } else if (targetPhotos.length === 0) {
      risks.push(this.t(safeLang, "targetNoApprovedPhotos"));
    }

    score = this.clamp(score);
    energy = this.clamp(energy + Math.round(score * 0.12));
    interest = this.clamp(interest + Math.round(score * 0.14));
    love = this.clamp(love + Math.round(score * 0.15));

    if (commonHobbies.length > 0) {
      suggestions.push(
        this.t(safeLang, "commonHobbyMessage", { hobby: commonHobbies[0] }),
      );
    } else {
      suggestions.push(this.t(safeLang, "askAboutCityOrInterests"));
    }

    if (a.city?.id && b.city?.id && a.city.id === b.city.id) {
      suggestions.push(this.t(safeLang, "sameCityCoffee"));
    } else {
      suggestions.push(this.t(safeLang, "differentCityChat"));
    }

    return {
      score,
      energy,
      interest,
      love,
      label: this.getLabel(score, safeLang),
      summary: this.createUserToUserSummary(score, b, safeLang),
      strengths: strengths.slice(0, 5),
      risks: risks.slice(0, 5),
      suggestions: suggestions.slice(0, 4),
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

  private createSummary(score: number, lang: EgeMatchLang = "TR") {
    if (score >= 90) return this.t(lang, "mySummary90");
    if (score >= 75) return this.t(lang, "mySummary75");
    if (score >= 55) return this.t(lang, "mySummary55");
    return this.t(lang, "mySummaryLow");
  }

  private createUserToUserSummary(
    score: number,
    target: any,
    lang: EgeMatchLang = "TR",
  ) {
    const fallbackName =
      lang === "TR" ? "bu profil" : lang === "EN" ? "this profile" : lang === "RU" ? "этот профиль" : "هذا الملف";

    const targetName =
      target.name && target.name.trim() ? target.name.trim() : fallbackName;

    if (score >= 90) return this.t(lang, "summary90", { name: targetName });
    if (score >= 75) return this.t(lang, "summary75", { name: targetName });
    if (score >= 55) return this.t(lang, "summary55", { name: targetName });
    return this.t(lang, "summaryLow", { name: targetName });
  }

  private createSuggestions(risks: string[], lang: EgeMatchLang = "TR") {
    const suggestions: string[] = [];

    const riskText = risks.join(" ").toLowerCase();

    if (riskText.includes("foto") || riskText.includes("photo") || riskText.includes("фото") || riskText.includes("صورة")) {
      suggestions.push(this.t(lang, "addThreePhotos"));
    }

    if (riskText.includes("hakkımda") || riskText.includes("about") || riskText.includes("себ") || riskText.includes("نبذة")) {
      suggestions.push(this.t(lang, "writeAboutMe"));
    }

    if (riskText.includes("aradığı") || riskText.includes("looking") || riskText.includes("ищ") || riskText.includes("تبحث")) {
      suggestions.push(this.t(lang, "clarifyLookingFor"));
    }

    if (riskText.includes("hobi") || riskText.includes("hobby") || riskText.includes("хобби") || riskText.includes("هوا")) {
      suggestions.push(this.t(lang, "addHobbies"));
    }

    if (suggestions.length === 0) {
      suggestions.push(this.t(lang, "profileStrongPremium"));
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
    key: DictKey,
    vars: Record<string, string> = {},
  ) {
    const text = DICTIONARY[lang]?.[key] || DICTIONARY.TR[key] || key;

    return Object.entries(vars).reduce(
      (result, [varKey, value]) =>
        result.replace(new RegExp(`{${varKey}}`, "g"), value),
      text,
    );
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
        .replace(/[{}\"]/g, "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    }

    return [];
  }
}
