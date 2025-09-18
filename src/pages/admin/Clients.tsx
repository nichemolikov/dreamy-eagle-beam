import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, PlusCircle, Edit, Trash2 } from "lucide-react";

const Clients = () => {
  // Placeholder data - in a real app, this would come from Supabase
  const clients = [
    { id: "1", name: "Иван Петров", phone: "0888123456", email: "ivan.p@example.com", vehicle: "VW Golf", notes: "Редовен клиент" },
    { id: "2", name: "Мария Георгиева", phone: "0899654321", email: "maria.g@example.com", vehicle: "Audi A4", notes: "Нов клиент" },
    { id: "3", name: "Георги Димитров", phone: "0877112233", email: "georgi.d@example.com", vehicle: "BMW 3 Series", notes: "Спешен ремонт" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Управление на клиенти</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Добави клиент
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Търсене на клиенти..." className="pl-9" />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Име</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Имейл</TableHead>
            <TableHead>Автомобил</TableHead>
            <TableHead>Бележки</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.vehicle}</TableCell>
              <TableCell>{client.notes}</TableCell>
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

export default Clients;