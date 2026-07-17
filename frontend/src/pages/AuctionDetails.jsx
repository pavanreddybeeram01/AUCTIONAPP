import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function AuctionDetails() {
  const { id } = useParams();

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bidAmount, setBidAmount] = useState("");

  const isAuctionEnded = useCallback(() => {
    if (!auction) return false;

    const status = (auction.status || "").toUpperCase();
    const endTime = auction.endTime || auction.endDate || auction.endsAt;

    return status === "ENDED" || (endTime && new Date(endTime) <= new Date());
  }, [auction]);

  const fetchAuction = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch auction details
      const auctionResponse = await API.get(`/auctions/${id}`);

      setAuction(auctionResponse.data);

      // Fetch bid history
      const bidResponse = await API.get(`/bids/auction/${id}`);

      setBids(bidResponse.data);
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(
          `Server Error ${err.response.status}: ${
            err.response.data.message || err.response.data
          }`
        );
      } else if (err.request) {
        setError("Cannot connect to backend server.");
      } else {
        setError("Failed to fetch auction details.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchAuction();
    }
  }, [fetchAuction, id]);

  const placeBid = async () => {
    if (isAuctionEnded()) {
      alert("Bidding is closed for this auction.");
      return;
    }

    if (!bidAmount) {
      alert("Please enter a bid amount.");
      return;
    }

    if (
      Number(bidAmount) <=
      (auction.currentBid ?? auction.startingPrice ?? 0)
    ) {
      alert("Bid amount must be greater than the current bid.");
      return;
    }

    try {
      await API.post("/bids/place", {
        auctionId: auction.id,
        buyerId: Number(localStorage.getItem("userId")), // Replace with logged-in user id later
        amount: Number(bidAmount),
      });

      alert("Bid placed successfully!");

      setBidAmount("");

      // Refresh auction and bids
      fetchAuction();
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data);
      } else {
        alert("Failed to place bid.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl">
        Loading auction details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600 text-xl">
        {error}
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Auction not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">

        {/* Image */}
        <div className="h-72 bg-gray-200 flex items-center justify-center text-gray-500 text-2xl">
          {auction.imageUrl || auction.image ? (
            <img
              src={auction.imageUrl || auction.image}
              alt={auction.title}
              className="w-full h-full object-cover"
            />
          ) : (
            "No Image Available"
          )}
        </div>

        <div className="p-8">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-800">
            {auction.title || "Untitled Auction"}
          </h1>

          {/* Description */}
          <p className="text-gray-600 mt-4 text-lg">
            {auction.description || "No description available."}
          </p>

          {/* Details */}
          <div className="grid md:grid-cols-2 gap-8 mt-8">

            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="text-xl font-semibold">
                {auction.category || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Seller</p>
              <p className="text-xl font-semibold">
                {auction.seller?.fullName ||
                  auction.sellerName ||
                  "Unknown Seller"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Current Bid</p>
              <p className="text-2xl font-bold text-amber-600">
                ₹{auction.currentBid ?? auction.startingPrice ?? 0}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Starting Price</p>
              <p className="text-xl font-semibold">
                ₹{auction.startingPrice ?? 0}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-xl font-semibold text-green-600">
                {auction.status || "ACTIVE"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="text-xl font-semibold">
                {auction.durationDays || 0} Days
              </p>
            </div>

          </div>

          {/* Bid Form */}
          <div className="mt-10">
            {isAuctionEnded() ? (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                Bidding is closed for this auction.
              </div>
            ) : null}

            <input
              type="number"
              placeholder="Enter your bid amount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              disabled={isAuctionEnded()}
              className="w-full border border-gray-300 rounded-xl p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />

            <button
              onClick={placeBid}
              disabled={isAuctionEnded()}
              className="w-full bg-amber-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-amber-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Place Bid
            </button>
          </div>

          {/* Bid History */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Bid History</h2>

            {bids.length === 0 ? (
              <p className="text-gray-500">No bids yet.</p>
            ) : (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <div
                    key={bid.id}
                    className="border rounded-xl p-4 bg-gray-50"
                  >
                    <p>
                      <strong>Buyer:</strong>{" "}
                      {bid.buyer?.fullName || "Unknown Buyer"}
                    </p>

                    <p>
                      <strong>Bid Amount:</strong> ₹
                      {Number(bid.amount).toLocaleString()}
                    </p>

                    <p>
                      <strong>Bid Time:</strong>{" "}
                      {new Date(bid.bidTime).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}