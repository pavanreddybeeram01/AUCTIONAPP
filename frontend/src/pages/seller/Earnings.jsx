import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

export default function Earnings() {
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
        setError("Unable to load earnings summary.");
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

  const totalRevenue = auctions.reduce((sum, auction) => sum + Number(auction.currentBid ?? auction.startingPrice ?? 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
            <p className="mt-2 text-gray-600">Track your revenue and payment summaries.</p>
          </div>
          <Link to="/seller/dashboard" className="text-sm font-semibold text-gray-900">Back to dashboard</Link>
        </div>

        {error && <p className="mb-4 text-gray-700">{error}</p>}

        <div className="mb-6 rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
          <p className="text-sm text-gray-500">Estimated revenue from current listings</p>
          <h2 className="mt-2 text-4xl font-bold text-gray-900">₹{loading ? "..." : totalRevenue}</h2>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading earnings data...</p>
        ) : (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">Listing summary</h3>
            <div className="mt-4 space-y-3">
              {auctions.map((auction) => (
                <div key={auction.id} className="flex items-center justify-between rounded-2xl bg-gray-50 p-3">
                  <span className="text-gray-700">{auction.title}</span>
                  <span className="font-semibold text-gray-900">₹{auction.currentBid ?? auction.startingPrice ?? 0}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
