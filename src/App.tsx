import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ToolsIndex from "./pages/ToolsIndex";
import { EquivalentResistancePanel } from "./components/EquivalentResistancePanel";
import { LEDResistorPanel } from "./components/LEDResistorPanel";
import { VoltageDividerPanel } from "./components/VoltageDividerPanel";
import { RCTimeConstantPanel } from "./components/RCTimeConstantPanel";
import { OhmsLawPanel } from "./components/OhmsLawPanel";
import { UnitConverterPanel } from "./components/UnitConverterPanel";
import { ResistorColorCodePanel } from "./components/ResistorColorCodePanel";
import { RLCEquivalentPanel } from "./components/RLCEquivalentPanel";
import { BatteryLifePanel } from "./components/BatteryLifePanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="dark">
          <Routes>
            <Route path="/" element={<ToolsIndex />} />
            <Route path="/resistance" element={<EquivalentResistancePanel />} />
            <Route path="/led" element={<LEDResistorPanel />} />
            <Route path="/divider" element={<VoltageDividerPanel />} />
            <Route path="/rc" element={<RCTimeConstantPanel />} />
            <Route path="/ohms" element={<OhmsLawPanel />} />
            <Route path="/units" element={<UnitConverterPanel />} />
            <Route path="/color-code" element={<ResistorColorCodePanel />} />
            <Route path="/rlc-equivalent" element={<RLCEquivalentPanel />} />
            <Route path="/battery-life" element={<BatteryLifePanel />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
