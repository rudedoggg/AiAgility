import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ChatWorkspace } from "@/components/shared/ChatWorkspace";
import { HistorySidebar } from "@/components/shared/HistorySidebar";
import { mockMessages, mockSections } from "@/lib/mockData";
import { Message, Section } from "@/lib/types";
import { ChevronDown, ChevronRight, CheckCircle2, Circle, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

function SectionCard({ section, onToggle }: { section: Section; onToggle: () => void }) {
  return (
    <div className="border rounded-lg bg-card shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer bg-card hover:bg-muted/30 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
            <div className="p-1 text-muted-foreground">
                {section.isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </div>
            <div>
                <div className="flex items-baseline gap-2">
                    <h3 className="font-bold text-foreground">{section.genericName}</h3>
                    <span className="text-muted-foreground font-normal text-sm">{section.subtitle}</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                    <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary transition-all duration-500" 
                            style={{ width: `${section.completeness}%` }}
                        />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                        {section.completedItems}/{section.totalItems} done
                    </span>
                </div>
            </div>
        </div>
      </div>

      <AnimatePresence>
        {section.isOpen && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                <div className="px-4 pb-6 pt-0 border-t border-border/50">
                    <div className="mt-4 prose prose-sm max-w-none text-muted-foreground">
                        {section.content ? (
                            <p>{section.content}</p>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/20 rounded-md border border-dashed">
                                <span className="text-sm font-medium text-muted-foreground">No content yet</span>
                                <Button variant="link" size="sm" className="text-primary">Draft with AI</Button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GoalsPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [sections, setSections] = useState<Section[]>(mockSections);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);

    // Simulate AI response
    setTimeout(() => {
        const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            content: "I've noted that down. Would you like to add that to the 'Context' section or start a new 'Requirements' section?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hasSaveableContent: true
        };
        setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, isOpen: !s.isOpen } : s));
  };

  return (
    <AppShell>
      <ResizablePanelGroup direction="vertical" className="h-full">
        {/* Top: Chat Workspace (Fixed height initially but resizable) */}
        <ResizablePanel defaultSize={40} minSize={25} maxSize={60} className="border-b">
          <ChatWorkspace 
            messages={messages} 
            onSendMessage={handleSendMessage}
            className="h-full"
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />

        {/* Bottom: Goals Content */}
        <ResizablePanel defaultSize={60}>
            <div className="flex h-full">
                <div className="flex-1 overflow-auto bg-muted/10 p-8">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div>
                            <h1 className="text-2xl font-heading font-bold text-foreground">Project Goals</h1>
                            <p className="text-muted-foreground mt-1">Define project destination, structure key decisions, and establish success criteria.</p>
                        </div>
                        
                        <div className="space-y-4">
                            {sections.map(section => (
                                <SectionCard 
                                    key={section.id} 
                                    section={section} 
                                    onToggle={() => toggleSection(section.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                {/* History Sidebar is now part of the content area in this layout to match PRD "History Sidebar collapsible from right" */}
                <HistorySidebar />
            </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </AppShell>
  );
}
