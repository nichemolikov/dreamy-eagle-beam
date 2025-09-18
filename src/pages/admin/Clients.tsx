import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AddClientForm from "@/components/admin/AddClientForm";
import ClientDetailsDialog from "@/components/admin/ClientDetailsDialog";
import { showError, showSuccess } from "@/utils/toast";

interface Client {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  user_id: string | null; // Add user_id to client interface
}

// Extend Client interface to include profile role for filtering
interface ClientWithProfile extends Client {
  profiles: {
    role: string;
  } | null;
}

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [isClientDetailsDialogOpen, setIsClientDetailsDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: clients, isLoading, error } = useQuery<ClientWithProfile[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*, profiles(role)"); // Select client data and join with profiles to get role
      if (error) throw error;
      return data;
    },
  });

  const filteredClients = clients?.filter((client) => {
    // Filter out clients who are also admins
    // Explicitly check if profiles exists before accessing role
    if (client.profiles && client.profiles.role === 'admin') {
      return false;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      client.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      (client.phone && client.phone.includes(lowerCaseSearchTerm)) ||
      (client.email && client.email.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (client.notes && client.notes.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }) || [];

  const handleAddClientSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["clients"] });
  };

  const handleClientRowClick = (clientId: string) => {
    setSelectedClientId(clientId);
    setIsClientDetailsDialogOpen(true);
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
            placeholder="Търсене по име, телефон, имейл или бележки..."
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
            <TableHead>Бележки</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <TableRow key={client.id} onClick={() => handleClientRowClick(client.id)} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.phone || "-"}</TableCell>
                <TableCell>{client.email || "-"}</TableCell>
                <TableCell>{client.notes || "-"}</TableCell>
                <TableCell className="text-right">
                  {/* Edit button can be re-purposed for direct client editing if needed */}
                  <Button variant="ghost" size="sm" className="mr-2" onClick={(e) => { e.stopPropagation(); /* handle edit client details */ }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteClient(client.id); }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
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

      <ClientDetailsDialog
        isOpen={isClientDetailsDialogOpen}
        onOpenChange={setIsClientDetailsDialogOpen}
        clientId={selectedClientId}
      />
    </div>
  );
};

export default Clients;