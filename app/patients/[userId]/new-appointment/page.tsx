import Image from "next/image";

import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";

const Appointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);

  return (
    <div className="flex h-screen max-h-screen ">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <div className="flex justify-center items-center gap-2 mb-12">
            <Image
              src="/assets/icons/logo-icon.svg"
              height={60}
              width={60}
              alt="patient"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Health Dose
              </h2>
              <p className="text-gray-600 dark:text-gray-300 ">
                Your health, our priority
              </p>
            </div>
          </div>

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
