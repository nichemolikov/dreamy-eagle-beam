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
  usernameOrEmail: z.string().min(1, { message: "Потребителско име или имейл е задължително." }),
  password: z.string().min(6, { message: "Паролата трябва да е поне 6 символа." }),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      let emailToSignIn = values.usernameOrEmail;

      // Check if it's a username (doesn't contain '@')
      if (!values.usernameOrEmail.includes('@')) {
        // Call Edge Function to resolve username to email
        const resolveUsernameEdgeFunctionUrl = `https://hemkredzinaipjxnyqco.supabase.co/functions/v1/resolve-username-to-email`;
        
        const response = await fetch(resolveUsernameEdgeFunctionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: values.usernameOrEmail }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Невалидно потребителско име.");
        }
        
        if (!result.email) {
          throw new Error("Не може да се намери имейл, свързан с това потребителско име.");
        }
        emailToSignIn = result.email;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: emailToSignIn,
        password: values.password,
      });

      if (error) {
        throw error;
      }

      showSuccess("Входът е успешен!");
      navigate("/dashboard", { replace: true }); // Redirect to dashboard after successful login
    } catch (error: any) {
      console.error("Login error:", error);
      showError(`Грешка при вход: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Вход</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="usernameOrEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Потребителско име или имейл</FormLabel>
                  <FormControl>
                    <Input placeholder="потребителско_име или your@email.com" {...field} />
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
                "Вход"
              )}
            </Button>
          </form>
        </CardContent>
    </Card>
  );
};

export default LoginForm;