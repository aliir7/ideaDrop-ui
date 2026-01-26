import z from "zod/v4";

export const createUserSchema = z.object({
  name: z.string().min(3, "title must be least 3 character"),
  email: z.email().nonempty("email is required"),
  password: z.string().min(6, "password must be least 6 character"),
});

export const loginUserSchema = z.object({
  email: z.email().nonempty("email is required"),
  password: z.string().min(6, "password must be least 6 character"),
});

export type CreateUserValues = z.infer<typeof createUserSchema>;
export type LoginUserValues = z.infer<typeof loginUserSchema>;
