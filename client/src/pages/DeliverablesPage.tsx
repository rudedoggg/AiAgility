import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ChatWorkspace } from "@/components/shared/ChatWorkspace";
import { HistorySidebar } from "@/components/shared/HistorySidebar";
import { mockMessages, mockDeliverables } from "@/lib/mockData";
import { Message, Deliverable } from "@/lib/types";
import { FileText, Download, Share2, CheckSquare, Square, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DeliverablesPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [deliverables, setDeliverables] = useState<Deliverable[]>(mockDeliverables);
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<string | null>(mockDeliverables[0].id);

  const selectedDeliverable = deliverables.find(d => d.id === selectedDeliverableId);

  return (
    <AppShell>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        
        {/* Left: Deliverables List & Status */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={30} className="border-r bg-muted/10">
            <div className="p-4 border-b bg-background">
                <h2 className="font-heading font-bold text-lg">Deliverables</h2>
                <p className="text-xs text-muted-foreground mt-1">Content feeding specialized tools</p>
            </div>
            <ScrollArea className="h-[calc(100vh-120px)]">
                <div className="p-3 space-y-2">
                    {deliverables.map(doc => (
                        <div 
                            key={doc.id}
                            onClick={() => setSelectedDeliverableId(doc.id)}
                            className={cn(
                                "p-3 rounded-lg cursor-pointer transition-all border",
                                selectedDeliverableId === doc.id 
                                    ? "bg-background border-primary shadow-sm" 
                                    : "bg-background/50 border-transparent hover:bg-background hover:border-border"
                            )}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <Badge variant={doc.status === 'final' ? "default" : "secondary"} className="text-[10px] uppercase tracking-wider h-5">
                                    {doc.status}
                                </Badge>
                                <div className="flex items-center gap-2" title="Engage AI with this doc">
                                    <span className="text-[10px] text-muted-foreground">Engage AI</span>
                                    {doc.engaged ? 
                                        <CheckSquare className="w-4 h-4 text-primary" /> : 
                                        <Square className="w-4 h-4 text-muted-foreground" />
                                    }
                                </div>
                            </div>
                            <h3 className="font-semibold text-sm leading-tight mb-1">{doc.title}</h3>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <ClockIcon className="w-3 h-3" />
                                Edited {doc.lastEdited}
                            </div>
                        </div>
                    ))}
                    
                    <Button variant="outline" className="w-full mt-4 border-dashed text-muted-foreground hover:text-primary hover:border-primary/50">
                        + Create New Deliverable
                    </Button>
                </div>
            </ScrollArea>
        </ResizablePanel>
        
        <ResizableHandle />

        {/* Center: Workspace (Split Vertical: Chat / Doc Editor) */}
        <ResizablePanel defaultSize={55}>
             <ResizablePanelGroup direction="vertical">
                 <ResizablePanel defaultSize={30} minSize={20}>
                     <ChatWorkspace messages={messages} onSendMessage={() => {}} className="h-full border-b" />
                 </ResizablePanel>
                 
                 <ResizableHandle withHandle />
                 
                 <ResizablePanel defaultSize={70} className="bg-background">
                     {selectedDeliverable ? (
                         <div className="h-full flex flex-col">
                             <div className="h-12 border-b flex items-center justify-between px-4 bg-muted/10">
                                 <div className="flex items-center gap-2">
                                     <FileText className="w-4 h-4 text-primary" />
                                     <span className="text-sm font-semibold">{selectedDeliverable.title}</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                         <Edit3 className="w-4 h-4" />
                                     </Button>
                                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                         <Share2 className="w-4 h-4" />
                                     </Button>
                                     <Button size="sm" className="h-8 gap-2">
                                         <Download className="w-3 h-3" /> Export
                                     </Button>
                                 </div>
                             </div>
                             <div className="flex-1 p-8 overflow-auto">
                                 <article className="prose prose-sm max-w-none prose-headings:font-heading prose-headings:font-bold prose-h1:text-2xl prose-h2:text-lg prose-p:text-muted-foreground">
                                    {/* Quick markdown rendering simulation */}
                                    {selectedDeliverable.content.split('\n').map((line, i) => {
                                        if (line.startsWith('# ')) return <h1 key={i}>{line.replace('# ', '')}</h1>
                                        if (line.startsWith('## ')) return <h2 key={i} className="mt-6 mb-2">{line.replace('## ', '')}</h2>
                                        if (line.match(/^\d\./)) return <div key={i} className="ml-4 font-medium text-foreground py-1">{line}</div>
                                        return <p key={i} className="my-2">{line}</p>
                                    })}
                                 </article>
                             </div>
                         </div>
                     ) : (
                         <div className="h-full flex items-center justify-center text-muted-foreground">
                             Select a deliverable to edit
                         </div>
                     )}
                 </ResizablePanel>
             </ResizablePanelGroup>
        </ResizablePanel>

        {/* Right: History */}
        <ResizableHandle />
        <ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsible={true} collapsedSize={0}>
             <HistorySidebar />
        </ResizablePanel>

      </ResizablePanelGroup>
    </AppShell>
  );
}

function ClockIcon({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
