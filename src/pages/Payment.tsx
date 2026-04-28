import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle2, MessageCircle, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/SectionTitle";
import { useBooking } from "@/context/BookingContext";
import { useTransitionNav } from "@/hooks/useTransitionNav";
import PageLoader from "@/components/PageLoader";
import { toast } from "sonner";
import gpayQr from "@/assets/gpay-qr.jpg";

const OWNER_UPI = "sathyamahal@okicici";
const OWNER_WHATSAPP = "919999999999";

export default function Payment() {
  const { state, total } = useBooking();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { loading, go } = useTransitionNav(900);

  const onPick = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please upload an image of your payment screenshot");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    toast.success("Screenshot attached ✓");
  };

  const buildMessage = () => {
    const services = [
      state.plan?.name,
      state.photography?.name,
      ...state.decoration.map(d => d.name),
      state.catering.meal && `${state.catering.meal.name} (${state.catering.guests} guests)`,
      ...state.addons.map(a => a.name),
    ].filter(Boolean).join(", ");
    return `Hello, I have completed the advance payment for Sathya Mahal booking.%0A%0AName: ${state.customerName || "-"}%0APhone: ${state.phone || "-"}%0ADate: ${state.date ? state.date.toDateString() : "-"}%0APlan: ${state.plan?.name || "-"}%0AServices: ${services || "-"}%0ATotal: ₹${total.toLocaleString()}%0A%0APayment screenshot attached separately.`;
  };

  const sendToWhatsApp = () => {
    if (!file) {
      toast.error("Please upload your payment screenshot first");
      return;
    }
    const url = `https://wa.me/${OWNER_WHATSAPP}?text=${buildMessage()}`;
    // Brief loading flourish, then open WhatsApp in a new tab
    go("/summary", () => {
      window.open(url, "_blank", "noopener,noreferrer");
    });
  };

  return (
    <>
      <PageLoader show={loading} label="Opening WhatsApp…" />
      <section className="container py-16 md:py-24">
        <SectionTitle
          eyebrow="Payment"
          title="Pay & Confirm"
          subtitle="Scan the GPay QR, pay the advance, then upload your payment screenshot to confirm."
        />

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* QR / Owner details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-3xl p-8 text-center"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">Scan to Pay</p>
            <h3 className="font-serif text-3xl gold-text mb-6">Sathya Mahal</h3>
            <div className="relative inline-block rounded-2xl overflow-hidden shadow-gold mb-6">
              <img
                src={gpayQr}
                alt="GPay QR Code for Sathya Mahal"
                width={320}
                height={320}
                className="w-72 h-72 object-cover"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">UPI ID</p>
              <p className="font-mono text-lg select-all">{OWNER_UPI}</p>
            </div>
            <div className="mt-6 p-4 rounded-2xl bg-gradient-luxe text-primary-foreground">
              <p className="text-xs uppercase tracking-widest opacity-70">Amount to Pay</p>
              <p className="font-serif text-4xl">₹{total.toLocaleString()}</p>
            </div>
          </motion.div>

          {/* Upload screenshot */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card rounded-3xl p-8 flex flex-col"
          >
            <h3 className="font-serif text-2xl mb-2">Upload Payment Screenshot</h3>
            <p className="text-sm text-muted-foreground mb-6">
              After paying, attach a screenshot of your GPay receipt so we can verify and confirm your booking on WhatsApp.
            </p>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => onPick(e.target.files?.[0] || null)}
            />

            <button
              onClick={() => inputRef.current?.click()}
              className={`flex-1 min-h-[220px] rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 p-6 ${
                preview
                  ? "border-primary bg-primary/5"
                  : "border-primary/30 hover:border-primary hover:bg-primary/5"
              }`}
            >
              {preview ? (
                <>
                  <img src={preview} alt="Payment screenshot preview" className="max-h-48 rounded-xl shadow-soft" />
                  <span className="text-sm text-primary font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Screenshot attached — tap to change
                  </span>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-full bg-gradient-gold text-primary-foreground">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="font-serif text-lg">Tap to upload screenshot</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" /> PNG, JPG accepted
                  </p>
                </>
              )}
            </button>

            <Button
              onClick={sendToWhatsApp}
              disabled={!file}
              className="w-full mt-6 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-base font-medium shadow-gold disabled:opacity-50"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Send to WhatsApp & Confirm
            </Button>
            <p className="text-[11px] text-center text-muted-foreground mt-3">
              You'll be redirected to WhatsApp. Please attach the same screenshot in the chat to complete confirmation.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
