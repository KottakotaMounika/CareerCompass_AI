package com.mounika.careerai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mounika.careerai.model.Option;

public interface OptionRepository extends JpaRepository<Option, Long> {
}