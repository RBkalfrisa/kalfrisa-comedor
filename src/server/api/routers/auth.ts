import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { hash, compare } from "bcryptjs"; // You need bcryptjs for hashing passwords
import { db } from "@/server/db"; // Adjust the path as per your setup
import { signIn, signOut } from "next-auth/react"; // For authentication with next-auth

export const authRouter = createTRPCRouter({
  // Sign up
  signup: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(8), name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const { email, password, name } = input;

      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("User already exists");
      }

      // Hash the password before saving to DB
      const hashedPassword = await hash(password, 10);

      // Create user
      const newUser = await db.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      return newUser;
    }),

  // Login
  // login: publicProcedure
  //   .input(z.object({ email: z.string().email(), password: z.string().min(8) }))
  //   .mutation(async ({ input }) => {
  //     const { email, password } = input;

  //     // Find the user by email
  //     const user = await db.user.findUnique({
  //       where: { email },
  //     });

  //     if (!user) {
  //       throw new Error("User not found");
  //     }

  //     // Compare the provided password with the hashed password stored in the DB
  //     const isValidPassword = await compare(password, user.password);

  //     if (!isValidPassword) {
  //       throw new Error("Invalid credentials");
  //     }

  //     // You can optionally create a session here using NextAuth.js or other methods
  //     // For simplicity, we'll simulate a JWT or session here using NextAuth.js
  //     const session = await signIn("credentials", {
  //       redirect: false,
  //       email,
  //       password,
  //     });

  //     if (!session) {
  //       throw new Error("Login failed");
  //     }

  //     return { user, session };
  //   }),

  // Get current session (check if the user is logged in)
  getSession: protectedProcedure.query(async ({ ctx }) => {
    return ctx.session; // The session object contains user data
  }),

  // Logout (invalidate session)
  logout: protectedProcedure.mutation(async () => {
    // Perform logout logic (e.g., destroy session)
    await signOut();
    return { message: "Logged out successfully" };
  }),
});
