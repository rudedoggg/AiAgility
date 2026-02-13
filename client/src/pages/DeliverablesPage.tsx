import { useEffect, useMemo, useState, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AppShell } from "@/components/layout/AppShell";
import { ChatWorkspace } from "@/components/shared/ChatWorkspace";
import { mockMessages } from "@/lib/mockData";
import { getProjectTemplates } from "@/lib/projectTemplates";
import { getSelectedProject, subscribeToSelectedProject } from "@/lib/projectStore";
import { Message, Deliverable } from "@/lib/types";
import { FileText, Download, Share2, CheckSquare, Edit3, ChevronRight, StickyNote, Upload, Link2, RefreshCw, Trash2, FileText as FileTextIcon } from "lucide-react";
import { cn, getBucketProgressPercent } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { SummaryCard } from "@/components/shared/SummaryCard";
import { ScopedHistory } from "@/components/shared/ScopedHistory";

export default function DeliverablesPage() {
  const { templates, baseMessages } = getProjectTemplates();
  const [activeProject, setActiveProject] = useState(getSelectedProject());

  const template = templates[activeProject.id];
  const generatedTemplate = useMemo(() => {
    if (template) return null;
    try {
      const raw = window.localStorage.getItem(`agilityai:generatedTemplate:${activeProject.id}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [activeProject.id, template]);

  const [messages, setMessages] = useState<Message[]>(template ? baseMessages : mockMessages);
  const [deliverables, setDeliverables] = useState<Deliverable[]>(
    template ? template.deliverables.deliverables.map(d => ({...d, isOpen: true, items: (d as any).items || [], bucketMessages: (d as any).bucketMessages || [], completeness: (d as any).completeness ?? 50, subtitle: (d as any).subtitle || ''})) : []
  ); // Default open for demo
  const deliverableRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const unsub = subscribeToSelectedProject((p) => {
      setActiveProject(p);

      const nextTemplate = templates[p.id];

      if (nextTemplate) {
        setMessages(baseMessages);
        setDeliverables(nextTemplate.deliverables.deliverables.map(d => ({...d, isOpen: true, items: (d as any).items || [], bucketMessages: (d as any).bucketMessages || [], completeness: (d as any).completeness ?? 50, subtitle: (d as any).subtitle || ''})));
        return;
      }

      let generated: any = null;
      try {
        const raw = window.localStorage.getItem(`agilityai:generatedTemplate:${p.id}`);
        generated = raw ? JSON.parse(raw) : null;
      } catch {
        generated = null;
      }

      if (generated?.deliverables?.deliverables) {
        setMessages(baseMessages);
        setDeliverables(generated.deliverables.deliverables.map((d: any) => ({...d, isOpen: true, items: d.items || [], bucketMessages: d.bucketMessages || [], completeness: d.completeness ?? 50, subtitle: d.subtitle || ''})));
        return;
      }

      setMessages(mockMessages);
      setDeliverables([]);
    });
    return () => unsub();
  }, [baseMessages, templates]);

  const toggleDeliverable = (id: string) => {
    setDeliverables(prev => prev.map(d => 
        d.id === id ? { ...d, isOpen: !(d as any).isOpen } : d
    ));
  };

  const addDeliverableItem = (deliverableId: string, item: NonNullable<Deliverable["items"]>[number]) => {
      setDeliverables(prev => prev.map(d => d.id === deliverableId ? { ...d, items: [item, ...((d as any).items || [])] } : d));
  };

  const deleteDeliverableItem = (deliverableId: string, itemId: string) => {
      setDeliverables(prev => prev.map(d => d.id === deliverableId ? { ...d, items: (((d as any).items || []) as any[]).filter(i => i.id !== itemId) } : d));
  };

  const scrollToDeliverable = (id: string) => {
      setDeliverables(prev => prev.map(d => d.id === id ? { ...d, isOpen: true } : d));
      setTimeout(() => {
          deliverableRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const deliverableIds = useMemo(() => deliverables.map((d) => d.id), [deliverables]);

  function SortableNavRow({ deliverableId }: { deliverableId: string }) {
    const doc = deliverables.find((d) => d.id === deliverableId);
    const sortable = useSortable({ id: deliverableId });
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortable;

    if (!doc) return null;

    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        data-testid={`nav-row-${doc.id}`}
        onClick={() => scrollToDeliverable(doc.id)}
        className={cn(
          "flex flex-col gap-0.5 px-3 py-2 rounded-sm cursor-pointer transition-colors border-l-2 select-none",
          "border-transparent text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50",
          isDragging && "bg-sidebar-accent/60 text-foreground"
        )}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.85 : 1,
        }}
      >
        <div className="flex items-center justify-between text-sm font-medium">
          <span className="truncate">{doc.title}</span>
          {doc.engaged && <CheckSquare className="w-3 h-3 text-primary shrink-0" />}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider">{doc.status}</span>
        </div>
      </div>
    );
  }

  const SidebarContent = (
      <div className="space-y-0">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event: DragEndEvent) => {
            const { active, over } = event;
            if (!over) return;
            if (active.id === over.id) return;

            setDeliverables((prev) => {
              const oldIndex = prev.findIndex((d) => d.id === active.id);
              const newIndex = prev.findIndex((d) => d.id === over.id);
              if (oldIndex === -1 || newIndex === -1) return prev;
              return arrayMove(prev, oldIndex, newIndex);
            });
          }}
        >
          <SortableContext items={deliverableIds} strategy={verticalListSortingStrategy}>
            {deliverableIds.map((id) => (
              <SortableNavRow key={id} deliverableId={id} />
            ))}
          </SortableContext>
        </DndContext>

          <Button
            data-testid="button-add-bucket"
            variant="ghost"
            size="sm"
            className="w-full justify-start px-3 mt-2 text-xs text-muted-foreground hover:text-primary"
            onClick={() => {
              const name = window.prompt("New deliverable", "New deliverable");
              if (!name) return;

              const id = `deliv-${Date.now()}`;
              setDeliverables((prev) => [
                {
                  id,
                  title: name,
                  subtitle: "(draft)",
                  completeness: 0,
                  status: "draft",
                  lastEdited: "Just now",
                  content: "# " + name + "\n\n(TBD)",
                  items: [],
                  engaged: false,
                  isOpen: true,
                  bucketMessages: [],
                } as any,
                ...prev,
              ]);

              setTimeout(() => {
                deliverableRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 50);
            }}
          >
            + New Deliverable
          </Button>
      </div>
  );

  return (
    <AppShell 
        navContent={SidebarContent} 
        navTitle="Deliverables"
        topRightContent={
            <div className="flex flex-col h-full">
                 <SummaryCard 
                    title="Deliverables Status"
                    status={template?.deliverables.summary.status || generatedTemplate?.deliverables?.summary?.status || "Seeded from the project summary. Next: draft the first deliverable."}
                    done={template?.deliverables.summary.done || generatedTemplate?.deliverables?.summary?.done || []}
                    undone={template?.deliverables.summary.undone || generatedTemplate?.deliverables?.summary?.undone || ["Create deliverable outline"]}
                    nextSteps={template?.deliverables.summary.nextSteps || generatedTemplate?.deliverables?.summary?.nextSteps || ["Draft v1", "Attach memory items"]}
                />
                 <ChatWorkspace
                    messages={messages}
                    onSendMessage={() => {}}
                    saveDestinations={deliverables.map((d) => ({ id: d.id, label: d.title }))}
                    onSaveContent={(messageId, destinationId) => {
                        const msg = messages.find((m) => m.id === messageId);
                        if (!msg) return;

                        setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, saved: true } : m)));

                        const now = new Date();
                        const label = now.toLocaleDateString([], { month: "short", day: "numeric" });
                        const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                        const firstLine = msg.content.split("\n")[0]?.trim();

                        addDeliverableItem(destinationId, {
                            id: `ver-${Date.now()}`,
                            type: "doc",
                            title: `v${Date.now()} • ${time}${firstLine ? ` • ${firstLine.slice(0, 48)}` : ""}`,
                            preview: msg.content,
                            date: label,
                        } as any);
                    }}
                    className="flex-1 min-h-0"
                 />
            </div>
        }
    >
         <div className="bg-background h-full">
             <ScrollArea className="h-full">
                 <div className="flex flex-col divide-y divide-border/60">
                    {deliverables.map(doc => (
                        <div key={doc.id} ref={el => { if (el) deliverableRefs.current[doc.id] = el; }}>
                            <div 
                                className="flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-muted/5 transition-colors group bg-background sticky top-0 z-10"
                                onClick={() => toggleDeliverable(doc.id)}
                            >
                                <div className={cn("text-muted-foreground transition-transform duration-200 mr-2", (doc as any).isOpen ? "rotate-90" : "")}>
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <FileText className="w-4 h-4 text-primary shrink-0" />
                                    <div className="min-w-0">
                                        <h2 className="text-sm font-bold font-heading text-foreground truncate" data-testid={`text-bucket-title-${doc.id}`}>{doc.title}</h2>
                                        {(doc as any).subtitle ? (
                                            <div className="text-xs text-muted-foreground truncate" data-testid={`text-bucket-subtitle-${doc.id}`}>{(doc as any).subtitle}</div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden" data-testid={`progress-${doc.id}`}>
                                        <div
                                            className="h-full bg-primary/80"
                                            style={{
                                                width: `${getBucketProgressPercent({
                                                    explicitPercent: (doc as any).completeness,
                                                    itemsCount: (((doc as any).items || []) as any[]).length,
                                                })}%`,
                                            }}
                                        />
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            data-testid={`button-note-${doc.id}`}
                                            className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const title = window.prompt(`New note in “${doc.title}”`, "Quick note");
                                                if (!title) return;
                                                const content = window.prompt("Note text", "");

                                                addDeliverableItem(doc.id, {
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
                                            ref={(el) => { fileInputRefs.current[doc.id] = el; }}
                                            className="hidden"
                                            data-testid={`input-file-${doc.id}`}
                                            type="file"
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => {
                                                const file = e.currentTarget.files?.[0];
                                                if (!file) return;

                                                addDeliverableItem(doc.id, {
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
                                            data-testid={`button-upload-${doc.id}`}
                                            className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fileInputRefs.current[doc.id]?.click();
                                            }}
                                            aria-label="Upload a file"
                                            title="Upload a file"
                                            type="button"
                                        >
                                            <Upload className="w-3.5 h-3.5" />
                                        </button>

                                        <button
                                            data-testid={`button-link-${doc.id}`}
                                            className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const url = window.prompt("Paste a link (URL)", "https://");
                                                if (!url) return;
                                                const title = window.prompt("Link name", url) || url;

                                                addDeliverableItem(doc.id, {
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
                                            data-testid={`button-update-${doc.id}`}
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
                                {((doc as any).isOpen) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex h-[500px] border-t border-border/50">
                                            {/* Left Content Column */}
                                            <div className="w-[60%] border-r border-border/50">
                                                <div className="h-full flex flex-col">
                                                    <div className="flex-1 min-h-0">
                                                        <ChatWorkspace
                                                            messages={(((doc as any).bucketMessages || []) as any)}
                                                            onSendMessage={(content) => {
                                                                const userMsg = {
                                                                    id: Date.now().toString(),
                                                                    role: "user" as const,
                                                                    content,
                                                                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                                                };

                                                                const versions = ((((doc as any).items || []) as any[]).filter((i: any) => i.type === 'doc' || i.type === 'link'));
                                                                const current = versions[0];

                                                                const contextLines = [
                                                                    `Deliverable: ${doc.title}`,
                                                                    (doc as any).subtitle ? `Subtitle: ${(doc as any).subtitle}` : null,
                                                                    `Status: ${doc.status}`,
                                                                    current ? `Current version: ${current.title}` : "Current version: (none yet)",
                                                                    "Deliverable versions:",
                                                                    ...versions.slice(0, 8).map((i: any) => `- [${i.type}] ${i.title}`),
                                                                    "\nInstruction: This bucket chat is for editing the deliverable. Propose changes as a patch or a new version.",
                                                                ].filter(Boolean);

                                                                const aiMsg = {
                                                                    id: (Date.now() + 1).toString(),
                                                                    role: "ai" as const,
                                                                    content: `I’ll help edit this deliverable. I’m only using this deliverable’s versions + context:\n\n${contextLines.join("\n")}\n\nYou said: ${content}\n\nIf you want, reply with “save as new version” and I’ll format the update to paste into a new version.`,
                                                                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                                                };

                                                                setDeliverables((prev) =>
                                                                    prev.map((d) =>
                                                                        d.id === doc.id
                                                                            ? {
                                                                                  ...d,
                                                                                  bucketMessages: [...((((d as any).bucketMessages || []) as any[])), userMsg, aiMsg],
                                                                              }
                                                                            : d
                                                                    )
                                                                );
                                                            }}
                                                            className="h-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Deliverable Column */}
                                            <div className="w-[20%] bg-muted/5 border-r border-border/50">
                                                <div className="h-full flex flex-col">
                                                    <div className="px-4 py-3 border-b border-border/50 text-[11px] uppercase tracking-wider text-muted-foreground" data-testid={`text-deliverable-title-${doc.id}`}>Deliverable</div>
                                                    <div className="flex-1 overflow-y-auto">
                                                        {(((doc as any).items || []) as any[]).length === 0 ? (
                                                            <div className="px-4 py-3 text-sm text-muted-foreground" data-testid={`text-deliverable-empty-${doc.id}`}>No versions yet. Use chat to draft and save the first version.</div>
                                                        ) : (
                                                            <div className="divide-y">
                                                                {(((doc as any).items || []) as any[])
                                                                    .filter((i: any) => i.type === 'doc' || i.type === 'link')
                                                                    .map((item: any, idx: number) => (
                                                                    <div key={item.id} className="group flex items-start gap-3 px-4 py-3">
                                                                        <div className="mt-0.5 text-muted-foreground group-hover:text-primary transition-colors">
                                                                            {item.type === 'doc' && <FileTextIcon className="w-4 h-4" />}
                                                                            {item.type === 'link' && <Link2 className="w-4 h-4" />}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-center justify-between gap-3">
                                                                                <div className="min-w-0">
                                                                                    <div className="text-sm font-medium text-foreground truncate" data-testid={`text-deliverable-version-name-${item.id}`}>{item.title}</div>
                                                                                    <div className="text-[10px] text-muted-foreground" data-testid={`text-deliverable-version-meta-${item.id}`}>Version {(((doc as any).items || []) as any[]).filter((v: any) => v.type === 'doc' || v.type === 'link').length - idx} • {item.date}</div>
                                                                                </div>
                                                                                <div className="flex items-center gap-2 shrink-0">
                                                                                    <button
                                                                                        data-testid={`button-delete-version-${item.id}`}
                                                                                        className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            deleteDeliverableItem(doc.id, item.id);
                                                                                        }}
                                                                                        aria-label="Delete version"
                                                                                        title="Delete version"
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
