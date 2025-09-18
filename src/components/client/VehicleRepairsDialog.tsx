"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

interface Repair {
  id: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  cost: number | null;
  created_at: string;
  vehicle_id: string | null; // Ensure this is included
}

interface VehicleRepairsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  vehicleId: string;
  vehicleMake: string;
  vehicleModel: string;
}

const VehicleRepairsDialog = ({
  isOpen,
  onOpenChange,
  clientId,
  vehicleId,
  vehicleMake,
  vehicleModel,
}: VehicleRepairsDialogProps) => {
  const { data: repairs, isLoading, error } = useQuery<Repair[]>({
    queryKey: ["vehicleRepairs", clientId, vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("repairs")
        .select("id, description, status, cost, created_at, vehicle_id")
        .eq("client_id", clientId)
        .eq("vehicle_id", vehicleId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!clientId && !!vehicleId,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ремонти за {vehicleMake} {vehicleModel}</DialogTitle>
          <DialogDescription>
            Преглед на всички ремонти, свързани с това превозно средство.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Зареждане на ремонти...</span>
          </div>
        ) : error ? (
          <div className="text-destructive text-center py-4">
            Грешка при зареждане на ремонти: {error.message}
          </div>
        ) : repairs && repairs.length > 0 ? (
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
          <p className="text-muted-foreground text-center py-4">Няма регистрирани ремонти за това превозно средство.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VehicleRepairsDialog;