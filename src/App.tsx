import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CursorProvider } from "./components/CursorContext";
import CustomCursor from "./components/CustomCursor.tsx";
import Projects from "./pages/Projects.tsx";

// Secondary routes are code-split so the landing page ships the smallest bundle.
const Projects02 = lazy(() => import("./pages/Projects02.tsx"));
const Offering = lazy(() => import("./pages/Offering.tsx"));
const Auth = lazy(() => import("./pages/Auth.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CursorProvider>
        <Toaster />
        <Sonner />
        <CustomCursor />
        <BrowserRouter>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Projects />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects_02" element={<Projects02 />} />
              <Route path="/brand-sprints" element={<Offering />} />
              <Route path="/inner-circle" element={<Offering />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CursorProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
