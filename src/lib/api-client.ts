const API_BASE_URL = '/api/backend';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface Advisor {
  id: number;
  username: string;
  name: string;
  avatar_url: string;
  about_me: string;
  language: string;
  timezone: string;
  rate?: number;
  skills: Skill[];
  rating: number | null;
  reviews_count?: number;
  pricing: Array<{amount: string; currency: string; is_active: boolean}>;
  availabilities: Availability[];
}

export interface Availability {
  id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string;
  avatar_url: string;
  wallet_balance?: number;
  wallet: {currency: string; balance: number; decimal_places: number};
  is_advisor: boolean;
  language: string;
  timezone: string;
}

export interface AdvisorProfile extends UserProfile {
  about_me: string;
  rate: number;
  skills: string[];
  availabilities: Availability[];
  rating: number;
  reviews_count: number;
  pricing?: Array<{amount: number; currency: string; is_active: boolean}>;
  stats?: {total: number; month: number; earnings: number; rating: number};
}

export interface Appointment {
  id: number;
  advisor?: number;
  advisor_id?: number;
  advisor_name: string;
  advisor_avatar?: string;
  user?: number;
  user_id?: number;
  user_name: string;
  user_avatar?: string;
  start_date: string;
  end_date: string;
  scheduled_at?: string;
  duration: number;
  status: 'pending_payment' | 'scheduled' | 'started' | 'completed' | 'cancelled' | 'no_show';
  zoom_join_url?: string;
  zoom_start_url?: string;
  rating?: number;
  review?: string;
  total_cost: number;
  is_advisor?: boolean;
  is_user?: boolean;
  is_deleted?: boolean;
}

export interface Transaction {
  id: number;
  type: 'refill' | 'withdrawal' | 'appointment' | 'conversation';
  amount: number;
  balance_after: number;
  created_at: string;
  description: string;
}

export interface Conversation {
  id: number;
  advisor?: number;
  advisor_id?: number;
  advisor_name: string;
  advisor_avatar?: string;
  user?: number;
  user_id?: number;
  user_name: string;
  user_avatar?: string;
  duration: number;
  status: 'pending_payment' | 'scheduled' | 'started' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  created_at?: string;
  last_message?: string;
  unread_count: number;
}

export interface Message {
  id: number;
  conversation?: number;
  conversation_id?: number;
  sender: {id: number; name: string; avatar_url: string};
  content?: string;
  audio?: string;
  duration?: number;
  created_at: string;
  is_mine: boolean;
}

export interface OrderResponse {
  order_id: string;
  payment_url: string;
}

export interface Skill {
  id: number;
  name: string;
  description?: string;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { error: errorData.error || errorData.detail || `HTTP ${response.status}` };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Network Error:', error);
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  async getAdvisors(): Promise<ApiResponse<Advisor[]>> {
    return this.request<Advisor[]>('/advisors/');
  }

  async getSkills(): Promise<ApiResponse<Skill[]>> {
    return this.request<Skill[]>('/skills/');
  }

  async applyAsAdvisor(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/profile/apply-advisor/', {method: 'POST'});
  }

  async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/profile/');
  }

  async getAdvisorProfile(): Promise<ApiResponse<AdvisorProfile>> {
    return this.request<AdvisorProfile>('/profile/advisor/');
  }

  async updateUserProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/profile/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateAdvisorProfile(data: Partial<AdvisorProfile>): Promise<ApiResponse<AdvisorProfile>> {
    return this.request<AdvisorProfile>('/profile/advisor/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async onboardAdvisor(formData: FormData): Promise<ApiResponse<AdvisorProfile>> {
    return this.request<AdvisorProfile>('/profile/onboard/', {
      method: 'POST',
      body: formData,
    });
  }

  async createAppointmentOrder(advisorId: number, scheduledAt: string, duration: number): Promise<ApiResponse<OrderResponse>> {
    return this.request<OrderResponse>('/appointments/order/', {
      method: 'POST',
      body: JSON.stringify({
        advisor_id: advisorId,
        scheduled_at: scheduledAt,
        duration,
      }),
    });
  }

  async confirmAppointmentOrder(orderId: string): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>('/appointments/order/confirm/', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId }),
    });
  }

  async getAppointments(): Promise<ApiResponse<Appointment[]>> {
    return this.request<Appointment[]>('/appointments/');
  }

  async getAppointment(appointmentId: number): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>(`/appointments/${appointmentId}/`);
  }

  async getAppointmentZoomLinks(appointmentId: number): Promise<ApiResponse<{ join_url: string; start_url?: string }>> {
    return this.request<{ join_url: string; start_url?: string }>(`/appointments/${appointmentId}/open/`);
  }

  async rescheduleAppointment(appointmentId: number, newTime: string): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>(`/appointments/${appointmentId}/reschedule/`, {
      method: 'PATCH',
      body: JSON.stringify({ scheduled_at: newTime }),
    });
  }

  async cancelAppointment(appointmentId: number): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>(`/appointments/${appointmentId}/cancel/`, {
      method: 'PATCH',
    });
  }

  async reviewAppointment(appointmentId: number, rating: number, comment: string): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>(`/appointments/${appointmentId}/review/`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  }

  async getTransactions(startDate?: string, endDate?: string): Promise<ApiResponse<Transaction[]>> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<Transaction[]>(`/profile/transactions/${query}`);
  }

  async requestRefill(amount: number): Promise<ApiResponse<OrderResponse>> {
    return this.request<OrderResponse>('/profile/refill/request/', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async confirmRefill(orderId: string): Promise<ApiResponse<{ balance: number }>> {
    return this.request<{ balance: number }>('/profile/refill/confirm/', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId }),
    });
  }

  async requestWithdrawal(amount: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/profile/withdraw/', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    return this.request<Conversation[]>('/conversations/');
  }

  async getMessages(conversationId: number): Promise<ApiResponse<Message[]>> {
    const result = await this.request<Message[]>(`/conversations/${conversationId}/messages/`);
    if (result.data) {
      result.data = result.data.map(message => ({
        ...message,
        audio: message.audio?.replace('/api/v1.0/', '/api/backend/'),
      }));
    }
    return result;
  }

  async sendMessage(conversationId: number, content?: string, audioFile?: File): Promise<ApiResponse<Message>> {
    if (audioFile) {
      const formData = new FormData();
      formData.append('audio', audioFile);
      if (content) formData.append('content', content);
      return this.request<Message>(`/conversations/${conversationId}/messages/`, {
        method: 'POST',
        body: formData,
      });
    }
    return this.request<Message>(`/conversations/${conversationId}/messages/`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async createConversationOrder(advisorId: number, duration: number): Promise<ApiResponse<OrderResponse>> {
    return this.request<OrderResponse>('/conversations/order/', {
      method: 'POST',
      body: JSON.stringify({
        advisor_id: advisorId,
        duration,
      }),
    });
  }

  async confirmConversationOrder(orderId: string): Promise<ApiResponse<Conversation>> {
    return this.request<Conversation>('/conversations/order/confirm/', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId }),
    });
  }

  async cancelConversation(conversationId: number): Promise<ApiResponse<Conversation>> {
    return this.request<Conversation>(`/conversations/${conversationId}/cancel/`, {
      method: 'PATCH',
    });
  }

  async updateAvailability(availabilities: Array<{ day_of_week: number; start_time: string; end_time: string }>): Promise<ApiResponse<any>> {
    return this.request('/profile/availability/', {
      method: 'POST',
      body: JSON.stringify({ availabilities }),
    });
  }

  async deleteAvailability(availabilityId: number): Promise<ApiResponse<any>> {
    return this.request(`/profile/availability/${availabilityId}/`, {
      method: 'DELETE',
    });
  }

  async updatePricing(rate: number): Promise<ApiResponse<any>> {
    return this.request('/profile/pricing/', {
      method: 'PATCH',
      body: JSON.stringify({ rate }),
    });
  }
}

export const apiClient = new ApiClient();
