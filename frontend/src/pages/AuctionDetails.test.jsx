import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AuctionDetails from "./AuctionDetails";
import API from "../services/api";

jest.mock("../services/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe("AuctionDetails", () => {
  it("disables bidding once an auction has ended", async () => {
    API.get.mockImplementation((url) => {
      if (url === "/auctions/1") {
        return Promise.resolve({
          data: {
            id: 1,
            title: "Vintage Watch",
            description: "A rare vintage watch",
            status: "ENDED",
            currentBid: 1200,
            startingPrice: 1000,
            imageUrl: "",
          },
        });
      }

      if (url === "/bids/auction/1") {
        return Promise.resolve({ data: [] });
      }

      return Promise.reject(new Error("Unexpected URL"));
    });

    render(
      <MemoryRouter initialEntries={["/auction/1"]}>
        <Routes>
          <Route path="/auction/:id" element={<AuctionDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/bidding closed/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your bid amount/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /place bid/i })).toBeDisabled();
  });
});
