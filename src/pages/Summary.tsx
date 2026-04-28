import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionTitle from "@/components/SectionTitle";
import { useBooking } from "@/context/BookingContext";
import { CreditCard } from "lucide-react";
import { useTransitionNav } from "@/hooks/useTransitionNav";
import PageLoader from "@/components/PageLoader";
import { toast } from "sonner";

export default function Summary() {
  const { state, set, total } = useBooking();
  const { loading, go } = useTransitionNav(700);

  const proceed = () => {
    if (!total) {
      toast.error("Please select a plan and services first");
      return;
    }
    go("/payment");
  };

  const lines: { label: string; value: string }[] = [];
  if (state.plan) lines.push({ label: "Plan", value: `${state.plan.name} — ₹${state.plan.price.toLocaleString()}` });
  if (state.photography) lines.push({ label: "Photography", value: `${state.photography.name} — ₹${state.photography.price.toLocaleString()}` });
  if (state.decoration.length) lines.push({ label: "Decoration", value: state.decoration.map(d => `${d.name} (₹${d.price.toLocaleString()})`).join(", ") });
  if (state.catering.meal) lines.push({ label: "Catering", value: `${state.catering.meal.name} × ${state.catering.guests} = ₹${(state.catering.meal.price * state.catering.guests).toLocaleString()}` });
  if (state.addons.length) lines.push({ label: "Add-ons", value: state.addons.map(a => `${a.name} (₹${a.price.toLocaleString()})`).join(", ") });
  if (state.ebUnits) lines.push({ label: "EB Units", value: `${state.ebUnits} × ₹30 = ₹${(state.ebUnits * 30).toLocaleString()}` });
  if (state.gasKg) lines.push({ label: "Gas", value: `${state.gasKg}kg × ₹220 = ₹${(state.gasKg * 220).toLocaleString()}` });

  const buildMessage = () => {
    const services = [
      state.plan?.name,
      state.photography?.name,
      ...state.decoration.map(d => d.name),
      state.catering.meal && `${state.catering.meal.name} (${state.catering.guests} guests)`,
      ...state.addons.map(a => a.name),
    ].filter(Boolean).join(", ");
    return `Hello, I want to book Sathya Mahal%0A%0AName: ${state.customerName || "-"}%0ADate: ${state.date ? state.date.toDateString() : "-"}%0APlan: ${state.plan?.name || "-"}%0AServices Selected: ${services || "-"}%0ATotal Cost: ₹${total.toLocaleString()}`;
  };

  return (
    <section className="container py-16 md:py-24">
      <SectionTitle eyebrow="Final Step" title="Booking Summary" subtitle="Review your selections and confirm via WhatsApp." />

      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-8">
          <div className="grid sm:grid-cols-2 gap-4 pb-6 border-b border-border/50">
            <div><p className="text-xs uppercase tracking-widest text-muted-foreground">Name</p><p className="font-serif text-xl">{state.customerName || "—"}</p></div>
            <div><p className="text-xs uppercase tracking-widest text-muted-foreground">Phone</p><p className="font-serif text-xl">{state.phone || "—"}</p></div>
            <div><p className="text-xs uppercase tracking-widest text-muted-foreground">Function</p><p className="font-serif text-xl capitalize">{state.functionType || "—"}</p></div>
            <div><p className="text-xs uppercase tracking-widest text-muted-foreground">Date</p><p className="font-serif text-xl">{state.date ? state.date.toDateString() : "—"}</p></div>
          </div>

          <div className="py-6 space-y-4">
            {lines.length ? lines.map(l => (
              <div key={l.label} className="flex justify-between gap-4 pb-3 border-b border-border/30 last:border-0">
                <span className="text-sm text-muted-foreground uppercase tracking-widest">{l.label}</span>
                <span className="text-right font-medium">{l.value}</span>
              </div>
            )) : <p className="text-center text-muted-foreground italic">No selections yet. Please pick a plan and services.</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <div>
              <Label>EB Units Used</Label>
              <Input type="number" min={0} value={state.ebUnits} onChange={e => set("ebUnits", Math.max(0, parseInt(e.target.value) || 0))} className="mt-2 h-12" />
            </div>
            <div>
              <Label>Gas (kg)</Label>
              <Input type="number" min={0} value={state.gasKg} onChange={e => set("gasKg", Math.max(0, parseInt(e.target.value) || 0))} className="mt-2 h-12" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-luxe text-primary-foreground rounded-3xl p-8 shadow-gold"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] opacity-70 mb-2">Final Total</p>
              <p className="font-serif text-5xl">₹{total.toLocaleString()}</p>
            </div>
            <a
              href={`https://wa.me/919999999999?text=${buildMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20bd5a] transition-colors text-white px-6 py-4 rounded-full flex items-center gap-2 font-medium shadow-soft"
            >
              <MessageCircle className="h-5 w-5" /> Confirm Booking
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
