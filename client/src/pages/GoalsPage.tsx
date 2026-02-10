import { useState, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ChatWorkspace } from "@/components/shared/ChatWorkspace";
import { mockMessages, mockSections } from "@/lib/mockData";
import { Message, Section } from "@/lib/types";
import { ChevronRight, Target, Flag, Users, AlertTriangle, Circle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { SummaryCard } from "@/components/shared/SummaryCard";

function getSectionIcon(id: string) {
    switch (id) {
        case 'context': return <Flag className="w-3.5 h-3.5" />;
        case 'objective': return <Target className="w-3.5 h-3.5" />;
        case 'stakeholders': return <Users className="w-3.5 h-3.5" />;
        case 'constraints': return <AlertTriangle className="w-3.5 h-3.5" />;
        default: return <Circle className="w-3.5 h-3.5" />;
    }
}

export default function GoalsPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [sections, setSections] = useState<Section[]>(mockSections);
  const sectionRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

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

  const toggleSection = (id: string) => {
      setSections(prev => prev.map(s => s.id === id ? { ...s, isOpen: !s.isOpen } : s));
  };

  const scrollToSection = (id: string) => {
      // First ensure it's open
      setSections(prev => prev.map(s => s.id === id ? { ...s, isOpen: true } : s));
      // Then scroll
      setTimeout(() => {
          sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
  };

  const SidebarContent = (
      <div className="space-y-0">
          {sections.map(section => (
              <div 
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium border-l-2 cursor-pointer transition-colors hover:bg-sidebar-accent/50",
                      "border-transparent text-muted-foreground hover:text-foreground"
                  )}
              >
                  {getSectionIcon(section.id)}
                  <span className="truncate">{section.genericName}</span>
              </div>
          ))}
          
          <Button variant="ghost" size="sm" className="w-full justify-start px-3 mt-2 text-xs text-muted-foreground hover:text-primary">
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


        {/* Bottom: All Goal Sections */}
        <ResizablePanel defaultSize={60} className="bg-background">
            <ScrollArea className="h-full">
                <SummaryCard 
                    title="Goals Status"
                    status="Goals are currently 60% defined. The primary objective is clear, but constraints need specific financial limits."
                    done={["Context defined", "Objective drafted"]}
                    undone={["Stakeholder list incomplete", "Financial constraints undefined"]}
                    nextSteps={["Review financial constraints", "Confirm stakeholder list with CEO"]}
                />
                <div className="flex flex-col divide-y divide-border/60">
                    {sections.map(section => (
                        <div key={section.id} ref={el => { if (el) sectionRefs.current[section.id] = el; }} className="bg-background">
                            <div 
                                className="flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-muted/5 transition-colors group"
                                onClick={() => toggleSection(section.id)}
                            >
                                <div className="flex items-center gap-2">
                                    <div className={cn("text-muted-foreground transition-transform duration-200", section.isOpen ? "rotate-90" : "")}>
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                    <h2 className="text-sm font-bold text-foreground font-heading">{section.genericName}</h2>
                                    <span className="text-sm text-muted-foreground font-normal px-2">—</span>
                                    <span className="text-sm text-muted-foreground">{section.subtitle}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary/80" 
                                            style={{ width: `${section.completeness}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <AnimatePresence initial={false}>
                                {section.isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="px-12 pb-8 pt-2">
                                             <div className="prose prose-sm max-w-4xl text-foreground">
                                                {section.content ? (
                                                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{section.content}</p>
                                                ) : (
                                                    <div className="py-4 text-sm text-muted-foreground italic">
                                                        No content yet. Ask AI to draft this section.
                                                    </div>
                                                )}
                                             </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                    
                    <div className="p-8 text-center">
                        <Button variant="outline" className="text-muted-foreground border-dashed">
                            Add New Goal Section
                        </Button>
                    </div>
                </div>
            </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </AppShell>
  );
}
