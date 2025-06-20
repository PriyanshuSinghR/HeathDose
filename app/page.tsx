import { PatientForm } from "@/components/forms/PatientForm";
import Logo from "@/components/Logo";
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
          <Logo className="mb-12" />

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
