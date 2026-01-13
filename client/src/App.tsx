import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Executive from "./pages/Executive";
import Scenarios from "./pages/Scenarios";
import Compensation from "./pages/Compensation";
import DataDrill from "./pages/DataDrill";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Executive} />
      <Route path={"/cenarios"} component={Scenarios} />
      <Route path={"/compensacao"} component={Compensation} />
      <Route path={"/dados"} component={DataDrill} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
