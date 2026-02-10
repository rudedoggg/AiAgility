import { useState } from "react";
import { Sparkles, RefreshCw, CheckCircle2, Circle, ArrowRight } from "lucide-react";
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

  const handleUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 2000);
  };

  return (
    <div className={cn("border-b bg-muted/10", className)}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="w-4 h-4" />
            <h3 className="font-heading font-bold text-sm uppercase tracking-wide">AI Status Report</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-primary"
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isUpdating && "animate-spin")} />
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Current State</h4>
            <p className="text-sm font-medium leading-relaxed">{status}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Progress</h4>
            <div className="space-y-1">
              {done.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600/70" />
                  <span className="line-through opacity-70">{item}</span>
                </div>
              ))}
              {undone.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <Circle className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Recommended Next Steps</h4>
            <div className="space-y-1.5">
              {nextSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-sm bg-background border rounded-sm px-2 py-1.5 shadow-sm">
                  <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
