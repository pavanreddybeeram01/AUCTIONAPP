package com.heritagebid.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AuctionRequest {

    private String title;

    private String description;

    private String category;

    private Double startingPrice;

    private String imageUrl;

    private Long sellerId;

    private LocalDateTime startTime;

    private LocalDateTime endTime;
}