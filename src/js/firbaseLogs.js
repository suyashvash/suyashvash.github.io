import { db, collection, addDoc } from './firebase-config.js';



async function logFirebase(body) {
    await addDoc(collection(db, 'site-logs'), body);
}

// Export the function to use in HTML
export { logFirebase };