import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../../services/api";

const cards = [
  { title: "Create Auction", description: "List a new collectible for bidding.", link: "/seller/create-auction" },
  { title: "Manage Listings", description: "Review and update your current items.", link: "/seller/manage-listings" },
  { title: "Active Auctions", description: "Track live auctions and current bids.", link: "/seller/active-auctions" },
  { title: "Sold Items", description: "View completed sales and payments.", link: "/seller/sold-items" },
  { title: "Bid Management", description: "Monitor bidders and responses.", link: "/seller/bid-management" },
  { title: "Earnings", description: "See your revenue insights.", link: "/seller/earnings" },
];

export default function SellerDashboard() {
  const location = useLocation();
  const sellerName = localStorage.getItem("fullName") || "Seller";
  const sellerId = Number(localStorage.getItem("userId"));
  const [stats, setStats] = useState({ total: 0, active: 0, ended: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    fullName: localStorage.getItem("fullName") || "Seller",
    email: localStorage.getItem("email") || "seller@example.com",
    phone: localStorage.getItem("phone") || "",
    profileImage: localStorage.getItem("profileImage") || "",
  });
  const [formData, setFormData] = useState({ fullName: "", phone: "", profileImage: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSellerStats = async () => {
      if (!sellerId) {
        setError("Please log in as a seller to view this dashboard.");
        setLoading(false);
        return;
      }

      try {
        const response = await API.get(`/auctions/seller/${sellerId}`);
        const auctions = response.data || [];
        const active = auctions.filter((auction) => auction.status === "ACTIVE").length;
        const ended = auctions.filter((auction) => auction.status === "ENDED").length;
        setStats({ total: auctions.length, active, ended });

        const profileResponse = await API.get(`/auth/users/${sellerId}`);
        const user = profileResponse.data || {};
        const nextProfile = {
          fullName: user.fullName || localStorage.getItem("fullName") || "Seller",
          email: user.email || localStorage.getItem("email") || "seller@example.com",
          phone: user.phone || localStorage.getItem("phone") || "",
          profileImage: user.profileImage || localStorage.getItem("profileImage") || "",
        };
        setProfile(nextProfile);
        setFormData({ fullName: nextProfile.fullName, phone: nextProfile.phone, profileImage: nextProfile.profileImage });
      } catch (err) {
        console.error(err);
        setError("Unable to load your seller dashboard right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerStats();
  }, [sellerId]);

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setFormData((prev) => ({ ...prev, profileImage: result }));
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put(`/auth/users/${sellerId}/profile`, {
        fullName: formData.fullName,
        phone: formData.phone,
        profileImage: formData.profileImage,
      });
      const updatedUser = response.data || {};
      const nextProfile = {
        fullName: updatedUser.fullName || formData.fullName,
        email: profile.email,
        phone: updatedUser.phone || formData.phone,
        profileImage: updatedUser.profileImage || formData.profileImage,
      };
      setProfile(nextProfile);
      localStorage.setItem("fullName", nextProfile.fullName);
      localStorage.setItem("phone", nextProfile.phone);
      localStorage.setItem("profileImage", nextProfile.profileImage || "");
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Unable to update profile.");
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      await API.put(`/auth/users/${sellerId}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("Password changed successfully.");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Unable to change password.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed left-4 top-4 z-40 rounded-full bg-gray-900 p-3 text-white shadow-lg lg:hidden"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        {sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            aria-label="Close sidebar"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-gray-700 bg-gray-900 p-6 text-gray-100 transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <h1 className="mb-10 text-3xl font-bold text-white">HeritageBid</h1>

          <ul className="space-y-3 text-lg">
            {[
              { label: "Dashboard", link: "/seller/dashboard" },
              { label: "Create Auction", link: "/seller/create-auction" },
              { label: "Manage Listings", link: "/seller/manage-listings" },
              { label: "Active Auctions", link: "/seller/active-auctions" },
              { label: "Sold Items", link: "/seller/sold-items" },
              { label: "Bid Management", link: "/seller/bid-management" },
              { label: "Earnings", link: "/seller/earnings" },
            ].map((item) => {
              const isActive = location.pathname === item.link;
              return (
                <li key={item.link}>
                  <Link
                    to={item.link}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex w-full rounded-xl px-4 py-3 text-left transition ${
                      isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="flex-1">
          <div className="border-b border-gray-200 bg-white px-4 py-5 shadow-sm sm:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back 👋</h1>
            <p className="mt-2 text-gray-600">Manage your catalog and keep your auctions moving.</p>
          </div>

          <div className="p-4 sm:p-8">
            <div className="mb-8 rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
              <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
              <p className="mt-2 text-gray-600">Welcome back, {sellerName}. Manage your auction catalog from one place.</p>
            </div>

            {error && <p className="mb-6 text-gray-700">{error}</p>}

            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Total Listings</p>
                <h2 className="text-3xl font-bold text-gray-900">{loading ? "..." : stats.total}</h2>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Active Auctions</p>
                <h2 className="text-3xl font-bold text-gray-900">{loading ? "..." : stats.active}</h2>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Ended Auctions</p>
                <h2 className="text-3xl font-bold text-gray-900">{loading ? "..." : stats.ended}</h2>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {cards.map((card) => (
                <Link
                  key={card.title}
                  to={card.link}
                  className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <h2 className="text-xl font-semibold text-gray-900">{card.title}</h2>
                  <p className="mt-2 text-gray-500">{card.description}</p>
                </Link>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">Seller Profile</h2>

              {message && <div className="mb-4 rounded-xl bg-gray-100 p-3 text-sm text-gray-700">{message}</div>}

              <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-center">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt="Profile" className="mx-auto h-32 w-32 rounded-full object-cover" />
                  ) : (
                    <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gray-900 text-3xl font-bold text-white">
                      {profile.fullName?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                  )}
                  <p className="mt-4 text-xl font-semibold text-gray-900">{profile.fullName}</p>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                </div>

                <div className="space-y-6">
                  <form onSubmit={saveProfile} className="space-y-4 rounded-3xl border border-gray-200 bg-gray-50 p-6">
                    <h3 className="text-xl font-semibold text-gray-900">Personal Details</h3>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleProfileChange} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Phone</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleProfileChange} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Choose Profile Picture</label>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3" />
                      {formData.profileImage ? (
                        <img src={formData.profileImage} alt="Profile preview" className="mt-4 h-24 w-24 rounded-full object-cover" />
                      ) : null}
                    </div>
                    <button type="submit" className="rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white">Save Profile</button>
                  </form>

                  <form onSubmit={savePassword} className="space-y-4 rounded-3xl border border-gray-200 bg-gray-50 p-6">
                    <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Current Password</label>
                      <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">New Password</label>
                      <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Confirm New Password</label>
                      <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3" />
                    </div>
                    <button type="submit" className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700">Change Password</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
