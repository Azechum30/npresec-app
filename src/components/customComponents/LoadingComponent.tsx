"use client";

import * as motion from "motion/react-client";

export default function LoadingComponent() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-24 bg-secondary flex justify-center items-center gap-1 rounded-md">
      {Array.from({ length: 6 }, (_, index) => {
        return (
          <motion.div
            key={index}
            className="w-4 h-4 rounded-full bg-foreground"
            animate={{ y: 15 }}
            transition={{
              duration: 1,
              ease: "easeIn",
              repeat: Infinity,
              repeatDelay: index * 0.1,
            }}
          />
        );
      })}
    </div>
  );
}
