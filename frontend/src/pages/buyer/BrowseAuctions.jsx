import { useEffect, useState } from "react";
import API from "../../services/api";

export default function BrowseAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await API.get("/auctions");
        setAuctions(response.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load auctions.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  return (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
      <h2 className="mb-6 text-3xl font-bold text-gray-900">Browse Auctions</h2>

      {loading ? (
        <p className="text-gray-500">Loading auctions...</p>
      ) : error ? (
        <p className="text-gray-700">{error}</p>
      ) : auctions.length === 0 ? (
        <p className="text-gray-500">No auctions available right now.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {auctions.map((auction) => (
            <div key={auction.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">{auction.title}</h3>
              <p className="mt-2 text-gray-600">{auction.description}</p>
              <p className="mt-3 text-sm text-gray-500">Category: {auction.category}</p>
              <p className="mt-2 font-semibold text-gray-900">Current Bid: ₹{auction.currentBid ?? auction.startingPrice ?? 0}</p>
              <p className="mt-2 text-sm text-gray-600">{auction.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
