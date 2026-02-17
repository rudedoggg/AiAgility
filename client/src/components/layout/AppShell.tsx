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
    <div className="h-screen w-screen bg-muted/30 text-foreground font-sans flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 pt-[60px] h-full overflow-hidden w-full">
         <ResizablePanelGroup direction="vertical" className="h-full w-full p-2 gap-2">
            {/* Top Section: Split Nav & Chat */}
            <ResizablePanel defaultSize={45} minSize={30} maxSize={60}>
                <ResizablePanelGroup direction="horizontal" className="h-full w-full gap-2">
                    {/* Top Left: Navigation */}
                    <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="flex flex-col h-full">
                        <div className="flex-1 flex flex-col min-h-0 bg-background rounded-lg shadow-sm border border-border/40 overflow-hidden">
                            <div className="px-4 py-3 border-b bg-muted/20 h-[40px] flex items-center shrink-0">
                                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{navTitle || "Navigation"}</h2>
                            </div>
                            <ScrollArea className="flex-1">
                                <div className="p-2">
                                    {navContent}
                                </div>
                            </ScrollArea>
                        </div>
                    </ResizablePanel>
                    
                    <ResizableHandle className="bg-transparent hover:bg-border/50 transition-colors w-[3px]" />

                    {/* Top Right: Chat & Summary */}
                    <ResizablePanel defaultSize={80} className="flex flex-col h-full">
                        <div className="flex-1 flex flex-col min-h-0 bg-background rounded-lg shadow-sm border border-border/40 overflow-hidden">
                            {topRightContent}
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>

            <ResizableHandle className="bg-transparent hover:bg-border/50 transition-colors h-[3px]" />

            {/* Bottom Section: Main Content (Full Width) */}
            <ResizablePanel defaultSize={55}>
                <div className="h-full bg-background rounded-lg shadow-sm border border-border/40 overflow-hidden">
                    {children}
                </div>
            </ResizablePanel>
         </ResizablePanelGroup>
      </div>
    </div>
  );
}
