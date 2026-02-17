import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createAudit, getAuditById, getAuditByCompanyProfile, getUserAudits, updateAudit,
  createCompanyProfile, getCompanyProfileById, getUserCompanyProfiles, updateCompanyProfile, deleteCompanyProfile,
  updateUser,
  addToCart, getUserCart, getUserPurchases, getCartItemById, updateCartItem, removeCartItem, purchaseCart,
  createScan, getScanById, getUserScans, updateScan, getScanByCompanyProfile, getPurchasedFixesByAudit,
  saveChatMessage, getChatHistory,
  createReport, getReportsByAudit, getReportById,
  getAllUsersCount, getAllAuditsCount, getAllPurchasesCount, getTotalRevenue, getRecentUsers, getRecentAudits,
  createSupportTicket, getUserTickets, getTicketById, updateTicket, addTicketMessage, getTicketMessages,
  createPartner, getPartnerByUserId, getPartnerDashboardStats, getPartnerCustomerDetails,
  getPartnerReferrals, getPartnerCommissions, getPartnerPayouts,
} from "./firestore";
import { TRPCError } from "@trpc/server";
import { makeRequest } from "./_core/map";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  user: router({
    updateProfile: protectedProcedure.input(z.object({
      name: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      await updateUser(ctx.user.firebaseUid, input);
      return { success: true };
    }),

    uploadPhoto: protectedProcedure.input(z.object({
      fileName: z.string(),
      fileBase64: z.string(),
      mimeType: z.string(),
    })).mutation(async ({ ctx, input }) => {
      const buffer = Buffer.from(input.fileBase64, "base64");
      const suffix = Math.random().toString(36).substring(2, 10);
      const key = `profiles/${ctx.user.id}/${suffix}-${input.fileName}`;
      const { url } = await storagePut(key, buffer, input.mimeType);
      await updateUser(ctx.user.firebaseUid, { photoUrl: url } as any);
      return { photoUrl: url };
    }),
  }),

  // ============= COMPANY PROFILE =============
  company: router({
    create: protectedProcedure.input(z.object({
      businessName: z.string().min(1),
      industry: z.string().min(1),
      location: z.string().min(1),
      description: z.string().optional(),
      website: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      address: z.string().optional(),
      services: z.array(z.string()).optional(),
      targetAudience: z.string().optional(),
      avgLeadValue: z.number().optional(),
      growthGoal: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      // Check if user is admin - admins can create multiple profiles
      const isAdmin = ctx.user.role === "admin";

      if (!isAdmin) {
        const existingProfiles = await getUserCompanyProfiles(ctx.user.id);
        if (existingProfiles.length >= 1) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Regular users are limited to one business profile. Please delete or edit your existing profile.",
          });
        }
      }

      const id = await createCompanyProfile({
        userId: ctx.user.id,
        businessName: input.businessName,
        industry: input.industry,
        location: input.location,
        description: input.description ?? null,
        website: input.website ?? null,
        phone: input.phone ?? null,
        email: input.email ?? null,
        address: input.address ?? null,
        services: input.services ?? [],
        targetAudience: input.targetAudience ?? null,
        avgLeadValue: input.avgLeadValue ?? 150,
        growthGoal: input.growthGoal ?? "Phone Leads",
      });
      // Auto-run niche scanner with company info
      runNicheScan(
        await createScan({ userId: ctx.user.id, niche: input.industry, territory: input.location, companyProfileId: id, status: "scanning" }),
        { niche: input.industry, territory: input.location }
      ).catch(err => console.error("[AutoScan] Failed:", err));
      return { id };
    }),

    get: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
      const profile = await getCompanyProfileById(input.id);
      if (profile && profile.userId !== ctx.user.id) return null;
      return profile;
    }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserCompanyProfiles(ctx.user.id);
    }),

    update: protectedProcedure.input(z.object({
      id: z.number(),
      businessName: z.string().optional(),
      industry: z.string().optional(),
      location: z.string().optional(),
      description: z.string().optional(),
      logoUrl: z.string().optional(),
      logoKey: z.string().optional(),
      website: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      address: z.string().optional(),
      services: z.array(z.string()).optional(),
      targetAudience: z.string().optional(),
      avgLeadValue: z.number().optional(),
      growthGoal: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      const profile = await getCompanyProfileById(input.id);
      if (!profile || profile.userId !== ctx.user.id) throw new Error("Not found");
      const { id, ...data } = input;
      await updateCompanyProfile(id, data);
      return { success: true };
    }),

    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
      const profile = await getCompanyProfileById(input.id);
      if (!profile || profile.userId !== ctx.user.id) throw new Error("Not found");
      await deleteCompanyProfile(input.id);
      return { success: true };
    }),

    uploadLogo: protectedProcedure.input(z.object({
      companyProfileId: z.number(),
      fileName: z.string(),
      fileBase64: z.string(),
      mimeType: z.string(),
    })).mutation(async ({ ctx, input }) => {
      const profile = await getCompanyProfileById(input.companyProfileId);
      if (!profile || profile.userId !== ctx.user.id) throw new Error("Not found");
      const buffer = Buffer.from(input.fileBase64, "base64");
      const suffix = Math.random().toString(36).substring(2, 10);
      const key = `logos/${ctx.user.id}/${suffix}-${input.fileName}`;
      const { url } = await storagePut(key, buffer, input.mimeType);
      await updateCompanyProfile(input.companyProfileId, { logoUrl: url, logoKey: key });
      return { logoUrl: url };
    }),
  }),

  // ============= AUDIT (linked to company profile) =============
  audit: router({
    create: protectedProcedure.input(z.object({
      companyProfileId: z.number(),
      tier: z.enum(["free", "starter", "professional", "enterprise"]).optional(),
    })).mutation(async ({ ctx, input }) => {
      const profile = await getCompanyProfileById(input.companyProfileId);
      if (!profile || profile.userId !== ctx.user.id) throw new Error("Company profile not found");

      // Check if audit already exists for this company
      const existing = await getAuditByCompanyProfile(input.companyProfileId);
      if (existing && existing.status === "complete") {
        return { auditId: existing.id, existing: true };
      }
      if (existing && (existing.status === "scanning" || existing.status === "analyzing")) {
        return { auditId: existing.id, inProgress: true };
      }

      const auditId = await createAudit({
        userId: ctx.user.id,
        companyProfileId: input.companyProfileId,
        businessName: profile.businessName,
        businessLocation: profile.location,
        industry: profile.industry,
        avgLeadValue: profile.avgLeadValue ?? 150,
        growthGoal: profile.growthGoal ?? "Phone Leads",
        tier: input.tier ?? "free",
        status: "scanning",
      });
      runAudit(auditId, {
        businessName: profile.businessName,
        businessLocation: profile.location,
        industry: profile.industry,
        avgLeadValue: profile.avgLeadValue ?? 150,
        growthGoal: profile.growthGoal ?? "Phone Leads",
        description: profile.description ?? undefined,
        services: (profile.services as string[]) ?? [],
      }).catch(err => console.error("[Audit] Failed:", err));
      return { auditId };
    }),

    get: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const audit = await getAuditById(input.id);
      if (!audit) return null;

      // Fetch company profile to get the latest logo
      if (audit.companyProfileId) {
        const profile = await getCompanyProfileById(audit.companyProfileId);
        if (profile?.logoUrl) {
          (audit as any).logoUrl = profile.logoUrl;
        }
      }
      return audit;
    }),

    getByCompany: protectedProcedure.input(z.object({ companyProfileId: z.number() })).query(async ({ input }) => {
      return getAuditByCompanyProfile(input.companyProfileId);
    }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserAudits(ctx.user.id);
    }),

    purchasedFixes: protectedProcedure.input(z.object({ auditId: z.number() })).query(async ({ input }) => {
      return getPurchasedFixesByAudit(input.auditId);
    }),

    scanData: protectedProcedure.input(z.object({ companyProfileId: z.number() })).query(async ({ input }) => {
      return getScanByCompanyProfile(input.companyProfileId);
    }),

    rerun: protectedProcedure.input(z.object({ companyProfileId: z.number() })).mutation(async ({ ctx, input }) => {
      const profile = await getCompanyProfileById(input.companyProfileId);
      if (!profile || profile.userId !== ctx.user.id) throw new Error("Not found");
      const auditId = await createAudit({
        userId: ctx.user.id,
        companyProfileId: input.companyProfileId,
        businessName: profile.businessName,
        businessLocation: profile.location,
        industry: profile.industry,
        avgLeadValue: profile.avgLeadValue ?? 150,
        growthGoal: profile.growthGoal ?? "Phone Leads",
        tier: "free",
        status: "scanning",
      });
      runAudit(auditId, {
        businessName: profile.businessName,
        businessLocation: profile.location,
        industry: profile.industry,
        avgLeadValue: profile.avgLeadValue ?? 150,
        growthGoal: profile.growthGoal ?? "Phone Leads",
        description: profile.description ?? undefined,
        services: (profile.services as string[]) ?? [],
      }).catch(err => console.error("[Audit] Failed:", err));
      return { auditId };
    }),
  }),

  // ============= CART & ADD-ONS =============
  cart: router({
    add: protectedProcedure.input(z.object({
      companyProfileId: z.number().optional(),
      auditId: z.number().optional(),
      serviceType: z.enum(["full_audit", "description_rewrite", "review_strategy", "competitor_deep_dive", "ad_campaign", "seo_optimization", "monitoring_annual", "ai_agent_fix"]),
      serviceName: z.string(),
      price: z.number(),
    })).mutation(async ({ ctx, input }) => {
      const id = await addToCart({
        userId: ctx.user.id,
        companyProfileId: input.companyProfileId ?? null,
        auditId: input.auditId ?? null,
        serviceType: input.serviceType,
        serviceName: input.serviceName,
        price: input.price,
        status: "in_cart",
      });
      return { id };
    }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserCart(ctx.user.id);
    }),

    purchases: protectedProcedure.query(async ({ ctx }) => {
      return getUserPurchases(ctx.user.id);
    }),

    remove: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
      const item = await getCartItemById(input.id);
      if (!item || item.userId !== ctx.user.id) throw new Error("Not found");
      await removeCartItem(input.id);
      return { success: true };
    }),

    checkout: protectedProcedure.mutation(async ({ ctx }) => {
      const items = await getUserCart(ctx.user.id);
      if (items.length === 0) throw new Error("Cart is empty");
      const total = items.reduce((sum, item) => sum + item.price, 0);
      await purchaseCart(ctx.user.id);
      // Trigger AI agent auto-fix for purchased items
      for (const item of items) {
        if (item.auditId) {
          runAutoFix(item.id, item.auditId, item.serviceType, ctx.user.id).catch(err =>
            console.error("[AutoFix] Failed:", err)
          );
        }
      }
      return { success: true, total, itemCount: items.length };
    }),

    getItem: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
      const item = await getCartItemById(input.id);
      if (!item || item.userId !== ctx.user.id) return null;
      return item;
    }),
  }),

  // ============= SCANNER =============
  scanner: router({
    scan: publicProcedure.input(z.object({
      niche: z.string().min(1),
      territory: z.string().min(1),
    })).mutation(async ({ ctx, input }) => {
      const scanId = await createScan({
        userId: ctx.user?.id ?? null,
        niche: input.niche,
        territory: input.territory,
        status: "scanning",
      });
      runNicheScan(scanId, input).catch(err => console.error("[Scanner] Failed:", err));
      return { scanId };
    }),

    get: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getScanById(input.id);
    }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserScans(ctx.user.id);
    }),
  }),

  // ============= AI AGENT CHAT =============
  chat: router({
    send: protectedProcedure.input(z.object({
      message: z.string().min(1),
      auditId: z.number().optional(),
    })).mutation(async ({ ctx, input }) => {
      await saveChatMessage({
        userId: ctx.user.id,
        auditId: input.auditId ?? null,
        role: "user",
        content: input.message,
      });

      let auditContext = "";
      if (input.auditId) {
        const audit = await getAuditById(input.auditId);
        if (audit) {
          auditContext = `\n\nCurrent audit context:\nBusiness: ${audit.businessName}\nLocation: ${audit.businessLocation}\nIndustry: ${audit.industry}\nOverall Score: ${audit.overallScore ?? 'N/A'}/100\nAI Visibility: ${audit.aiVisibilityScore ?? 'N/A'}/100\nMaps Presence: ${audit.mapsPresenceScore ?? 'N/A'}/100\nReview Score: ${audit.reviewScore ?? 'N/A'}/100\nEstimated Monthly Loss: $${audit.estimatedMonthlyLoss ?? 'N/A'}\n\nRecommendations: ${JSON.stringify(audit.recommendations ?? {})}\nBusiness Data: ${JSON.stringify(audit.businessData ?? {})}`;
        }
      }

      const history = await getChatHistory(ctx.user.id, input.auditId);
      const messages = [
        {
          role: "system" as const,
          content: `You are the Lux AI Business Guardian, an expert AI consultant specializing in local business optimization for AI discovery. You help businesses improve their visibility in AI-powered search results (ChatGPT, Gemini, Perplexity), Google Maps, and voice assistants.

You provide actionable advice on:
- Google Business Profile optimization
- AI-friendly business descriptions (natural language, conversational)
- Review strategy and management
- SEO and keyword optimization for voice search
- Competitor analysis insights
- Revenue recovery strategies
- Tax write-off information for business expenses (refer to luxwriteoff.com)

When a user purchases an add-on service, you automatically execute the fix:
1. Analyze the specific issue from the audit data
2. Generate the optimized content (description, review strategy, etc.)
3. Provide the exact changes needed
4. Verify the changes would improve their score

Be specific, data-driven, and action-oriented. Reference the audit data when available.${auditContext}`
        },
        ...history.slice(-20).map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: "user" as const, content: input.message },
      ];

      const response = await invokeLLM({ messages });
      const assistantMessage = typeof response.choices[0]?.message?.content === 'string'
        ? response.choices[0].message.content
        : 'I apologize, I was unable to generate a response. Please try again.';

      await saveChatMessage({
        userId: ctx.user.id,
        auditId: input.auditId ?? null,
        role: "assistant",
        content: assistantMessage,
      });

      return { response: assistantMessage };
    }),

    history: protectedProcedure.input(z.object({
      auditId: z.number().optional(),
    })).query(async ({ ctx, input }) => {
      return getChatHistory(ctx.user.id, input.auditId);
    }),
  }),

  // ============= REPORTS =============
  reports: router({
    generate: publicProcedure.input(z.object({
      auditId: z.number(),
      reportType: z.enum(["free_preview", "full_audit", "competitor_analysis", "implementation_plan"]).optional(),
    })).mutation(async ({ ctx, input }) => {
      const audit = await getAuditById(input.auditId);
      if (!audit) throw new Error("Audit not found");
      const reportId = await createReport({
        userId: ctx.user?.id ?? null,
        auditId: input.auditId,
        reportType: input.reportType ?? "free_preview",
        reportData: { audit, generatedAt: Date.now() },
      });
      return { reportId, audit };
    }),

    get: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getReportById(input.id);
    }),

    listByAudit: publicProcedure.input(z.object({ auditId: z.number() })).query(async ({ input }) => {
      return getReportsByAudit(input.auditId);
    }),
  }),

  // ============= AI TOOLS =============
  ai: router({
    rewriteDescription: publicProcedure.input(z.object({
      currentDescription: z.string(),
      businessName: z.string(),
      industry: z.string(),
      location: z.string(),
      services: z.array(z.string()).optional(),
    })).mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an expert at writing business descriptions optimized for AI discovery and voice search. Rewrite the business description to:
1. Use natural, conversational language (how people actually talk/ask questions)
2. Include answers to common voice search queries
3. Mention specific services, specialties, and differentiators
4. Include location-specific context
5. Use semantic language that AI systems can match to user queries
6. Avoid keyword stuffing - write naturally

Respond in JSON:
{
  "rewrittenDescription": "string",
  "voiceSearchQueries": ["string - questions this description answers"],
  "keyPhrases": ["string - natural language key phrases included"],
  "improvementNotes": ["string - what was improved and why"]
}`
          },
          {
            role: "user",
            content: `Rewrite this Google Business Profile description for "${input.businessName}" (${input.industry}) in ${input.location}:\n\n"${input.currentDescription}"\n\nServices: ${input.services?.join(', ') ?? 'Not specified'}`
          }
        ],
        response_format: { type: "json_object" },
      });
      const content = typeof response.choices[0]?.message?.content === 'string' ? response.choices[0].message.content : '{}';
      try { return JSON.parse(content); } catch { return { rewrittenDescription: input.currentDescription, voiceSearchQueries: [], keyPhrases: [], improvementNotes: ["Failed to rewrite"] }; }
    }),

    generateReviewStrategy: publicProcedure.input(z.object({
      businessName: z.string(),
      industry: z.string(),
      currentRating: z.number().optional(),
      reviewCount: z.number().optional(),
    })).mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an expert at helping businesses gather high-quality reviews. Create a review strategy that:
1. Encourages happy customers to mention specific services/experiences
2. Provides templates for follow-up messages
3. Suggests timing for review requests
4. Includes strategies for addressing negative reviews
5. Focuses on reviews that help AI systems recommend the business

Respond in JSON:
{
  "strategy": { "overview": "string", "steps": [{"step": number, "action": "string", "details": "string"}] },
  "followUpTemplates": [{"channel": "string", "template": "string"}],
  "reviewPrompts": ["string - specific things to ask customers to mention"],
  "negativeReviewResponse": "string",
  "expectedImpact": { "ratingIncrease": "string", "reviewGrowth": "string", "aiVisibilityBoost": "string" }
}`
          },
          {
            role: "user",
            content: `Create a review strategy for "${input.businessName}" (${input.industry}). Current rating: ${input.currentRating ?? 'Unknown'}/5 with ${input.reviewCount ?? 'Unknown'} reviews.`
          }
        ],
        response_format: { type: "json_object" },
      });
      const content = typeof response.choices[0]?.message?.content === 'string' ? response.choices[0].message.content : '{}';
      try { return JSON.parse(content); } catch { return { strategy: { overview: "Unable to generate strategy", steps: [] }, followUpTemplates: [], reviewPrompts: [], negativeReviewResponse: "", expectedImpact: {} }; }
    }),
  }),

  // ============= LEAD GENERATOR =============
  leads: router({
    generate: protectedProcedure.input(z.object({
      niche: z.string().min(1),
      location: z.string().min(1),
      radius: z.number().optional(),
      minRating: z.number().optional(),
      maxRating: z.number().optional(),
      filters: z.object({
        noWebsite: z.boolean().optional(),
        lowReviews: z.boolean().optional(),
        noPhotos: z.boolean().optional(),
        noHours: z.boolean().optional(),
      }).optional(),
    })).mutation(async ({ input }) => {
      const searchResult = await makeRequest<any>("/maps/api/place/textsearch/json", {
        query: `${input.niche} in ${input.location}`,
      });

      const leads = [];
      for (const place of (searchResult.results || []).slice(0, 50)) {
        try {
          const details = await makeRequest<any>("/maps/api/place/details/json", {
            place_id: place.place_id,
            fields: "name,rating,user_ratings_total,website,formatted_address,formatted_phone_number,opening_hours,types,photos,business_status,email",
          });
          const biz = details.result || place;

          // Apply filters
          if (input.filters?.noWebsite && biz.website) continue;
          if (input.filters?.lowReviews && (biz.user_ratings_total ?? 0) >= 10) continue;
          if (input.filters?.noPhotos && biz.photos && biz.photos.length > 0) continue;
          if (input.filters?.noHours && biz.opening_hours) continue;
          if (input.minRating && (biz.rating ?? 0) < input.minRating) continue;
          if (input.maxRating && (biz.rating ?? 5) > input.maxRating) continue;

          let opportunityScore = 0;
          if (!biz.website) opportunityScore += 30;
          if ((biz.user_ratings_total ?? 0) < 10) opportunityScore += 25;
          if (!biz.photos || biz.photos.length < 3) opportunityScore += 20;
          if (!biz.opening_hours) opportunityScore += 15;
          if ((biz.rating ?? 5) < 4.0) opportunityScore += 10;

          leads.push({
            name: biz.name,
            address: biz.formatted_address,
            rating: biz.rating,
            reviewCount: biz.user_ratings_total,
            website: biz.website,
            phone: biz.formatted_phone_number,
            email: biz.email,
            hasHours: !!biz.opening_hours,
            photoCount: biz.photos?.length ?? 0,
            placeId: place.place_id,
            opportunityScore: Math.min(100, opportunityScore),
            opportunityLevel: opportunityScore >= 60 ? "High" : opportunityScore >= 30 ? "Medium" : "Low",
          });
        } catch {
          leads.push({
            name: place.name,
            address: place.formatted_address,
            rating: place.rating,
            reviewCount: place.user_ratings_total,
            placeId: place.place_id,
            opportunityScore: 50,
            opportunityLevel: "Medium",
          });
        }
      }

      leads.sort((a, b) => b.opportunityScore - a.opportunityScore);
      return { leads };
    }),

    analyzeWithAI: protectedProcedure.input(z.object({
      leadData: z.any(),
      niche: z.string(),
    })).mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an expert lead analyst. Analyze this business lead and identify specific opportunities for improvement. Respond in JSON:
{
  "opportunitySummary": "string - 1-2 sentence summary of why this is a good lead",
  "painPoints": ["string - specific issues this business has"],
  "estimatedValue": number - estimated monthly revenue potential from targeting this lead,
  "outreachAngle": "string - personalized pitch angle"
}`
          },
          {
            role: "user",
            content: `Analyze this ${input.niche} business lead:\n\n${JSON.stringify(input.leadData)}`
          }
        ],
        response_format: { type: "json_object" },
      });

      const content = typeof response.choices[0]?.message?.content === 'string' ? response.choices[0].message.content : '{}';
      try { return JSON.parse(content); } catch { return { opportunitySummary: "Opportunity identified", painPoints: [], estimatedValue: 0, outreachAngle: "" }; }
    }),

    export: protectedProcedure.input(z.object({
      leads: z.array(z.any()),
      aiAnalysis: z.record(z.string(), z.any()).optional(),
      format: z.enum(["csv", "excel", "pdf"]),
      niche: z.string(),
      location: z.string(),
    })).mutation(async ({ input }) => {
      // For now, return a simulated download URL
      // In production, generate the actual file and upload to S3
      const filename = `leads_${input.niche.replace(/\s+/g, '_')}_${Date.now()}.${input.format}`;
      const downloadUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(
        `Name,Address,Rating,Reviews,Phone,Website,Opportunity Score,Opportunity Level\n` +
        input.leads.map(l => `"${l.name}","${l.address}",${l.rating ?? 'N/A'},${l.reviewCount ?? 0},"${l.phone ?? ''}","${l.website ?? ''}",${l.opportunityScore},${l.opportunityLevel}`).join('\n')
      )}`;
      return { filename, downloadUrl };
    }),
  }),

  // ============= REVENUE & GROWTH =============
  revenueGrowth: router({
    getStrategies: protectedProcedure.input(z.object({
      companyProfileId: z.number(),
    })).mutation(async ({ ctx, input }) => {
      const profile = await getCompanyProfileById(input.companyProfileId);
      if (!profile || profile.userId !== ctx.user.id) throw new TRPCError({ code: "NOT_FOUND", message: "Company not found" });

      // Get audit data if available
      const audit = await getAuditByCompanyProfile(input.companyProfileId);

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an expert business growth strategist and SaaS advisor. Analyze the business and provide comprehensive revenue & growth strategies across all business sections. Include specific software and SaaS tool recommendations with pricing tiers.

Respond in JSON with this exact structure:
{
  "overallStrategy": {
    "summary": "string - 2-3 sentence executive summary",
    "estimatedRevenueIncrease": "string - e.g. 25-40%",
    "timelineMonths": number,
    "priorityLevel": "high" | "medium" | "low"
  },
  "sections": [
    {
      "id": "string - unique section id like marketing, operations, etc",
      "title": "string - section name",
      "icon": "string - one of: marketing, operations, retention, leadgen, pricing, techstack, automation, analytics",
      "currentGap": "string - what's missing or underperforming",
      "strategy": "string - detailed strategy explanation (2-3 paragraphs)",
      "actionSteps": ["string - specific action item"],
      "expectedImpact": {
        "revenueImpact": "string - e.g. +$2,000/mo",
        "timeToResult": "string - e.g. 2-4 weeks",
        "difficulty": "easy" | "medium" | "hard"
      },
      "recommendedTools": [
        {
          "name": "string - tool name",
          "category": "string - e.g. CRM, Email Marketing, SEO, Analytics",
          "description": "string - what it does and why it helps",
          "pricing": "string - e.g. Free tier / $29/mo Pro",
          "website": "string - URL",
          "whyRecommended": "string - specific reason for this business"
        }
      ]
    }
  ],
  "saasStack": {
    "essential": [
      {
        "name": "string",
        "category": "string",
        "monthlyCost": "string",
        "description": "string",
        "website": "string"
      }
    ],
    "growth": [
      {
        "name": "string",
        "category": "string",
        "monthlyCost": "string",
        "description": "string",
        "website": "string"
      }
    ],
    "enterprise": [
      {
        "name": "string",
        "category": "string",
        "monthlyCost": "string",
        "description": "string",
        "website": "string"
      }
    ],
    "totalMonthlyCostEssential": "string",
    "totalMonthlyCostGrowth": "string",
    "totalMonthlyCostEnterprise": "string"
  },
  "quickWins": [
    {
      "action": "string",
      "impact": "string",
      "effort": "low" | "medium" | "high",
      "timeline": "string"
    }
  ]
}

Provide at least 6 sections covering: Marketing & Advertising, Operations & Workflow, Customer Retention, Lead Generation, Pricing Strategy, Tech Stack & Automation, Analytics & Reporting, and AI Integration. For each section recommend 2-4 specific SaaS tools. Include both free and paid options. Be specific to the business industry and location.`
          },
          {
            role: "user",
            content: `Generate a comprehensive Revenue & Growth strategy for this business:

Business: ${profile.businessName}
Industry: ${profile.industry}
Location: ${profile.location}
Description: ${profile.description || "Not provided"}
Services: ${(profile.services as string[])?.join(", ") || "Not specified"}
Website: ${profile.website || "None"}
Growth Goal: ${profile.growthGoal || "General growth"}
Avg Lead Value: $${profile.avgLeadValue || 150}
${audit ? `\nAudit Data:\n- Overall Score: ${audit.overallScore ?? "N/A"}/100\n- AI Visibility: ${audit.aiVisibilityScore ?? "N/A"}/100\n- Maps Presence: ${audit.mapsPresenceScore ?? "N/A"}/100\n- Review Score: ${audit.reviewScore ?? "N/A"}/100\n- Estimated Monthly Loss: $${audit.estimatedMonthlyLoss ?? "N/A"}\n- Rating: ${(audit.businessData as any)?.rating ?? "N/A"}\n- Reviews: ${(audit.businessData as any)?.reviewCount ?? "N/A"}` : "No audit data available yet."}`
          }
        ],
        response_format: { type: "json_object" },
      });

      const content = typeof response.choices[0]?.message?.content === "string" ? response.choices[0].message.content : "{}";
      try {
        return JSON.parse(content);
      } catch {
        return {
          overallStrategy: { summary: "Unable to generate strategy. Please try again.", estimatedRevenueIncrease: "N/A", timelineMonths: 0, priorityLevel: "medium" },
          sections: [],
          saasStack: { essential: [], growth: [], enterprise: [], totalMonthlyCostEssential: "$0", totalMonthlyCostGrowth: "$0", totalMonthlyCostEnterprise: "$0" },
          quickWins: [],
        };
      }
    }),

    getSaasSuggestions: protectedProcedure.input(z.object({
      industry: z.string(),
      businessSize: z.enum(["solo", "small", "medium", "large"]).optional(),
      budget: z.enum(["free", "low", "medium", "high"]).optional(),
      focusArea: z.enum(["marketing", "operations", "sales", "analytics", "automation", "all"]).optional(),
    })).mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a SaaS and software expert. Recommend the best software tools for the given business type. Respond in JSON:
{
  "recommendations": [
    {
      "name": "string",
      "category": "string",
      "description": "string - 1-2 sentences",
      "pricing": "string",
      "website": "string",
      "rating": number,
      "bestFor": "string",
      "alternatives": ["string"]
    }
  ],
  "totalMonthlyEstimate": "string",
  "roiEstimate": "string"
}

Include 10-15 tools across categories: CRM, Email Marketing, SEO, Social Media, Accounting, Project Management, AI Tools, Analytics, Customer Support, Scheduling. Mix free and paid options.`
          },
          {
            role: "user",
            content: `Recommend software/SaaS tools for a ${input.industry} business. Size: ${input.businessSize || "small"}. Budget: ${input.budget || "medium"}. Focus: ${input.focusArea || "all"}.`
          }
        ],
        response_format: { type: "json_object" },
      });

      const content = typeof response.choices[0]?.message?.content === "string" ? response.choices[0].message.content : "{}";
      try { return JSON.parse(content); } catch { return { recommendations: [], totalMonthlyEstimate: "$0", roiEstimate: "N/A" }; }
    }),
  }),

  // ============= AI AD CREATOR =============
  adCreator: router({
    generateAds: protectedProcedure.input(z.object({
      companyProfileId: z.number(),
      adGoal: z.enum(["awareness", "traffic", "leads", "sales", "engagement"]).optional(),
      tone: z.enum(["professional", "casual", "urgent", "luxury", "friendly", "bold"]).optional(),
      budget: z.enum(["low", "medium", "high"]).optional(),
    })).mutation(async ({ ctx, input }) => {
      const profile = await getCompanyProfileById(input.companyProfileId);
      if (!profile || profile.userId !== ctx.user.id) throw new TRPCError({ code: "NOT_FOUND", message: "Company not found" });

      const audit = await getAuditByCompanyProfile(input.companyProfileId);

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a world-class advertising copywriter and social media strategist. Create COMPLETE, ready-to-copy-paste ad content for EVERY major platform plus AI/LLM-optimized content. Each ad must be tailored to the platform's best practices, character limits, and audience behavior.

Respond in JSON:
{
  "businessSummary": {
    "name": "string",
    "uniqueSellingPoints": ["string"],
    "targetAudience": "string",
    "brandVoice": "string"
  },
  "platforms": {
    "facebook": {
      "score": number,
      "ads": [
        {
          "type": "string - feed_post | story | carousel | reel",
          "headline": "string - max 40 chars",
          "primaryText": "string - the main ad copy, 125-250 chars optimal",
          "description": "string - link description 30 chars",
          "callToAction": "string - e.g. Learn More, Book Now, Shop Now",
          "hashtags": ["string"],
          "imagePrompt": "string - AI image generation prompt for the ad visual",
          "targetingTips": "string",
          "bestTimeToPost": "string",
          "estimatedReach": "string",
          "charCount": number
        }
      ]
    },
    "instagram": {
      "score": number,
      "ads": [
        {
          "type": "string - feed | story | reel | carousel",
          "caption": "string - full caption with emojis and line breaks",
          "headline": "string - for story/reel overlay",
          "hashtags": ["string - 20-30 relevant hashtags"],
          "callToAction": "string",
          "imagePrompt": "string",
          "reelScript": "string - if reel type, full script with timing",
          "bestTimeToPost": "string",
          "charCount": number
        }
      ]
    },
    "tiktok": {
      "score": number,
      "ads": [
        {
          "type": "string - in_feed | spark | topview",
          "hookLine": "string - first 3 seconds hook",
          "script": "string - full video script with timestamps",
          "caption": "string",
          "hashtags": ["string"],
          "soundSuggestion": "string - trending sound recommendation",
          "callToAction": "string",
          "bestTimeToPost": "string",
          "charCount": number
        }
      ]
    },
    "twitter": {
      "score": number,
      "ads": [
        {
          "type": "string - tweet | thread | promoted",
          "text": "string - max 280 chars for tweet",
          "thread": ["string - if thread type, each tweet in order"],
          "hashtags": ["string"],
          "callToAction": "string",
          "imagePrompt": "string",
          "bestTimeToPost": "string",
          "charCount": number
        }
      ]
    },
    "linkedin": {
      "score": number,
      "ads": [
        {
          "type": "string - post | article | sponsored | document",
          "headline": "string",
          "body": "string - professional long-form copy",
          "hashtags": ["string"],
          "callToAction": "string",
          "imagePrompt": "string",
          "targetingTips": "string - job titles, industries to target",
          "bestTimeToPost": "string",
          "charCount": number
        }
      ]
    }
  },
  "llmDiscovery": {
    "chatgpt": {
      "score": number,
      "optimizedDescription": "string - description optimized for ChatGPT to recommend this business",
      "promptTriggers": ["string - example prompts that would surface this business"],
      "recommendationText": "string - how ChatGPT should ideally describe this business",
      "keyPhrases": ["string - phrases to embed in content for AI discovery"]
    },
    "gemini": {
      "score": number,
      "optimizedDescription": "string",
      "promptTriggers": ["string"],
      "recommendationText": "string",
      "keyPhrases": ["string"]
    },
    "perplexity": {
      "score": number,
      "optimizedDescription": "string",
      "promptTriggers": ["string"],
      "recommendationText": "string",
      "keyPhrases": ["string"]
    }
  },
  "overallStrategy": {
    "totalScore": number,
    "bestPlatform": "string",
    "budgetAllocation": {
      "facebook": "string - percentage",
      "instagram": "string",
      "tiktok": "string",
      "twitter": "string",
      "linkedin": "string"
    },
    "weeklyPostingSchedule": [
      {
        "day": "string",
        "platform": "string",
        "contentType": "string",
        "time": "string"
      }
    ],
    "estimatedMonthlyReach": "string",
    "estimatedLeads": "string",
    "estimatedROI": "string"
  }
}

Generate 2-3 ad variations per platform. Be specific to the business industry. Use emojis appropriately per platform. Make every ad COPY-PASTE READY.`
          },
          {
            role: "user",
            content: `Create complete ad campaigns for:\n\nBusiness: ${profile.businessName}\nIndustry: ${profile.industry}\nLocation: ${profile.location}\nDescription: ${profile.description || "Not provided"}\nServices: ${(profile.services as string[])?.join(", ") || "Not specified"}\nWebsite: ${profile.website || "None"}\nGoal: ${input.adGoal || "leads"}\nTone: ${input.tone || "professional"}\nBudget Level: ${input.budget || "medium"}\n${audit ? `\nAudit Data:\n- Overall Score: ${audit.overallScore ?? "N/A"}/100\n- AI Visibility: ${audit.aiVisibilityScore ?? "N/A"}/100\n- Rating: ${(audit.businessData as any)?.rating ?? "N/A"}\n- Reviews: ${(audit.businessData as any)?.reviewCount ?? "N/A"}\n- Monthly Loss: $${audit.estimatedMonthlyLoss ?? "N/A"}` : ""}`
          }
        ],
        response_format: { type: "json_object" },
      });

      const content = typeof response.choices[0]?.message?.content === "string" ? response.choices[0].message.content : "{}";
      try {
        return JSON.parse(content);
      } catch {
        return {
          businessSummary: { name: profile.businessName, uniqueSellingPoints: [], targetAudience: "", brandVoice: "" },
          platforms: { facebook: { score: 0, ads: [] }, instagram: { score: 0, ads: [] }, tiktok: { score: 0, ads: [] }, twitter: { score: 0, ads: [] }, linkedin: { score: 0, ads: [] } },
          llmDiscovery: { chatgpt: { score: 0, optimizedDescription: "", promptTriggers: [], recommendationText: "", keyPhrases: [] }, gemini: { score: 0, optimizedDescription: "", promptTriggers: [], recommendationText: "", keyPhrases: [] }, perplexity: { score: 0, optimizedDescription: "", promptTriggers: [], recommendationText: "", keyPhrases: [] } },
          overallStrategy: { totalScore: 0, bestPlatform: "", budgetAllocation: {}, weeklyPostingSchedule: [], estimatedMonthlyReach: "N/A", estimatedLeads: "N/A", estimatedROI: "N/A" },
        };
      }
    }),
  }),

  // ============= GOOGLE RANK OPTIMIZER =============
  googleRank: router({
    // Deep research: analyze what Google wants for this business
    deepResearch: protectedProcedure.input(z.object({
      companyProfileId: z.number(),
    })).mutation(async ({ ctx, input }) => {
      const profile = await getCompanyProfileById(input.companyProfileId);
      if (!profile || profile.userId !== ctx.user.id) throw new TRPCError({ code: "NOT_FOUND", message: "Company not found" });

      const audit = await getAuditByCompanyProfile(input.companyProfileId);

      // Step 1: Google Maps data pull
      let mapsData: any = {};
      let competitors: any[] = [];
      try {
        const searchResult = await makeRequest<any>("/maps/api/place/textsearch/json", {
          query: `${profile.businessName} ${profile.location}`,
        });
        if (searchResult.results?.[0]) {
          const details = await makeRequest<any>("/maps/api/place/details/json", {
            place_id: searchResult.results[0].place_id,
            fields: "name,rating,user_ratings_total,reviews,opening_hours,website,formatted_phone_number,formatted_address,geometry,types,photos,business_status,url",
          });
          mapsData = details.result || {};
        }
        // Get top competitors
        const compSearch = await makeRequest<any>("/maps/api/place/textsearch/json", {
          query: `best ${profile.industry} in ${profile.location}`,
        });
        for (const comp of (compSearch.results || []).slice(0, 5)) {
          try {
            const cd = await makeRequest<any>("/maps/api/place/details/json", {
              place_id: comp.place_id,
              fields: "name,rating,user_ratings_total,website,formatted_address,opening_hours,photos,types",
            });
            competitors.push(cd.result || comp);
          } catch { competitors.push(comp); }
        }
      } catch (err) {
        console.error("[GoogleRank] Maps data pull failed:", err);
      }

      // Step 2: Deep AI research on what Google wants
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a world-class Google Search and Local SEO expert. Perform a DEEP analysis of what Google requires for this business to rank #1 in local search results. Research every ranking factor.

Respond in JSON:
{
  "researchSummary": {
    "currentRankingEstimate": "string - estimated current position",
    "targetPosition": "#1 in local pack",
    "competitiveDifficulty": "easy" | "medium" | "hard" | "very_hard",
    "estimatedTimeToRank": "string - e.g. 3-6 months",
    "overallReadinessScore": number
  },
  "googleRankingFactors": [
    {
      "factor": "string - ranking factor name",
      "weight": "critical" | "high" | "medium" | "low",
      "currentStatus": "pass" | "fail" | "needs_improvement",
      "currentScore": number,
      "targetScore": number,
      "details": "string - specific analysis",
      "fixRequired": boolean
    }
  ],
  "localSeoAnalysis": {
    "napConsistency": { "status": "string", "issues": ["string"], "fix": "string" },
    "googleBusinessProfile": { "completeness": number, "missingFields": ["string"], "optimizations": ["string"] },
    "localCitations": { "estimatedCount": number, "recommendedDirectories": ["string"], "priority": "string" },
    "reviewStrategy": { "currentRating": number, "currentCount": number, "targetRating": number, "targetCount": number, "strategy": "string" },
    "localKeywords": [{ "keyword": "string", "searchVolume": "string", "difficulty": "string", "currentRanking": "string" }]
  },
  "technicalSeo": {
    "schemaMarkup": { "needed": ["string - schema type"], "jsonLd": "string - complete JSON-LD code" },
    "metaTags": { "title": "string - optimized title tag", "description": "string - optimized meta description", "keywords": ["string"] },
    "siteSpeed": { "recommendations": ["string"] },
    "mobileOptimization": { "recommendations": ["string"] },
    "coreWebVitals": { "recommendations": ["string"] }
  },
  "contentStrategy": {
    "optimizedBusinessDescription": "string - fully rewritten for Google",
    "servicePageTitles": ["string - optimized page titles"],
    "blogTopics": [{ "title": "string", "targetKeyword": "string", "estimatedTraffic": "string" }],
    "faqContent": [{ "question": "string", "answer": "string" }]
  },
  "competitorInsights": [
    {
      "name": "string",
      "strengths": ["string"],
      "weaknesses": ["string"],
      "whatToCopy": "string",
      "whatToAvoid": "string"
    }
  ],
  "autoFixPlan": [
    {
      "id": "string",
      "priority": number,
      "category": "string - gbp | seo | content | technical | reviews | citations",
      "title": "string",
      "description": "string",
      "effort": "auto" | "manual" | "semi-auto",
      "impact": "critical" | "high" | "medium" | "low",
      "estimatedTime": "string",
      "status": "pending"
    }
  ]
}`
          },
          {
            role: "user",
            content: `Perform deep Google ranking research for:\n\nBusiness: ${profile.businessName}\nIndustry: ${profile.industry}\nLocation: ${profile.location}\nDescription: ${profile.description || "Not provided"}\nServices: ${(profile.services as string[])?.join(", ") || "Not specified"}\nWebsite: ${profile.website || "None"}\n\nGoogle Maps Data:\n- Rating: ${mapsData.rating ?? "N/A"}/5\n- Reviews: ${mapsData.user_ratings_total ?? 0}\n- Has Website: ${!!mapsData.website}\n- Has Hours: ${!!mapsData.opening_hours}\n- Has Phone: ${!!mapsData.formatted_phone_number}\n- Photos: ${mapsData.photos?.length ?? 0}\n- Business Status: ${mapsData.business_status ?? "Unknown"}\n- Address: ${mapsData.formatted_address ?? profile.location}\n\nTop 5 Competitors:\n${competitors.map((c, i) => `${i + 1}. ${c.name} - Rating: ${c.rating ?? "N/A"}/5, Reviews: ${c.user_ratings_total ?? 0}, Website: ${c.website ? "Yes" : "No"}, Photos: ${c.photos?.length ?? 0}`).join("\n")}\n${audit ? `\nExisting Audit Scores:\n- Overall: ${audit.overallScore ?? "N/A"}/100\n- AI Visibility: ${audit.aiVisibilityScore ?? "N/A"}/100\n- Maps Presence: ${audit.mapsPresenceScore ?? "N/A"}/100\n- Monthly Loss: $${audit.estimatedMonthlyLoss ?? "N/A"}` : ""}`
          }
        ],
        response_format: { type: "json_object" },
      });

      const content = typeof response.choices[0]?.message?.content === "string" ? response.choices[0].message.content : "{}";
      try {
        const parsed = JSON.parse(content);
        return { ...parsed, mapsData, competitors };
      } catch {
        return {
          researchSummary: { currentRankingEstimate: "Unknown", targetPosition: "#1", competitiveDifficulty: "medium", estimatedTimeToRank: "3-6 months", overallReadinessScore: 0 },
          googleRankingFactors: [],
          localSeoAnalysis: { napConsistency: { status: "Unknown", issues: [], fix: "" }, googleBusinessProfile: { completeness: 0, missingFields: [], optimizations: [] }, localCitations: { estimatedCount: 0, recommendedDirectories: [], priority: "" }, reviewStrategy: { currentRating: 0, currentCount: 0, targetRating: 0, targetCount: 0, strategy: "" }, localKeywords: [] },
          technicalSeo: { schemaMarkup: { needed: [], jsonLd: "" }, metaTags: { title: "", description: "", keywords: [] }, siteSpeed: { recommendations: [] }, mobileOptimization: { recommendations: [] }, coreWebVitals: { recommendations: [] } },
          contentStrategy: { optimizedBusinessDescription: "", servicePageTitles: [], blogTopics: [], faqContent: [] },
          competitorInsights: [],
          autoFixPlan: [],
          mapsData,
          competitors,
        };
      }
    }),

    // Auto-fix: AI Agent executes all fixes
    autoFix: protectedProcedure.input(z.object({
      companyProfileId: z.number(),
      fixId: z.string(),
      researchData: z.any(),
    })).mutation(async ({ ctx, input }) => {
      const profile = await getCompanyProfileById(input.companyProfileId);
      if (!profile || profile.userId !== ctx.user.id) throw new TRPCError({ code: "NOT_FOUND", message: "Company not found" });

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an AI Agent executing a Google ranking fix. Generate the COMPLETE implementation for this fix. Include all code, content, and step-by-step instructions that can be directly applied.\n\nRespond in JSON:\n{\n  "fixId": "string",\n  "status": "completed",\n  "implementedChanges": [\n    {\n      "type": "string - content | code | configuration | action",\n      "title": "string",\n      "before": "string - what it was",\n      "after": "string - what it is now",\n      "code": "string - any code generated (HTML, JSON-LD, etc)",\n      "instructions": "string - how to apply if manual step needed"\n    }\n  ],\n  "generatedContent": {\n    "optimizedDescription": "string - if applicable",\n    "schemaMarkup": "string - JSON-LD if applicable",\n    "metaTags": "string - HTML meta tags if applicable",\n    "reviewTemplates": ["string"],\n    "socialPosts": ["string"],\n    "emailTemplates": ["string"]\n  },\n  "verificationSteps": ["string - how to verify the fix worked"],\n  "expectedImpact": {\n    "rankingImprovement": "string",\n    "timeToSeeResults": "string",\n    "trafficIncrease": "string"\n  }\n}`
          },
          {
            role: "user",
            content: `Execute this fix for ${profile.businessName} (${profile.industry} in ${profile.location}):\n\nFix ID: ${input.fixId}\nResearch context: ${JSON.stringify(input.researchData).slice(0, 3000)}`
          }
        ],
        response_format: { type: "json_object" },
      });

      const content = typeof response.choices[0]?.message?.content === "string" ? response.choices[0].message.content : "{}";
      try { return JSON.parse(content); } catch { return { fixId: input.fixId, status: "failed", implementedChanges: [], generatedContent: {}, verificationSteps: [], expectedImpact: {} }; }
    }),

    // Auto-fix ALL: Execute all pending fixes at once
    autoFixAll: protectedProcedure.input(z.object({
      companyProfileId: z.number(),
      researchData: z.any(),
    })).mutation(async ({ ctx, input }) => {
      const profile = await getCompanyProfileById(input.companyProfileId);
      if (!profile || profile.userId !== ctx.user.id) throw new TRPCError({ code: "NOT_FOUND", message: "Company not found" });

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an elite AI Agent executing ALL Google ranking fixes for a business. Generate COMPLETE implementations for every fix in the plan. Be thorough and specific.\n\nRespond in JSON:\n{\n  "totalFixesApplied": number,\n  "overallStatus": "completed" | "partial",\n  "fixes": [\n    {\n      "fixId": "string",\n      "title": "string",\n      "category": "string",\n      "status": "completed" | "failed",\n      "changes": [\n        {\n          "type": "string",\n          "title": "string",\n          "before": "string",\n          "after": "string",\n          "code": "string"\n        }\n      ]\n    }\n  ],\n  "generatedAssets": {\n    "optimizedDescription": "string",\n    "schemaMarkupJsonLd": "string - complete JSON-LD code",\n    "metaTitle": "string",\n    "metaDescription": "string",\n    "targetKeywords": ["string"],\n    "reviewRequestTemplates": [{ "channel": "string", "template": "string" }],\n    "socialMediaPosts": [{ "platform": "string", "content": "string" }],\n    "faqContent": [{ "question": "string", "answer": "string" }],\n    "blogOutlines": [{ "title": "string", "outline": "string", "targetKeyword": "string" }],\n    "citationDirectories": [{ "name": "string", "url": "string", "priority": "string" }]\n  },\n  "implementationReport": {\n    "summary": "string",\n    "estimatedRankImprovement": "string",\n    "estimatedTrafficIncrease": "string",\n    "estimatedRevenueImpact": "string",\n    "nextSteps": ["string"],\n    "timelineToResults": "string"\n  }\n}`
          },
          {
            role: "user",
            content: `Execute ALL Google ranking fixes for:\n\nBusiness: ${profile.businessName}\nIndustry: ${profile.industry}\nLocation: ${profile.location}\nDescription: ${profile.description || "Not provided"}\nServices: ${(profile.services as string[])?.join(", ") || "Not specified"}\nWebsite: ${profile.website || "None"}\n\nFull research data and fix plan:\n${JSON.stringify(input.researchData).slice(0, 4000)}`
          }
        ],
        response_format: { type: "json_object" },
      });

      const content = typeof response.choices[0]?.message?.content === "string" ? response.choices[0].message.content : "{}";
      try { return JSON.parse(content); } catch { return { totalFixesApplied: 0, overallStatus: "failed", fixes: [], generatedAssets: {}, implementationReport: { summary: "Fix execution failed. Please try again.", estimatedRankImprovement: "N/A", estimatedTrafficIncrease: "N/A", estimatedRevenueImpact: "N/A", nextSteps: [], timelineToResults: "N/A" } }; }
    }),
  }),

  // ============= SHOPIFY STORE OPTIMIZER (Add-on) =============
  shopify: router({
    audit: protectedProcedure.input(z.object({
      storeUrl: z.string().min(3),
      shopifyApiKey: z.string().optional(),
      shopifyApiSecret: z.string().optional(),
      accessToken: z.string().optional(),
      dryRun: z.boolean().default(true),
      autoFixSeo: z.boolean().default(false),
      autoFixContent: z.boolean().default(false),
      autoFixTheme: z.boolean().default(false),
    })).mutation(async ({ ctx, input }) => {
      const hasApiAccess = !!(input.accessToken && input.shopifyApiKey);
      const autoFixEnabled = hasApiAccess && !input.dryRun && (input.autoFixSeo || input.autoFixContent || input.autoFixTheme);

      const systemPrompt = `You are an expert Shopify store optimizer and e-commerce consultant working for Lux Automaton.
You specialize in Shopify SEO, AEO (AI Engine Optimization), CRO (Conversion Rate Optimization), UX, performance, trust signals, and AI visibility.

Analyze the Shopify store and return a comprehensive JSON optimization plan.

For each issue found, provide:
- category: "seo" | "aeo" | "cro" | "ux" | "performance" | "trust" | "content" | "schema" | "images" | "pricing"
- severity: "critical" | "high" | "medium" | "low"
- title: Short issue title
- description: Detailed explanation of the problem
- impact: Business impact description
- manualFix: Step-by-step instructions to fix manually in Shopify admin (exact menu paths like "Online Store → Themes → Edit Code → theme.liquid")
- autoFixable: boolean - whether this can be auto-fixed via Shopify Admin API
- autoFixAction: If autoFixable, describe the API mutation needed
- estimatedTimeToFix: e.g. "5 minutes", "30 minutes", "2 hours"
- priorityScore: 1-100 (100 = most urgent)

Also provide:
- overallScore: 0-100 store health score
- seoScore, aeoScore, croScore, uxScore, performanceScore, trustScore: individual 0-100 scores
- topRecommendations: Top 5 highest-impact actions
- competitorInsights: How similar stores rank in AI platforms
- aiVisibilityAnalysis: How well products appear in ChatGPT, Gemini, Perplexity shopping results
- schemaMarkupSuggestions: Specific JSON-LD schema to add
- metaTagOptimizations: Exact meta title/description rewrites for key pages
- productDescriptionRewrites: AI-optimized product descriptions (top 5 products)
- googleMerchantCenterTips: Steps to optimize for Google Shopping + Gemini Shopping
- estimatedRevenueImpact: Projected revenue increase from implementing all fixes`;

      const userPrompt = `Analyze this Shopify store: ${input.storeUrl}

Store has API access: ${hasApiAccess ? "YES - can auto-fix" : "NO - manual instructions only"}
Auto-fix mode: ${autoFixEnabled ? "ENABLED" : "DISABLED (dry run)"}
${autoFixEnabled ? `Auto-fix categories: ${[input.autoFixSeo && "SEO", input.autoFixContent && "Content", input.autoFixTheme && "Theme/UX"].filter(Boolean).join(", ")}` : ""}

Provide a complete optimization plan in JSON format. Be extremely specific with Shopify admin paths and exact code snippets where needed.
For schema markup, provide complete JSON-LD blocks ready to paste.
For meta tags, provide exact character-counted titles (≤60 chars) and descriptions (≤160 chars).
For product descriptions, write full SEO-optimized descriptions with keywords naturally integrated.`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "shopify_optimization_plan",
            strict: true,
            schema: {
              type: "object",
              properties: {
                overallScore: { type: "number", description: "Overall store health 0-100" },
                seoScore: { type: "number" },
                aeoScore: { type: "number" },
                croScore: { type: "number" },
                uxScore: { type: "number" },
                performanceScore: { type: "number" },
                trustScore: { type: "number" },
                issues: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category: { type: "string" },
                      severity: { type: "string" },
                      title: { type: "string" },
                      description: { type: "string" },
                      impact: { type: "string" },
                      manualFix: { type: "string" },
                      autoFixable: { type: "boolean" },
                      autoFixAction: { type: "string" },
                      estimatedTimeToFix: { type: "string" },
                      priorityScore: { type: "number" },
                    },
                    required: ["category", "severity", "title", "description", "impact", "manualFix", "autoFixable", "autoFixAction", "estimatedTimeToFix", "priorityScore"],
                    additionalProperties: false,
                  },
                },
                topRecommendations: { type: "array", items: { type: "string" } },
                competitorInsights: { type: "string" },
                aiVisibilityAnalysis: { type: "string" },
                schemaMarkupSuggestions: { type: "string" },
                metaTagOptimizations: { type: "string" },
                productDescriptionRewrites: { type: "string" },
                googleMerchantCenterTips: { type: "string" },
                estimatedRevenueImpact: { type: "string" },
              },
              required: ["overallScore", "seoScore", "aeoScore", "croScore", "uxScore", "performanceScore", "trustScore", "issues", "topRecommendations", "competitorInsights", "aiVisibilityAnalysis", "schemaMarkupSuggestions", "metaTagOptimizations", "productDescriptionRewrites", "googleMerchantCenterTips", "estimatedRevenueImpact"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = typeof response.choices[0]?.message?.content === "string" ? response.choices[0].message.content : "{}";
      try {
        const plan = JSON.parse(content);
        return { ...plan, hasApiAccess, autoFixEnabled, dryRun: input.dryRun, storeUrl: input.storeUrl };
      } catch {
        return {
          overallScore: 0, seoScore: 0, aeoScore: 0, croScore: 0, uxScore: 0, performanceScore: 0, trustScore: 0,
          issues: [], topRecommendations: [], competitorInsights: "", aiVisibilityAnalysis: "",
          schemaMarkupSuggestions: "", metaTagOptimizations: "", productDescriptionRewrites: "",
          googleMerchantCenterTips: "", estimatedRevenueImpact: "",
          hasApiAccess, autoFixEnabled, dryRun: input.dryRun, storeUrl: input.storeUrl,
        };
      }
    }),
  }),

  // ============= ADMIN (luxautomaton@gmail.com only) =============
  // ============= SUPPORT TICKETS =============
  support: router({
    create: protectedProcedure.input(z.object({
      subject: z.string().min(3).max(200),
      description: z.string().min(10).max(5000),
      category: z.enum(["billing", "technical", "audit_issue", "account", "feature_request", "other"]).default("other"),
      priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
    })).mutation(async ({ ctx, input }) => {
      const ticketId = await createSupportTicket({
        userId: ctx.user!.id,
        subject: input.subject,
        description: input.description,
        category: input.category,
        priority: input.priority as any,
        status: "open",
      });
      // AI Agent auto-response
      try {
        const aiResponse = await invokeLLM({
          messages: [
            { role: "system", content: "You are the Lux Automaton AI Support Agent. Provide helpful, professional responses to customer support tickets. Be empathetic and solution-oriented. If you cannot resolve the issue, say you'll escalate to a human agent." },
            { role: "user", content: `Support Ticket: ${input.subject}\n\nCategory: ${input.category}\nPriority: ${input.priority}\n\nDescription: ${input.description}` },
          ],
        });
        const aiMsg = String(aiResponse.choices?.[0]?.message?.content || "Thank you for contacting support. A team member will review your ticket shortly.");
        await addTicketMessage({
          ticketId,
          senderId: null,
          senderType: "ai_agent",
          content: aiMsg,
        });
      } catch (e) {
        await addTicketMessage({
          ticketId,
          senderId: null,
          senderType: "ai_agent",
          content: "Thank you for contacting Lux Automaton support. Your ticket has been received and our AI agent is reviewing it. We'll get back to you shortly.",
        });
      }
      return { ticketId };
    }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserTickets(ctx.user!.id);
    }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
      const ticket = await getTicketById(input.id);
      if (!ticket) throw new TRPCError({ code: "NOT_FOUND" });
      if (ticket.userId !== ctx.user!.id && ctx.user!.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const messages = await getTicketMessages(input.id);
      return { ticket, messages };
    }),

    reply: protectedProcedure.input(z.object({
      ticketId: z.number(),
      message: z.string().min(1).max(5000),
    })).mutation(async ({ ctx, input }) => {
      const ticket = await getTicketById(input.ticketId);
      if (!ticket) throw new TRPCError({ code: "NOT_FOUND" });
      if (ticket.userId !== ctx.user!.id && ctx.user!.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      await addTicketMessage({
        ticketId: input.ticketId,
        senderId: ctx.user!.id,
        senderType: "user",
        content: input.message,
      });
      // AI auto-reply
      try {
        const allMessages = await getTicketMessages(input.ticketId);
        const history = allMessages.map(m => ({
          role: m.senderType === "user" ? "user" as const : "assistant" as const,
          content: m.content,
        }));
        const aiResponse = await invokeLLM({
          messages: [
            { role: "system", content: "You are the Lux Automaton AI Support Agent. Continue helping the customer with their support ticket. Be helpful, professional, and solution-oriented. If the issue is complex or requires human intervention, acknowledge that and mention you'll escalate." },
            ...history,
            { role: "user", content: input.message },
          ],
        });
        const aiMsg = aiResponse.choices?.[0]?.message?.content;
        if (aiMsg) {
          await addTicketMessage({
            ticketId: input.ticketId,
            senderId: null,
            senderType: "ai_agent",
            content: String(aiMsg),
          });
        }
      } catch (e) { /* AI reply failed, admin will handle */ }
      return { success: true };
    }),

    close: protectedProcedure.input(z.object({ ticketId: z.number() })).mutation(async ({ ctx, input }) => {
      const ticket = await getTicketById(input.ticketId);
      if (!ticket) throw new TRPCError({ code: "NOT_FOUND" });
      if (ticket.userId !== ctx.user!.id && ctx.user!.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      await updateTicket(input.ticketId, { status: "closed" });
      return { success: true };
    }),
  }),

  // ============= PARTNER PROGRAM =============
  partner: router({
    register: protectedProcedure.input(z.object({
      companyName: z.string().min(2),
      website: z.string().optional(),
      description: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      const existing = await getPartnerByUserId(ctx.user!.id);
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "You already have a partner application" });
      const partner = await createPartner({
        userId: ctx.user!.id,
        companyName: input.companyName,
        contactName: ctx.user!.name || "Partner",
        contactEmail: ctx.user!.email || "",
        website: input.website || null,
        description: input.description || null,
        status: "pending",
        commissionRate: 20,
      });
      return partner;
    }),

    me: protectedProcedure.query(async ({ ctx }) => {
      return getPartnerByUserId(ctx.user!.id);
    }),

    dashboard: protectedProcedure.query(async ({ ctx }) => {
      const partner = await getPartnerByUserId(ctx.user!.id);
      if (!partner) throw new TRPCError({ code: "NOT_FOUND", message: "No partner account found" });
      const stats = await getPartnerDashboardStats(partner.id);
      const customers = await getPartnerCustomerDetails(partner.id);
      const payouts = await getPartnerPayouts(partner.id);
      return { partner, stats, customers, payouts };
    }),

    referrals: protectedProcedure.query(async ({ ctx }) => {
      const partner = await getPartnerByUserId(ctx.user!.id);
      if (!partner) return [];
      return getPartnerReferrals(partner.id);
    }),

    commissions: protectedProcedure.query(async ({ ctx }) => {
      const partner = await getPartnerByUserId(ctx.user!.id);
      if (!partner) return [];
      return getPartnerCommissions(partner.id);
    }),
  }),

  admin: router({
    stats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      const [usersCount, auditsCount, purchasesCount, totalRevenue, recentUsers, recentAudits] = await Promise.all([
        getAllUsersCount(),
        getAllAuditsCount(),
        getAllPurchasesCount(),
        getTotalRevenue(),
        getRecentUsers(10),
        getRecentAudits(10),
      ]);
      return { usersCount, auditsCount, purchasesCount, totalRevenue, recentUsers, recentAudits };
    }),

    costCalculator: protectedProcedure.input(z.object({
      auditCount: z.number().min(1),
    })).query(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      const { auditCount } = input;
      // Cost estimates per audit
      const costs = {
        mapsApiCalls: 5, // ~5 Places API calls per audit (search + details + competitors)
        mapsApiCostPerCall: 0.017, // $17 per 1000 calls
        llmCallsPerAudit: 2, // 1 analysis + 1 per fix
        llmCostPerCall: 0.03, // ~$0.03 per LLM call (GPT-4 level)
        storageCostPerAudit: 0.001, // Negligible S3 storage
        firebaseCostPerAuth: 0, // Free tier covers 10k auth/month
        firebaseFirestoreCost: 0.0006, // $0.06 per 100k reads
        bandwidthPerAudit: 0.0001, // Negligible
      };

      const perAuditCost = (
        costs.mapsApiCalls * costs.mapsApiCostPerCall +
        costs.llmCallsPerAudit * costs.llmCostPerCall +
        costs.storageCostPerAudit +
        costs.firebaseFirestoreCost +
        costs.bandwidthPerAudit
      );

      const totalCost = perAuditCost * auditCount;
      const avgRevenuePerAudit = 750; // Average between $500-$1000
      const totalRevenue = avgRevenuePerAudit * auditCount;
      const profit = totalRevenue - totalCost;
      const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

      // Lead generator costs
      const leadGenCostPerSearch = costs.mapsApiCalls * costs.mapsApiCostPerCall + costs.llmCallsPerAudit * costs.llmCostPerCall;

      return {
        perAuditCost: Math.round(perAuditCost * 1000) / 1000,
        totalCost: Math.round(totalCost * 100) / 100,
        totalRevenue,
        profit: Math.round(profit * 100) / 100,
        profitMargin: Math.round(profitMargin * 10) / 10,
        breakdown: {
          mapsApi: Math.round(costs.mapsApiCalls * costs.mapsApiCostPerCall * auditCount * 100) / 100,
          llmCalls: Math.round(costs.llmCallsPerAudit * costs.llmCostPerCall * auditCount * 100) / 100,
          storage: Math.round(costs.storageCostPerAudit * auditCount * 100) / 100,
          firebase: Math.round((costs.firebaseCostPerAuth + costs.firebaseFirestoreCost) * auditCount * 100) / 100,
          bandwidth: Math.round(costs.bandwidthPerAudit * auditCount * 100) / 100,
        },
        leadGenCostPerSearch: Math.round(leadGenCostPerSearch * 1000) / 1000,
        estimates: {
          "10_audits": { cost: Math.round(perAuditCost * 10 * 100) / 100, revenue: 7500, profit: Math.round(7500 - perAuditCost * 10) },
          "30_audits": { cost: Math.round(perAuditCost * 30 * 100) / 100, revenue: 22500, profit: Math.round(22500 - perAuditCost * 30) },
          "50_audits": { cost: Math.round(perAuditCost * 50 * 100) / 100, revenue: 37500, profit: Math.round(37500 - perAuditCost * 50) },
          "100_audits": { cost: Math.round(perAuditCost * 100 * 100) / 100, revenue: 75000, profit: Math.round(75000 - perAuditCost * 100) },
        },
      };
    }),
  }),
});

// ============= ASYNC AUDIT ENGINE =============
async function runAudit(auditId: number, input: { businessName: string; businessLocation: string; industry: string; avgLeadValue?: number; growthGoal?: string; description?: string; services?: string[] }) {
  try {
    await updateAudit(auditId, { status: "scanning" });

    // Step 1: Search for the business on Google Maps
    const searchResult = await makeRequest<any>("/maps/api/place/textsearch/json", {
      query: `${input.businessName} ${input.businessLocation}`,
    });

    let businessData: any = {};
    let placeId = "";
    let lat: number | undefined;
    let lng: number | undefined;

    if (searchResult.results && searchResult.results.length > 0) {
      placeId = searchResult.results[0].place_id;
      lat = searchResult.results[0].geometry?.location?.lat;
      lng = searchResult.results[0].geometry?.location?.lng;

      const details = await makeRequest<any>("/maps/api/place/details/json", {
        place_id: placeId,
        fields: "name,rating,user_ratings_total,reviews,opening_hours,website,formatted_phone_number,formatted_address,geometry,types,photos,business_status",
      });

      businessData = details.result || {};
      if (businessData.geometry?.location) {
        lat = businessData.geometry.location.lat;
        lng = businessData.geometry.location.lng;
      }
    }

    // Step 2: Find competitors
    await updateAudit(auditId, { status: "analyzing" });
    const competitorSearch = await makeRequest<any>("/maps/api/place/textsearch/json", {
      query: `${input.industry} near ${input.businessLocation}`,
    });

    const competitors = [];
    const competitorResults = (competitorSearch.results || [])
      .filter((r: any) => r.place_id !== placeId)
      .slice(0, 3);

    for (const comp of competitorResults) {
      try {
        const compDetails = await makeRequest<any>("/maps/api/place/details/json", {
          place_id: comp.place_id,
          fields: "name,rating,user_ratings_total,reviews,opening_hours,website,formatted_phone_number,formatted_address,geometry,types,photos",
        });
        const compData = compDetails.result || comp;
        compData.geometry = compData.geometry || comp.geometry;
        competitors.push(compData);
      } catch {
        competitors.push(comp);
      }
    }

    // Step 3: AI Analysis
    const analysisResponse = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are an expert business analyst specializing in AI visibility and local business optimization. Analyze the business data and competitor data to produce a comprehensive audit.

Score each category 0-100:
- aiVisibility: How well AI assistants can find and recommend this business
- mapsPresence: Google Maps listing completeness and optimization
- reviewQuality: Review quantity, quality, recency, and sentiment
- photoQuality: Photo quantity and estimated quality for AI recognition
- seoReadiness: How well the business description and data support voice/AI search
- competitorGap: How the business compares to top competitors

Per-LLM Scores (0-100 each):
- chatgptScore: How well ChatGPT can find, describe, and recommend this business
- geminiScore: How well Google Gemini can find and recommend this business
- perplexityScore: How well Perplexity can find and recommend this business

For EACH LLM, provide specific issues found and exactly how to fix them.

Also calculate estimated monthly revenue loss from poor optimization.

Respond in JSON:
{
  "scores": {
    "aiVisibility": number,
    "mapsPresence": number,
    "reviewQuality": number,
    "photoQuality": number,
    "seoReadiness": number,
    "competitorGap": number,
    "overall": number
  },
  "llmScores": {
    "chatgpt": { "score": number, "issues": [{"issue": "string", "severity": "critical"|"high"|"medium"|"low", "fix": "string", "fixCategory": "description"|"reviews"|"photos"|"seo"|"structured_data"|"content"}], "summary": "string" },
    "gemini": { "score": number, "issues": [{"issue": "string", "severity": "critical"|"high"|"medium"|"low", "fix": "string", "fixCategory": "description"|"reviews"|"photos"|"seo"|"structured_data"|"content"}], "summary": "string" },
    "perplexity": { "score": number, "issues": [{"issue": "string", "severity": "critical"|"high"|"medium"|"low", "fix": "string", "fixCategory": "description"|"reviews"|"photos"|"seo"|"structured_data"|"content"}], "summary": "string" }
  },
  "estimatedMonthlyLoss": number,
  "moneyLeaks": [{"area": "string", "description": "string", "estimatedLoss": number, "priority": "high"|"medium"|"low", "fixService": "description_rewrite"|"review_strategy"|"competitor_deep_dive"|"ad_campaign"|"seo_optimization"|"ai_agent_fix"}],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "opportunities": ["string"],
  "recommendations": [{"title": "string", "description": "string", "impact": "high"|"medium"|"low", "effort": "easy"|"medium"|"hard", "category": "string", "fixService": "description_rewrite"|"review_strategy"|"competitor_deep_dive"|"ad_campaign"|"seo_optimization"|"ai_agent_fix"}],
  "aiReadinessReport": {
    "chatgptVisibility": "string",
    "geminiVisibility": "string",
    "perplexityVisibility": "string",
    "voiceSearchReadiness": "string"
  },
  "competitorInsights": [{"competitorName": "string", "advantage": "string", "yourGap": "string", "competitorLat": number, "competitorLng": number}],
  "roadmap": [{"phase": number, "title": "string", "actions": ["string"], "timeline": "string", "expectedROI": "string"}]
}`
        },
        {
          role: "user",
          content: `Analyze this business:\n\nBusiness: ${JSON.stringify(businessData)}\n\nCompetitors: ${JSON.stringify(competitors)}\n\nIndustry: ${input.industry}\nLocation: ${input.businessLocation}\nDescription: ${input.description ?? 'Not provided'}\nServices: ${input.services?.join(', ') ?? 'Not specified'}\nAvg Lead Value: $${input.avgLeadValue ?? 150}\nGrowth Goal: ${input.growthGoal ?? 'Phone Leads'}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const analysisContent = typeof analysisResponse.choices[0]?.message?.content === 'string'
      ? analysisResponse.choices[0].message.content : '{}';
    let analysis;
    try { analysis = JSON.parse(analysisContent); } catch { analysis = { scores: { overall: 50, aiVisibility: 50, mapsPresence: 50, reviewQuality: 50, photoQuality: 50, seoReadiness: 50, competitorGap: 50 }, estimatedMonthlyLoss: 0, recommendations: [], moneyLeaks: [], strengths: [], weaknesses: [], opportunities: [], roadmap: [] }; }

    await updateAudit(auditId, {
      status: "complete",
      placeId,
      latitude: lat ?? null,
      longitude: lng ?? null,
      overallScore: analysis.scores?.overall ?? 50,
      aiVisibilityScore: analysis.scores?.aiVisibility ?? 50,
      mapsPresenceScore: analysis.scores?.mapsPresence ?? 50,
      reviewScore: analysis.scores?.reviewQuality ?? 50,
      photoScore: analysis.scores?.photoQuality ?? 50,
      seoScore: analysis.scores?.seoReadiness ?? 50,
      competitorGapScore: analysis.scores?.competitorGap ?? 50,
      chatgptScore: analysis.llmScores?.chatgpt?.score ?? 50,
      geminiScore: analysis.llmScores?.gemini?.score ?? 50,
      perplexityScore: analysis.llmScores?.perplexity?.score ?? 50,
      chatgptIssues: analysis.llmScores?.chatgpt ?? { score: 50, issues: [], summary: "" },
      geminiIssues: analysis.llmScores?.gemini ?? { score: 50, issues: [], summary: "" },
      perplexityIssues: analysis.llmScores?.perplexity ?? { score: 50, issues: [], summary: "" },
      estimatedMonthlyLoss: analysis.estimatedMonthlyLoss ?? 0,
      moneyLeaks: analysis.moneyLeaks ?? [],
      businessData,
      competitorData: competitors,
      aiAnalysis: analysis,
      recommendations: analysis.recommendations ?? [],
    });
  } catch (error) {
    console.error("[Audit] Error:", error);
    await updateAudit(auditId, { status: "failed" });
  }
}

// ============= AI AGENT AUTO-FIX =============
async function runAutoFix(cartItemId: number, auditId: number, serviceType: string, userId: number) {
  try {
    await updateCartItem(cartItemId, { status: "in_progress" });
    const audit = await getAuditById(auditId);
    if (!audit) throw new Error("Audit not found");

    const servicePrompts: Record<string, string> = {
      description_rewrite: `Rewrite the business description for "${audit.businessName}" to be optimized for AI discovery, voice search, and natural language queries. The current business data is: ${JSON.stringify(audit.businessData)}. Generate a complete, optimized description that answers common questions people ask out loud.`,
      review_strategy: `Create a comprehensive review strategy for "${audit.businessName}" (${audit.industry}). Current data: ${JSON.stringify(audit.businessData)}. Include specific templates, timing, and what to ask customers to mention.`,
      seo_optimization: `Create a complete SEO optimization plan for "${audit.businessName}" including keywords, meta descriptions, local SEO tactics, and voice search optimization. Business data: ${JSON.stringify(audit.businessData)}`,
      competitor_deep_dive: `Perform a deep competitive analysis for "${audit.businessName}" against: ${JSON.stringify(audit.competitorData)}. Identify every advantage competitors have and create specific action items to close each gap.`,
      ad_campaign: `Create a Google Ads campaign strategy for "${audit.businessName}" (${audit.industry}) in ${audit.businessLocation}. Include ad copy, keywords, budget recommendations, and targeting strategy.`,
      ai_agent_fix: `Perform a complete AI visibility optimization for "${audit.businessName}". Fix ALL issues found in the audit: ${JSON.stringify(audit.aiAnalysis)}. Generate optimized descriptions, review strategies, SEO improvements, and a complete implementation plan.`,
    };

    const prompt = servicePrompts[serviceType] || `Fix the issues identified in the audit for "${audit.businessName}": ${JSON.stringify(audit.recommendations)}`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are the Lux AI Business Guardian executing an automatic fix for a local business. Generate comprehensive, actionable results that the business owner can immediately implement. Include specific text, templates, and step-by-step instructions. Format your response as a detailed implementation plan with all the actual content they need.

After generating the fix, also provide a verification checklist that confirms each issue has been addressed.

Respond in JSON:
{
  "fixTitle": "string",
  "fixSummary": "string",
  "generatedContent": { ... service-specific content ... },
  "implementationSteps": [{"step": number, "action": "string", "details": "string", "status": "ready"}],
  "verificationChecklist": [{"item": "string", "passed": true, "notes": "string"}],
  "expectedScoreImprovement": { "category": "string", "currentScore": number, "projectedScore": number },
  "estimatedRevenueRecovery": number
}`
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const content = typeof response.choices[0]?.message?.content === 'string' ? response.choices[0].message.content : '{}';
    let fixResults;
    try { fixResults = JSON.parse(content); } catch { fixResults = { fixTitle: "Fix completed", fixSummary: "Results generated", implementationSteps: [], verificationChecklist: [] }; }

    await updateCartItem(cartItemId, {
      status: "completed",
      fixResults,
    });

    // Save a chat message about the fix
    await saveChatMessage({
      userId,
      auditId,
      role: "assistant",
      content: `**Auto-Fix Complete: ${fixResults.fixTitle ?? serviceType}**\n\n${fixResults.fixSummary ?? 'The fix has been generated.'}\n\nCheck your purchased services to view the full implementation plan and verification results.`,
    });

  } catch (error) {
    console.error("[AutoFix] Error:", error);
    await updateCartItem(cartItemId, { status: "purchased" }); // Reset to purchased on failure
  }
}

// ============= ASYNC NICHE SCANNER =============
async function runNicheScan(scanId: number, input: { niche: string; territory: string }) {
  try {
    const searchResult = await makeRequest<any>("/maps/api/place/textsearch/json", {
      query: `${input.niche} in ${input.territory}`,
    });

    const businesses = [];
    for (const place of (searchResult.results || []).slice(0, 10)) {
      try {
        const details = await makeRequest<any>("/maps/api/place/details/json", {
          place_id: place.place_id,
          fields: "name,rating,user_ratings_total,website,formatted_address,formatted_phone_number,opening_hours,types",
        });
        const biz = details.result || place;
        let score = 0;
        if (biz.rating) score += Math.min(biz.rating * 10, 50);
        if (biz.user_ratings_total) score += Math.min(biz.user_ratings_total / 2, 20);
        if (biz.website) score += 10;
        if (biz.opening_hours) score += 10;
        if (biz.formatted_phone_number) score += 10;
        businesses.push({
          name: biz.name, address: biz.formatted_address, rating: biz.rating,
          reviewCount: biz.user_ratings_total, website: biz.website, phone: biz.formatted_phone_number,
          hasHours: !!biz.opening_hours, placeId: place.place_id,
          optimizationScore: Math.round(score),
          opportunityLevel: score < 40 ? "High" : score < 70 ? "Medium" : "Low",
        });
      } catch {
        businesses.push({
          name: place.name, address: place.formatted_address, rating: place.rating,
          reviewCount: place.user_ratings_total, placeId: place.place_id,
          optimizationScore: 30, opportunityLevel: "High",
        });
      }
    }
    businesses.sort((a, b) => a.optimizationScore - b.optimizationScore);
    await updateScan(scanId, { status: "complete", totalFound: businesses.length, results: businesses });
  } catch (error) {
    console.error("[Scanner] Error:", error);
    await updateScan(scanId, { status: "failed" });
  }
}

export type AppRouter = typeof appRouter;
