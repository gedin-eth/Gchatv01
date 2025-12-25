import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Database, Globe, Code2, FileText, Zap } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface MCPToolManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const availableTools = [
  {
    id: "database",
    name: "Database",
    description: "Query and update data",
    icon: Database,
    color: "from-red-500 to-orange-500",
    enabled: true,
  },
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the web for information",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
    enabled: true,
  },
  {
    id: "code-executor",
    name: "Code Executor",
    description: "Run and test code",
    icon: Code2,
    color: "from-green-500 to-emerald-500",
    enabled: true,
  },
  {
    id: "file-system",
    name: "File System",
    description: "Access and manage files",
    icon: FileText,
    color: "from-purple-500 to-violet-500",
    enabled: false,
  },
  {
    id: "api-gateway",
    name: "API Gateway",
    description: "Connect to external APIs",
    icon: Zap,
    color: "from-pink-500 to-rose-500",
    enabled: true,
  },
];

export function MCPToolManager({ open, onOpenChange }: MCPToolManagerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>MCP Tool Manager</DialogTitle>
          <DialogDescription>
            Enable or disable MCP tools for this conversation
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-3 pr-4">
            {availableTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{tool.name}</h4>
                        {tool.enabled && (
                          <Badge variant="outline" className="text-xs bg-green-500/20 text-green-700 dark:text-green-400">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </div>
                  </div>
                  <Switch defaultChecked={tool.enabled} />
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">
              {availableTools.filter((t) => t.enabled).length}/{availableTools.length}
            </span>{" "}
            tools active
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
