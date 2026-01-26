import api from "@/lib/axios";
import type { ApiResponse, Idea } from "@/types";
import type { AxiosResponse } from "axios";

export const fetchIdea = async (ideaId: string): Promise<Idea> => {
  const res = await api.get(`/ideas/${ideaId}`);

  return res.data.data;
};

export const fetchIdeas = async (
  limit?: number
): Promise<ApiResponse<Idea[]>> => {
  try {
    const res: AxiosResponse<ApiResponse<Idea[]>> = await api.get(`/ideas`, {
      params: limit ? { _limit: limit } : {},
    });
    return { message: res.data.message, data: res.data.data };
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed fetch Ideas";
    throw new Error(message);
  }
};

export const createIdea = async (newIdea: any): Promise<Idea> => {
  const res = await api.post("/ideas", {
    ...newIdea,
    createdAt: new Date().toISOString(),
  });
  return res.data.data;
};
