import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, LayoutDashboard, List, Computer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <aside className="w-full md:w-64 md:min-h-screen bg-background-card border-r border-gray-800">
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground flex items-center">
          <LayoutDashboard className="mr-2 h-6 w-6" />
          System Monitor
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <ScrollArea className={`p-2 ${isOpen ? 'block' : 'hidden'} md:block`}>
        <nav>
          <ul>
            {navigationItems.map((item) => (
              <li key={item.path} className="mb-1">
                <Link href={item.path}>
                  <a
                    className={`sidebar-link flex items-center p-3 text-foreground rounded hover:bg-background-hover ${
                      location === item.path ? "active" : ""
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </a>
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
