import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionTitle from "@/components/SectionTitle";
import { useBooking } from "@/context/BookingContext";
import { CreditCard, Download } from "lucide-react";
import { useTransitionNav } from "@/hooks/useTransitionNav";
import PageLoader from "@/components/PageLoader";
import { toast } from "sonner";
import jsPDF from "jspdf";

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
  if (state.extras.length) lines.push({ label: "Extras", value: state.extras.map(a => `${a.name}`).join(", ") });
  if (state.ebUnits) lines.push({ label: "EB Units", value: `${state.ebUnits} × ₹30 = ₹${(state.ebUnits * 30).toLocaleString()}` });
  if (state.gasKg) lines.push({ label: "Gas", value: `${state.gasKg}kg × ₹220 = ₹${(state.gasKg * 220).toLocaleString()}` });

  const downloadPdf = () => {
    if (!total) {
      toast.error("Please select a plan and services first");
      return;
    }
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    let y = 60;

    // Header
    doc.setFillColor(212, 175, 55);
    doc.rect(0, 0, pageW, 90, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("Sathya Mahal", pageW / 2, 45, { align: "center" });
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.text("Where Traditions Meet Elegance", pageW / 2, 65, { align: "center" });

    y = 130;
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Booking Summary", 50, y);

    // Pending status badge (top-right)
    const badgeW = 90;
    const badgeH = 24;
    const badgeX = pageW - 50 - badgeW;
    const badgeY = y - 18;
    doc.setFillColor(255, 243, 205);
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.8);
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 12, 12, "FD");
    doc.setTextColor(146, 64, 14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("STATUS: PENDING", badgeX + badgeW / 2, badgeY + 16, { align: "center" });

    y += 10;
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1.5);
    doc.line(50, y, pageW - 50, y);
    y += 30;

    // Customer details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Customer Details", 50, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const cust = [
      ["Name", state.customerName || "-"],
      ["Phone", state.phone || "-"],
      ["Function", state.functionType || "-"],
      ["Date", state.date ? state.date.toDateString() : "-"],
    ];
    cust.forEach(([k, v]) => {
      doc.setTextColor(120, 120, 120);
      doc.text(`${k}:`, 60, y);
      doc.setTextColor(30, 30, 30);
      doc.text(String(v), 160, y);
      y += 18;
    });

    y += 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text("Selected Services", 50, y);
    y += 8;
    doc.setDrawColor(220, 220, 220);
    doc.line(50, y, pageW - 50, y);
    y += 18;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    if (lines.length === 0) {
      doc.setTextColor(150, 150, 150);
      doc.text("No selections.", 60, y);
      y += 18;
    } else {
      lines.forEach(l => {
        doc.setTextColor(120, 120, 120);
        doc.text(`${l.label}:`, 60, y);
        doc.setTextColor(30, 30, 30);
        const wrapped = doc.splitTextToSize(l.value, pageW - 220);
        doc.text(wrapped, 160, y);
        y += 18 * wrapped.length;
        if (y > 720) {
          doc.addPage();
          y = 60;
        }
      });
    }

    y += 20;
    doc.setFillColor(45, 36, 28);
    doc.roundedRect(50, y, pageW - 100, 60, 8, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("FINAL TOTAL", 70, y + 25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(`Rs. ${total.toLocaleString()}`, pageW - 70, y + 38, { align: "right" });

    y += 90;
    doc.setTextColor(120, 120, 120);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text(
      `Generated on ${new Date().toLocaleString()}  |  Sathya Mahal Marriage Hall`,
      pageW / 2,
      y,
      { align: "center" }
    );

    const safeName = (state.customerName || "guest").replace(/[^a-z0-9]/gi, "_");
    doc.save(`SathyaMahal_Booking_${safeName}.pdf`);
    toast.success("Booking summary downloaded ✓");
  };

  return (
    <>
    <PageLoader show={loading} label="Opening payment…" />
    <section className="container py-16 md:py-24">
      <SectionTitle eyebrow="Final Step" title="Booking Summary" subtitle="Review your selections and confirm via WhatsApp." />

      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-8">
          <div className="flex items-center justify-between pb-6 border-b border-border/50">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Booking Status</p>
              <p className="font-serif text-2xl mt-1">Awaiting Payment & Confirmation</p>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold uppercase tracking-widest">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Pending
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 py-6 border-b border-border/50">
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] opacity-70 mb-2">Final Total</p>
              <p className="font-serif text-5xl">₹{total.toLocaleString()}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={downloadPdf}
                variant="outline"
                className="bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground px-5 py-6 rounded-full flex items-center gap-2 font-medium h-auto backdrop-blur"
              >
                <Download className="h-5 w-5" /> Download Summary
              </Button>
              <Button
                onClick={proceed}
                className="bg-gradient-gold text-primary-foreground hover:opacity-90 px-6 py-6 rounded-full flex items-center gap-2 font-medium shadow-soft h-auto"
              >
                <CreditCard className="h-5 w-5" /> Confirm Booking
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    </>
  );
}
