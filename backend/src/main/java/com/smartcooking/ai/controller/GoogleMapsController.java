package com.smartcooking.ai.controller;

import com.smartcooking.ai.service.GoogleMapsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/maps")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:49442"})
public class GoogleMapsController {
    
    private final GoogleMapsService googleMapsService;
    
    @GetMapping("/geocode")
    public ResponseEntity<Map<String, Object>> geocode(@RequestParam String address) {
        Map<String, Object> result = googleMapsService.geocode(address);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/reverse-geocode")
    public ResponseEntity<Map<String, Object>> reverseGeocode(
            @RequestParam double lat,
            @RequestParam double lng) {
        Map<String, Object> result = googleMapsService.reverseGeocode(lat, lng);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/nearby-stores")
    public ResponseEntity<Map<String, Object>> findNearbyStores(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "2000") int radius,
            @RequestParam(defaultValue = "supermarket") String type) {
        Map<String, Object> result = googleMapsService.findNearbyStores(lat, lng, radius, type);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/search-places")
    public ResponseEntity<Map<String, Object>> searchPlaces(
            @RequestParam String query,
            @RequestParam(defaultValue = "vn") String region) {
        Map<String, Object> result = googleMapsService.searchPlaces(query, region);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/regional-suggestions")
    public ResponseEntity<Map<String, Object>> getRegionalSuggestions(
            @RequestParam double lat,
            @RequestParam double lng) {
        Map<String, Object> result = googleMapsService.getRegionalSuggestions(lat, lng);
        return ResponseEntity.ok(result);
    }
}