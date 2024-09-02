package com.example.demo.repository;

import com.example.demo.model.TicketEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<TicketEntity, String> {

    List<TicketEntity> findAllByUid(String uid);

    void deleteByTicketId(Long ticketId);

    TicketEntity findTicketEntityByTicketIdAndUid(Long ticketId, String uid);
}
