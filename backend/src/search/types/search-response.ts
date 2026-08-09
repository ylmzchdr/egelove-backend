export interface SearchUserResponse {
  id: string;
  username: string;
  name: string;
  age: number | null;

  city: string;
  district: string;

  avatar: string | null;
  photo: string | null;

  online: boolean;

  premium: boolean;

  verified: boolean;

  lastSeen: Date | null;
}

export interface SearchResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
  users: SearchUserResponse[];
}