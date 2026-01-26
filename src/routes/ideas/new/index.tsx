import { useCreateIdea } from "@/hooks/useCreateIdea";
import { createIdeaSchema } from "@/lib/validations/ideasValidations";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "react-toastify";

export const Route = createFileRoute("/ideas/new/")({
  component: NewIdeaPage,
});

function NewIdeaPage() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  // use Create Idea hook
  const { mutate, isPending: isLoading } = useCreateIdea();

  // handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { title, summary, description, tags };
    const validated = createIdeaSchema.safeParse(formData);
    if (!validated.success) {
      toast.error(validated.error.message);
      return;
    }
    try {
      mutate({
        title,
        summary,
        description,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
      });
    } catch (err) {
      console.error("Something went wrong");
    }
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Create New Idea</h1>
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
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {/* submit button */}
        <div className="mt-5">
          <button
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition disabled:cursor-not-allowed"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Creating Idea..." : "Create Idea"}
          </button>
        </div>
      </form>
    </div>
  );
}
