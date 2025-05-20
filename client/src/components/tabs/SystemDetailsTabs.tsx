import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SystemDetailsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SystemDetailsTabs = ({ activeTab, setActiveTab }: SystemDetailsTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full grid grid-cols-4 bg-card border-b border-border rounded-none p-0">
        <TabsTrigger 
          value="hardware" 
          className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
        >
          Hardware
        </TabsTrigger>
        <TabsTrigger 
          value="os" 
          className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
        >
          Operating System
        </TabsTrigger>
        <TabsTrigger 
          value="storage" 
          className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
        >
          Storage
        </TabsTrigger>
        <TabsTrigger 
          value="network" 
          className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
        >
          Network
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default SystemDetailsTabs;