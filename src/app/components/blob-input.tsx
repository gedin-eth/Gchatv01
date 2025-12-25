import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { MessageSquare, Mic, Paperclip, Zap, Send, X } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type BlobState = "idle" | "orbiting" | "text-input";

interface OrbitOption {
  id: string;
  icon: typeof MessageSquare;
  label: string;
  gradient: string;
}

interface BlobInputProps {
  isMobile?: boolean;
}

const ORBIT_OPTIONS: OrbitOption[] = [
  {
    id: "chat",
    icon: MessageSquare,
    label: "Chat",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "talk",
    icon: Mic,
    label: "Talk",
    gradient: "from-purple-500 to-violet-500",
  },
  {
    id: "attach",
    icon: Paperclip,
    label: "Attach",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "tools",
    icon: Zap,
    label: "Tools",
    gradient: "from-orange-500 to-pink-500",
  },
];

export function BlobInput({ isMobile = false }: BlobInputProps) {
  const [state, setState] = useState<BlobState>("idle");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [value, setValue] = useState("");
  const [isDraggable, setIsDraggable] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const constraintRef = useRef<HTMLDivElement>(null);
  const lastTapTime = useRef<number>(0);

  // Auto-focus when entering text-input state
  useEffect(() => {
    if (state === "text-input" && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [state]);

  const handleLongPressStart = () => {
    // Start timer to enable dragging on press-and-hold
    longPressTimer.current = setTimeout(() => {
      setIsDraggable(true);
    }, 300); // 300ms to enable drag
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    // Disable dragging when press ends
    setIsDraggable(false);
  };

  const handleTap = () => {
    // Detect double-click
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTime.current;
    
    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      // Double-click detected - toggle orbit icons
      setState(state === "orbiting" ? "idle" : "orbiting");
    }
    
    lastTapTime.current = now;
  };

  const handleOrbitOptionClick = (optionId: string) => {
    setState("idle");
    if (optionId === "chat") {
      setState("text-input");
    } else {
      console.log(`Selected option: ${optionId}`);
    }
  };

  const handleSend = () => {
    if (!value.trim()) return;
    console.log("Sending message:", value);
    setValue("");
    setState("idle");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDismiss = () => {
    setValue("");
    setState("idle");
  };

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setPosition((prev) => ({
      x: prev.x + info.delta.x,
      y: prev.y + info.delta.y,
    }));
  };

  // Orbit positions (circular arrangement)
  const getOrbitPosition = (index: number, total: number) => {
    // Semi-circle above blob: from π (left) to 0 (right)
    // Evenly distribute items across 180 degrees
    const angle = Math.PI - (index * Math.PI) / (total - 1);
    const radius = 80;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  return (
    <>
      {/* Constraint area for dragging (lower half of screen) */}
      <div
        ref={constraintRef}
        className="fixed inset-0 pointer-events-none"
        style={{ top: "50%" }}
      />

      {/* Text Input State */}
      <AnimatePresence>
        {state === "text-input" && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}
          >
            <div className="px-4 pb-3">
              <div className="flex items-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-10 w-10 rounded-xl bg-background/95 backdrop-blur-xl border border-border shadow-lg"
                  onClick={handleDismiss}
                >
                  <X className="w-5 h-5" />
                </Button>
                
                <Textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  className="flex-1 min-h-[44px] max-h-32 resize-none bg-background/95 backdrop-blur-xl border border-border shadow-lg rounded-2xl px-4 py-3"
                  rows={1}
                />
                
                <Button
                  size="icon"
                  className="shrink-0 h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg"
                  onClick={handleSend}
                  disabled={!value.trim()}
                >
                  <Send className="w-5 h-5 text-white" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blob Input (Idle & Orbiting States) */}
      {state !== "text-input" && (
        <motion.div
          drag={isDraggable}
          dragConstraints={constraintRef}
          dragElastic={0.1}
          dragMomentum={false}
          onDrag={handleDrag}
          onTapStart={handleLongPressStart}
          onTap={handleTap}
          onTapCancel={handleLongPressEnd}
          className="fixed z-50 pointer-events-auto cursor-grab active:cursor-grabbing overflow-visible"
          style={
            isMobile
              ? {
                  x: position.x,
                  y: position.y,
                  bottom: 48,
                  left: "50%",
                  translateX: "-50%",
                }
              : {
                  x: position.x,
                  y: position.y,
                  bottom: 64,
                  right: 80,
                }
          }
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Circular glow shadow - positioned directly under blob */}
          <div 
            className="absolute w-14 h-14 rounded-full bg-gray-400 opacity-40 -z-10"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(24px)',
            }}
          />

          {/* Main blob */}
          <motion.div
            className="relative overflow-visible"
            animate={{
              scale: state === "orbiting" ? 1.1 : 1,
              y: state === "idle" ? [0, -4, 0] : 0,
            }}
            transition={{ 
              scale: { type: "spring", damping: 20, stiffness: 300 },
              y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {/* Glowing blob - circular and floating */}
            <motion.div
              className="relative w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-2xl flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 4px 20px rgba(59, 130, 246, 0.5), 0 8px 40px rgba(168, 85, 247, 0.3)",
                  "0 6px 24px rgba(168, 85, 247, 0.5), 0 10px 48px rgba(236, 72, 153, 0.3)",
                  "0 4px 20px rgba(59, 130, 246, 0.5), 0 8px 40px rgba(168, 85, 247, 0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm" />

              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/50"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
            </motion.div>

            {/* Orbiting options */}
            <AnimatePresence>
              {state === "orbiting" && (
                <>
                  {ORBIT_OPTIONS.map((option, index) => {
                    const pos = getOrbitPosition(index, ORBIT_OPTIONS.length);
                    const Icon = option.icon;
                    
                    return (
                      <motion.button
                        key={option.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                          x: pos.x,
                          y: pos.y,
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          type: "spring",
                          damping: 15,
                          stiffness: 300,
                          delay: index * 0.05,
                        }}
                        onClick={() => handleOrbitOptionClick(option.id)}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                      >
                        {/* Orbit satellite */}
                        <div className="flex flex-col items-center gap-1">
                          <motion.div
                            className={`w-12 h-12 rounded-full bg-gradient-to-r ${option.gradient} shadow-xl flex items-center justify-center`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </motion.div>
                          <span className="text-xs font-medium text-foreground bg-background/90 px-2 py-0.5 rounded-full">
                            {option.label}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                  
                  {/* Backdrop to dismiss */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-20"
                    onClick={() => setState("idle")}
                  />
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}