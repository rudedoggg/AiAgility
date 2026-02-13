import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, FolderPlus, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSelectedProject, setSelectedProject, subscribeToSelectedProject } from "@/lib/projectStore";

function generateTemplateFromSnippet(projectName: string, snippet: string) {
  const cleaned = snippet.replace(/\s+/g, " ").trim();
  const focus = cleaned.split(/[.?!]/)[0]?.slice(0, 140) || cleaned.slice(0, 140);

  const makeDate = () => new Date().toLocaleDateString([], { month: "short", day: "numeric" });

  return {
    executiveSummary: `# Executive Summary — ${projectName}\n\n## Summary (Seed)\n${snippet}\n\n## Standing Question\nGive me a two-page executive summary of this project.\n`,
    goals: {
      summary: {
        status: `Seeded from the project summary. Next: turn the narrative into explicit goals + constraints.` ,
        done: ["Project seeded"],
        undone: ["Define objective", "List constraints"],
        nextSteps: ["Create 3 goal sections", "Add stakeholders"],
      },
      sections: [
        {
          id: "context",
          genericName: "Context",
          subtitle: "What’s happening and why now",
          completeness: 35,
          totalItems: 3,
          completedItems: 1,
          content: cleaned,
          items: [{ id: `seed-${Date.now()}`, type: "note", title: "Seed summary", preview: snippet, date: makeDate() }],
          isOpen: true,
        },
        {
          id: "objective",
          genericName: "Objective",
          subtitle: "What outcome are we driving",
          completeness: 10,
          totalItems: 3,
          completedItems: 0,
          content: focus ? `Draft objective: ${focus}` : "Draft objective (TBD)",
          items: [],
          isOpen: false,
        },
        {
          id: "stakeholders",
          genericName: "Stakeholders",
          subtitle: "Who must agree / who is impacted",
          completeness: 0,
          totalItems: 3,
          completedItems: 0,
          content: "(TBD)",
          items: [],
          isOpen: false,
        },
        {
          id: "constraints",
          genericName: "Constraints",
          subtitle: "Budget, timing, non-negotiables",
          completeness: 0,
          totalItems: 3,
          completedItems: 0,
          content: "(TBD)",
          items: [],
          isOpen: false,
        },
      ],
    },
    lab: {
      summary: {
        status: `Create buckets that capture the evidence needed to support: “${focus || "the decision"}”.`,
        done: [],
        undone: ["Add first evidence bucket"],
        nextSteps: ["Add sources", "Log assumptions"],
      },
      buckets: [
        {
          id: "research",
          name: "Sources + Evidence",
          isOpen: true,
          items: [{ id: `seed-src-${Date.now()}`, type: "note", title: "What we know so far", preview: snippet, date: makeDate() }],
          bucketMessages: [],
        },
        {
          id: "interviews",
          name: "Open Questions",
          isOpen: false,
          items: [{ id: `seed-q-${Date.now() + 1}`, type: "note", title: "Questions to answer", preview: "(TBD)", date: makeDate() }],
          bucketMessages: [],
        },
      ],
    },
    deliverables: {
      summary: {
        status: "Draft deliverables now, then backfill evidence and tighten the narrative.",
        done: [],
        undone: ["Create deliverable outline"],
        nextSteps: ["Draft v1", "Attach memory items"],
      },
      deliverables: [
        {
          id: "1",
          title: "Decision / Plan Draft",
          subtitle: "Seeded from summary",
          completeness: 15,
          status: "draft",
          lastEdited: "Just now",
          engaged: true,
          items: [{ id: `seed-deliv-${Date.now()}`, type: "note", title: "Seed summary", preview: snippet, date: makeDate() }],
          content: `# ${projectName}\n\n## Seed Summary\n${snippet}\n\n## Draft\n(TBD)\n`,
          bucketMessages: [],
          isOpen: true,
        },
      ],
    },
  };
}
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

  const [projects, setProjects] = useState<{ id: string; name: string }[]>(() => {
    try {
      const raw = window.localStorage.getItem("agilityai:projects");
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed)) {
        const cleaned = parsed
          .filter((p) => p && typeof p.id === "string" && typeof p.name === "string")
          .map((p) => ({ id: p.id, name: p.name }));
        if (cleaned.length) return cleaned;
      }
    } catch {
      // ignore
    }

    return [
      { id: "p-1", name: "Office Location Decision" },
      { id: "p-2", name: "Commute Impact Study" },
      { id: "p-3", name: "Board Memo Draft" },
    ];
  });

  useEffect(() => {
    return subscribeToSelectedProject((p) => setProjectName(p.name));
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("agilityai:projects", JSON.stringify(projects));
    } catch {
      // ignore
    }
  }, [projects]);

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

                try {
                  const snippet = summary.trim();
                  if (snippet) {
                    window.localStorage.setItem(`agilityai:generatedTemplate:${id}`, JSON.stringify(generateTemplateFromSnippet(name, snippet)));
                  }
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground" data-testid="text-settings-menu-label">
              Settings
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem data-testid="menu-settings-preferences" onSelect={() => (window.location.href = "/settings/preferences")}>Preferences</DropdownMenuItem>
            <DropdownMenuItem data-testid="menu-settings-notifications" onSelect={() => (window.location.href = "/settings/notifications")}>Notifications</DropdownMenuItem>
            <DropdownMenuItem data-testid="menu-settings-billing" onSelect={() => (window.location.href = "/settings/billing")}>Billing</DropdownMenuItem>
            <DropdownMenuItem data-testid="menu-settings-projects" onSelect={() => (window.location.href = "/settings/projects")}>Projects</DropdownMenuItem>
            <DropdownMenuItem data-testid="menu-settings-help" onSelect={() => (window.location.href = "/support")}>Help & Support</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-8 w-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-medium text-sm hover:opacity-90 transition-opacity"
              data-testid="button-user"
              aria-label="User menu"
            >
              JD
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-2">
              <div className="text-sm font-semibold" data-testid="text-user-name">JD</div>
              <div className="text-xs text-muted-foreground" data-testid="text-user-email">jd@example.com</div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem data-testid="menu-user-profile" onSelect={() => (window.location.href = "/account/profile")}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="menu-user-account" onSelect={() => (window.location.href = "/account")}>Account</DropdownMenuItem>
            <DropdownMenuItem data-testid="menu-user-security" onSelect={() => (window.location.href = "/account/security")}>Security</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem data-testid="menu-user-signout" onSelect={() => window.alert("Signed out (mock)")}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
