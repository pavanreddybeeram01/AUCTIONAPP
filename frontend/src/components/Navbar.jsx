import React from "react";

function Navbar() {
  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="text-xl font-semibold">HeritageBid</div>

        <ul className="hidden gap-6 text-sm md:flex">
          <li className="cursor-pointer hover:text-amber-400">Home</li>
          <li className="cursor-pointer hover:text-amber-400">Auctions</li>
          <li className="cursor-pointer hover:text-amber-400">Categories</li>
          <li className="cursor-pointer hover:text-amber-400">About</li>
          <li className="cursor-pointer hover:text-amber-400">Contact</li>
        </ul>

        <div className="flex gap-3">
          <button className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10">
            Login
          </button>
          <button className="rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-400">
            Register
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;