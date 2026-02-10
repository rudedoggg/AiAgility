import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, ArrowUp, User, Bot, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatWorkspaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  onSaveContent?: (messageId: string) => void;
  className?: string;
}

export function ChatWorkspace({ messages, onSendMessage, onSaveContent, className }: ChatWorkspaceProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
        const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }
  }, [messages]);

  return (
    <div className={cn("flex flex-col h-full bg-background relative", className)}>
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="flex flex-col py-2">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={cn(
                "group px-4 py-2 hover:bg-muted/10 transition-colors flex gap-3 text-sm border-b border-transparent hover:border-border/30",
                msg.role === "ai" ? "bg-muted/5" : "bg-background"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-sm flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono border",
                  msg.role === "ai"
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-muted text-muted-foreground border-border"
                )}
              >
                {msg.role === "ai" ? "AI" : "ME"}
              </div>
              
              <div className="flex-1 min-w-0">
                 <div className="flex items-start justify-between gap-4">
                     <div className="text-foreground leading-snug whitespace-pre-wrap">
                        {msg.content}
                     </div>
                     
                     {/* Metadata & Actions - Inline Right */}
                     <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <span className="text-[10px] text-muted-foreground font-mono">
                            {msg.timestamp}
                        </span>
                        
                        {msg.hasSaveableContent && !msg.saved && (
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <Button 
                                 variant="ghost" 
                                 size="sm" 
                                 className="h-5 px-1.5 text-[10px] gap-1 text-primary hover:bg-primary/10 hover:text-primary transition-colors font-medium rounded-sm"
                                 onClick={() => onSaveContent?.(msg.id)}
                               >
                                 <Paperclip className="w-3 h-3" />
                                 Save
                               </Button>
                             </TooltipTrigger>
                             <TooltipContent side="left" className="text-xs">
                               Save to Project
                             </TooltipContent>
                           </Tooltip>
                        )}
                        {!msg.hasSaveableContent && (
                            <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground">
                                <Copy className="w-3 h-3" />
                            </Button>
                        )}
                     </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 bg-background border-t">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[36px] max-h-[120px] resize-none pr-9 py-2 bg-background border-input focus-visible:ring-1 focus-visible:ring-primary shadow-sm rounded-sm text-sm leading-tight"
          />
          <div className="absolute right-1.5 bottom-1">
             <Button 
               size="icon" 
               variant="ghost"
               className={cn("h-6 w-6 transition-all rounded-sm", input.trim() ? "text-primary hover:text-primary hover:bg-primary/10" : "text-muted-foreground")}
               onClick={handleSend}
               disabled={!input.trim()}
             >
               <ArrowUp className="w-3.5 h-3.5" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
