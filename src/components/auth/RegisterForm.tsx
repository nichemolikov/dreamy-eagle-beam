"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  username: z.string().min(3, { message: "Потребителското име трябва да е поне 3 символа." }).regex(/^[a-zA-Z0-9_]+$/, { message: "Потребителското име може да съдържа само букви, цифри и долни черти." }),
  email: z.string().email({ message: "Моля, въведете валиден имейл адрес." }),
  password: z.string().min(6, { message: "Паролата трябва да е поне 6 символа." }),
});

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Check if username already exists
      const { data: existingUsername, error: usernameError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', values.username)
        .single();

      if (existingUsername) {
        throw new Error("Потребителското име вече е заето.");
      }
      if (usernameError && usernameError.code !== 'PGRST116') { // PGRST116 means "no rows found" which is good
        throw usernameError;
      }

      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username, // Pass username to raw_user_meta_data
          },
        },
      });

      if (error) {
        throw error;
      }

      showSuccess("Регистрацията е успешна! Моля, проверете имейла си за потвърждение.");
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      showError(`Грешка при регистрация: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Регистрация</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <FormLabel>Имейл адрес</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Регистрирай се"
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Вече имате акаунт?{" "}
          <Button variant="link" onClick={() => navigate("/login")} className="p-0 h-auto">
            Вход
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;