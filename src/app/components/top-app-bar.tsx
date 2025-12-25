import { Settings, User, Moon, Sun, Zap, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useTheme } from "next-themes";
import { useState } from "react";
import { MCPToolManager } from "./mcp-tool-manager";

export function TopAppBar() {
  const { theme, setTheme } = useTheme();
  const [toolManagerOpen, setToolManagerOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
        {/* Left: Logo, Workspace, Breadcrumb */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <span>Workspace</span>
              <span>/</span>
              <span>Project Alpha</span>
              <span>/</span>
              <span className="text-foreground">Chat Thread</span>
            </div>
          </div>
        </div>

        {/* Center: Editable conversation title */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-md px-4">
          <input
            type="text"
            defaultValue="MCP Tool Integration Discussion"
            className="bg-transparent text-center outline-none hover:bg-accent/50 px-3 py-1 rounded transition-colors w-full text-sm md:text-base"
          />
          <span className="text-xs text-muted-foreground hidden sm:block">Last updated 2 minutes ago</span>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle theme</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setToolManagerOpen(true)}>
                  <Zap className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>MCP Tool Manager</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Profile</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="h-6 mx-1" />
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
        </div>
      </div>
      
      <MCPToolManager open={toolManagerOpen} onOpenChange={setToolManagerOpen} />
    </TooltipProvider>
  );
}