import { User as FirebaseUser } from "firebase/auth";
import { User as DBUser } from "../../../drizzle/schema";

// Extended user type that combines Firebase auth with our database user
export type AppUser = FirebaseUser & {
  // Add database user fields
  dbId?: number;
  role?: "user" | "admin";
  subscriptionTier?: "free" | "starter" | "professional" | "enterprise";
  subscriptionExpiresAt?: Date;
  name?: string | null;
};
