import { Copy, RotateCcw, Edit, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { useState } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  tools?: string[];
  codeBlock?: {
    filename: string;
    language: string;
    code: string;
  };
}

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex gap-3 mb-4">
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
            message.role === "user"
              ? "bg-gradient-to-br from-purple-500 to-blue-500"
              : "bg-gradient-to-br from-orange-500 to-pink-500"
          }`}
        >
          <span className="text-white text-sm">
            {message.role === "user" ? "U" : "AI"}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">
              {message.role === "user" ? "You" : "Assistant"}
            </span>
            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
          </div>

          {/* Message text */}
          <div className="text-foreground whitespace-pre-wrap mb-2">{message.content}</div>

          {/* Code block if present */}
          {message.codeBlock && (
            <div className="border border-border rounded-lg overflow-hidden bg-muted/30 mb-2 shadow-sm">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{message.codeBlock.filename}</span>
                  <Badge variant="outline" className="text-xs">
                    {message.codeBlock.language}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
              <pre className="p-4 text-sm overflow-x-auto bg-black/5 dark:bg-white/5">
                <code className="text-foreground/90">{message.codeBlock.code}</code>
              </pre>
            </div>
          )}

          {/* Tool chips */}
          {message.tools && message.tools.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {message.tools.map((tool, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-accent transition-colors"
                >
                  {tool}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Hover actions */}
        {showActions && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-1"
          >
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Copy className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <RotateCcw className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="w-3 h-3" />
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}