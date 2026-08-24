interface LogoProps {
  variant?: "full" | "half";
  className?: string;
  imgClassName?: string;
}

export function Logo({ variant = "full", className = "", imgClassName = "" }: LogoProps) {
  if (variant === "half") {
    return (
      <div className={`relative flex items-center shrink-0 ${className}`}>
        {/* Light Mode Half Logo */}
        <img
          src="/images/logo-hf-color.svg"
          alt="LoveLearn Logo"
          className={`dark:hidden block h-9 w-auto object-contain ${imgClassName}`}
        />
        {/* Dark Mode Half Logo */}
        <img
          src="/images/logo-hf-white.svg"
          alt="LoveLearn Logo"
          className={`hidden dark:block h-9 w-auto object-contain ${imgClassName}`}
        />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center shrink-0 ${className}`}>
      {/* Light Mode Full Logo */}
      <img
        src="/images/logo-full-color.svg"
        alt="LoveLearn Logo"
        className={`dark:hidden block h-10 w-auto object-contain ${imgClassName}`}
      />
      {/* Dark Mode Full Logo */}
      <img
        src="/images/logo-full-white.svg"
        alt="LoveLearn Logo"
        className={`hidden dark:block h-10 w-auto object-contain ${imgClassName}`}
      />
    </div>
  );
}


