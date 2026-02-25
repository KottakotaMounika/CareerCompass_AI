package com.mounika.careerai.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.mounika.careerai.model.Career;
import com.mounika.careerai.repository.CareerRepository;

@RestController
@RequestMapping("/api/careers")
@CrossOrigin
public class CareerController {

    private final CareerRepository careerRepository;

    public CareerController(CareerRepository careerRepository) {
        this.careerRepository = careerRepository;
    }

    @PostMapping
    public Career createCareer(@RequestBody Career career) {
        return careerRepository.save(career);
    }

    @GetMapping
    public List<Career> getAllCareers() {
        return careerRepository.findAll();
    }
}