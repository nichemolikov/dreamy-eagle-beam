import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, PlusCircle, Edit, Trash2 } from "lucide-react";

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle_info: {
    make: string;
    model: string;
    plate_number: string;
    vin: string;
  };
  notes: string;
}

const initialClients: Client[] = [
  {
    id: "1",
    name: "Иван Петров",
    phone: "0888123456",
    email: "ivan.p@example.com",
    vehicle_info: { make: "VW", model: "Golf", plate_number: "PB1234AB", vin: "WVWZZZ1KZEW123456" },
    notes: "Редовен клиент",
  },
  {
    id: "2",
    name: "Мария Георгиева",
    phone: "0899654321",
    email: "maria.g@example.com",
    vehicle_info: { make: "Audi", model: "A4", plate_number: "CA5678BC", vin: "WAUZZZ8KZEA654321" },
    notes: "Нов клиент",
  },
  {
    id: "3",
    name: "Георги Димитров",
    phone: "0877112233",
    email: "georgi.d@example.com",
    vehicle_info: { make: "BMW", model: "3 Series", plate_number: "CB9012CD", vin: "WBAZZZ3EZEB901234" },
    notes: "Спешен ремонт",
  },
  {
    id: "4",
    name: "Елена Стоянова",
    phone: "0898765432",
    email: "elena.s@example.com",
    vehicle_info: { make: "Mercedes-Benz", model: "C-Class", plate_number: "A3456EF", vin: "WDDZZZ204XF345678" },
    notes: "Планово обслужване",
  },
];

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = initialClients.filter((client) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      client.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      client.phone.includes(lowerCaseSearchTerm) ||
      client.email.toLowerCase().includes(lowerCaseSearchTerm) ||
      client.vehicle_info.plate_number.toLowerCase().includes(lowerCaseSearchTerm) ||
      client.vehicle_info.vin.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

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
          <Input
            placeholder="Търсене по име, телефон, имейл, рег. номер или VIN..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Име</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Имейл</TableHead>
            <TableHead>Автомобил</TableHead>
            <TableHead>Рег. номер</TableHead>
            <TableHead>VIN</TableHead>
            <TableHead>Бележки</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{`${client.vehicle_info.make} ${client.vehicle_info.model}`}</TableCell>
              <TableCell>{client.vehicle_info.plate_number}</TableCell>
              <TableCell>{client.vehicle_info.vin}</TableCell>
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