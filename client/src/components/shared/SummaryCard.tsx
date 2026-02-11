import { useState } from "react";
import { Sparkles, RefreshCw, CheckCircle2, Circle, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SummaryCardProps {
  title?: string;
  status: string;
  done: string[];
  undone: string[];
  nextSteps: string[];
  className?: string;
}

export function SummaryCard({ title = "Page Summary", status, done, undone, nextSteps, className }: SummaryCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleUpdate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 2000);
  };

  return (
    <div className={cn("border-b bg-muted/10 transition-all duration-200 ease-in-out", className)}>
      <div 
        className="px-4 py-3 cursor-pointer hover:bg-muted/20 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            {isCollapsed ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronUp className="w-4 h-4 text-muted-foreground" />}
            <Sparkles className="w-4 h-4" />
            <h3 className="font-heading font-bold text-sm uppercase tracking-wide">{title}</h3>
          </div>
          
          <div className="flex items-center gap-2">
              {isCollapsed && (
                  <span className="text-xs text-muted-foreground truncate max-w-[300px] hidden sm:block">
                      {status}
                  </span>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs gap-1.5 text-muted-foreground hover:text-primary px-2"
                onClick={handleUpdate}
                disabled={isUpdating}
              >
                <RefreshCw className={cn("w-3 h-3", isUpdating && "animate-spin")} />
                <span className="sr-only sm:not-sr-only">{isUpdating ? "Updating..." : "Update"}</span>
              </Button>
          </div>
        </div>

        <AnimatePresence initial={false}>
            {!isCollapsed && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 pb-2 cursor-default" onClick={(e) => e.stopPropagation()}>
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Current State</h4>
                        <p className="text-xs font-medium leading-relaxed text-foreground">{status}</p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Progress</h4>
                        <div className="space-y-1">
                          {done.map((item, i) => (
                            <div key={`done-${i}`} className="flex items-center gap-2 text-xs text-muted-foreground/70">
                              <CheckCircle2 className="w-3 h-3 text-green-600/70 shrink-0" />
                              <span className="line-through">{item}</span>
                            </div>
                          ))}
                          {undone.map((item, i) => (
                            <div key={`undone-${i}`} className="flex items-center gap-2 text-xs text-foreground">
                              <Circle className="w-3 h-3 text-muted-foreground shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Recommended Next Steps</h4>
                        <div className="space-y-1.5">
                          {nextSteps.map((step, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs bg-background border rounded-sm px-2 py-1.5 shadow-sm">
                              <ArrowRight className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
