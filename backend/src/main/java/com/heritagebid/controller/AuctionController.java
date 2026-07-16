package com.heritagebid.controller;

import com.heritagebid.dto.AuctionRequest;
import com.heritagebid.entity.Auction;
import com.heritagebid.service.AuctionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auctions")
@CrossOrigin(origins = "http://localhost:3000")
public class AuctionController {

    private final AuctionService auctionService;

    public AuctionController(AuctionService auctionService) {
        this.auctionService = auctionService;
    }

    @PostMapping("/create")
    public Auction createAuction(
            @RequestBody AuctionRequest request) {

        return auctionService.createAuction(request);
    }

    @GetMapping
    public List<Auction> getAllAuctions() {
        return auctionService.getAllAuctions();
    }

    @GetMapping("/{id}")
    public Auction getAuctionById(
            @PathVariable Long id) {

        return auctionService.getAuctionById(id);
    }

    @GetMapping("/seller/{sellerId}")
    public List<Auction> getSellerAuctions(
            @PathVariable Long sellerId) {

        return auctionService.getSellerAuctions(sellerId);
    }

    @GetMapping("/active")
    public List<Auction> getActiveAuctions() {
        return auctionService.getActiveAuctions();
    }
}