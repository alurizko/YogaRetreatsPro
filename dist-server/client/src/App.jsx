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
function Router() {
    var _a = useAuth(), isAuthenticated = _a.isAuthenticated, isLoading = _a.isLoading, user = _a.user;
    if (isLoading) {
        return (<div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>);
    }
    return (<>
      <Header />
      <Switch>
        <Route path="/" component={Home}/>
        <Route path="/retreats" component={Retreats}/>
        <Route path="/retreat/:id" component={RetreatDetail}/>
        {isAuthenticated && (user === null || user === void 0 ? void 0 : user.role) === 'organizer' && (<Route path="/organizer/dashboard" component={OrganizerDashboard}/>)}
        {isAuthenticated && (<>
            <Route path="/participant/dashboard" component={ParticipantDashboard}/>
            <Route path="/participant-dashboard" component={ParticipantDashboard}/>
            <Route path="/checkout/:retreatId" component={Checkout}/>
          </>)}
        <Route component={NotFound}/>
      </Switch>
    </>);
}
function App() {
    return (<QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>);
}
export default App;
