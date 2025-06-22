"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/StatCard";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import Logo from "@/components/Logo";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "@/components/table/colums";
import { ColumnDef } from "@tanstack/react-table";
import { decryptKey } from "@/lib/utils";

const AdminPage = () => {
  const [appointments, setAppointments] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const encryptedKey =
      typeof window !== "undefined"
        ? window.localStorage.getItem("accessKey")
        : null;

    const accessKey = encryptedKey && decryptKey(encryptedKey);

    if (accessKey !== process.env.NEXT_PUBLIC_ADMIN_PASSKEY!.toString()) {
      redirect("/");
      return;
    }

    setIsAuthenticated(true);

    const fetchAppointments = async () => {
      try {
        const appointmentData = await getRecentAppointmentList();
        setAppointments(appointmentData);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col space-y-14">
        <header className="admin-header">
          <Logo />
          <p className="text-16-semibold">Admin Dashboard</p>
        </header>
        <main className="admin-main">
          <div className="text-center">
            <h1 className="header">Loading...</h1>
          </div>
        </main>
      </div>
    );
  }

  if (!appointments) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col space-y-14">
        <header className="admin-header">
          <Logo />
          <p className="text-16-semibold">Admin Dashboard</p>
        </header>
        <main className="admin-main">
          <div className="text-center">
            <h1 className="header">Unable to load appointments</h1>
            <p className="text-dark-700">Please try again later.</p>
          </div>
        </main>
      </div>
    );
  }

  const statCards = [
    {
      type: "appointments" as const,
      count: appointments.scheduledCount,
      label: "Scheduled appointments",
      icon: "/assets/icons/appointments.svg",
    },
    {
      type: "pending" as const,
      count: appointments.pendingCount,
      label: "Pending appointments",
      icon: "/assets/icons/pending.svg",
    },
    {
      type: "cancelled" as const,
      count: appointments.cancelledCount,
      label: "Cancelled appointments",
      icon: "/assets/icons/cancelled.svg",
    },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Logo />
        <p className="text-16-semibold">Admin Dashboard</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          {statCards.map((stat) => (
            <StatCard
              key={stat.type}
              type={stat.type}
              count={stat.count}
              label={stat.label}
              icon={stat.icon}
            />
          ))}
        </section>

        <DataTable
          columns={columns as ColumnDef<any>[]}
          data={appointments.documents}
        />
      </main>
    </div>
  );
};

export default AdminPage;
