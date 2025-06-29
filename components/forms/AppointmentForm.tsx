"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SelectItem } from "@/components/ui/select";
import { Doctors } from "@/constants";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";

import "react-datepicker/dist/react-datepicker.css";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";
import Link from "next/link";
import { Button } from "../ui/button";

export const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment?.schedule)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }

    try {
      if (type === "create" && patientId) {
        const appointment = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: status as Status,
          note: values.note,
        };

        const newAppointment = await createAppointment(appointment);

        if (newAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
          );
        }
      } else {
        if (!appointment?.$id) {
          console.error(
            "Appointment ID is required for update/cancel operations"
          );
          setIsLoading(false);
          return;
        }
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment.$id!,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason:
              type === "cancel" ? values.cancellationReason : "",
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          if (setOpen) {
            setOpen(false);
          }
          form.reset();
        }
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = "Submit Apppointment";
  }

  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/30 dark:border-gray-700/30 transition-all duration-300 hover:shadow-2xl">
      {type === "create" && (
        <CardHeader className="flex justify-between items-center">
          <div className="px-8 pt-8 pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              New Appointment
            </CardTitle>
            <CardDescription className="text-base text-gray-600 dark:text-gray-300/90 mt-2 leading-relaxed">
              Request a new appointment in 10 seconds.
            </CardDescription>
          </div>
          <Button variant="outline" className="shad-primary-btn" asChild>
            <Link href={`/patients/${userId}/dashboard`}>Dashboard</Link>
          </Button>
        </CardHeader>
      )}

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-12"
          >
            {type !== "cancel" && (
              <>
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="primaryPhysician"
                  label="Doctor"
                  placeholder="Select a doctor"
                >
                  {Doctors.map((doctor, i) => (
                    <SelectItem key={doctor.name + i} value={doctor.name}>
                      <div className="flex cursor-pointer items-center gap-2">
                        <Image
                          src={doctor.image}
                          width={32}
                          height={32}
                          alt="doctor"
                          className="rounded-full border border-dark-500"
                        />
                        <p>{doctor.name}</p>
                      </div>
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="schedule"
                  label="Expected appointment date"
                  showTimeSelect
                  dateFormat="MM/dd/yyyy  -  h:mm aa"
                />

                <div
                  className={`flex flex-col gap-6  ${
                    type === "create" && "xl:flex-row"
                  }`}
                >
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="reason"
                    label="Appointment reason"
                    placeholder="Annual montly check-up"
                    disabled={type === "schedule"}
                  />

                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="note"
                    label="Comments/notes"
                    placeholder="Prefer afternoon appointments, if possible"
                    disabled={type === "schedule"}
                  />
                </div>
              </>
            )}

            {type === "cancel" && (
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="cancellationReason"
                label="Reason for cancellation"
                placeholder="Urgent meeting came up"
              />
            )}

            <SubmitButton
              isLoading={isLoading}
              className={`${
                type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
              } w-full`}
            >
              {buttonLabel}
            </SubmitButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
