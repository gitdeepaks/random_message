import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 chars")
  .max(20, "Username must be atmost 20 chars")
  .regex(
    /^[a-zA-Z0-9_]*$/,
    "Username must contain only letters, numbers and underscores"
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z.string().min(6, { message: "Password must be atleast 6 chars" }),
});
