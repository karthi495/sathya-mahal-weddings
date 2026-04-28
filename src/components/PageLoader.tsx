import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function PageLoader({ show, label = "Preparing your selection…" }: { show: boolean; label?: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="glass-card rounded-3xl px-10 py-8 flex flex-col items-center gap-4 shadow-gold"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-gold blur-xl opacity-60 animate-pulse" />
              <Loader2 className="relative h-10 w-10 text-primary animate-spin" />
            </div>
            <p className="font-serif text-lg gold-text tracking-wide">{label}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
