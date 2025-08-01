package com.smartcooking.ai.controller;

import com.smartcooking.ai.dto.ApiResponse;
import com.smartcooking.ai.service.MessageService;
import com.smartcooking.ai.util.ApiResponseHelper;
import com.smartcooking.ai.util.LocaleUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.LocaleResolver;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Internationalization Controller for Smart Cooking AI
 * 
 * Handles language switching, locale information, and i18n demonstrations.
 */
@RestController
@RequestMapping("/api/i18n")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class InternationalizationController {

    private final MessageService messageService;
    private final ApiResponseHelper apiResponseHelper;
    private final LocaleResolver localeResolver;

    @Autowired
    public InternationalizationController(MessageService messageService,
            ApiResponseHelper apiResponseHelper,
            LocaleResolver localeResolver) {
        this.messageService = messageService;
        this.apiResponseHelper = apiResponseHelper;
        this.localeResolver = localeResolver;
    }

    /**
     * Change user's language preference
     * 
     * @param languageCode the new language code
     * @param request      HTTP request
     * @param response     HTTP response
     * @return API response with language change confirmation
     */
    @PostMapping("/language")
    public ApiResponse<Map<String, Object>> changeLanguage(
            @RequestParam String languageCode,
            HttpServletRequest request,
            HttpServletResponse response) {

        // Validate language code
        if (!LocaleUtils.isSupported(languageCode)) {
            return apiResponseHelper.error("locale.unsupported_language",
                    new Object[] { languageCode },
                    "UNSUPPORTED_LANGUAGE");
        }

        // Set the new locale
        Locale newLocale = LocaleUtils.toLocale(languageCode);
        localeResolver.setLocale(request, response, newLocale);

        // Prepare response data
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("previousLanguage", LocaleUtils.getCurrentLanguageCode());
        responseData.put("newLanguage", languageCode);
        responseData.put("languageDisplayName", LocaleUtils.getLanguageWithFlag(languageCode));

        return apiResponseHelper.languageChanged(languageCode);
    }

    /**
     * Get current locale information
     * 
     * @return current locale details
     */
    @GetMapping("/current")
    public ApiResponse<Map<String, Object>> getCurrentLocale() {
        Locale currentLocale = LocaleUtils.getCurrentLocale();

        Map<String, Object> localeInfo = new HashMap<>();
        localeInfo.put("languageCode", currentLocale.getLanguage());
        localeInfo.put("countryCode", currentLocale.getCountry());
        localeInfo.put("displayName", LocaleUtils.getDisplayName(currentLocale));
        localeInfo.put("nativeDisplayName", LocaleUtils.getNativeDisplayName(currentLocale));
        localeInfo.put("languageWithFlag", LocaleUtils.getLanguageWithFlag(currentLocale.getLanguage()));
        localeInfo.put("isRTL", LocaleUtils.isRTL(currentLocale));

        return apiResponseHelper.dataRetrieved(localeInfo);
    }

    /**
     * Get all supported languages
     * 
     * @return list of supported languages with details
     */
    @GetMapping("/supported")
    public ApiResponse<List<Map<String, Object>>> getSupportedLanguages() {
        List<Map<String, Object>> languages = LocaleUtils.getSupportedLanguageCodes().stream()
                .map(langCode -> {
                    Locale locale = LocaleUtils.toLocale(langCode);
                    Map<String, Object> langInfo = new HashMap<>();
                    langInfo.put("code", langCode);
                    langInfo.put("displayName", LocaleUtils.getDisplayName(locale));
                    langInfo.put("nativeDisplayName", LocaleUtils.getNativeDisplayName(locale));
                    langInfo.put("languageWithFlag", LocaleUtils.getLanguageWithFlag(langCode));
                    langInfo.put("isRTL", LocaleUtils.isRTL(locale));
                    return langInfo;
                })
                .toList();

        return apiResponseHelper.dataRetrieved(languages);
    }

    /**
     * Demo endpoint to show i18n messages
     * 
     * @return sample messages in current locale
     */
    @GetMapping("/demo")
    public ApiResponse<Map<String, Object>> getI18nDemo() {
        Map<String, Object> demoMessages = new HashMap<>();

        // Common messages
        demoMessages.put("common_success", messageService.getMessage("common.success"));
        demoMessages.put("common_error", messageService.getMessage("common.error"));
        demoMessages.put("common_created", messageService.getMessage("common.created"));

        // Success messages
        demoMessages.put("recipe_created", messageService.getMessage("success.recipe.created"));
        demoMessages.put("user_profile_updated", messageService.getMessage("success.user.profile_updated"));
        demoMessages.put("ai_recipe_generated", messageService.getMessage("success.ai.recipe_generated"));

        // Error messages with parameters
        demoMessages.put("recipe_not_found", messageService.getMessage("error.recipe.not_found", new Object[] { 123 }));
        demoMessages.put("user_email_exists",
                messageService.getMessage("error.user.email_exists", new Object[] { "test@example.com" }));

        // Validation messages
        demoMessages.put("validation_required",
                messageService.getMessage("validation.required", new Object[] { "email" }));
        demoMessages.put("validation_min_length",
                messageService.getMessage("validation.string.min_length", new Object[] { "password", 8 }));

        // Entity labels
        demoMessages.put("recipe_label", messageService.getMessage("entity.recipe"));
        demoMessages.put("user_label", messageService.getMessage("entity.user"));
        demoMessages.put("ingredient_label", messageService.getMessage("entity.ingredient"));

        // Current language info
        demoMessages.put("current_language", LocaleUtils.getCurrentLanguageCode());
        demoMessages.put("current_language_display",
                LocaleUtils.getLanguageWithFlag(LocaleUtils.getCurrentLanguageCode()));

        return apiResponseHelper.dataRetrieved(demoMessages);
    }

    /**
     * Get localized message by key
     * 
     * @param messageKey the message key
     * @param args       optional message parameters (comma-separated)
     * @return localized message
     */
    @GetMapping("/message")
    public ApiResponse<Map<String, Object>> getMessage(
            @RequestParam String messageKey,
            @RequestParam(required = false) String args) {

        String message;
        Object[] messageArgs = null;

        if (args != null && !args.trim().isEmpty()) {
            messageArgs = args.split(",");
            message = messageService.getMessage(messageKey, messageArgs);
        } else {
            message = messageService.getMessage(messageKey);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("messageKey", messageKey);
        result.put("message", message);
        result.put("language", LocaleUtils.getCurrentLanguageCode());
        result.put("parameters", messageArgs);

        return apiResponseHelper.dataRetrieved(result);
    }

    /**
     * Validate a language code
     * 
     * @param languageCode the language code to validate
     * @return validation result
     */
    @GetMapping("/validate/{languageCode}")
    public ApiResponse<Map<String, Object>> validateLanguage(@PathVariable String languageCode) {
        boolean isSupported = LocaleUtils.isSupported(languageCode);

        Map<String, Object> validation = new HashMap<>();
        validation.put("languageCode", languageCode);
        validation.put("isSupported", isSupported);
        validation.put("normalizedCode", LocaleUtils.normalizeLanguageCode(languageCode));

        if (isSupported) {
            validation.put("displayName", LocaleUtils.getDisplayName(languageCode));
            validation.put("languageWithFlag", LocaleUtils.getLanguageWithFlag(languageCode));
        }

        return apiResponseHelper.dataRetrieved(validation);
    }

    /**
     * Detect language from Accept-Language header
     * 
     * @param request HTTP request with Accept-Language header
     * @return detected language information
     */
    @GetMapping("/detect")
    public ApiResponse<Map<String, Object>> detectLanguage(HttpServletRequest request) {
        String acceptLanguageHeader = request.getHeader("Accept-Language");
        Locale detectedLocale = LocaleUtils.parseAcceptLanguage(acceptLanguageHeader);

        Map<String, Object> detection = new HashMap<>();
        detection.put("acceptLanguageHeader", acceptLanguageHeader);
        detection.put("detectedLanguage", detectedLocale.getLanguage());
        detection.put("detectedCountry", detectedLocale.getCountry());
        detection.put("isSupported", LocaleUtils.isSupported(detectedLocale));
        detection.put("languageWithFlag", LocaleUtils.getLanguageWithFlag(detectedLocale.getLanguage()));

        return apiResponseHelper.dataRetrieved(detection);
    }
}
