"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

// Define schema for client data
const clientFormSchema = z.object({
  name: z.string().min(1, "Името е задължително."),
  phone: z.string().optional(),
  email: z.string().email("Невалиден имейл адрес.").optional().or(z.literal("")),
  notes: z.string().optional(),
  role: z.enum(["client", "admin"], {
    required_error: "Ролята е задължителна.",
  }),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface EditClientFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  client: {
    id: string;
    user_id: string;
    name: string;
    phone?: string;
    email?: string;
    notes?: string;
    role: "client" | "admin";
  };
  onSuccess: () => void;
}

export function EditClientForm({ client, onSuccess, onOpenChange }: EditClientFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: client.name,
      phone: client.phone || "",
      email: client.email || "",
      notes: client.notes || "",
      role: client.role,
    },
  });

  async function onSubmit(values: ClientFormValues) {
    try {
      // 1. Update the clients table (client's personal info)
      const { error: clientError } = await supabase
        .from("clients")
        .update({
          name: values.name,
          phone: values.phone,
          email: values.email,
          notes: values.notes,
        })
        .eq("id", client.id);

      if (clientError) {
        throw clientError;
      }

      // 2. Update the profiles table for the user's role
      // The client.user_id corresponds to the id in the public.profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ role: values.role })
        .eq("id", client.user_id); // <--- This is the code that updates the role

      if (profileError) {
        throw profileError;
      }

      showSuccess("Клиентът и ролята са актуализирани успешно!");
      onSuccess();
      onOpenChange(false);

      // Invalidate the userRole query to force a re-fetch across the app
      queryClient.invalidateQueries({ queryKey: ["userRole"] });

    } catch (error: any) {
      console.error("Error updating client or profile:", error);
      showError(`Грешка при актуализиране: ${error.message || "Неизвестна грешка"}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Име</FormLabel>
              <FormControl>
                <Input placeholder="Име на клиента" {...field} />
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
                <Input placeholder="Телефонен номер" {...field} />
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
                <Input placeholder="Имейл адрес" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Бележки</FormLabel>
              <FormControl>
                <Textarea placeholder="Допълнителни бележки" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Роля</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Изберете роля" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="client">Клиент</SelectItem>
                  <SelectItem value="admin">Админ</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Запази промените</Button>
      </form>
    </Form>
  );
}