import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Search, 
  CalendarDays, 
  PhoneForwarded, 
  MessageSquare, 
  MapPin, 
  Tags, 
  FileText,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/search", label: "Global Search", icon: Search },
  { href: "/scheduling", label: "Scheduling Rules", icon: CalendarDays },
  { href: "/routing", label: "Department Routing", icon: PhoneForwarded },
  { href: "/scripts", label: "Call Scripts", icon: MessageSquare },
  { href: "/locations", label: "Locations", icon: MapPin },
  { href: "/providers", label: "Provider Directory", icon: Users },
  { href: "/disposition", label: "Disposition Codes", icon: Tags },
  { href: "/notes", label: "My Notes", icon: FileText },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-sm shrink-0 shadow-sm" />
          <span className="truncate">BG Reference App</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium tracking-wide">
          COMMAND CENTER
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = location === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20">
              AS
            </div>
            <div>
              <p className="text-sm font-medium">Agent 47</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}