import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useHealthCheck, getHealthCheckQueryKey } from "@workspace/api-client-react";

export function Layout({ children }: { children: ReactNode }) {
  useHealthCheck({ query: { queryKey: getHealthCheckQueryKey(), refetchInterval: 60000, retry: false } });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64 flex flex-col min-h-screen">
        <div className="flex-1 w-full max-w-6xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}