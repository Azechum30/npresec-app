import Image from "next/image";
import banner from "@/../public/logo.png";

export const AboutHeader = () => {
  return (
    <div className="relative">
      <div className="w-full h-[30vh]">
        <Image
          src={banner}
          alt="banner"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="w-full h-full absolute top-0 left-0 z-10 bg-primary/95 dark:bg-background/95 flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-foreground">
          About Us
        </h1>
      </div>
    </div>
  );
};
