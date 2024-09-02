package com.example.demo.service.implementation;

import com.example.demo.model.TicketEntity;
import com.example.demo.repository.TicketRepository;
import com.example.demo.service.TicketsService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class TicketsServiceImpl implements TicketsService {

    public final TicketRepository ticketRepository;

    public TicketsServiceImpl(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    //Service Implementation
    @Override
    public ResponseEntity<List<TicketEntity>> getAllTicketsByUid(String uid) {
        return ResponseEntity.ok(ticketRepository.findAllByUid(uid));
    }

    @Override
    public ResponseEntity<List<TicketEntity>> getAllTickets() {
        return ResponseEntity.ok(ticketRepository.findAll());
    }

    @Override
    @Transactional
    public ResponseEntity<String> deleteTicketByTicketId(Long ticketId) {
        ticketRepository.deleteByTicketId(ticketId);

        return ResponseEntity.ok("Ticket deleted successfully.");
    }

    @Override
    public ResponseEntity<Integer> getSolvedTickets(String uid) {
        int solved = 0;

        List<TicketEntity> tickets = new ArrayList<>(ticketRepository.findAllByUid(uid));

        for ( TicketEntity te : tickets ) {
            if (te.getFlag()) {
                solved++;
            }
        }

        return ResponseEntity.ok(solved);
    }

    @Override
    public ResponseEntity<Integer> getUnsolvedTickets(String uid) {
        int unsolved = 0;

        List<TicketEntity> tickets = new ArrayList<>(ticketRepository.findAllByUid(uid));

        for ( TicketEntity te : tickets ) {
            if (!te.getFlag()) {
                unsolved++;
            }
        }

        return ResponseEntity.ok(unsolved);
    }

    //Service Implementation
    @Override
    @Transactional
    public ResponseEntity<String> setTicketResponse(Long ticketId, String uid, String response) {
        TicketEntity ticketEntity = ticketRepository.findTicketEntityByTicketIdAndUid(ticketId, uid);

        ticketEntity.setResponse(response);
        ticketEntity.setFlag(true);

        ticketRepository.save(ticketEntity);

        return ResponseEntity.ok("Response saved successfully for the ticket.");
    }
}
