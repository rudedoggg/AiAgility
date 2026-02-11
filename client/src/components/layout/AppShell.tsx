import { Header } from "./Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

interface AppShellProps {
    children: React.ReactNode; // Bottom full-width content
    navContent: React.ReactNode; // Top-left navigation
    navTitle?: string;
    topRightContent: React.ReactNode; // Top-right chat & summary
}

export function AppShell({ children, navContent, navTitle, topRightContent }: AppShellProps) {
  return (
    <div className="h-screen w-screen bg-background text-foreground font-sans flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 pt-[60px] h-full overflow-hidden w-full">
         <ResizablePanelGroup direction="vertical" className="h-full w-full">
            {/* Top Section: Split Nav & Chat */}
            <ResizablePanel defaultSize={45} minSize={30} maxSize={60} className="border-b">
                <ResizablePanelGroup direction="horizontal" className="h-full w-full">
                    {/* Top Left: Navigation */}
                    <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-sidebar border-r flex flex-col h-full">
                        <div className="flex-1 flex flex-col min-h-0">
                            <div className="p-3 border-b bg-sidebar-accent/30 h-[40px] flex items-center shrink-0">
                                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{navTitle || "Navigation"}</h2>
                            </div>
                            <ScrollArea className="flex-1">
                                <div className="p-2">
                                    {navContent}
                                </div>
                            </ScrollArea>
                        </div>
                    </ResizablePanel>
                    
                    <ResizableHandle />

                    {/* Top Right: Chat & Summary */}
                    <ResizablePanel defaultSize={80}>
                        {topRightContent}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>

            <ResizableHandle />

            {/* Bottom Section: Main Content (Full Width) */}
            <ResizablePanel defaultSize={55}>
                {children}
            </ResizablePanel>
         </ResizablePanelGroup>
      </div>
    </div>
  );
}
