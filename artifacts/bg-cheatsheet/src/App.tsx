import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import SearchPage from "@/pages/Search";
import Scheduling from "@/pages/Scheduling";
import Routing from "@/pages/Routing";
import Scripts from "@/pages/Scripts";
import Locations from "@/pages/Locations";
import Disposition from "@/pages/Disposition";
import Notes from "@/pages/Notes";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/search" component={SearchPage} />
        <Route path="/scheduling" component={Scheduling} />
        <Route path="/routing" component={Routing} />
        <Route path="/scripts" component={Scripts} />
        <Route path="/locations" component={Locations} />
        <Route path="/disposition" component={Disposition} />
        <Route path="/notes" component={Notes} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
