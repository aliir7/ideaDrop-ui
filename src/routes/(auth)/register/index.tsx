import { registerUser } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { createUserSchema } from "@/lib/validations/userValidations";

import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Activity, useState } from "react";
import { toast } from "react-toastify";

export const Route = createFileRoute("/(auth)/register/")({
  component: RegisterPage,
});

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string | string[]>([]);

  const { setAccessToken, setUser } = useAuth();

  const navigate = useNavigate();

  //register user query
  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
      navigate({ to: "/ideas" });
      toast(data.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = { name, email, password };

      // validations
      const validated = createUserSchema.safeParse(formData);
      if (!validated.success) {
        // extract all error messages from zod
        const errorMessages = validated.error.issues.map(
          (issue) => issue.message,
        );
        // show them in error section

        setErrors(errorMessages);

        return;
      }
      // send form data to api
      await mutateAsync({
        name,
        email,
        password,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl mb-6 font-bold">Register</h1>
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
          type="text"
          name="name"
          id="name"
          className="w-full border border-gray-100 rounded-md p-2"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Login
        </Link>
      </p>
    </div>
  );
}
