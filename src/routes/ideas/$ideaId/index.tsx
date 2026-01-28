import { deleteIdea, fetchIdea } from "@/api/ideas";
import { useAuth } from "@/context/AuthContext";
import {
  queryOptions,
  useSuspenseQuery,
  useMutation,
} from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Activity } from "react";
import { toast } from "react-toastify";

const ideaQueryOptions = (ideaId: string) => {
  return queryOptions({
    queryKey: ["idea", ideaId],
    queryFn: () => fetchIdea(ideaId),
  });
};

export const Route = createFileRoute("/ideas/$ideaId/")({
  component: IdeaDetailsPage,
  loader: async ({ params, context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.ideaId));
  },
});

function IdeaDetailsPage() {
  const { ideaId } = Route.useParams();
  const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId));

  const { user } = useAuth();

  const navigate = useNavigate();
  // delete mutation
  const { mutateAsync: deleteMutate, isPending: isLoading } = useMutation({
    mutationFn: () => deleteIdea(ideaId),
    onSuccess: (data) => {
      navigate({ to: "/ideas" });
      toast.success(data);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // delete handler
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Idea?",
    );

    if (confirmDelete) {
      await deleteMutate();
    }
  };

  return (
    <div className="p-4">
      <Link to="/ideas" className="text-blue-500 underline block mb-4">
        Back to Ideas
      </Link>
      <h2 className="text-2xl font-bold">{idea.title}</h2>
      <p className="mt-2">{idea.description}</p>
      <Activity mode={user && user.id ? "visible" : "hidden"}>
        {/* Edit Link*/}

        <Link
          to="/ideas/$ideaId/edit"
          params={{ ideaId }}
          className="text-sm px-4 py-2 mr-2 mt-4 rounded bg-yellow-500 hover:bg-yellow-600 text-white transition cursor-pointer"
        >
          Edit
        </Link>
        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="text-sm px-4 py-2 mt-4 rounded bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50 disabled:cursor-none cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete"}{" "}
        </button>
      </Activity>
    </div>
  );
}
