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
import { Message, Bucket } from "@/lib/types";
import { FileText, Link as LinkIcon, MessageSquare, StickyNote, FolderOpen, Folder, Plus, ChevronRight, Upload, Link2, RefreshCw, Trash2 } from "lucide-react";
import { cn, getBucketProgressPercent } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { SummaryCard } from "@/components/shared/SummaryCard";
import { ScopedHistory } from "@/components/shared/ScopedHistory";

export default function LabPage() {
  const { templates, baseMessages } = getProjectTemplates();
  const [activeProject, setActiveProject] = useState(getSelectedProject());

  const template = templates[activeProject.id];

  const [messages, setMessages] = useState<Message[]>(template ? baseMessages : mockMessages);
  const [buckets, setBuckets] = useState<Bucket[]>(
    template ? template.lab.buckets.map(b => ({ ...b, bucketMessages: (b as any).bucketMessages || [] })) : []
  );
  const bucketRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const unsub = subscribeToSelectedProject((p) => {
      setActiveProject(p);

      const nextTemplate = templates[p.id];
      setMessages(nextTemplate ? baseMessages : mockMessages);
      setBuckets(nextTemplate ? nextTemplate.lab.buckets.map(b => ({ ...b, bucketMessages: (b as any).bucketMessages || [] })) : []);
    });
    return () => unsub();
  }, [baseMessages, templates]);

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

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const bucketIds = useMemo(() => buckets.map((b) => b.id), [buckets]);

  function SortableNavRow({ bucketId }: { bucketId: string }) {
    const bucket = buckets.find((b) => b.id === bucketId);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: bucketId });

    if (!bucket) return null;

    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        data-testid={`nav-row-${bucket.id}`}
        onClick={() => scrollToBucket(bucket.id)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm font-medium border-l-2 cursor-pointer transition-colors select-none",
          "border-transparent text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50",
          isDragging && "bg-sidebar-accent/60 text-foreground"
        )}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.85 : 1,
        }}
      >
        <Folder className="w-3.5 h-3.5" />
        <span className="truncate flex-1">{bucket.name}</span>
        <span className="text-[10px] bg-sidebar-border px-1.5 rounded-sm">{bucket.items.length}</span>
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

            setBuckets((prev) => {
              const oldIndex = prev.findIndex((b) => b.id === active.id);
              const newIndex = prev.findIndex((b) => b.id === over.id);
              if (oldIndex === -1 || newIndex === -1) return prev;
              return arrayMove(prev, oldIndex, newIndex);
            });
          }}
        >
          <SortableContext items={bucketIds} strategy={verticalListSortingStrategy}>
            {bucketIds.map((id) => (
              <SortableNavRow key={id} bucketId={id} />
            ))}
          </SortableContext>
        </DndContext>

          <Button
            data-testid="button-add-bucket"
            variant="ghost"
            size="sm"
            className="w-full justify-start px-3 mt-2 text-xs text-muted-foreground hover:text-primary"
            onClick={() => {
              const name = window.prompt("New knowledge bucket", "New bucket");
              if (!name) return;

              const id = `bucket-${Date.now()}`;
              setBuckets((prev) => [
                {
                  id,
                  name,
                  isOpen: true,
                  items: [],
                  bucketMessages: [],
                } as any,
                ...prev,
              ]);

              setTimeout(() => {
                bucketRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 50);
            }}
          >
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
                 <ChatWorkspace
                    messages={messages}
                    onSendMessage={() => {}}
                    saveDestinations={buckets.map((b) => ({ id: b.id, label: b.name }))}
                    onSaveContent={(messageId, destinationId) => {
                        const msg = messages.find((m) => m.id === messageId);
                        if (!msg) return;

                        setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, saved: true } : m)));

                        const noteTitle = msg.content.split("\n")[0]?.slice(0, 80) || "Saved chat";
                        const noteBody = msg.content;

                        addBucketItem(destinationId, {
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
                                            style={{
                                                width: `${getBucketProgressPercent({
                                                    itemsCount: bucket.items.length,
                                                })}%`,
                                            }}
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
                                            {/* Left Content Column: Bucket Chat */}
                                            <div className="w-[60%] border-r border-border/50">
                                                <div className="h-full flex flex-col">
                                                    <div className="px-4 py-3 border-b border-border/50 text-[11px] uppercase tracking-wider text-muted-foreground" data-testid={`text-bucket-chat-title-${bucket.id}`}>Bucket Chat</div>
                                                    <div className="flex-1 min-h-0">
                                                        <ChatWorkspace
                                                            messages={((bucket as any).bucketMessages || []) as any}
                                                            onSendMessage={(content) => {
                                                                const userMsg = {
                                                                    id: Date.now().toString(),
                                                                    role: "user" as const,
                                                                    content,
                                                                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                                                };

                                                                const contextLines = [
                                                                    `Bucket: ${bucket.name}`,
                                                                    "Attachments:",
                                                                    ...((bucket.items || []).slice(0, 8).map((i) => `- [${i.type}] ${i.title}`)),
                                                                ].filter(Boolean);

                                                                const aiMsg = {
                                                                    id: (Date.now() + 1).toString(),
                                                                    role: "ai" as const,
                                                                    content: `Got it. I’m only using this bucket’s context:\n\n${contextLines.join("\n")}\n\nYou said: ${content}`,
                                                                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                                                };

                                                                setBuckets((prev) =>
                                                                    prev.map((b) =>
                                                                        b.id === bucket.id
                                                                            ? {
                                                                                  ...b,
                                                                                  bucketMessages: [...(((b as any).bucketMessages || []) as any[]), userMsg, aiMsg],
                                                                              }
                                                                            : b
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
                                                    <div className="px-4 py-3 border-b border-border/50 text-[11px] uppercase tracking-wider text-muted-foreground" data-testid={`text-attachments-title-${bucket.id}`}>Attachments</div>
                                                    <div className="flex-1 overflow-y-auto">
                                                        {(bucket.items || []).length === 0 ? (
                                                            <div className="px-4 py-3 text-sm text-muted-foreground" data-testid={`text-attachments-empty-${bucket.id}`}>No files, links, or notes yet.</div>
                                                        ) : (
                                                            <div className="divide-y">
                                                                {(bucket.items || []).map((item) => (
                                                                    <div key={item.id} className="group flex items-start gap-3 px-4 py-3">
                                                                        <div className="mt-0.5 text-muted-foreground group-hover:text-primary transition-colors">
                                                                            {(item.type === 'file' || item.type === 'doc') && <FileText className="w-4 h-4" />}
                                                                            {item.type === 'link' && <LinkIcon className="w-4 h-4" />}
                                                                            {item.type === 'note' && <StickyNote className="w-4 h-4" />}
                                                                            {item.type === 'chat' && <MessageSquare className="w-4 h-4" />}
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
                </div>
             </ScrollArea>
         </div>
    </AppShell>
  );
}
