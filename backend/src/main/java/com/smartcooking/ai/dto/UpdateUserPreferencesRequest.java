package com.smartcooking.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserPreferencesRequest {
    private String languagePreference;
    private String region;
    private List<String> cuisinePreferences;
    private List<String> dietaryRestrictions;
    private String spiceTolerance;
}
