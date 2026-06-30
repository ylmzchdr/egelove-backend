import { Controller, Get, Put, Body, UseGuards, Param, Query } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UserController {
  constructor(private prisma: PrismaService) {}

@Get("me")
@UseGuards(JwtAuthGuard)
async getMe(@CurrentUser() user: any) {
  const profile = await this.prisma.user.findUnique({
    where: { id: user.sub },
    include: {
      photos: {
        where: {
          status: { in: ["APPROVED", "PENDING"] },
        },
        orderBy: [
          { isMain: "desc" },
          { createdAt: "desc" },
        ],
       take: 10,
      },
      city: true,
      district: true,
    },
  });

  if (!profile) {
    return { error: "Kullanıcı bulunamadı" };
  }

  const {
    passwordHash,
    refreshToken,
    turnstileToken,
    ...safe
  } = profile;

  return safe;
}

  @Put("me")
@UseGuards(JwtAuthGuard)
async updateMe(@CurrentUser() user: any, @Body() data: UpdateUserDto) {
  const cleanData: any = {};

  const allowedFields = [
  "name",
  "surname",
  "phone",
  "birthDate",
  "gender",
  
  "bio",
  "aboutMe",
  "lookingFor",
  "education",
  "income",
  "religion",
  "smoking",
  "alcohol",
  "children",
  "bodyType",
  "maritalStatus",
  "height",
  "weight",
  "eyeColor",
  "hairColor",
  "bloodType",
  "occupation",
  "hobbies",
];
  for (const key of allowedFields) {
    const value = (data as any)[key];

    if (value !== undefined && value !== null && value !== "") {
      cleanData[key] = value;
    }
  }

  if (cleanData.birthDate) {
    cleanData.birthDate = new Date(cleanData.birthDate);
  }

 

  if (cleanData.height) {
    cleanData.height = Number(cleanData.height);
  }

  if (cleanData.weight) {
    cleanData.weight = Number(cleanData.weight);
  }
  if (Array.isArray(cleanData.hobbies)) {
  cleanData.hobbies = cleanData.hobbies.join(", ");
}

  const updated = await this.prisma.user.update({
    where: { id: user.sub },
    data: cleanData,
  });

  const {
    passwordHash,
    refreshToken,
    turnstileToken,
    twoFactorSecret,
    emailVerifyToken,
    ...safe
  } = updated;

  return safe;
}

  @Get("search")
  @UseGuards(JwtAuthGuard)
  async searchUsers(@CurrentUser() user: any) {
    const users = await this.prisma.user.findMany({
      where: { id: { not: user.sub }, isActive: true },
      take: 20,
      select: {
        id: true,
        name: true,
        birthDate: true,
        cityId: true,
        gender: true,
        bio: true,
        avatar: true,
        isVerified: true,
      },
    });

    return users;
  }

  @Get("search/filter")
  @UseGuards(JwtAuthGuard)
  async filterUsers(
    @CurrentUser() user: any,
    @Query("city") city?: string,
    @Query("district") district?: string,
    @Query("gender") gender?: string,
    @Query("minAge") minAge?: string,
    @Query("maxAge") maxAge?: string,
    @Query("education") education?: string,
    @Query("smoking") smoking?: string,
    @Query("alcohol") alcohol?: string,
    @Query("maritalStatus") maritalStatus?: string,
    @Query("children") children?: string,
    @Query("religion") religion?: string,
    @Query("bodyType") bodyType?: string,
    @Query("hairColor") hairColor?: string,
    @Query("eyeColor") eyeColor?: string,
    @Query("bloodType") bloodType?: string,
    @Query("income") income?: string,
    @Query("minHeight") minHeight?: string,
    @Query("maxHeight") maxHeight?: string,
    @Query("minWeight") minWeight?: string,
    @Query("maxWeight") maxWeight?: string,
    @Query("occupation") occupation?: string,
    @Query("hasPhotos") hasPhotos?: string,
    @Query("username") username?: string,
  ) {
    const where: any = { id: { not: user.sub }, isActive: true };

    if (gender) where.gender = gender;
    if (city) where.cityId = parseInt(city);
    if (district) where.districtId = parseInt(district);
    if (education) where.education = education;
    if (smoking) where.smoking = smoking;
    if (alcohol) where.alcohol = alcohol;
    if (maritalStatus) where.maritalStatus = maritalStatus;
    if (children) where.children = children;
    if (religion) where.religion = religion;
    if (bodyType) where.bodyType = bodyType;
    if (hairColor) where.hairColor = hairColor;
    if (eyeColor) where.eyeColor = eyeColor;
    if (bloodType) where.bloodType = bloodType;
    if (income) where.income = income;
    if (occupation) where.occupation = { contains: occupation, mode: "insensitive" };

    if (username) {
      where.OR = [
        { name: { contains: username, mode: "insensitive" } },
        { surname: { contains: username, mode: "insensitive" } },
      ];
    }

    if (hasPhotos === "true") {
      where.photos = { some: { status: "APPROVED" } };
    }

    if (minHeight || maxHeight) {
      where.height = {};
      if (minHeight) where.height.gte = parseInt(minHeight);
      if (maxHeight) where.height.lte = parseInt(maxHeight);
    }

    if (minWeight || maxWeight) {
      where.weight = {};
      if (minWeight) where.weight.gte = parseInt(minWeight);
      if (maxWeight) where.weight.lte = parseInt(maxWeight);
    }

    if (minAge || maxAge) {
      const now = new Date();

      if (maxAge) {
        const minDate = new Date(
          now.getFullYear() - parseInt(maxAge),
          now.getMonth(),
          now.getDate(),
        );
        where.birthDate = { ...where.birthDate, gte: minDate };
      }

      if (minAge) {
        const maxDate = new Date(
          now.getFullYear() - parseInt(minAge),
          now.getMonth(),
          now.getDate(),
        );
        where.birthDate = { ...where.birthDate, lte: maxDate };
      }
    }

    const users = await this.prisma.user.findMany({
      where,
      take: 50,
      include: {
        city: true,
        district: true,
        photos: { where: { status: "APPROVED" }, take: 3 },
      },
    });

    return users.map((u: any) => {
      const {
        passwordHash,
        refreshToken,
        turnstileToken,
        twoFactorSecret,
        emailVerifyToken,
        emailVerifySentAt,
        ...safe
      } = u;

      return {
        ...safe,
        age: Math.floor(
          (Date.now() - new Date(safe.birthDate).getTime()) / 31557600000,
        ),
        birthDate: undefined,
      };
    });
  }
  @Get(":id/compatibility")
@UseGuards(JwtAuthGuard)
async getCompatibility(@CurrentUser() user: any, @Param("id") targetId: string) {
  if (user.sub === targetId) {
    return {
      score: 100,
      summary: "Kendi profiliniz",
      reasons: ["Bu sizin kendi profiliniz"],
    };
  }

  const [me, target] = await Promise.all([
    this.prisma.user.findUnique({
      where: { id: user.sub },
      include: { city: true, district: true },
    }),
    this.prisma.user.findUnique({
      where: { id: targetId },
      include: { city: true, district: true },
    }),
  ]);

  if (!me || !target) {
    return {
      score: 0,
      summary: "Profil bulunamadı",
      reasons: [],
    };
  }

  let score = 35;
  const reasons: string[] = [];

  if (me.cityId === target.cityId) {
    score += 15;
    reasons.push("Aynı şehirde yaşıyorsunuz");
  }

  if (me.districtId === target.districtId) {
    score += 10;
    reasons.push("Aynı ilçedesiniz");
  }

  const age = (birthDate: Date) =>
    Math.floor((Date.now() - new Date(birthDate).getTime()) / 31557600000);

  const ageDiff = Math.abs(age(me.birthDate) - age(target.birthDate));

  if (ageDiff <= 3) {
    score += 20;
    reasons.push("Yaş farkınız oldukça ideal");
  } else if (ageDiff <= 7) {
    score += 15;
    reasons.push("Yaş farkınız uyumlu görünüyor");
  } else if (ageDiff <= 12) {
    score += 8;
    reasons.push("Yaş farkınız kabul edilebilir seviyede");
  }

  if (me.education && me.education === target.education) {
    score += 7;
    reasons.push("Eğitim seviyeniz benzer");
  }

  if (me.smoking && me.smoking === target.smoking) {
    score += 8;
    reasons.push("Sigara alışkanlığınız benzer");
  }

  if (me.alcohol && me.alcohol === target.alcohol) {
    score += 7;
    reasons.push("Alkol kullanım tercihiniz benzer");
  }

  if (me.children && me.children === target.children) {
    score += 8;
    reasons.push("Çocuk konusundaki durumunuz uyumlu");
  }

  if (me.religion && me.religion === target.religion) {
    score += 6;
    reasons.push("Yaşam değerleriniz benzer görünüyor");
  }

  if (me.lookingFor && target.lookingFor) {
    score += 6;
    reasons.push("İlişki beklentileriniz karşılaştırılabilir");
  }

  score = Math.min(score, 99);

  const summary =
    score >= 85
      ? "Yüksek uyum"
      : score >= 70
      ? "Güçlü uyum"
      : score >= 55
      ? "Orta seviye uyum"
      : "Düşük uyum";

  return {
    brand: "EgeMatch AI",
    score,
    summary,
    reasons: reasons.slice(0, 5),
    message:
      score >= 80
        ? "Bu profil ile sohbet başlatma ihtimaliniz oldukça güçlü görünüyor."
        : "Uyum orta seviyede. Profili detaylı inceleyip sohbetle keşfetmeniz önerilir.",
  };
}

 @Get(":id")
async getProfile(@Param("id") id: string) {
  const profile = await this.prisma.user.findUnique({
    where: { id },
    include: {
  photos: {
    where: { status: "APPROVED" },
    orderBy: [
      { isMain: "desc" },
      { createdAt: "desc" },
    ],
  },
  city: true,
  district: true,
},
  });

  if (!profile) return { error: "Kullanıcı bulunamadı" };

  const {
    passwordHash,
    refreshToken,
    turnstileToken,
    twoFactorSecret,
    emailVerifyToken,
    ...safe
  } = profile;

  return safe;
}
}