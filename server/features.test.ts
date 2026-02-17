import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

// Mock the map module
vi.mock("./_core/map", () => ({
  makeRequest: vi.fn().mockImplementation(async (path: string, params: any) => {
    if (path.includes("textsearch")) {
      return {
        results: [
          {
            place_id: "test_place_123",
            name: "Test Business",
            formatted_address: "123 Main St, Austin, TX",
            rating: 4.2,
            user_ratings_total: 85,
            geometry: { location: { lat: 30.2672, lng: -97.7431 } },
          },
          {
            place_id: "competitor_1",
            name: "Competitor A",
            formatted_address: "456 Oak Ave, Austin, TX",
            rating: 4.5,
            user_ratings_total: 120,
            geometry: { location: { lat: 30.27, lng: -97.74 } },
          },
          {
            place_id: "competitor_2",
            name: "Competitor B",
            formatted_address: "789 Elm St, Austin, TX",
            rating: 3.8,
            user_ratings_total: 45,
            geometry: { location: { lat: 30.265, lng: -97.745 } },
          },
        ],
      };
    }
    if (path.includes("details")) {
      return {
        result: {
          name: "Test Business",
          rating: 4.2,
          user_ratings_total: 85,
          formatted_address: "123 Main St, Austin, TX",
          formatted_phone_number: "(512) 555-0100",
          website: "https://testbusiness.com",
          opening_hours: { open_now: true },
          types: ["restaurant"],
          photos: [{ photo_reference: "abc123" }],
          business_status: "OPERATIONAL",
          geometry: { location: { lat: 30.2672, lng: -97.7431 } },
        },
      };
    }
    return {};
  }),
}));

// Mock the LLM module
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockImplementation(async ({ messages, response_format }: any) => {
    const systemMsg = messages[0]?.content || "";
    if (typeof systemMsg === "string" && systemMsg.includes("natural, conversational")) {
      return {
        choices: [{
          message: {
            content: JSON.stringify({
              rewrittenDescription: "We help Austin homeowners stay comfortable year-round with same-day AC repair.",
              voiceSearchQueries: ["Who can fix my AC in Austin?"],
              keyPhrases: ["same-day AC repair", "Austin homeowners"],
              improvementNotes: ["Added conversational tone"],
            }),
          },
        }],
      };
    }
    if (typeof systemMsg === "string" && systemMsg.includes("review strategy")) {
      return {
        choices: [{
          message: {
            content: JSON.stringify({
              strategy: { overview: "Focus on post-service follow-ups", steps: [{ step: 1, action: "Send follow-up", details: "Within 24 hours" }] },
              followUpTemplates: [{ channel: "SMS", template: "Thanks for choosing us!" }],
              reviewPrompts: ["Mention the specific service"],
              negativeReviewResponse: "We apologize and want to make it right.",
              expectedImpact: { ratingIncrease: "0.3 stars", reviewGrowth: "200%", aiVisibilityBoost: "40%" },
            }),
          },
        }],
      };
    }
    if (typeof systemMsg === "string" && systemMsg.includes("Business Guardian")) {
      return {
        choices: [{
          message: {
            content: "Based on your audit data, I recommend optimizing your business description for voice search queries. Your current AI visibility score of 45/100 indicates significant room for improvement.",
          },
        }],
      };
    }
    return {
      choices: [{
        message: {
          content: JSON.stringify({
            scores: {
              aiVisibility: 45,
              mapsPresence: 60,
              reviewQuality: 55,
              photoQuality: 40,
              seoReadiness: 35,
              competitorGap: 50,
              overall: 48,
            },
            llmScores: {
              chatgpt: { score: 42, issues: ["Missing structured data"], fixes: ["Add FAQ schema"] },
              gemini: { score: 48, issues: ["Low review signals"], fixes: ["Increase review count"] },
              perplexity: { score: 38, issues: ["No citations"], fixes: ["Create authoritative content"] },
            },
            estimatedMonthlyLoss: 2400,
            moneyLeaks: [{ area: "Reviews", description: "Low review count", estimatedLoss: 800, priority: "high", fixService: "review_strategy" }],
            strengths: ["Good location"],
            weaknesses: ["Low photo count"],
            opportunities: ["Voice search optimization"],
            recommendations: [{ title: "Add photos", description: "Upload 20+ photos", impact: "high", effort: "easy", category: "photos" }],
            aiReadinessReport: {
              chatgptVisibility: "Low",
              geminiVisibility: "Medium",
              perplexityVisibility: "Low",
              voiceSearchReadiness: "Poor",
            },
            competitorInsights: [{ competitorName: "Competitor A", advantage: "More reviews", yourGap: "35 fewer reviews" }],
            roadmap: [{ phase: 1, title: "Quick Wins", actions: ["Add photos"], timeline: "Week 1", expectedROI: "15%" }],
          }),
        },
      }],
    };
  }),
}));

// Mock the db module
vi.mock("./db", () => ({
  createAudit: vi.fn().mockResolvedValue(1),
  getAuditById: vi.fn().mockImplementation(async (id: number) => ({
    id,
    userId: 1,
    companyProfileId: 1,
    businessName: "Test Business",
    businessLocation: "Austin, TX",
    industry: "Restaurant",
    status: "complete",
    overallScore: 48,
    aiVisibilityScore: 45,
    mapsPresenceScore: 60,
    reviewScore: 55,
    photoScore: 40,
    seoScore: 35,
    competitorGapScore: 50,
    chatgptScore: 42,
    geminiScore: 48,
    perplexityScore: 38,
    estimatedMonthlyLoss: 2400,
    businessData: { name: "Test Business", rating: 4.2 },
    competitorData: [],
    aiAnalysis: {},
    recommendations: [],
    latitude: 30.2672,
    longitude: -97.7431,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
  getAuditByCompanyProfile: vi.fn().mockResolvedValue(null),
  getUserAudits: vi.fn().mockResolvedValue([
    { id: 1, businessName: "Test Business", status: "complete", overallScore: 48, companyProfileId: 1 },
  ]),
  updateAudit: vi.fn().mockResolvedValue(undefined),
  createCompanyProfile: vi.fn().mockResolvedValue(1),
  getCompanyProfileById: vi.fn().mockImplementation(async (id: number) => ({
    id,
    userId: 1,
    businessName: "Test Business",
    industry: "Restaurant",
    location: "Austin, TX",
    description: "A great local restaurant",
    logoUrl: null,
    logoKey: null,
    website: "https://testbusiness.com",
    phone: "(512) 555-0100",
    email: "info@test.com",
    address: "123 Main St, Austin, TX",
    services: ["Dine-in", "Takeout"],
    targetAudience: "Families",
    avgLeadValue: 150,
    growthGoal: "foot_traffic",
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
  getUserCompanyProfiles: vi.fn().mockResolvedValue([
    { id: 1, userId: 1, businessName: "Test Business", industry: "Restaurant", location: "Austin, TX" },
  ]),
  updateCompanyProfile: vi.fn().mockResolvedValue(undefined),
  deleteCompanyProfile: vi.fn().mockResolvedValue(undefined),
  addToCart: vi.fn().mockResolvedValue(1),
  getUserCart: vi.fn().mockResolvedValue([
    { id: 1, userId: 1, auditId: 1, serviceType: "description_rewrite", serviceName: "AI Description Rewrite", price: 299, status: "in_cart" },
  ]),
  getUserPurchases: vi.fn().mockResolvedValue([]),
  getCartItemById: vi.fn().mockImplementation(async (id: number) => ({
    id,
    userId: 1,
    auditId: 1,
    serviceType: "description_rewrite",
    serviceName: "AI Description Rewrite",
    price: 299,
    status: "in_cart",
  })),
  updateCartItem: vi.fn().mockResolvedValue(undefined),
  removeCartItem: vi.fn().mockResolvedValue(undefined),
  purchaseCart: vi.fn().mockResolvedValue(undefined),
  createScan: vi.fn().mockResolvedValue(1),
  getScanById: vi.fn().mockImplementation(async (id: number) => ({
    id,
    niche: "Restaurant",
    territory: "Austin, TX",
    status: "complete",
    totalFound: 3,
    results: [{ name: "Test Biz", optimizationScore: 30, opportunityLevel: "High" }],
  })),
  getUserScans: vi.fn().mockResolvedValue([]),
  updateScan: vi.fn().mockResolvedValue(undefined),
  saveChatMessage: vi.fn().mockResolvedValue(undefined),
  getChatHistory: vi.fn().mockResolvedValue([]),
  createReport: vi.fn().mockResolvedValue(1),
  getReportsByAudit: vi.fn().mockResolvedValue([]),
  getReportById: vi.fn().mockResolvedValue(null),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByFirebaseUid: vi.fn().mockResolvedValue(undefined),
  getScanByCompanyProfile: vi.fn().mockResolvedValue(null),
  getPurchasedFixesByAudit: vi.fn().mockResolvedValue([]),
}));

// Mock storage
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ url: "https://s3.example.com/logo.png", key: "logos/1/logo.png" }),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    firebaseUid: "firebase-test-uid-123",
    email: "test@example.com",
    name: "Test User",
    role: "user",
    subscriptionTier: "free",
    subscriptionExpiresAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("Company Profile Router", () => {
  it("creates a company profile", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.company.create({
      businessName: "Test Business",
      industry: "Restaurant",
      location: "Austin, TX",
      description: "A great local restaurant",
      website: "https://testbusiness.com",
      phone: "(512) 555-0100",
      email: "info@test.com",
    });
    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number");
  });

  it("lists company profiles for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.company.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("businessName");
  });

  it("gets a company profile by id", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.company.get({ id: 1 });
    expect(result).toBeDefined();
    expect(result?.businessName).toBe("Test Business");
    expect(result?.industry).toBe("Restaurant");
    expect(result?.location).toBe("Austin, TX");
  });

  it("updates a company profile", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.company.update({
      id: 1,
      businessName: "Updated Business",
      description: "Updated description",
    });
    expect(result).toEqual({ success: true });
  });

  it("deletes a company profile", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.company.delete({ id: 1 });
    expect(result).toEqual({ success: true });
  });

  it("uploads a logo for a company profile", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.company.uploadLogo({
      companyProfileId: 1,
      fileName: "logo.png",
      fileBase64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      mimeType: "image/png",
    });
    expect(result).toHaveProperty("logoUrl");
    expect(typeof result.logoUrl).toBe("string");
  });
});

describe("Audit Router (Company Profile Linked)", () => {
  it("creates an audit linked to a company profile", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.audit.create({
      companyProfileId: 1,
    });
    expect(result).toHaveProperty("auditId");
    expect(typeof result.auditId).toBe("number");
  });

  it("retrieves an audit by id with per-LLM scores", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.audit.get({ id: 1 });
    expect(result).toBeDefined();
    expect(result?.businessName).toBe("Test Business");
    expect(result?.status).toBe("complete");
    expect(result?.overallScore).toBe(48);
    expect(result?.companyProfileId).toBe(1);
    expect(result?.chatgptScore).toBe(42);
    expect(result?.geminiScore).toBe(48);
    expect(result?.perplexityScore).toBe(38);
  });

  it("lists audits for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.audit.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("Cart & Add-on Services Router", () => {
  it("adds a service to the cart", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.cart.add({
      auditId: 1,
      companyProfileId: 1,
      serviceType: "description_rewrite",
      serviceName: "AI Description Rewrite",
      price: 299,
    });
    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number");
  });

  it("lists cart items for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.cart.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("serviceName");
    expect(result[0]).toHaveProperty("price");
  });

  it("removes an item from the cart", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.cart.remove({ id: 1 });
    expect(result).toEqual({ success: true });
  });

  it("checks out the cart and triggers AI auto-fix", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.cart.checkout();
    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("itemCount");
    expect(result.total).toBe(299);
    expect(result.itemCount).toBe(1);
  });

  it("lists purchase history", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.cart.purchases();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Scanner Router", () => {
  it("creates a niche scan", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.scanner.scan({
      niche: "Restaurant",
      territory: "Austin, TX",
    });
    expect(result).toHaveProperty("scanId");
    expect(typeof result.scanId).toBe("number");
  });

  it("retrieves a scan by id", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.scanner.get({ id: 1 });
    expect(result).toBeDefined();
    expect(result?.status).toBe("complete");
    expect(result?.totalFound).toBe(3);
  });
});

describe("AI Tools Router", () => {
  it("rewrites a business description for voice search", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ai.rewriteDescription({
      currentDescription: "Best HVAC repair Austin TX affordable",
      businessName: "Cool Air HVAC",
      industry: "HVAC",
      location: "Austin, TX",
    });
    expect(result).toHaveProperty("rewrittenDescription");
    expect(result).toHaveProperty("voiceSearchQueries");
    expect(result).toHaveProperty("keyPhrases");
    expect(typeof result.rewrittenDescription).toBe("string");
  });

  it("generates a review strategy", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ai.generateReviewStrategy({
      businessName: "Test Restaurant",
      industry: "Restaurant",
      currentRating: 4.2,
      reviewCount: 85,
    });
    expect(result).toHaveProperty("strategy");
    expect(result).toHaveProperty("followUpTemplates");
    expect(result).toHaveProperty("reviewPrompts");
    expect(result.strategy).toHaveProperty("overview");
  });
});

describe("Reports Router", () => {
  it("generates a report for an audit", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.reports.generate({
      auditId: 1,
      reportType: "free_preview",
    });
    expect(result).toHaveProperty("reportId");
    expect(result).toHaveProperty("audit");
    expect(result.audit?.businessName).toBe("Test Business");
  });
});

describe("Chat Router", () => {
  it("sends a message and receives a response", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.chat.send({
      message: "How can I improve my Google Business listing?",
    });
    expect(result).toHaveProperty("response");
    expect(typeof result.response).toBe("string");
    expect(result.response.length).toBeGreaterThan(0);
  });

  it("retrieves chat history", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.chat.history({});
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Auth Router (Firebase)", () => {
  it("returns null for unauthenticated user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user for authenticated Firebase user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeDefined();
    expect(result?.name).toBe("Test User");
    expect(result?.email).toBe("test@example.com");
    expect(result?.firebaseUid).toBe("firebase-test-uid-123");
  });

  it("clears cookie on logout", async () => {
    const clearCookie = vi.fn();
    const ctx: TrpcContext = {
      user: {
        id: 1,
        firebaseUid: "firebase-test-uid",
        email: "test@example.com",
        name: "Test",
        role: "user",
        subscriptionTier: "free",
        subscriptionExpiresAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie } as unknown as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearCookie).toHaveBeenCalledWith(COOKIE_NAME, expect.objectContaining({ maxAge: -1 }));
  });
});

describe("Lead Generator Router", () => {
  it("generates leads from Google Maps", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.leads.generate({
      niche: "Restaurant",
      location: "Austin, TX",
      filters: {},
    });
    expect(result).toHaveProperty("leads");
    expect(Array.isArray(result.leads)).toBe(true);
    expect(result.leads.length).toBeGreaterThan(0);
    expect(result.leads[0]).toHaveProperty("name");
    expect(result.leads[0]).toHaveProperty("opportunityScore");
    expect(result.leads[0]).toHaveProperty("opportunityLevel");
  });

  it("analyzes a lead with AI", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.leads.analyzeWithAI({
      leadData: {
        name: "Test Restaurant",
        address: "123 Main St",
        rating: 3.5,
        reviewCount: 8,
        website: null,
      },
      niche: "Restaurant",
    });
    // The LLM mock returns a generic response, so we just check it has the expected structure
    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
  });

  it("exports leads to CSV", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.leads.export({
      leads: [
        { name: "Test Biz", address: "123 Main", rating: 4.0, reviewCount: 10, opportunityScore: 60, opportunityLevel: "High" },
      ],
      format: "csv",
      niche: "Restaurant",
      location: "Austin, TX",
    });
    expect(result).toHaveProperty("filename");
    expect(result).toHaveProperty("downloadUrl");
    expect(result.filename).toContain(".csv");
    expect(result.downloadUrl).toContain("data:text/csv");
  });
});
