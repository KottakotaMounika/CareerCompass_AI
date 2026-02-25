package com.mounika.careerai.controller;

import org.springframework.web.bind.annotation.*;
import com.mounika.careerai.model.User;
import com.mounika.careerai.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserRepository userRepository;

    // Constructor Injection (Manual)
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }
}