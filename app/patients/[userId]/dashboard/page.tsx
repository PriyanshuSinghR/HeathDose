import { StatCard } from "@/components/StatCard";
import { getPatientAppointments } from "@/lib/actions/appointment.actions";
import Logo from "@/components/Logo";
import { DataTable } from "@/components/table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { getPatient } from "@/lib/actions/patient.actions";
import { redirect } from "next/navigation";
import { patientColumns } from "@/components/table/patientColums";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PatientDashboard = async ({ params: { userId } }: SearchParamProps) => {
  const patientAppointments = await getPatientAppointments(userId);
  const patient = await getPatient(userId);
  if (!patient) redirect("/");

  if (!patientAppointments) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col space-y-14">
        <header className="admin-header">
          <Logo />
          <p className="text-16-semibold">Patient Dashboard</p>
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
      count: patientAppointments.scheduledCount,
      label: "Scheduled appointments",
      icon: "/assets/icons/appointments.svg",
    },
    {
      type: "pending" as const,
      count: patientAppointments.pendingCount,
      label: "Pending appointments",
      icon: "/assets/icons/pending.svg",
    },
    {
      type: "cancelled" as const,
      count: patientAppointments.cancelledCount,
      label: "Cancelled appointments",
      icon: "/assets/icons/cancelled.svg",
    },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Logo />
        <p className="text-16-semibold">Patient Dashboard</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="header">Welcome 👋</h1>
              <p className="text-dark-700">
                Uptodate information about your appointments
              </p>
            </div>

            <Button variant="outline" className="shad-primary-btn" asChild>
              <Link href={`/patients/${userId}/new-appointment`}>
                Book Appointment
              </Link>
            </Button>
          </div>
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
          columns={patientColumns as ColumnDef<any>[]}
          data={patientAppointments.documents}
        />
      </main>
    </div>
  );
};

export default PatientDashboard;
