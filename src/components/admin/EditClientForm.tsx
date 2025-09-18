"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { Loader2 } from "lucide-react";

interface EditClientFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Името е задължително и трябва да е поне 2 символа." }),
  phone: z.string().regex(/^[0-9\s\-+()]*$/, { message: "Моля, въведете валиден телефонен номер." }).min(5, { message: "Телефонният номер трябва да е поне 5 символа." }).optional().or(z.literal('')),
  email: z.string().email({ message: "Моля, въведете валиден имейл адрес." }).optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  role: z.enum(["client", "admin"], { message: "Моля, изберете валидна роля." }).optional(),
  newPassword: z.string().min(6, { message: "Паролата трябва да е поне 6 символа." }).optional().or(z.literal('')),
  emailConfirmed: z.boolean().optional(),
});

const EditClientForm = ({ isOpen, onOpenChange, clientId, onSuccess }: EditClientFormProps) => {
  const queryClient = useQueryClient();

  const { data: clientData, isLoading: isLoadingClient, error: clientError } = useQuery({
    queryKey: ["clientForEdit", clientId],
    queryFn: async () => {
      const { data: client, error: clientFetchError } = await supabase
        .from("clients")
        .select("*, profiles(role, auth_users:id(email_confirmed_at)))") // Corrected select statement
        .eq("id", clientId)
        .single();

      if (clientFetchError) throw clientFetchError;
      return client;
    },
    enabled: isOpen && !!clientId,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      notes: "",
      role: "client",
      newPassword: "",
      emailConfirmed: false,
    },
    values: {
      name: clientData?.name || "",
      phone: clientData?.phone || "",
      email: clientData?.email || "",
      notes: clientData?.notes || "",
      role: (clientData?.profiles?.role as "client" | "admin") || "client",
      newPassword: "", // Always start empty for security
      emailConfirmed: !!clientData?.profiles?.auth_users?.email_confirmed_at, // Pre-fill based on current status
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Update clients table
      const { error: clientUpdateError } = await supabase
        .from("clients")
        .update({
          name: values.name,
          phone: values.phone || null,
          email: values.email || null,
          notes: values.notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", clientId);

      if (clientUpdateError) {
        throw clientUpdateError;
      }

      // Update profiles table if a role is provided and client has a user_id
      if (clientData?.user_id && values.role) {
        const { error: profileUpdateError } = await supabase
          .from("profiles")
          .update({
            role: values.role,
            updated_at: new Date().toISOString(),
          })
          .eq("id", clientData.user_id);

        if (profileUpdateError) {
          throw profileUpdateError;
        }
      }

      // Call Edge Function for password and email verification status if user_id exists
      if (clientData?.user_id) {
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        if (!token) {
          throw new Error("No session token found for admin user.");
        }

        const edgeFunctionUrl = `https://hemkredzinaipjxnyqco.supabase.co/functions/v1/admin-update-user`; // Replace with your project ID

        const response = await fetch(edgeFunctionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: clientData.user_id,
            newPassword: values.newPassword || undefined, // Only send if not empty
            emailConfirmed: values.emailConfirmed,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to update user authentication details.");
        }
      }

      showSuccess("Клиентът е актуализиран успешно!");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
      queryClient.invalidateQueries({ queryKey: ["clientForEdit", clientId] });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating client:", error);
      showError(`Грешка при актуализиране на клиент: ${error.message}`);
    }
  };

  if (isLoadingClient) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Редактирай клиент</DialogTitle>
            <DialogDescription>Зареждане на данни...</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (clientError) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Грешка</DialogTitle>
            <DialogDescription>Не може да се заредят данните за клиента.</DialogDescription>
          </DialogHeader>
          <div className="text-destructive text-center py-4">
            {clientError.message}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Редактирай клиент</DialogTitle>
          <DialogDescription>
            Актуализирайте данните за клиента, неговата роля, парола и статус на имейл.
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
            {clientData?.user_id && ( // Only show role, password, and email status if client has a linked user_id
              <>
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
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Нова парола (оставете празно за да не променяте)</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emailConfirmed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Имейл потвърден
                        </FormLabel>
                        <FormDescription>
                          Отметнете, за да потвърдите имейл адреса на потребителя.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <Button type="submit" className="w-full">Запази промените</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientForm;