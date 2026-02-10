import { Link, useLocation } from "wouter";
import { User, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [location] = useLocation();

  const navItems = [
    { label: "Goals", path: "/" },
    { label: "Lab", path: "/lab" },
    { label: "Deliverables", path: "/deliverables" },
  ];

  return (
    <header className="h-[60px] border-b bg-background flex items-center justify-between px-6 fixed top-0 w-full z-50">
      <div className="flex items-center gap-2 font-bold text-lg tracking-tight font-heading">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
          A
        </div>
        <span>AgilityAI</span>
      </div>

      <nav className="flex items-center bg-muted/50 p-1 rounded-lg">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
                location === item.path
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </div>
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="w-5 h-5" />
        </Button>
        <div className="h-8 w-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-medium text-sm">
          JD
        </div>
      </div>
    </header>
  );
}
