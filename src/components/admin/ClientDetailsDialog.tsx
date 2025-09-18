import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import EditClientForm from "./EditClientForm"; // Import the new form

interface ClientDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string | null;
}

interface Client {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
  user_id: string | null; // Added user_id for consistency
}

interface Repair {
  id: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  cost: number | null;
  created_at: string;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number | null;
  plate_number: string | null;
  vin: string | null;
  color: string | null;
  created_at: string;
}

const ClientDetailsDialog = ({ isOpen, onOpenChange, clientId }: ClientDetailsDialogProps) => {
  const queryClient = useQueryClient();
  const [isEditClientFormOpen, setIsEditClientFormOpen] = useState(false);

  const { data: client, isLoading: isLoadingClient, error: clientError } = useQuery<Client>({
    queryKey: ["client", clientId],
    queryFn: async () => {
      if (!clientId) return null;
      // Explicitly select columns to avoid implicit joins to auth.users
      const { data, error } = await supabase.from("clients").select("id, user_id, name, phone, email, notes, created_at, updated_at").eq("id", clientId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!clientId, // Only run query if clientId is available
  });

  const { data: repairs, isLoading: isLoadingRepairs, error: repairsError } = useQuery<Repair[]>({
    queryKey: ["clientRepairs", clientId],
    queryFn: async () => {
      if (!clientId) return [];
      const { data, error } = await supabase
        .from("repairs")
        .select("id, description, status, cost, created_at")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!clientId, // Only run query if clientId is available
  });

  const { data: vehicles, isLoading: isLoadingVehicles, error: vehiclesError } = useQuery<Vehicle[]>({
    queryKey: ["clientVehicles", clientId],
    queryFn: async () => {
      if (!clientId) return [];
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, make, model, year, plate_number, vin, color, created_at")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!clientId, // Only run query if clientId is available
  });

  const isLoading = isLoadingClient || isLoadingRepairs || isLoadingVehicles;
  const error = clientError || repairsError || vehiclesError;

  const handleEditClientSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["client", clientId] }); // Refresh client details in this dialog
    queryClient.invalidateQueries({ queryKey: ["clients"] }); // Refresh the main clients list
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <div>
              <DialogTitle>Детайли за клиент</DialogTitle>
              <DialogDescription>
                Пълен преглед на клиента и неговите ремонти.
              </DialogDescription>
            </div>
            {client && (
              <Button variant="outline" size="sm" onClick={() => setIsEditClientFormOpen(true)}>
                <Edit className="h-4 w-4 mr-2" /> Редактирай клиент
              </Button>
            )}
          </DialogHeader>
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Зареждане...</span>
            </div>
          ) : error ? (
            <div className="text-destructive text-center py-4">
              Грешка при зареждане на данни: {error.message}
            </div>
          ) : client ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Лична информация</h3>
                  <p><strong>Име:</strong> {client.name}</p>
                  <p><strong>Телефон:</strong> {client.phone || "-"}</p>
                  <p><strong>Имейл:</strong> {client.email || "-"}</p>
                  <p><strong>Създаден на:</strong> {new Date(client.created_at).toLocaleDateString()}</p>
                </div>
                {client.notes && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Бележки</h3>
                    <p className="text-muted-foreground">{client.notes}</p>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold mb-2">Превозни средства</h3>
              {vehicles && vehicles.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Марка</TableHead>
                      <TableHead>Модел</TableHead>
                      <TableHead>Година</TableHead>
                      <TableHead>Рег. номер</TableHead>
                      <TableHead>VIN</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell>{vehicle.make}</TableCell>
                        <TableCell>{vehicle.model}</TableCell>
                        <TableCell>{vehicle.year || "-"}</TableCell>
                        <TableCell>{vehicle.plate_number || "-"}</TableCell>
                        <TableCell>{vehicle.vin || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Няма регистрирани превозни средства за този клиент.</p>
              )}

              <h3 className="text-lg font-semibold mb-2">История на ремонтите</h3>
              {repairs && repairs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Описание</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Цена</TableHead>
                      <TableHead>Дата</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repairs.map((repair) => (
                      <TableRow key={repair.id}>
                        <TableCell>{repair.description}</TableCell>
                        <TableCell>{repair.status}</TableCell>
                        <TableCell>{repair.cost ? formatCurrency(repair.cost) : "-"}</TableCell>
                        <TableCell>{new Date(repair.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Няма регистрирани ремонти за този клиент.</p>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Моля, изберете клиент, за да видите детайли.
            </div>
          )}
        </DialogContent>
      </Dialog>

      {clientId && (
        <EditClientForm
          isOpen={isEditClientFormOpen}
          onOpenChange={setIsEditClientFormOpen}
          clientId={clientId}
          onSuccess={handleEditClientSuccess}
        />
      )}
    </>
  );
};

export default ClientDetailsDialog;