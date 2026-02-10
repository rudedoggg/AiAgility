import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ChatWorkspace } from "@/components/shared/ChatWorkspace";
import { HistorySidebar } from "@/components/shared/HistorySidebar";
import { mockMessages, mockBuckets } from "@/lib/mockData";
import { Message, Bucket } from "@/lib/types";
import { FileText, Link as LinkIcon, MessageSquare, StickyNote, FolderOpen, Folder, ChevronRight, ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";

function BucketCard({ bucket, onToggle }: { bucket: Bucket; onToggle: () => void }) {
    return (
        <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
            <div 
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors border-b border-transparent hover:border-border"
                onClick={onToggle}
            >
                {bucket.isOpen ? 
                    <FolderOpen className="w-5 h-5 text-primary" /> : 
                    <Folder className="w-5 h-5 text-muted-foreground" />
                }
                <span className="font-medium flex-1">{bucket.name}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{bucket.items.length}</span>
            </div>
            
            {bucket.isOpen && (
                <div className="bg-muted/10 p-2 space-y-1">
                    {bucket.items.map(item => (
                        <div key={item.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-white hover:shadow-sm transition-all group cursor-pointer border border-transparent hover:border-border">
                             <div className="mt-0.5 text-muted-foreground group-hover:text-primary transition-colors">
                                {item.type === 'doc' && <FileText className="w-4 h-4" />}
                                {item.type === 'link' && <LinkIcon className="w-4 h-4" />}
                                {item.type === 'chat' && <MessageSquare className="w-4 h-4" />}
                                {item.type === 'note' && <StickyNote className="w-4 h-4" />}
                             </div>
                             <div className="flex-1 min-w-0">
                                 <div className="text-sm font-medium truncate">{item.title}</div>
                                 <div className="text-xs text-muted-foreground truncate mt-0.5">{item.preview}</div>
                             </div>
                             <div className="text-[10px] text-muted-foreground self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 {item.date}
                             </div>
                        </div>
                    ))}
                    <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-muted-foreground hover:text-primary mt-1">
                        <Plus className="w-3 h-3 mr-2" /> Add Item manually
                    </Button>
                </div>
            )}
        </div>
    );
}

export default function LabPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [buckets, setBuckets] = useState<Bucket[]>(mockBuckets);

  const toggleBucket = (id: string) => {
      setBuckets(prev => prev.map(b => b.id === id ? { ...b, isOpen: !b.isOpen } : b));
  };

  return (
    <AppShell>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        
        {/* Left: Bucket Navigation (Simulated 200px nav from PRD) */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25} className="bg-sidebar border-r hidden md:block">
            <div className="p-4">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Buckets</h2>
                <div className="space-y-1">
                    {buckets.map(bucket => (
                        <div 
                            key={bucket.id}
                            className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-sidebar-foreground rounded-md hover:bg-sidebar-accent cursor-pointer"
                        >
                            <Folder className="w-4 h-4 text-sidebar-foreground/50" />
                            {bucket.name}
                        </div>
                    ))}
                    <Button variant="ghost" size="sm" className="w-full justify-start px-2 text-muted-foreground hover:text-foreground mt-2">
                        <Plus className="w-4 h-4 mr-2" /> New Bucket
                    </Button>
                </div>
            </div>
            
            <div className="p-4 mt-8">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Status</h2>
                <div className="bg-card border rounded-md p-3 shadow-sm">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Current Focus</div>
                    <div className="text-sm font-semibold text-primary">Market Research</div>
                    <div className="h-1 w-full bg-muted rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-primary w-[60%]" />
                    </div>
                </div>
            </div>
        </ResizablePanel>
        
        <ResizableHandle />

        {/* Center: Content */}
        <ResizablePanel defaultSize={80}>
             <ResizablePanelGroup direction="vertical">
                 <ResizablePanel defaultSize={45}>
                     <ChatWorkspace messages={messages} onSendMessage={() => {}} className="h-full" />
                 </ResizablePanel>
                 
                 <ResizableHandle withHandle />
                 
                 <ResizablePanel defaultSize={55} className="bg-muted/10">
                     <div className="h-full flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-background">
                            <h2 className="font-heading font-bold">Knowledge Buckets</h2>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">Filter</Button>
                                <Button size="sm">New Note</Button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {buckets.map(bucket => (
                                    <div key={bucket.id} className="md:col-span-1 lg:col-span-1">
                                        <BucketCard 
                                            bucket={bucket} 
                                            onToggle={() => toggleBucket(bucket.id)} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                     </div>
                 </ResizablePanel>
             </ResizablePanelGroup>
        </ResizablePanel>

        {/* Right: History (Collapsible) */}
        <ResizableHandle />
        <ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsible={true} collapsedSize={0}>
             <HistorySidebar />
        </ResizablePanel>

      </ResizablePanelGroup>
    </AppShell>
  );
}
