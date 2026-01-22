import api from "@/lib/axios";
import type { Idea } from "@/types";

export const fetchIdea = async (ideaId: string): Promise<Idea> => {
  const res = await api.get(`/ideas/${ideaId}`);

  return res.data.data;
};

export const fetchIdeas = async (limit?: number): Promise<Idea[]> => {
  const res = await api.get(`/ideas`, {
    params: limit ? { _limit: limit } : {},
  });
  const data = res.data.data;

  return data;
};

export const createIdea = async (newIdea: any): Promise<Idea> => {
  const res = await api.post("/ideas", {
    ...newIdea,
    createdAt: new Date().toISOString(),
  });
  return res.data.data;
};
