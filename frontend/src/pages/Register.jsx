import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "BUYER",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await API.post("/auth/register", {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      localStorage.setItem("email", formData.email);
      localStorage.setItem("fullName", formData.fullName);
      localStorage.setItem("phone", formData.phone);
      localStorage.setItem("role", formData.role || "BUYER");

      alert(response.data?.message || "Registration successful");
      navigate("/login");
    } catch (error) {
      alert(error?.response?.data?.message || "Registration Failed");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:flex-row">
        <div className="flex flex-1 flex-col justify-center bg-gray-900 px-8 py-12 text-white lg:px-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">Join HeritageBid</p>
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="mt-3 text-sm text-gray-300">Register as a buyer or seller and start exploring curated auctions.</p>
        </div>

        <div className="flex-1 bg-gray-50 p-8 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">Register</h2>
            <p className="mt-2 text-sm text-gray-600">Create your account</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3" placeholder="Enter your full name" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3" placeholder="Enter your email" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3" placeholder="Enter your phone number" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3" placeholder="Enter password" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3" placeholder="Confirm password" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Account Type</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3">
                  <option value="BUYER">Buyer</option>
                  <option value="SELLER">Seller</option>
                </select>
              </div>

              <button type="submit" className="w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-black">
                Create Account
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-gray-900">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}