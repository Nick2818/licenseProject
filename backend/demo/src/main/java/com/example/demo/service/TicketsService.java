package com.example.demo.service;

import com.example.demo.model.TicketEntity;
import org.springframework.http.ResponseEntity;
import java.util.List;

public interface TicketsService {

    ResponseEntity<List<TicketEntity>> getAllTicketsByUid (String uid);
    ResponseEntity<List<TicketEntity>> getAllTickets ();
    ResponseEntity<String> deleteTicketByTicketId(Long ticketId);
    ResponseEntity<Integer> getSolvedTickets(String uid);
    ResponseEntity<Integer> getUnsolvedTickets(String uid);
    ResponseEntity<String> setTicketResponse(Long ticketId, String uid, String response);
}
