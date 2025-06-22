"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import { StatusBadge } from "../StatusBadge";

export const patientColumns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original;
      return <p className="text-14-medium ">{appointment.patient.name}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const appointment = row.original;

      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
      );

      return (
        <div className="flex items-center gap-3">
          {doctor ? (
            <>
              <Image
                src={doctor.image}
                alt="doctor"
                width={100}
                height={100}
                className="size-8"
              />
              <p className="whitespace-nowrap">Dr. {doctor.name}</p>
            </>
          ) : (
            <>
              <div className="size-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs">?</span>
              </div>
              <p className="whitespace-nowrap">
                Dr. {appointment.primaryPhysician}
              </p>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "note",
    header: "Details",
    cell: ({ row }) => {
      const appointment = row.original;

      const getStatusDetails = () => {
        switch (appointment.status) {
          case "cancelled":
            return {
              title: "Cancellation Reason",
              content: appointment.cancellationReason || "No reason provided",
              bgColor: "bg-red-50 dark:bg-red-950/20",
              textColor: "text-red-700 dark:text-red-300",
              borderColor: "border-red-200 dark:border-red-800",
              contentTextColor: "text-red-600 dark:text-red-400",
            };
          case "scheduled":
            return {
              title: "Appointment Note",
              content: "Congratulations",
              bgColor: "bg-green-50 dark:bg-green-950/20",
              textColor: "text-green-700 dark:text-green-300",
              borderColor: "border-green-200 dark:border-green-800",
              contentTextColor: "text-green-600 dark:text-green-400",
            };
          case "pending":
            return {
              title: "Pending Review",
              content: "Awaiting confirmation",
              bgColor: "bg-blue-50 dark:bg-blue-950/20",
              textColor: "text-blue-700 dark:text-blue-300",
              borderColor: "border-blue-200 dark:border-blue-800",
              contentTextColor: "text-blue-600 dark:text-blue-400",
            };
          default:
            return {
              title: "Information",
              content:
                appointment.note ||
                appointment.reason ||
                "No details available",
              bgColor: "bg-gray-50 dark:bg-gray-900/50",
              textColor: "text-gray-700 dark:text-gray-300",
              borderColor: "border-gray-200 dark:border-gray-700",
              contentTextColor: "text-gray-600 dark:text-gray-400",
            };
        }
      };

      const statusDetails = getStatusDetails();

      return (
        <div className="max-w-[200px]">
          {statusDetails.content &&
          statusDetails.content !== "No details available" ? (
            <div
              className={`p-3 rounded-lg border transition-colors duration-200 ${statusDetails.bgColor} ${statusDetails.borderColor}`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-medium ${statusDetails.textColor} mb-1`}
                  >
                    {statusDetails.title}
                  </p>
                  <p
                    className={`text-xs break-words ${statusDetails.contentTextColor}`}
                  >
                    {statusDetails.content}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-lg border transition-colors duration-200 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No details available
                </p>
              </div>
            </div>
          )}
        </div>
      );
    },
  },
];
