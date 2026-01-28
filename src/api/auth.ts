import api from "@/lib/axios";
import type {
  CreateUserValues,
  LoginUserValues,
} from "@/lib/validations/userValidations";
import type { AuthResponse } from "@/types";

// register new user
export const registerUser = async (
  credentials: CreateUserValues,
): Promise<AuthResponse> => {
  try {
    const res = await api.post("/auth/register", credentials);
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed to register user";
    throw new Error(message);
  }
};

// login user
export const loginUser = async (
  credentials: LoginUserValues,
): Promise<AuthResponse> => {
  try {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed to logged in user";
    throw new Error(message);
  }
};

// log out user
export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed to logout user";
    throw new Error(message);
  }
};

export const refreshAccessToken = async (): Promise<AuthResponse> => {
  try {
    const res = await api.post("auth/refresh");
    console.log("REFRESH RESPONSE", res.data);
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed to refresh token";
    throw new Error(message);
  }
};
