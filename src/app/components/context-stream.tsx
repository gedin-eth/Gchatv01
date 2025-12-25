import { Database, Globe, Code2, FileText, Zap, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { motion, AnimatePresence } from "motion/react";

export type ToolStatus = "pending" | "running" | "completed" | "error";

export interface MCPTool {
  id: string;
  name: string;
  description: string;
  status: ToolStatus;
  icon: "database" | "web" | "code" | "file" | "api";
  timestamp?: string;
}

interface ContextStreamProps {
  isOpen: boolean;
  onClose: () => void;
  tools: MCPTool[];
}

const iconMap = {
  database: Database,
  web: Globe,
  code: Code2,
  file: FileText,
  api: Zap,
};

const statusColorMap = {
  pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  running: "bg-blue-500/20 text-blue-700 dark:text-blue-400 animate-pulse",
  completed: "bg-green-500/20 text-green-700 dark:text-green-400",
  error: "bg-red-500/20 text-red-700 dark:text-red-400",
};

export function ContextStream({ isOpen, onClose, tools }: ContextStreamProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="absolute left-0 top-0 bottom-0 w-80 bg-card/95 backdrop-blur-sm border-r border-border shadow-xl z-50"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0">
              <div>
                <h3 className="font-medium">Context Stream</h3>
                <p className="text-xs text-muted-foreground">MCP tools & resources</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Tool Cards */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {tools.map((tool) => {
                  const Icon = iconMap[tool.icon];
                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors cursor-pointer ${
                        tool.status === "running"
                          ? "border-blue-500 shadow-lg shadow-blue-500/20"
                          : tool.status === "completed"
                          ? "border-green-500/30"
                          : tool.status === "error"
                          ? "border-red-500/30"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-medium truncate">{tool.name}</h4>
                            <Badge
                              variant="outline"
                              className={`text-xs capitalize ${statusColorMap[tool.status]}`}
                            >
                              {tool.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {tool.description}
                          </p>
                          {tool.timestamp && (
                            <p className="text-xs text-muted-foreground mt-2">{tool.timestamp}</p>
                          )}
                          {tool.status === "running" && (
                            <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-blue-500"
                                initial={{ width: "0%" }}
                                animate={{ width: "70%" }}
                                transition={{ duration: 1, ease: "easeInOut" }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}