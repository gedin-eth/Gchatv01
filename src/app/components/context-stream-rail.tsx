import { Menu, Sidebar } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface ContextStreamRailProps {
  onExpand: () => void;
  toolCount: number;
  activeToolCount: number;
}

export function ContextStreamRail({ onExpand, toolCount, activeToolCount }: ContextStreamRailProps) {
  return (
    <div className="w-14 border-r border-border bg-card flex flex-col items-center py-4 gap-4 shrink-0">
      {/* Expand button */}
      <Button variant="ghost" size="icon" onClick={onExpand}>
        <Menu className="w-4 h-4" />
      </Button>

      {/* Tool status indicator */}
      <div className="relative">
        <Sidebar className="w-4 h-4 text-muted-foreground" />
        {activeToolCount > 0 && (
          <Badge
            variant="default"
            className="absolute -top-2 -right-2 w-4 h-4 p-0 flex items-center justify-center text-[10px]"
          >
            {activeToolCount}
          </Badge>
        )}
      </div>

      {/* Status dots for tools */}
      <div className="flex-1 flex flex-col gap-2 items-center mt-4">
        {Array.from({ length: Math.min(toolCount, 5) }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index < activeToolCount ? "bg-blue-500 animate-pulse" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
