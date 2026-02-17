import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, float } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  firebaseUid: varchar("firebaseUid", { length: 128 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  subscriptionTier: mysqlEnum("subscriptionTier", ["free", "starter", "professional", "enterprise"]).default("free").notNull(),
  subscriptionExpiresAt: timestamp("subscriptionExpiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Company profiles - set up BEFORE running an audit
export const companyProfiles = mysqlTable("companyProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 128 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  description: text("description"),
  logoUrl: text("logoUrl"),
  logoKey: varchar("logoKey", { length: 512 }),
  website: varchar("website", { length: 512 }),
  phone: varchar("phone", { length: 32 }),
  email: varchar("email", { length: 320 }),
  address: text("address"),
  services: json("services"), // string[]
  targetAudience: text("targetAudience"),
  avgLeadValue: float("avgLeadValue").default(150),
  growthGoal: varchar("growthGoal", { length: 64 }).default("Phone Leads"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CompanyProfile = typeof companyProfiles.$inferSelect;
export type InsertCompanyProfile = typeof companyProfiles.$inferInsert;

// Audits - linked to a company profile (one audit per company)
export const audits = mysqlTable("audits", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  companyProfileId: int("companyProfileId"),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  businessLocation: varchar("businessLocation", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 128 }).notNull(),
  placeId: varchar("placeId", { length: 255 }),
  avgLeadValue: float("avgLeadValue").default(150),
  growthGoal: varchar("growthGoal", { length: 64 }),
  tier: mysqlEnum("tier", ["free", "starter", "professional", "enterprise"]).default("free").notNull(),
  status: mysqlEnum("status", ["pending", "scanning", "analyzing", "complete", "failed"]).default("pending").notNull(),
  overallScore: float("overallScore"),
  aiVisibilityScore: float("aiVisibilityScore"),
  mapsPresenceScore: float("mapsPresenceScore"),
  reviewScore: float("reviewScore"),
  photoScore: float("photoScore"),
  seoScore: float("seoScore"),
  competitorGapScore: float("competitorGapScore"),
  // Per-LLM scores
  chatgptScore: float("chatgptScore"),
  geminiScore: float("geminiScore"),
  perplexityScore: float("perplexityScore"),
  chatgptIssues: json("chatgptIssues"), // { issues: [], fixes: [] }
  geminiIssues: json("geminiIssues"),
  perplexityIssues: json("perplexityIssues"),
  estimatedMonthlyLoss: float("estimatedMonthlyLoss"),
  businessData: json("businessData"),
  competitorData: json("competitorData"),
  aiAnalysis: json("aiAnalysis"),
  recommendations: json("recommendations"),
  moneyLeaks: json("moneyLeaks"), // detailed money leaks with fix services
  // Lat/lng for map display
  latitude: float("latitude"),
  longitude: float("longitude"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Audit = typeof audits.$inferSelect;
export type InsertAudit = typeof audits.$inferInsert;

// Cart items for add-on services
export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  companyProfileId: int("companyProfileId"),
  auditId: int("auditId"),
  serviceType: mysqlEnum("serviceType", [
    "full_audit",
    "description_rewrite",
    "review_strategy",
    "competitor_deep_dive",
    "ad_campaign",
    "seo_optimization",
    "monitoring_annual",
    "ai_agent_fix",
  ]).notNull(),
  serviceName: varchar("serviceName", { length: 255 }).notNull(),
  price: float("price").notNull(),
  status: mysqlEnum("status", ["in_cart", "purchased", "in_progress", "completed"]).default("in_cart").notNull(),
  fixResults: json("fixResults"), // AI agent fix verification results
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

export const scanResults = mysqlTable("scanResults", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  niche: varchar("niche", { length: 128 }).notNull(),
  territory: varchar("territory", { length: 255 }).notNull(),
  companyProfileId: int("companyProfileId"),
  totalFound: int("totalFound").default(0),
  results: json("results"),
  status: mysqlEnum("status", ["pending", "scanning", "complete", "failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ScanResult = typeof scanResults.$inferSelect;
export type InsertScanResult = typeof scanResults.$inferInsert;

export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  auditId: int("auditId"),
  companyProfileId: int("companyProfileId"),
  role: mysqlEnum("role", ["system", "user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  auditId: int("auditId").notNull(),
  companyProfileId: int("companyProfileId"),
  reportType: mysqlEnum("reportType", ["free_preview", "full_audit", "competitor_analysis", "implementation_plan"]).default("free_preview").notNull(),
  pdfUrl: text("pdfUrl"),
  reportData: json("reportData"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

// Support tickets - user-created cases handled by AI Agent
export const supportTickets = mysqlTable("supportTickets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: mysqlEnum("category", ["billing", "technical", "audit_issue", "account", "feature_request", "other"]).default("other").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "waiting_user", "escalated", "resolved", "closed"]).default("open").notNull(),
  assignedTo: mysqlEnum("assignedTo", ["ai_agent", "admin"]).default("ai_agent").notNull(),
  escalatedAt: timestamp("escalatedAt"),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;

// Support ticket messages - conversation thread
export const ticketMessages = mysqlTable("ticketMessages", {
  id: int("id").autoincrement().primaryKey(),
  ticketId: int("ticketId").notNull(),
  senderId: int("senderId"), // null for AI agent
  senderType: mysqlEnum("senderType", ["user", "ai_agent", "admin"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TicketMessage = typeof ticketMessages.$inferSelect;
export type InsertTicketMessage = typeof ticketMessages.$inferInsert;

// Agent activity log - tracks all AI agent actions per user
export const agentActivityLog = mysqlTable("agentActivityLog", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  companyProfileId: int("companyProfileId"),
  auditId: int("auditId"),
  actionType: mysqlEnum("actionType", [
    "audit_generated", "description_rewrite", "seo_optimization", "review_strategy",
    "competitor_analysis", "error_detected", "auto_fix_applied", "auto_fix_failed",
    "ticket_responded", "ticket_escalated", "report_generated", "scan_completed",
    "lead_analysis", "api_health_check", "profile_optimization"
  ]).notNull(),
  toolUsed: varchar("toolUsed", { length: 128 }), // e.g. "google_maps_api", "llm_chatgpt", "seo_analyzer"
  status: mysqlEnum("status", ["started", "in_progress", "completed", "failed"]).default("started").notNull(),
  details: json("details"), // { input, output, error, duration_ms }
  errorMessage: text("errorMessage"),
  durationMs: int("durationMs"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AgentActivity = typeof agentActivityLog.$inferSelect;
export type InsertAgentActivity = typeof agentActivityLog.$inferInsert;

// Account deletion requests
export const accountDeletionRequests = mysqlTable("accountDeletionRequests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  reason: text("reason"),
  status: mysqlEnum("status", ["pending", "processing", "completed", "cancelled"]).default("pending").notNull(),
  scheduledDeletionAt: timestamp("scheduledDeletionAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AccountDeletionRequest = typeof accountDeletionRequests.$inferSelect;
export type InsertAccountDeletionRequest = typeof accountDeletionRequests.$inferInsert;

// Partner/Reseller program
export const partners = mysqlTable("partners", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // the partner's user account
  companyName: varchar("companyName", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  contactEmail: varchar("contactEmail", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  website: varchar("website", { length: 512 }),
  logoUrl: text("logoUrl"),
  description: text("description"),
  industry: varchar("industry", { length: 128 }),
  commissionRate: float("commissionRate").default(20).notNull(), // percentage (e.g. 20 = 20%)
  revenueShareMonths: int("revenueShareMonths").default(12).notNull(), // 12 months = 1 year
  stripeAccountId: varchar("stripeAccountId", { length: 255 }), // Stripe Connect account
  stripeOnboarded: int("stripeOnboarded").default(0).notNull(), // 0=false, 1=true
  status: mysqlEnum("status", ["pending", "approved", "active", "suspended", "rejected"]).default("pending").notNull(),
  totalEarnings: float("totalEarnings").default(0).notNull(),
  totalPaidOut: float("totalPaidOut").default(0).notNull(),
  totalCustomers: int("totalCustomers").default(0).notNull(),
  approvedAt: timestamp("approvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Partner = typeof partners.$inferSelect;
export type InsertPartner = typeof partners.$inferInsert;

// Partner referrals - maps partner to referred users
export const partnerReferrals = mysqlTable("partnerReferrals", {
  id: int("id").autoincrement().primaryKey(),
  partnerId: int("partnerId").notNull(),
  referredUserId: int("referredUserId").notNull(),
  referralCode: varchar("referralCode", { length: 64 }).notNull(),
  revenueShareExpiresAt: timestamp("revenueShareExpiresAt").notNull(), // 1 year from referral
  totalRevenue: float("totalRevenue").default(0).notNull(), // total revenue from this user
  totalCommission: float("totalCommission").default(0).notNull(), // total commission earned
  status: mysqlEnum("status", ["active", "expired", "cancelled"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PartnerReferral = typeof partnerReferrals.$inferSelect;
export type InsertPartnerReferral = typeof partnerReferrals.$inferInsert;

// Partner commissions - monthly commission records
export const partnerCommissions = mysqlTable("partnerCommissions", {
  id: int("id").autoincrement().primaryKey(),
  partnerId: int("partnerId").notNull(),
  referralId: int("referralId"), // optional, for per-referral tracking
  referredUserId: int("referredUserId"),
  period: varchar("period", { length: 7 }).notNull(), // YYYY-MM
  grossRevenue: float("grossRevenue").default(0).notNull(),
  commissionRate: float("commissionRate").notNull(),
  commissionAmount: float("commissionAmount").default(0).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "approved", "paid", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PartnerCommission = typeof partnerCommissions.$inferSelect;
export type InsertPartnerCommission = typeof partnerCommissions.$inferInsert;

// Partner payouts - Stripe payout records
export const partnerPayouts = mysqlTable("partnerPayouts", {
  id: int("id").autoincrement().primaryKey(),
  partnerId: int("partnerId").notNull(),
  amount: float("amount").notNull(),
  currency: varchar("currency", { length: 3 }).default("usd").notNull(),
  stripePayoutId: varchar("stripePayoutId", { length: 255 }),
  stripeTransferId: varchar("stripeTransferId", { length: 255 }),
  periodStart: varchar("periodStart", { length: 7 }).notNull(), // YYYY-MM
  periodEnd: varchar("periodEnd", { length: 7 }).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  failureReason: text("failureReason"),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PartnerPayout = typeof partnerPayouts.$inferSelect;
export type InsertPartnerPayout = typeof partnerPayouts.$inferInsert;
