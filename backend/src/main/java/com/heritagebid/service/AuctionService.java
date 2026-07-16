package com.heritagebid.service;

import com.heritagebid.dto.AuctionRequest;
import com.heritagebid.entity.Auction;
import com.heritagebid.entity.User;
import com.heritagebid.repository.AuctionRepository;
import com.heritagebid.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuctionService {

    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;

    public AuctionService(
            AuctionRepository auctionRepository,
            UserRepository userRepository) {

        this.auctionRepository = auctionRepository;
        this.userRepository = userRepository;
    }

    public Auction createAuction(AuctionRequest request) {

        User seller = userRepository.findById(request.getSellerId())
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new RuntimeException(
                    "End time must be after start time");
        }

        Auction auction = Auction.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .startingPrice(request.getStartingPrice())
                .imageUrl(request.getImageUrl())
                .seller(seller)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .currentBid(request.getStartingPrice())
                .status("ACTIVE")
                .build();

        return auctionRepository.save(auction);
    }

    public List<Auction> getAllAuctions() {
        return auctionRepository.findAll();
    }

    public List<Auction> getSellerAuctions(Long sellerId) {

        User seller = userRepository.findById(sellerId)
                .orElseThrow(() ->
                        new RuntimeException("Seller not found"));

        return auctionRepository.findBySeller(seller);
    }

    public Auction getAuctionById(Long id) {

        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Auction not found"));

        if (auction.getStatus().equals("ACTIVE") &&
                LocalDateTime.now().isAfter(auction.getEndTime())) {

            auction.setStatus("ENDED");
            auctionRepository.save(auction);
        }

        return auction;
    }

    public List<Auction> getActiveAuctions() {
        return auctionRepository.findByStatus("ACTIVE");
    }
}