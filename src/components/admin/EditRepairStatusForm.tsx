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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Repair {
  id: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  description: string;
  cost: number | null; // Added cost to the interface
}

interface EditRepairStatusFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  repair: Repair;
  onSuccess: () => void;
}

const formSchema = z.object({
  description: z.string().min(5, { message: "Описанието е задължително и трябва да е поне 5 символа." }),
  status: z.enum(["Pending", "In Progress", "Completed", "Cancelled"], {
    message: "Моля, изберете валиден статус.",
  }),
  cost: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, { message: "Цената не може да бъде отрицателна." }).optional(),
  ),
});

const EditRepairStatusForm = ({ isOpen, onOpenChange, repair, onSuccess }: EditRepairStatusFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: repair.description,
      status: repair.status,
      cost: repair.cost || undefined, // Set default to undefined if null
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase
        .from("repairs")
        .update({
          description: values.description,
          status: values.status,
          cost: values.cost || null, // Ensure null is sent if cost is undefined
          updated_at: new Date().toISOString(),
        })
        .eq("id", repair.id);

      if (error) {
        throw error;
      }

      showSuccess("Ремонтът е актуализиран успешно!");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating repair:", error);
      showError(`Грешка при актуализиране на ремонта: ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактирай ремонт</DialogTitle>
          <DialogDescription>
            Актуализирайте детайлите за ремонт: "{repair.description}" (ID: {repair.id.substring(0, 8)}...)
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    />
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

export default EditRepairStatusForm;