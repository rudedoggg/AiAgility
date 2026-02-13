import { useState, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ChatWorkspace } from "@/components/shared/ChatWorkspace";
import { mockMessages, mockBuckets } from "@/lib/mockData";
import { Message, Bucket } from "@/lib/types";
import { FileText, Link as LinkIcon, MessageSquare, StickyNote, FolderOpen, Folder, Plus, ChevronRight, Upload, Link2, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { SummaryCard } from "@/components/shared/SummaryCard";
import { ScopedHistory } from "@/components/shared/ScopedHistory";

export default function LabPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [buckets, setBuckets] = useState<Bucket[]>(mockBuckets);
  const bucketRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const toggleBucket = (id: string) => {
      setBuckets(prev => prev.map(b => b.id === id ? { ...b, isOpen: !b.isOpen } : b));
  };

  const addBucketItem = (bucketId: string, item: Bucket["items"][number]) => {
      setBuckets(prev => prev.map(b => b.id === bucketId ? { ...b, items: [item, ...b.items] } : b));
  };

  const deleteBucketItem = (bucketId: string, itemId: string) => {
      setBuckets(prev => prev.map(b => b.id === bucketId ? { ...b, items: b.items.filter(i => i.id !== itemId) } : b));
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
    <AppShell 
        navContent={SidebarContent} 
        navTitle="Knowledge Buckets"
        topRightContent={
            <div className="flex flex-col h-full">
                 <SummaryCard 
                    title="Lab Status"
                    status="Research phase active. Market data is well-populated, but stakeholder feedback is sparse."
                    done={["Collected market reports", "Competitor analysis linked"]}
                    undone={["Employee survey pending", "CEO interview notes missing"]}
                    nextSteps={["Import survey results", "Schedule CEO interview"]}
                 />
                 <ChatWorkspace messages={messages} onSendMessage={() => {}} className="flex-1 min-h-0" />
            </div>
        }
    >
         <div className="bg-background h-full">
             <ScrollArea className="h-full">
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
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden" data-testid={`progress-${bucket.id}`}>
                                        <div
                                            className="h-full bg-primary/80"
                                            style={{ width: `${Math.min(100, Math.round((bucket.items.length / 8) * 100))}%` }}
                                        />
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            data-testid={`button-note-${bucket.id}`}
                                            className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const title = window.prompt(`New note in “${bucket.name}”`, "Quick note");
                                                if (!title) return;
                                                const content = window.prompt("Note text", "");

                                                addBucketItem(bucket.id, {
                                                    id: `${Date.now()}`,
                                                    type: 'note',
                                                    title,
                                                    preview: (content || "").slice(0, 80) || "(empty)",
                                                    date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })
                                                });
                                            }}
                                            aria-label="Make a note"
                                            title="Make a note"
                                            type="button"
                                        >
                                            <StickyNote className="w-3.5 h-3.5" />
                                        </button>

                                        <input
                                            ref={(el) => { fileInputRefs.current[bucket.id] = el; }}
                                            className="hidden"
                                            data-testid={`input-file-${bucket.id}`}
                                            type="file"
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => {
                                                const file = e.currentTarget.files?.[0];
                                                if (!file) return;

                                                addBucketItem(bucket.id, {
                                                    id: `${Date.now()}`,
                                                    type: 'file',
                                                    title: file.name,
                                                    preview: `${Math.round(file.size / 1024)} KB`,
                                                    date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
                                                    fileName: file.name,
                                                    fileSizeLabel: `${Math.round(file.size / 1024)} KB`
                                                });

                                                e.currentTarget.value = "";
                                            }}
                                        />

                                        <button
                                            data-testid={`button-upload-${bucket.id}`}
                                            className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fileInputRefs.current[bucket.id]?.click();
                                            }}
                                            aria-label="Upload a file"
                                            title="Upload a file"
                                            type="button"
                                        >
                                            <Upload className="w-3.5 h-3.5" />
                                        </button>

                                        <button
                                            data-testid={`button-link-${bucket.id}`}
                                            className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const url = window.prompt("Paste a link (URL)", "https://");
                                                if (!url) return;
                                                const title = window.prompt("Link name", url) || url;

                                                addBucketItem(bucket.id, {
                                                    id: `${Date.now()}`,
                                                    type: 'link',
                                                    title,
                                                    preview: url,
                                                    date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
                                                    url
                                                });
                                            }}
                                            aria-label="Link a file"
                                            title="Link a file"
                                            type="button"
                                        >
                                            <Link2 className="w-3.5 h-3.5" />
                                        </button>

                                        <button
                                            data-testid={`button-update-${bucket.id}`}
                                            className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                                            onClick={(e) => { e.stopPropagation(); }}
                                            aria-label="Update bucket"
                                            title="Update bucket"
                                            type="button"
                                        >
                                            <RefreshCw className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
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
                                        <div className="flex h-[400px] border-t border-border/50">
                                            {/* Left Content: Items */}
                                            <div className="w-[80%] px-6 pb-6 pt-0 overflow-y-auto border-r border-border/50">
                                                <div className="divide-y divide-border/30 border-t border-border/30">
                                                    {bucket.items.map(item => (
                                                        <div key={item.id} className="group flex items-start gap-3 py-3 hover:bg-muted/5 transition-colors px-6 -mx-6">
                                                             <div className="mt-0.5 text-muted-foreground group-hover:text-primary transition-colors">
                                                                {item.type === 'doc' && <FileText className="w-4 h-4" />}
                                                                {item.type === 'file' && <FileText className="w-4 h-4" />}
                                                                {item.type === 'link' && <LinkIcon className="w-4 h-4" />}
                                                                {item.type === 'chat' && <MessageSquare className="w-4 h-4" />}
                                                                {item.type === 'note' && <StickyNote className="w-4 h-4" />}
                                                             </div>
                                                             <div className="flex-1 min-w-0">
                                                                 <div className="flex items-center justify-between gap-3">
                                                                    <div className="text-sm font-medium text-foreground truncate" data-testid={`text-item-title-${item.id}`}>{item.title}</div>
                                                                    <div className="flex items-center gap-2 shrink-0">
                                                                        <div className="text-[10px] text-muted-foreground" data-testid={`text-item-date-${item.id}`}>{item.date}</div>
                                                                        <button
                                                                            data-testid={`button-delete-item-${item.id}`}
                                                                            className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                deleteBucketItem(bucket.id, item.id);
                                                                            }}
                                                                            aria-label="Delete item"
                                                                            title="Delete item"
                                                                            type="button"
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                 </div>
                                                                 <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5" data-testid={`text-item-preview-${item.id}`}>{item.preview}</div>
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

                                            {/* Right Content: History */}
                                            <div className="w-[20%] bg-muted/5">
                                                <ScopedHistory />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
             </ScrollArea>
         </div>
    </AppShell>
  );
}
