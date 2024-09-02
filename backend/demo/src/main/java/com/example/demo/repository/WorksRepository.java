package com.example.demo.repository;

import com.example.demo.model.WorksEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorksRepository extends JpaRepository<WorksEntity, Long> {
    void deleteByNameAndUid(String name, String uid);
    WorksEntity findByUidAndName(String uid, String name);
}
