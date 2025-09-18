"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { useQueryClient } from "@tanstack/react-query";

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

interface AddVehicleFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
}

const formSchema = z.object({
  make: z.string().min(2, { message: "Марката е задължителна и трябва да е поне 2 символа." }),
  model: z.string().min(2, { message: "Моделът е задължителен и трябва да е поне 2 символа." }),
  year: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().int().min(1900).max(new Date().getFullYear() + 1).optional().or(z.literal(undefined)),
  ),
  plateNumber: z.string().optional().or(z.literal('')),
  vin: z.string().optional().or(z.literal('')),
  color: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

const AddVehicleForm = ({ isOpen, onOpenChange, clientId }: AddVehicleFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: "",
      model: "",
      year: undefined,
      plateNumber: "",
      vin: "",
      color: "",
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await supabase.from("vehicles").insert({
        client_id: clientId,
        make: values.make,
        model: values.model,
        year: values.year || null,
        plate_number: values.plateNumber || null,
        vin: values.vin || null,
        color: values.color || null,
        notes: values.notes || null,
      }).select();

      if (error) {
        throw error;
      }

      showSuccess("Превозното средство е добавено успешно!");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["clientVehicles", clientId] }); // Invalidate to refetch vehicles
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error adding vehicle:", error);
      showError(`Грешка при добавяне на превозно средство: ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Добави ново превозно средство</DialogTitle>
          <DialogDescription>
            Въведете детайлите за новото превозно средство.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Марка</FormLabel>
                    <FormControl>
                      <Input placeholder="VW" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Модел</FormLabel>
                    <FormControl>
                      <Input placeholder="Golf" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Година</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2015" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цвят</FormLabel>
                    <FormControl>
                      <Input placeholder="Черен" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="plateNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Регистрационен номер</FormLabel>
                    <FormControl>
                      <Input placeholder="PB1234AB" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VIN номер</FormLabel>
                    <FormControl>
                      <Input placeholder="WVWZZZ1KZEW123456" {...field} />
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
                  <FormLabel>Бележки за превозното средство</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Допълнителни бележки за този автомобил..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Добави превозно средство</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleForm;