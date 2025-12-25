import { useState, useEffect } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { TopAppBar } from "./components/top-app-bar";
import { ContextStream, MCPTool } from "./components/context-stream";
import { ContextStreamRail } from "./components/context-stream-rail";
import { InsightsPanel } from "./components/insights-panel";
import { MessageList } from "./components/message-list";
import { Message } from "./components/message-item";
import { BlobInput } from "./components/blob-input";
import { AtmosphericBackground } from "./components/atmospheric-background";
import { PanelLeft, PanelRight } from "lucide-react";
import { Button } from "./components/ui/button";

// Mock data
const mockTools: MCPTool[] = [
  {
    id: "1",
    name: "Database Query",
    description: "Fetched user analytics from...",
    status: "completed",
    icon: "database",
    timestamp: "2 minutes ago",
  },
  {
    id: "2",
    name: "Web Search",
    description: "Searching for React best...",
    status: "running",
    icon: "web",
  },
  {
    id: "3",
    name: "File Read",
    description: "Reading configuration file",
    status: "pending",
    icon: "file",
  },
  {
    id: "4",
    name: "Code Analysis",
    description: "Analyzed 12 TypeScript files",
    status: "completed",
    icon: "code",
    timestamp: "5 minutes ago",
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI assistant with MCP tool integration. How can I help you today?",
    timestamp: "Today 10:23 AM",
  },
  {
    id: "2",
    role: "user",
    content: "Can you help me optimize my React component for better performance?",
    timestamp: "Today 10:23 AM",
  },
  {
    id: "3",
    role: "assistant",
    content: "I'd be happy to help optimize your React component! Here are some key strategies:\n\nPerformance Optimization Techniques\n\nUse React.memo for component memoization\nuseMemo and useCallback hooks to prevent unnecessary recalculations\nCode splitting with React.lazy()\n\nHere's an example of using React.memo:",
    timestamp: "Today 10:24 AM",
    tools: ["Code Analysis", "Web Search"],
    codeBlock: {
      filename: "MyComponent.tsx",
      language: "tsx",
      code: `const MyComponent = React.memo(({ data }) => {
  return <div>{data.map(item => <Item key={item.id} {...item} />)}</div>
});`,
    },
  },
  {
    id: "4",
    role: "user",
    content: "Would you like me to analyze your specific component?",
    timestamp: "Today 10:24 AM",
  },
  {
    id: "5",
    role: "user",
    content: "Yes, please analyze this component:",
    timestamp: "Today 10:25 AM",
  },
];

export default function App() {
  const [contextStreamOpen, setContextStreamOpen] = useState(false);
  const [insightsPanelOpen, setInsightsPanelOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  const activeToolCount = mockTools.filter(
    (tool) => tool.status === "running" || tool.status === "pending"
  ).length;

  // Detect viewport size for mobile/desktop switching
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {isMobileView ? (
        // Mobile View (390×844 frame)
        <div className="min-h-screen w-screen flex items-center justify-center bg-muted/30">
          <div className="w-full max-w-[390px] h-screen max-h-[844px] flex flex-col bg-background overflow-hidden relative shadow-2xl">
            {/* Atmospheric background */}
            <AtmosphericBackground />

            {/* Main content */}
            <div className="relative z-10 flex flex-col h-full">
              {/* Top App Bar */}
              <TopAppBar />

              {/* Toggle buttons for panels */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/80 backdrop-blur-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setContextStreamOpen(!contextStreamOpen)}
                >
                  <PanelLeft className="w-4 h-4 mr-2" />
                  Context
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInsightsPanelOpen(!insightsPanelOpen)}
                >
                  <PanelRight className="w-4 h-4 mr-2" />
                  Insights
                </Button>
              </div>

              {/* Messages - with bottom padding for blob */}
              <div className="flex-1 overflow-hidden pb-32">
                <MessageList messages={mockMessages} />
              </div>

              {/* Blob Input (Mobile only) */}
              <BlobInput isMobile={true} />

              {/* Context Stream Drawer */}
              <ContextStream
                isOpen={contextStreamOpen}
                onClose={() => setContextStreamOpen(false)}
                tools={mockTools}
              />

              {/* Insights Panel Overlay */}
              <InsightsPanel
                isOpen={insightsPanelOpen}
                onClose={() => setInsightsPanelOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : (
        // Desktop View (1440×900 frame)
        <div className="min-h-screen w-screen flex items-center justify-center bg-muted/30">
          <div className="w-full max-w-[1440px] h-screen max-h-[900px] flex flex-col bg-background overflow-hidden relative shadow-2xl">
            {/* Atmospheric background */}
            <AtmosphericBackground />

            {/* Main content */}
            <div className="relative z-10 flex flex-col h-full">
              {/* Top App Bar */}
              <TopAppBar />

              {/* Main workspace */}
              <div className="flex-1 flex overflow-hidden relative">
                {/* Context Stream Rail (collapsed state) - Desktop only */}
                {!contextStreamOpen && (
                  <div className="hidden md:block">
                    <ContextStreamRail
                      onExpand={() => setContextStreamOpen(true)}
                      toolCount={mockTools.length}
                      activeToolCount={activeToolCount}
                    />
                  </div>
                )}

                {/* Context Stream Drawer (expanded state) */}
                <ContextStream
                  isOpen={contextStreamOpen}
                  onClose={() => setContextStreamOpen(false)}
                  tools={mockTools}
                />

                {/* Center: Chat Canvas */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Messages */}
                  <MessageList messages={mockMessages} />

                  {/* Blob Input - Desktop */}
                  <BlobInput isMobile={false} />
                </div>

                {/* Insights Panel - Hidden on mobile/tablet by default, shows as overlay when opened */}
                <div className="hidden lg:block">
                  {!insightsPanelOpen && (
                    <div className="w-14 border-l border-border bg-card flex flex-col items-center py-4 gap-4 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setInsightsPanelOpen(true)}
                      >
                        <PanelRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Insights Panel Overlay */}
                <InsightsPanel
                  isOpen={insightsPanelOpen}
                  onClose={() => setInsightsPanelOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
}