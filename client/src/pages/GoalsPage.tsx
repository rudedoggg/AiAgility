import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ChatWorkspace } from "@/components/shared/ChatWorkspace";
import { mockMessages, mockSections } from "@/lib/mockData";
import { Message, Section } from "@/lib/types";
import { ChevronRight, Target, Flag, Users, AlertTriangle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";

function getSectionIcon(id: string) {
    switch (id) {
        case 'context': return <Flag className="w-4 h-4" />;
        case 'objective': return <Target className="w-4 h-4" />;
        case 'stakeholders': return <Users className="w-4 h-4" />;
        case 'constraints': return <AlertTriangle className="w-4 h-4" />;
        default: return <Circle className="w-4 h-4" />;
    }
}

export default function GoalsPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [sections, setSections] = useState<Section[]>(mockSections);
  const [activeSectionId, setActiveSectionId] = useState<string>('context');

  const activeSection = sections.find(s => s.id === activeSectionId);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);

    setTimeout(() => {
        const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            content: "I've updated the section with those details.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hasSaveableContent: true
        };
        setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const SidebarContent = (
      <div className="space-y-0.5">
          {sections.map(section => (
              <div 
                  key={section.id}
                  onClick={() => setActiveSectionId(section.id)}
                  className={cn(
                      "flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-sm cursor-pointer transition-colors border-l-2",
                      activeSectionId === section.id 
                          ? "bg-sidebar-accent border-primary text-foreground" 
                          : "border-transparent text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                  )}
              >
                  {getSectionIcon(section.id)}
                  <div className="flex flex-col truncate">
                    <span className="truncate leading-none mb-0.5">{section.genericName}</span>
                    <span className="text-[10px] font-normal opacity-70 truncate">{section.subtitle}</span>
                  </div>
              </div>
          ))}
          
          <Button variant="ghost" size="sm" className="w-full justify-start px-3 mt-4 text-xs text-muted-foreground hover:text-primary">
              + Add Goal Section
          </Button>
      </div>
  );

  return (
    <AppShell sidebarContent={SidebarContent} sidebarTitle="Project Goals">
      <ResizablePanelGroup direction="vertical" className="h-full">
        {/* Top: Chat Workspace */}
        <ResizablePanel defaultSize={40} minSize={25} maxSize={60} className="border-b">
          <ChatWorkspace 
            messages={messages} 
            onSendMessage={handleSendMessage}
            className="h-full"
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />

        {/* Bottom: Active Goal Content */}
        <ResizablePanel defaultSize={60} className="bg-background">
            <div className="h-full flex flex-col">
                {activeSection ? (
                    <>
                        <div className="px-6 py-4 border-b bg-muted/5 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-heading font-bold text-foreground flex items-center gap-2">
                                    {activeSection.genericName}
                                    <span className="text-muted-foreground font-normal text-sm px-2 py-0.5 bg-muted rounded-full">
                                        {activeSection.subtitle}
                                    </span>
                                </h2>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="font-medium text-foreground">{activeSection.completeness}%</span> Complete
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto p-8">
                             <div className="prose prose-sm max-w-3xl text-foreground">
                                {activeSection.content ? (
                                    <p className="whitespace-pre-wrap leading-relaxed">{activeSection.content}</p>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">
                                        <p>No content defined for this goal yet.</p>
                                        <Button variant="link" className="mt-2 text-primary">Generate draft with AI</Button>
                                    </div>
                                )}
                             </div>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        Select a goal section to view details
                    </div>
                )}
            </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </AppShell>
  );
}
