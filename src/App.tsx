import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ToolsIndex from "./pages/ToolsIndex";
import { EquivalentComponentsPanel } from "./components/EquivalentComponentsPanel";
import { LEDResistorPanel } from "./components/LEDResistorPanel";
import { VoltageDividerPanel } from "./components/VoltageDividerPanel";
import { OhmsLawPanel } from "./components/OhmsLawPanel";
import { UnitConverterPanel } from "./components/UnitConverterPanel";
import { ResistorColorCodePanel } from "./components/ResistorColorCodePanel";
import { BatteryLifePanel } from "./components/BatteryLifePanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<ToolsIndex />} />
            <Route path="/components-equivalent" element={<EquivalentComponentsPanel />} />
            {/* Backward compatibility redirects */}
            <Route path="/resistance" element={<Navigate to="/components-equivalent?type=resistor&config=series" replace />} />
            <Route path="/rlc-equivalent" element={<Navigate to="/components-equivalent" replace />} />
            <Route path="/led" element={<LEDResistorPanel />} />
            <Route path="/divider" element={<VoltageDividerPanel />} />
            <Route path="/ohms" element={<OhmsLawPanel />} />
            <Route path="/units" element={<UnitConverterPanel />} />
            <Route path="/color-code" element={<ResistorColorCodePanel />} />
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
