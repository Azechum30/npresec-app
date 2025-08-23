"use client";

import { useStudentStore } from "../store";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { steps } from "@/lib/constants";

export default function StudentOnboardingNavbar({
  className,
  ...props
}: {
  className?: string;
}) {
  const {
    currentStep,
    isEditing,
    actions: { setCurrentStep },
  } = useStudentStore();

  return (
    <div className={className} {...props}>
      <div className="flex md:flex-col gap-y-6 relative">
        {steps.map((step, index) => {
          const isCompleted = isEditing ? true : step.step < currentStep;
          const isActive = step.step === currentStep;

          return (
            <div
              key={step.step}
              className="relative flex items-center w-full max-w-2xl mx-auto">
              {/* Vertical connector for desktop */}

              {index < steps.length - 1 && (
                <div className="grow justify-center relative w-[2px] h-[27px]">
                  <div className="hidden md:block absolute left-4 top-[29px] h-full w-[2px] bg-muted-foreground -z-10" />
                  <div
                    className={cn(
                      "hidden md:block absolute left-4 top-[29px] h-full w-[2px] bg-primary -z-10 transition-transform duration-300 origin-top transform",
                      currentStep > index + 1 ? "scale-y-100" : "scale-y-0",
                      isEditing && "scale-y-100"
                    )}
                  />
                </div>
              )}

              <div className="flex items-center w-full">
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.step)}
                  className="flex items-center justify-between md:justify-start md:gap-4 font-semibold w-fit disabled:cursor-not-allowed"
                  disabled={!isCompleted && !isActive}>
                  <span
                    className={cn(
                      "rounded-full w-8 h-8 flex justify-center items-center border-2 font-bold transition-colors duration-300 relative z-20",
                      isActive && "border-primary",
                      isCompleted && "bg-primary border-primary",
                      !isActive &&
                        !isCompleted &&
                        "bg-muted border-foreground group-hover:bg-muted-foreground"
                    )}>
                    {step.step}
                  </span>

                  <span
                    className={cn(
                      buttonVariants({
                        variant: isCompleted ? "default" : "secondary",

                        size: "sm",
                      }),
                      "hidden md:inline-flex md:justify-center md:items-center text-left border-2 border-primary-foreground",
                      isActive && "border-primary",
                      isCompleted && "border-primary"
                    )}>
                    {step.title}
                  </span>
                </button>

                {/* Horizontal connector for mobile - FIXED POSITIONING */}
                {index < steps.length - 1 && (
                  <div className="grow h-[2px] w-full relative md:hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-muted-foreground" />
                    <div
                      className={cn(
                        "absolute top-0 left-0 w-full h-full bg-primary transition-transform duration-300 ease-in-out origin-left transform",
                        currentStep > index + 1 ? "scale-x-100" : "scale-x-0"
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
