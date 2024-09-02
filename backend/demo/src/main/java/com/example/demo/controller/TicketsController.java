package com.example.demo.controller;

import com.example.demo.model.TicketEntity;
import com.example.demo.service.TicketsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Controller
@RequestMapping("/api/tickets")
public class TicketsController {

    private final TicketsService ticketsService;

    public TicketsController (TicketsService ticketsService) {
        this.ticketsService = ticketsService;
    }


    @GetMapping("/get/{uid}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<TicketEntity>> getAllTicketsByUid (@PathVariable String uid) {
        return ticketsService.getAllTicketsByUid(uid);
    }

    //Controller
    @GetMapping("/getAll")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<TicketEntity>> getAllTickets () {
        return ticketsService.getAllTickets();
    }


    @DeleteMapping("/delete/{ticketId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> deleteTicketByTicketId(@PathVariable Long ticketId) {
        return ticketsService.deleteTicketByTicketId(ticketId);
    }

    @GetMapping("/get/solved/{uid}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Integer> getSolvedTickets(@PathVariable String uid) {
        return ticketsService.getSolvedTickets(uid);
    }

    @GetMapping("/get/unsolved/{uid}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Integer> getUnsolvedTickets(@PathVariable String uid) {
       return ticketsService.getUnsolvedTickets(uid);
    }

    //Controller
    @PostMapping("/set")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> setTicketResponse(@RequestParam("ticketId") Long ticketId, @RequestParam("uid") String uid, @RequestParam("response") String response){
        return ticketsService.setTicketResponse(ticketId, uid, response);
    }
}
