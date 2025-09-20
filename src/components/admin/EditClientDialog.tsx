"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditClientForm } from "./EditClientForm";

interface EditClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  client: {
    id: string;
    user_id: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    notes?: string | null;
    role: "client" | "admin";
  };
  onSuccess: () => void;
}

export function EditClientDialog({ isOpen, onOpenChange, client, onSuccess }: EditClientDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактирай клиент</DialogTitle>
          <DialogDescription>
            Направете промени в профила на клиента тук. Кликнете запази, когато сте готови.
          </DialogDescription>
        </DialogHeader>
        <EditClientForm client={client} onSuccess={onSuccess} onOpenChange={onOpenChange} isOpen={isOpen} />
      </DialogContent>
    </Dialog>
  );
}