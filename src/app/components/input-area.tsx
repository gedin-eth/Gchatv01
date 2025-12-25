import { Paperclip, Send, Mic, Slash, X, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

type InputMode = "chat" | "search" | "code" | "plan";

interface ContextChip {
  id: string;
  label: string;
  active: boolean;
}

const INPUT_MODE_CONFIG = {
  chat: {
    label: "Chat",
    placeholder: "Ask anything...",
    accent: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/50",
    suggestions: ["Summarize this thread", "Explain in detail", "Continue this conversation"],
  },
  search: {
    label: "Search",
    placeholder: "Search the web, docs, or your data...",
    accent: "from-green-500 to-emerald-500",
    borderColor: "border-green-500/50",
    suggestions: ["Search latest news", "Find documentation", "Research topic"],
  },
  code: {
    label: "Code",
    placeholder: "Ask about code, request implementation...",
    accent: "from-purple-500 to-violet-500",
    borderColor: "border-purple-500/50",
    suggestions: ["Analyze this code", "Generate function", "Fix bugs"],
  },
  plan: {
    label: "Plan",
    placeholder: "Create a plan, outline steps...",
    accent: "from-orange-500 to-pink-500",
    borderColor: "border-orange-500/50",
    suggestions: ["Create project plan", "Break down task", "Outline approach"],
  },
};

export function InputArea() {
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<InputMode>("chat");
  const [contextChips, setContextChips] = useState<ContextChip[]>([
    { id: "1", label: "Using 3 tools", active: true },
    { id: "2", label: "Context: Project Alpha", active: true },
    { id: "3", label: "Last result: Code Analysis", active: false },
  ]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const config = INPUT_MODE_CONFIG[mode];

  // Auto-resize textarea (max 6 lines)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      // Max 6 lines (~144px assuming 24px per line)
      const maxHeight = 144;
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + "px";
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!value.trim()) return;
    console.log("Sending message:", value, "Mode:", mode);
    setValue("");
  };

  const toggleContextChip = (id: string) => {
    setContextChips((prev) =>
      prev.map((chip) => (chip.id === id ? { ...chip, active: !chip.active } : chip))
    );
  };

  const handleSuggestionClick = (suggestion: string) => {
    setValue(suggestion);
    textareaRef.current?.focus();
  };

  return (
    <div className="border-t border-border bg-card/80 backdrop-blur-xl shrink-0">
      {/* Container with same max width as messages, centered */}
      <div className="w-full max-w-[920px] mx-auto px-6 py-4 space-y-4">
        {/* Quick suggestions - lightweight, above input */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Sparkles className="w-4 h-4 text-muted-foreground shrink-0" />
          {config.suggestions.map((suggestion, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-1.5 text-xs rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all whitespace-nowrap border border-border/50"
            >
              {suggestion}
            </motion.button>
          ))}
        </div>

        {/* Input Modes Strip */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground shrink-0">Mode:</span>
          <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-lg border border-border/50">
            {(["chat", "search", "code", "plan"] as InputMode[]).map((inputMode) => (
              <button
                key={inputMode}
                onClick={() => setMode(inputMode)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  mode === inputMode
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {INPUT_MODE_CONFIG[inputMode].label}
              </button>
            ))}
          </div>
        </div>

        {/* Context chips row */}
        <AnimatePresence>
          {contextChips.some((chip) => chip.active) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide"
            >
              <span className="text-xs text-muted-foreground shrink-0">Context:</span>
              {contextChips
                .filter((chip) => chip.active)
                .map((chip) => (
                  <Badge
                    key={chip.id}
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-accent transition-colors flex items-center gap-1 whitespace-nowrap"
                    onClick={() => toggleContextChip(chip.id)}
                  >
                    {chip.label}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input container - rounded like Perplexity */}
        <motion.div
          className={`rounded-2xl border-2 transition-colors bg-background/50 backdrop-blur-sm ${
            mode ? config.borderColor : "border-border"
          }`}
          animate={{
            borderColor: mode ? undefined : "var(--border)",
          }}
        >
          <div className="flex items-end gap-2 p-3">
            {/* Left side: Attachment and Tools */}
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-xl"
                title="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-xl"
                title="Select tools (/ shortcut)"
              >
                <Slash className="w-5 h-5" />
              </Button>
            </div>

            {/* Center: Textarea */}
            <div className="flex-1 relative min-w-0">
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={config.placeholder}
                className="min-h-[44px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-2"
                rows={1}
              />
            </div>

            {/* Right side: Mic and Send */}
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-xl"
                title="Voice input"
              >
                <Mic className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                className={`h-11 w-11 rounded-xl bg-gradient-to-r ${config.accent} hover:opacity-90 transition-opacity`}
                onClick={handleSend}
                disabled={!value.trim()}
                title="Send message"
              >
                <Send className="w-5 h-5 text-white" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Helper row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">Enter</kbd> to send
            </span>
            <span className="text-muted-foreground/50">•</span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">Shift</kbd> +{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">Enter</kbd> for newline
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>{value.length} characters</span>
            <span className="text-muted-foreground/50">•</span>
            <span className="font-medium text-foreground">GPT-4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
