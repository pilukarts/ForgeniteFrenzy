/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * // import {onDocumentWritten} from "firebase-functions/v2/firestore"; // No usado
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import {onCall} from "firebase-functions/v2/https";
// import {onDocumentWritten} from "firebase-functions/v2/firestore"; // No usado

// Example function to handle HTTP requests
export const helloWorld = onCall({region: "us-central1"}, async (request) => {
  return {
    message: "Hello from Firebase Functions!",
  };
});
