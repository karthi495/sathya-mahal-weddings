import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/SectionTitle";
import { useBooking } from "@/context/BookingContext";
import { useTransitionNav } from "@/hooks/useTransitionNav";
import PageLoader from "@/components/PageLoader";
import photoImg from "@/assets/photography.jpg";

const packages = [
  { id: "basic-photo", name: "Basic Photography", price: 15000, desc: "Traditional event coverage with edited photos." },
  { id: "candid", name: "Candid Photography", price: 25000, desc: "Storytelling moments captured candidly throughout." },
  { id: "premium", name: "Premium Wedding Shoot", price: 50000, desc: "Full team, cinematic video, drone, premium album." },
  { id: "pre-wedding", name: "Pre-Wedding Shoot", price: 30000, desc: "Outdoor location shoot with creative concepts." },
];

export default function Photography() {
  const { state, set } = useBooking();
  const navigate = useNavigate();
  const { loading, go } = useTransitionNav(700);

  return (
    <>
    <PageLoader show={loading} label="Loading Decoration…" />
    <section className="container py-16 md:py-24">
      <SectionTitle eyebrow="Step 3" title="Photography Packages" subtitle="Preserve every emotion with our trusted artists." />
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {packages.map((p, i) => {
          const selected = state.photography?.id === p.id;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className={`glass-card rounded-3xl overflow-hidden group ${selected ? "ring-2 ring-accent shadow-gold" : ""}`}
            >
              <div className="h-48 overflow-hidden">
                <img src={photoImg} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif text-2xl">{p.name}</h3>
                  <Camera className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">{p.desc}</p>
                <div className="flex items-center justify-between">
                  <p className="font-serif text-3xl gold-text">₹{p.price.toLocaleString()}</p>
                  <Button
                    onClick={() =>
                      go("/decoration", () => set("photography", { id: p.id, name: p.name, price: p.price }))
                    }
                    className={`rounded-full ${selected ? "bg-accent" : "bg-gradient-gold"} text-primary-foreground hover:opacity-90`}
                  >
                    {selected ? "Selected ✓" : "Select"}
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="text-center mt-10">
        <Button onClick={() => navigate("/decoration")} variant="outline" className="rounded-full border-primary/40 hover:bg-primary hover:text-primary-foreground">
          Continue to Decoration →
        </Button>
      </div>
    </section>
    </>
  );
}
