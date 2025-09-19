import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";
import Login from "./pages/Login";
import Register from "./pages/Register"; // New import
import ClientDashboard from "./pages/ClientDashboard";
import NotFound from "./pages/NotFound";

// Admin Dashboard Imports
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardOverview from "./pages/admin/DashboardOverview";
import Clients from "./pages/admin/Clients";
import Repairs from "./pages/admin/Repairs";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header session={session} />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> {/* New Route */}
                
                {/* Protected Routes for Clients and Admins */}
                <Route element={<ProtectedRoute session={session} allowedRoles={["client", "admin"]} />}>
                  <Route path="/dashboard" element={<ClientDashboard />} />
                </Route>

                {/* Protected Routes for Admins only */}
                <Route element={<ProtectedRoute session={session} allowedRoles={["admin"]} redirectTo="/" />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<DashboardOverview />} />
                    <Route path="overview" element={<DashboardOverview />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="repairs" element={<Repairs />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;