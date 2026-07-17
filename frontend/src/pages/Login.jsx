import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", formData);
      const {
        id,
        fullName,
        token,
        role,
        message,
      } = response.data || {};

      localStorage.setItem("userId", id || "");
      localStorage.setItem("fullName", fullName || "Buyer");
      localStorage.setItem("email", formData.email);
      localStorage.setItem("phone", "");
      localStorage.setItem("token", token || "temporary-token");
      localStorage.setItem("role", role || "BUYER");

      alert(message || "Login Successful");

      if (role === "SELLER") {
        navigate("/seller/dashboard");
      } else {
        navigate("/buyer/dashboard");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Invalid Email or Password";
      alert(message);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:flex-row">
        <div className="flex flex-1 flex-col justify-center bg-gray-900 px-8 py-12 text-white lg:px-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">Welcome back</p>
          <h1 className="text-3xl font-bold">Sign in to HeritageBid</h1>
          <p className="mt-3 text-sm text-gray-300">Access your auctions, bids, and account settings in one place.</p>
        </div>

        <div className="flex-1 bg-gray-50 p-8 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">Login</h2>
            <p className="mt-2 text-sm text-gray-600">Login to your account</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
                />
              </div>

              <button type="submit" className="w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-black">
                Login
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-gray-900">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
