import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ChatWorkspace } from "@/components/shared/ChatWorkspace";
import { mockMessages, mockBuckets } from "@/lib/mockData";
import { Message, Bucket } from "@/lib/types";
import { FileText, Link as LinkIcon, MessageSquare, StickyNote, FolderOpen, Folder, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";

export default function LabPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [buckets, setBuckets] = useState<Bucket[]>(mockBuckets);
  const [activeBucketId, setActiveBucketId] = useState<string | null>('research');

  const activeBucket = buckets.find(b => b.id === activeBucketId);

  const SidebarContent = (
      <div className="space-y-0.5">
          {buckets.map(bucket => (
              <div 
                  key={bucket.id}
                  onClick={() => setActiveBucketId(bucket.id)}
                  className={cn(
                      "flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-sm cursor-pointer transition-colors border-l-2",
                      activeBucketId === bucket.id 
                          ? "bg-sidebar-accent border-primary text-foreground" 
                          : "border-transparent text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                  )}
              >
                  {activeBucketId === bucket.id ? <FolderOpen className="w-4 h-4 text-primary" /> : <Folder className="w-4 h-4" />}
                  <span className="truncate flex-1">{bucket.name}</span>
                  <span className="text-[10px] bg-sidebar-border px-1.5 rounded-sm">{bucket.items.length}</span>
              </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full justify-start px-3 mt-4 text-xs text-muted-foreground hover:text-primary">
              + New Knowledge Bucket
          </Button>
      </div>
  );

  return (
    <AppShell sidebarContent={SidebarContent} sidebarTitle="Knowledge Buckets">
      <ResizablePanelGroup direction="vertical">
         <ResizablePanel defaultSize={45}>
             <ChatWorkspace messages={messages} onSendMessage={() => {}} className="h-full" />
         </ResizablePanel>
         
         <ResizableHandle withHandle />
         
         <ResizablePanel defaultSize={55} className="bg-background">
             <div className="h-full flex flex-col">
                <div className="flex items-center justify-between px-6 py-3 border-b bg-muted/5 min-h-[50px]">
                    <h2 className="font-heading font-bold flex items-center gap-2">
                        {activeBucket ? activeBucket.name : "Select a Bucket"}
                    </h2>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-xs">Filter</Button>
                        <Button size="sm" className="h-7 text-xs">New Note</Button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-auto p-0">
                    {activeBucket ? (
                        <div className="divide-y divide-border/60">
                            {activeBucket.items.map(item => (
                                <div key={item.id} className="group flex items-start gap-4 p-4 hover:bg-muted/5 transition-colors cursor-pointer">
                                     <div className="mt-1 text-muted-foreground group-hover:text-primary transition-colors bg-muted/20 p-2 rounded-md">
                                        {item.type === 'doc' && <FileText className="w-5 h-5" />}
                                        {item.type === 'link' && <LinkIcon className="w-5 h-5" />}
                                        {item.type === 'chat' && <MessageSquare className="w-5 h-5" />}
                                        {item.type === 'note' && <StickyNote className="w-5 h-5" />}
                                     </div>
                                     <div className="flex-1 min-w-0 space-y-1">
                                         <div className="flex items-center justify-between">
                                            <div className="text-sm font-semibold text-foreground">{item.title}</div>
                                            <div className="text-[10px] text-muted-foreground">{item.date}</div>
                                         </div>
                                         <div className="text-sm text-muted-foreground line-clamp-2">{item.preview}</div>
                                     </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Folder className="w-12 h-12 mb-2 opacity-20" />
                            <p>Select a bucket to view contents</p>
                        </div>
                    )}
                </div>
             </div>
         </ResizablePanel>
     </ResizablePanelGroup>
    </AppShell>
  );
}
