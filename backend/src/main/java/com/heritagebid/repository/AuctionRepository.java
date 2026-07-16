package com.heritagebid.repository;

import com.heritagebid.entity.Auction;
import com.heritagebid.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuctionRepository
        extends JpaRepository<Auction, Long> {

    List<Auction> findBySeller(User seller);

    List<Auction> findByStatus(String status);
}