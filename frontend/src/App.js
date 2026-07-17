import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import SellerDashboard from "./pages/seller/SellerDashboard";
import CreateAuction from "./pages/seller/CreateAuction";
import ManageListings from "./pages/seller/ManageListings";
import ActiveAuctions from "./pages/seller/ActiveAuctions";
import SoldItems from "./pages/seller/SoldItems";
import BidManagement from "./pages/seller/BidManagement";
import Earnings from "./pages/seller/Earnings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AuctionApproval from "./pages/admin/AuctionApproval";
import Reports from "./pages/admin/Reports";
import Disputes from "./pages/admin/Disputes";
import AuctionDetails from "./pages/AuctionDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/create-auction" element={<CreateAuction />} />
        <Route path="/seller/manage-listings" element={<ManageListings />} />
        <Route path="/seller/active-auctions" element={<ActiveAuctions />} />
        <Route path="/seller/sold-items" element={<SoldItems />} />
        <Route path="/seller/bid-management" element={<BidManagement />} />
        <Route path="/seller/earnings" element={<Earnings />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/approvals" element={<AuctionApproval />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/disputes" element={<Disputes />} />
        <Route path="/auction/:id" element={<AuctionDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;