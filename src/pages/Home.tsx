import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import hero from "@/assets/hero-hall.jpg";
import featureHall from "@/assets/feature-hall.jpg";
import featureParking from "@/assets/feature-parking.jpg";
import featureAc from "@/assets/feature-ac.jpg";
import featureDining from "@/assets/feature-dining.jpg";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";

const showcase = [
  { title: "Prestigious Grand Hall", image: featureHall },
  { title: "Large Parking Facilities", image: featureParking },
  { title: "Fully Air Conditioned", image: featureAc },
  { title: "Spacious Dining Hall", image: featureDining },
];

const plans = [
  { name: "Full Day", time: "4 PM – Next Day 2 PM", price: "₹55,000+" },
  { name: "Evening", time: "4 PM – 10 PM", price: "₹30,000+" },
  { name: "Morning", time: "5 AM – 2 PM", price: "₹30,000+" },
];
const testimonials = [
  { name: "Priya & Arjun", text: "Our wedding was absolutely magical at Sathya Mahal. Every detail was perfect.", rating: 5 },
  { name: "Lakshmi Family", text: "Beautiful hall, exceptional service. Our guests are still talking about it!", rating: 5 },
  { name: "Karthik Iyer", text: "From decor to catering, everything exceeded expectations. Highly recommended.", rating: 5 },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[92vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={hero} alt="Sathya Mahal grand hall" className="w-full h-full object-cover animate-slow-zoom" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 text-center text-white px-6 max-w-4xl"
        >
          <p className="text-xs md:text-sm tracking-[0.5em] uppercase mb-6 text-primary-glow">✦ Est. 1998 ✦</p>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light mb-6">Sathya Mahal</h1>
          <p className="font-serif italic text-2xl md:text-3xl mb-10 text-primary-glow">Where Traditions Meet Elegance</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-gold rounded-full px-8 h-14 text-base">
              <Link to="/availability">Check Availability</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white/40 backdrop-blur hover:bg-white/20 rounded-full px-8 h-14 text-base">
              <Link to="/plans">View Plans</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* PLANS PREVIEW */}
      <section className="container py-24">
        <SectionTitle eyebrow="Our Packages" title="Curated Hall Plans" subtitle="Choose the perfect timing for your sacred celebration." />
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="glass-card rounded-2xl p-8 text-center group"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Plan</p>
              <h3 className="font-serif text-3xl mb-2">{p.name}</h3>
              <p className="text-muted-foreground mb-6">{p.time}</p>
              <p className="font-serif text-4xl gold-text mb-6">{p.price}</p>
              <Button asChild variant="outline" className="rounded-full border-primary/40 hover:bg-primary hover:text-primary-foreground">
                <Link to="/plans">Explore</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-secondary/40 py-24">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <motion.img
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            src={decor}
            alt="Sathya Mahal mandap decoration"
            loading="lazy"
            className="rounded-3xl shadow-soft"
          />
          <div>
            <SectionTitle eyebrow="Why Sathya Mahal" title="Crafted For Your Big Day" />
            <div className="grid grid-cols-2 gap-5">
              {features.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-2xl p-6 flex flex-col items-start gap-3"
                >
                  <div className="p-3 rounded-xl bg-gradient-gold text-primary-foreground"><f.icon className="h-5 w-5" /></div>
                  <p className="font-medium">{f.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container py-24">
        <SectionTitle eyebrow="Happy Couples" title="Words From Our Families" />
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-8"
            >
              <div className="flex gap-1 mb-4 text-primary-glow">
                {Array.from({ length: t.rating }).map((_, idx) => <Star key={idx} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="italic text-foreground/80 mb-6 leading-relaxed">"{t.text}"</p>
              <p className="font-serif text-xl">— {t.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-luxe text-primary-foreground rounded-3xl p-12 md:p-16 text-center shadow-gold relative overflow-hidden"
        >
          <Sparkles className="absolute top-6 left-6 h-6 w-6 opacity-40" />
          <Sparkles className="absolute bottom-6 right-6 h-6 w-6 opacity-40" />
          <h2 className="font-serif text-4xl md:text-5xl mb-4">Begin Your Journey With Us</h2>
          <p className="opacity-80 mb-8 max-w-xl mx-auto">Reserve Sathya Mahal for an unforgettable celebration of love and tradition.</p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-10 h-14">
            <Link to="/availability">Book Your Date</Link>
          </Button>
        </motion.div>
      </section>
    </>
  );
}
