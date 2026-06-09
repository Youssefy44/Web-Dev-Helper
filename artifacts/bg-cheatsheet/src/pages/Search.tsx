import { useState, useEffect, useRef } from "react";
import { useSearchContent, getSearchContentQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Search as SearchIcon, X, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const sectionColors: Record<string, string> = {
  "Patient Types": "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  "Appointment Types": "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200",
  "Scheduling Rules": "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
  "Location Rules": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
  "Location Abbreviations": "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200",
  "Department Routing": "bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200",
  "Insurance": "bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200",
  "Waitlist": "bg-pink-100 text-pink-800 dark:bg-pink-900/60 dark:text-pink-200",
  "Call Scripts": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200",
  "Call Procedures": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200",
  "Demographics": "bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200",
  "HIPAA": "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200",
  "Disposition Codes": "bg-slate-100 text-slate-800 dark:bg-slate-900/60 dark:text-slate-200",
  "Tools": "bg-lime-100 text-lime-800 dark:bg-lime-900/60 dark:text-lime-200",
  "Referral Guidelines": "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/60 dark:text-fuchsia-200",
  "KPI Goals": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-200",
  "Quick Reference": "bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200",
  "Medical Titles": "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200",
  "Event Types": "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200",
  "Additional Info": "bg-gray-100 text-gray-800 dark:bg-gray-900/60 dark:text-gray-200",
};

function getSectionColor(section: string) {
  return sectionColors[section] ?? "bg-primary/10 text-primary";
}

export default function SearchPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const { data: results, isLoading } = useSearchContent(
    { q: debouncedQuery },
    { query: { enabled: debouncedQuery.trim().length > 0, queryKey: getSearchContentQueryKey({ q: debouncedQuery }) } }
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="space-y-6" data-testid="search-page">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Global Search</h1>
        <p className="text-sm text-muted-foreground mt-1">Search across all scheduling rules, scripts, routing, and reference content</p>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          data-testid="search-input"
          type="search"
          placeholder="Search for a rule, procedure, department, script..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 h-11 text-base"
        />
        {query && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setQuery("")}
            data-testid="search-clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {debouncedQuery.trim().length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <SearchIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">Start typing to search the reference</p>
          <p className="text-xs mt-1">Try: "HFU", "DAP", "warm transfer", "waitlist", "colonoscopy"</p>
        </div>
      )}

      {isLoading && debouncedQuery.trim().length > 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">Searching...</div>
      )}

      {!isLoading && results && results.length === 0 && debouncedQuery.trim().length > 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm font-medium">No results for "{debouncedQuery}"</p>
          <p className="text-xs mt-1">Try different keywords or check spelling</p>
        </div>
      )}

      {results && results.length > 0 && (
        <div className="space-y-3" data-testid="search-results">
          <p className="text-xs text-muted-foreground">{results.length} result{results.length !== 1 ? "s" : ""} for "<span className="font-medium">{debouncedQuery}</span>"</p>
          {results.map((result, i) => (
            <Card key={i} className="border border-border hover:border-primary/30 hover:shadow-sm transition-all" data-testid={`search-result-${i}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getSectionColor(result.section)}`}>
                        {result.section}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">{result.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{result.content}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.tags.slice(0, 5).map((tag) => (
                        <span key={tag} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
