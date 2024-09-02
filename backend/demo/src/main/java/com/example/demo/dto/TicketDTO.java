package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TicketDTO {

    private Long ticketId;

    private String uid;
    private String title;
    private Boolean flag;
    private String response;
    private String description;
    private String fileName;
    private String date;

}
