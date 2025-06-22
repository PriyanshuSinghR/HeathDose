import { StatCard } from "@/components/StatCard";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import Logo from "@/components/Logo";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "@/components/table/colums";
import { ColumnDef } from "@tanstack/react-table";

const AdminPage = async () => {
  const appointments = await getRecentAppointmentList();

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
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Scheduled appointments"
            icon={"/assets/icons/appointments.svg"}
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending appointments"
            icon={"/assets/icons/pending.svg"}
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled appointments"
            icon={"/assets/icons/cancelled.svg"}
          />
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
