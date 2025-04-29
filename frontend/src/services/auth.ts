import axios from "axios";

// Base URL for API requests
const API_BASE_URL = "http://127.0.0.1:8000/api";

// Function to refresh the access token
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
      refresh: refreshToken,
    });

    // Save the new access token to localStorage
    localStorage.setItem("access_token", response.data.access);

    return response.data.access; // Return the new access token
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Clear tokens and redirect to login page if refresh fails
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
    throw error;
  }
};

// Function to log in a user
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login/`, {
      email,
      password,
    });

    // Save tokens and user data to localStorage
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data; // Return the response data (tokens and user)
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Function to register a new user
export const register = async (
  email: string,
  name: string,
  password: string,
  role: "buyer" | "seller"
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register/`, {
      email,
      name,
      password,
      role,
    });

    // Save tokens and user data to localStorage
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data; // Return the response data (tokens and user)
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

// Function to log out a user
export const logout = () => {
  // Clear tokens and user data from localStorage
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");

  // Redirect to the login page
  window.location.href = "/login";
};

// Function to make authenticated API requests
export const authAxios = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the access token in headers
authAxios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired token (401) and it's not a retry request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried

      try {
        const newAccessToken = await refreshToken(); // Refresh the access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // Update the request headers
        return authAxios(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        logout(); // Log out the user if token refresh fails
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);