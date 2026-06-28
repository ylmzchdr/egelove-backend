import { Injectable } from "@nestjs/common";
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

    if (!user) {
      return {
        score: 0,
        energy: 0,
        interest: 0,
        love: 0,
        label: "Profil bulunamadı",
        summary: "EgeMatch AI profil bilgilerini analiz edemedi.",
      };
    }

    let score = 40;

    if (user.name) score += 5;
    if (user.surname) score += 3;
    if (user.birthDate) score += 5;
    if (user.cityId || user.city) score += 6;
    if (user.districtId || user.district) score += 5;
    if (user.bio || user.aboutMe) score += 8;
    if (user.lookingFor) score += 7;
    if (user.occupation) score += 4;
    if (user.education) score += 4;
    if (user.income) score += 2;
    
    if (user.children) score += 2;
    if (user.height) score += 2;
    if (user.eyeColor) score += 2;
    if (user.hairColor) score += 2;

    const photoCount = user.photos?.length || 0;
    if (photoCount >= 1) score += 8;
    if (photoCount >= 3) score += 6;
    if (photoCount >= 5) score += 4;

    score = Math.min(score, 99);

    const energy = Math.min(99, score + 5);
    const interest = Math.max(45, score - 3);
    const love = Math.min(99, Math.round((score + energy + interest) / 3));

    const label =
      score >= 90
        ? "Mükemmel Uyum"
        : score >= 75
          ? "Yüksek Uyum"
          : score >= 55
            ? "Orta Uyum"
            : "Düşük Uyum";

    const summary =
      score >= 75
        ? "Profilin güçlü görünüyor. EgeMatch AI, bu profilin daha fazla ilgi çekme potansiyeline sahip olduğunu düşünüyor."
        : "Profilini biraz daha doldurursan EgeMatch AI uyum puanın belirgin şekilde artabilir.";

    return {
      score,
      energy,
      interest,
      love,
      label,
      summary,
    };
  }
}