import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, FolderPlus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSelectedProject, setSelectedProject, subscribeToSelectedProject } from "@/lib/projectStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [location] = useLocation();
  const [projectName, setProjectName] = useState(getSelectedProject().name);

  const [projects, setProjects] = useState<{ id: string; name: string }[]>([
    { id: "p-1", name: "Office Location Decision" },
    { id: "p-2", name: "Commute Impact Study" },
    { id: "p-3", name: "Board Memo Draft" },
  ]);

  useEffect(() => {
    return subscribeToSelectedProject((p) => setProjectName(p.name));
  }, []);

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Goals", path: "/" },
    { label: "Lab", path: "/lab" },
    { label: "Deliverables", path: "/deliverables" },
  ];

  return (
    <header className="h-[60px] border-b bg-background flex items-center justify-between px-6 fixed top-0 w-full z-50">
      <div className="flex items-center gap-3 font-bold text-lg tracking-tight font-heading">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground" data-testid="img-app-mark">
          A
        </div>
        <span data-testid="text-app-name">AgilityAI</span>

        <div className="hidden md:block h-6 w-px bg-border/70" aria-hidden="true" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              data-testid="dropdown-project-trigger"
              className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-border/50 bg-background/60 hover:bg-muted/40 transition-colors max-w-[280px]"
              title={projectName}
            >
              <span className="text-sm font-semibold text-foreground/90 truncate">{projectName}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-72">
            <div className="px-2 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground" data-testid="text-project-switcher-label">
              Active projects
            </div>

            {projects.map((p) => (
              <DropdownMenuItem
                key={p.id}
                data-testid={`menu-project-${p.id}`}
                onSelect={() => setSelectedProject({ id: p.id, name: p.name })}
              >
                <span className="truncate">{p.name}</span>
                {p.name === projectName && (
                  <span className="ml-auto text-[10px] font-mono text-muted-foreground" data-testid={`text-project-active-${p.id}`}>
                    active
                  </span>
                )}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              data-testid="menu-project-new"
              onSelect={() => {
                const name = window.prompt("Project name", "New Project");
                if (!name) return;

                const summary = window.prompt("Project summary (one paragraph)", "");
                if (summary === null) return;

                const id = `p-${Date.now()}`;
                const next = { id, name };

                setProjects((prev) => [next, ...prev]);
                setSelectedProject(next);

                try {
                  window.localStorage.setItem(`agilityai:projectSummary:${id}`, summary);
                } catch {
                  // ignore
                }
              }}
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="flex items-center bg-muted/50 p-1 rounded-lg">
        <Link href="/dashboard">
          <div
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
              location === "/dashboard"
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            data-testid="tab-dashboard"
          >
            Dashboard
          </div>
        </Link>


        {navItems.slice(1).map((item) => (
          <Link key={item.path} href={item.path}>
            <div
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
                location === item.path
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              data-testid={`tab-${item.label.toLowerCase()}`}
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
