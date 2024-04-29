"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import messages from "@/messages.json";

const Home = () => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 ">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          Dive Into the worrld of Random Conversations{" "}
        </h1>
        <p className="mt-4 md:mt-5 text-base">
          Explore Random Messages- Where your identity remain Secret
        </p>
      </div>
      <Carousel
        plugins={[Autoplay({ delay: 2000 })]}
        className="w-full max-w-xs bg-gray-100 rounded-lg shadow-md"
      >
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index} className="m-5 p-5 text-center">
              <Card>
                <CardHeader className="text-xl font-bold text-gray-700">
                  {message.title}
                </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-6 text-gray-600">
                  {message.content}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </main>
  );
};

export default Home;
