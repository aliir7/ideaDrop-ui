import api from "@/lib/axios";

export const refreshAccessToken = async () => {
  try {
    const res = await api.post("auth/refresh");
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed to refresh token";
    throw new Error(message);
  }
};
