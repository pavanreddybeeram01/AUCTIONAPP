package com.heritagebid.controller;

import com.heritagebid.dto.BidRequest;
import com.heritagebid.entity.Bid;
import com.heritagebid.service.BidService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bids")
@CrossOrigin(origins = "http://localhost:3000")
public class BidController {

    private final BidService bidService;

    public BidController(BidService bidService) {
        this.bidService = bidService;
    }

    @PostMapping("/place")
    public String placeBid(
            @RequestBody BidRequest request) {

        return bidService.placeBid(request);
    }

    @GetMapping("/auction/{auctionId}")
    public List<Bid> getAuctionBids(
            @PathVariable Long auctionId) {

        return bidService.getAuctionBids(auctionId);
    }
}