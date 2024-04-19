import { z } from "zod";

export const messageSchema = z.object({
  conntent: z
    .string()
    .min(10, { message: "Content must be atleast 10 chars" })
    .max(300, { message: "Content must be atmost 300 chars" }),
});
