import api from "@/lib/axios";
import type { Idea } from "@/types";

export const fetchIdea = async (ideaId: string): Promise<Idea> => {
  const res = await api.get(`/ideas/${ideaId}`);
  return res.data();
};

export const fetchIdeas = async (limit?: number): Promise<Idea[]> => {
  const res = await api.get(`/ideas`, {
    params: limit ? { _limit: limit } : {},
  });
  return res.data();
};
