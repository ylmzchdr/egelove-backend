import {
  Prisma,
  Gender,
  EducationLevel,
  SmokingStatus,
  AlcoholStatus,
  MaritalStatus,
  ChildrenStatus,
  ReligionLevel,
  BodyType,
  IncomeLevel,
} from "@prisma/client";

export class SearchQueryBuilder {
  private where: Prisma.UserWhereInput = {
    isActive: true,
  };

  byUsername(username?: string) {
    if (!username) return this;

    this.where.OR = [
      {
        username: {
          contains: username,
          mode: "insensitive",
        },
      },
      {
        name: {
          contains: username,
          mode: "insensitive",
        },
      },
      {
        city: {
          name: {
            contains: username,
            mode: "insensitive",
          },
        },
      },
    ];

    return this;
  }

  byGender(gender?: Gender) {
    if (!gender) return this;

    this.where.gender = gender;

    return this;
  }

  byCity(cityId?: number) {
    if (!cityId) return this;

    this.where.cityId = cityId;

    return this;
  }

  byDistrict(districtId?: number) {
    if (!districtId) return this;

    this.where.districtId = districtId;

    return this;
  }

  byEducation(education?: EducationLevel) {
    if (!education) return this;

    this.where.education = education;

    return this;
  }

  bySmoking(smoking?: SmokingStatus) {
    if (!smoking) return this;

    this.where.smoking = smoking;

    return this;
  }

  byAlcohol(alcohol?: AlcoholStatus) {
    if (!alcohol) return this;

    this.where.alcohol = alcohol;

    return this;
  }

  byMaritalStatus(maritalStatus?: MaritalStatus) {
    if (!maritalStatus) return this;

    this.where.maritalStatus = maritalStatus;

    return this;
  }

  byChildren(children?: ChildrenStatus) {
    if (!children) return this;

    this.where.children = children;

    return this;
  }

  byReligion(religion?: ReligionLevel) {
    if (!religion) return this;

    this.where.religion = religion;

    return this;
  }

  byBodyType(bodyType?: BodyType) {
    if (!bodyType) return this;

    this.where.bodyType = bodyType;

    return this;
  }

  byIncome(income?: IncomeLevel) {
    if (!income) return this;

    this.where.income = income;

    return this;
  }

  byOccupation(occupation?: string) {
    if (!occupation) return this;

    this.where.occupation = {
      contains: occupation,
      mode: "insensitive",
    };

    return this;
  }

  byHeight(minHeight?: number, maxHeight?: number) {
    if (!minHeight && !maxHeight) return this;

    const filter: Prisma.IntFilter = {};

    if (minHeight) {
      filter.gte = minHeight;
    }

    if (maxHeight) {
      filter.lte = maxHeight;
    }

    this.where.height = filter;

    return this;
  }

  byWeight(minWeight?: number, maxWeight?: number) {
    if (!minWeight && !maxWeight) return this;

    const filter: Prisma.IntFilter = {};

    if (minWeight) {
      filter.gte = minWeight;
    }

    if (maxWeight) {
      filter.lte = maxWeight;
    }

    this.where.weight = filter;

    return this;
  }

  byVerified(verified?: boolean) {
    if (!verified) return this;

    this.where.isVerified = true;

    return this;
  }

  byPremium(premium?: boolean) {
    if (!premium) return this;

    this.where.premiumExpiresAt = {
      gt: new Date(),
    };

    return this;
  }

  byPhoto(hasPhoto?: boolean) {
    if (!hasPhoto) return this;

    this.where.photos = {
      some: {
        status: "APPROVED",
        isMain: true,
      },
    };

    return this;
  }

  byOnline(online?: boolean) {
    if (!online) return this;

    this.where.presence = {
      is: {
        isOnline: true,
      },
    };

    return this;
  }

  byAge(minAge?: number, maxAge?: number) {
    if (!minAge && !maxAge) return this;

    const today = new Date();

    const filter: Prisma.DateTimeFilter = {};

    if (maxAge) {
      const from = new Date(today);
      from.setFullYear(today.getFullYear() - maxAge - 1);
      filter.gte = from;
    }

    if (minAge) {
      const to = new Date(today);
      to.setFullYear(today.getFullYear() - minAge);
      filter.lte = to;
    }

    this.where.birthDate = filter;

    return this;
  }

  build() {
    return this.where;
  }
}