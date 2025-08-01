package com.smartcooking.ai.util;

import com.smartcooking.ai.dto.ApiResponse;
import com.smartcooking.ai.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * API Response Helper with i18n Integration
 * 
 * Provides convenient methods to create standardized API responses
 * with internationalized messages for Smart Cooking AI.
 */
@Component
public class ApiResponseHelper {

    private final MessageService messageService;

    @Autowired
    public ApiResponseHelper(MessageService messageService) {
        this.messageService = messageService;
    }

    // Success responses

    /**
     * Create a success response with data and localized message
     * 
     * @param data       the response data
     * @param messageKey the message key for i18n
     * @param <T>        the data type
     * @return success ApiResponse with localized message
     */
    public <T> ApiResponse<T> success(T data, String messageKey) {
        String message = messageService.getMessage(messageKey);
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .message(message)
                .messageKey(messageKey)
                .language(LocaleUtils.getCurrentLanguageCode())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    /**
     * Create a success response with data, localized message, and parameters
     * 
     * @param data        the response data
     * @param messageKey  the message key for i18n
     * @param messageArgs the message parameters
     * @param <T>         the data type
     * @return success ApiResponse with localized message
     */
    public <T> ApiResponse<T> success(T data, String messageKey, Object[] messageArgs) {
        String message = messageService.getMessage(messageKey, messageArgs);
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .message(message)
                .messageKey(messageKey)
                .language(LocaleUtils.getCurrentLanguageCode())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    /**
     * Create a success response for recipe operations
     * 
     * @param data      the recipe data
     * @param operation the operation performed (e.g., "created", "updated",
     *                  "deleted")
     * @param <T>       the data type
     * @return success ApiResponse with recipe operation message
     */
    public <T> ApiResponse<T> recipeSuccess(T data, String operation) {
        return success(data, "success.recipe." + operation);
    }

    /**
     * Create a success response for user operations
     * 
     * @param data      the user data
     * @param operation the operation performed
     * @param <T>       the data type
     * @return success ApiResponse with user operation message
     */
    public <T> ApiResponse<T> userSuccess(T data, String operation) {
        return success(data, "success.user." + operation);
    }

    /**
     * Create a success response for AI operations
     * 
     * @param data      the AI response data
     * @param operation the AI operation performed
     * @param <T>       the data type
     * @return success ApiResponse with AI operation message
     */
    public <T> ApiResponse<T> aiSuccess(T data, String operation) {
        return success(data, "success.ai." + operation);
    }

    /**
     * Create a success response for learning operations
     * 
     * @param data      the learning data
     * @param operation the learning operation performed
     * @param <T>       the data type
     * @return success ApiResponse with learning operation message
     */
    public <T> ApiResponse<T> learningSuccess(T data, String operation) {
        return success(data, "success.learning." + operation);
    }

    // Error responses

    /**
     * Create an error response with localized message
     * 
     * @param messageKey the error message key
     * @param errorCode  the error code
     * @param <T>        the data type
     * @return error ApiResponse with localized message
     */
    public <T> ApiResponse<T> error(String messageKey, String errorCode) {
        String message = messageService.getMessage(messageKey);
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .messageKey(messageKey)
                .errorCode(errorCode)
                .language(LocaleUtils.getCurrentLanguageCode())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    /**
     * Create an error response with localized message and parameters
     * 
     * @param messageKey  the error message key
     * @param messageArgs the message parameters
     * @param errorCode   the error code
     * @param <T>         the data type
     * @return error ApiResponse with localized message
     */
    public <T> ApiResponse<T> error(String messageKey, Object[] messageArgs, String errorCode) {
        String message = messageService.getMessage(messageKey, messageArgs);
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .messageKey(messageKey)
                .errorCode(errorCode)
                .language(LocaleUtils.getCurrentLanguageCode())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    /**
     * Create a recipe not found error response
     * 
     * @param recipeId the recipe ID that was not found
     * @param <T>      the data type
     * @return error ApiResponse for recipe not found
     */
    public <T> ApiResponse<T> recipeNotFound(Long recipeId) {
        return error("error.recipe.not_found", new Object[] { recipeId }, "RECIPE_NOT_FOUND");
    }

    /**
     * Create a user not found error response
     * 
     * @param userId the user ID that was not found
     * @param <T>    the data type
     * @return error ApiResponse for user not found
     */
    public <T> ApiResponse<T> userNotFound(Long userId) {
        return error("error.user.not_found", new Object[] { userId }, "USER_NOT_FOUND");
    }

    /**
     * Create an authentication error response
     * 
     * @param errorType the auth error type ("invalid_token", "token_expired",
     *                  "insufficient_permissions")
     * @param <T>       the data type
     * @return error ApiResponse for authentication error
     */
    public <T> ApiResponse<T> authError(String errorType) {
        return error("error.auth." + errorType, "AUTH_" + errorType.toUpperCase());
    }

    /**
     * Create an AI service error response
     * 
     * @param errorType the AI error type ("service_unavailable",
     *                  "invalid_ingredients", "image_processing_failed")
     * @param <T>       the data type
     * @return error ApiResponse for AI service error
     */
    public <T> ApiResponse<T> aiError(String errorType) {
        return error("error.ai." + errorType, "AI_" + errorType.toUpperCase());
    }

    /**
     * Create a validation error response
     * 
     * @param validationType the validation type ("required", "email.invalid", etc.)
     * @param fieldName      the field name that failed validation
     * @param <T>            the data type
     * @return error ApiResponse for validation error
     */
    public <T> ApiResponse<T> validationError(String validationType, String fieldName) {
        return error("validation." + validationType, new Object[] { fieldName }, "VALIDATION_ERROR");
    }

    /**
     * Create a validation error response with additional parameters
     * 
     * @param validationType the validation type
     * @param args           validation message parameters
     * @param <T>            the data type
     * @return error ApiResponse for validation error
     */
    public <T> ApiResponse<T> validationError(String validationType, Object[] args) {
        return error("validation." + validationType, args, "VALIDATION_ERROR");
    }

    // Common responses

    /**
     * Create a not found error response
     * 
     * @param <T> the data type
     * @return error ApiResponse for not found
     */
    public <T> ApiResponse<T> notFound() {
        return error("common.not_found", "NOT_FOUND");
    }

    /**
     * Create an unauthorized error response
     * 
     * @param <T> the data type
     * @return error ApiResponse for unauthorized
     */
    public <T> ApiResponse<T> unauthorized() {
        return error("common.unauthorized", "UNAUTHORIZED");
    }

    /**
     * Create a forbidden error response
     * 
     * @param <T> the data type
     * @return error ApiResponse for forbidden
     */
    public <T> ApiResponse<T> forbidden() {
        return error("common.forbidden", "FORBIDDEN");
    }

    /**
     * Create an invalid request error response
     * 
     * @param <T> the data type
     * @return error ApiResponse for invalid request
     */
    public <T> ApiResponse<T> invalidRequest() {
        return error("common.invalid_request", "INVALID_REQUEST");
    }

    /**
     * Create a server error response
     * 
     * @param <T> the data type
     * @return error ApiResponse for server error
     */
    public <T> ApiResponse<T> serverError() {
        return error("common.server_error", "INTERNAL_SERVER_ERROR");
    }

    /**
     * Create a data retrieved success response
     * 
     * @param data the retrieved data
     * @param <T>  the data type
     * @return success ApiResponse for data retrieval
     */
    public <T> ApiResponse<T> dataRetrieved(T data) {
        return success(data, "api.data_retrieved");
    }

    /**
     * Create an operation completed success response
     * 
     * @param data the operation result data
     * @param <T>  the data type
     * @return success ApiResponse for operation completion
     */
    public <T> ApiResponse<T> operationCompleted(T data) {
        return success(data, "api.operation_completed");
    }

    /**
     * Create a language changed success response
     * 
     * @param languageCode the new language code
     * @param <T>          the data type
     * @return success ApiResponse for language change
     */
    public <T> ApiResponse<T> languageChanged(String languageCode) {
        String languageName = LocaleUtils.getLanguageWithFlag(languageCode);
        return success(null, "locale.language_changed", new Object[] { languageName });
    }
}
