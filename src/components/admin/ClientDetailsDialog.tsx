import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

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
  vehicle_info: {
    make: string | null;
    model: string | null;
    plate_number: string | null;
    vin: string | null;
  } | null;
  notes: string | null;
  created_at: string;
}

interface Repair {
  id: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  cost: number | null;
  created_at: string;
}

const ClientDetailsDialog = ({ isOpen, onOpenChange, clientId }: ClientDetailsDialogProps) => {
  const { data: client, isLoading: isLoadingClient, error: clientError } = useQuery<Client>({
    queryKey: ["client", clientId],
    queryFn: async () => {
      if (!clientId) return null;
      const { data, error } = await supabase.from("clients").select("*").eq("id", clientId).single();
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

  const isLoading = isLoadingClient || isLoadingRepairs;
  const error = clientError || repairsError;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Детайли за клиент</DialogTitle>
          <DialogDescription>
            Пълен преглед на клиента и неговите ремонти.
          </DialogDescription>
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
              <div>
                <h3 className="text-lg font-semibold mb-2">Информация за автомобил</h3>
                <p><strong>Марка:</strong> {client.vehicle_info?.make || "-"}</p>
                <p><strong>Модел:</strong> {client.vehicle_info?.model || "-"}</p>
                <p><strong>Рег. номер:</strong> {client.vehicle_info?.plate_number || "-"}</p>
                <p><strong>VIN:</strong> {client.vehicle_info?.vin || "-"}</p>
              </div>
            </div>
            {client.notes && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Бележки</h3>
                <p className="text-muted-foreground">{client.notes}</p>
              </div>
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
  );
};

export default ClientDetailsDialog;