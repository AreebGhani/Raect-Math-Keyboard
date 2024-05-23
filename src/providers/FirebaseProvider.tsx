"use client";

import { createContext, useState, useEffect } from "react";
import { Analytics, logEvent } from "firebase/analytics";
import { analytics } from "../firebase/setup";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}


export const FirebaseContext = createContext<Analytics | null>(null);

type Props = {
  children: React.ReactNode;
};

const FirebaseProvider = ({ children }: Props) => {
  const [tracking, setTracking] = useState<Analytics | null>(null);

  useEffect(() => {
    const analyticsInstance = analytics();
    setTracking(analyticsInstance);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      if (!tracking) {
        return;
      }
      logEvent(tracking, "page_view", {
        page_location: document?.location?.pathname,
        page_title: document?.title,
      });
      setTimeout(
        () => console.log("🚀 ~ handleRouteChange ~:", window.dataLayer),
        1000
      );
    };
    handleRouteChange();
  }, [tracking]);

  return (
    <FirebaseContext.Provider value={tracking}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
