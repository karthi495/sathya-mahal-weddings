import { motion } from "framer-motion";
import { UtensilsCrossed, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionTitle from "@/components/SectionTitle";
import { useBooking } from "@/context/BookingContext";
import { useTransitionNav } from "@/hooks/useTransitionNav";
import PageLoader from "@/components/PageLoader";
import catering from "@/assets/catering.jpg";

const meals = [
  { id: "basic-meal", name: "Basic Meal", price: 250, desc: "Traditional South Indian thali, rice, sambar, kuzhambu, sweet." },
  { id: "standard-meal", name: "Standard Meal", price: 400, desc: "Multi-cuisine spread with starters, mains and dessert." },
  { id: "premium-meal", name: "Premium Meal", price: 600, desc: "Lavish spread, live counters, premium sweets and beverages." },
];

export default function Catering() {
  const { state, set } = useBooking();
  const { loading, go } = useTransitionNav(700);
  const total = state.catering.meal ? state.catering.meal.price * state.catering.guests : 0;

  return (
    <>
    <PageLoader show={loading} label="Loading Add-ons…" />
    <section className="container py-16 md:py-24">
      <SectionTitle eyebrow="Step 5" title="Catering" subtitle="Delight every guest with our chef-curated menus." />

      <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {meals.map((m, i) => {
          const sel = state.catering.meal?.id === m.id;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className={`glass-card rounded-3xl overflow-hidden ${sel ? "ring-2 ring-primary shadow-gold" : ""}`}
            >
              <div className="h-40 overflow-hidden"><img src={catering} loading="lazy" alt={m.name} className="w-full h-full object-cover" /></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-2xl">{m.name}</h3>
                  <UtensilsCrossed className="text-primary h-5 w-5" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">{m.desc}</p>
                <p className="font-serif text-3xl gold-text mb-4">₹{m.price}<span className="text-base text-muted-foreground"> / plate</span></p>
                <Button
                  onClick={() =>
                    go("/addons", () =>
                      set("catering", { ...state.catering, meal: { id: m.id, name: m.name, price: m.price } })
                    )
                  }
                  className={`w-full rounded-full ${sel ? "bg-accent" : "bg-gradient-gold"} text-primary-foreground hover:opacity-90`}
                >
                  {sel ? "Selected ✓" : "Select Meal"}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="max-w-2xl mx-auto mt-10 glass-card rounded-3xl p-8">
        <Label className="flex items-center gap-2 mb-3"><Users className="h-4 w-4" /> Number of Guests</Label>
        <Input
          type="number"
          min={1}
          value={state.catering.guests}
          onChange={e => set("catering", { ...state.catering, guests: Math.max(1, parseInt(e.target.value) || 0) })}
          className="h-14 text-lg"
        />
        <div className="mt-6 flex items-center justify-between p-4 rounded-2xl bg-gradient-luxe text-primary-foreground">
          <span className="text-sm uppercase tracking-widest opacity-80">Catering Total</span>
          <span className="font-serif text-3xl">₹{total.toLocaleString()}</span>
        </div>
        <Button onClick={() => navigate("/addons")} className="w-full mt-6 rounded-full bg-gradient-gold text-primary-foreground hover:opacity-90 h-12">
          Continue to Add-ons →
        </Button>
      </div>
    </section>
  );
}
