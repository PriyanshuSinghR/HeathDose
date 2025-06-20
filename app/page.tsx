import { PatientForm } from "@/components/forms/PatientForm";
import { PasskeyModal } from "@/components/PasskeyModal";
import Image from "next/image";
import Link from "next/link";

const Home = ({ searchParams }: SearchParamProps) => {
  const isAdmin = searchParams?.admin === "true";
  return (
    <div className="flex h-screen max-h-screen ">
      {isAdmin && <PasskeyModal />}
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
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

          <PatientForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2025 Health Dose
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin Portal
            </Link>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/dr-img.jpg"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
};

export default Home;
