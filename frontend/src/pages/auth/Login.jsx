import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:flex-row">
        <div className="flex flex-1 flex-col justify-center bg-gray-900 px-8 py-12 text-white lg:px-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-300">Welcome back</p>
          <h1 className="text-3xl font-bold">Sign in to HeritageBid</h1>
          <p className="mt-3 text-sm text-gray-300">Access your auctions, bids, and account settings in one place.</p>
        </div>

        <div className="flex-1 bg-gray-50 p-8 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">Login</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to your account.</p>

            <form className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <input type="email" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3" placeholder="you@example.com" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
                <input type="password" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-black">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
