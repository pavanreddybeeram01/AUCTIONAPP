import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

const categories = [
  "Antiques",
  "Paintings",
  "Coins",
  "Watches",
  "Books",
  "Furniture",
  "Sculptures",
  "Stamps",
  "Collectibles",
];

const initialForm = {
  title: "",
  description: "",
  category: "Antiques",
  startingPrice: "",
  imageUrl: "",
  startTime: "",
  endTime: "",
};

export default function CreateAuction() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setFormData((prev) => ({ ...prev, imageUrl: result }));
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sellerId = localStorage.getItem("userId");
    if (!sellerId) {
      alert("Please login as a seller first.");
      navigate("/login");
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      alert("Please select auction start and end time.");
      return;
    }

    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      alert("End time must be after the start time.");
      return;
    }

    try {
      setSubmitting(true);
      await API.post("/auctions/create", {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        startingPrice: Number(formData.startingPrice),
        imageUrl: formData.imageUrl,
        sellerId: Number(sellerId),
        startTime: formData.startTime,
        endTime: formData.endTime,
      });

      alert("Auction created successfully.");
      navigate("/seller/dashboard");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Unable to create auction right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Auction</h1>
            <p className="mt-2 text-gray-500">List a new collectible for bidding.</p>
          </div>
          <Link to="/seller/dashboard" className="text-sm font-semibold text-gray-900">
            Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium text-gray-700">Item Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
              placeholder="e.g. Vintage Rolex Watch"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
              placeholder="Describe the item, condition, history, and authenticity details"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">Starting Price</label>
              <input
                type="number"
                name="startingPrice"
                required
                min="1"
                value={formData.startingPrice}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
                placeholder="1000"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">Choose Auction Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
            />
            {imagePreview ? (
              <img src={imagePreview} alt="Auction preview" className="mt-4 h-48 w-full rounded-2xl object-cover" />
            ) : null}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-gray-700">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                required
                value={formData.startTime}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                required
                value={formData.endTime}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {submitting ? "Creating Auction..." : "Create Auction"}
          </button>
        </form>
      </div>
    </div>
  );
}
