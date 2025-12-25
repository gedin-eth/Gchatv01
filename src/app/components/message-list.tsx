import { ScrollArea } from "./ui/scroll-area";
import { MessageItem, Message } from "./message-item";
import { motion } from "motion/react";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {};
  messages.forEach((message) => {
    const date = message.timestamp.split(" ")[0]; // Extract date part
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return (
    <ScrollArea className="flex-1 w-full">
      {/* Centered conversation column with max width ~880-960px */}
      <div className="w-full max-w-[920px] mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 relative max-w-full overflow-x-hidden">
        {/* Vertical timeline connector */}
        <div className="absolute left-12 top-0 bottom-0 w-px bg-border/30 hidden md:block" />
        
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date} className="space-y-4 max-w-full overflow-x-hidden">
            {/* Date separator */}
            <div className="flex items-center gap-4">
              <div className="h-px bg-border flex-1" />
              <span className="text-xs text-muted-foreground font-medium">{date}</span>
              <div className="h-px bg-border flex-1" />
            </div>

            {/* Messages */}
            {msgs.map((message) => (
              <div key={message.id} className="max-w-full overflow-x-hidden">
                <MessageItem message={message} />
              </div>
            ))}
          </div>
        ))}

        {/* Typing indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-3 max-w-full overflow-x-hidden"
        >
          <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center bg-gradient-to-br from-orange-500 to-pink-500">
            <span className="text-white text-sm">AI</span>
          </div>
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2">
            <motion.div
              className="flex gap-1"
              initial="start"
              animate="end"
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-foreground/40"
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-foreground/40"
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-foreground/40"
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
              />
            </motion.div>
          </div>
        </motion.div>
        
        {/* Bottom padding to ensure last message is visible above input dock */}
        <div className="h-8" />
      </div>
    </ScrollArea>
  );
}