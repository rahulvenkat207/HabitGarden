import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useStore } from '@/state/useStore';
import { useEffect } from 'react';
import { authService } from '@/lib/api';
import Landing from "./pages/Landing";
import { Habits } from "./pages/Habits";
import Garden from "./pages/Garden";
import Signin from "./pages/Signin";
import NotFound from "./pages/NotFound";

// Add Account page import
import Account from "./pages/Account.tsx";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useStore();
  
  // Show loading state while auth status is being determined
  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center">Checking authentication...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

// Public only route component (redirects authenticated users)
const PublicOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useStore();
  
  // Show loading state while auth status is being determined
  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center">Checking authentication...</div>;
  }
  
  return !isAuthenticated ? children : <Navigate to="/habits" replace />;
};

const App = () => {
  const { checkAuthStatus } = useStore();

  // Check for existing session on app load and listen for auth state changes
  useEffect(() => {
    // Check initial auth status
    checkAuthStatus();
    
    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        useStore.setState({ isAuthenticated: true });
      } else {
        useStore.setState({ isAuthenticated: false });
      }
    });
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [checkAuthStatus]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={
              <PublicOnlyRoute>
                <Signin />
              </PublicOnlyRoute>
            } />
            <Route path="/habits" element={
              <ProtectedRoute>
                <Habits />
              </ProtectedRoute>
            } />
            <Route path="/garden" element={
              <ProtectedRoute>
                <Garden />
              </ProtectedRoute>
            } />
            {/* Add Account route */}
            <Route path="/account" element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;