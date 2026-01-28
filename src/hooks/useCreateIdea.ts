import { createIdea } from "@/api/ideas";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";

export const useCreateIdea = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createIdea,
    onSuccess: (data) => {
      navigate({ to: "/ideas" });
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { mutateAsync, isPending };
};
