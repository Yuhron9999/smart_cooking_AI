package com.smartcooking.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.smartcooking.ai.dto.AiGenerationRequestDTO;
import com.smartcooking.ai.dto.AiGenerationResponseDTO;
import com.smartcooking.ai.dto.UserPreferenceDTO;
import com.smartcooking.ai.entity.UserAiInteraction;
import com.smartcooking.ai.repository.UserAiInteractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Service để tạo nội dung bằng AI và lưu lịch sử tương tác
 */
@Service
@RequiredArgsConstructor
public class AiGenerationService {

    private final UserAiInteractionRepository aiInteractionRepository;
    private final UserPreferenceService userPreferenceService;
    private final ObjectMapper objectMapper;

    // Thông thường sẽ inject một AI Service client thực tế ở đây
    // private final OpenAiClient openAiClient;
    // private final GoogleGeminiClient geminiClient;

    /**
     * Tạo nội dung bằng AI dựa trên yêu cầu và tùy chọn người dùng
     */
    @Transactional
    public AiGenerationResponseDTO generateContent(AiGenerationRequestDTO request) {
        long startTime = System.currentTimeMillis();
        UserAiInteraction.AIType aiType = determineAiType(request.getAiModel());

        // Bổ sung prompt với tùy chọn người dùng nếu cần
        String enhancedPrompt = enhancePromptWithUserPreferences(request);

        try {
            // Gọi dịch vụ AI thích hợp (mock cho mục đích demo)
            AiGenerationResponseDTO response = mockAiResponse(request, enhancedPrompt);

            // Tính thời gian xử lý
            int processingTime = (int) (System.currentTimeMillis() - startTime);
            response.setProcessingTimeMs(processingTime);

            // Lưu tương tác AI vào cơ sở dữ liệu
            saveAiInteraction(request.getUserId(),
                    enhancedPrompt,
                    response.getContent(),
                    aiType,
                    response.getTokensUsed(),
                    processingTime,
                    true,
                    null,
                    createMetadata(request, response));

            return response;
        } catch (Exception e) {
            // Xử lý lỗi và lưu thông tin lỗi vào cơ sở dữ liệu
            AiGenerationResponseDTO errorResponse = AiGenerationResponseDTO.builder()
                    .success(false)
                    .errorMessage(e.getMessage())
                    .processingTimeMs((int) (System.currentTimeMillis() - startTime))
                    .build();

            saveAiInteraction(request.getUserId(),
                    enhancedPrompt,
                    "Error: " + e.getMessage(),
                    aiType,
                    0,
                    errorResponse.getProcessingTimeMs(),
                    false,
                    e.getMessage(),
                    createMetadata(request, null));

            return errorResponse;
        }
    }

    /**
     * Xác định loại AI từ tên model
     */
    private UserAiInteraction.AIType determineAiType(String aiModel) {
        if (aiModel == null) {
            return UserAiInteraction.AIType.GPT;
        }

        if (aiModel.toLowerCase().contains("gpt")) {
            return UserAiInteraction.AIType.GPT;
        } else if (aiModel.toLowerCase().contains("gemini")) {
            return UserAiInteraction.AIType.GEMINI;
        } else if (aiModel.toLowerCase().contains("voice")) {
            return UserAiInteraction.AIType.VOICE;
        } else if (aiModel.toLowerCase().contains("vision")) {
            return UserAiInteraction.AIType.VISION;
        }

        return UserAiInteraction.AIType.GPT;
    }

    /**
     * Bổ sung prompt với tùy chọn người dùng
     */
    private String enhancePromptWithUserPreferences(AiGenerationRequestDTO request) {
        if (!Boolean.TRUE.equals(request.getIncludePreferences())) {
            return request.getPrompt();
        }

        Optional<UserPreferenceDTO> userPreference = userPreferenceService.getUserPreference(request.getUserId());
        if (userPreference.isEmpty()) {
            return request.getPrompt();
        }

        UserPreferenceDTO preferences = userPreference.get();

        StringBuilder enhancedPrompt = new StringBuilder(request.getPrompt());
        enhancedPrompt.append("\n\nThông tin người dùng:");

        // Thêm thông tin về ngôn ngữ
        enhancedPrompt.append("\n- Ngôn ngữ: ").append(preferences.getLanguagePreference());

        // Thêm thông tin về sở thích ẩm thực
        if (preferences.getCuisinePreferences() != null && !preferences.getCuisinePreferences().isEmpty()) {
            enhancedPrompt.append("\n- Sở thích ẩm thực: ")
                    .append(String.join(", ", preferences.getCuisinePreferences()));
        }

        // Thêm thông tin về chế độ ăn
        if (Boolean.TRUE.equals(request.getIncludeDietaryRestrictions()) &&
                preferences.getDietaryPreferences() != null &&
                !preferences.getDietaryPreferences().isEmpty()) {
            enhancedPrompt.append("\n- Chế độ ăn đặc biệt: ")
                    .append(String.join(", ", preferences.getDietaryPreferences()));
        }

        // Thêm thông tin về nguyên liệu yêu thích
        if (preferences.getLikedIngredients() != null && !preferences.getLikedIngredients().isEmpty()) {
            enhancedPrompt.append("\n- Nguyên liệu yêu thích: ")
                    .append(String.join(", ", preferences.getLikedIngredients()));
        }

        // Thêm thông tin về nguyên liệu không thích
        if (preferences.getDislikedIngredients() != null && !preferences.getDislikedIngredients().isEmpty()) {
            enhancedPrompt.append("\n- Nguyên liệu không thích: ")
                    .append(String.join(", ", preferences.getDislikedIngredients()));
        }

        // Thêm thông tin về mức độ cay
        enhancedPrompt.append("\n- Mức độ cay: ").append(preferences.getSpicePreference());

        return enhancedPrompt.toString();
    }

    /**
     * Lưu thông tin tương tác AI vào cơ sở dữ liệu
     */
    private void saveAiInteraction(Long userId,
            String input,
            String output,
            UserAiInteraction.AIType aiType,
            Integer tokensUsed,
            Integer executionTimeMs,
            Boolean success,
            String errorMessage,
            JsonNode metadata) {
        UserAiInteraction interaction = UserAiInteraction.builder()
                .userId(userId)
                .input(input)
                .output(output)
                .aiType(aiType)
                .tokensUsed(tokensUsed)
                .executionTimeMs(executionTimeMs)
                .costUsd(calculateCost(tokensUsed, aiType))
                .success(success)
                .errorMessage(errorMessage)
                .metadata(metadata)
                .createdAt(LocalDateTime.now())
                .build();

        aiInteractionRepository.save(interaction);
    }

    /**
     * Tính chi phí dựa trên số token và loại AI
     */
    private BigDecimal calculateCost(Integer tokensUsed, UserAiInteraction.AIType aiType) {
        if (tokensUsed == null || tokensUsed == 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal costPerToken;
        switch (aiType) {
            case GPT:
                costPerToken = new BigDecimal("0.00000075"); // $0.75 per 1M tokens
                break;
            case GEMINI:
                costPerToken = new BigDecimal("0.0000005"); // $0.50 per 1M tokens
                break;
            case VISION:
                costPerToken = new BigDecimal("0.000002"); // $2.00 per 1M tokens
                break;
            case VOICE:
                costPerToken = new BigDecimal("0.000006"); // $6.00 per 1M tokens
                break;
            default:
                costPerToken = new BigDecimal("0.000001"); // $1.00 per 1M tokens
        }

        return costPerToken.multiply(new BigDecimal(tokensUsed))
                .setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Tạo metadata cho tương tác AI
     */
    private JsonNode createMetadata(AiGenerationRequestDTO request, AiGenerationResponseDTO response) {
        ObjectNode metadata = objectMapper.createObjectNode();

        metadata.put("generationType", request.getGenerationType());
        metadata.put("aiModel", request.getAiModel());
        metadata.put("languageCode", request.getLanguageCode());
        metadata.put("includeDietaryRestrictions",
                request.getIncludeDietaryRestrictions() != null ? request.getIncludeDietaryRestrictions() : false);
        metadata.put("includePreferences",
                request.getIncludePreferences() != null ? request.getIncludePreferences() : false);
        metadata.put("maxTokens", request.getMaxTokens());

        if (request.getTemperature() != null) {
            metadata.put("temperature", request.getTemperature());
        }

        if (request.getParameters() != null) {
            metadata.set("requestParams", request.getParameters());
        }

        if (response != null && response.getStructuredData() != null) {
            metadata.set("responseData", response.getStructuredData());
        }

        return metadata;
    }

    /**
     * Mock AI response cho mục đích demo
     * Trong thực tế, phương thức này sẽ gọi đến dịch vụ AI thực tế
     */
    private AiGenerationResponseDTO mockAiResponse(AiGenerationRequestDTO request, String prompt) {
        // Giả lập độ trễ của API call
        try {
            Thread.sleep(ThreadLocalRandom.current().nextInt(500, 3000));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        String content;
        JsonNode structuredData = null;
        int tokens = ThreadLocalRandom.current().nextInt(50, 800);

        if (request.getGenerationType().equalsIgnoreCase("RECIPE")) {
            content = mockRecipeGeneration(prompt, request.getLanguageCode());
            structuredData = mockRecipeJson();
        } else if (request.getGenerationType().equalsIgnoreCase("MEAL_PLAN")) {
            content = mockMealPlanGeneration(prompt, request.getLanguageCode());
            structuredData = mockMealPlanJson();
        } else {
            content = "Đây là nội dung được tạo bởi AI dựa trên prompt của bạn: " + prompt;
        }

        return AiGenerationResponseDTO.builder()
                .content(content)
                .structuredData(structuredData)
                .tokensUsed(tokens)
                .processingTimeMs(0) // Sẽ được cập nhật sau
                .success(true)
                .aiConfidence(ThreadLocalRandom.current().nextFloat() * 0.2f + 0.8f) // 0.8-1.0
                .modelUsed(request.getAiModel())
                .build();
    }

    /**
     * Mock tạo công thức nấu ăn
     */
    private String mockRecipeGeneration(String prompt, String languageCode) {
        String lang = "vi".equals(languageCode) ? "vi" : "en";

        if ("vi".equals(lang)) {
            return "# Gỏi Cuốn Tôm Thịt\n\n" +
                    "## Nguyên liệu\n" +
                    "- 200g tôm sú\n" +
                    "- 150g thịt ba chỉ\n" +
                    "- 100g bún rice vermicelli\n" +
                    "- 1 củ carrot\n" +
                    "- 1 trái dưa leo\n" +
                    "- Rau sống (xà lách, rau thơm)\n" +
                    "- Bánh tráng rice paper\n\n" +
                    "## Cách làm\n\n" +
                    "1. Tôm luộc chín, bóc vỏ, chẻ đôi. Thịt ba chỉ luộc chín, thái lát mỏng.\n" +
                    "2. Bún ngâm nước ấm cho mềm, rửa lại bằng nước lạnh, để ráo.\n" +
                    "3. Rau xà lách nhặt rửa sạch, để ráo. Rau thơm nhặt lấy lá.\n" +
                    "4. Dưa leo rửa sạch, gọt vỏ, bỏ ruột, thái sợi. Cà rốt gọt vỏ, thái sợi.\n" +
                    "5. Làm ướt bánh tráng, đặt lên mặt phẳng.\n" +
                    "6. Xếp xà lách, bún, rau thơm, dưa leo, cà rốt, thịt, tôm lên trên.\n" +
                    "7. Gấp hai mép bánh tráng, cuốn tròn lại.\n" +
                    "8. Làm nước chấm từ tỏi, ớt, đường, nước cốt chanh, nước mắm.\n\n" +
                    "Món ăn thích hợp cho bữa nhẹ hoặc khai vị.";
        } else {
            return "# Vietnamese Spring Rolls with Shrimp and Pork\n\n" +
                    "## Ingredients\n" +
                    "- 200g large shrimp\n" +
                    "- 150g pork belly\n" +
                    "- 100g rice vermicelli noodles\n" +
                    "- 1 carrot\n" +
                    "- 1 cucumber\n" +
                    "- Fresh herbs (lettuce, mint, cilantro)\n" +
                    "- Rice paper wrappers\n\n" +
                    "## Instructions\n\n" +
                    "1. Boil the shrimp until cooked, peel and slice in half. Boil pork belly until cooked, then slice thinly.\n"
                    +
                    "2. Soak vermicelli in warm water until soft, rinse with cold water, drain well.\n" +
                    "3. Wash lettuce and herbs, pat dry.\n" +
                    "4. Clean cucumber, remove seeds, and slice into thin strips. Peel carrot and cut into thin strips.\n"
                    +
                    "5. Dip rice paper in water briefly to soften, lay on flat surface.\n" +
                    "6. Arrange lettuce, noodles, herbs, cucumber, carrot, pork and shrimp on top.\n" +
                    "7. Fold the sides of rice paper, then roll tightly.\n" +
                    "8. Make dipping sauce with garlic, chili, sugar, lime juice, and fish sauce.\n\n" +
                    "Perfect as an appetizer or light meal.";
        }
    }

    /**
     * Mock tạo kế hoạch bữa ăn
     */
    private String mockMealPlanGeneration(String prompt, String languageCode) {
        String lang = "vi".equals(languageCode) ? "vi" : "en";

        if ("vi".equals(lang)) {
            return "# Kế hoạch bữa ăn cho 3 ngày\n\n" +
                    "## Ngày 1\n" +
                    "- **Bữa sáng**: Bánh mì trứng với rau xanh\n" +
                    "- **Bữa trưa**: Cơm gà xối mỡ với rau luộc\n" +
                    "- **Bữa tối**: Canh chua cá lóc và đậu hủ kho\n\n" +
                    "## Ngày 2\n" +
                    "- **Bữa sáng**: Phở bò\n" +
                    "- **Bữa trưa**: Bún chả với nem rán\n" +
                    "- **Bữa tối**: Cá kho tộ với canh khổ qua\n\n" +
                    "## Ngày 3\n" +
                    "- **Bữa sáng**: Xôi gà\n" +
                    "- **Bữa trưa**: Bún bò Huế\n" +
                    "- **Bữa tối**: Lẩu hải sản";
        } else {
            return "# 3-Day Meal Plan\n\n" +
                    "## Day 1\n" +
                    "- **Breakfast**: Egg sandwich with greens\n" +
                    "- **Lunch**: Crispy fried chicken with rice and steamed vegetables\n" +
                    "- **Dinner**: Sour soup with fish and braised tofu\n\n" +
                    "## Day 2\n" +
                    "- **Breakfast**: Beef pho\n" +
                    "- **Lunch**: Bun cha with fried spring rolls\n" +
                    "- **Dinner**: Caramelized fish in clay pot with bitter melon soup\n\n" +
                    "## Day 3\n" +
                    "- **Breakfast**: Sticky rice with chicken\n" +
                    "- **Lunch**: Spicy beef noodle soup (Bun Bo Hue)\n" +
                    "- **Dinner**: Seafood hot pot";
        }
    }

    /**
     * Mock JSON cho công thức nấu ăn
     */
    private JsonNode mockRecipeJson() {
        try {
            String json = """
                    {
                      "name": "Gỏi Cuốn Tôm Thịt",
                      "nameEn": "Vietnamese Spring Rolls with Shrimp and Pork",
                      "description": "Món cuốn truyền thống Việt Nam với tôm, thịt và rau tươi",
                      "descriptionEn": "Traditional Vietnamese rolls with shrimp, pork, and fresh vegetables",
                      "cookingTime": 30,
                      "servings": 4,
                      "difficulty": "MEDIUM",
                      "ingredients": [
                        {
                          "name": "Tôm sú",
                          "nameEn": "Large shrimp",
                          "quantity": "200",
                          "unit": "g"
                        },
                        {
                          "name": "Thịt ba chỉ",
                          "nameEn": "Pork belly",
                          "quantity": "150",
                          "unit": "g"
                        },
                        {
                          "name": "Bún",
                          "nameEn": "Rice vermicelli",
                          "quantity": "100",
                          "unit": "g"
                        }
                      ],
                      "instructions": [
                        {
                          "stepNumber": 1,
                          "descriptionVi": "Tôm luộc chín, bóc vỏ, chẻ đôi. Thịt ba chỉ luộc chín, thái lát mỏng.",
                          "descriptionEn": "Boil shrimp until cooked, peel and slice in half. Boil pork belly and slice thinly."
                        },
                        {
                          "stepNumber": 2,
                          "descriptionVi": "Bún ngâm nước ấm cho mềm, rửa lại bằng nước lạnh, để ráo.",
                          "descriptionEn": "Soak vermicelli in warm water until soft, rinse with cold water, drain well."
                        }
                      ],
                      "nutrition": {
                        "calories": 320,
                        "protein": 18,
                        "carbs": 42,
                        "fat": 9,
                        "fiber": 3
                      }
                    }
                    """;
            return objectMapper.readTree(json);
        } catch (Exception e) {
            return objectMapper.createObjectNode();
        }
    }

    /**
     * Mock JSON cho kế hoạch bữa ăn
     */
    private JsonNode mockMealPlanJson() {
        try {
            String json = """
                    {
                      "mealPlan": {
                        "days": [
                          {
                            "date": "2025-08-08",
                            "meals": [
                              {
                                "mealType": "BREAKFAST",
                                "recipeName": "Bánh mì trứng",
                                "recipeNameEn": "Egg sandwich",
                                "recipeId": 1
                              },
                              {
                                "mealType": "LUNCH",
                                "recipeName": "Cơm gà xối mỡ",
                                "recipeNameEn": "Crispy fried chicken with rice",
                                "recipeId": 2
                              },
                              {
                                "mealType": "DINNER",
                                "recipeName": "Canh chua cá lóc",
                                "recipeNameEn": "Sour soup with fish",
                                "recipeId": 3
                              }
                            ]
                          },
                          {
                            "date": "2025-08-09",
                            "meals": [
                              {
                                "mealType": "BREAKFAST",
                                "recipeName": "Phở bò",
                                "recipeNameEn": "Beef pho",
                                "recipeId": 4
                              },
                              {
                                "mealType": "LUNCH",
                                "recipeName": "Bún chả",
                                "recipeNameEn": "Bun cha",
                                "recipeId": 5
                              },
                              {
                                "mealType": "DINNER",
                                "recipeName": "Cá kho tộ",
                                "recipeNameEn": "Caramelized fish in clay pot",
                                "recipeId": 6
                              }
                            ]
                          }
                        ]
                      },
                      "nutritionSummary": {
                        "averageCaloriesPerDay": 2100,
                        "averageProteinPerDay": 95,
                        "averageCarbsPerDay": 245,
                        "averageFatPerDay": 75
                      }
                    }
                    """;
            return objectMapper.readTree(json);
        } catch (Exception e) {
            return objectMapper.createObjectNode();
        }
    }
}
