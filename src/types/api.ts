export interface Profile {
  id: number;
  name: string;
  age: number;
  car: string;
  description: string;
  photo_url: string;
  telegram_id: number;
}

export interface CreateProfileDto {
  name: string;
  age: number;
  car: string;
  description: string;
  photo_url: string;
  telegram_id: number;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}

export interface MatchResponse {
  matches: Profile[];
}

export interface NextProfileResponse {
  profile: Profile | null;
}

export interface LikeResponse {
  status: string;
  message: string;
} 