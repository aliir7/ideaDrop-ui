import IdeaCard from "@/components/IdeaCard";
import useIdeas from "@/hooks/useIdeas";
import { ideasQueryOptions } from "@/lib/queries/ideasQueries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ideas/")({
  head: () => ({
    meta: [
      {
        title: "IdeaDrop - Browse Idea Hub",
      },
    ],
  }),
  component: IdeasPage,
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideasQueryOptions());
  },
});

function IdeasPage() {
  const { data: ideas } = useIdeas();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ideas</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {ideas.map((idea) => (
          <IdeaCard idea={idea} key={idea._id} button={false} />
        ))}
      </ul>
    </div>
  );
}
