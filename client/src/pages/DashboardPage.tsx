import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { SummaryCard } from "@/components/shared/SummaryCard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { getSelectedProject, subscribeToSelectedProject } from "@/lib/projectStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiProject } from "@/lib/api";

export default function DashboardPage() {
  const queryClient = useQueryClient();

  const { data: projects = [] } = useQuery<ApiProject[]>({
    queryKey: ["/api/projects"],
  });

  const initialSelected = getSelectedProject();
  const [activeProjectId, setActiveProjectId] = useState<string>(initialSelected.id);

  useEffect(() => {
    const unsub = subscribeToSelectedProject((p) => {
      setActiveProjectId(p.id);
    });
    return () => unsub();
  }, []);

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) || projects[0];
  }, [projects, activeProjectId]);

  const executiveSummary = activeProject?.executiveSummary || "";
  const dashboardStatus = activeProject?.dashboardStatus;

  const refreshMutation = useMutation({
    mutationFn: async () => {
      if (!activeProject) return;
      const refreshed = (activeProject.executiveSummary || "")
        .replace("(Draft)", "(Draft • refreshed)")
        .replace("## Standing Question", `## Standing Question\n(Refreshed ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`);
      await api.projects.update(activeProject.id, { executiveSummary: refreshed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });

  return (
    <div className="h-screen w-screen bg-muted/60 text-foreground font-sans flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 pt-[60px] h-full overflow-hidden w-full">
        <div className="h-full w-full p-2">
          <div className="min-h-0 h-full overflow-hidden bg-background rounded-lg shadow-sm border border-border/40">
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
                    status={dashboardStatus?.status || "No status available."}
                    done={dashboardStatus?.done || []}
                    undone={dashboardStatus?.undone || []}
                    nextSteps={dashboardStatus?.nextSteps || []}
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
                        onClick={() => refreshMutation.mutate()}
                        disabled={refreshMutation.isPending || !activeProject}
                      >
                        <RefreshCw className={`w-4 h-4 ${refreshMutation.isPending ? "animate-spin" : ""}`} />
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
