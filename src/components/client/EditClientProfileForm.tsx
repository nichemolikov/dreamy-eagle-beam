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

interface Client {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  user_id: string;
}

interface EditClientProfileFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Името е задължително и трябва да е поне 2 символа." }),
  phone: z.string().regex(/^[0-9\s\-+()]*$/, { message: "Моля, въведете валиден телефонен номер." }).min(5, { message: "Телефонният номер трябва да е поне 5 символа." }).optional().or(z.literal('')),
  email: z.string().email({ message: "Моля, въведете валиден имейл адрес." }).optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

const EditClientProfileForm = ({ isOpen, onOpenChange, client }: EditClientProfileFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: client.name,
      phone: client.phone || "",
      email: client.email || "",
      notes: client.notes || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase
        .from("clients")
        .update({
          name: values.name,
          phone: values.phone || null,
          email: values.email || null,
          notes: values.notes || null,
          updated_at: new Date().toISOString(), // Assuming an updated_at column exists
        })
        .eq("id", client.id);

      if (error) {
        throw error;
      }

      showSuccess("Профилът е актуализиран успешно!");
      queryClient.invalidateQueries({ queryKey: ["clientData", client.user_id] }); // Invalidate to refetch client data
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating client profile:", error);
      showError(`Грешка при актуализиране на профила: ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Редактирай профил</DialogTitle>
          <DialogDescription>
            Актуализирайте вашата лична информация.
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
                    <Input placeholder="Вашето име" {...field} />
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
                    <Input type="email" placeholder="your@email.com" {...field} />
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
                    <Textarea placeholder="Допълнителни бележки..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Запази промените</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientProfileForm;