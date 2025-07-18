import axiosClient from './axiosClient';
import projectClient from './projectClient';

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
  };
}

export interface SignupResponse {
  message: string;
  user: {
    id: number;
    email: string;
  };
}

export interface SyncUserPayload {
  id: number;
  email: string;
}

// ✅ Tell Axios the expected return shape
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>('/auth/login', payload);
  return response.data;
};

// Signup user
export const signup = async (payload: SignupPayload): Promise<SignupResponse> => {
  const response = await axiosClient.post<SignupResponse>('/auth/signup', payload);
  return response.data;
};

// Sync user to project service
export const syncUser = async (payload: SyncUserPayload): Promise<{ message: string }> => {
  const response = await projectClient.post<{ message: string }>('/sync/user', payload);
  return response.data;
};
