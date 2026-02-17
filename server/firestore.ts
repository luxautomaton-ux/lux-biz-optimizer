import { db } from "./_core/firebase";
import {
    User, InsertUser,
    CompanyProfile, InsertCompanyProfile,
    Audit, InsertAudit,
    CartItem, InsertCartItem,
    ScanResult, InsertScanResult,
    ChatMessage, InsertChatMessage,
    Report, InsertReport,
    SupportTicket, InsertSupportTicket,
    TicketMessage, InsertTicketMessage,
    AgentActivity, InsertAgentActivity,
    AccountDeletionRequest, InsertAccountDeletionRequest,
    Partner, InsertPartner,
    PartnerReferral, InsertPartnerReferral,
    PartnerCommission, InsertPartnerCommission,
    PartnerPayout, InsertPartnerPayout
} from "../drizzle/schema";

// Helper to convert Firestore dates to JS Dates
const fromFirestore = (data: any) => {
    if (!data) return data;
    const result = { ...data };
    for (const key in result) {
        if (result[key] && typeof result[key].toDate === 'function') {
            result[key] = result[key].toDate();
        }
    }
    return result;
};

// ============= USER QUERIES =============
export async function upsertUser(user: InsertUser): Promise<void> {
    if (!user.firebaseUid) throw new Error("User firebaseUid is required for upsert");

    const userRef = db.collection("users").doc(user.firebaseUid);
    const doc = await userRef.get();

    const userData: any = {
        ...user,
        updatedAt: new Date(),
        lastSignedIn: user.lastSignedIn || new Date(),
    };

    // If it's a new user, add createdAt and generate a numeric ID
    if (!doc.exists) {
        userData.createdAt = new Date();
        userData.role = user.role || "user";
        userData.subscriptionTier = user.subscriptionTier || "free";
        // Generate a numeric ID if not provided (for compatibility)
        if (!userData.id) {
            userData.id = Math.floor(Date.now() + Math.random() * 1000);
        }
    } else {
        const existingData = doc.data();
        if (existingData && !existingData.id && !userData.id) {
            userData.id = Math.floor(Date.now() + Math.random() * 1000);
        }
    }

    // Handle auto-promote for admin
    const ADMIN_EMAIL = "luxautomaton@gmail.com";
    if (user.email && user.email.toLowerCase() === ADMIN_EMAIL) {
        userData.role = "admin";
    }

    await userRef.set(userData, { merge: true });
}

export async function getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const doc = await db.collection("users").doc(firebaseUid).get();
    if (!doc.exists) return undefined;
    return fromFirestore(doc.data()) as User;
}

export async function getUserById(id: number): Promise<User | undefined> {
    // In Firestore, we mostly use firebaseUid, but we might have numeric IDs if we sync.
    // For now, let's search by a numeric 'id' field if it exists, or assume id is firebaseUid if string.
    const snapshot = await db.collection("users").where("id", "==", id).limit(1).get();
    if (snapshot.empty) return undefined;
    return fromFirestore(snapshot.docs[0].data()) as User;
}

export async function updateUser(firebaseUid: string, data: Partial<User>): Promise<void> {
    const userRef = db.collection("users").doc(firebaseUid);
    await userRef.update({
        ...data,
        updatedAt: new Date(),
    });
}

// ============= COMPANY PROFILE QUERIES =============
export async function createCompanyProfile(data: InsertCompanyProfile): Promise<number> {
    const ref = db.collection("companyProfiles").doc();
    const id = Math.floor(Date.now() + Math.random() * 1000); // Generate a numeric ID for compatibility
    const profile = {
        ...data,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await ref.set(profile);
    return id;
}

export async function getCompanyProfileById(id: number): Promise<CompanyProfile | undefined> {
    const snapshot = await db.collection("companyProfiles").where("id", "==", id).limit(1).get();
    if (snapshot.empty) return undefined;
    return fromFirestore(snapshot.docs[0].data()) as CompanyProfile;
}

export async function getUserCompanyProfiles(userId: number): Promise<CompanyProfile[]> {
    try {
        console.log(`[Firestore] Fetching profiles for userId: ${userId}`);
        const snapshot = await db.collection("companyProfiles")
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc")
            .get();

        const profiles = snapshot.docs.map(doc => fromFirestore(doc.data()) as CompanyProfile);
        console.log(`[Firestore] Found ${profiles.length} profiles for userId: ${userId}`);
        return profiles;
    } catch (error) {
        console.error(`[Firestore] Error in getUserCompanyProfiles for userId ${userId}:`, error);
        // Fallback without orderBy in case index is missing
        try {
            console.log(`[Firestore] Retrying fetch without orderBy for userId: ${userId}`);
            const snapshot = await db.collection("companyProfiles")
                .where("userId", "==", userId)
                .get();
            const profiles = snapshot.docs.map(doc => fromFirestore(doc.data()) as CompanyProfile);
            return profiles.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
        } catch (retryError) {
            console.error(`[Firestore] Retry failed:`, retryError);
            return [];
        }
    }
}

export async function updateCompanyProfile(id: number, data: Partial<CompanyProfile>): Promise<void> {
    const snapshot = await db.collection("companyProfiles").where("id", "==", id).limit(1).get();
    if (snapshot.empty) return;
    await snapshot.docs[0].ref.update({
        ...data,
        updatedAt: new Date(),
    });
}

export async function deleteCompanyProfile(id: number): Promise<void> {
    console.log(`[Firestore] Attempting to delete profile with id: ${id}`);
    const snapshot = await db.collection("companyProfiles").where("id", "==", id).limit(1).get();
    if (snapshot.empty) {
        console.warn(`[Firestore] Profile with id ${id} not found for deletion.`);
        throw new Error(`Profile with id ${id} not found.`);
    }
    const docRef = snapshot.docs[0].ref;
    await docRef.delete();
    console.log(`[Firestore] Successfully deleted profile with id: ${id}`);
}

// ============= AUDIT QUERIES =============
export async function createAudit(data: InsertAudit): Promise<number> {
    const ref = db.collection("audits").doc();
    const id = Math.floor(Date.now() + Math.random() * 1000);
    const audit = {
        ...data,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await ref.set(audit);
    return id;
}

export async function getAuditById(id: number): Promise<Audit | undefined> {
    const snapshot = await db.collection("audits").where("id", "==", id).limit(1).get();
    if (snapshot.empty) return undefined;
    return fromFirestore(snapshot.docs[0].data()) as Audit;
}

export async function getAuditByCompanyProfile(companyProfileId: number): Promise<Audit | undefined> {
    const snapshot = await db.collection("audits")
        .where("companyProfileId", "==", companyProfileId)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();
    if (snapshot.empty) return undefined;
    return fromFirestore(snapshot.docs[0].data()) as Audit;
}

export async function getUserAudits(userId: number): Promise<Audit[]> {
    const snapshot = await db.collection("audits")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();
    return snapshot.docs.map(doc => fromFirestore(doc.data()) as Audit);
}

export async function updateAudit(id: number, data: Partial<Audit>): Promise<void> {
    const snapshot = await db.collection("audits").where("id", "==", id).limit(1).get();
    if (snapshot.empty) return;
    await snapshot.docs[0].ref.update({
        ...data,
        updatedAt: new Date(),
    });
}

// ============= CART QUERIES =============
export async function addToCart(data: InsertCartItem): Promise<number> {
    const ref = db.collection("cartItems").doc();
    const id = Math.floor(Date.now() + Math.random() * 1000);
    await ref.set({
        ...data,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    return id;
}

export async function getUserCart(userId: number): Promise<CartItem[]> {
    const snapshot = await db.collection("cartItems")
        .where("userId", "==", userId)
        .where("status", "==", "in_cart")
        .orderBy("createdAt", "desc")
        .get();
    return snapshot.docs.map(doc => fromFirestore(doc.data()) as CartItem);
}

export async function getUserPurchases(userId: number): Promise<CartItem[]> {
    const snapshot = await db.collection("cartItems")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();
    return snapshot.docs.map(doc => fromFirestore(doc.data()) as CartItem);
}

export async function getCartItemById(id: number): Promise<CartItem | undefined> {
    const snapshot = await db.collection("cartItems").where("id", "==", id).limit(1).get();
    if (snapshot.empty) return undefined;
    return fromFirestore(snapshot.docs[0].data()) as CartItem;
}

export async function updateCartItem(id: number, data: Partial<CartItem>): Promise<void> {
    const snapshot = await db.collection("cartItems").where("id", "==", id).limit(1).get();
    if (snapshot.empty) return;
    await snapshot.docs[0].ref.update({
        ...data,
        updatedAt: new Date(),
    });
}

export async function removeCartItem(id: number): Promise<void> {
    const snapshot = await db.collection("cartItems").where("id", "==", id).limit(1).get();
    if (snapshot.empty) return;
    await snapshot.docs[0].ref.delete();
}

export async function purchaseCart(userId: number): Promise<void> {
    const snapshot = await db.collection("cartItems")
        .where("userId", "==", userId)
        .where("status", "==", "in_cart")
        .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { status: "purchased", updatedAt: new Date() });
    });
    await batch.commit();
}

// ============= SCAN QUERIES =============
export async function createScan(data: InsertScanResult): Promise<number> {
    const ref = db.collection("scanResults").doc();
    const id = Math.floor(Date.now() + Math.random() * 1000);
    await ref.set({
        ...data,
        id,
        createdAt: new Date(),
    });
    return id;
}

export async function getScanById(id: number): Promise<ScanResult | undefined> {
    const snapshot = await db.collection("scanResults").where("id", "==", id).limit(1).get();
    if (snapshot.empty) return undefined;
    return fromFirestore(snapshot.docs[0].data()) as ScanResult;
}

export async function getUserScans(userId: number): Promise<ScanResult[]> {
    const snapshot = await db.collection("scanResults")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();
    return snapshot.docs.map(doc => fromFirestore(doc.data()) as ScanResult);
}

export async function updateScan(id: number, data: Partial<InsertScanResult>): Promise<void> {
    const snapshot = await db.collection("scanResults").where("id", "==", id).limit(1).get();
    if (snapshot.empty) return;
    await snapshot.docs[0].ref.update(data);
}

export async function getScanByCompanyProfile(companyProfileId: number): Promise<ScanResult | undefined> {
    const snapshot = await db.collection("scanResults")
        .where("companyProfileId", "==", companyProfileId)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();
    if (snapshot.empty) return undefined;
    return fromFirestore(snapshot.docs[0].data()) as ScanResult;
}

export async function getPurchasedFixesByAudit(auditId: number): Promise<CartItem[]> {
    const snapshot = await db.collection("cartItems")
        .where("auditId", "==", auditId)
        .orderBy("createdAt", "desc")
        .get();
    return snapshot.docs.map((doc: any) => fromFirestore(doc.data()) as CartItem);
}

// ============= CHAT QUERIES =============
export async function saveChatMessage(data: InsertChatMessage): Promise<void> {
    const ref = db.collection("chatMessages").doc();
    const id = Math.floor(Date.now() + Math.random() * 1000);
    await ref.set({
        ...data,
        id,
        createdAt: new Date(),
    });
}

export async function getChatHistory(userId: number, auditId?: number): Promise<ChatMessage[]> {
    let query = db.collection("chatMessages").where("userId", "==", userId);
    if (auditId) {
        query = query.where("auditId", "==", auditId);
    }
    const snapshot = await query.orderBy("createdAt", "asc").get();
    return snapshot.docs.map((doc: any) => fromFirestore(doc.data()) as ChatMessage);
}

// ============= REPORT QUERIES =============
export async function createReport(data: InsertReport): Promise<number> {
    const ref = db.collection("reports").doc();
    const id = Math.floor(Date.now() + Math.random() * 1000);
    await ref.set({
        ...data,
        id,
        createdAt: new Date(),
    });
    return id;
}

export async function getReportsByAudit(auditId: number): Promise<Report[]> {
    const snapshot = await db.collection("reports")
        .where("auditId", "==", auditId)
        .orderBy("createdAt", "desc")
        .get();
    return snapshot.docs.map((doc: any) => fromFirestore(doc.data()) as Report);
}

export async function getReportById(id: number): Promise<Report | undefined> {
    const snapshot = await db.collection("reports").where("id", "==", id).limit(1).get();
    if (snapshot.empty) return undefined;
    return fromFirestore(snapshot.docs[0].data()) as Report;
}

// ============= SUPPORT TICKET QUERIES =============
export async function createSupportTicket(data: InsertSupportTicket): Promise<number> {
    const ref = db.collection("supportTickets").doc();
    const id = Math.floor(Date.now() + Math.random() * 1000);
    await ref.set({
        ...data,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    return id;
}

export async function getUserTickets(userId: number): Promise<SupportTicket[]> {
    const snapshot = await db.collection("supportTickets")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();
    return snapshot.docs.map((doc: any) => fromFirestore(doc.data()) as SupportTicket);
}

export async function getAllTickets(): Promise<SupportTicket[]> {
    const snapshot = await db.collection("supportTickets").orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc: any) => fromFirestore(doc.data()) as SupportTicket);
}

export async function getTicketById(id: number): Promise<SupportTicket | undefined> {
    const snapshot = await db.collection("supportTickets").where("id", "==", id).limit(1).get();
    if (snapshot.empty) return undefined;
    return fromFirestore(snapshot.docs[0].data()) as SupportTicket;
}

export async function updateTicket(id: number, data: Partial<SupportTicket>): Promise<void> {
    const snapshot = await db.collection("supportTickets").where("id", "==", id).limit(1).get();
    if (snapshot.empty) return;
    await snapshot.docs[0].ref.update({
        ...data,
        updatedAt: new Date(),
    });
}

export async function addTicketMessage(data: InsertTicketMessage): Promise<void> {
    const ref = db.collection("ticketMessages").doc();
    const id = Math.floor(Date.now() + Math.random() * 1000);
    await ref.set({
        ...data,
        id,
        createdAt: new Date(),
    });
}

export async function getTicketMessages(ticketId: number): Promise<TicketMessage[]> {
    const snapshot = await db.collection("ticketMessages")
        .where("ticketId", "==", ticketId)
        .orderBy("createdAt", "asc")
        .get();
    return snapshot.docs.map((doc: any) => fromFirestore(doc.data()) as TicketMessage);
}

// ============= AGENT ACTIVITY QUERIES =============
export async function logAgentActivity(data: InsertAgentActivity): Promise<number> {
    const ref = db.collection("agentActivityLog").doc();
    const id = Math.floor(Date.now() + Math.random() * 1000);
    await ref.set({
        ...data,
        id,
        createdAt: new Date(),
    });
    return id;
}

export async function getUserAgentActivity(userId: number, limit: number = 50): Promise<AgentActivity[]> {
    const snapshot = await db.collection("agentActivityLog")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();
    return snapshot.docs.map((doc: any) => fromFirestore(doc.data()) as AgentActivity);
}

export async function getAllAgentActivity(limit: number = 100): Promise<AgentActivity[]> {
    const snapshot = await db.collection("agentActivityLog")
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();
    return snapshot.docs.map((doc: any) => fromFirestore(doc.data()) as AgentActivity);
}

export async function getAgentActivityStats() {
    const logRef = db.collection("agentActivityLog");
    const total = (await logRef.count().get()).data().count;
    const completed = (await logRef.where("status", "==", "completed").count().get()).data().count;
    const failed = (await logRef.where("status", "==", "failed").count().get()).data().count;
    const errors = (await logRef.where("actionType", "==", "error_detected").count().get()).data().count;

    return { total, completed, failed, errors };
}

// ============= ACCOUNT DELETION QUERIES =============
export async function createDeletionRequest(data: InsertAccountDeletionRequest): Promise<number> {
    const ref = db.collection("accountDeletionRequests").doc();
    const id = Math.floor(Date.now() + Math.random() * 1000);
    await ref.set({
        ...data,
        id,
        createdAt: new Date(),
    });
    return id;
}

export async function getUserDeletionRequest(userId: number): Promise<AccountDeletionRequest | undefined> {
    const snapshot = await db.collection("accountDeletionRequests")
        .where("userId", "==", userId)
        .where("status", "==", "pending")
        .limit(1)
        .get();
    if (snapshot.empty) return undefined;
    return fromFirestore(snapshot.docs[0].data()) as AccountDeletionRequest;
}

export async function deleteAllUserData(userId: number): Promise<void> {
    const collections = [
        "ticketMessages", "supportTickets", "agentActivityLog",
        "chatMessages", "reports", "cartItems", "scanResults",
        "audits", "companyProfiles", "accountDeletionRequests", "users"
    ];

    const batch = db.batch();
    for (const coll of collections) {
        const snapshot = await db.collection(coll).where("userId", "==", userId).get();
        snapshot.docs.forEach((doc: any) => batch.delete(doc.ref));
    }
    await batch.commit();
}

// ============= PARTNER QUERIES =============
export async function createPartner(data: InsertPartner): Promise<number> {
    const ref = db.collection("partners").doc();
    const id = Math.floor(Date.now() + Math.random() * 1000);
    await ref.set({
        ...data,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    return id;
}

export async function getPartnerByUserId(userId: number): Promise<Partner | null> {
    const snapshot = await db.collection("partners").where("userId", "==", userId).limit(1).get();
    if (snapshot.empty) return null;
    return fromFirestore(snapshot.docs[0].data()) as Partner;
}

export async function getPartnerById(id: number): Promise<Partner | null> {
    const snapshot = await db.collection("partners").where("id", "==", id).limit(1).get();
    if (snapshot.empty) return null;
    return fromFirestore(snapshot.docs[0].data()) as Partner;
}

export async function updatePartner(id: number, data: Partial<InsertPartner>): Promise<void> {
    const snapshot = await db.collection("partners").where("id", "==", id).limit(1).get();
    if (snapshot.empty) return;
    await snapshot.docs[0].ref.update({
        ...data,
        updatedAt: new Date(),
    });
}

export async function listAllPartners(): Promise<Partner[]> {
    const snapshot = await db.collection("partners").orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc: any) => fromFirestore(doc.data()) as Partner);
}

export async function createPartnerReferral(data: InsertPartnerReferral): Promise<number> {
    const ref = db.collection("partnerReferrals").doc();
    const id = Math.floor(Date.now() + Math.random() * 1000);
    await ref.set({
        ...data,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    return id;
}

export async function getPartnerReferrals(partnerId: number): Promise<PartnerReferral[]> {
    const snapshot = await db.collection("partnerReferrals")
        .where("partnerId", "==", partnerId)
        .orderBy("createdAt", "desc")
        .get();
    return snapshot.docs.map((doc: any) => fromFirestore(doc.data()) as PartnerReferral);
}

export async function getReferralByUserId(userId: number): Promise<PartnerReferral | null> {
    const snapshot = await db.collection("partnerReferrals").where("referredUserId", "==", userId).limit(1).get();
    if (snapshot.empty) return null;
    return fromFirestore(snapshot.docs[0].data()) as PartnerReferral;
}

export async function createPartnerCommission(data: InsertPartnerCommission): Promise<number> {
    const ref = db.collection("partnerCommissions").doc();
    const id = Math.floor(Date.now() + Math.random() * 1000);
    await ref.set({
        ...data,
        id,
        createdAt: new Date(),
    });
    return id;
}

export async function getPartnerCommissions(partnerId: number): Promise<any[]> {
    const snapshot = await db.collection("partnerCommissions")
        .where("partnerId", "==", partnerId)
        .orderBy("createdAt", "desc")
        .get();
    return snapshot.docs.map((doc: any) => fromFirestore(doc.data()));
}

export async function createPartnerPayout(data: InsertPartnerPayout): Promise<number> {
    const ref = db.collection("partnerPayouts").doc();
    const id = Math.floor(Date.now() + Math.random() * 1000);
    await ref.set({
        ...data,
        id,
        createdAt: new Date(),
    });
    return id;
}

export async function getPartnerPayouts(partnerId: number): Promise<PartnerPayout[]> {
    const snapshot = await db.collection("partnerPayouts")
        .where("partnerId", "==", partnerId)
        .orderBy("createdAt", "desc")
        .get();
    return snapshot.docs.map((doc: any) => fromFirestore(doc.data()) as PartnerPayout);
}

export async function getPartnerDashboardStats(partnerId: number) {
    const referrals = await getPartnerReferrals(partnerId);
    const commissions = await getPartnerCommissions(partnerId);
    const payouts = await getPartnerPayouts(partnerId);

    const totalRevenue = referrals.reduce((sum, r) => sum + (r.totalRevenue || 0), 0);
    const totalCommissions = commissions.reduce((sum, c) => sum + (c.commissionAmount || 0), 0);
    const totalPaidOut = payouts.filter(p => p.status === "completed").reduce((sum, p) => sum + (p.amount || 0), 0);
    const pendingPayout = commissions.filter(c => c.status === "pending" || c.status === "approved").reduce((sum, c) => sum + (c.commissionAmount || 0), 0);

    return {
        totalCustomers: referrals.length,
        totalRevenue,
        totalCommissions,
        totalPaidOut,
        pendingPayout,
    };
}

export async function getPartnerCustomerDetails(partnerId: number): Promise<any[]> {
    const referrals = await getPartnerReferrals(partnerId);
    const customerDetails = [];

    for (const ref of referrals) {
        const user = await getUserById(ref.referredUserId);
        const profile = await db.collection("companyProfiles").where("userId", "==", ref.referredUserId).limit(1).get();
        const purchases = await db.collection("cartItems")
            .where("userId", "==", ref.referredUserId)
            .where("status", "==", "completed")
            .get();
        const agentActions = await db.collection("agentActivityLog")
            .where("userId", "==", ref.referredUserId)
            .orderBy("createdAt", "desc")
            .limit(20)
            .get();
        const commissions = await db.collection("partnerCommissions")
            .where("partnerId", "==", partnerId)
            .where("referredUserId", "==", ref.referredUserId)
            .get();

        const totalSpent = purchases.docs.reduce((sum, p) => sum + (p.data().price || 0), 0);
        const totalCommission = commissions.docs.reduce((sum, c) => sum + (c.data().commissionAmount || 0), 0);

        customerDetails.push({
            referral: ref,
            user: user ?? null,
            profile: profile.empty ? null : fromFirestore(profile.docs[0].data()),
            totalSpent,
            totalCommission,
            purchaseCount: purchases.size,
            purchases: purchases.docs.map(p => fromFirestore(p.data())),
            agentActions: agentActions.docs.map(a => fromFirestore(a.data())),
            revenueShareActive: ref.revenueShareExpiresAt > new Date(),
        });
    }

    return customerDetails;
}

// ─── ADMIN DASHBOARD STATS ──────────────────────────────────────────
export async function getAllUsersCount() {
    return (await db.collection("users").count().get()).data().count;
}

export async function getAllAuditsCount() {
    return (await db.collection("audits").count().get()).data().count;
}

export async function getAllPurchasesCount() {
    return (await db.collection("cartItems").where("status", "==", "completed").count().get()).data().count;
}

export async function getTotalRevenue() {
    const snapshot = await db.collection("cartItems").where("status", "==", "completed").get();
    return snapshot.docs.reduce((sum, doc) => sum + (doc.data().price || 0), 0);
}

export async function getRecentUsers(limit: number = 10) {
    const snapshot = await db.collection("users").orderBy("createdAt", "desc").limit(limit).get();
    return snapshot.docs.map((doc: any) => fromFirestore(doc.data()) as User);
}

export async function getRecentAudits(limit: number = 10) {
    const snapshot = await db.collection("audits").orderBy("createdAt", "desc").limit(limit).get();
    return snapshot.docs.map((doc: any) => fromFirestore(doc.data()) as Audit);
}

export async function getAllUsersWithDetails() {
    const snapshot = await db.collection("users").orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc: any) => fromFirestore(doc.data()) as User);
}

export async function getUserSpending(userId: number) {
    const snapshot = await db.collection("cartItems")
        .where("userId", "==", userId)
        .where("status", "==", "completed")
        .get();
    return snapshot.docs.reduce((sum, doc) => sum + (doc.data().price || 0), 0);
}

export async function getOpenTicketsCount() {
    return (await db.collection("supportTickets").where("status", "in", ["open", "in_progress", "escalated"]).count().get()).data().count;
}
