import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/SectionTitle";
import { useBooking } from "@/context/BookingContext";
import { useTransitionNav } from "@/hooks/useTransitionNav";
import PageLoader from "@/components/PageLoader";
import { toast } from "sonner";

const plans = [
  { id: "full", name: "Full Day Plan", time: "4 PM – Next Day 2 PM", price: 55000, breakdown: "₹55,000 + ₹7,000 + ₹12,000", featured: true,
    features: ["22 hours hall access", "Bridal & groom rooms", "Generator backup", "Full decor support"] },
  { id: "evening", name: "Evening Plan", time: "4 PM – 10 PM", price: 30000, breakdown: "₹30,000 + ₹5,000 + ₹6,000",
    features: ["6 hours hall access", "Reception ready", "Bridal room", "Generator backup"] },
  { id: "morning", name: "Morning Plan", time: "5 AM – 2 PM", price: 30000, breakdown: "₹30,000 + ₹5,000 + ₹8,000",
    features: ["9 hours hall access", "Muhurtham ready", "Bridal room", "Generator backup"] },
];

export default function Plans() {
  const { state, set } = useBooking();
  const { loading, go } = useTransitionNav(700);

  const select = (p: typeof plans[number]) => {
    toast.success(`${p.name} selected`);
    go("/photography", () => set("plan", { id: p.id, name: p.name, price: p.price }));
  };

  return (
    <>
    <PageLoader show={loading} label="Loading Photography…" />
    <section className="container py-16 md:py-24">
      <SectionTitle eyebrow="Step 2" title="Hall Plans" subtitle="Select the timing that suits your celebration. Common: EB ₹30/unit, Gas ₹220/kg." />
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
              className={`glass-card rounded-3xl p-8 relative transition-all ${
                p.featured ? "ring-2 ring-primary shadow-gold" : ""
              } ${selected ? "ring-2 ring-accent" : ""}`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-gold text-primary-foreground text-xs px-4 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                  <Crown className="h-3 w-3" /> Popular
                </div>
              )}
              <h3 className="font-serif text-3xl mb-2">{p.name}</h3>
              <p className="text-muted-foreground text-sm mb-6">{p.time}</p>
              <p className="font-serif text-5xl gold-text mb-1">₹{p.price.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mb-6">{p.breakdown}</p>
              <ul className="space-y-3 mb-8">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Button onClick={() => select(p)} className={`w-full rounded-full h-12 ${selected ? "bg-accent" : "bg-gradient-gold"} text-primary-foreground hover:opacity-90`}>
                {selected ? "Selected ✓" : "Select Plan"}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </section>
    </>
  );
}
