import admin from "firebase-admin";

let firebaseInitialized = false;

function initializeFirebase() {
    if (admin.apps.length > 0) {
        firebaseInitialized = true;
        return admin;
    }

    try {
        const rawKey = process.env.FIREBASE_PRIVATE_KEY || "";
        let privateKey = rawKey.trim();

        // Handle JSON-escaped newlines (literal \n in the string)
        if (privateKey.includes("\\n")) {
            privateKey = privateKey.replace(/\\n/g, "\n");
        }
        // Handle URL-encoded newlines
        if (privateKey.includes("%0A")) {
            privateKey = decodeURIComponent(privateKey);
        }
        // Handle double-quoted wrapping
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            privateKey = JSON.parse(privateKey);
        }
        // If the key is base64-encoded, decode it
        if (privateKey && !privateKey.includes("-----BEGIN")) {
            try {
                const decoded = Buffer.from(privateKey, "base64").toString("utf-8");
                if (decoded.includes("-----BEGIN")) {
                    privateKey = decoded;
                }
            } catch { }
        }
        // Ensure proper PEM formatting with actual newlines
        if (privateKey.includes("-----BEGIN")) {
            privateKey = privateKey
                .replace(/-----BEGIN PRIVATE KEY-----/g, "")
                .replace(/-----END PRIVATE KEY-----/g, "")
                .replace(/\s/g, "");
            // Reconstruct proper PEM
            const chunks = privateKey.match(/.{1,64}/g) || [];
            privateKey = `-----BEGIN PRIVATE KEY-----\n${chunks.join("\n")}\n-----END PRIVATE KEY-----\n`;
        }

        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

        if (privateKey && privateKey.includes("-----BEGIN") && clientEmail) {
            try {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID || "lux-biz-optimizer",
                        clientEmail,
                        privateKey,
                    }),
                });
                firebaseInitialized = true;
                console.log("[Firebase] Admin SDK initialized successfully");
            } catch (certError: any) {
                console.warn("[Firebase] Cert init failed:", certError.message);
            }
        } else {
            console.warn("[Firebase] Missing credentials - Firestore operations may fail");
        }
    } catch (error: any) {
        console.warn("[Firebase] Init warning:", error.message);
    }

    return admin;
}

const firebaseAdmin = initializeFirebase();

// Export services, but they will throw if accessed and Firebase wasn't initialized
export const db = firebaseInitialized
    ? firebaseAdmin.firestore()
    : new Proxy({} as any, {
        get: (target, prop) => {
            if (prop === 'settings') {
                return (settings: any) => { console.log("[Firebase] Firestore settings updated:", settings); };
            }
            throw new Error("Firebase Admin SDK not initialized. Please provide FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL in .env");
        }
    });

if (firebaseInitialized) {
    db.settings({ ignoreUndefinedProperties: true });
}

export const auth = firebaseInitialized
    ? firebaseAdmin.auth()
    : new Proxy({} as any, {
        get: () => {
            throw new Error("Firebase Admin SDK not initialized. Please provide FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL in .env");
        }
    });

export default firebaseAdmin;
