import { useState } from "react";
import { Clock, ChevronRight, ChevronLeft, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function HistorySidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const historyItems = [
    { id: 1, action: "Added Context", time: "2m ago", details: "Lease expiry update" },
    { id: 2, action: "Goal Refined", time: "15m ago", details: "Success criteria set" },
    { id: 3, action: "Saved to Lab", time: "1h ago", details: "Competitor map link" },
    { id: 4, action: "Session Started", time: "2h ago", details: "Office relocation" },
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 50 : 300 }}
      className="border-l bg-sidebar h-full flex flex-col relative transition-all duration-300 ease-in-out"
    >
      <div className="h-14 flex items-center justify-between px-3 border-b border-sidebar-border">
        {!isCollapsed && (
          <span className="text-sm font-semibold text-sidebar-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            History
          </span>
        )}
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 ml-auto text-sidebar-foreground/70 hover:text-sidebar-foreground"
            onClick={() => setIsCollapsed(!isCollapsed)}
        >
            {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>

      {!isCollapsed && (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            <div className="space-y-4">
               {historyItems.map((item, index) => (
                   <div key={item.id} className="relative pl-4 group">
                       {/* Timeline line */}
                       {index !== historyItems.length - 1 && (
                           <div className="absolute left-[5px] top-2 bottom-[-24px] w-[1px] bg-sidebar-border" />
                       )}
                       {/* Dot */}
                       <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-sidebar-primary/20 border-2 border-sidebar-primary group-hover:bg-sidebar-primary transition-colors" />
                       
                       <div className="flex flex-col">
                           <span className="text-sm font-medium text-sidebar-foreground">{item.action}</span>
                           <span className="text-xs text-muted-foreground mt-0.5">{item.details}</span>
                           <span className="text-[10px] text-muted-foreground/60 mt-1">{item.time}</span>
                       </div>
                   </div>
               ))}
            </div>
          </div>
        </ScrollArea>
      )}
    </motion.div>
  );
}
