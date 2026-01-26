import api from "@/lib/axios";
import type {
  CreateUserValues,
  LoginUserValues,
} from "@/lib/validations/userValidations";

// register new user
export const registerUser = async (credentials: CreateUserValues) => {
  try {
    const res = await api.post("/auth/register", credentials);
    res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed to register user";
    throw new Error(message);
  }
};

// login user
export const loginUser = async (credentials: LoginUserValues) => {
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

export const refreshAccessToken = async () => {
  try {
    const res = await api.post("auth/refresh");
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed to refresh token";
    throw new Error(message);
  }
};
