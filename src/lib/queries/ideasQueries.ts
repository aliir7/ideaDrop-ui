import { queryOptions } from "@tanstack/react-query";
import { fetchIdea, fetchIdeas } from "@/api/ideas";
import type { ApiResponse, Idea } from "@/types";

// get all idea
export const ideasQueryOptions = (limit?: number) =>
  queryOptions<ApiResponse<Idea[]>, Error, Idea[]>({
    queryKey: ["ideas", { limit }],
    queryFn: () => fetchIdeas(limit),
    select: (res) => res.data,
  });

// for edit idea get one idea by id
export const ideaQueryOptions = (id: string) =>
  queryOptions<Promise<Idea>, Error, Idea>({
    queryKey: ["idea", id],
    queryFn: () => fetchIdea(id),
  });
