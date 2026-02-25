package com.mounika.careerai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mounika.careerai.model.Career;

public interface CareerRepository extends JpaRepository<Career, Long> {
}