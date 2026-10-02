"use client";

import { motion, useReducedMotion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/site-config";

export function WhatsappFloat() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp (número placeholder)"
      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.4, delay: 0.6 }}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-gold text-gold-foreground ring-1 ring-white/15 shadow-lg shadow-black/30"
    >
      <MessageCircle className="size-6" strokeWidth={1.75} />
    </motion.a>
  );
}
