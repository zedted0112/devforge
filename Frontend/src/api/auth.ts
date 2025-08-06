import axiosClient from './httpClient';
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

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  token: string;
  newPassword: string;
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

export interface ForgotPasswordResponse {
  message: string;
  resetUrl?: string; // For development/testing only
  resetToken?: string; // For development/testing only
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  message: string;
}

export interface SyncUserPayload {
  id: number;
  email: string;
}

// ✅ Tell Axios the expected return shape
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>('/api/auth/login', payload);
  return response.data;
};

// Signup user
export const signup = async (payload: SignupPayload): Promise<SignupResponse> => {
  const response = await axiosClient.post<SignupResponse>('/api/auth/signup', payload);
  return response.data;
};

// Forgot password
export const forgotPassword = async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
  const response = await axiosClient.post<ForgotPasswordResponse>('/api/auth/forgot-password', payload);
  return response.data;
};

// Reset password
export const resetPassword = async (payload: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
  const response = await axiosClient.post<ResetPasswordResponse>('/api/auth/reset-password', payload);
  return response.data;
};

// Validate reset token
export const validateResetToken = async (token: string): Promise<ValidateTokenResponse> => {
  const response = await axiosClient.get<ValidateTokenResponse>(`/api/auth/validate-reset-token/${token}`);
  return response.data;
};

// Sync user to project service
export const syncUser = async (payload: SyncUserPayload): Promise<{ message: string }> => {
  const response = await projectClient.post<{ message: string }>('/api/sync/user', payload);
  return response.data;
};
