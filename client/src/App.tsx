import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Home from "@/pages/home";
import Retreats from "@/pages/retreats";
import RetreatDetail from "@/pages/retreat-detail";
import OrganizerDashboard from "@/pages/organizer-dashboard";
import ParticipantDashboard from "@/pages/participant-dashboard";
import Checkout from "@/pages/checkout";
import NotFound from "@/pages/not-found";
import ResetPassword from "@/pages/reset-password";
import AuthPage from "@/pages/auth";
import AddRetreat from "@/pages/add-retreat";
import InquiriesPage from "@/pages/inquiries";
import MyTrips from "./pages/my-trips";
import Support from "./pages/support";
import RetreatCategories from "./pages/retreat-categories";
import Profile from "./pages/profile";
import MyBookings from "./pages/my-bookings";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <>
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/retreats" component={Retreats} />
        <Route path="/retreat/:id" component={RetreatDetail} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/my-trips" component={MyTrips} />
        <Route path="/support" component={Support} />
        <Route path="/categories" component={RetreatCategories} />
        <Route path="/profile" component={Profile} />
        <Route path="/inquiries" component={InquiriesPage} />
        <Route path="/my-bookings" component={MyBookings} />
        <Route path="/my-trips" component={MyTrips} />
        <Route path="/organizer/add-retreat" component={AddRetreat} />
        {isAuthenticated && user?.role === 'organizer' && (
          <Route path="/organizer/dashboard" component={OrganizerDashboard} />
        )}
        {isAuthenticated && (
          <>
            <Route path="/checkout/:retreatId" component={Checkout} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
