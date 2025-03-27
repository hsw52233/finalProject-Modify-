package com.example.academy.restcontroller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/restapi/port")
public class PortRestController {

    @Value("${custom.location}")
    private String location;

    @Value("${custom.port}")
    private int port;

    @GetMapping
    public Map<String, Object> getConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("location", location);
        config.put("port", port);
        return config;
    }
}