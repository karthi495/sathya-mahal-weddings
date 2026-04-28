import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useTransitionNav } from "@/hooks/useTransitionNav";
import PageLoader from "@/components/PageLoader";

type Lang = "en" | "ta" | "both";

interface Section {
  en: { title: string; points: string[] };
  ta: { title: string; points: string[] };
}

const sections: Section[] = [
  {
    en: {
      title: "Advance Booking Payment",
      points: [
        "Advance booking is required to confirm the date",
        "Booking will be confirmed only after advance payment",
        "Advance amount is non-refundable",
        "Payment must be made to secure your preferred date",
      ],
    },
    ta: {
      title: "முன்பண பதிவு",
      points: [
        "முன்பணம் கட்டிய பிறகே தேதி உறுதி செய்யப்படும்",
        "முன்பணம் திருப்பி வழங்கப்படாது",
      ],
    },
  },
  {
    en: {
      title: "Cancellation Policy",
      points: [
        "Advance payment will not be refunded on cancellation",
        "Any cancellation must be informed in advance",
      ],
    },
    ta: {
      title: "ரத்து கொள்கை",
      points: [
        "முன்பணம் ரத்து செய்தால் திருப்பி வழங்கப்படாது",
        "தேதி மாற்றம் முன்கூட்டியே தெரிவிக்க வேண்டும்",
      ],
    },
  },
  {
    en: {
      title: "Booking Requirements",
      points: ["Valid ID proof must be provided at the time of booking"],
    },
    ta: {
      title: "பதிவு தேவைகள்",
      points: ["முன்பதிவு செய்யும் போது அடையாள ஆவணம் வழங்க வேண்டும்"],
    },
  },
  {
    en: {
      title: "Usage Time Policy",
      points: [
        "Hall usage is limited to the allotted time",
        "Event must be completed within 24 hours",
      ],
    },
    ta: {
      title: "பயன்பாட்டு நேரக் கொள்கை",
      points: [
        "மண்டபம் குறிப்பிட்ட நேரத்தில் பயன்படுத்த வேண்டும்",
        "நிகழ்ச்சி 24 மணி நேரத்தில் முடிக்க வேண்டும்",
      ],
    },
  },
  {
    en: {
      title: "Decorations & Setup",
      points: ["Stage and decoration must be arranged separately"],
    },
    ta: {
      title: "அலங்காரம் & அமைப்பு",
      points: ["மேடை மற்றும் அலங்காரம் தனியாக ஏற்பாடு செய்ய வேண்டும்"],
    },
  },
  {
    en: {
      title: "Cleanliness & Maintenance",
      points: ["Premises must be kept clean", "Any damages will be charged"],
    },
    ta: {
      title: "சுத்தம் & பராமரிப்பு",
      points: [
        "மண்டபம் சுத்தமாக வைத்திருக்க வேண்டும்",
        "சேதம் ஏற்பட்டால் கட்டணம் வசூலிக்கப்படும்",
      ],
    },
  },
  {
    en: { title: "Property Rules", points: ["No damage to walls or property"] },
    ta: {
      title: "சொத்து விதிகள்",
      points: ["சுவர் மற்றும் கட்டிடத்திற்கு சேதம் செய்யக்கூடாது"],
    },
  },
  {
    en: {
      title: "Electricity Usage",
      points: ["Electricity usage must be within limits", "Extra usage will be charged"],
    },
    ta: {
      title: "மின் பயன்பாடு",
      points: ["மின் பயன்பாடு வரம்புக்குள் இருக்க வேண்டும்"],
    },
  },
  {
    en: {
      title: "Sound & Lighting",
      points: ["Sound and lighting must be arranged separately"],
    },
    ta: {
      title: "ஒலி & ஒளி",
      points: ["ஒலி மற்றும் ஒளி வசதிகள் தனியாக ஏற்பாடு செய்ய வேண்டும்"],
    },
  },
  {
    en: {
      title: "Catering Responsibility",
      points: ["Food and catering are customer responsibility"],
    },
    ta: {
      title: "உணவு பொறுப்பு",
      points: ["உணவு மற்றும் சமையல் வாடிக்கையாளர் பொறுப்பு"],
    },
  },
  {
    en: {
      title: "Restrictions",
      points: ["Alcohol and illegal activities are strictly prohibited"],
    },
    ta: {
      title: "தடைகள்",
      points: ["மதுபானம் மற்றும் சட்டவிரோத செயல்கள் தடை"],
    },
  },
  {
    en: { title: "Parking", points: ["Parking is limited and based on availability"] },
    ta: { title: "வாகன நிறுத்தம்", points: ["வாகன நிறுத்தம் வரம்புடன் வழங்கப்படும்"] },
  },
  {
    en: { title: "Final Authority", points: ["Management decision will be final"] },
    ta: { title: "இறுதி அதிகாரம்", points: ["நிர்வாகத்தின் முடிவு இறுதியானது"] },
  },
];

const langLabels = {
  en: { heading: "Terms & Conditions", sub: "Please read our terms and conditions carefully before booking", agree: "I agree to the Terms & Conditions", proceed: "Proceed to Booking" },
  ta: { heading: "விதிமுறைகள் & நிபந்தனைகள்", sub: "முன்பதிவுக்கு முன் விதிமுறைகளை கவனமாக படிக்கவும்", agree: "நான் விதிமுறைகளை ஏற்கிறேன்", proceed: "முன்பதிவுக்கு செல்லவும்" },
};

export default function Terms() {
  const [lang, setLang] = useState<Lang>("en");
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const { loading, go } = useTransitionNav();

  const showEn = lang === "en" || lang === "both";
  const showTa = lang === "ta" || lang === "both";
  const heading = lang === "ta" ? langLabels.ta : langLabels.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/10 via-background to-primary/5 py-8 md:py-14">
      <PageLoader show={loading} />
      <div className="container max-w-5xl">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="rounded-full h-10 px-4 border-primary/20"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          <div className="inline-flex p-1 rounded-full bg-card border border-primary/15 shadow-sm">
            {(["en", "ta", "both"] as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 md:px-4 h-9 text-xs md:text-sm rounded-full font-medium transition-all ${
                  lang === l
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l === "en" ? "English" : l === "ta" ? "தமிழ்" : "Both"}
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 text-accent-foreground text-xs font-medium mb-4 border border-accent/30">
            <ShieldCheck className="h-3.5 w-3.5" /> Sathya Mahal
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-semibold text-foreground tracking-tight">
            {heading.heading}
          </h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            {heading.sub}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {sections.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: idx * 0.04, duration: 0.4 }}
              whileHover={{ y: -3 }}
              className="group relative rounded-2xl bg-card border border-primary/10 shadow-sm hover:shadow-xl hover:border-accent/40 transition-all p-5 md:p-6 overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-accent/5 group-hover:bg-accent/10 transition-colors" />

              <div className="flex items-start gap-4 relative">
                <div className="shrink-0 h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-serif text-lg font-semibold flex items-center justify-center shadow-md">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  {showEn && (
                    <>
                      <h3 className="font-serif text-lg md:text-xl font-semibold text-foreground">
                        {s.en.title}
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {s.en.points.map((p, i) => (
                          <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                            <Check className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {showEn && showTa && (
                    <div className="my-4 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
                  )}

                  {showTa && (
                    <>
                      <h4 className="font-serif text-base md:text-lg font-semibold text-foreground">
                        {s.ta.title}
                      </h4>
                      <ul className="mt-2 space-y-2">
                        {s.ta.points.map((p, i) => (
                          <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                            <Check className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Agreement */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 md:mt-14 rounded-3xl bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5 border border-primary/15 p-6 md:p-10 text-center shadow-lg"
        >
          <ShieldCheck className="h-10 w-10 mx-auto text-accent mb-3" />
          <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-5">
            {lang === "ta" ? "ஒப்புதல்" : "Acknowledgement"}
          </h3>

          <label className="inline-flex items-start md:items-center gap-3 cursor-pointer select-none text-left">
            <Checkbox
              checked={agreed}
              onCheckedChange={v => setAgreed(!!v)}
              className="mt-0.5 md:mt-0 h-5 w-5 border-primary/40"
            />
            <span className="text-sm md:text-base text-foreground">
              {showEn && <span>I agree to the Terms &amp; Conditions</span>}
              {showEn && showTa && <span className="mx-2 text-muted-foreground">·</span>}
              {showTa && <span>நான் விதிமுறைகளை ஏற்கிறேன்</span>}
            </span>
          </label>

          <div className="mt-6">
            <Button
              disabled={!agreed}
              onClick={() => go("/availability")}
              className="h-12 md:h-14 px-8 rounded-full text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:opacity-95 shadow-lg disabled:opacity-50"
            >
              {heading.proceed} →
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
