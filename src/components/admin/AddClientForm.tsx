import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

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

interface AddClientFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Името е задължително и трябва да е поне 2 символа." }),
  phone: z.string().regex(/^[0-9\s\-+()]*$/, { message: "Моля, въведете валиден телефонен номер." }).min(5, { message: "Телефонният номер трябва да е поне 5 символа." }).optional().or(z.literal('')),
  email: z.string().email({ message: "Моля, въведете валиден имейл адрес." }).optional().or(z.literal('')),
  vehicleMake: z.string().optional().or(z.literal('')),
  vehicleModel: z.string().optional().or(z.literal('')),
  plateNumber: z.string().optional().or(z.literal('')),
  vin: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

const AddClientForm = ({ isOpen, onOpenChange, onSuccess }: AddClientFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      vehicleMake: "",
      vehicleModel: "",
      plateNumber: "",
      vin: "",
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name, phone, email, vehicleMake, vehicleModel, plateNumber, vin, notes } = values;

    const vehicle_info = {
      make: vehicleMake || null,
      model: vehicleModel || null,
      plate_number: plateNumber || null,
      vin: vin || null,
    };

    try {
      const { data, error } = await supabase.from("clients").insert({
        name,
        phone: phone || null,
        email: email || null,
        vehicle_info: vehicle_info,
        notes: notes || null,
      }).select();

      if (error) {
        throw error;
      }

      showSuccess("Клиентът е добавен успешно!");
      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error adding client:", error);
      showError(`Грешка при добавяне на клиент: ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Добави нов клиент</DialogTitle>
          <DialogDescription>
            Въведете данните за новия клиент и неговия автомобил.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Име и Фамилия</FormLabel>
                  <FormControl>
                    <Input placeholder="Иван Петров" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input placeholder="0888123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имейл</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ivan.petrov@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehicleMake"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Марка на автомобила</FormLabel>
                    <FormControl>
                      <Input placeholder="VW" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Модел на автомобила</FormLabel>
                    <FormControl>
                      <Input placeholder="Golf" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                  <FormLabel>Бележки</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Допълнителни бележки за клиента..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Добави клиент</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientForm;