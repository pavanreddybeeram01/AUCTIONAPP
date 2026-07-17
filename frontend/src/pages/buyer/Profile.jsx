import { useEffect, useState } from "react";
import API from "../../services/api";

export default function Profile() {
  const [profile, setProfile] = useState({
    fullName: localStorage.getItem("fullName") || "Buyer",
    email: localStorage.getItem("email") || "buyer@example.com",
    phone: localStorage.getItem("phone") || "",
    profileImage: localStorage.getItem("profileImage") || "",
  });
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    profileImage: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const response = await API.get(`/auth/users/${userId}`);
        const user = response.data || {};
        const nextProfile = {
          fullName: user.fullName || localStorage.getItem("fullName") || "Buyer",
          email: user.email || localStorage.getItem("email") || "buyer@example.com",
          phone: user.phone || localStorage.getItem("phone") || "",
          profileImage: user.profileImage || localStorage.getItem("profileImage") || "",
        };
        setProfile(nextProfile);
        setFormData({
          fullName: nextProfile.fullName,
          phone: nextProfile.phone,
          profileImage: nextProfile.profileImage,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

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
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      setLoading(true);
      const response = await API.put(`/auth/users/${userId}/profile`, {
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
      setFormData((prev) => ({ ...prev, profileImage: nextProfile.profileImage || prev.profileImage }));
      localStorage.setItem("fullName", nextProfile.fullName);
      localStorage.setItem("phone", nextProfile.phone);
      localStorage.setItem("profileImage", nextProfile.profileImage || "");
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Unable to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await API.put(`/auth/users/${userId}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("Password changed successfully.");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Unable to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
      <h2 className="mb-6 text-3xl font-bold text-gray-900">My Profile</h2>

      {message && <div className="mb-4 rounded-xl bg-gray-100 p-3 text-sm text-gray-700">{message}</div>}

      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-center">
          {profile.profileImage ? (
            <img src={profile.profileImage} alt="Profile" className="mx-auto h-32 w-32 rounded-full object-cover" />
          ) : (
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gray-900 text-3xl font-bold text-white">
              {profile.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
          <p className="mt-4 text-xl font-semibold text-gray-900">{profile.fullName}</p>
          <p className="text-sm text-gray-500">{profile.email}</p>
        </div>

        <div className="space-y-8">
          <form onSubmit={saveProfile} className="space-y-4 rounded-3xl border border-gray-200 bg-gray-50 p-6">
            <h3 className="text-xl font-semibold text-gray-900">Personal Details</h3>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleProfileChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleProfileChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Choose Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
              />
              {formData.profileImage ? (
                <img src={formData.profileImage} alt="Profile preview" className="mt-4 h-24 w-24 rounded-full object-cover" />
              ) : null}
            </div>
            <button type="submit" className="rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>

          <form onSubmit={savePassword} className="space-y-4 rounded-3xl border border-gray-200 bg-gray-50 p-6">
            <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
              />
            </div>
            <button type="submit" className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700" disabled={loading}>
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
