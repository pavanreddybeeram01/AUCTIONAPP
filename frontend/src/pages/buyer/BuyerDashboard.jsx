import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

const navItems = [
  { id: "browse", label: "Browse Auctions", sectionId: "browse-auctions" },
  { id: "bids", label: "My Bids", sectionId: "my-bids" },
  { id: "wishlist", label: "Wishlist", sectionId: "wishlist" },
  { id: "won", label: "Won / Lost", sectionId: "won-auctions" },
  { id: "profile", label: "Profile", sectionId: "profile" },
];

export default function BuyerDashboard() {
  const [auctions, setAuctions] = useState([]);
  const [activeBids, setActiveBids] = useState([]);
  const [wonAuctions, setWonAuctions] = useState([]);
  const [lostAuctions, setLostAuctions] = useState([]);
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState("browse");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlistIds, setWishlistIds] = useState([]);
  const [profile, setProfile] = useState({
    fullName: localStorage.getItem("fullName") || "Buyer",
    email: localStorage.getItem("email") || "buyer@example.com",
    phone: localStorage.getItem("phone") || "",
    profileImage: localStorage.getItem("profileImage") || "",
  });
  const [formData, setFormData] = useState({ fullName: "", phone: "", profileImage: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileMessage, setProfileMessage] = useState("");

  const userId = Number(localStorage.getItem("userId"));
  const wishlistStorageKey = userId ? `buyerWishlist-${userId}` : "buyerWishlist";
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setWishlistIds([]);
      return;
    }

    try {
      const savedWishlist = JSON.parse(localStorage.getItem(wishlistStorageKey) || "[]");
      setWishlistIds(Array.isArray(savedWishlist) ? savedWishlist : []);
    } catch (err) {
      console.error(err);
      setWishlistIds([]);
    }
  }, [userId, wishlistStorageKey]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

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
        setFormData({ fullName: nextProfile.fullName, phone: nextProfile.phone, profileImage: nextProfile.profileImage });
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [userId]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await API.get("/auctions");
        const allAuctions = response.data || [];

        const bidsResponses = await Promise.all(
          allAuctions.map((auction) => API.get(`/bids/auction/${auction.id}`))
        );

        const bidsByAuction = {};
        const buyerActiveBids = [];
        const buyerWon = [];
        const buyerLost = [];

        allAuctions.forEach((auction, index) => {
          const auctionBids = bidsResponses[index]?.data || [];
          bidsByAuction[auction.id] = auctionBids;

          const userAuctionBids = auctionBids.filter((bid) => {
            const bidBuyerId = bid?.buyer?.id ?? bid?.buyerId ?? bid?.buyer?.userId;
            return Number(bidBuyerId) === userId;
          });

          if (userAuctionBids.length === 0) {
            return;
          }

          const userHighestBid = Math.max(...userAuctionBids.map((bid) => Number(bid.amount || 0)));
          const highestBid = auctionBids.reduce((max, bid) => Math.max(max, Number(bid.amount || 0)), 0);
          const isEnded = auction.status === "ENDED" || new Date(auction.endTime) <= new Date();

          if (!isEnded) {
            buyerActiveBids.push({
              ...auction,
              userHighestBid,
              currentHighestBid: highestBid,
            });
            return;
          }

          if (userHighestBid >= highestBid && highestBid > 0) {
            buyerWon.push({ ...auction, userHighestBid, currentHighestBid: highestBid });
          } else {
            buyerLost.push({ ...auction, userHighestBid, currentHighestBid: highestBid });
          }
        });

        setAuctions(allAuctions);
        setActiveBids(buyerActiveBids);
        setWonAuctions(buyerWon);
        setLostAuctions(buyerLost);
      } catch (err) {
        console.error(err);
        setError("Unable to load your dashboard right now.");
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDashboardData();
    } else {
      setError("Please log in to view your buyer dashboard.");
      setLoading(false);
    }
  }, [userId]);

  const filteredAuctions = (auctions || []).filter((auction) =>
    (auction.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const wishlistAuctions = (auctions || []).filter((auction) => wishlistIds.includes(Number(auction.id)));

  const toggleWishlist = (auction) => {
    if (!auction?.id) return;

    const auctionId = Number(auction.id);
    setWishlistIds((prev) => {
      const nextWishlist = prev.includes(auctionId)
        ? prev.filter((id) => id !== auctionId)
        : [...prev, auctionId];

      localStorage.setItem(wishlistStorageKey, JSON.stringify(nextWishlist));
      return nextWishlist;
    });
  };

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
    if (!currentUserId) {
      setProfileMessage("Please log in again to update your profile.");
      return;
    }

    try {
      const payload = {
        fullName: formData.fullName?.trim(),
        phone: formData.phone?.trim(),
        profileImage: formData.profileImage || "",
      };

      const response = await API.put(`/auth/users/${currentUserId}/profile`, payload);
      const updatedUser = response.data || {};
      const nextProfile = {
        fullName: updatedUser.fullName || payload.fullName || profile.fullName,
        email: profile.email,
        phone: updatedUser.phone || payload.phone || profile.phone,
        profileImage: updatedUser.profileImage || payload.profileImage || profile.profileImage,
      };
      setProfile(nextProfile);
      localStorage.setItem("fullName", nextProfile.fullName);
      localStorage.setItem("phone", nextProfile.phone);
      localStorage.setItem("profileImage", nextProfile.profileImage || "");
      setFormData((prev) => ({ ...prev, profileImage: nextProfile.profileImage || prev.profileImage }));
      setProfileMessage("Profile updated successfully.");
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Unable to update profile.";
      setProfileMessage(message);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (!currentUserId) {
      setProfileMessage("Please log in again to change your password.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setProfileMessage("New passwords do not match.");
      return;
    }

    try {
      await API.put(`/auth/users/${currentUserId}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setProfileMessage("Password changed successfully.");
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Unable to change password.";
      setProfileMessage(message);
    }
  };

  const handleNavClick = (itemId, sectionId) => {
    setActiveSection(itemId);
    setSidebarOpen(false);

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
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
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleNavClick(item.id, item.sectionId)}
                  className={`w-full rounded-xl px-4 py-3 text-left transition ${
                    activeSection === item.id ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1">
          <div className="border-b border-gray-200 bg-white px-4 py-5 shadow-sm sm:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back 👋</h1>
            <p className="mt-2 text-gray-600">Discover rare collectibles and place your bids.</p>
          </div>

          <div className="p-4 sm:p-8">
            <div className="mb-10 grid gap-6 md:grid-cols-4">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-5xl font-bold text-gray-900">{auctions.length}</h2>
                <p className="mt-2 text-gray-500">Available Auctions</p>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-5xl font-bold text-gray-900">{activeBids.length}</h2>
                <p className="mt-2 text-gray-500">Active Bids</p>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-5xl font-bold text-gray-900">{wishlistAuctions.length}</h2>
                <p className="mt-2 text-gray-500">Wishlist</p>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-5xl font-bold text-gray-900">{wonAuctions.length}</h2>
                <p className="mt-2 text-gray-500">Won Auctions</p>
              </div>
            </div>

            <div id="browse-auctions" className="mb-10 scroll-mt-20 rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
              <h2 className="mb-8 text-3xl font-bold text-gray-900">Browse Auctions</h2>

              <input
                type="text"
                placeholder="Search auctions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-8 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900 md:w-96"
              />

              {error && <p className="mb-4 text-gray-700">{error}</p>}

              {loading ? (
                <p className="text-gray-500">Loading auctions...</p>
              ) : filteredAuctions.length === 0 ? (
                <p className="text-gray-500">No auctions match your search.</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredAuctions.map((auction) => (
                    <div key={auction.id} className="overflow-hidden rounded-2xl bg-white shadow-lg">
                      <div className="flex h-52 items-center justify-center bg-gray-200">
                        {auction.imageUrl ? (
                          <img src={auction.imageUrl} alt={auction.title} className="h-full w-full object-cover" />
                        ) : (
                          "No Image"
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h2 className="text-2xl font-bold text-gray-900">{auction.title}</h2>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(auction)}
                            className={`rounded-full px-3 py-1 text-sm font-semibold ${
                              wishlistIds.includes(Number(auction.id))
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {wishlistIds.includes(Number(auction.id)) ? "♥ Saved" : "♡ Save"}
                          </button>
                        </div>
                        <p className="mt-2 text-gray-600">{auction.description}</p>
                        <p className="mt-3 text-gray-700">Category: {auction.category}</p>
                        <p className="mt-2 font-semibold text-gray-900">
                          Current Bid: ₹{auction.currentBid ?? auction.startingPrice ?? 0}
                        </p>
                        <p className="mt-2 text-gray-600">{auction.status}</p>

                        <Link
                          to={`/auction/${auction.id}`}
                          className="mt-5 block w-full rounded-xl bg-gray-900 py-3 text-center text-white transition hover:bg-black"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div id="my-bids" className="mb-10 scroll-mt-20 rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">My Active Bids</h2>
              {activeBids.length === 0 ? (
                <p className="text-gray-500">You do not have any active bids right now.</p>
              ) : (
                <div className="space-y-4">
                  {activeBids.map((auction) => (
                    <div key={auction.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{auction.title}</h3>
                          <p className="text-sm text-gray-500">Your highest bid: ₹{auction.userHighestBid}</p>
                        </div>
                        <p className="font-semibold text-gray-900">Current highest: ₹{auction.currentHighestBid}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div id="wishlist" className="mb-10 scroll-mt-20 rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">Wishlist</h2>

              {wishlistAuctions.length === 0 ? (
                <p className="text-gray-500">Save auctions you like to see them here.</p>
              ) : (
                <div className="space-y-4">
                  {wishlistAuctions.map((auction) => (
                    <div key={auction.id} className="flex flex-col gap-3 rounded-2xl border border-gray-200 p-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{auction.title}</h3>
                        <p className="text-sm text-gray-500">Current bid: ₹{auction.currentBid ?? auction.startingPrice ?? 0}</p>
                      </div>
                      <div className="flex gap-3">
                        <Link
                          to={`/auction/${auction.id}`}
                          className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(auction)}
                          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div id="won-auctions" className="mb-10 scroll-mt-20 rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">Won and Lost Auctions</h2>

              {wonAuctions.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">Won</h3>
                  <div className="space-y-3">
                    {wonAuctions.map((auction) => (
                      <div key={auction.id} className="rounded-2xl border border-gray-300 bg-gray-50 p-4">
                        <p className="font-semibold text-gray-900">{auction.title}</p>
                        <p className="text-sm text-gray-600">You won this auction with a bid of ₹{auction.userHighestBid}.</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lostAuctions.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">Lost</h3>
                  <div className="space-y-3">
                    {lostAuctions.map((auction) => (
                      <div key={auction.id} className="rounded-2xl border border-gray-300 bg-gray-50 p-4">
                        <p className="font-semibold text-gray-900">{auction.title}</p>
                        <p className="text-sm text-gray-600">The auction closed with a higher bid of ₹{auction.currentHighestBid}.</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {wonAuctions.length === 0 && lostAuctions.length === 0 && (
                <p className="text-gray-500">Completed auctions where you participated will appear here.</p>
              )}
            </div>

            <div id="profile" className="scroll-mt-20 rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">Profile</h2>

              {profileMessage && <div className="mb-4 rounded-xl bg-gray-100 p-3 text-sm text-gray-700">{profileMessage}</div>}

              <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
                <div className="rounded-3xl border border-gray-200 p-6 text-center">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt="Profile" className="mx-auto h-32 w-32 rounded-full object-cover" />
                  ) : (
                    <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gray-900 text-3xl font-bold text-white">
                      {(profile.fullName || "U").charAt(0).toUpperCase()}
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