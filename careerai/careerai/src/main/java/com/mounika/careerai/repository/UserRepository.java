package com.mounika.careerai.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mounika.careerai.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    // 🔥 Required for login & registration validation
    Optional<User> findByUsername(String username);
}