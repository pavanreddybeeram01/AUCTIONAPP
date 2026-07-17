import React from "react";

function Hero() {
  return (
    <section className="bg-gradient-to-br from-amber-50 to-white px-6 py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
        <span className="mb-4 rounded-full bg-amber-100 px-4 py-1 text-sm font-medium text-amber-700">
          Trusted marketplace for heritage treasures
        </span>
        <h1 className="mb-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
          Discover Rare Treasures and Timeless Antiques
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-slate-600">
          Buy, sell, and bid on valuable collectibles from around the world.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="rounded-full bg-slate-900 px-6 py-3 font-medium text-white hover:bg-slate-700">
            Explore Auctions
          </button>
          <button className="rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-100">
            Start Selling
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;