import Image from "next/image";

const Logo = ({ className }: React.ComponentProps<"div">) => (
  <div className={`flex justify-center items-center gap-2 ${className}`}>
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
);

export default Logo;
