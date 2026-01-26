import { queryOptions } from "@tanstack/react-query";
import { fetchIdeas } from "@/api/ideas";
import type { ApiResponse, Idea } from "@/types";

export const ideasQueryOptions = (limit?: number) =>
  queryOptions<ApiResponse<Idea[]>, Error, Idea[]>({
    queryKey: ["ideas", { limit }],
    queryFn: () => fetchIdeas(limit),
    select: (res) => res.data,

    staleTime: 30_000,
  });
