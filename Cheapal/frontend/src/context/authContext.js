// frontend/src/context/authContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Assuming you're using axios as per the context

// Create an Axios instance (if not already defined in a central api.js)
// Ensure this baseURL matches your backend's API prefix.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important for cookies if your backend uses them for sessions
});

const AuthContext = createContext(undefined); // Initialize with undefined for better error checking in useAuth

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    try {
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("[AuthContext] Failed to parse user from localStorage on init", error);
        localStorage.removeItem('user'); // Clear corrupted data
        return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true); // Start as true, set to false after initial auth check

  // Effect to update Axios default headers when token changes
  useEffect(() => {
    if (token) {
      console.log('[AuthContext] Token found, setting Authorization header.');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      console.log('[AuthContext] No token, removing Authorization header.');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Stable logout function
  const logout = useCallback(() => {
    console.log('[AuthContext] Logging out user.');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization']; 
    // setLoading(false); // No need to set loading here, login/checkAuth handles it
  }, []);


  const checkAuth = useCallback(async () => {
    console.log('[AuthContext] checkAuth: Starting authentication check...');
    const currentToken = localStorage.getItem('token');
    
    if (!currentToken) {
      console.log('[AuthContext] checkAuth: No token found in localStorage. User is not authenticated.');
      // Call logout to ensure all state is cleared consistently
      // logout(); // logout() already sets user/token to null and removes from localStorage
      setUser(null); // Explicitly set user to null
      setToken(null); // Explicitly set token to null
      localStorage.removeItem('user'); // Ensure user is cleared from localStorage
      localStorage.removeItem('token'); // Ensure token is cleared from localStorage
      delete api.defaults.headers.common['Authorization']; // Ensure header is cleared
      setLoading(false); // Auth check finished
      return;
    }

    // Ensure Axios header is set if token exists
    if (api.defaults.headers.common['Authorization'] !== `Bearer ${currentToken}`) {
        api.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
    }

    try {
      console.log('[AuthContext] checkAuth: Verifying token with /auth/me');
      const response = await api.get('/auth/me'); 

      if (response.data && response.data.success && response.data.user) {
        const fetchedUser = response.data.user;
        console.log('[AuthContext] checkAuth: /auth/me successful. User data received:', fetchedUser);
        setUser(fetchedUser);
        localStorage.setItem('user', JSON.stringify(fetchedUser));
        // Token is already from localStorage, setToken if it somehow differs (unlikely here)
        if (token !== currentToken) { 
            setToken(currentToken);
        }
      } else {
        console.warn('[AuthContext] checkAuth: /auth/me call did not return a valid user. Response:', response.data);
        logout(); 
      }
    } catch (error) {
      console.error('[AuthContext] checkAuth: /auth/me call failed.', error.response?.data?.message || error.message);
      logout(); 
    } finally {
      console.log('[AuthContext] checkAuth: Finished. Setting loading to false.');
      setLoading(false);
    }
  }, [logout, token]); // 'token' is a dependency for re-checking if it changes externally. 'logout' is stable.

  // Initial authentication check on component mount
  useEffect(() => {
    console.log('[AuthContext] Initial mount: Triggering checkAuth. Current token:', token);
    // setLoading(true); // Already true by default, ensure it's true before async operation
    checkAuth();
  }, [checkAuth]); // checkAuth is memoized with useCallback

  const register = async ({ name, email, password, role = 'user' }) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      if (response.data.success && response.data.token && response.data.user) {
        const { token: newToken, user: newUser } = response.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setLoading(false);
        return { success: true, user: newUser };
      }
      // If success is not true or token/user missing, treat as failure
      throw new Error(response.data.message || 'Registration failed: Invalid server response.');
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || error.message || 'Registration error.';
      const errors = error.response?.data?.errors; 
      const err = new Error(errorMessage);
      err.errors = errors;
      console.error("[AuthContext] Registration error:", err);
      throw err;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success && response.data.token && response.data.user) {
        const { token: newToken, user: newUser } = response.data;
        console.log('[AuthContext] Login successful, received user:', newUser);
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setLoading(false);
        return { success: true, user: newUser };
      }
      throw new Error(response.data.message || 'Login failed: Invalid server response.');
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || error.message || 'Login error.';
      const errors = error.response?.data?.errors;
      const err = new Error(errorMessage);
      err.errors = errors;
      console.error("[AuthContext] Login error:", err);
      throw err;
    }
  };
  
  const updateProfile = useCallback(async (profileData) => {
    if (!user?._id) {
        console.error("[AuthContext] updateProfile: No user ID found.");
        throw new Error("You must be logged in to update your profile.");
    }
    console.log('[AuthContext] Attempting to update profile for user:', user._id);
    
    try {
        // For FormData, Content-Type is set automatically by the browser.
        // For JSON, we set it explicitly.
        const config = {};
        let bodyToSend = profileData;

        if (!(profileData instanceof FormData)) {
            config.headers = { 'Content-Type': 'application/json' };
            bodyToSend = JSON.stringify(profileData);
        }
        // Axios instance 'api' already has baseURL and Authorization header (if token exists)
        const response = await api.put('/users/me', bodyToSend, config);

        if (response.data && response.data.success && response.data.data) {
            const updatedUser = response.data.data;
            console.log('[AuthContext] Profile update successful. Updated user:', updatedUser);
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } else {
            throw new Error(response.data?.message || 'Profile update failed: Invalid response from server.');
        }
    } catch (error) {
        console.error('AuthContext: Profile update error details:', {
            message: error.message,
            response: error.response?.data,
        });
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile. Please try again.';
        throw new Error(errorMessage);
    }
  }, [user?._id]); // user._id is a stable part of the user object if user exists

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading, 
        isAuthenticated: !!user && !!token, // Simplified: true if user and token exist
        register,
        login,
        logout,
        // checkAuth, // Not typically exposed, called internally on mount
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) { 
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
