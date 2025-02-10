import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // Your Express backend URL

// ✅ Define Type for User Registration
interface RegisterUserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }
  
  // ✅ Define Type for Login Credentials
  interface LoginCredentials {
    email: string;
    password: string;
  }
  
  // ✅ Define Type for API Response
  interface AuthResponse {
    accessToken: string;
  }

// Register a new user
export const registerUser = async (userData: RegisterUserData) => {
    return axios.post(`${API_BASE_URL}/api/user/register`, userData);
};

// Login user
export const loginUser = async (credentials: LoginCredentials) => {
    return axios.post(`${API_BASE_URL}/api/user/login`, credentials);
};

// Get protected dashboard data
export const getDashboard = async (token: AuthResponse) => {
    return axios.get(`${API_BASE_URL}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
