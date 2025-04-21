import { CreateProfileDto, Profile, MatchResponse, NextProfileResponse, LikeResponse } from '../types/api';

const API_URL = 'https://webtg-back.onrender.com';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const api = {
  async createProfile(data: CreateProfileDto): Promise<Profile> {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Profile>(response);
  },

  async getProfile(telegramId: number): Promise<Profile> {
    const response = await fetch(`${API_URL}/profile/${telegramId}`);
    return handleResponse<Profile>(response);
  },

  async getNextProfile(telegramId: number): Promise<NextProfileResponse> {
    const response = await fetch(`${API_URL}/next_profile/${telegramId}`);
    return handleResponse<NextProfileResponse>(response);
  },

  async likeProfile(fromId: number, toId: number): Promise<LikeResponse> {
    const response = await fetch(`${API_URL}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from_id: fromId, to_id: toId }),
    });
    return handleResponse<LikeResponse>(response);
  },

  async dislikeProfile(fromId: number, toId: number): Promise<LikeResponse> {
    const response = await fetch(`${API_URL}/dislike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from_id: fromId, to_id: toId }),
    });
    return handleResponse<LikeResponse>(response);
  },

  async getMatches(telegramId: number): Promise<MatchResponse> {
    const response = await fetch(`${API_URL}/matches/${telegramId}`);
    return handleResponse<MatchResponse>(response);
  }
}; 