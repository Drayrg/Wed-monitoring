import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, LayoutDashboard, List, Computer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThemeToggle from "@/components/controls/ThemeToggle";

const Sidebar = () => {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigationItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard className="mr-3 h-5 w-5" />,
    },
    {
      name: "Processes",
      path: "/processes",
      icon: <List className="mr-3 h-5 w-5" />,
    },
    {
      name: "System Details",
      path: "/system-details",
      icon: <Computer className="mr-3 h-5 w-5" />,
    },
  ];

  return (
    <aside className="w-full md:w-64 md:min-h-screen bg-sidebar-background border-r border-sidebar-border">
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-sidebar-foreground flex items-center">
          <LayoutDashboard className="mr-2 h-6 w-6 text-primary" />
          <span>SystemPulse</span>
        </h1>
        <div className="flex items-center">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden ml-2"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <ScrollArea className={`p-2 ${isOpen ? 'block' : 'hidden'} md:block`}>
        <nav>
          <ul>
            {navigationItems.map((item) => (
              <li key={item.path} className="mb-1">
                <Link href={item.path}>
                  <button
                    className={`sidebar-link flex items-center p-3 w-full text-left text-sidebar-foreground rounded hover:bg-sidebar-primary/10 ${
                      location === item.path ? "active bg-sidebar-primary/20 text-sidebar-foreground font-medium" : ""
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
