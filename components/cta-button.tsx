"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  id?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CTAButton({
  label,
  href,
  onClick,
  id,
  className,
  size = "md",
}: CTAButtonProps) {
  const sizeClasses = {
    sm: "px-6 py-2.5 text-[11px]",
    md: "px-8 py-3.5 text-[12px]",
    lg: "px-10 py-4 text-[13px]",
  };

  const baseClass = cn(
    "inline-flex items-center justify-center rounded-full",
    "border border-white/20 bg-white/5 backdrop-blur-md",
    "uppercase tracking-[0.14em] text-white font-medium",
    "hover:bg-white/10 hover:border-white/30 hover:shadow-lg hover:shadow-white/5",
    "active:scale-[0.97]",
    "transition-all duration-300 ease-out",
    sizeClasses[size],
    className
  );

  const inner = (
    <motion.span
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={baseClass}
      id={id}
      onClick={onClick}
    >
      {label}
    </motion.span>
  );

  if (href) {
    return <a href={href}>{inner}</a>;
  }
  return inner;
}
