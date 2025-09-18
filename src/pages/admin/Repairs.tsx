import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AddRepairForm from "@/components/admin/AddRepairForm";
import { showError, showSuccess } from "@/utils/toast";
import { formatCurrency } from "@/lib/utils";

interface Repair {
  id: string;
  client_id: string;
  clients: { name: string } | null; // Joined client name
  technician_id: string | null;
  description: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  cost: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const Repairs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddRepairDialogOpen, setIsAddRepairDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: repairs, isLoading, error } = useQuery<Repair[]>({
    queryKey: ["repairs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("repairs")
        .select("*, clients(name)") // Select all repair fields and client name
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredRepairs = repairs?.filter((repair) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      repair.description.toLowerCase().includes(lowerCaseSearchTerm) ||
      (repair.clients?.name && repair.clients.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (repair.notes && repair.notes.toLowerCase().includes(lowerCaseSearchTerm)) ||
      repair.id.toLowerCase().includes(lowerCaseSearchTerm);

    const matchesStatus = statusFilter === "all" || repair.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  const handleAddRepairSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["repairs"] });
  };

  const handleDeleteRepair = async (repairId: string) => {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете този ремонт?")) {
      return;
    }
    try {
      const { error } = await supabase.from("repairs").delete().eq("id", repairId);
      if (error) throw error;
      showSuccess("Ремонтът е изтрит успешно!");
      queryClient.invalidateQueries({ queryKey: ["repairs"] });
    } catch (error: any) {
      console.error("Error deleting repair:", error);
      showError(`Грешка при изтриване на ремонт: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Зареждане на ремонти...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">Грешка при зареждане на ремонти: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Управление на ремонти</h2>
        <Button onClick={() => setIsAddRepairDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Добави ремонт
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Търсене на ремонти по описание, клиент или ID..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всички</SelectItem>
            <SelectItem value="Pending">Чакащи</SelectItem>
            <SelectItem value="In Progress">В процес</SelectItem>
            <SelectItem value="Completed">Завършени</SelectItem>
            <SelectItem value="Cancelled">Отменени</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Клиент</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Техник</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Дата на създаване</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRepairs.length > 0 ? (
            filteredRepairs.map((repair) => (
              <TableRow key={repair.id}>
                <TableCell className="font-medium">{repair.id.substring(0, 8)}...</TableCell>
                <TableCell>{repair.clients?.name || "Неизвестен клиент"}</TableCell>
                <TableCell>{repair.description}</TableCell>
                <TableCell>{repair.status}</TableCell>
                <TableCell>{repair.technician_id ? repair.technician_id.substring(0, 8) + "..." : "-"}</TableCell>
                <TableCell>{repair.cost ? formatCurrency(repair.cost) : "-"}</TableCell>
                <TableCell>{new Date(repair.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="mr-2">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteRepair(repair.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Няма намерени ремонти.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AddRepairForm
        isOpen={isAddRepairDialogOpen}
        onOpenChange={setIsAddRepairDialogOpen}
        onSuccess={handleAddRepairSuccess}
      />
    </div>
  );
};

export default Repairs;