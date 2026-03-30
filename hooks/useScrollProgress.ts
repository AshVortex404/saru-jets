"use client";

import { useScroll } from "framer-motion";
import { RefObject } from "react";

export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: ref as RefObject<HTMLElement>,
    offset: ["start start", "end start"],
  });
  return scrollYProgress;
}
