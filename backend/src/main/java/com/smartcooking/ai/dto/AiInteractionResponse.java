package com.smartcooking.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiInteractionResponse {
    private Long id;
    private String interactionType;
    private String inputData;
    private String outputData;
    private String language;
    private Long processingTimeMs;
    private LocalDateTime createdAt;
}
