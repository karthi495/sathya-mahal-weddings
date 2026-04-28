import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BookingProvider } from "@/context/BookingContext";
import Layout from "@/components/Layout";
import Home from "./pages/Home";
import Availability from "./pages/Availability";
import Plans from "./pages/Plans";
import Photography from "./pages/Photography";
import Decoration from "./pages/Decoration";
import Catering from "./pages/Catering";
import Addons from "./pages/Addons";
import Summary from "./pages/Summary";
import Payment from "./pages/Payment";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BookingProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/availability" element={<Availability />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/photography" element={<Photography />} />
              <Route path="/decoration" element={<Decoration />} />
              <Route path="/catering" element={<Catering />} />
              <Route path="/addons" element={<Addons />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </BookingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
