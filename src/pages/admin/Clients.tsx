import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AddClientForm from "@/components/admin/AddClientForm";
import { showError, showSuccess } from "@/utils/toast";

interface Client {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  vehicle_info: {
    make: string | null;
    model: string | null;
    plate_number: string | null;
    vin: string | null;
  } | null;
  notes: string | null;
}

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: clients, isLoading, error } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("*");
      if (error) throw error;
      return data;
    },
  });

  const filteredClients = clients?.filter((client) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      client.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      (client.phone && client.phone.includes(lowerCaseSearchTerm)) ||
      (client.email && client.email.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (client.vehicle_info?.plate_number && client.vehicle_info.plate_number.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (client.vehicle_info?.vin && client.vehicle_info.vin.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }) || [];

  const handleAddClientSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["clients"] });
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете този клиент?")) {
      return;
    }
    try {
      const { error } = await supabase.from("clients").delete().eq("id", clientId);
      if (error) throw error;
      showSuccess("Клиентът е изтрит успешно!");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    } catch (error: any) {
      console.error("Error deleting client:", error);
      showError(`Грешка при изтриване на клиент: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Зареждане на клиенти...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">Грешка при зареждане на клиенти: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Управление на клиенти</h2>
        <Button onClick={() => setIsAddClientDialogOpen(true)}>
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
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.phone || "-"}</TableCell>
                <TableCell>{client.email || "-"}</TableCell>
                <TableCell>{client.vehicle_info ? `${client.vehicle_info.make || ""} ${client.vehicle_info.model || ""}`.trim() || "-" : "-"}</TableCell>
                <TableCell>{client.vehicle_info?.plate_number || "-"}</TableCell>
                <TableCell>{client.vehicle_info?.vin || "-"}</TableCell>
                <TableCell>{client.notes || "-"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="mr-2">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteClient(client.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Няма намерени клиенти.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AddClientForm
        isOpen={isAddClientDialogOpen}
        onOpenChange={setIsAddClientDialogOpen}
        onSuccess={handleAddClientSuccess}
      />
    </div>
  );
};

export default Clients;