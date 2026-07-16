package com.heritagebid.service;

import com.heritagebid.dto.BidRequest;
import com.heritagebid.entity.Auction;
import com.heritagebid.entity.Bid;
import com.heritagebid.entity.User;
import com.heritagebid.repository.AuctionRepository;
import com.heritagebid.repository.BidRepository;
import com.heritagebid.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BidService {

    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;

    public BidService(
            BidRepository bidRepository,
            AuctionRepository auctionRepository,
            UserRepository userRepository) {

        this.bidRepository = bidRepository;
        this.auctionRepository = auctionRepository;
        this.userRepository = userRepository;
    }

    public String placeBid(BidRequest request) {

        Auction auction = auctionRepository.findById(
                request.getAuctionId())
                .orElseThrow(() ->
                        new RuntimeException("Auction not found"));

        User buyer = userRepository.findById(
                request.getBuyerId())
                .orElseThrow(() ->
                        new RuntimeException("Buyer not found"));

        if (request.getAmount() <= auction.getCurrentBid()) {
            throw new RuntimeException(
                    "Bid must be greater than current bid");
        }

        Bid bid = Bid.builder()
                .amount(request.getAmount())
                .buyer(buyer)
                .auction(auction)
                .build();

        bidRepository.save(bid);

        auction.setCurrentBid(request.getAmount());
        auctionRepository.save(auction);

        return "Bid placed successfully";
    }

    public List<Bid> getAuctionBids(Long auctionId) {
        return bidRepository.findByAuctionIdOrderByBidTimeDesc(auctionId);
    }
}