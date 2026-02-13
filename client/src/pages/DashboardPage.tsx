import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { SummaryCard } from "@/components/shared/SummaryCard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { getSelectedProject, setSelectedProject } from "@/lib/projectStore";

type Project = {
  id: string;
  name: string;
  createdAtLabel: string;
};

function generateExecutiveSummary(projectName: string) {
  return `# Executive Summary — ${projectName}

## Standing Question
Give me a two-page executive summary of this project.

## Summary (Draft)
This project is focused on making decision-making and project delivery more structured, transparent, and repeatable by combining goals, research buckets, and deliverables into a single workflow. The core experience is a split workspace that pairs navigation and AI assistance with clearly scoped, expandable buckets that collect attachments and conversation history.

Over the current iteration, the interface has converged on a consistent bucket system across Goals, Lab, and Deliverables: each bucket has uniform actions (note/upload/link/update), an attachments panel, and an activity/history surface. The addition of bucket-scoped chat creates a second layer of AI support—one global conversation that understands the whole page, and one local conversation per bucket that stays constrained to that bucket’s attachments and thread. This supports a more disciplined operating model where context is explicit and boundaries are clear.

Key strengths of the current approach include consistent UX patterns across sections, fast capture of artifacts (files/links/notes), and clear separation between global and scoped conversations. The primary risks are around long-term persistence, cross-project organization, and governance of what “progress” means. Today’s progress calculation is a placeholder heuristic and should later be replaced by an AI-driven assessment aligned to explicit criteria per bucket type.

## Current Focus
1. Stabilize and refine the Dashboard as a project-level control plane.
2. Improve the save workflow so AI outputs can be routed to the correct bucket destination.
3. Continue harmonizing layouts and interaction patterns to reduce cognitive load.

## Recommended Next Steps
- Define a project schema (even if still client-only) so Goals/Lab/Deliverables can be tied to a selected project.
- Introduce a consistent “AI outputs” attachment type, with metadata such as source (global chat vs bucket chat) and timestamp.
- Add light-weight filtering/search in attachments, and consider pinning high-priority items.
`;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([
    { id: "p-1", name: "Office Location Decision", createdAtLabel: "Created Feb 7" },
    { id: "p-2", name: "Commute Impact Study", createdAtLabel: "Created Feb 9" },
    { id: "p-3", name: "Board Memo Draft", createdAtLabel: "Created Feb 10" },
  ]);

  const initialSelected = getSelectedProject();
  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    const exists = projects.some((p) => p.id === initialSelected.id);
    return exists ? initialSelected.id : (projects[0]?.id || "");
  });
  const activeProject = useMemo(() => projects.find((p) => p.id === activeProjectId) || projects[0], [projects, activeProjectId]);

  const [executiveSummary, setExecutiveSummary] = useState<string>(() => {
    const initialProject = projects.find((p) => p.id === initialSelected.id) || projects[0];
    return initialProject ? generateExecutiveSummary(initialProject?.name || "Project") : "";
  });

  useEffect(() => {
    if (activeProject) setSelectedProject({ id: activeProject.id, name: activeProject.name });
  }, [activeProject?.id]);

  useEffect(() => {
    if (activeProject) setExecutiveSummary(generateExecutiveSummary(activeProject.name));
  }, [activeProject?.id]);

  const handleNewProject = () => {
    const name = window.prompt("Project name", "New Project");
    if (!name) return;

    const p: Project = {
      id: `p-${Date.now()}`,
      name,
      createdAtLabel: `Created ${new Date().toLocaleDateString([], { month: "short", day: "numeric" })}`,
    };

    setProjects((prev) => [p, ...prev]);
    setActiveProjectId(p.id);
    setExecutiveSummary(generateExecutiveSummary(p.name));
    setSelectedProject({ id: p.id, name: p.name });
  };

  const handleRefreshSummary = () => {
    const projectName = activeProject?.name || "Project";
    const refreshed = generateExecutiveSummary(projectName)
      .replace("(Draft)", "(Draft • refreshed)")
      .replace("## Standing Question", `## Standing Question\n(Refreshed ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`);

    setExecutiveSummary(refreshed);
  };

  return (
    <div className="h-screen w-screen bg-background text-foreground font-sans flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 pt-[60px] h-full overflow-hidden w-full">
        <div className="h-full w-full">
          <div className="min-h-0 h-full overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="p-6 border-b">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground" data-testid="text-dashboard-label">
                      Dashboard
                    </div>
                    <div className="text-xl font-bold font-heading truncate" data-testid="text-dashboard-project-title">
                      {activeProject?.name || "Project"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="p-6 space-y-6">
                  <SummaryCard
                    title="Project Status"
                    status={
                      activeProject?.id === "p-1"
                        ? "Decision timeline is active. Define criteria, gather options, then converge."
                        : activeProject?.id === "p-2"
                          ? "Analysis project. Build a defensible model and communicate tradeoffs clearly."
                          : activeProject?.id === "p-3"
                            ? "Writing project. Convert inputs into a board-ready narrative and artifacts."
                            : "New project is empty. Add Goals, Knowledge Buckets, and Deliverables to start."
                    }
                    done={
                      activeProject?.id === "p-1"
                        ? ["Drafted decision framing"]
                        : activeProject?.id === "p-2"
                          ? ["Identified data sources"]
                          : activeProject?.id === "p-3"
                            ? ["Collected initial inputs"]
                            : []
                    }
                    undone={
                      activeProject?.id === "p-1"
                        ? ["Confirm budget cap", "Collect commute data"]
                        : activeProject?.id === "p-2"
                          ? ["Normalize locations", "Produce charts"]
                          : activeProject?.id === "p-3"
                            ? ["Align on narrative", "Finalize appendix"]
                            : ["Create your first goal", "Add your first bucket"]
                    }
                    nextSteps={
                      activeProject?.id === "p-1"
                        ? ["Lock evaluation criteria", "Gather 3 location options"]
                        : activeProject?.id === "p-2"
                          ? ["Run baseline model", "Document assumptions"]
                          : activeProject?.id === "p-3"
                            ? ["Draft v1", "Run review"]
                            : ["Define objective", "Start a deliverable outline"]
                    }
                  />

                  <div className="rounded-xl border bg-card/40 overflow-hidden">
                    <div className="px-4 py-3 border-b flex items-center justify-between gap-3">
                      <div className="text-sm font-bold font-heading" data-testid="text-exec-summary-title">
                        Executive Summary
                      </div>
                      <Button
                        data-testid="button-refresh-exec-summary"
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={handleRefreshSummary}
                      >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                      </Button>
                    </div>

                    <div className="p-5">
                      <div
                        className="prose prose-sm max-w-none prose-headings:font-heading prose-headings:font-bold prose-h1:text-xl prose-h2:text-base prose-p:text-muted-foreground prose-p:leading-relaxed"
                        data-testid="text-exec-summary-body"
                      >
                        {!executiveSummary && (
                          <p className="text-sm text-muted-foreground">
                            This project is currently empty. Create Goals, Knowledge Buckets, and Deliverables to get an executive summary.
                          </p>
                        )}
                        {!!executiveSummary && executiveSummary.split("\n").map((line, i) => {
                          if (line.startsWith("# ")) return <h1 key={i} className="mb-4">{line.replace("# ", "")}</h1>;
                          if (line.startsWith("## ")) return <h2 key={i} className="mt-6 mb-2 text-foreground">{line.replace("## ", "")}</h2>;
                          if (line.match(/^\d\./)) return <div key={i} className="ml-4 font-medium text-foreground py-1">{line}</div>;
                          if (!line.trim()) return <div key={i} className="h-2" />;
                          return <p key={i} className="my-2 text-sm">{line}</p>;
                        })}
                      </div>

                      <div className="mt-4 text-xs text-muted-foreground" data-testid="text-exec-summary-constraint">
                        Constrained to ~2 pages (placeholder). Output is generated from the standing prompt.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
