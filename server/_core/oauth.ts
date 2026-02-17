// OAuth routes removed - using Firebase authentication instead
// This file is kept for compatibility but is no longer used

import type { Express } from "express";

export function registerOAuthRoutes(app: Express) {
  // No OAuth routes needed - Firebase handles authentication on the client side
  // Authentication is verified via Firebase ID tokens in context.ts
}
