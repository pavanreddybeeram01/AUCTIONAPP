import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

export default function Wishlist() {
  const [wishlistAuctions, setWishlistAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const userId = Number(localStorage.getItem("userId"));
        const storageKey = userId ? `buyerWishlist-${userId}` : "buyerWishlist";
        const savedWishlist = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const ids = Array.isArray(savedWishlist) ? savedWishlist : [];

        if (ids.length === 0) {
          setWishlistAuctions([]);
          setLoading(false);
          return;
        }

        const response = await API.get("/auctions");
        const allAuctions = response.data || [];
        const matchedAuctions = allAuctions.filter((auction) => ids.includes(Number(auction.id)));

        setWishlistAuctions(matchedAuctions);
      } catch (err) {
        console.error(err);
        setWishlistAuctions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
      <h2 className="mb-6 text-3xl font-bold text-gray-900">Wishlist</h2>

      {loading ? (
        <p className="text-gray-500">Loading saved auctions...</p>
      ) : wishlistAuctions.length === 0 ? (
        <p className="text-gray-500">Saved auctions will appear here.</p>
      ) : (
        <div className="space-y-4">
          {wishlistAuctions.map((auction) => (
            <div key={auction.id} className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="font-semibold text-gray-900">{auction.title}</p>
              <p className="mt-1 text-sm text-gray-500">Current bid: ₹{auction.currentBid ?? auction.startingPrice ?? 0}</p>
              <Link to={`/auction/${auction.id}`} className="mt-2 inline-block text-gray-900 underline-offset-2 hover:underline">
                View auction details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
