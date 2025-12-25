import { cn } from "./ui/utils";

interface KeyboardShortcutProps {
  keys: string[];
  className?: string;
}

export function KeyboardShortcut({ keys, className }: KeyboardShortcutProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {keys.map((key, index) => (
        <span key={index}>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            {key}
          </kbd>
          {index < keys.length - 1 && <span className="text-muted-foreground mx-1">+</span>}
        </span>
      ))}
    </div>
  );
}
