"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Appointment } from "@/types/appwrite.types";

import { AppointmentForm } from "./forms/AppointmentForm";

import "react-datepicker/dist/react-datepicker.css";

export const AppointmentModal = ({
  patientId,
  userId,
  appointment,
  type,
  title,
  description,
}: {
  patientId: string;
  userId: string;
  appointment?: Appointment;
  type: "schedule" | "cancel";
  title: string;
  description: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`capitalize ${
            type === "schedule"
              ? "text-green-500 hover:text-green-600"
              : "text-red-500 hover:text-red-600"
          }`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4">
          <div className="space-y-2">
            <DialogTitle className="capitalize text-lg font-semibold">
              {title || `${type} Appointment`}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {description ||
                `Please fill in the details to ${type} this appointment`}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-1">
          <AppointmentForm
            userId={userId}
            patientId={patientId}
            type={type}
            appointment={appointment}
            setOpen={setOpen}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
