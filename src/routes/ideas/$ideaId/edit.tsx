import { updateIdea } from "@/api/ideas";
import { ideaQueryOptions } from "@/lib/queries/ideasQueries";
import { updateIdeaSchema } from "@/lib/validations/ideasValidations";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Activity, useState } from "react";
import { toast } from "react-toastify";

export const Route = createFileRoute("/ideas/$ideaId/edit")({
  component: EditIdeaPage,
  loader: async ({ params, context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.ideaId));
  },
});

function EditIdeaPage() {
  const { ideaId } = Route.useParams();
  const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId));

  // form states
  const [title, setTitle] = useState(idea.title);
  const [summary, setSummary] = useState(idea.summary);
  const [description, setDescription] = useState(idea.description);
  const [inputTags, setInputTags] = useState<string>(idea.tags.join(", "));
  const [errors, setErrors] = useState<string | string[]>([]);

  // mutate for update idea
  const navigate = useNavigate();
  const { mutateAsync: editMutate, isPending: isLoading } = useMutation({
    mutationFn: () =>
      updateIdea(ideaId, {
        title,
        summary,
        description,
        tags: inputTags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }),
    onSuccess: () => {
      navigate({ to: "/ideas/$ideaId", params: { ideaId } });
      toast.success("Idea Edited Successfully");
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  // edit form handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = { title, summary, description, inputTags };
      // validations
      const validated = updateIdeaSchema.safeParse(formData);
      if (!validated.success) {
        // extract all error messages from zod
        const errorMessages = validated.error.issues.map(
          (issue) => issue.message,
        );
        // show them in Error message section

        setErrors(errorMessages);

        return;
      }
      await editMutate();
    } catch (err) {
      console.error("Something went wrong", err);
    }
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Edit Idea</h1>
      {/* error message */}
      <Activity mode={errors.length > 0 ? "visible" : "hidden"}>
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          <div className="space-y-1">
            {typeof errors !== "string"
              ? errors.map((error, index) => <p key={index}>{error}</p>)
              : errors}
          </div>
        </div>
      </Activity>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* title input */}
        <div>
          <label
            htmlFor="title"
            className="text-gray-700 mb-1 font-medium block"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Idea Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {/* summary input */}
        <div>
          <label
            htmlFor="summary"
            className="text-gray-700 mb-1 font-medium block"
          >
            Summary
          </label>
          <input
            type="text"
            name="summary"
            id="summary"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Idea Summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        {/* description input */}
        <div>
          <label
            htmlFor="description"
            className="text-gray-700 mb-1 font-medium block"
          >
            Description
          </label>
          <input
            type="text"
            name="description"
            id="description"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Idea Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {/* tags input */}
        <div>
          <label
            htmlFor="tags"
            className="text-gray-700 mb-1 font-medium block"
          >
            Tags
          </label>
          <input
            type="text"
            name="tags"
            id="tags"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="optional tags, comma separated"
            value={inputTags}
            onChange={(e) => setInputTags(e.target.value)}
          />
        </div>

        {/* submit button */}
        <div className="mt-5">
          <button
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition disabled:cursor-not-allowed"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Editing Idea..." : "Edit Idea"}
          </button>
        </div>
      </form>
    </div>
  );
}
