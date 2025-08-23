"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { StaticImageData } from "next/image";
import AutoPlay from "embla-carousel-autoplay";

type CarouselComponentProps = {
  images: StaticImageData[];
};

export const CarouselComponent = ({ images }: CarouselComponentProps) => {
  return (
    <Carousel plugins={[AutoPlay({})]} className="rounded-md h-full">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <Card className="border-none rounded-none shadow-none bg-transparent">
              <Image
                className="w-full h-full md:h-[400px] object-cover object-center rounded-lg"
                src={image}
                alt={`${Image}-${index}`}
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
