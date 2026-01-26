import { useSuspenseQuery } from "@tanstack/react-query";
import { ideasQueryOptions } from "@/lib/queries/ideasQueries";

const useIdeas = (limit?: number) => {
  return useSuspenseQuery(ideasQueryOptions(limit));
};

export default useIdeas;
