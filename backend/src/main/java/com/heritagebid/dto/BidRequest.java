package com.heritagebid.dto;

import lombok.Data;

@Data
public class BidRequest {

    private Long auctionId;
    private Long buyerId;
    private Double amount;

}