import Image from "next/image";

import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Logo from "@/components/Logo";
import { redirect } from "next/navigation";

const Appointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);

  if (!patient) redirect(`/patients/${userId}/register`);

  return (
    <div className="flex h-screen max-h-screen ">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Logo className="mb-12" />

          <AppointmentForm
            patientId={patient?.$id}
            userId={userId}
            type="create"
          />

          <p className="copyright py-12">© 2025 Health Dose</p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-image.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[35%]"
      />
    </div>
  );
};

export default Appointment;
