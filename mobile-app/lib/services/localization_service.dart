class LocalizationService {
  static String tr(String key) {
    return key; // Simple return for now
  }

  static String trArgs(String key, List<String> args) {
    return key; // Simple return for now
  }

  static String trNamed(String key, Map<String, String> namedArgs) {
    return key; // Simple return for now
  }

  static String getCurrentLanguage() {
    return 'vi'; // Default language for now
  }

  static void changeLanguage(String languageCode) {
    // Implementation for changing language
  }
}
