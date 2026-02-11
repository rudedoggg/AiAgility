import { Header } from "./Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

interface AppShellProps {
    children: React.ReactNode;
    sidebarContent?: React.ReactNode;
    sidebarTitle?: string;
}

export function AppShell({ children, sidebarContent, sidebarTitle }: AppShellProps) {
  return (
    <div className="h-screen w-screen bg-background text-foreground font-sans flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 pt-[60px] h-full overflow-hidden w-full">
         <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            {/* Unified Left Sidebar */}
            <ResizablePanel defaultSize={20} minSize={15} maxSize={25} className="bg-sidebar border-r flex flex-col h-full">
                {/* Single Navigation Section */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="p-3 border-b bg-sidebar-accent/30 h-[40px] flex items-center">
                        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{sidebarTitle || "Navigation"}</h2>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2">
                            {sidebarContent}
                        </div>
                    </ScrollArea>
                </div>
            </ResizablePanel>

            <ResizableHandle />

            {/* Main Content Area */}
            <ResizablePanel defaultSize={80}>
                {children}
            </ResizablePanel>
         </ResizablePanelGroup>
      </div>
    </div>
  );
}
