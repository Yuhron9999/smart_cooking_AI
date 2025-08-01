package com.smartcooking.ai.service;

import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.util.Locale;

/**
 * Service để xử lý internationalization messages
 */
@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageSource messageSource;

    /**
     * Lấy message theo key với locale hiện tại
     */
    public String getMessage(String key) {
        return messageSource.getMessage(key, null, LocaleContextHolder.getLocale());
    }

    /**
     * Lấy message theo key với parameters
     */
    public String getMessage(String key, Object... args) {
        return messageSource.getMessage(key, args, LocaleContextHolder.getLocale());
    }

    /**
     * Lấy message với locale cụ thể
     */
    public String getMessage(String key, Locale locale) {
        return messageSource.getMessage(key, null, locale);
    }

    /**
     * Lấy message với locale và parameters
     */
    public String getMessage(String key, Locale locale, Object... args) {
        return messageSource.getMessage(key, args, locale);
    }

    /**
     * Lấy message với default value
     */
    public String getMessageWithDefault(String key, String defaultMessage) {
        return messageSource.getMessage(key, null, defaultMessage, LocaleContextHolder.getLocale());
    }

    /**
     * Get user-friendly error message
     */
    public String getErrorMessage(String errorKey) {
        return getMessage("error." + errorKey);
    }

    /**
     * Get user-friendly success message
     */
    public String getSuccessMessage(String successKey) {
        return getMessage("success." + successKey);
    }

    /**
     * Get validation message
     */
    public String getValidationMessage(String validationKey, Object... args) {
        return getMessage("validation." + validationKey, args);
    }

    /**
     * Get entity label
     */
    public String getEntityLabel(String entityKey) {
        return getMessage("entity." + entityKey);
    }
}