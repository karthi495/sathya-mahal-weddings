import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Video, Disc, Image as ImageIcon, Frame, Plane, Tv, Film,
  Sparkles, Heart, Award, Crown, Gem, Star, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/SectionTitle";
import { useBooking } from "@/context/BookingContext";
import { useTransitionNav } from "@/hooks/useTransitionNav";
import PageLoader from "@/components/PageLoader";
import { toast } from "sonner";

type Feature = { icon: React.ComponentType<{ className?: string }>; text: string };
type Tier = {
  id: string;
  name: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string; // tailwind gradient classes
  badge?: string;
  popular?: boolean;
  bestValue?: boolean;
  single: { price: number; features: Feature[] };
  two: { price: number; features: Feature[] };
};

const tiers: Tier[] = [
  {
    id: "silver",
    name: "Silver",
    tagline: "Essential coverage",
    icon: Award,
    accent: "from-slate-400 to-slate-600",
    single: {
      price: 12000,
      features: [
        { icon: Camera, text: "Traditional photography (8K resolution)" },
        { icon: Disc, text: "Fully digital photos in pendrive" },
        { icon: ImageIcon, text: "1 Budget album (12x36)" },
      ],
    },
    two: {
      price: 15000,
      features: [
        { icon: Camera, text: "Traditional photography (8K resolution)" },
        { icon: Disc, text: "Fully digital photos in pendrive" },
        { icon: ImageIcon, text: "1 Budget album (12x36)" },
        { icon: Frame, text: "1 Photo frame (12x18)" },
      ],
    },
  },
  {
    id: "gold",
    name: "Gold",
    tagline: "Photo + Video combo",
    icon: Crown,
    accent: "from-amber-400 to-yellow-600",
    single: {
      price: 25000,
      features: [
        { icon: Camera, text: "Traditional photo (1)" },
        { icon: Video, text: "Traditional video (1)" },
        { icon: Disc, text: "Full length HD video + photos in pendrive" },
        { icon: ImageIcon, text: "Premium Canva album (1)" },
        { icon: Frame, text: "1 Photo frame (12x18)" },
      ],
    },
    two: {
      price: 40000,
      features: [
        { icon: Camera, text: "Traditional photo (1)" },
        { icon: Video, text: "Traditional video (1)" },
        { icon: Disc, text: "Full length HD video + photos in pendrive" },
        { icon: ImageIcon, text: "Premium Canva album (1)" },
        { icon: Frame, text: "1 Photo frame (12x18)" },
      ],
    },
  },
  {
    id: "platinum",
    name: "Platinum",
    tagline: "Drone + 4K cinematic",
    icon: Star,
    accent: "from-purple-500 to-fuchsia-600",
    badge: "Best Value",
    bestValue: true,
    single: {
      price: 50000,
      features: [
        { icon: Camera, text: "Traditional photographer (1)" },
        { icon: Video, text: "Traditional videographer (1)" },
        { icon: Sparkles, text: "Candid photographer (1)" },
        { icon: Plane, text: "Drone + LED TV (2 Nos)" },
        { icon: Film, text: "Full length 4K video + photos" },
        { icon: Disc, text: "Pendrive" },
        { icon: ImageIcon, text: "Premium Canva album" },
        { icon: Frame, text: "2 Photo frames (12x18)" },
        { icon: Heart, text: "1 Couple pics gift" },
      ],
    },
    two: {
      price: 65000,
      features: [
        { icon: Camera, text: "Traditional photographer (1)" },
        { icon: Video, text: "Traditional videographer (1)" },
        { icon: Sparkles, text: "Candid photographer (1)" },
        { icon: Plane, text: "Drone + LED TV (2 Nos)" },
        { icon: Film, text: "Full length 4K video + photos" },
        { icon: Disc, text: "Pendrive" },
        { icon: ImageIcon, text: "Premium Canva album" },
        { icon: Frame, text: "2 Photo frames (12x18)" },
        { icon: Heart, text: "1 Couple pics gift" },
      ],
    },
  },
  {
    id: "diamond",
    name: "Diamond",
    tagline: "Ultimate cinematic experience",
    icon: Gem,
    accent: "from-rose-500 via-fuchsia-500 to-indigo-600",
    badge: "Most Popular",
    popular: true,
    single: {
      price: 70000,
      features: [
        { icon: Camera, text: "Traditional photographer (1)" },
        { icon: Video, text: "Traditional videographer (1)" },
        { icon: Sparkles, text: "Candid photographer (1)" },
        { icon: Sparkles, text: "Candid videographer (1)" },
        { icon: Plane, text: "Drone + LED TV (2 Nos)" },
        { icon: Heart, text: "Pre / Post wedding shoot" },
        { icon: Film, text: "Full length 4K video + photos" },
        { icon: Disc, text: "Pendrive" },
        { icon: ImageIcon, text: "Premium Canva album" },
        { icon: Tv, text: "Cinematic E-invite video" },
        { icon: Film, text: "Cinematic (AI + AE) teaser cut" },
        { icon: Film, text: "Cinematic one song edit" },
        { icon: Frame, text: "2 Photo frames (12x18)" },
      ],
    },
    two: {
      price: 90000,
      features: [
        { icon: Camera, text: "Traditional photographer (1)" },
        { icon: Video, text: "Traditional videographer (1)" },
        { icon: Sparkles, text: "Candid photographer (1)" },
        { icon: Sparkles, text: "Candid videographer (1)" },
        { icon: Plane, text: "Drone + LED TV (2 Nos)" },
        { icon: Heart, text: "Pre / Post wedding shoot" },
        { icon: Film, text: "Full length 4K video + photos" },
        { icon: Disc, text: "Pendrive" },
        { icon: ImageIcon, text: "Premium Canva album" },
        { icon: Tv, text: "Cinematic E-invite video" },
        { icon: Film, text: "Cinematic (AI + AE) teaser cut" },
        { icon: Film, text: "Cinematic one song edit" },
        { icon: Frame, text: "2 Photo frames (12x18)" },
      ],
    },
  },
];

export default function Photography() {
  const { state, set } = useBooking();
  const navigate = useNavigate();
  const { loading, go } = useTransitionNav(700);
  const [mode, setMode] = useState<"single" | "two">("single");

  const select = (t: Tier) => {
    const pkg = mode === "single" ? t.single : t.two;
    const label = `${t.name} — ${mode === "single" ? "Single Event" : "Two Events"}`;
    toast.success(`${t.name} package selected`);
    go("/decoration", () => set("photography", { id: `${t.id}-${mode}`, name: label, price: pkg.price }));
  };

  return (
    <>
      <PageLoader show={loading} label="Loading Decoration…" />
      <section className="container py-12 md:py-24">
        <SectionTitle
          eyebrow="Step 3"
          title="Photography Packages"
          subtitle="Capture your special moments with our premium photography services."
        />

        {/* Toggle */}
        <div className="flex justify-center mb-10 md:mb-14">
          <div className="relative inline-flex items-center bg-secondary/60 backdrop-blur border border-primary/20 rounded-full p-1.5 shadow-soft">
            {(["single", "two"] as const).map((m) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`relative z-10 px-5 md:px-7 h-11 md:h-12 rounded-full text-sm md:text-[15px] font-medium transition-colors ${
                    active ? "text-primary-foreground" : "text-foreground/70"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="photo-toggle-pill"
                      className="absolute inset-0 bg-gradient-gold rounded-full shadow-gold"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {m === "single" ? "Single Event" : "Two Events"}
                    {m === "two" && (
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${active ? "bg-white/25" : "bg-accent/15 text-accent"}`}>
                        Save
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6 max-w-7xl mx-auto">
          {tiers.map((t, i) => {
            const pkg = mode === "single" ? t.single : t.two;
            const selectedId = `${t.id}-${mode}`;
            const isSelected = state.photography?.id === selectedId;
            const Icon = t.icon;

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className={`relative glass-card rounded-3xl p-6 md:p-7 flex flex-col transition-all ${
                  t.popular ? "ring-2 ring-primary shadow-gold" : ""
                } ${isSelected ? "ring-2 ring-accent" : ""}`}
              >
                {t.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r ${t.accent} text-white text-[11px] px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg whitespace-nowrap`}>
                    <Crown className="h-3 w-3" /> {t.badge}
                  </div>
                )}

                {/* Header */}
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.accent} flex items-center justify-center shadow-soft shrink-0`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-2xl leading-none">{t.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{t.tagline}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-5 pb-5 border-b border-border/40">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="font-serif text-4xl md:text-5xl gold-text leading-none">
                        ₹{pkg.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">
                        {mode === "single" ? "Single Event" : "Two Events Bundle"}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode + t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2.5"
                    >
                      {pkg.features.map((f, idx) => {
                        const FIcon = f.icon;
                        return (
                          <li key={idx} className="flex items-start gap-2.5 text-[13px] md:text-sm leading-snug">
                            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                              <FIcon className="h-3.5 w-3.5 text-primary" />
                            </span>
                            <span className="text-foreground/85">{f.text}</span>
                          </li>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </ul>

                <Button
                  onClick={() => select(t)}
                  className={`w-full rounded-full h-12 md:h-13 text-sm md:text-base font-semibold ${
                    isSelected ? "bg-accent" : "bg-gradient-gold"
                  } text-primary-foreground hover:opacity-90`}
                >
                  {isSelected ? (
                    <span className="flex items-center gap-2"><Check className="h-4 w-4" /> Selected</span>
                  ) : (
                    "Select Package"
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Button
            onClick={() => navigate("/decoration")}
            variant="outline"
            className="rounded-full border-primary/40 hover:bg-primary hover:text-primary-foreground h-12 px-6"
          >
            Skip to Decoration →
          </Button>
        </div>
      </section>
    </>
  );
}
