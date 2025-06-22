import Image from "next/image";
import Link from "next/link";

interface LogoProps extends React.ComponentProps<"div"> {
  isActive?: boolean;
}

const Logo = ({ className, isActive = true }: LogoProps) => {
  const logoContent = (
    <>
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
        <p className="text-gray-600 dark:text-gray-300">
          Your health, our priority
        </p>
      </div>
    </>
  );

  return (
    <div className={`flex justify-center items-center gap-2 ${className}`}>
      {isActive ? (
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          {logoContent}
        </Link>
      ) : (
        <div className="flex items-center gap-2">{logoContent}</div>
      )}
    </div>
  );
};

export default Logo;
