import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ChatWorkspace } from "@/components/shared/ChatWorkspace";
import { mockMessages, mockDeliverables } from "@/lib/mockData";
import { Message, Deliverable } from "@/lib/types";
import { FileText, Download, Share2, CheckSquare, Square, Edit3, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DeliverablesPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [deliverables, setDeliverables] = useState<Deliverable[]>(mockDeliverables);
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<string | null>(mockDeliverables[0].id);

  const selectedDeliverable = deliverables.find(d => d.id === selectedDeliverableId);

  const SidebarContent = (
      <div className="space-y-0.5">
          {deliverables.map(doc => (
              <div 
                  key={doc.id}
                  onClick={() => setSelectedDeliverableId(doc.id)}
                  className={cn(
                      "group flex flex-col gap-1 px-3 py-2.5 rounded-sm cursor-pointer transition-colors border-l-2",
                      selectedDeliverableId === doc.id 
                          ? "bg-sidebar-accent border-primary" 
                          : "border-transparent hover:bg-sidebar-accent/50"
                  )}
              >
                  <div className="flex items-center justify-between">
                      <span className={cn(
                          "text-sm font-medium truncate",
                          selectedDeliverableId === doc.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )}>
                          {doc.title}
                      </span>
                      {doc.engaged && <CheckSquare className="w-3 h-3 text-primary" />}
                  </div>
                  <div className="flex items-center justify-between">
                       <Badge variant="outline" className="text-[9px] h-4 px-1 rounded-sm border-sidebar-border text-muted-foreground font-normal">
                           {doc.status}
                       </Badge>
                       <span className="text-[9px] text-muted-foreground/60">{doc.lastEdited}</span>
                  </div>
              </div>
          ))}
          
          <Button variant="ghost" size="sm" className="w-full justify-start px-3 mt-4 text-xs text-muted-foreground hover:text-primary">
              + New Deliverable
          </Button>
      </div>
  );

  return (
    <AppShell sidebarContent={SidebarContent} sidebarTitle="Deliverables">
      <ResizablePanelGroup direction="vertical">
         <ResizablePanel defaultSize={30} minSize={20}>
             <ChatWorkspace messages={messages} onSendMessage={() => {}} className="h-full border-b" />
         </ResizablePanel>
         
         <ResizableHandle withHandle />
         
         <ResizablePanel defaultSize={70} className="bg-background">
             {selectedDeliverable ? (
                 <div className="h-full flex flex-col">
                     <div className="h-12 border-b flex items-center justify-between px-4 bg-background">
                         <div className="flex items-center gap-2">
                             <FileText className="w-4 h-4 text-primary" />
                             <span className="text-sm font-semibold">{selectedDeliverable.title}</span>
                             <Badge variant="secondary" className="ml-2 h-5 text-[10px]">{selectedDeliverable.status}</Badge>
                         </div>
                         <div className="flex items-center gap-1">
                             <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                                 <Edit3 className="w-4 h-4" />
                             </Button>
                             <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                                 <Share2 className="w-4 h-4" />
                             </Button>
                             <div className="w-px h-4 bg-border mx-1" />
                             <Button size="sm" variant="outline" className="h-7 text-xs gap-2">
                                 <Download className="w-3 h-3" /> Export
                             </Button>
                         </div>
                     </div>
                     <div className="flex-1 p-8 overflow-auto bg-white">
                         <article className="prose prose-sm max-w-3xl mx-auto prose-headings:font-heading prose-headings:font-bold prose-h1:text-2xl prose-h2:text-lg prose-p:text-muted-foreground prose-p:leading-relaxed">
                            {/* Quick markdown rendering simulation */}
                            {selectedDeliverable.content.split('\n').map((line, i) => {
                                if (line.startsWith('# ')) return <h1 key={i}>{line.replace('# ', '')}</h1>
                                if (line.startsWith('## ')) return <h2 key={i} className="mt-8 mb-4 pb-2 border-b border-border/50">{line.replace('## ', '')}</h2>
                                if (line.match(/^\d\./)) return <div key={i} className="ml-4 font-medium text-foreground py-1">{line}</div>
                                return <p key={i} className="my-3">{line}</p>
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
    </AppShell>
  );
}
