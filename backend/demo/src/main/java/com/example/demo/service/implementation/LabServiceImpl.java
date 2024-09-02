package com.example.demo.service.implementation;

import com.example.demo.model.TicketEntity;
import com.example.demo.repository.TicketRepository;
import com.example.demo.service.LabService;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.util.HashMap;
import java.util.UUID;

@Service
public class LabServiceImpl implements LabService {

    private final TicketRepository ticketRepository;

    public LabServiceImpl(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @Override
    public ResponseEntity<String> uploadFile(MultipartFile file, String description, String uid, String zoneName, String title, String date) {
        try {

            HashMap<String, String> metadata = new HashMap<>();
            metadata.put("description", description);
            metadata.put("userID", uid);
            metadata.put("ZoneName", zoneName);
            String fileName = UUID.randomUUID() + file.getOriginalFilename();
            String path = uid + "/" + fileName;
            BlobId blobId = BlobId.of("silicon-data-398115.appspot.com", path);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                    .setContentType(file.getContentType())
                    .setMetadata(metadata)
                    .build();


            TicketEntity ticket = new TicketEntity();
            ticket.setUid(uid);
            ticket.setTitle(title);
            ticket.setFlag(false);
            ticket.setResponse("Waiting for the response...");
            ticket.setDescription(description);
            ticket.setPath(path);
            ticket.setZoneName(zoneName);
            ticket.setDate(date);

            ticketRepository.save(ticket);

            FileInputStream serviceAccountStream = new FileInputStream("demo/src/main/resources/serviceAccountKey.json");
            GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccountStream);
            StorageOptions storageOptions = StorageOptions.newBuilder().setCredentials(credentials).build();
            Storage storage = storageOptions.getService();

            storage.create(blobInfo, file.getBytes());

            return ResponseEntity.ok("Uploaded!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
