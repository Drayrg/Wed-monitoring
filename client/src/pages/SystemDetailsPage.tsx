import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

const SystemDetailsPage = () => {
  const { data: systemDetails, isLoading } = useQuery({
    queryKey: ["/api/system"],
  });

  return (
    <main className="flex-1 p-4 md:p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">System Details</h1>
        <p className="text-muted-foreground">Detailed hardware and operating system information</p>
      </div>

      <Card className="bg-background-card shadow-lg">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <p className="text-muted-foreground">Loading system details...</p>
            </div>
          ) : (
            <div className="text-foreground">
              <p>System details will appear here in the complete implementation</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default SystemDetailsPage;
