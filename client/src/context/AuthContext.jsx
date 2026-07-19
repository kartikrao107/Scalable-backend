import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as loginApi, signup as signupApi, getProfile } from '../api/auth';

const AuthContext = createContext(null);

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const persist = useCallback((token, userData) => {
    localStorage.setItem('token', token);
    const safe = sanitizeUser(userData);
    localStorage.setItem('user', JSON.stringify(safe));
    setUser(safe);
  }, []);

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await getProfile();
      if (data.success) {
        const safe = sanitizeUser(data.user);
        localStorage.setItem('user', JSON.stringify(safe));
        setUser(safe);
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = async (credentials) => {
    const { data } = await loginApi(credentials);
    if (data.success) {
      persist(data.token, data.user);
    }
    return data;
  };

  const signup = async (payload) => {
    const { data } = await signupApi(payload);
    if (data.success) {
      const loginData = await login({ email: payload.email, password: payload.password });
      return loginData;
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isSeller = user?.role === 'SELLER' || isAdmin;

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshProfile, isAdmin, isSeller }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
