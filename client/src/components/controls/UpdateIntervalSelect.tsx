import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useUpdateInterval } from "@/context/UpdateIntervalContext";
import { Clock } from "lucide-react";

export const UpdateIntervalSelect = () => {
  const { interval, setUpdateInterval } = useUpdateInterval();

  return (
    <div className="flex items-center space-x-2">
      <Clock className="h-4 w-4 text-muted-foreground" />
      <span className="text-xs text-muted-foreground mr-1">Обновление каждые</span>
      <Select
        value={interval.toString()}
        onValueChange={(value) => setUpdateInterval(Number(value) as 1 | 2 | 3 | 5 | 10)}
      >
        <SelectTrigger className="h-7 w-16">
          <SelectValue placeholder={`${interval}с`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1с</SelectItem>
          <SelectItem value="2">2с</SelectItem>
          <SelectItem value="3">3с</SelectItem>
          <SelectItem value="5">5с</SelectItem>
          <SelectItem value="10">10с</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UpdateIntervalSelect;