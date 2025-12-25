import { X, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "motion/react";

interface InsightsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InsightsPanel({ isOpen, onClose }: InsightsPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="absolute right-0 top-0 bottom-0 w-80 bg-card/95 backdrop-blur-sm border-l border-border shadow-xl z-50"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0">
              <div>
                <h3 className="font-medium">Conversation</h3>
                <p className="text-xs text-muted-foreground">Settings & insights</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Model Selection */}
              <div className="space-y-2">
                <Label>Model</Label>
                <Select defaultValue="claude-sonnet-4">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claude-sonnet-4">Claude Sonnet 4</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Temperature */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Temperature</Label>
                  <span className="text-sm text-muted-foreground">0.7</span>
                </div>
                <Slider defaultValue={[0.7]} max={1} step={0.1} />
              </div>

              <Separator />

              {/* Conversation Health */}
              <div className="space-y-3">
                <Label>Conversation Health</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-400">
                      Excellent
                    </Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: "85%" }} />
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>14 messages • 3 tools used • Clear context</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Quick Actions */}
              <div className="space-y-3">
                <Label>Quick Actions</Label>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <span className="text-lg">✨</span>
                    Summarize Conversation
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <span className="text-lg">📋</span>
                    Extract Action Items
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <span className="text-lg">💡</span>
                    Explain Code Snippets
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}