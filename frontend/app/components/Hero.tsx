import React from "react";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-end px-6 md:px-24 w-full bg-white"
      id="home"
    >
      <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left max-w-2xl mt-16 md:mr-12 lg:mr-32">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-black mb-4">
          HopHacks
        </h1>

        <div className="flex flex-col items-center md:items-start ml-2 mb-10">
          <p className="text-gray-500 text-xl font-bold mb-2">
            September __ - __
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 md:gap-6 mt-4 w-full sm:w-auto px-4 sm:px-0">
          <button
            type="button"
            className="w-40 h-14 bg-gray-200 border border-black flex items-center justify-center font-bold text-black hover:bg-gray-300 active:bg-gray-400"
          >
            Apply
          </button>
          <button
            type="button"
            className="w-40 h-14 bg-white border border-black flex items-center justify-center font-bold text-black hover:bg-gray-100 active:bg-gray-200"
          >
            Sponsor Us
          </button>
        </div>
      </div>
    </section>
  );
}
