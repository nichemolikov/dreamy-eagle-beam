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

interface Repair {
  id: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  description: string; // Added for display in dialog title
}

interface EditRepairStatusFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  repair: Repair;
  onSuccess: () => void;
}

const formSchema = z.object({
  status: z.enum(["Pending", "In Progress", "Completed", "Cancelled"], {
    message: "Моля, изберете валиден статус.",
  }),
});

const EditRepairStatusForm = ({ isOpen, onOpenChange, repair, onSuccess }: EditRepairStatusFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: repair.status,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase
        .from("repairs")
        .update({ status: values.status, updated_at: new Date().toISOString() })
        .eq("id", repair.id);

      if (error) {
        throw error;
      }

      showSuccess("Статусът на ремонта е актуализиран успешно!");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating repair status:", error);
      showError(`Грешка при актуализиране на статуса: ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактирай статус на ремонт</DialogTitle>
          <DialogDescription>
            Актуализирайте статуса за ремонт: "{repair.description}" (ID: {repair.id.substring(0, 8)}...)
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <Button type="submit" className="w-full">Запази промените</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRepairStatusForm;