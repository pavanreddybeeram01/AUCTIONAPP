import { useCallback, useEffect, useState } from "react";
import API from "../services/api";

export default function SellerDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sellerName = localStorage.getItem("fullName") || "Seller";
  const sellerEmail = localStorage.getItem("email") || "seller@example.com";
  const sellerPhone = localStorage.getItem("phone") || "Not available";
  const sellerId = localStorage.getItem("userId") || 1;

  const fetchAuctions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get(`/auctions/seller/${sellerId}`);
      setAuctions(response.data || []);
    } catch (error) {
      console.error(error);
      setError("Unable to load your auctions right now.");
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  const handleCreateAuction = async () => {
    if (!title || !description || !category || !startingPrice || !startTime || !endTime) {
      alert("Please fill in all required auction fields.");
      return;
    }

    const auction = {
      title,
      description,
      category,
      startingPrice: Number(startingPrice),
      imageUrl,
      sellerId: Number(sellerId),
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
    };

    try {
      await API.post("/auctions/create", auction);
      alert("Auction Created Successfully");
      setTitle("");
      setDescription("");
      setCategory("");
      setStartingPrice("");
      setStartTime("");
      setEndTime("");
      setImageUrl("");
      fetchAuctions();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to create auction");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex scroll-smooth">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-900 text-white min-h-screen p-6 hidden lg:block">
        <h1 className="text-3xl font-bold text-amber-500 mb-10">HeritageBid</h1>

        <ul className="space-y-4 text-lg">
          <a href="#dashboard" className="block bg-amber-600 px-4 py-3 rounded-xl">
            Dashboard
          </a>

          <a href="#create-auction" className="block hover:bg-gray-800 px-4 py-3 rounded-xl">
            Create Auction
          </a>

          <a href="#listings" className="block hover:bg-gray-800 px-4 py-3 rounded-xl">
            My Listings
          </a>

          <a href="#active-auctions" className="block hover:bg-gray-800 px-4 py-3 rounded-xl">
            Active Auctions
          </a>

          <a href="#sold-items" className="block hover:bg-gray-800 px-4 py-3 rounded-xl">
            Sold Items
          </a>

          <a href="#earnings" className="block hover:bg-gray-800 px-4 py-3 rounded-xl">
            Earnings
          </a>

          <a href="#profile" className="block hover:bg-gray-800 px-4 py-3 rounded-xl">
            Profile
          </a>

          <button
            type="button"
            className="block w-full text-left hover:bg-red-600 px-4 py-3 rounded-xl mt-10"
          >
            Logout
          </button>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-8 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back 👋</h1>
            <p className="text-gray-500 mt-2">
              Manage your auctions and track your business performance.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center text-white text-2xl font-bold">
              P
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Statistics */}
          <div id="dashboard" className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            <div className="bg-white rounded-3xl shadow-md p-7 border hover:shadow-xl transition">
              <p className="text-gray-500 text-sm">Active Auctions</p>
              <h2 className="text-5xl font-bold text-amber-600 mt-4">{auctions.length}</h2>
              <p className="text-green-500 mt-3">Live now</p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-7 border hover:shadow-xl transition">
              <p className="text-gray-500 text-sm">Sold Items</p>
              <h2 className="text-5xl font-bold text-green-600 mt-4">0</h2>
              <p className="text-green-500 mt-3">Awaiting sales</p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-7 border hover:shadow-xl transition">
              <p className="text-gray-500 text-sm">Revenue</p>
              <h2 className="text-5xl font-bold text-blue-600 mt-4">₹0</h2>
              <p className="text-green-500 mt-3">Starting out</p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-7 border hover:shadow-xl transition">
              <p className="text-gray-500 text-sm">Seller Rating</p>
              <h2 className="text-5xl font-bold text-purple-600 mt-4">4.8★</h2>
              <p className="text-green-500 mt-3">Excellent rating</p>
            </div>
          </div>

          {/* Earnings Banner */}
          <div id="earnings" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl p-8 mb-10 shadow-lg">
            <h2 className="text-2xl font-bold">Total Earnings</h2>
            <h1 className="text-6xl font-bold mt-4">₹0</h1>
            <p className="mt-4 text-lg">Start listing items to earn</p>
          </div>

          {/* Create Auction */}
          <div id="create-auction" className="bg-white rounded-3xl shadow-md p-8 mb-10">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Create New Auction</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold">Item Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Vintage Watch"
                  className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">Starting Price</label>
                <input
                  type="number"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  placeholder="50000"
                  className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Watches"
                  className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
  <label className="block mb-2 font-semibold">
    Auction Start Time
  </label>

  <input
    type="datetime-local"
    value={startTime}
    onChange={(e) => setStartTime(e.target.value)}
    className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none"
  />
</div>

<div>
  <label className="block mb-2 font-semibold">
    Auction End Time
  </label>

  <input
    type="datetime-local"
    value={endTime}
    onChange={(e) => setEndTime(e.target.value)}
    className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none"
  />
</div>

              <div className="md:col-span-2">
                <label className="block mb-2 font-semibold">Description</label>
                <textarea
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your item..."
                  className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none"
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 font-semibold">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleCreateAuction}
              className="mt-8 bg-amber-600 text-white px-10 py-4 rounded-xl font-semibold hover:bg-amber-700 transition"
            >
              Create Auction
            </button>
          </div>

          {/* Active Auctions */}
          <div id="active-auctions" className="bg-white rounded-3xl shadow-md p-8 mb-10">
            <h2 className="text-3xl font-bold mb-8">Active Auctions</h2>

            {error && <p className="mb-4 text-red-600">{error}</p>}

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                <p className="text-gray-500">Loading auctions...</p>
              ) : auctions.length > 0 ? (
                auctions.map((auction) => (
                  <div
                    key={auction.id}
                    className="bg-gray-50 rounded-2xl overflow-hidden border hover:shadow-xl transition"
                  >
                    <div className="h-48 bg-gray-300" />

                    <div className="p-5">
                      <h3 className="text-xl font-bold">{auction.title}</h3>
                      <p className="text-gray-500 mt-2">
                        Current Bid: ₹{auction.currentBid ?? auction.startingPrice}
                      </p>

                      <div className="flex justify-between items-center mt-5">
                        <span className="text-green-600 font-semibold">{auction.status || "Active"}</span>
                        <button className="text-amber-600 font-semibold">View Details</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No active auctions yet.</p>
              )}
            </div>
          </div>

          {/* Recent Listings */}
          <div id="listings" className="bg-white rounded-3xl shadow-md p-8 mb-10">
            <h2 className="text-3xl font-bold mb-8">Recent Listings</h2>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                <p className="text-gray-500">Loading auctions...</p>
              ) : auctions.length > 0 ? (
                auctions.map((auction) => (
                  <div
                    key={auction.id}
                    className="bg-gray-50 rounded-2xl overflow-hidden border hover:shadow-xl transition"
                  >
                    <div className="h-48 bg-gray-300" />

                    <div className="p-5">
                      <h3 className="text-xl font-bold">{auction.title}</h3>
                      <p className="text-gray-500 mt-2">
                        Current Bid: ₹{auction.currentBid ?? auction.startingPrice}
                      </p>

                      <div className="flex justify-between items-center mt-5">
                        <span className="text-green-600 font-semibold">{auction.status || "Active"}</span>
                        <button className="text-amber-600 font-semibold">View Details</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No auctions yet. Create your first one above.</p>
              )}
            </div>
          </div>

          {/* Profile */}
          <div id="profile" className="bg-white rounded-3xl shadow-md p-8">
            <h2 className="text-3xl font-bold mb-6">Seller Profile</h2>

            <div className="grid md:grid-cols-2 gap-6 text-lg">
              <p><strong>Name:</strong> {sellerName}</p>
              <p><strong>Email:</strong> {sellerEmail}</p>
              <p><strong>Phone:</strong> {sellerPhone}</p>
              <p><strong>Member Since:</strong> 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}