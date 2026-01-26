import api from "@/lib/axios";
import type { ApiResponse, Idea } from "@/types";
import type { AxiosResponse } from "axios";

// Get all Ideas
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

// Get one Idea with id
export const fetchIdea = async (ideaId: string): Promise<ApiResponse<Idea>> => {
  try {
    const res = await api.get(`/ideas/${ideaId}`);
    return res.data.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed fetch Idea";
    throw new Error(message);
  }
};

// Create new Idea
export const createIdea = async (newIdea: any): Promise<ApiResponse<Idea>> => {
  try {
    const res = await api.post("/ideas", {
      ...newIdea,
      createdAt: new Date().toISOString(),
    });
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed create idea";
    throw new Error(message);
  }
};

// Update Idea with id
export const updateIdea = async (
  ideaId: string
): Promise<ApiResponse<Idea>> => {
  try {
    const res = await api.put(`/ideas/${ideaId}`);
    return res.data.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Failed fetch Idea";
    throw new Error(message);
  }
};
