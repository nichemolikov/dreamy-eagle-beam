"use client";

import React, { useState } from "react";
import { Phone, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Generate a simple captcha
const generateCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return {
    question: `${num1} + ${num2}`,
    answer: num1 + num2,
  };
};

const ContactSection = () => {
  const [captcha, setCaptcha] = useState(generateCaptcha());

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Името трябва да е поне 2 символа.",
    }),
    email: z.string().email({
      message: "Моля, въведете валиден имейл адрес.",
    }),
    phoneNumber: z.string().regex(/^[0-9\s\-+()]*$/, {
      message: "Моля, въведете валиден телефонен номер.",
    }).min(5, {
      message: "Телефонният номер трябва да е поне 5 символа.",
    }),
    message: z.string().min(10, {
      message: "Съобщението трябва да е поне 10 символа.",
    }),
    captcha: z.string().refine((val) => parseInt(val) === captcha.answer, {
      message: "Неправилен отговор на капчата.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      message: "",
      captcha: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);
    alert("Вашето съобщение е изпратено успешно!");
    form.reset();
    setCaptcha(generateCaptcha()); // Generate new captcha after submission
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Свържете се с нас</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Имате въпроси или се нуждаете от помощ? Свържете се с нас по телефона или чрез формата по-долу.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Phone className="h-8 w-8 text-primary" />
              <div>
                <h4 className="text-xl font-semibold">+359 88 628 6126</h4>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-8 w-8 text-primary" />
              <div>
                <h4 className="text-xl font-semibold">+359 88 344 4016</h4>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="h-8 w-8 text-primary" />
              <div>
                <h4 className="text-xl font-semibold">office@mertai.bg</h4>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Изпратете ни съобщение</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Телефонен номер</FormLabel>
                        <FormControl>
                          <Input placeholder="+359 888 123 456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Съобщение</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Вашето съобщение..." rows={5} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="captcha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Колко е {captcha.question}?</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Вашият отговор" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Изпрати</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;