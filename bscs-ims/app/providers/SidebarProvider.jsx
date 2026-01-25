"use client";
import React from "react";
import { PanelLeftIcon } from "lucide-react";

const SidebarContext = React.createContext(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within SidebarProvider");
  return context;
}

export function SidebarProvider({ children }) {
  const [open, setOpen] = React.useState(true);

  const toggleSidebar = React.useCallback(() => setOpen((prev) => !prev), []);

  const contextValue = React.useMemo(() => ({ open, setOpen, toggleSidebar }), [open, toggleSidebar]);

  return <SidebarContext.Provider value={contextValue}>{children}</SidebarContext.Provider>;
}

export function SidebarTrigger({ className, ...props }) {
  const { toggleSidebar, open } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className={`flex items-center justify-center p-2 transition-all duration-300 z-50 ${
        open ? "ml-64" : "ml-0"
      } ${className || ""}`}
      {...props}
    >
      <PanelLeftIcon className="w-6 h-6 text-gray-700" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
}
