import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Edit, PlusCircle, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import EditClientProfileForm from "@/components/client/EditClientProfileForm";
import AddVehicleForm from "@/components/client/AddVehicleForm";
import EditVehicleForm from "@/components/client/EditVehicleForm";
import { showError, showSuccess } from "@/utils/toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


interface Client {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
  user_id: string;
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
  client_id: string;
  make: string;
  model: string;
  year: number | null;
  plate_number: string | null;
  vin: string | null;
  color: string | null;
  notes: string | null;
  created_at: string;
}

const ClientDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const [isAddVehicleDialogOpen, setIsAddVehicleDialogOpen] = useState(false);
  const [isEditVehicleDialogOpen, setIsEditVehicleDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

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
        .single();
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

  const { data: vehicles, isLoading: isLoadingVehicles, error: vehiclesError } = useQuery<Vehicle[]>({
    queryKey: ["clientVehicles", client?.id],
    queryFn: async () => {
      if (!client?.id) return [];
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!client?.id,
  });

  const isLoading = isLoadingUser || isLoadingClient || isLoadingRepairs || isLoadingVehicles;
  const error = clientError || repairsError || vehiclesError;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      const { error } = await supabase.from("vehicles").delete().eq("id", vehicleId);
      if (error) throw error;
      showSuccess("Превозното средство е изтрито успешно!");
      queryClient.invalidateQueries({ queryKey: ["clientVehicles", client?.id] });
    } catch (error: any) {
      console.error("Error deleting vehicle:", error);
      showError(`Грешка при изтриване на превозно средство: ${error.message}`);
    }
  };

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
        <Button onClick={handleLogout} className="mt-8">Изход</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Добре дошли, {client.name}!</h1>
        <Button onClick={handleLogout} variant="outline">Изход</Button>
      </div>
      <p className="text-muted-foreground">
        Тук можете да прегледате и актуализирате вашата информация и да управлявате вашите превозни средства.
      </p>

      {/* Client Information Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Вашата информация</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsEditProfileDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" /> Редактирай
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Име:</strong> {client.name}</p>
          <p><strong>Телефон:</strong> {client.phone || "-"}</p>
          <p><strong>Имейл:</strong> {client.email || "-"}</p>
          <p><strong>Създаден на:</strong> {new Date(client.created_at).toLocaleDateString()}</p>
          {client.notes && <p><strong>Бележки:</strong> {client.notes}</p>}
        </CardContent>
      </Card>

      {/* Vehicles Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Вашите превозни средства</CardTitle>
          <Button size="sm" onClick={() => setIsAddVehicleDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" /> Добави превозно средство
          </Button>
        </CardHeader>
        <CardContent>
          {vehicles && vehicles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Марка</TableHead>
                  <TableHead>Модел</TableHead>
                  <TableHead>Година</TableHead>
                  <TableHead>Рег. номер</TableHead>
                  <TableHead>VIN</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
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
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mr-2"
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setIsEditVehicleDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Сигурни ли сте?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Това действие не може да бъде отменено. Това ще изтрие превозното средство "{vehicle.make} {vehicle.model}" за постоянно.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отказ</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteVehicle(vehicle.id)}>Изтрий</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">Няма регистрирани превозни средства. Добавете първото си превозно средство!</p>
          )}
        </CardContent>
      </Card>

      {/* Repairs History Card */}
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

      {client && (
        <EditClientProfileForm
          isOpen={isEditProfileDialogOpen}
          onOpenChange={setIsEditProfileDialogOpen}
          client={client}
        />
      )}

      {client && (
        <AddVehicleForm
          isOpen={isAddVehicleDialogOpen}
          onOpenChange={setIsAddVehicleDialogOpen}
          clientId={client.id}
        />
      )}

      {selectedVehicle && (
        <EditVehicleForm
          isOpen={isEditVehicleDialogOpen}
          onOpenChange={setIsEditVehicleDialogOpen}
          vehicle={selectedVehicle}
        />
      )}
    </div>
  );
};

export default ClientDashboard;