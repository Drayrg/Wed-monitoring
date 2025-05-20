import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useUpdateInterval } from "@/context/UpdateIntervalContext";
import UpdateIntervalSelect from "@/components/controls/UpdateIntervalSelect";
import { useEffect, useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Интерфейс для данных о процессе
interface Process {
  pid: number;
  name: string;
  cpuUsage: number;
  memoryUsage: string;
}

const ProcessesPage = () => {
  const { interval } = useUpdateInterval();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { 
    data: processesData, 
    isLoading, 
    refetch,
    isError,
    error 
  } = useQuery({
    queryKey: ["/api/processes"],
    refetchOnWindowFocus: false,
    retry: 2
  });

  // Обновление данных с заданным интервалом
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, interval * 1000);
    
    return () => clearInterval(intervalId);
  }, [refetch, interval]);

  // Обработка ошибок
  useEffect(() => {
    if (isError) {
      const err = error as any;
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else if (err.message) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Не удалось получить данные о процессах");
      }
    } else {
      setErrorMessage(null);
    }
  }, [isError, error]);

  // Получаем реальные данные о процессах или пустой массив
  const processes = processesData?.processes || [];
  
  // Сортируем процессы по загрузке CPU (от большей к меньшей)
  const sortedProcesses = [...processes].sort((a, b) => b.cpuUsage - a.cpuUsage);

  // Функция для завершения процесса (В будущем может быть реализована)
  const terminateProcess = (pid: number) => {
    console.log(`Попытка завершить процесс с PID: ${pid}`);
    // В реальном приложении здесь будет вызов API для завершения процесса
    // fetch(`/api/processes/${pid}/terminate`, { method: 'POST' })
  };

  // Функция для получения цвета индикатора загрузки CPU
  const getCpuColor = (usage: number) => {
    if (usage > 80) return "bg-status-critical";
    if (usage > 50) return "bg-status-warning";
    return "bg-status-good";
  };

  return (
    <main className="flex-1 p-5 overflow-auto bg-background">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Process Manager</h1>
          <p className="text-xs text-muted-foreground mt-1">Управление активными процессами системы в реальном времени</p>
        </div>
        <UpdateIntervalSelect />
      </div>

      {errorMessage && (
        <div className="bg-red-900/30 border border-red-700 rounded-md p-4 mb-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold">Ошибка получения данных</h3>
          </div>
          <p className="text-sm">{errorMessage}</p>
          <p className="text-xs mt-2 text-red-300">
            Убедитесь, что Python-клиент запущен и отправляет данные о процессах
          </p>
        </div>
      )}

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
                      <TableHead className="w-[180px]">CPU Usage</TableHead>
                      <TableHead className="w-[100px] text-right">Memory</TableHead>
                      <TableHead className="w-[80px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedProcesses.length > 0 ? (
                      sortedProcesses.map((process) => (
                        <TableRow key={process.pid} className="hover:bg-background-hover">
                          <TableCell className="font-mono">{process.pid}</TableCell>
                          <TableCell>{process.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 text-right">
                                {process.cpuUsage.toFixed(1)}%
                              </div>
                              <div className="flex-1">
                                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${getCpuColor(process.cpuUsage)}`}
                                    style={{ width: `${Math.min(100, process.cpuUsage)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <p>Нет данных о процессах</p>
                            <p className="text-xs mt-1">Запустите Python-клиент для получения реальных данных</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="p-3 text-xs text-muted-foreground border-t border-border">
                <p>Примечание: Данные о процессах собираются с помощью Python-клиента. Для управления процессами необходимы соответствующие права.</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default ProcessesPage;
