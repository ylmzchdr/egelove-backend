import { SearchUserResponse } from "../types/search-response";

export class SearchMapper {
  static age(date: Date | null) {
    if (!date) return null;

    const today = new Date();

    let age = today.getFullYear() - date.getFullYear();

    const m = today.getMonth() - date.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < date.getDate()))
        age--;

    return age;
  }

  static user(user: any): SearchUserResponse {

    return {

      id:user.id,

      username:user.username,

      name:user.name,

      age:this.age(user.birthDate),

      city:user.city.name,

      district:user.district.name,

      avatar:user.avatar,

      photo:user.photos[0]?.url ?? null,

      online:user.presence?.isOnline ?? false,

      premium:
        user.premiumExpiresAt &&
        new Date(user.premiumExpiresAt)>new Date(),

      verified:user.isVerified,

      lastSeen:user.presence?.lastSeen ?? null

    };

  }

}