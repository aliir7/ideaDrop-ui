import { loginUser } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { loginUserSchema } from "@/lib/validations/userValidations";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Activity, useState } from "react";
import { toast } from "react-toastify";

export const Route = createFileRoute("/(auth)/login/")({
  component: LoginPage,
});

function LoginPage() {
  const { user, setUser, setAccessToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string | string[]>([]);
  const navigate = useNavigate();

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
      navigate({ to: "/ideas" });
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // login form handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = { email, password };

      // validations
      const validated = loginUserSchema.safeParse(formData);
      if (!validated.success) {
        // extract all error messages from zod
        const errorMessages = validated.error.issues.map(
          (issue) => issue.message
        );
        // show them in error section

        setErrors(errorMessages);

        return;
      }
      // send form data to api
      await mutateAsync({
        email,
        password,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  if (user) {
    navigate({ to: "/" });
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl mb-6 font-bold">Login</h1>
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
        <input
          type="email"
          name="email"
          id="email"
          className="w-full border border-gray-100 rounded-md p-2"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
        />
        <input
          type="password"
          name="password"
          id="password"
          className="w-full border border-gray-100 rounded-md p-2"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md disabled:opacity-50 cursor-pointer disabled:cursor-none"
          disabled={isLoading}
        >
          {isLoading ? "Login..." : "Login"}
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-blue-600 hover:underline font-medium"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
