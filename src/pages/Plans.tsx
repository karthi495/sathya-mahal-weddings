import { motion } from "framer-motion";
import { Check, Crown, Zap, Sparkles, Flame, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/SectionTitle";
import { useBooking } from "@/context/BookingContext";
import { useTransitionNav } from "@/hooks/useTransitionNav";
import PageLoader from "@/components/PageLoader";
import { toast } from "sonner";

const extras = [
  { id: "eb", icon: Zap, label: "Electricity (EB)", price: 30, display: "₹30", unit: "/ unit" },
  { id: "cleaning", icon: Sparkles, label: "Cleaning Charges", price: 5000, display: "₹5,000", unit: "flat" },
  { id: "gas", icon: Flame, label: "Gas Charges", price: 220, display: "₹220", unit: "/ kg" },
  { id: "generator", icon: Power, label: "Generator", price: 2500, display: "₹2,500", unit: "/ hr" },
];

const plans = [
  { id: "full", name: "Full Day Plan", time: "4 PM – Next Day 2 PM", price: 55000, breakdown: "₹55,000 + ₹7,000 + ₹12,000", featured: true,
    features: ["22 hours hall access", "Bridal & groom rooms", "Generator backup", "Full decor support"] },
  { id: "evening", name: "Evening Plan", time: "4 PM – 10 PM", price: 30000, breakdown: "₹30,000 + ₹5,000 + ₹6,000",
    features: ["6 hours hall access", "Reception ready", "Bridal room", "Generator backup"] },
  { id: "morning", name: "Morning Plan", time: "5 AM – 2 PM", price: 30000, breakdown: "₹30,000 + ₹5,000 + ₹8,000",
    features: ["9 hours hall access", "Muhurtham ready", "Bridal room", "Generator backup"] },
];

export default function Plans() {
  const { state, set, toggleItem } = useBooking();
  const { loading, go } = useTransitionNav(700);

  const isExtraSelected = (id: string) => state.extras.some(e => e.id === id);
  const toggleExtra = (e: typeof extras[number]) => {
    toggleItem("extras", { id: e.id, name: `${e.label} (${e.display} ${e.unit})`, price: e.price });
    toast.success(isExtraSelected(e.id) ? `${e.label} removed` : `${e.label} added`);
  };

  const select = (p: typeof plans[number]) => {
    toast.success(`${p.name} selected`);
    go("/photography", () => set("plan", { id: p.id, name: p.name, price: p.price }));
  };

  return (
    <>
    <PageLoader show={loading} label="Loading Photography…" />
    <section className="container py-12 md:py-24">
      <SectionTitle eyebrow="Step 2" title="Hall Plans" subtitle="Choose the perfect package for your celebration." />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
        {plans.map((p, i) => {
          const selected = state.plan?.id === p.id;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className={`glass-card rounded-3xl p-6 md:p-8 relative transition-all ${
                p.featured ? "ring-2 ring-primary shadow-gold" : ""
              } ${selected ? "ring-2 ring-accent" : ""}`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-gold text-primary-foreground text-[11px] px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-gold">
                  <Crown className="h-3 w-3" /> Popular
                </div>
              )}
              <h3 className="font-serif text-2xl md:text-3xl mb-2">{p.name}</h3>
              <p className="text-muted-foreground text-sm mb-5 md:mb-6">{p.time}</p>
              <p className="font-serif text-4xl md:text-5xl gold-text mb-1 leading-tight">₹{p.price.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mb-5 md:mb-6 break-words">{p.breakdown}</p>
              <ul className="space-y-2.5 md:space-y-3 mb-6 md:mb-8">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm md:text-[15px] leading-snug">
                    <Check className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={() => select(p)} className={`w-full rounded-full h-14 text-base font-semibold ${selected ? "bg-accent" : "bg-gradient-gold"} text-primary-foreground hover:opacity-90`}>
                {selected ? "Selected ✓" : "Select Plan"}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Charges */}
      <div className="mt-24 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.4em] text-accent mb-3">Transparent Pricing</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-3">Additional Charges</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Tap to include any extras in your booking summary. Billed on actual usage.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {extras.map((e, i) => {
            const selected = isExtraSelected(e.id);
            return (
              <motion.button
                type="button"
                onClick={() => toggleExtra(e)}
                key={e.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                aria-pressed={selected}
                className={`relative text-left bg-card/80 backdrop-blur rounded-2xl p-6 text-center shadow-soft hover:shadow-gold transition-all border ${
                  selected ? "border-accent ring-2 ring-accent/60 bg-accent/5" : "border-primary/15"
                }`}
              >
                <div className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected ? "bg-accent border-accent" : "border-muted-foreground/30 bg-background"
                }`}>
                  {selected && <Check className="h-3.5 w-3.5 text-accent-foreground" strokeWidth={3} />}
                </div>
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-gold">
                  <e.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">{e.label}</p>
                <p className="font-serif text-2xl md:text-3xl gold-text leading-none">{e.display}</p>
                <p className="text-xs text-muted-foreground mt-1">{e.unit}</p>
                <p className={`text-[10px] uppercase tracking-widest mt-3 font-semibold ${selected ? "text-accent" : "text-muted-foreground/60"}`}>
                  {selected ? "Included ✓" : "Tap to add"}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
    </>
  );
}
