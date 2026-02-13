import { useState, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ChatWorkspace } from "@/components/shared/ChatWorkspace";
import { mockMessages, mockSections } from "@/lib/mockData";
import { Message, Section } from "@/lib/types";
import { ChevronRight, Target, Flag, Users, AlertTriangle, Circle, ChevronDown, StickyNote, Upload, Link2, RefreshCw, Trash2, FileText as FileTextIcon } from "lucide-react";
import { cn, getBucketProgressPercent } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { SummaryCard } from "@/components/shared/SummaryCard";
import { ScopedHistory } from "@/components/shared/ScopedHistory";

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
  const [sections, setSections] = useState<Section[]>(mockSections.map(s => ({ ...s, items: s.items || [], bucketMessages: (s as any).bucketMessages || [] })));
  const sectionRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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

  const addSectionItem = (sectionId: string, item: NonNullable<Section["items"]>[number]) => {
      setSections(prev => prev.map(s => s.id === sectionId ? { ...s, items: [item, ...(s.items || [])] } : s));
  };

  const deleteSectionItem = (sectionId: string, itemId: string) => {
      setSections(prev => prev.map(s => s.id === sectionId ? { ...s, items: (s.items || []).filter(i => i.id !== itemId) } : s));
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
    <AppShell 
        navContent={SidebarContent} 
        navTitle="Project Goals"
        topRightContent={
            <div className="flex flex-col h-full">
                <SummaryCard 
                    title="Goals Status"
                    status="Goals are currently 60% defined. The primary objective is clear, but constraints need specific financial limits."
                    done={["Context defined", "Objective drafted"]}
                    undone={["Stakeholder list incomplete", "Financial constraints undefined"]}
                    nextSteps={["Review financial constraints", "Confirm stakeholder list with CEO"]}
                />
                <ChatWorkspace 
                    messages={messages} 
                    onSendMessage={handleSendMessage}
                    saveDestinations={sections.map((s) => ({ id: s.id, label: s.genericName }))}
                    onSaveContent={(messageId, destinationId) => {
                        const msg = messages.find((m) => m.id === messageId);
                        if (!msg) return;

                        setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, saved: true } : m)));

                        const noteTitle = msg.content.split("\n")[0]?.slice(0, 80) || "Saved chat";
                        const noteBody = msg.content;

                        addSectionItem(destinationId, {
                            id: `chat-${Date.now()}`,
                            type: 'note',
                            title: noteTitle,
                            preview: noteBody,
                            date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
                        });
                    }}
                    className="flex-1 min-h-0"
                />
            </div>
        }
    >
        {/* Bottom: All Goal Sections */}
        <div className="bg-background h-full">
            <ScrollArea className="h-full">
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
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden" data-testid={`progress-${section.id}`}>
                                        <div 
                                            className="h-full bg-primary/80" 
                                            style={{
                                                width: `${getBucketProgressPercent({
                                                    explicitPercent: section.completeness,
                                                    completedItems: section.completedItems,
                                                    totalItems: section.totalItems,
                                                    itemsCount: (section.items || []).length,
                                                })}%`,
                                            }}
                                        />
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            data-testid={`button-note-${section.id}`}
                                            className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const title = window.prompt(`New note in “${section.genericName}”`, "Quick note");
                                                if (!title) return;
                                                const content = window.prompt("Note text", "");

                                                addSectionItem(section.id, {
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
                                            ref={(el) => { fileInputRefs.current[section.id] = el; }}
                                            className="hidden"
                                            data-testid={`input-file-${section.id}`}
                                            type="file"
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => {
                                                const file = e.currentTarget.files?.[0];
                                                if (!file) return;

                                                addSectionItem(section.id, {
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
                                            data-testid={`button-upload-${section.id}`}
                                            className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fileInputRefs.current[section.id]?.click();
                                            }}
                                            aria-label="Upload a file"
                                            title="Upload a file"
                                            type="button"
                                        >
                                            <Upload className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            data-testid={`button-link-${section.id}`}
                                            className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const url = window.prompt("Paste a link (URL)", "https://");
                                                if (!url) return;
                                                const title = window.prompt("Link name", url) || url;

                                                addSectionItem(section.id, {
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
                                            data-testid={`button-update-${section.id}`}
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
                                {section.isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex h-[400px] border-t border-border/50">
                                            {/* Left Content Column: Bucket Chat */}
                                            <div className="w-[60%] border-r border-border/50">
                                                <div className="h-full flex flex-col">
                                                    <div className="px-4 py-3 border-b border-border/50 text-[11px] uppercase tracking-wider text-muted-foreground" data-testid={`text-bucket-chat-title-${section.id}`}>Bucket Chat</div>
                                                    <div className="flex-1 min-h-0">
                                                        <ChatWorkspace
                                                            messages={((section as any).bucketMessages || []) as any}
                                                            onSendMessage={(content) => {
                                                                const userMsg = {
                                                                    id: Date.now().toString(),
                                                                    role: "user" as const,
                                                                    content,
                                                                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                                                };

                                                                const contextLines = [
                                                                    `Goal Section: ${section.genericName}`,
                                                                    section.subtitle ? `Subtitle: ${section.subtitle}` : null,
                                                                    "Attachments:",
                                                                    ...((section.items || []).slice(0, 8).map((i) => `- [${i.type}] ${i.title}`)),
                                                                ].filter(Boolean);

                                                                const aiMsg = {
                                                                    id: (Date.now() + 1).toString(),
                                                                    role: "ai" as const,
                                                                    content: `Got it. I’m only using this section’s context:\n\n${contextLines.join("\n")}\n\nYou said: ${content}`,
                                                                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                                                };

                                                                setSections((prev) =>
                                                                    prev.map((s) =>
                                                                        s.id === section.id
                                                                            ? {
                                                                                  ...s,
                                                                                  bucketMessages: [...(((s as any).bucketMessages || []) as any[]), userMsg, aiMsg],
                                                                              }
                                                                            : s
                                                                    )
                                                                );
                                                            }}
                                                            className="h-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Attachments Column */}
                                            <div className="w-[20%] bg-muted/5 border-r border-border/50">
                                                <div className="h-full flex flex-col">
                                                    <div className="px-4 py-3 border-b border-border/50 text-[11px] uppercase tracking-wider text-muted-foreground" data-testid={`text-attachments-title-${section.id}`}>Attachments</div>
                                                    <div className="flex-1 overflow-y-auto">
                                                        {(section.items || []).length === 0 ? (
                                                            <div className="px-4 py-3 text-sm text-muted-foreground" data-testid={`text-attachments-empty-${section.id}`}>No files, links, or notes yet.</div>
                                                        ) : (
                                                            <div className="divide-y">
                                                                {(section.items || []).map((item) => (
                                                                    <div key={item.id} className="group flex items-start gap-3 px-4 py-3">
                                                                        <div className="mt-0.5 text-muted-foreground group-hover:text-primary transition-colors">
                                                                            {(item.type === 'file' || item.type === 'doc') && <FileTextIcon className="w-4 h-4" />}
                                                                            {item.type === 'link' && <Link2 className="w-4 h-4" />}
                                                                            {item.type === 'note' && <StickyNote className="w-4 h-4" />}
                                                                            {item.type === 'chat' && <ChevronDown className="w-4 h-4" />}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-center justify-between gap-3">
                                                                                <div className="text-sm font-medium text-foreground truncate" data-testid={`text-attachment-name-${item.id}`}>{item.title}</div>
                                                                                <div className="flex items-center gap-2 shrink-0">
                                                                                    <div className="text-[10px] text-muted-foreground" data-testid={`text-attachment-date-${item.id}`}>{item.date}</div>
                                                                                    <button
                                                                                        data-testid={`button-delete-item-${item.id}`}
                                                                                        className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            deleteSectionItem(section.id, item.id);
                                                                                        }}
                                                                                        aria-label="Delete item"
                                                                                        title="Delete item"
                                                                                        type="button"
                                                                                    >
                                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Right History Column */}
                                            <div className="w-[20%] bg-muted/5">
                                                <ScopedHistory />
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
        </div>
    </AppShell>
  );
}
