package com.smartcooking.ai.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleMapsService {
    
    private final RestTemplate restTemplate;
    
    @Value("${app.google.maps.api-key}")
    private String googleMapsApiKey;
    
    private static final String GEOCODING_URL = "https://maps.googleapis.com/maps/api/geocode/json";
    private static final String PLACES_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
    private static final String PLACES_TEXT_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json";
    
    /**
     * Reverse geocoding - convert coordinates to address
     */
    public Map<String, Object> reverseGeocode(double latitude, double longitude) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(GEOCODING_URL)
                .queryParam("latlng", latitude + "," + longitude)
                .queryParam("key", googleMapsApiKey)
                .queryParam("language", "vi")
                .build()
                .toUriString();
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            log.info("Reverse geocoding successful for coordinates: {},{}", latitude, longitude);
            return response;
            
        } catch (Exception e) {
            log.error("Error in reverse geocoding: {}", e.getMessage());
            return Map.of(
                "status", "ERROR",
                "error", "Failed to reverse geocode coordinates"
            );
        }
    }
    
    /**
     * Forward geocoding - convert address to coordinates
     */
    public Map<String, Object> geocode(String address) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(GEOCODING_URL)
                .queryParam("address", address)
                .queryParam("key", googleMapsApiKey)
                .queryParam("language", "vi")
                .build()
                .toUriString();
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            log.info("Geocoding successful for address: {}", address);
            return response;
            
        } catch (Exception e) {
            log.error("Error in geocoding: {}", e.getMessage());
            return Map.of(
                "status", "ERROR",
                "error", "Failed to geocode address"
            );
        }
    }
    
    /**
     * Find nearby stores/supermarkets
     */
    public Map<String, Object> findNearbyStores(double latitude, double longitude, int radius, String type) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(PLACES_URL)
                .queryParam("location", latitude + "," + longitude)
                .queryParam("radius", radius)
                .queryParam("type", type != null ? type : "supermarket")
                .queryParam("key", googleMapsApiKey)
                .queryParam("language", "vi")
                .build()
                .toUriString();
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            log.info("Found nearby stores for coordinates: {},{}", latitude, longitude);
            return response;
            
        } catch (Exception e) {
            log.error("Error finding nearby stores: {}", e.getMessage());
            return Map.of(
                "status", "ERROR",
                "error", "Failed to find nearby stores"
            );
        }
    }
    
    /**
     * Search places by text query
     */
    public Map<String, Object> searchPlaces(String query, String region) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(PLACES_TEXT_SEARCH_URL)
                .queryParam("query", query)
                .queryParam("region", region != null ? region : "vn")
                .queryParam("key", googleMapsApiKey)
                .queryParam("language", "vi")
                .build()
                .toUriString();
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            log.info("Places search successful for query: {}", query);
            return response;
            
        } catch (Exception e) {
            log.error("Error in places search: {}", e.getMessage());
            return Map.of(
                "status", "ERROR",
                "error", "Failed to search places"
            );
        }
    }
    
    /**
     * Get regional suggestions based on location
     */
    public Map<String, Object> getRegionalSuggestions(double latitude, double longitude) {
        try {
            // First get the address to determine region
            Map<String, Object> geocodeResponse = reverseGeocode(latitude, longitude);
            
            // Analyze location to determine Vietnamese region
            String region = determineVietnameseRegion(latitude, longitude);
            
            // Get regional food suggestions
            List<String> suggestions = getRegionalFoodSuggestions(region);
            
            return Map.of(
                "success", true,
                "region", region,
                "suggestions", suggestions,
                "location", Map.of("latitude", latitude, "longitude", longitude),
                "geocode_info", geocodeResponse
            );
            
        } catch (Exception e) {
            log.error("Error getting regional suggestions: {}", e.getMessage());
            return Map.of(
                "success", false,
                "error", "Failed to get regional suggestions"
            );
        }
    }
    
    private String determineVietnameseRegion(double latitude, double longitude) {
        // Vietnam region detection based on coordinates
        if (latitude > 20.0) {
            return "mien_bac"; // Northern Vietnam
        } else if (latitude > 16.0) {
            return "mien_trung"; // Central Vietnam  
        } else {
            return "mien_nam"; // Southern Vietnam
        }
    }
    
    private List<String> getRegionalFoodSuggestions(String region) {
        switch (region) {
            case "mien_bac":
                return List.of("Phở Hà Nội", "Bún chả", "Chả cá Lã Vọng", "Bánh cuốn", "Nem cua bể");
            case "mien_trung":
                return List.of("Bún bò Huế", "Mì Quảng", "Cao lầu", "Bánh khoái", "Nem lụi");
            case "mien_nam":
                return List.of("Bánh xèo", "Hủ tiếu", "Bún thịt nướng", "Chè ba màu", "Bánh mì Sài Gòn");
            default:
                return List.of("Phở", "Bánh mì", "Gỏi cuốn", "Chả giò");
        }
    }
}