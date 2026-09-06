export interface City {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
  cityId: number;
}

export interface User {
  id: string;

  name: string;

  username: string;

  age: number;

  gender: "MALE" | "FEMALE" | "OTHER";

  city: {
    id: number;
    name: string;
  };

  district: {
    id: number;
    name: string;
  };

  avatar?: string | null;

  bio?: string | null;

  occupation?: string | null;

  education?: string | null;

  isVerified: boolean;

  isPremiumCandidate: boolean;

  isOnline?: boolean;

  lastLoginAt?: string;

  photos?: {
    id: string;
    url: string;
    isMain: boolean;
  }[];
}

export interface SearchFilters {
  gender?: string;

  cityId?: number;

  districtId?: number;

  minAge?: number;

  maxAge?: number;

  education?: string;

  maritalStatus?: string;

  smoking?: string;

  alcohol?: string;

  online?: boolean;

  premium?: boolean;

  hasPhoto?: boolean;
}