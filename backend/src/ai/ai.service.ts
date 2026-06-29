import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

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

  async calculateUserToUserEgeMatch(myUserId: string, targetUserId: string) {
    if (myUserId === targetUserId) {
      const myResult = await this.calculateMyEgeMatch(myUserId);

      return {
        ...myResult,
        summary:
          "Bu senin kendi profilin. EgeMatch AI, kendi profil doluluğunu ve eşleşme potansiyelini analiz ediyor.",
        strengths: ["Kendi profil analizi"],
        risks: [],
        suggestions: ["Daha iyi eşleşmeler için profilini güncel tut."],
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
      label: this.getLabel(score),
      summary: this.createUserToUserSummary(score, b),
      strengths: strengths.slice(0, 5),
      risks: risks.slice(0, 5),
      suggestions: suggestions.slice(0, 4),
      commonHobbies,
    };
  }

  private clamp(value: number) {
    return Math.max(0, Math.min(99, value));
  }

  private getLabel(score: number) {
    if (score >= 90) return "Mükemmel Uyum";
    if (score >= 75) return "Yüksek Uyum";
    if (score >= 55) return "Orta Uyum";
    return "Geliştirilebilir Uyum";
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

  private createUserToUserSummary(score: number, target: any) {
    const targetName =
      target.name && target.name.trim() ? target.name.trim() : "bu profil";

    if (score >= 90) {
      return `${targetName} ile uyum çok güçlü görünüyor. EgeMatch AI, ortak beklentiler ve profil sinyallerine göre bu eşleşmenin yüksek potansiyel taşıdığını düşünüyor.`;
    }

    if (score >= 75) {
      return `${targetName} ile uyum iyi seviyede. Ortak ilgi alanları ve profil bilgileri sohbet başlatmak için yeterli sinyal veriyor.`;
    }

    if (score >= 55) {
      return `${targetName} ile orta seviyede uyum var. Daha fazla sohbet ve ortak ilgi alanı keşfi bu eşleşmeyi güçlendirebilir.`;
    }

    return `${targetName} ile uyum şu an düşük görünüyor. Profil bilgileri eksik olabilir veya beklentiler yeterince örtüşmüyor olabilir.`;
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