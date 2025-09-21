import { User, HangoutSuggestion } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

class ApiService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // User profile methods
  async getUserProfile(): Promise<User> {
    return this.makeRequest<User>('/api/profile');
  }

  async updateUserProfile(userData: Partial<User>): Promise<User> {
    return this.makeRequest<User>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Users methods
  async getAllUsers(): Promise<User[]> {
    return this.makeRequest<User[]>('/api/users');
  }

  // Hangout suggestions methods
  async getSuggestions(): Promise<HangoutSuggestion[]> {
    return this.makeRequest<HangoutSuggestion[]>('/api/suggestions');
  }

  async createSuggestion(suggestion: Omit<HangoutSuggestion, 'id' | 'createdBy' | 'createdAt' | 'status' | 'responses'>): Promise<HangoutSuggestion> {
    return this.makeRequest<HangoutSuggestion>('/api/suggestions', {
      method: 'POST',
      body: JSON.stringify(suggestion),
    });
  }

  async updateSuggestion(id: string, updates: Partial<HangoutSuggestion>): Promise<HangoutSuggestion> {
    return this.makeRequest<HangoutSuggestion>(`/api/suggestions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }
}

export const apiService = new ApiService();
