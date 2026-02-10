import { useState, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ChatWorkspace } from "@/components/shared/ChatWorkspace";
import { mockMessages, mockBuckets } from "@/lib/mockData";
import { Message, Bucket } from "@/lib/types";
import { FileText, Link as LinkIcon, MessageSquare, StickyNote, FolderOpen, Folder, Plus, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { SummaryCard } from "@/components/shared/SummaryCard";

export default function LabPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [buckets, setBuckets] = useState<Bucket[]>(mockBuckets);
  const bucketRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  const toggleBucket = (id: string) => {
      setBuckets(prev => prev.map(b => b.id === id ? { ...b, isOpen: !b.isOpen } : b));
  };

  const scrollToBucket = (id: string) => {
      setBuckets(prev => prev.map(b => b.id === id ? { ...b, isOpen: true } : b));
      setTimeout(() => {
          bucketRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
  };

  const SidebarContent = (
      <div className="space-y-0">
          {buckets.map(bucket => (
              <div 
                  key={bucket.id}
                  onClick={() => scrollToBucket(bucket.id)}
                  className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium border-l-2 cursor-pointer transition-colors hover:bg-sidebar-accent/50",
                      "border-transparent text-muted-foreground hover:text-foreground"
                  )}
              >
                  <Folder className="w-3.5 h-3.5" />
                  <span className="truncate flex-1">{bucket.name}</span>
                  <span className="text-[10px] bg-sidebar-border px-1.5 rounded-sm">{bucket.items.length}</span>
              </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full justify-start px-3 mt-2 text-xs text-muted-foreground hover:text-primary">
              + New Knowledge Bucket
          </Button>
      </div>
  );

  return (
    <AppShell sidebarContent={SidebarContent} sidebarTitle="Knowledge Buckets">
      <ResizablePanelGroup direction="vertical">
         <ResizablePanel defaultSize={45}>
             <ChatWorkspace messages={messages} onSendMessage={() => {}} className="h-full border-b" />
         </ResizablePanel>
         
         <ResizableHandle withHandle />
         

         <ResizablePanel defaultSize={55} className="bg-background">
             <ScrollArea className="h-full">
                <SummaryCard 
                    title="Lab Status"
                    status="Research phase active. Market data is well-populated, but stakeholder feedback is sparse."
                    done={["Collected market reports", "Competitor analysis linked"]}
                    undone={["Employee survey pending", "CEO interview notes missing"]}
                    nextSteps={["Import survey results", "Schedule CEO interview"]}
                />
                <div className="flex flex-col divide-y divide-border/60">
                    {buckets.map(bucket => (
                        <div key={bucket.id} ref={el => { if (el) bucketRefs.current[bucket.id] = el; }}>
                            <div 
                                className="flex items-center px-6 py-3 cursor-pointer hover:bg-muted/5 transition-colors group"
                                onClick={() => toggleBucket(bucket.id)}
                            >
                                <div className={cn("text-muted-foreground transition-transform duration-200 mr-2", bucket.isOpen ? "rotate-90" : "")}>
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                                <h2 className="text-sm font-bold font-heading text-foreground flex-1">
                                    {bucket.name}
                                </h2>
                                <div className="text-xs text-muted-foreground">
                                    {bucket.items.length} items
                                </div>
                            </div>
                            
                            <AnimatePresence initial={false}>
                                {bucket.isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="px-6 pb-6 pt-0">
                                            <div className="divide-y divide-border/30 border-t border-border/30">
                                                {bucket.items.map(item => (
                                                    <div key={item.id} className="group flex items-start gap-3 py-3 hover:bg-muted/5 transition-colors cursor-pointer px-6 -mx-6">
                                                         <div className="mt-0.5 text-muted-foreground group-hover:text-primary transition-colors">
                                                            {item.type === 'doc' && <FileText className="w-4 h-4" />}
                                                            {item.type === 'link' && <LinkIcon className="w-4 h-4" />}
                                                            {item.type === 'chat' && <MessageSquare className="w-4 h-4" />}
                                                            {item.type === 'note' && <StickyNote className="w-4 h-4" />}
                                                         </div>
                                                         <div className="flex-1 min-w-0">
                                                             <div className="flex items-center justify-between">
                                                                <div className="text-sm font-medium text-foreground">{item.title}</div>
                                                                <div className="text-[10px] text-muted-foreground">{item.date}</div>
                                                             </div>
                                                             <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.preview}</div>
                                                         </div>
                                                    </div>
                                                ))}
                                                <div className="pt-3">
                                                    <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-primary">
                                                        <Plus className="w-3 h-3 mr-2" /> Add Item manually
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
             </ScrollArea>
         </ResizablePanel>
     </ResizablePanelGroup>
    </AppShell>
  );
}
