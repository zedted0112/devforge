import { create } from 'zustand'; // ✅ Works with Vite + ESM


interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  email: string | null;
  setAuthData: (data: Partial<AuthState>) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  userId: null,
  email: null,
  setAuthData: (data) => set(state => ({ ...state, ...data })),
  clearAuth: () => set({ accessToken: null, refreshToken: null, userId: null, email: null }),
}));

export default useAuthStore;
