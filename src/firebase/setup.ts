"use client";

import { FirebaseApp, initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import credentials from "./credentials.json";
// import { getMessaging, Messaging } from "firebase/messaging";

const app: FirebaseApp = initializeApp(credentials);
const analytics = (): Analytics | null => {
  if (typeof window !== "undefined") {
    return getAnalytics(app);
  } else {
    return null;
  }
};
// let messaging: Messaging | undefined;
// if (typeof window !== "undefined") {
// messaging = getMessaging(app);
// }

export { app, analytics };
