import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { CommandPalette } from "@/components/CommandPalette";
import { useHealthCheck, getHealthCheckQueryKey } from "@workspace/api-client-react";

export function Layout({ children }: { children: ReactNode }) {
  useHealthCheck({ query: { queryKey: getHealthCheckQueryKey(), refetchInterval: 60000, retry: false } });
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onOpenSearch={() => setCmdOpen(true)} />
      <main className="pl-64 flex flex-col min-h-screen">
        <div className="flex-1 w-full max-w-6xl mx-auto p-8">
          {children}
        </div>
      </main>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
