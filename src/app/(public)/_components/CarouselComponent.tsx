/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoPlay from "embla-carousel-autoplay";
import Image, { type StaticImageData } from "next/image";

type CarouselComponentProps = {
  images: StaticImageData[];
};

export const CarouselComponent = ({ images }: CarouselComponentProps) => {
  return (
    <Carousel plugins={[AutoPlay({})]} className="rounded-md h-full">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={`${index.toString()}`}>
            <Card className="border-none rounded-none shadow-none bg-transparent">
              <Image
                className="w-full h-full md:h-100 object-cover object-center rounded-lg"
                src={image}
                alt={`${Image}-${index}`}
                quality={90}
                loading="lazy"
              />
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  );
};
