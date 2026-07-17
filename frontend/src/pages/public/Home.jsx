import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-6xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10 lg:p-12">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">HeritageBid</p>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Discover rare pieces through trusted online auctions.</h1>
          <p className="mt-5 text-lg text-gray-600">Your destination for elegant bidding, secure transactions, and timeless collectibles.</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-gray-900">Browse Listings</h2>
            <p className="mt-2 text-sm text-gray-600">Explore curated auctions from trusted sellers.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-gray-900">Place Bids</h2>
            <p className="mt-2 text-sm text-gray-600">Watch live activity and secure the pieces you love.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-gray-900">Track Activity</h2>
            <p className="mt-2 text-sm text-gray-600">Stay informed with a polished dashboard for buyers and sellers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
