import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

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

const ClientDashboard = () => {
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    },
  });

  const { data: client, isLoading: isLoadingClient, error: clientError } = useQuery<Client>({
    queryKey: ["clientData", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .single(); // Assuming one client entry per user
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: repairs, isLoading: isLoadingRepairs, error: repairsError } = useQuery<Repair[]>({
    queryKey: ["clientRepairs", client?.id],
    queryFn: async () => {
      if (!client?.id) return [];
      const { data, error } = await supabase
        .from("repairs")
        .select("id, description, status, cost, created_at")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!client?.id,
  });

  const isLoading = isLoadingUser || isLoadingClient || isLoadingRepairs;
  const error = clientError || repairsError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Зареждане на таблото...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-destructive text-center">
        Грешка при зареждане на данни: {error.message}
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center text-muted-foreground">
        <h1 className="text-3xl font-bold">Добре дошли!</h1>
        <p className="mt-4">
          Все още няма регистриран клиентски профил, свързан с вашия акаунт. Моля, свържете се с администратор.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold">Добре дошли, {client.name}!</h1>
      <p className="text-muted-foreground">
        Тук можете да прегледате информацията за вашия автомобил и историята на ремонтите.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Вашата информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Име:</strong> {client.name}</p>
            <p><strong>Телефон:</strong> {client.phone || "-"}</p>
            <p><strong>Имейл:</strong> {client.email || "-"}</p>
            <p><strong>Създаден на:</strong> {new Date(client.created_at).toLocaleDateString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Информация за автомобил</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Марка:</strong> {client.vehicle_info?.make || "-"}</p>
            <p><strong>Модел:</strong> {client.vehicle_info?.model || "-"}</p>
            <p><strong>Рег. номер:</strong> {client.vehicle_info?.plate_number || "-"}</p>
            <p><strong>VIN:</strong> {client.vehicle_info?.vin || "-"}</p>
          </CardContent>
        </Card>
      </div>

      {client.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Бележки</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{client.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>История на ремонтите</CardTitle>
        </CardHeader>
        <CardContent>
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
            <p className="text-muted-foreground">Няма регистрирани ремонти за вашия автомобил.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;