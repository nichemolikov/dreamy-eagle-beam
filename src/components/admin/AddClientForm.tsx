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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

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
  
  createAccount: z.boolean().default(false),
  username: z.string().optional(),
  password: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.createAccount) {
    if (!data.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Имейлът е задължителен за създаване на потребителски акаунт.",
        path: ["email"],
      });
    }
    if (!data.username) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Потребителското име е задължително за създаване на потребителски акаунт.",
        path: ["username"],
      });
    } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Потребителското име може да съдържа само букви, цифри и долни черти.",
        path: ["username"],
      });
    }
    if (!data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Паролата е задължителна за създаване на потребителски акаунт.",
        path: ["password"],
      });
    } else if (data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Паролата трябва да е поне 6 символа.",
        path: ["password"],
      });
    }
  }
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
      createAccount: false,
      username: "",
      password: "",
    },
  });

  const createAccount = form.watch("createAccount");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name, phone, email, vehicleMake, vehicleModel, plateNumber, vin, notes, createAccount, username, password } = values;
    let newClientId: string;
    let newUserId: string | null = null;

    try {
      if (createAccount) {
        // 1. Create Supabase Auth user via Edge Function
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        if (!token) {
          throw new Error("No session token found for admin user.");
        }

        const adminCreateUserEdgeFunctionUrl = `https://hemkredzinaipjxnyqco.supabase.co/functions/v1/admin-create-user`;

        const response = await fetch(adminCreateUserEdgeFunctionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: email,
            password: password,
            username: username,
            firstName: name, // Use client name as first name for profile
            lastName: "", // No last name in this form, can be added later
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to create user account.");
        }
        newUserId = result.userId;

        // The handle_new_user trigger will create the client and profile.
        // We need to wait for it and then update the client with phone/notes.
        // A small delay or polling might be needed in a real-world scenario,
        // but for simplicity, we'll query immediately.
        const { data: clientDataFromTrigger, error: clientFetchError } = await supabase
          .from("clients")
          .select("id")
          .eq("user_id", newUserId)
          .single();

        if (clientFetchError || !clientDataFromTrigger) {
          throw new Error("Failed to retrieve client created by trigger.");
        }
        newClientId = clientDataFromTrigger.id;

        // Update the client with phone and notes
        const { error: clientUpdateError } = await supabase
          .from("clients")
          .update({
            phone: phone || null,
            notes: notes || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", newClientId);

        if (clientUpdateError) {
          throw clientUpdateError;
        }

      } else {
        // 1. Insert client data into the 'clients' table without a user_id
        const { data: clientData, error: clientError } = await supabase.from("clients").insert({
          name,
          phone: phone || null,
          email: email || null, // Email can still be stored even without an auth account
          notes: notes || null,
        }).select("id").single();

        if (clientError) {
          throw clientError;
        }
        newClientId = clientData.id;
      }

      // 2. If vehicle details are provided, insert into the 'vehicles' table
      if (vehicleMake && vehicleModel) {
        const { error: vehicleError } = await supabase.from("vehicles").insert({
          client_id: newClientId,
          make: vehicleMake,
          model: vehicleModel,
          plate_number: plateNumber || null,
          vin: vin || null,
        });

        if (vehicleError) {
          console.error("Error adding vehicle for new client:", vehicleError);
          showError(`Клиентът е добавен, но възникна грешка при добавяне на превозното средство: ${vehicleError.message}`);
        }
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
            Въведете данните за новия клиент и неговия автомобил. Можете също да създадете потребителски акаунт.
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
              name="createAccount"
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
                      Създай потребителски акаунт
                    </FormLabel>
                    <FormDescription>
                      Ако е отметнато, ще бъде създаден потребителски акаунт, свързан с този клиент.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {createAccount && (
              <>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Потребителско име</FormLabel>
                      <FormControl>
                        <Input placeholder="потребителско_име" {...field} />
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
                      <FormLabel>Имейл (за акаунта)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="ivan.petrov@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Парола</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {!createAccount && ( // Show email field if no account is being created, as it's just client data
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имейл (само за данни на клиента)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="ivan.petrov@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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