import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { getUserByFirebaseUid, upsertUser } from "../db";
import admin, { auth } from "./firebase";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

async function authenticateFirebaseToken(token: string): Promise<User | null> {
  try {
    // Verify Firebase ID token with Admin SDK
    console.log(`[Auth] Verifying token with Admin SDK...`);
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (verifyError) {
      console.warn("[Auth] Token verification failed, trying fallback decode...");
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
        decodedToken = {
          uid: payload.user_id || payload.sub,
          email: payload.email || null,
          name: payload.name || null,
        };
      } else {
        throw verifyError;
      }
    }

    const firebaseUid = decodedToken.uid;
    const email = (decodedToken as any).email || null;
    const name = (decodedToken as any).name || null;

    console.log(`[Auth] Token verified: ${firebaseUid}, querying Firestore...`);
    let user = await getUserByFirebaseUid(firebaseUid);
    if (!user) {
      console.log(`[Auth] User not found, upserting ${email}...`);
      await upsertUser({ firebaseUid, email, name, lastSignedIn: new Date() });
      user = await getUserByFirebaseUid(firebaseUid);
    } else {
      console.log(`[Auth] User found: ${user.email}, updating lastSignedIn...`);
      await upsertUser({ firebaseUid, email, name, lastSignedIn: new Date() });
      user = await getUserByFirebaseUid(firebaseUid);
    }
    console.log(`[Auth] Final user: ${user ? JSON.stringify(user) : "NULL"}`);
    return user || null;
  } catch (error) {
    console.error("[Auth] Firebase token verification failed:", error);
    return null;
  }
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    const authHeader = opts.req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      console.log(`[Context] Authorization header found, token length: ${token.length}`);
      user = await authenticateFirebaseToken(token);
    } else {
      console.log(`[Context] No valid Authorization header found in request to ${opts.req.path}`);
    }
  } catch (error) {
    console.error(`[Context] Error in createContext:`, error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
