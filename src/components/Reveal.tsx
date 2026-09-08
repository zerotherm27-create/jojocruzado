"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/* Client-only leaf: scroll-triggered fade+rise for section content, isolated
   here so every page that uses it stays a Server Component apart from this
   one wrapper. Renders in place of the section's own container div (no
   extra DOM nesting) -- pass the same className the div would have had.
   Skips motion entirely for prefers-reduced-motion rather than relying on
   the sitewide CSS override in globals.css, since Framer Motion drives
   transforms via its own engine, not necessarily a plain CSS `transition`. */
export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}
