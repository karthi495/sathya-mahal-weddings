import { createContext, useContext, useState, ReactNode } from "react";

export type SelectedItem = { id: string; name: string; price: number; qty?: number };

export interface BookingState {
  customerName: string;
  phone: string;
  functionType: string;
  date: Date | null;
  plan: SelectedItem | null;
  photography: SelectedItem | null;
  decoration: SelectedItem[];
  catering: { meal: SelectedItem | null; guests: number };
  addons: SelectedItem[];
  extras: SelectedItem[];
  ebUnits: number;
  gasKg: number;
}

interface Ctx {
  state: BookingState;
  set: <K extends keyof BookingState>(k: K, v: BookingState[K]) => void;
  toggleItem: (key: "decoration" | "addons" | "extras", item: SelectedItem) => void;
  total: number;
  reset: () => void;
}

const initial: BookingState = {
  customerName: "",
  phone: "",
  functionType: "",
  date: null,
  plan: null,
  photography: null,
  decoration: [],
  catering: { meal: null, guests: 100 },
  addons: [],
  extras: [],
  ebUnits: 0,
  gasKg: 0,
};

const BookingCtx = createContext<Ctx | null>(null);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<BookingState>(initial);
  const set = <K extends keyof BookingState>(k: K, v: BookingState[K]) =>
    setState(s => ({ ...s, [k]: v }));
  const toggleItem = (key: "decoration" | "addons" | "extras", item: SelectedItem) => {
    setState(s => {
      const list = s[key];
      const exists = list.find(i => i.id === item.id);
      return { ...s, [key]: exists ? list.filter(i => i.id !== item.id) : [...list, item] };
    });
  };
  const total =
    (state.plan?.price || 0) +
    (state.photography?.price || 0) +
    state.decoration.reduce((a, b) => a + b.price, 0) +
    (state.catering.meal ? state.catering.meal.price * state.catering.guests : 0) +
    state.addons.reduce((a, b) => a + b.price, 0) +
    state.extras.reduce((a, b) => a + b.price, 0) +
    state.ebUnits * 30 +
    state.gasKg * 220;

  return (
    <BookingCtx.Provider value={{ state, set, toggleItem, total, reset: () => setState(initial) }}>
      {children}
    </BookingCtx.Provider>
  );
};

export const useBooking = () => {
  const c = useContext(BookingCtx);
  if (!c) throw new Error("useBooking outside provider");
  return c;
};
