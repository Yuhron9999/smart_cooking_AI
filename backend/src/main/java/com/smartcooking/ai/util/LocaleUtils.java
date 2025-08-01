package com.smartcooking.ai.util;

import org.springframework.context.i18n.LocaleContextHolder;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;

/**
 * Locale Utilities for Smart Cooking AI
 * 
 * Provides utility methods for locale handling, validation, and conversion
 * across the application.
 */
public class LocaleUtils {

    // Supported locales in Smart Cooking AI
    public static final List<String> SUPPORTED_LANGUAGE_CODES = Arrays.asList("vi", "en", "ja", "ko", "zh");

    public static final List<Locale> SUPPORTED_LOCALES = Arrays.asList(
            new Locale("vi", "VN"), // Vietnamese
            new Locale("en", "US"), // English
            new Locale("ja", "JP"), // Japanese
            new Locale("ko", "KR"), // Korean
            new Locale("zh", "CN") // Chinese
    );

    public static final Locale DEFAULT_LOCALE = new Locale("vi", "VN");

    /**
     * Get the current user's locale from the context
     * 
     * @return the current locale
     */
    public static Locale getCurrentLocale() {
        Locale currentLocale = LocaleContextHolder.getLocale();
        return isSupported(currentLocale) ? currentLocale : DEFAULT_LOCALE;
    }

    /**
     * Get the current user's language code
     * 
     * @return the current language code (e.g., "vi", "en")
     */
    public static String getCurrentLanguageCode() {
        return getCurrentLocale().getLanguage();
    }

    /**
     * Check if a locale is supported by the application
     * 
     * @param locale the locale to check
     * @return true if supported, false otherwise
     */
    public static boolean isSupported(Locale locale) {
        if (locale == null) {
            return false;
        }
        return SUPPORTED_LANGUAGE_CODES.contains(locale.getLanguage());
    }

    /**
     * Check if a language code is supported by the application
     * 
     * @param languageCode the language code to check
     * @return true if supported, false otherwise
     */
    public static boolean isSupported(String languageCode) {
        if (languageCode == null || languageCode.trim().isEmpty()) {
            return false;
        }
        return SUPPORTED_LANGUAGE_CODES.contains(languageCode.toLowerCase());
    }

    /**
     * Convert a language code to a Locale object
     * 
     * @param languageCode the language code (e.g., "vi", "en")
     * @return the corresponding Locale, or default if not supported
     */
    public static Locale toLocale(String languageCode) {
        if (!isSupported(languageCode)) {
            return DEFAULT_LOCALE;
        }

        switch (languageCode.toLowerCase()) {
            case "vi":
                return new Locale("vi", "VN");
            case "en":
                return new Locale("en", "US");
            case "ja":
                return new Locale("ja", "JP");
            case "ko":
                return new Locale("ko", "KR");
            case "zh":
                return new Locale("zh", "CN");
            default:
                return DEFAULT_LOCALE;
        }
    }

    /**
     * Get the display name of a locale in the current user's language
     * 
     * @param locale the locale to get the display name for
     * @return the localized display name
     */
    public static String getDisplayName(Locale locale) {
        if (locale == null) {
            return "Unknown";
        }
        return locale.getDisplayName(getCurrentLocale());
    }

    /**
     * Get the display name of a language code in the current user's language
     * 
     * @param languageCode the language code
     * @return the localized display name
     */
    public static String getDisplayName(String languageCode) {
        return getDisplayName(toLocale(languageCode));
    }

    /**
     * Get the native display name of a locale (in its own language)
     * 
     * @param locale the locale to get the native display name for
     * @return the native display name
     */
    public static String getNativeDisplayName(Locale locale) {
        if (locale == null) {
            return "Unknown";
        }
        return locale.getDisplayName(locale);
    }

    /**
     * Get the native display name of a language code (in its own language)
     * 
     * @param languageCode the language code
     * @return the native display name
     */
    public static String getNativeDisplayName(String languageCode) {
        return getNativeDisplayName(toLocale(languageCode));
    }

    /**
     * Get a user-friendly language name with flag emoji
     * 
     * @param languageCode the language code
     * @return the language name with flag emoji
     */
    public static String getLanguageWithFlag(String languageCode) {
        if (!isSupported(languageCode)) {
            return "🇻🇳 Tiếng Việt"; // Default
        }

        switch (languageCode.toLowerCase()) {
            case "vi":
                return "🇻🇳 Tiếng Việt";
            case "en":
                return "🇺🇸 English";
            case "ja":
                return "🇯🇵 日本語";
            case "ko":
                return "🇰🇷 한국어";
            case "zh":
                return "🇨🇳 中文";
            default:
                return "🇻🇳 Tiếng Việt";
        }
    }

    /**
     * Parse locale from Accept-Language header
     * 
     * @param acceptLanguageHeader the Accept-Language header value
     * @return the best matching supported locale, or default if none match
     */
    public static Locale parseAcceptLanguage(String acceptLanguageHeader) {
        if (acceptLanguageHeader == null || acceptLanguageHeader.trim().isEmpty()) {
            return DEFAULT_LOCALE;
        }

        String[] languages = acceptLanguageHeader.split(",");
        for (String language : languages) {
            // Parse language code (ignore quality values)
            String langCode = language.split(";")[0].trim();
            if (langCode.contains("-")) {
                langCode = langCode.split("-")[0]; // Extract main language code
            }

            if (isSupported(langCode)) {
                return toLocale(langCode);
            }
        }

        return DEFAULT_LOCALE;
    }

    /**
     * Validate and normalize a language code
     * 
     * @param languageCode the language code to validate
     * @return the normalized language code, or default if invalid
     */
    public static String normalizeLanguageCode(String languageCode) {
        if (!isSupported(languageCode)) {
            return DEFAULT_LOCALE.getLanguage();
        }
        return languageCode.toLowerCase();
    }

    /**
     * Check if the current locale is RTL (Right-to-Left)
     * Note: Currently no RTL languages are supported, but this method
     * is prepared for future expansion (Arabic, Persian, Hebrew, etc.)
     * 
     * @return true if current locale is RTL, false otherwise
     */
    public static boolean isCurrentLocaleRTL() {
        return isRTL(getCurrentLocale());
    }

    /**
     * Check if a locale is RTL (Right-to-Left)
     * 
     * @param locale the locale to check
     * @return true if RTL, false otherwise
     */
    public static boolean isRTL(Locale locale) {
        if (locale == null) {
            return false;
        }

        // RTL languages (none currently supported, but prepared for future)
        String[] rtlLanguages = { "ar", "fa", "he", "ur" };
        String langCode = locale.getLanguage();

        for (String rtl : rtlLanguages) {
            if (rtl.equals(langCode)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get all supported locales as a list
     * 
     * @return list of supported locales
     */
    public static List<Locale> getSupportedLocales() {
        return SUPPORTED_LOCALES;
    }

    /**
     * Get all supported language codes as a list
     * 
     * @return list of supported language codes
     */
    public static List<String> getSupportedLanguageCodes() {
        return SUPPORTED_LANGUAGE_CODES;
    }
}
