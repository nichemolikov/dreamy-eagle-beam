import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, PlusCircle, Edit, Trash2 } from "lucide-react";

const Repairs = () => {
  // Placeholder data - in a real app, this would come from Supabase
  const repairs = [
    { id: "R001", client: "Иван Петров", vehicle: "VW Golf", description: "Смяна на масло", status: "Completed", technician: "Петър", cost: "120.00", date: "2023-10-26" },
    { id: "R002", client: "Мария Георгиева", vehicle: "Audi A4", description: "Диагностика на двигател", status: "In Progress", technician: "Георги", cost: "80.00", date: "2023-10-27" },
    { id: "R003", client: "Георги Димитров", vehicle: "BMW 3 Series", description: "Ремонт на спирачки", status: "Pending", technician: "Иван", cost: "350.00", date: "2023-10-28" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Управление на ремонти</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Добави ремонт
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Търсене на ремонти..." className="pl-9" />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всички</SelectItem>
            <SelectItem value="pending">Чакащи</SelectItem>
            <SelectItem value="in-progress">В процес</SelectItem>
            <SelectItem value="completed">Завършени</SelectItem>
            <SelectItem value="cancelled">Отменени</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Клиент</TableHead>
            <TableHead>Автомобил</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Техник</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {repairs.map((repair) => (
            <TableRow key={repair.id}>
              <TableCell className="font-medium">{repair.id}</TableCell>
              <TableCell>{repair.client}</TableCell>
              <TableCell>{repair.vehicle}</TableCell>
              <TableCell>{repair.description}</TableCell>
              <TableCell>{repair.status}</TableCell>
              <TableCell>{repair.technician}</TableCell>
              <TableCell>лв. {repair.cost}</TableCell>
              <TableCell>{repair.date}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" className="mr-2">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Repairs;