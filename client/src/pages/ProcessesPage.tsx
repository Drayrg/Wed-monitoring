import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useUpdateInterval } from "@/context/UpdateIntervalContext";
import UpdateIntervalSelect from "@/components/controls/UpdateIntervalSelect";
import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Интерфейс для данных о процессе
interface Process {
  pid: number;
  name: string;
  cpuUsage: number;
  memoryUsage: string;
}

const ProcessesPage = () => {
  const { interval } = useUpdateInterval();
  
  const { data: processes, isLoading, refetch } = useQuery({
    queryKey: ["/api/processes"],
    // Здесь мы получаем данные о процессах с сервера
    // В реальном приложении endpoint API должен возвращать список активных процессов
  });

  // Обновление данных с заданным интервалом
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, interval * 1000);
    
    return () => clearInterval(intervalId);
  }, [refetch, interval]);

  // Пример данных (в реальном приложении это придет с сервера)
  const mockProcesses: Process[] = [
    { pid: 1001, name: "Browser", cpuUsage: 13.2, memoryUsage: "1.75 GB" },
    { pid: 1659, name: "Media Player", cpuUsage: 8.6, memoryUsage: "504.24 MB" },
    { pid: 1887, name: "User Interface", cpuUsage: 5.9, memoryUsage: "506.75 MB" },
    { pid: 1980, name: "Background Tasks", cpuUsage: 2.8, memoryUsage: "355.51 MB" },
    { pid: 1982, name: "System UI", cpuUsage: 2.4, memoryUsage: "462.09 MB" },
    { pid: 1983, name: "Window Manager", cpuUsage: 2.1, memoryUsage: "341.71 MB" },
    { pid: 1899, name: "Security Service", cpuUsage: 2.0, memoryUsage: "227.36 MB" },
    { pid: 1988, name: "File System", cpuUsage: 1.0, memoryUsage: "174.02 MB" },
    { pid: 1985, name: "Network Service", cpuUsage: 0.6, memoryUsage: "73.9 MB" },
    { pid: 1984, name: "Audio Service", cpuUsage: 0.1, memoryUsage: "108.99 MB" },
  ];

  // Функция для завершения процесса (в реальном приложении отправит запрос на сервер)
  const terminateProcess = (pid: number) => {
    console.log(`Попытка завершить процесс с PID: ${pid}`);
    // В реальном приложении здесь будет вызов API для завершения процесса
    // fetch(`/api/processes/${pid}/terminate`, { method: 'POST' })
  };

  return (
    <main className="flex-1 p-5 overflow-auto bg-background">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Process Manager</h1>
          <p className="text-xs text-muted-foreground mt-1">Управление активными процессами системы</p>
        </div>
        <UpdateIntervalSelect />
      </div>

      <Card className="bg-card border border-border shadow-lg">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <p className="text-muted-foreground">Загрузка процессов...</p>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-border">
                <h2 className="text-foreground font-medium">Running Processes</h2>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-background-hover">
                      <TableHead className="w-[80px]">PID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="w-[100px] text-right">CPU %</TableHead>
                      <TableHead className="w-[100px] text-right">Memory</TableHead>
                      <TableHead className="w-[80px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProcesses.map((process) => (
                      <TableRow key={process.pid} className="hover:bg-background-hover">
                        <TableCell className="font-mono">{process.pid}</TableCell>
                        <TableCell>{process.name}</TableCell>
                        <TableCell className="text-right">
                          {process.cpuUsage.toFixed(1)}%
                        </TableCell>
                        <TableCell className="text-right">{process.memoryUsage}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => terminateProcess(process.pid)}
                            className="h-7 w-7 text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-3 text-xs text-muted-foreground border-t border-border">
                <p>Note: This is a simulation. Web browsers cannot access or manage actual system processes due to security restrictions.</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default ProcessesPage;
