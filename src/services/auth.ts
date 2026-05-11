import { useAuthStore } from '../stores/authStore';

import { Platform } from 'react-native';

// Dynamically set BASE_URL based on the environment to prevent "Failed to fetch"
// Replace with your local machine's IP if testing on a physical device over Wi-Fi
const LOCAL_IP = '172.30.211.228'; // This is your machine's current local IP
const BASE_URL = Platform.OS === 'android' && !__DEV__ // Just an example, assuming __DEV__ means simulator/emulator
  ? `http://${LOCAL_IP}:5000/api/auth` 
  : `http://${LOCAL_IP}:5000/api/auth`; // Using IP universally works for both Emulator and Physical Device!
export const apiCall = async (endpoint: string, method: string, body?: any) => {
  const token = useAuthStore.getState().token;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        useAuthStore.getState().signOut();
        // The UI should reactively redirect to login based on state,
        // or we could use an event emitter. For now, Zustand state handles it.
      }
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Network request failed');
  }
};

export const authApi = {
  register: (data: any) => apiCall('/register', 'POST', data),
  login: (data: any) => apiCall('/login', 'POST', data),
  getProfile: () => apiCall('/profile', 'GET'),
  logout: () => apiCall('/logout', 'POST'),
};
