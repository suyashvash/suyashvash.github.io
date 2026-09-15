/**
 * Lead capture — Firestore.
 *
 * Writes into the SAME project as the personal portfolio
 * (suyash-portfolio-b9bf5), collection `leads`, tagged
 * `source: "FIRM_ENQUIRY"` so firm enquiries can be filtered apart from
 * personal-portfolio leads in the console.
 *
 * ── Why this module is dynamically imported ────────────────────────────
 * The personal site loads the Firebase SDK with two render-blocking
 * <script> tags in <head>. That costs every visitor ~100 KB before first
 * paint to power a form most of them never touch. Here the SDK is fetched
 * on the first interaction with the form, so it is never on the critical
 * path and never affects LCP.
 *
 * ── Timestamps ─────────────────────────────────────────────────────────
 * `createdAt` is the authoritative field: serverTimestamp() is a sentinel
 * the SERVER resolves at write time, producing a real Firestore Timestamp.
 * The older `timestamp` (epoch-ms number) and `sentOn` (locale string)
 * fields are still written so existing console views keep working, but
 * they should not be used for sorting — see the note in submitLead().
 */

const FIREBASE_VERSION = '10.14.1';
const CDN = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}`;

const firebaseConfig = {
  apiKey: 'AIzaSyCvmK7BjfppwcUsPpIpN7mnySbx36uTn3k',
  authDomain: 'suyash-portfolio-b9bf5.firebaseapp.com',
  projectId: 'suyash-portfolio-b9bf5',
  storageBucket: 'suyash-portfolio-b9bf5.appspot.com',
  messagingSenderId: '902073852222',
  appId: '1:902073852222:web:edb832ce15f82147f9cc6f',
};

/** The tag that separates firm enquiries from personal-portfolio leads. */
export const SOURCE_TAG = 'FIRM_ENQUIRY';

let sdkPromise = null;

/** Load and initialise the SDK once. Safe to call repeatedly. */
export function warmUp() {
  if (sdkPromise) return sdkPromise;

  sdkPromise = (async () => {
    const [{ initializeApp }, firestore] = await Promise.all([
      import(`${CDN}/firebase-app.js`),
      import(`${CDN}/firebase-firestore.js`),
    ]);
    const app = initializeApp(firebaseConfig);
    return {
      db: firestore.getFirestore(app),
      collection: firestore.collection,
      addDoc: firestore.addDoc,
      serverTimestamp: firestore.serverTimestamp,
    };
  })().catch((err) => {
    // Let a later attempt retry rather than caching a failed load forever.
    sdkPromise = null;
    throw err;
  });

  return sdkPromise;
}

/**
 * @param {{name:string, email:string, message:string, need:string}} lead
 * @returns {Promise<string>} the new document id
 */
export async function submitLead(lead) {
  const { db, collection, addDoc, serverTimestamp } = await warmUp();

  const now = new Date();

  const doc = {
    // ---- the tag -------------------------------------------------------
    source: SOURCE_TAG,

    // ---- the enquiry ---------------------------------------------------
    name: lead.name.trim(),
    email: lead.email.trim(),
    message: lead.message.trim(),
    service: lead.need || null,
    status: 'none',

    // ---- time ----------------------------------------------------------
    // AUTHORITATIVE. A real Firestore Timestamp, written by the server's
    // clock. Sort and filter on this one.
    createdAt: serverTimestamp(),

    // ISO 8601 in UTC — unambiguous and lexicographically sortable, unlike
    // the locale string below. Useful for spotting client clock skew.
    clientSentAtISO: now.toISOString(),
    clientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? null,

    // Legacy shape, kept so existing console views and any scripts built
    // against the personal site's schema keep working. Do NOT sort on
    // these: `timestamp` is a plain number, and `sentOn` is a locale string
    // beginning with the weekday name, so ordering it is meaningless.
    timestamp: now.getTime(),
    sentOn: `${now}`,

    // ---- context -------------------------------------------------------
    userAgent: navigator.userAgent,
    referrer: document.referrer || null,
    language: navigator.language || null,
    page: location.pathname,
  };

  const ref = await addDoc(collection(db, 'leads'), doc);
  return ref.id;
}
