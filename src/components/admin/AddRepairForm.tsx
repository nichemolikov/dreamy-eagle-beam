import { useState } from "react";
import { useForm, useWatch } from "react-hook-form"; // Import useWatch
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddRepairFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const formSchema = z.object({
  clientId: z.string().uuid({ message: "Моля, изберете клиент." }),
  vehicleId: z.string().uuid({ message: "Моля, изберете валидно превозно средство." }).optional().or(z.literal('')), // New field
  description: z.string().min(5, { message: "Описанието е задължително и трябва да е поне 5 символа." }),
  status: z.enum(["Pending", "In Progress", "Completed", "Cancelled"], {
    message: "Моля, изберете валиден статус.",
  }).default("Pending"),
  cost: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, { message: "Цената не може да бъде отрицателна." }).optional(),
  ),
  notes: z.string().optional().or(z.literal('')),
  technicianId: z.string().optional().or(z.literal('')), // Placeholder for future technician management
});

const AddRepairForm = ({ isOpen, onOpenChange, onSuccess }: AddRepairFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "",
      vehicleId: "", // Initialize new field
      description: "",
      status: "Pending",
      cost: undefined,
      notes: "",
      technicianId: "",
    },
  });

  const selectedClientId = useWatch({ control: form.control, name: "clientId" });

  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("id, name");
      if (error) throw error;
      return data;
    },
  });

  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery({
    queryKey: ["vehiclesForClient", selectedClientId],
    queryFn: async () => {
      if (!selectedClientId) return [];
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, make, model, plate_number")
        .eq("client_id", selectedClientId);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedClientId, // Only fetch vehicles if a client is selected
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { clientId, vehicleId, description, status, cost, notes, technicianId } = values;

    try {
      const { data, error } = await supabase.from("repairs").insert({
        client_id: clientId,
        vehicle_id: vehicleId || null, // Include vehicle_id
        description,
        status,
        cost: cost || null,
        notes: notes || null,
        technician_id: technicianId || null,
      }).select();

      if (error) {
        throw error;
      }

      showSuccess("Ремонтът е добавен успешно!");
      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error adding repair:", error);
      showError(`Грешка при добавяне на ремонт: ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Добави нов ремонт</DialogTitle>
          <DialogDescription>
            Въведете детайлите за новия ремонт.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Клиент</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue("vehicleId", ""); // Reset vehicle selection when client changes
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Изберете клиент" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingClients ? (
                        <SelectItem value="loading" disabled>Зареждане на клиенти...</SelectItem>
                      ) : (
                        clients?.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Превозно средство (по избор)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedClientId || isLoadingVehicles}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedClientId ? (isLoadingVehicles ? "Зареждане на превозни средства..." : "Изберете превозно средство") : "Първо изберете клиент"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Без превозно средство</SelectItem> {/* Option for no vehicle */}
                      {vehicles?.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.make} {vehicle.model} ({vehicle.plate_number || "Без рег. номер"})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Кратко описание на ремонта..." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Статус</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Изберете статус" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pending">Чакащ</SelectItem>
                        <SelectItem value="In Progress">В процес</SelectItem>
                        <SelectItem value="Completed">Завършен</SelectItem>
                        <SelectItem value="Cancelled">Отменен</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена (лв.)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Бележки</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Допълнителни бележки за ремонта..." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Placeholder for technician selection - can be expanded later */}
            <FormField
              control={form.control}
              name="technicianId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Техник (ID)</FormLabel>
                  <FormControl>
                    <Input placeholder="Напр. UUID на техник" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Добави ремонт</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRepairForm;