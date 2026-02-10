import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, ArrowUp, User, Bot } from "lucide-react";
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
        <div className="flex flex-col">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={cn(
                "group px-6 py-4 border-b border-border/50 hover:bg-muted/10 transition-colors flex gap-4",
                msg.role === "ai" ? "bg-muted/5" : "bg-background"
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5",
                  msg.role === "ai"
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {msg.role === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              
              <div className="flex-1 min-w-0 space-y-2">
                 <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {msg.role === "ai" ? "AI Assistant" : "You"}
                    </span>
                    <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        {msg.timestamp}
                    </span>
                 </div>
                 
                 <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground font-normal">
                    {msg.content}
                 </div>

                 {msg.hasSaveableContent && !msg.saved && (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="pt-2"
                   >
                     <Tooltip>
                       <TooltipTrigger asChild>
                         <Button 
                           variant="outline" 
                           size="sm" 
                           className="h-6 text-[10px] gap-1.5 px-2 text-primary border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors font-medium rounded-sm"
                           onClick={() => onSaveContent?.(msg.id)}
                         >
                           <Paperclip className="w-3 h-3" />
                           Save to Project
                         </Button>
                       </TooltipTrigger>
                       <TooltipContent side="right">
                         <p>Save this content to your Lab?</p>
                       </TooltipContent>
                     </Tooltip>
                   </motion.div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 bg-background border-t">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[44px] max-h-[200px] resize-none pr-10 py-2.5 bg-background border-input focus-visible:ring-1 focus-visible:ring-primary shadow-sm rounded-md text-sm"
          />
          <div className="absolute right-2 bottom-1.5">
             <Button 
               size="icon" 
               variant="ghost"
               className={cn("h-7 w-7 transition-all rounded-sm", input.trim() ? "text-primary hover:text-primary hover:bg-primary/10" : "text-muted-foreground")}
               onClick={handleSend}
               disabled={!input.trim()}
             >
               <ArrowUp className="w-4 h-4" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
