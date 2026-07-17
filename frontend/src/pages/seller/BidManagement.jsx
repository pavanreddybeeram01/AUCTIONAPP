import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

export default function BidManagement() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const sellerId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchBidData = async () => {
      try {
        const response = await API.get(`/auctions/seller/${sellerId}`);
        const sellerAuctions = response.data || [];
        const bidsWithAuctions = await Promise.all(
          sellerAuctions.map(async (auction) => {
            const bidResponse = await API.get(`/bids/auction/${auction.id}`);
            return { ...auction, bids: bidResponse.data || [] };
          })
        );
        setAuctions(bidsWithAuctions);
      } catch (err) {
        console.error(err);
        setError("Unable to load bid activity.");
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      fetchBidData();
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
            <h1 className="text-3xl font-bold text-gray-900">Bid Management</h1>
            <p className="mt-2 text-gray-600">Monitor incoming bids and respond to activity.</p>
          </div>
          <Link to="/seller/dashboard" className="text-sm font-semibold text-gray-900">Back to dashboard</Link>
        </div>

        {error && <p className="mb-4 text-gray-700">{error}</p>}

        {loading ? (
          <p className="text-gray-500">Loading bid activity...</p>
        ) : auctions.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm">No auctions found.</div>
        ) : (
          <div className="space-y-4">
            {auctions.map((auction) => (
              <div key={auction.id} className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">{auction.title}</h2>
                  <span className="text-sm text-gray-500">{auction.bids.length} bid(s)</span>
                </div>
                {auction.bids.length === 0 ? (
                  <p className="text-gray-500">No bids yet.</p>
                ) : (
                  <div className="space-y-2">
                    {auction.bids.slice(0, 5).map((bid) => (
                      <div key={bid.id} className="rounded-2xl bg-gray-50 p-3">
                        <p className="font-semibold text-gray-900">₹{bid.amount}</p>
                        <p className="text-sm text-gray-500">Buyer: {bid.buyer?.fullName || "Unknown"}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
