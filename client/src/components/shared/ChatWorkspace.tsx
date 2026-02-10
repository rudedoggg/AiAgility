import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, Mic, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
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
      <ScrollArea className="flex-1 px-4 py-6" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-4 group",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-medium",
                  msg.role === "ai"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {msg.role === "ai" ? "AI" : "You"}
              </div>
              <div
                className={cn(
                  "relative max-w-[85%] rounded-2xl px-5 py-3 text-[15px] leading-relaxed",
                  msg.role === "user"
                    ? "bg-muted/50 text-foreground"
                    : "bg-transparent text-foreground pl-0"
                )}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                
                {msg.hasSaveableContent && !msg.saved && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="mt-2 inline-flex"
                   >
                     <Tooltip>
                       <TooltipTrigger asChild>
                         <Button 
                           variant="outline" 
                           size="sm" 
                           className="h-7 text-xs gap-1.5 text-primary border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors font-medium"
                           onClick={() => onSaveContent?.(msg.id)}
                         >
                           <Paperclip className="w-3 h-3" />
                           Save to Project
                         </Button>
                       </TooltipTrigger>
                       <TooltipContent>
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
        <div className="max-w-3xl mx-auto relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[50px] max-h-[200px] resize-none pr-12 py-3 bg-muted/30 border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-primary/50 shadow-sm rounded-xl"
          />
          <div className="absolute right-2 bottom-2.5 flex gap-1">
             <Button 
               size="icon" 
               variant={input.trim() ? "default" : "ghost"}
               className={cn("h-8 w-8 transition-all", input.trim() ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
               onClick={handleSend}
               disabled={!input.trim()}
             >
               <ArrowUp className="w-4 h-4" />
             </Button>
          </div>
        </div>
        <div className="text-center mt-2 text-xs text-muted-foreground">
            AI can make mistakes. Please use judgment.
        </div>
      </div>
    </div>
  );
}
