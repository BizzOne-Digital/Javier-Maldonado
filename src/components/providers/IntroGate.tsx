"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { IntroExperience } from "./IntroExperience";

const INTRO_KEY = "jm-intro-seen";

interface IntroGateProps {
  children: ReactNode;
}

export function IntroGate({ children }: IntroGateProps) {
  const reducedMotion = useReducedMotion();
  const [introComplete, setIntroComplete] = useState<boolean | null>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem(INTRO_KEY);
    setIntroComplete(Boolean(seen || reducedMotion));
  }, [reducedMotion]);

  useEffect(() => {
    if (introComplete !== true) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [introComplete]);

  return (
    <>
      {introComplete !== true && (
        <IntroExperience onComplete={() => setIntroComplete(true)} />
      )}
      {introComplete === true && children}
    </>
  );
}
