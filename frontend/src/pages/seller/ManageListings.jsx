import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

export default function ManageListings() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const sellerId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await API.get(`/auctions/seller/${sellerId}`);
        setAuctions(response.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load your listings.");
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      fetchAuctions();
    } else {
      setError("Please log in as a seller first.");
      setLoading(false);
    }
  }, [sellerId]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Listings</h1>
            <p className="mt-2 text-gray-600">Review and organize your auction listings.</p>
          </div>
          <Link to="/seller/dashboard" className="text-sm font-semibold text-gray-900">Back to dashboard</Link>
        </div>

        {error && <p className="mb-4 text-gray-700">{error}</p>}

        {loading ? (
          <p className="text-gray-500">Loading listings...</p>
        ) : auctions.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm">No listings found.</div>
        ) : (
          <div className="space-y-4">
            {auctions.map((auction) => (
              <div key={auction.id} className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{auction.title}</h2>
                    <p className="text-sm text-gray-500">{auction.category}</p>
                  </div>
                  <p className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">{auction.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
